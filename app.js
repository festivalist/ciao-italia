/* ============================================================
   app.js — Ciao Italia
   ============================================================ */
(function () {
  "use strict";
  const D = window.IT_DATA;
  const PRON = D.meta.pronouns;
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

  /* ---------- Settings & storage ---------- */
  const LS = {
    get(k, def) { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; } },
    set(k, v)   { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} if (k !== "ciaoit_sync") scheduleSyncPush(); }
  };
  const settings = Object.assign({ speak: true, tripDate: null }, LS.get("ciaoit_settings", {}));
  const saveSettings = () => LS.set("ciaoit_settings", settings);

  /* ---------- Key / slug (muss zu AUDIO-MANIFEST.txt passen) ---------- */
  function slug(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }
  function fold(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  }
  const wordKey  = (catId, pt) => `word_${catId}_${slug(pt)}`;
  const deconKey = (i) => `decon_${i}`;
  const verbKey  = (inf, tense, i) => `verb_${slug(inf)}_${tense}_${i}`;

  /* ---------- Verbformen ---------- */
  function verbForms(verb, tense) {
    return verb[tense];
  }

  /* ---------- Audio: erst Datei (audio/<key>.mp3), sonst Sprachausgabe ---------- */
  const audioCache = {};
  let ttsVoice = null;
  function pickVoice() {
    const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    ttsVoice = vs.find(v => /it[-_]IT/i.test(v.lang)) || vs.find(v => /^it/i.test(v.lang)) || null;
  }
  if (window.speechSynthesis) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  function speak(text, key, rate) {
    if (!settings.speak) return;
    // 1) Versuche hinterlegte Audiodatei
    const url = `audio/${key}.mp3`;
    let a = audioCache[key];
    const tryFile = () => new Promise((res, rej) => {
      a = a || new Audio(url);
      audioCache[key] = a;
      a.onerror = () => rej();
      a.currentTime = 0;
      a.play().then(res).catch(rej);
    });
    tryFile().catch(() => {
      // 2) Fallback: Gerätesprachausgabe (it-IT); rate für Hör-Geschichten
      if (!window.speechSynthesis) return;
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "it-IT"; u.rate = rate || 0.9;
        if (ttsVoice) u.voice = ttsVoice;
        speechSynthesis.speak(u);
      } catch {}
    });
  }
  function hasAudioFlag(key) { return key in audioCache && !audioCache[key].error; }
  // Wie speak(), aber als Promise, das am Ende der Wiedergabe auflöst —
  // für Dialog-Ketten ohne überlappende Stimmen.
  function speakWait(text, key, rate) {
    return new Promise(resolve => {
      if (!settings.speak) return resolve();
      let settled = false;
      const done = () => { if (!settled) { settled = true; resolve(); } };
      const guard = setTimeout(done, Math.max(2600, (text.length * 170) / Math.max(0.5, rate || 0.9)));
      const finish = () => { clearTimeout(guard); done(); };
      const a = audioCache[key] || new Audio(`audio/${key}.mp3`);
      audioCache[key] = a;
      a.onended = finish;
      a.onerror = () => {
        if (!window.speechSynthesis) return finish();
        try {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = "it-IT"; u.rate = rate || 0.9;
          if (ttsVoice) u.voice = ttsVoice;
          u.onend = finish;
          speechSynthesis.cancel();
          speechSynthesis.speak(u);
        } catch { finish(); }
      };
      a.currentTime = 0;
      a.play().catch(() => a.onerror());
    });
  }

  /* ---------- Flatten vocab pool ---------- */
  const POOL = [];
  D.categories.forEach(cat => cat.items.forEach(it => {
    POOL.push({ key: wordKey(cat.id, it.key || it.it), pt: it.it, de: it.de, cat: cat.id });
  }));

  /* ---------- Leitner SRS ---------- */
  const DAY = 86400000;
  const INTERVALS = [0, 1, 2, 4, 7, 14, 30, 60]; // Box 1..8 → Tage bis fällig (langfristig)
  function srs() { return LS.get("ciaoit_srs", {}); }
  function srsSave(s) { LS.set("ciaoit_srs", s); }
  function dueCount() {
    const s = srs(), now = Date.now();
    return POOL.filter(p => { const r = s[p.key]; return !r || r.due <= now; }).length;
  }
  function learnedCount() {
    const s = srs();
    return Object.values(s).filter(r => r.box >= 5).length;
  }
  // quiet = wahr: zählt NICHT aufs Tagesziel (z. B. die 6 stillen
  // Formen-Bewertungen des Konjugations-Rituals, das selbst 1× zählt)
  function grade(key, knew, quiet) {
    const s = srs();
    const r = s[key] || { box: 1 };
    r.box = knew ? Math.min(INTERVALS.length, (r.box || 1) + 1) : 1;
    r.due = Date.now() + INTERVALS[r.box - 1] * DAY;
    s[key] = r; srsSave(s);
    if (!quiet) markPractice(1);
  }
  /* ---------- Streak & Tagesziel (reise-bewusst, läuft danach weiter) ---------- */
  const DAILY_GOAL = 15; // Übungen pro Tag
  function ymd(d) {
    d = d || new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function daysApart(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / DAY); }
  function streak() { return LS.get("ciaoit_streak", { last: null, count: 0, freezes: 2, day: null, todayCount: 0, best: 0, restWeek: null }); }
  // Wird nach jeder abgeschlossenen Übung aufgerufen (n = Anzahl Items)
  function markPractice(n) {
    const s = streak(); const today = ymd();
    if (s.day !== today) { s.day = today; s.todayCount = 0; }
    s.todayCount += (n || 1);
    if (s.last !== today) {
      if (!s.last) s.count = 1;
      else {
        const gap = daysApart(s.last, today);
        if (gap === 1) s.count += 1;
        else if (gap === 2 && s.freezes > 0) { s.freezes -= 1; s.count += 1; } // ein Tag verpasst → Freeze
        else if (gap === 2 && s.restWeek !== isoWeekKey()) { s.restWeek = isoWeekKey(); s.count += 1; } // 1 Pausentag pro Woche
        else s.count = 1;
      }
      s.last = today;
      s.best = Math.max(s.best || 0, s.count);
    }
    LS.set("ciaoit_streak", s);
  }
  function goalToday() { const s = streak(); return s.day === ymd() ? s.todayCount : 0; }

  /* ---------- XP, Badges & Story-Fortschritt ---------- */
  function xpState() { return LS.get("ciaoit_xp", { xp: 0, badges: [] }); }
  function addXP(n) { const x = xpState(); x.xp += n; LS.set("ciaoit_xp", x); }
  function storyState() { return LS.get("ciaoit_stories", {}); }
  function storyDone(id) { const st = storyState()[id]; return !!(st && st.done); }

  /* ---------- Output & Können („Was du gesagt hast", nicht Zeit) ---------- */
  function isoWeekKey(d) {
    d = d || new Date();
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - day);
    const start = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - start) / DAY) + 1)).padStart(2, "0")}`;
  }
  function output() { return LS.get("ciaoit_output", { total: 0, week: null }); }
  function bumpOutput(kind, n) {
    const o = output(); o.total += (n || 1);
    const wk = isoWeekKey();
    if (!o.week || o.week.start !== wk) o.week = { start: wk, satze: 0, missionen: 0, memos: 0, diario: 0 };
    o.week[kind] = (o.week[kind] || 0) + (n || 1);
    LS.set("ciaoit_output", o);
  }
  function skills() { return LS.get("ciaoit_skills", { hoeren: 0, lesen: 0, sprechen: 0, schreiben: 0 }); }
  function bumpSkill(kind, n) { const s = skills(); s[kind] += (n || 1); LS.set("ciaoit_skills", s); }

  /* ---------- Sprachtagebuch (Sette giorni, sette frasi) ---------- */
  function diario() { return LS.get("ciaoit_diario", []); }
  function diarioAdd(text) {
    const d = diario();
    const entry = { d: ymd(), t: text };
    d.push(entry); LS.set("ciaoit_diario", d);
    bumpOutput("diario"); bumpSkill("schreiben"); markPractice(1); addXP(20);
    return entry;
  }

  /* ---------- Sprachmemos (IndexedDB; Audio-Blobs) ---------- */
  const MEMODB = (() => {
    let p = null;
    function open() {
      if (p) return p;
      p = new Promise((res, rej) => {
        const rq = indexedDB.open("ciaoit", 1);
        rq.onupgradeneeded = () => rq.result.createObjectStore("memos");
        rq.onsuccess = () => res(rq.result);
        rq.onerror = () => rej(rq.error);
        rq.onblocked = () => rej(new Error("Datenbank blockiert (anderer Tab?)"));
        setTimeout(() => rej(new Error("Datenbank-Zugriff zeitüberschritten")), 3000);
      });
      return p;
    }
    async function tx(mode, fn) {
      const db = await open();
      return new Promise((res, rej) => {
        const t = db.transaction("memos", mode);
        const out = fn(t.objectStore("memos"));
        t.oncomplete = () => res(out.result);
        t.onerror = () => rej(t.error);
      });
    }
    return {
      put: (key, blob) => tx("readwrite", s => s.put({ blob, when: Date.now() }, key)),
      get: (key) => tx("readonly", s => s.get(key)),
      keys: () => tx("readonly", s => s.getAllKeys()),
      entries: () => open().then(db => new Promise((res, rej) => {
        const t = db.transaction("memos", "readonly");
        const st = t.objectStore("memos");
        const keysR = st.getAllKeys();
        const valsR = st.getAll();
        t.oncomplete = () => res(keysR.result.map((k, i) => ({ key: k, val: valsR.result[i] })));
        t.onerror = () => rej(t.error);
      }))
    };
  })();
  const canRecord = !!(navigator.mediaDevices && window.MediaRecorder);
  async function saveMemo(key, blob) {
    await MEMODB.put(key, blob);
    bumpOutput("memos"); bumpSkill("sprechen"); markPractice(1); addXP(15);
  }

  /* ---------- Sincronizzazione: Fortschritt auf dem Server ----------
     Local-first: alles bleibt lokal (offline nutzbar), Änderungen
     werden nach X Sek. automatisch per sync.php gesichert; beim Start
     wird ein neuerer Server-Stand geholt. Konfliktregel: letzter
     Schreiber gewinnt (gesamtes Datenpaket, savedAt-Zeitstempel). */
  const SYNC_KEYS = ["ciaoit_settings", "ciaoit_srs", "ciaoit_streak", "ciaoit_xp",
    "ciaoit_stories", "ciaoit_missions", "ciaoit_check", "ciaoit_output",
    "ciaoit_skills", "ciaoit_diario", "ciaoit_espresso", "ciaoit_conj"];
  function syncState() { return LS.get("ciaoit_sync", { savedAt: 0, lastPush: null, lastPull: null }); }
  function bufToB64(buf) {
    let s = ""; const b = new Uint8Array(buf);
    for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function b64ToBlob(b64, type) {
    const s = atob(b64); const u = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    return new Blob([u], { type: type || "audio/webm" });
  }
  let syncTimer = null;
  function scheduleSyncPush() {
    if (!settings.syncCode || !navigator.onLine) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => { syncPush(false).catch(() => {}); }, 8000);
  }
  // Schutz: ein fast leerer Lokalzustand darf einen gefüllten Server-Stand
  // nicht überschreiben (z. B. nach „Website-Daten löschen“ mit rest-Timer).
  function localProgressEmpty() {
    const xp = xpState(), stories = storyState(), s = srs();
    return (!xp.xp || xp.xp <= 0) && Object.keys(stories).length === 0 && Object.keys(s).length === 0;
  }
  async function syncPush(manual) {
    const code = settings.syncCode;
    if (!code) return { ok: false, error: "Kein Sync-Code gesetzt." };
    if (localProgressEmpty()) {
      if (!manual) return { ok: false, skipped: true }; // Auto-Push: leer überschreibt nichts
      if (!window.confirm("Lokal ist kaum Fortschritt vorhanden. Der vorhandene Server-Stand würde überschrieben. Trotzdem sichern?")) {
        return { ok: false, skipped: true };
      }
    }
    const blob = { savedAt: Date.now(), data: {}, memos: {} };
    SYNC_KEYS.forEach(k => { const raw = localStorage.getItem(k); if (raw != null) blob.data[k] = raw; });
    try {
      const entries = await MEMODB.entries();
      for (const e of entries) blob.memos[e.key] = { when: e.val.when, type: e.val.blob.type, b64: bufToB64(await e.val.blob.arrayBuffer()) };
      if (JSON.stringify(blob).length > 5500000) blob.memos = {}; // Notbremse: Memos zu groß → nur Fortschritt
    } catch {}
    const res = await fetch("sync.php?action=save", {
      method: "POST",
      headers: { "X-Sync-Code": code, "Content-Type": "application/json" },
      body: JSON.stringify(blob)
    });
    const j = await res.json().catch(() => ({ ok: false, error: "Server-Antwort ungültig." }));
    if (j.ok) { const s = syncState(); s.lastPush = Date.now(); LS.set("ciaoit_sync", s); }
    return j;
  }
  async function syncPull(force) {
    const code = settings.syncCode;
    if (!code) return { ok: false, error: "Kein Sync-Code gesetzt." };
    const res = await fetch("sync.php?action=load", { headers: { "X-Sync-Code": code } });
    if (res.status === 404) return { ok: false, empty: true };
    const j = await res.json().catch(() => ({ ok: false, error: "Server-Antwort ungültig." }));
    if (!j.ok || !j.blob) return j;
    if (!force && (j.blob.savedAt || 0) <= (syncState().savedAt || 0)) return { ok: true, newer: false };
    Object.entries(j.blob.data || {}).forEach(([k, v]) => {
      if (SYNC_KEYS.includes(k) && k !== "ciaoit_settings") localStorage.setItem(k, v);
    });
    // Einstellungen übernehmen, aber eigenen Sync-Code nie auslöschen
    if (j.blob.data && j.blob.data.ciaoit_settings) {
      try {
        const srv = JSON.parse(j.blob.data.ciaoit_settings);
        const mine = settings.syncCode;
        const merged = Object.assign({}, srv, { syncCode: mine || srv.syncCode || null });
        localStorage.setItem("ciaoit_settings", JSON.stringify(merged));
      } catch {}
    }
    try {
      for (const [key, m] of Object.entries(j.blob.memos || {})) {
        await MEMODB.put(key, b64ToBlob(m.b64, m.type));
      }
    } catch {}
    const s = syncState(); s.savedAt = j.blob.savedAt || Date.now(); s.lastPull = Date.now(); LS.set("ciaoit_sync", s);
    return { ok: true, applied: true };
  }

  // Beherrschung je Kategorie (für die Fortschrittsanzeige)
  function masteryByCat() {
    const s = srs(); const out = {};
    D.categories.forEach(cat => {
      const keys = cat.items.map(it => wordKey(cat.id, it.key || it.it));
      const known = keys.filter(k => s[k] && s[k].box >= 4).length;
      out[cat.id] = { known, total: keys.length };
    });
    return out;
  }

  function srsDot(key) {
    const r = srs()[key];
    const d = el("span", "srs-dot" + (r && r.box >= 4 ? " ripe" : r ? " half" : ""));
    d.title = r ? "Lernstufe " + r.box + " von 8" : "noch nicht gelernt";
    return d;
  }

  function buildDeck() {
    const s = srs(), now = Date.now();
    const due = [], fresh = [], later = [];
    POOL.forEach(p => {
      const r = s[p.key];
      if (!r) fresh.push(p);
      else if (r.due <= now) due.push(p);
      else later.push(p);
    });
    shuffle(due); shuffle(fresh);
    return due.concat(fresh).concat(later).slice(0, 40);
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    let t = $(".toast"); if (!t) { t = el("div", "toast"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1600);
  }

  /* ============================================================
     VIEWS
     ============================================================ */
  const view = $("#view");
  function render(html) { view.innerHTML = ""; view.appendChild(html); view.focus(); window.scrollTo(0, 0); }
  function playBtn(text, key) {
    const b = el("button", "play", "🔊");
    b.title = "Anhören"; b.setAttribute("aria-label", "Anhören");
    b.addEventListener("click", e => { e.stopPropagation(); speak(text, key); });
    return b;
  }

  /* ---------- HOME ---------- */
  function viewHome() {
    const wrap = el("div");
    const hero = el("div", "hero");
    hero.appendChild(el("div", "hero-kicker", "IL TUO VIAGGIO INIZIA QUI"));
    hero.appendChild(el("h1", null, "Ciao, Italia!"));
    hero.appendChild(el("p", null, "Italienisch für die Reise — Grundwortschatz, Verben und echte Alltagssätze nach dem Prinzip der kleinsten wirksamen Dosis."));
    const doneAny = STORIES.some(s => storyDone(s.id));
    if (!doneAny) {
      hero.appendChild(el("p", "hero-bonus", "🚀 6 Minuten bis zu deinem ersten Espresso auf Italienisch — Story 1 ist startklar."));
    } else {
      const doneN = STORIES.filter(s => storyDone(s.id) && s.level === "A1").length;
      hero.appendChild(el("p", "hero-bonus", `📈 Kapitel-Fortschritt: ${doneN} von 50 A1-Lektionen — jede schaltet eine echte Aufgabe frei.`));
    }
    const cd = el("button", "countdown");
    cd.style.border = "0"; cd.style.cursor = "pointer";
    cd.textContent = tripText();
    cd.addEventListener("click", setTrip);
    hero.appendChild(cd);
    wrap.appendChild(hero);
    wrap.appendChild(el("div", "wave"));

    const stats = el("div", "stat-grid");
    stats.appendChild(stat(POOL.length, "Wörter"));
    stats.appendChild(stat(D.verbs.length, "Verben"));
    stats.appendChild(stat(dueCount(), "fällig"));
    wrap.appendChild(stats);

    const xps = xpState();
    const storiesDone = STORIES.filter(s => storyDone(s.id)).length;
    const badgeIcons = xps.badges.map(id => { const st = STORIES.find(s => s.id === id); return st ? st.icon : ""; }).join(" ");
    wrap.appendChild(el("p", "xp-line home", `⭐ ${xps.xp} XP · 🏅 ${storiesDone}/${STORIES.length} Stories${badgeIcons ? "  " + badgeIcons : ""}`));

    // Streak + Tagesziel
    const stk = streak(); const todayN = goalToday();
    const sc = el("div", "streak-card");
    sc.appendChild(el("div", "streak-flame", todayN > 0 || stk.count > 0 ? "🔥" : "💤"));
    const sinfo = el("div", "streak-info grow");
    sinfo.appendChild(el("div", "streak-num", `${stk.count} ${stk.count === 1 ? "Tag" : "Tage"} am Stück · Rekord ${stk.best || 0}`));
    sinfo.appendChild(el("div", "streak-sub", `Heute ${Math.min(todayN, DAILY_GOAL)}/${DAILY_GOAL} Übungen${stk.freezes ? ` · ❄️ ${stk.freezes}` : ""} · 1 Pausentag/Woche inklusive`));
    sc.appendChild(sinfo);
    const ring = el("div", "goal-ring"); ring.style.setProperty("--p", Math.min(100, Math.round(todayN / DAILY_GOAL * 100)));
    ring.appendChild(el("span", null, todayN >= DAILY_GOAL ? "✓" : String(Math.max(0, DAILY_GOAL - todayN))));
    sc.appendChild(ring);
    wrap.appendChild(sc);

    // Weiter mit der nächsten Story
    const nextStory = STORIES.find(s => !storyDone(s.id));
    if (nextStory) {
      const nr = STORIES.indexOf(nextStory) + 1;
      const cta = el("button", "story-cta");
      cta.appendChild(el("span", "sci", nextStory.icon));
      const cg = el("div", "grow");
      cg.appendChild(el("div", null, `Weiter mit Story ${nr}: ${nextStory.title}`));
      cg.appendChild(el("div", "story-cta-sub", `${nextStory.words.length} neue Wörter · ca. 6 Minuten`));
      cta.appendChild(cg);
      cta.appendChild(el("span", "story-go", "▶"));
      cta.addEventListener("click", () => startStory(nextStory));
      wrap.appendChild(cta);
    }

    // Espresso del giorno: genau eine kurze Challenge — danach Ruhe
    const esp = espressoPick();
    if (esp) {
      const espDone = espressoDone(esp);
      const eCard = el("button", "story-cta espresso");
      eCard.appendChild(el("span", "sci", "☕"));
      const eg = el("div", "grow");
      eg.appendChild(el("div", null, espDone ? "Espresso getrunken — per oggi basta!" : `Espresso del giorno: ${esp.title}`));
      eg.appendChild(el("div", "story-cta-sub", espDone ? "Buona giornata — morgen gibt es den nächsten." : "Die heutige Kurz-Challenge (ca. 3 Minuten) — mehr brauchst du heute nicht."));
      eCard.appendChild(eg);
      eCard.appendChild(el("span", "story-go", espDone ? "✓" : "▶"));
      if (!espDone) eCard.addEventListener("click", () => startStory(esp));
      wrap.appendChild(eCard);
    }

    // Nächste reale Mission (Piazza-Schleife)
    const nm = nextRealMission();
    if (nm) {
      const mCard = el("button", "story-cta mission");
      mCard.appendChild(el("span", "sci", "🎯"));
      const mg = el("div", "grow");
      mg.appendChild(el("div", null, `Echte Aufgabe: ${nm.mission.title}`));
      mg.appendChild(el("div", "story-cta-sub", `Sag es laut, draußen oder schreib es — aus „${nm.story.title}“`));
      mCard.appendChild(mg);
      mCard.appendChild(el("span", "story-go", "▶"));
      mCard.addEventListener("click", () => viewMissione(nm.story));
      wrap.appendChild(mCard);
    }

    // Wochenbilanz: Können statt Zeit
    const ow = output();
    const wkv = (ow.week && ow.week.start === isoWeekKey()) ? ow.week : { satze: 0, missionen: 0, memos: 0, diario: 0 };
    const bilanz = el("button", "bilanz");
    bilanz.innerHTML = `📊 Diese Woche: <b>${(wkv.satze || 0) + (wkv.diario || 0)}</b> Sätze produziert · <b>${wkv.missionen || 0}</b> Missionen · <b>${wkv.memos || 0}</b> Memos — Passaporto öffnen`;
    bilanz.addEventListener("click", () => go("passaporto"));
    wrap.appendChild(bilanz);

    // Fortschritt je Kategorie (Azulejo-Kacheln füllen sich)
    const m = masteryByCat();
    wrap.appendChild(el("div", "section-h", "Fortschritt"));
    const tiles = el("div", "mastery");
    D.categories.forEach(cat => {
      const t = el("div", "mtile");
      const pct = cat.items.length ? Math.round((m[cat.id].known / m[cat.id].total) * 100) : 0;
      t.style.setProperty("--f", pct);
      t.setAttribute("title", `${cat.title}: ${m[cat.id].known}/${m[cat.id].total}`);
      t.appendChild(el("span", "mico", cat.icon));
      t.addEventListener("click", () => viewCategory(cat));
      tiles.appendChild(t);
    });
    wrap.appendChild(tiles);

    wrap.appendChild(el("div", "section-h", "Loslegen"));
    const start = el("button", "btn btn-telha", "🎯 Allenamento starten");
    start.addEventListener("click", () => go("train"));
    wrap.appendChild(start);

    const menu = el("div", "btn-row"); menu.style.marginTop = "10px";
    const b1 = el("button", "btn btn-ghost", "🗂️ Parole");
    b1.addEventListener("click", () => go("vocab"));
    const b2 = el("button", "btn btn-ghost", "🔤 Verbi");
    b2.addEventListener("click", () => go("verbs"));
    const b3 = el("button", "btn btn-ghost", "✎ Sapere");
    b3.addEventListener("click", () => go("sapere"));
    menu.appendChild(b1); menu.appendChild(b2); menu.appendChild(b3);
    wrap.appendChild(menu);

    wrap.appendChild(el("div", "section-h", "Schlüssel-Sätze (Ferriss)"));
    wrap.appendChild(el("p", "view-sub", "Sechs Sätze, die fast die ganze Grammatik offenlegen — erst verstehen, dann Wortschatz."));
    const dc = el("div", "card");
    D.deconstruction.forEach((s, i) => {
      const d = el("div", "decon");
      const head = el("div", "head");
      head.appendChild(playBtn(s.it, deconKey(i)));
      head.appendChild(el("span", "pt", s.it));
      d.appendChild(head);
      d.appendChild(el("div", "de", s.de));
      d.appendChild(el("div", "reveals", s.reveals));
      dc.appendChild(d);
    });
    wrap.appendChild(dc);
    render(wrap);
  }
  function stat(num, lab) { const s = el("div", "stat"); s.appendChild(el("div", "num", String(num))); s.appendChild(el("div", "lab", lab)); return s; }
  function tripText() {
    if (!settings.tripDate) return "✈️ Reisedatum festlegen";
    const [year, month, day] = settings.tripDate.split("-").map(Number);
    const trip = new Date(year, month - 1, day);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const days = Math.round((trip - today) / DAY);
    if (days > 1) return `✈️ Noch ${days} Tage bis Italien`;
    if (days === 1) return "✈️ Morgen geht's los!";
    if (days === 0) return "✈️ Buon viaggio — heute!";
    return "🌴 Reise vorbei — dranbleiben!";
  }
  function setTrip() {
    const cur = settings.tripDate || "";
    const v = window.prompt("Reisedatum (JJJJ-MM-TT):", cur);
    if (v === null) return;
    settings.tripDate = v.trim() || null; saveSettings(); viewHome();
  }

  /* ---------- VOCAB ---------- */
  function viewVocab() {
    let levelFilter = null;
    const wrap = el("div");
    wrap.appendChild(el("h2", "view-title", "Parole"));
    wrap.appendChild(el("p", "view-sub", `${POOL.length} Wörter und Ausdrücke in ${D.categories.length} Kategorien — filterbar nach Level. Suche auf Italienisch oder Deutsch.`));
    const search = el("input", "search-input");
    search.type = "search";
    search.placeholder = "Wort oder Übersetzung suchen …";
    search.setAttribute("aria-label", "Wortschatz durchsuchen");
    wrap.appendChild(search);
    const host = el("div"); wrap.appendChild(host);

    function draw(query) {
      host.innerHTML = "";
      const q = fold(query).trim();
      if (!q) {
        const chips = el("div", "tabs");
        [["Alle", null], ["A1", "A1"], ["A2", "A2"], ["B1", "B1"]].forEach(([label, lv]) => {
          const c = el("button", "chip" + (levelFilter === lv ? " active" : ""), label);
          c.addEventListener("click", () => { levelFilter = lv; draw(search.value); });
          chips.appendChild(c);
        });
        host.appendChild(chips);
        const mm = masteryByCat();
        const grid = el("div", "grid");
        D.categories.filter(cat => !levelFilter || (cat.level || "A1") === levelFilter).forEach(cat => {
          const t = el("button", "cat-tile");
          t.appendChild(el("span", "emoji", cat.icon));
          t.appendChild(el("span", "name", cat.title));
          t.appendChild(el("span", "count", `${cat.items.length} Wörter · ${mm[cat.id].known} gereift`));
          const bar = el("div", "tile-bar");
          const fill = el("div");
          fill.style.width = `${mm[cat.id].total ? Math.round((mm[cat.id].known / mm[cat.id].total) * 100) : 0}%`;
          bar.appendChild(fill);
          t.appendChild(bar);
          t.appendChild(el("span", "lv " + (cat.level || "A1"), cat.level || "A1"));
          t.addEventListener("click", () => viewCategory(cat));
          grid.appendChild(t);
        });
        host.appendChild(grid);
        return;
      }

      const matches = [];
      D.categories.forEach(cat => cat.items.forEach(it => {
        if (fold(`${it.it} ${it.de}`).includes(q)) matches.push({ cat, it });
      }));
      host.appendChild(el("div", "search-count", `${matches.length} ${matches.length === 1 ? "Treffer" : "Treffer"}`));
      if (!matches.length) { host.appendChild(el("div", "empty", "Kein passendes Wort gefunden.")); return; }
      const card = el("div", "card");
      matches.slice(0, 100).forEach(({ cat, it }) => {
        const key = wordKey(cat.id, it.key || it.it);
        const row = el("div", "row");
        row.appendChild(playBtn(it.it, key));
        const g = el("div", "grow");
        g.appendChild(el("div", "pt", it.it));
        g.appendChild(el("div", "de", `${it.de} · ${cat.title}`));
        row.appendChild(g);
        row.appendChild(srsDot(key));
        row.addEventListener("click", () => speak(it.it, key));
        card.appendChild(row);
      });
      host.appendChild(card);
      if (matches.length > 100) host.appendChild(el("div", "search-count", "Bitte Suche weiter eingrenzen."));
    }
    search.addEventListener("input", () => draw(search.value));
    render(wrap);
    draw("");
  }
  function viewCategory(cat) {
    const wrap = el("div");
    const back = el("button", "back", "‹ Parole");
    back.addEventListener("click", viewVocab);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", `${cat.icon} ${cat.title}`));
    const mm = masteryByCat()[cat.id];
    wrap.appendChild(el("p", "view-sub", `${cat.items.length} Wörter · ${mm.known} gereift · Level ${cat.level || "A1"}`));
    const practice = el("button", "btn btn-telha", "🃏 Diese Kategorie üben");
    practice.addEventListener("click", () => runFlash(deckFrom(POOL.filter(p => p.cat === cat.id), cat.items.length), "‹ Parole", viewVocab));
    wrap.appendChild(practice);
    const storyLink = STORIES.find(s => (s.covers || []).includes(cat.id));
    if (storyLink) {
      const sb = el("button", "btn btn-ghost", `📚 Lernen im Kontext: „${storyLink.title}“ ▶`);
      sb.style.marginTop = "10px";
      sb.addEventListener("click", () => startStory(storyLink));
      wrap.appendChild(sb);
    }
    const card = el("div", "card"); card.style.marginTop = "12px";
    cat.items.forEach(it => {
      const key = wordKey(cat.id, it.key || it.it);
      const row = el("div", "row");
      row.appendChild(playBtn(it.it, key));
      const g = el("div", "grow");
      g.appendChild(el("div", "pt", it.it));
      g.appendChild(el("div", "de", it.de));
      row.appendChild(g);
      row.appendChild(srsDot(key));
      row.addEventListener("click", () => speak(it.it, key));
      card.appendChild(row);
    });
    wrap.appendChild(card);
    render(wrap);
  }

  /* ---------- VERBS ---------- */
  function viewVerbs() {
    const wrap = el("div");
    wrap.appendChild(el("h2", "view-title", "Verbi"));
    wrap.appendChild(el("p", "view-sub", `${D.verbs.length} häufige Verben in Presente, Passato prossimo und Futuro semplice.`));
    const search = el("input", "search-input");
    search.type = "search";
    search.placeholder = "Verb oder Bedeutung suchen …";
    search.setAttribute("aria-label", "Verben durchsuchen");
    wrap.appendChild(search);
    const card = el("div", "card");
    function draw(query) {
      card.innerHTML = "";
      const q = fold(query).trim();
      D.verbs.filter(v => !q || fold(`${v.inf} ${v.de}`).includes(q)).forEach(v => {
        const row = el("div", "row");
        const g = el("div", "grow");
        g.appendChild(el("div", "pt", v.inf));
        g.appendChild(el("div", "de", v.de));
        row.appendChild(g);
        row.appendChild(el("span", "play", "›"));
        row.addEventListener("click", () => viewVerb(v));
        card.appendChild(row);
      });
      if (!card.children.length) card.appendChild(el("div", "empty", "Kein passendes Verb gefunden."));
    }
    search.addEventListener("input", () => draw(search.value));
    wrap.appendChild(card);
    render(wrap);
    draw("");
  }
  function viewVerb(v) {
    const wrap = el("div");
    const back = el("button", "back", "‹ Verbi");
    back.addEventListener("click", viewVerbs);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", v.inf));
    wrap.appendChild(el("p", "view-sub", v.de));

    const tabs = el("div", "tabs");
    const body = el("div", "card");
    const note = el("p", "tense-note");
    let active = "presente";
    function draw() {
      body.innerHTML = "";
      const forms = verbForms(v, active);
      forms.forEach((f, i) => {
        if (!f) return;
        const r = el("div", "conj-row");
        r.appendChild(el("span", "pron", PRON[i]));
        const form = el("span", "form");
        form.appendChild(el("span", null, f));
        form.appendChild(playBtn(f, verbKey(v.inf, active, i)));
        r.appendChild(form);
        body.appendChild(r);
      });
      const tenseHelp = active === "futuro"
        ? "Das Futuro semplice drückt Zukünftiges oder Vermutungen aus, z. B. mangerò = ich werde essen."
        : active === "passato"
          ? "Das Passato prossimo besteht aus avere oder essere plus Partizip, z. B. ho mangiato = ich habe gegessen."
          : "Gegenwart.";
      note.textContent = v.note ? `${tenseHelp} ${v.note}` : tenseHelp;
      [...tabs.children].forEach(c => c.classList.toggle("active", c.dataset.t === active));
    }
    D.meta.tenses.forEach(t => {
      const c = el("button", "chip", t.label); c.dataset.t = t.id;
      c.addEventListener("click", () => { active = t.id; draw(); });
      tabs.appendChild(c);
    });
    wrap.appendChild(tabs); wrap.appendChild(body); wrap.appendChild(note);
    render(wrap); draw();
  }

  /* ---------- TRAIN: Menü ---------- */
  function viewTrain() {
    const wrap = el("div");
    wrap.appendChild(el("h2", "view-title", "Allenamento"));
    wrap.appendChild(el("p", "view-sub", `${dueCount()} Karten fällig · ${learnedCount()} gut gelernt`));

    const mk = (cls, label, fn, sub) => {
      const b = el("button", "btn " + cls, label); b.addEventListener("click", fn);
      const w = el("div", "mode-item"); w.appendChild(b);
      if (sub) w.appendChild(el("div", "mode-sub", sub));
      return w;
    };
    wrap.appendChild(mk("btn-telha", "🎲 Misch-Training", startMix, "Empfohlen: wählen, hören, Lücke füllen, Satz bauen — alles gemischt."));
    wrap.appendChild(mk("btn-primary", "🧩 Satzbau (Kacheln)", startTiles, "Wörter in die richtige Reihenfolge tippen."));
    wrap.appendChild(mk("btn-ghost", "🃏 Karteikarten (Wörter)", startFlash));
    wrap.appendChild(mk("btn-ghost", "🗣️ Satz-Drill (DE → IT)", startSentenceDrill, "Pimsleur: erst selbst sagen, dann auflösen."));
    wrap.appendChild(mk("btn-ghost", "🔁 Zeitform-Flip", startTenseFlip, "Derselbe Satz in Presente, Passato prossimo und Futuro semplice."));
    const vdue = verbDueCount();
    wrap.appendChild(mk("btn-ghost", "✏️ Verbformen (Tippen)", startVerbDrill, `${vdue} Form${vdue === 1 ? "" : "en"} fällig · Konjugationen selbst schreiben.`));
    wrap.appendChild(mk("btn-ghost", "🎙️ Shadowing", startShadow, "Hören und laut nachsprechen."));
    wrap.appendChild(mk("btn-ghost", "💬 Redewendungen (Modi di dire)", viewFrasi, "Feste Wendungen lesen, hören und wiederholen."));

    wrap.appendChild(mk("btn-ghost", "🎧 Hör-Geschichten (Orecchie)", viewOrecchie, "Graded Input: kurz hören, Satz für Satz verstehen."));

    wrap.appendChild(el("div", "section-h", "Warum das wirkt"));
    wrap.appendChild(el("p", "view-sub", "Aktives Abrufen schlägt passives Wiederholen — und gemischte Aufgabentypen wirken am stärksten. Die Wiederholung (Leitner) reicht jetzt bis zwei Monate, damit es auch nach der Reise sitzt."));
    render(wrap);
  }

  /* ---------- Flashcards ---------- */
  function startFlash() {
    const deck = buildDeck();
    if (!deck.length) { toast("Alles wiederholt — boa! 🎉"); return; }
    runFlash(deck);
  }
  // Deck von außen (z. B. kategoriegeffiltert) — gleicher Ablauf,
  // aber mit passendem Zurück-Button.
  function runFlash(deck, backLabel, backFn) {
    if (!deck.length) { toast("Nichts zu üben in dieser Auswahl."); return; }
    let i = 0, flipped = false;
    const wrap = el("div");
    const back = el("button", "back", backLabel || "‹ Allenamento");
    // Antworten sind pro Karte sofort gespeichert — beim vorzeitigen Beenden
    // bestätigen, damit klar ist, dass nichts verloren geht.
    back.addEventListener("click", () => {
      if (i > 0) toast(`✓ ${i} ${i === 1 ? "Antwort" : "Antworten"} gespeichert — Fortschritt bleibt.`);
      (backFn || viewTrain)();
    });
    wrap.appendChild(back);

    const fw = el("div", "flash-wrap");
    const prog = el("div", "flash-progress");
    const flip = el("div", "flip");
    const inner = el("div", "flip-inner");
    const front = el("div", "flip-face flip-front");
    const frontBig = el("div", "big");
    front.appendChild(frontBig);
    front.appendChild(el("div", "hint", "Tippen zum Umdrehen"));
    const back2 = el("div", "flip-face flip-back");
    const backBig = el("div", "big"); const backSub = el("div", "sub");
    back2.appendChild(backBig); back2.appendChild(backSub);
    inner.appendChild(front); inner.appendChild(back2); flip.appendChild(inner);

    const grades = el("div", "grade-row");
    const again = el("button", "btn btn-ghost", "↻ Nochmal");
    const knew  = el("button", "btn btn-primary", "✓ Wusste ich");
    grades.appendChild(again); grades.appendChild(knew);

    fw.appendChild(prog); fw.appendChild(flip); fw.appendChild(grades);
    wrap.appendChild(fw);

    function load() {
      if (i >= deck.length) {
        fw.innerHTML = "";
        const done = el("div", "empty", `<div style="font-size:40px">🎉</div><p>${deck.length} Karten geübt. Molto bene!</p><p>✓ Jede Antwort war sofort gespeichert.</p>`);
        const again2 = el("button", "btn btn-primary", "Nochmal");
        again2.addEventListener("click", () => runFlash(deck));
        fw.appendChild(done); fw.appendChild(again2);
        return;
      }
      flipped = false; flip.classList.remove("flipped");
      const c = deck[i];
      prog.innerHTML = `<span>Karte ${i + 1} / ${deck.length}</span><span>IT → DE</span>`;
      frontBig.textContent = c.pt;
      backBig.textContent = c.de; backSub.textContent = c.pt;
      speak(c.pt, c.key);
    }
    flip.addEventListener("click", () => { flipped = !flipped; flip.classList.toggle("flipped", flipped); if (flipped) speak(deck[i].pt, deck[i].key); });
    again.addEventListener("click", () => { grade(deck[i].key, false); i++; load(); });
    knew.addEventListener("click", () => { grade(deck[i].key, true); i++; load(); });
    render(wrap); load();
  }

  /* ============================================================
     SATZ-ENGINE (Bedeutung kuratiert, Morphologie generiert)
     ============================================================ */
  const S = window.IT_SENT;
  const verbByInf = {}; D.verbs.forEach(v => verbByInf[v.inf] = v);
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Italienischer Satz für ein SVO-Item, Person i (0-4), Zeit
  function itSentence(item, i, tense) {
    const v = verbByInf[item.verb];
    const verbPart = v[tense][i];
    const subj = S.subjects.it[i];
    return { subj, verb: verbPart, obj: item.itObj, full: `${subj} ${verbPart} ${item.obj || item.itObj}.` };
  }
  // Deutscher Satz (Abfrageseite)
  function deSentence(item, i, tense) {
    const dv = S.deVerbs[item.verb];
    const subj = S.subjects.de[i];
    let s;
    if (tense === "presente") s = `${subj} ${dv.praes[i]} ${item.deObj}`;
    else if (tense === "futuro") s = `${subj} ${S.werden[i]} ${item.deObj} ${dv.inf}`;
    else if (dv.praet) s = `${subj} ${dv.praet[i]} ${item.deObj}`;
    else s = `${subj} ${S.habenPraes[i]} ${item.deObj} ${dv.part}`;
    return cap(s) + ".";
  }
  const sentKey = (item, i, tense) => `sent_${item.id}_${tense}_${i}`;

  // Voller Satz-Pool (14 Muster × 5 Personen × 3 Zeiten = 210)
  const TENSES = ["presente", "passato", "futuro"];
  const SENT_POOL = [];
  S.svo.forEach(item => TENSES.forEach(t => S.subjects.it.forEach((_, i) => {
    const it = itSentence(item, i, t);
    SENT_POOL.push({ key: sentKey(item, i, t), pt: it.full, de: deSentence(item, i, t), tense: t, parts: it });
  })));
  const TENSE_META = {
    presente: { label: "Presente", color: "var(--verde)", de: "Gegenwart" },
    passato:  { label: "Passato", color: "var(--telha)", de: "Vergangenheit" },
    futuro:   { label: "Futuro", color: "var(--oro)", de: "Zukunft" }
  };
  function tenseBadge(t) {
    const m = TENSE_META[t];
    const b = el("span", "tbadge", m.label); b.style.background = m.color; return b;
  }
  // Generischer Deck-Builder (due-first) für beliebigen Pool
  function deckFrom(pool, n) {
    const s = srs(), now = Date.now();
    const due = [], fresh = [], later = [];
    pool.forEach(p => { const r = s[p.key]; if (!r) fresh.push(p); else if (r.due <= now) due.push(p); else later.push(p); });
    return shuffle(due).concat(shuffle(fresh)).concat(later).slice(0, n);
  }

  /* ---------- Modus: Satz-Drill (Pimsleur-Stil) ---------- */
  function startSentenceDrill() {
    const deck = deckFrom(DRILL_SENT, 24);
    let i = 0;
    const wrap = el("div");
    const back = el("button", "back", "‹ Allenamento"); back.addEventListener("click", viewTrain);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", "Satz-Drill"));
    wrap.appendChild(el("p", "view-sub", "Lies den deutschen Satz, sag ihn laut auf Italienisch — dann auflösen."));
    const host = el("div"); wrap.appendChild(host);
    render(wrap);

    function step() {
      if (i >= deck.length) { host.innerHTML = ""; finish(host, deck.length, startSentenceDrill, viewTrain); return; }
      const c = deck[i];
      host.innerHTML = "";
      host.appendChild(el("div", "flash-progress", `<span>Satz ${i + 1} / ${deck.length}</span><span></span>`));
      const card = el("div", "drill-card");
      if (c.tense) card.appendChild(tenseBadge(c.tense));
      card.appendChild(el("div", "drill-de", c.de));
      const reveal = el("div", "drill-pt hidden");
      const pp = el("span", null, c.pt);
      const pb = playBtn(c.pt, c.key);
      reveal.appendChild(pp); reveal.appendChild(pb);
      card.appendChild(reveal);
      host.appendChild(card);

      const show = el("button", "btn btn-primary", "👁️ Lösung & anhören");
      const grades = el("div", "grade-row hidden");
      const again = el("button", "btn btn-ghost", "↻ Nochmal");
      const knew = el("button", "btn btn-primary", "✓ Wusste ich");
      grades.appendChild(again); grades.appendChild(knew);

      show.addEventListener("click", () => {
        reveal.classList.remove("hidden");
        show.classList.add("hidden");
        grades.classList.remove("hidden");
        speak(c.pt, c.key);
      });
      again.addEventListener("click", () => { grade(c.key, false); i++; step(); });
      knew.addEventListener("click", () => { grade(c.key, true); i++; step(); });
      host.appendChild(show); host.appendChild(grades);
    }
    step();
  }

  /* ---------- Modus: Zeitform-Flip (minimal pairs) ---------- */
  function startTenseFlip() {
    const items = shuffle(S.svo.slice());
    let idx = 0;
    const wrap = el("div");
    const back = el("button", "back", "‹ Allenamento"); back.addEventListener("click", viewTrain);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", "Zeitform-Flip"));
    wrap.appendChild(el("p", "view-sub", "Derselbe Satz, nur die Zeit ändert sich. Forme ihn um, bevor du tippst."));
    const host = el("div"); wrap.appendChild(host);
    render(wrap);

    function step() {
      if (idx >= items.length) { host.innerHTML = ""; finish(host, items.length, startTenseFlip, viewTrain); return; }
      const item = items[idx];
      const person = (Math.random() * S.subjects.it.length) | 0;
      let shown = 1; // wie viele Zeiten aufgedeckt
      host.innerHTML = "";
      host.appendChild(el("div", "flash-progress", `<span>Satz ${idx + 1} / ${items.length}</span><span>${S.subjects.it[person]} · ${S.subjects.de[person]}</span>`));
      const stack = el("div", "flip-stack"); host.appendChild(stack);

      function rowFor(t) {
        const p = itSentence(item, person, t);
        const row = el("div", "tline");
        row.appendChild(tenseBadge(t));
        const txt = el("div", "tline-txt");
        txt.innerHTML = `${p.subj} <b class="hl">${p.verb}</b> ${item.itObj}.`;
        const de = el("div", "tline-de", deSentence(item, person, t));
        const col = el("div", "grow"); col.appendChild(txt); col.appendChild(de);
        row.appendChild(col);
        row.appendChild(playBtn(p.full, sentKey(item, person, t)));
        return row;
      }
      function draw() {
        stack.innerHTML = "";
        for (let k = 0; k < shown; k++) stack.appendChild(rowFor(TENSES[k]));
      }
      draw();
      speak(itSentence(item, person, "presente").full, sentKey(item, person, "presente"));

      const next = el("button", "btn btn-telha", "→ … in der Vergangenheit");
      next.addEventListener("click", () => {
        if (shown < 3) {
          shown++; draw();
          speak(itSentence(item, person, TENSES[shown - 1]).full, sentKey(item, person, TENSES[shown - 1]));
          next.textContent = shown === 2 ? "→ … als Zukunft" : "Nächster Satz ›";
          if (shown === 3) next.className = "btn btn-primary";
        } else { markPractice(1); idx++; step(); }
      });
      host.appendChild(next);
    }
    step();
  }

  function finish(host, n, again, home) {
    host.appendChild(el("div", "empty", `<div style="font-size:40px">🎉</div><p>${n} geübt. Molto bene!</p>`));
    const a = el("button", "btn btn-primary", "Nochmal"); a.addEventListener("click", again);
    const h = el("button", "btn btn-ghost", "Zurück"); h.style.marginTop = "10px"; h.addEventListener("click", home);
    host.appendChild(a); host.appendChild(h);
  }

  /* ============================================================
     Modus: Verbformen tippen (Konjugations-SRS, due-first)
     Das Tages-Ritual bewertet alle 6 Formen still ins Leitner-SRS;
     dieser Drill macht sie wieder fällig — aufgefüllt mit frischen
     Formen aus der Rotation (Zufallsperson je Verb).
     ============================================================ */
  const VERBS_BY_SLUG = verbsBySlugMap(D.verbs);
  function verbDueCount() {
    const s = srs(), now = Date.now();
    return Object.keys(s).filter(k => k.indexOf("verb_") === 0 && s[k].due <= now).length;
  }
  function buildVerbDeck(n) {
    const s = srs(), now = Date.now();
    const due = [];
    Object.keys(s).forEach(k => {
      if (k.indexOf("verb_") !== 0) return;
      const e = verbKeyParse(k, VERBS_BY_SLUG);
      if (e && e.v[e.tense][e.person] && s[k].due <= now) due.push({ v: e.v, tense: e.tense, person: e.person, key: k });
    });
    due.sort((a, b) => s[a.key].due - s[b.key].due);
    const deck = due.slice(0, n);
    if (deck.length < n) {
      // frische Formen aus der Rotation auffüllen (ab dem kommenden Ritual-Verb)
      const seen = new Set(deck.map(e => e.key));
      const st = conjState(), len = CONJ_QUEUE.length;
      for (let off = 1; deck.length < n && off <= len; off++) {
        const item = CONJ_QUEUE[(st.qi + off) % len];
        const person = (Math.random() * 6) | 0;
        if (!item.v[item.tense][person]) continue;
        const key = verbKey(item.v.inf, item.tense, person);
        if (seen.has(key) || s[key]) continue; // schon drin oder schon gelernt
        seen.add(key);
        deck.push({ v: item.v, tense: item.tense, person, key });
      }
    }
    return deck;
  }
  function startVerbDrill() {
    const deck = buildVerbDeck(10);
    if (!deck.length) { toast("Keine Formen verfügbar."); return; }
    let i = 0, correct = 0;
    const wrap = el("div");
    const back = el("button", "back", "‹ Allenamento"); back.addEventListener("click", viewTrain);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", "Verbformen"));
    wrap.appendChild(el("p", "view-sub", "Tippe die passende Form — Akzente, Groß-/Kleinschreibung und Gender-Formen sind egal."));
    const host = el("div"); wrap.appendChild(host);
    render(wrap);

    function step() {
      if (i >= deck.length) { host.innerHTML = ""; finish(host, deck.length, startVerbDrill, viewTrain); return; }
      const e = deck[i];
      const expected = e.v[e.tense][e.person];
      host.innerHTML = "";
      host.appendChild(el("div", "flash-progress", `<span>Form ${i + 1} / ${deck.length}</span><span>${correct} richtig</span>`));
      const card = el("div", "drill-card");
      card.appendChild(tenseBadge(e.tense));
      card.appendChild(el("div", "conj-verb", e.v.inf));
      card.appendChild(el("div", "conj-de", `${e.v.de} — ${conjTenseLabel(e.tense)}`));
      card.appendChild(el("div", "conj-person", PRON[e.person]));
      const input = el("input", "conj-input");
      input.type = "text"; input.autocapitalize = "off"; input.autocomplete = "off"; input.spellcheck = false;
      input.setAttribute("aria-label", "Verbform für die angezeigte Person eingeben");
      const feedback = el("div", "conj-feedback");
      const checkBtn = el("button", "btn btn-primary", "Prüfen");
      card.appendChild(input); card.appendChild(feedback); card.appendChild(checkBtn);
      host.appendChild(card);
      let advancing = false;
      function check() {
        if (advancing) return;
        if (conjAccept(expected, input.value)) {
          advancing = true; correct++;
          grade(e.key, true);
          input.disabled = true; input.className = "conj-input ok";
          feedback.className = "conj-feedback ok";
          feedback.appendChild(el("span", null, "✓ giusto"));
          feedback.appendChild(playBtn(expected, e.key));
          speak(expected, e.key);
          checkBtn.disabled = true;
          setTimeout(() => { i++; step(); }, 900);
        } else {
          advancing = true;
          grade(e.key, false);
          input.disabled = true; input.className = "conj-input bad";
          feedback.className = "conj-feedback bad";
          feedback.appendChild(el("span", null, "Richtig: "));
          const shown = el("span", "conj-solution");
          shown.appendChild(el("span", null, expected));
          shown.appendChild(playBtn(expected, e.key));
          feedback.appendChild(shown);
          checkBtn.textContent = "Weiter";
          checkBtn.focus();
        }
      }
      function onCheck() { if (input.disabled) { i++; step(); } else check(); }
      checkBtn.addEventListener("click", onCheck);
      input.addEventListener("keydown", ev => { if (ev.key === "Enter") { ev.preventDefault(); onCheck(); } });
      input.focus();
    }
    step();
  }

  /* ============================================================
     ÜBUNGS-FORMATE: Misch-Training, Satzbau (Kacheln), Shadowing
     (gemischte Formate = stärkster Lerneffekt)
     ============================================================ */
  // Verneinung & Frage (Präsens) aus den svo-Bausteinen
  function negIT(it, i) { return `${S.subjects.it[i]} non ${verbByInf[it.verb].presente[i]} ${it.itObjNeg || it.itObj}.`; }
  function negDE(it, i) { return cap(`${S.subjects.de[i]} ${S.deVerbs[it.verb].praes[i]} ${it.deObjNeg}`) + "."; }
  function qIT(it, i)  { return `${S.subjects.it[i]} ${verbByInf[it.verb].presente[i]} ${it.itObj}?`; }
  function qDE(it, i)  { return cap(`${S.deVerbs[it.verb].praes[i]} ${S.subjects.de[i]} ${it.deObj}`) + "?"; }

  // Satzquelle mit Feldern für Cloze/Tiles
  function mkSent(key, pt, de, blank) {
    const tail = /[.?!]$/.test(pt) ? pt.slice(-1) : "";
    const core = tail ? pt.slice(0, -1) : pt;
    return { key, pt, de, src: "sent", blank, tail, core, tokens: core.split(" ") };
  }
  const ALL_SENT = [];
  S.svo.forEach(item => {
    TENSES.forEach(t => S.subjects.it.forEach((_, i) => {
      const p = itSentence(item, i, t);
      ALL_SENT.push(mkSent(sentKey(item, i, t), p.full, deSentence(item, i, t), p.verb));
    }));
    S.subjects.it.forEach((_, i) => {
      ALL_SENT.push(mkSent(`neg_${item.id}_${i}`, negIT(item, i), negDE(item, i), verbByInf[item.verb].presente[i]));
      ALL_SENT.push(mkSent(`q_${item.id}_${i}`, qIT(item, i), qDE(item, i), verbByInf[item.verb].presente[i]));
    });
  });
  const WORD_SRC = POOL.map(p => ({ key: p.key, pt: p.pt, de: p.de, src: "word" }));

  // Story-Sätze als zusätzliche Drill-Quelle — gleiche SRS-Schlüssel wie im
  // Story-Player, damit Fortschritt in beide Richtungen zählt. Duplikate
  // (Sätze, die in mehreren Stories vorkommen) bleiben nur einmal drin.
  const STORY_SENT_POOL = (() => {
    const seen = new Set(); const out = [];
    (window.IT_STORIES || []).forEach(st => (st.sentences || []).forEach((sn, i) => {
      const norm = sn.it.trim().toLocaleLowerCase();
      if (seen.has(norm)) return;
      seen.add(norm);
      out.push(mkSent("story_" + st.id + "_sent_" + i, sn.it, sn.de));
    }));
    return out;
  })();
  const DRILL_SENT = ALL_SENT.concat(STORY_SENT_POOL);

  // Wort-Pool für Satzbau-Ablenker im Training (aus allen Drillsätzen)
  const DRILL_WORD_POOL = (() => {
    const set = new Set();
    DRILL_SENT.forEach(s => s.tokens.forEach(t => { if (t.length > 2) set.add(t); }));
    return [...set];
  })();

  // alle Verbformen für Cloze-Distraktoren
  const ALL_FORMS = (() => {
    const set = new Set();
    D.verbs.forEach(v => {
      v.presente.forEach(f => { if (f) set.add(f); });
      v.passato.forEach(f => { if (f) set.add(f); });
      v.futuro.forEach(f => { if (f) set.add(f); });
    });
    return [...set];
  })();
  function sampleVals(arr, n, exclude) { const p = arr.filter(x => x !== exclude); shuffle(p); return p.slice(0, n); }
  function sampleObjs(arr, n, exKey)  { const p = arr.filter(x => x.key !== exKey); shuffle(p); return p.slice(0, n); }

  // erzeugt aus einer Quelle eine Übung (Typ zufällig → Formatmischung)
  function makeExercise(s) {
    if (s.src === "word") {
      const options = shuffle([s.de, ...sampleObjs(WORD_SRC, 3, s.key).map(x => x.de)]);
      return Math.random() < 0.5
        ? { type: "mc", key: s.key, prompt: s.pt, options, answer: s.de }
        : { type: "listen", key: s.key, audioText: s.pt, options, answer: s.de };
    }
    const r = Math.random();
    if (r < 0.4 && s.blank) {
      const options = shuffle([s.blank, ...sampleVals(ALL_FORMS, 3, s.blank)]);
      return { type: "cloze", key: s.key, full: s.pt, blank: s.blank, de: s.de, options, answer: s.blank };
    }
    if (r < 0.8 || !s.blank) {
      const d = withDistractors(s.tokens, DRILL_WORD_POOL, 0, 4);
      return { type: "tiles", key: s.key, pt: s.pt, de: s.de, tokens: d.tokens, answer: d.answer };
    }
    const options = shuffle([s.de, ...sampleObjs(DRILL_SENT, 3, s.key).map(x => x.de)]);
    return { type: "listen", key: s.key, audioText: s.pt, options, answer: s.de };
  }

  function runSession(title, sub, exercises, backFn, backLabel) {
    let i = 0, correct = 0;
    const wrap = el("div");
    const back = el("button", "back", backLabel || "‹ Allenamento"); back.addEventListener("click", backFn || viewTrain); wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", title));
    if (sub) wrap.appendChild(el("p", "view-sub", sub));
    const bar = el("div", "progbar"); const fill = el("div", "progfill"); bar.appendChild(fill); wrap.appendChild(bar);
    const host = el("div"); wrap.appendChild(host);
    render(wrap);
    function advance(ok) { if (ok) correct++; i++; step(); }
    function step() {
      fill.style.width = `${(i / exercises.length) * 100}%`;
      if (i >= exercises.length) {
        host.innerHTML = "";
        const pct = exercises.length ? Math.round(correct / exercises.length * 100) : 0;
        host.appendChild(el("div", "empty", `<div style="font-size:40px">${pct >= 70 ? "🌟" : "💪"}</div><p>${correct} / ${exercises.length} richtig</p>`));
        const a = el("button", "btn btn-primary", "Nochmal"); a.addEventListener("click", () => runSession(title, sub, exercises.map(reroll), backFn));
        const b = el("button", "btn btn-ghost", "Zurück"); b.style.marginTop = "10px"; b.addEventListener("click", () => (backFn || viewTrain)());
        host.appendChild(a); host.appendChild(b);
        return;
      }
      host.innerHTML = "";
      host.appendChild(el("div", "flash-progress", `<span>${i + 1} / ${exercises.length}</span><span>${correct} richtig</span>`));
      renderExercise(host, exercises[i], advance);
    }
    step();
  }
  function reroll(ex) {
    // Antwortoptionen neu mischen; Kachel-Pools (Lösung + Ablenker) bleiben wie generiert
    if (ex.options) ex.options = shuffle(ex.options.slice());
    return ex;
  }

  function renderExercise(host, ex, done) {
    if (ex.type === "tiles") return renderTiles(host, ex, done);
    if (ex.type === "cloze") return renderCloze(host, ex, done);
    return renderChoice(host, ex, done); // mc + listen
  }

  function markChoice(optWrap, chosen, answer) {
    [...optWrap.querySelectorAll(".opt")].forEach(x => x.disabled = true);
    const ok = chosen === answer;
    [...optWrap.querySelectorAll(".opt")].forEach(x => {
      if (x.textContent === answer) x.classList.add("correct");
      else if (x.textContent === chosen) x.classList.add("wrong");
    });
    return ok;
  }
  function renderChoice(host, ex, done) {
    const card = el("div", "drill-card");
    if (ex.type === "listen") {
      card.appendChild(el("div", "listen-instr", "Hör zu und wähle die Bedeutung"));
      const big = el("button", "listen-btn", "🔊"); big.addEventListener("click", () => speak(ex.audioText, ex.key));
      card.appendChild(big); speak(ex.audioText, ex.key);
    } else {
      const big = el("div", "drill-de"); big.textContent = ex.prompt; card.appendChild(big);
      const pw = el("div"); pw.style.textAlign = "center"; pw.appendChild(playBtn(ex.prompt, ex.key)); card.appendChild(pw);
    }
    host.appendChild(card);
    const optWrap = el("div");
    ex.options.forEach(o => {
      const b = el("button", "opt", o);
      b.addEventListener("click", () => { const ok = markChoice(optWrap, o, ex.answer); grade(ex.key, ok); setTimeout(() => done(ok), 850); });
      optWrap.appendChild(b);
    });
    host.appendChild(optWrap);
  }
  function renderCloze(host, ex, done) {
    const card = el("div", "drill-card");
    card.appendChild(el("div", "cloze-de", ex.de));
    const line = el("div", "cloze-sentence"); line.textContent = ex.full.replace(ex.blank, "_____"); card.appendChild(line);
    host.appendChild(card);
    const optWrap = el("div");
    ex.options.forEach(o => {
      const b = el("button", "opt", o);
      b.addEventListener("click", () => {
        const ok = markChoice(optWrap, o, ex.answer);
        line.textContent = ex.full; speak(ex.full, ex.key); grade(ex.key, ok);
        setTimeout(() => done(ok), 1000);
      });
      optWrap.appendChild(b);
    });
    host.appendChild(optWrap);
  }
  // Ablenker-Wörter für Kachel-Übungen: zufällig viele (minN…maxN), begrenzt
  // durch Kandidaten und Satzlänge — Abwechslung statt fester zwei Ablenker.
  function withDistractors(target, pool, minN, maxN) {
    const cand = [];
    (pool || []).forEach(t => { if (t.length > 2 && !target.includes(t) && !cand.includes(t)) cand.push(t); });
    const cap = Math.min(maxN, cand.length, target.length);
    if (cap <= 0) return { tokens: target.slice(), answer: target.slice() };
    const n = Math.min(cap, minN + Math.floor(Math.random() * (maxN - minN + 1)));
    return { tokens: target.concat(shuffle(cand.slice()).slice(0, n)), answer: target.slice() };
  }

  function renderTiles(host, ex, done) {
    const card = el("div", "drill-card");
    card.appendChild(el("div", "tiles-de", ex.de));
    const answer = el("div", "tiles-answer"); const bank = el("div", "tiles-bank");
    card.appendChild(answer); card.appendChild(bank); host.appendChild(card);
    // ex.answer = Lösungsreihenfolge; ohne Ablenker ist es ex.tokens selbst
    const expected = ex.answer || ex.tokens;
    let chosen = []; let pool = ex.tokens.map(t => t); shuffle(pool);
    function draw() {
      answer.innerHTML = ""; bank.innerHTML = "";
      if (!chosen.length) answer.appendChild(el("span", "tiles-hint", "Tippe die Wörter der Reihe nach an"));
      chosen.forEach((tok, ci) => { const b = el("button", "tile", tok); b.addEventListener("click", () => { chosen.splice(ci, 1); pool.push(tok); draw(); }); answer.appendChild(b); });
      pool.forEach((tok, pi) => { const b = el("button", "tile bank", tok); b.addEventListener("click", () => { chosen.push(tok); pool.splice(pi, 1); draw(); }); bank.appendChild(b); });
    }
    draw();
    const ctrl = el("div", "btn-row"); ctrl.style.marginTop = "12px";
    const reset = el("button", "btn btn-ghost", "Zurücksetzen"); reset.addEventListener("click", () => { pool = ex.tokens.map(t => t); shuffle(pool); chosen = []; draw(); });
    const check = el("button", "btn btn-primary", "Prüfen");
    check.addEventListener("click", () => {
      const ok = chosen.join(" ") === expected.join(" ");
      const res = el("div", "tiles-result " + (ok ? "good" : "bad")); res.textContent = (ok ? "Giusto! " : "Richtig: ") + ex.pt;
      card.appendChild(res); speak(ex.pt, ex.key); grade(ex.key, ok);
      check.disabled = true; reset.disabled = true;
      setTimeout(() => done(ok), 1300);
    });
    ctrl.appendChild(reset); ctrl.appendChild(check); host.appendChild(ctrl);
  }

  // Einstiegspunkte der Modi
  function startMix()   { runSession("Misch-Training", "Wechselnde Aufgaben: wählen, hören, Lücke füllen, Satz bauen.", deckFrom(WORD_SRC.concat(DRILL_SENT), 24).map(makeExercise), viewTrain); }
  function startTiles() {
    runSession("Satzbau", "Tippe die Wörter in die richtige Reihenfolge — Ablenker gibt es unterschiedlich viele.",
      deckFrom(DRILL_SENT, 20).map(s => {
        const d = withDistractors(s.tokens, DRILL_WORD_POOL, 0, 4);
        return { type: "tiles", key: s.key, pt: s.pt, de: s.de, tokens: d.tokens, answer: d.answer };
      }), viewTrain);
  }

  function startShadow() {
    const picks = deckFrom(WORD_SRC.concat(DRILL_SENT), 24); let i = 0;
    const wrap = el("div"); const back = el("button", "back", "‹ Allenamento"); back.addEventListener("click", viewTrain); wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", "Shadowing")); wrap.appendChild(el("p", "view-sub", "Hören, laut nachsprechen, dann aufdecken — trainiert Aussprache und Hörverstehen."));
    const host = el("div"); wrap.appendChild(host); render(wrap);
    function step() {
      if (i >= picks.length) {
        host.innerHTML = ""; host.appendChild(el("div", "empty", '<div style="font-size:40px">🎉</div><p>Geschafft! Ottima pronuncia.</p>'));
        const b = el("button", "btn btn-ghost", "Zurück zum Allenamento"); b.addEventListener("click", viewTrain); host.appendChild(b); return;
      }
      const s = picks[i]; host.innerHTML = "";
      host.appendChild(el("div", "flash-progress", `<span>${i + 1} / ${picks.length}</span><span>🎙️ nachsprechen</span>`));
      const card = el("div", "drill-card");
      const big = el("button", "listen-btn", "🔊"); big.addEventListener("click", () => speak(s.pt, s.key)); card.appendChild(big);
      const reveal = el("div", "drill-pt hidden"); reveal.textContent = s.pt;
      const de = el("div", "cloze-de hidden"); de.textContent = s.de;
      card.appendChild(reveal); card.appendChild(de); host.appendChild(card);
      speak(s.pt, s.key);
      const showBtn = el("button", "btn btn-ghost", "👁️ Text zeigen");
      const next = el("button", "btn btn-primary", "Weiter ›"); next.style.marginTop = "10px";
      showBtn.addEventListener("click", () => { reveal.classList.remove("hidden"); de.classList.remove("hidden"); showBtn.classList.add("hidden"); });
      next.addEventListener("click", () => { markPractice(1); i++; step(); });
      host.appendChild(showBtn); host.appendChild(next);
    }
    step();
  }

  /* ============================================================
     VIAGGIO (Reise-Material): Checkliste + Dialoge
     ============================================================ */
  function viewViaggio() {
    const wrap = el("div");
    wrap.appendChild(el("h2", "view-title", "Viaggio"));
    wrap.appendChild(el("p", "view-sub", "Dein Reisematerial: Checklisten je Level, Missionen (auch aus den Lektionen) und echte Mini-Dialoge von A1 bis B1."));
    const b1 = el("button", "btn btn-primary", `✅ Reisecheckliste (A1 · ${S.checklist.length} Sätze)`);
    b1.addEventListener("click", () => viewChecklist("A1"));
    wrap.appendChild(b1);
    const bm = el("button", "btn btn-telha", "🗺️ Reise-Missionen");
    bm.style.marginTop = "10px"; bm.addEventListener("click", viewMissions);
    wrap.appendChild(bm);
    wrap.appendChild(el("div", "section-h", "Reise-Dialoge"));
    let levelFilter = null;
    const host = el("div"); wrap.appendChild(host);
    function drawDialogues() {
      host.innerHTML = "";
      const chips = el("div", "tabs");
      [["Alle", null], ["A1", "A1"], ["A2", "A2"], ["B1", "B1"]].forEach(([label, lv]) => {
        const n = lv ? S.dialogues.filter(dl => (dl.level || "A1") === lv).length : S.dialogues.length;
        const c = el("button", "chip" + (levelFilter === lv ? " active" : ""), `${label} · ${n}`);
        c.addEventListener("click", () => { levelFilter = lv; drawDialogues(); });
        chips.appendChild(c);
      });
      host.appendChild(chips);
      const grid = el("div", "grid");
      S.dialogues.filter(dl => !levelFilter || (dl.level || "A1") === levelFilter).forEach(dl => {
        const lvl = dl.level || "A1";
        const t = el("button", "cat-tile");
        t.appendChild(el("span", "emoji", dl.icon));
        t.appendChild(el("span", "name", dl.title));
        const inStory = STORIES.find(x => x.dialogueId === dl.id);
        t.appendChild(el("span", "count", `${dl.lines.length} Zeilen${inStory ? ` · Szene in „${inStory.title}“` : ""}`));
        t.appendChild(el("span", "lv " + lvl, lvl));
        t.addEventListener("click", () => viewDialogue(dl));
        grid.appendChild(t);
      });
      host.appendChild(grid);
    }
    drawDialogues();
    render(wrap);
  }

  function checkState() { return LS.get("ciaoit_check", {}); }
  // Checklisten je Level. A1 behält die alten SRS-Keys (chk_<i>), damit
  // vorhandener Fortschritt erhalten bleibt; A2/B1 nutzen eigene Präfixe.
  const CHECKLISTS = [
    ["A1", "checklist", "chk_"],
    ["A2", "checklistA2", "chkA2_"],
    ["B1", "checklistB1", "chkB1_"]
  ];
  function checklistOf(level) {
    const def = CHECKLISTS.find(([lv]) => lv === level) || CHECKLISTS[0];
    const items = S[def[1]] || [];
    return { level: def[0], items, pfx: def[2] };
  }
  function viewChecklist(level) {
    const cur = checklistOf(level);
    const wrap = el("div");
    const back = el("button", "back", "‹ Viaggio"); back.addEventListener("click", viewViaggio);
    wrap.appendChild(back);
    // Einmalige Übernahme alter Häkchen in die SRS-Boxen (Box 4), damit
    // früher getickte Sätze nicht als „ungelernt“ verloren gehen.
    if (cur.level === "A1") {
      const legacy = checkState();
      if (Object.keys(legacy).length) {
        const s = srs();
        Object.keys(legacy).forEach(i => {
          if (legacy[i] && !s[`chk_${i}`]) s[`chk_${i}`] = { box: 4, due: Date.now() + 4 * DAY };
        });
        srsSave(s);
        LS.set("ciaoit_check", {});
      }
    }
    const sr = srs();
    const ripe = cur.items.filter((_, i) => sr[`${cur.pfx}${i}`] && sr[`${cur.pfx}${i}`].box >= 4).length;
    wrap.appendChild(el("h2", "view-title", "Reisecheckliste"));
    const tabs = el("div", "tabs");
    CHECKLISTS.forEach(([lv]) => {
      const n = (S[CHECKLISTS.find(([l]) => l === lv)[1]] || []).length;
      const c = el("button", "chip" + (lv === cur.level ? " active" : ""), `${lv} · ${n} Sätze`);
      c.addEventListener("click", () => viewChecklist(lv));
      tabs.appendChild(c);
    });
    wrap.appendChild(tabs);
    wrap.appendChild(el("p", "view-sub", `Level ${cur.level} · ${ripe} / ${cur.items.length} sitzen sicher. Anhören, laut sagen, dann bewerten — alles wandert in die Wiederholung.`));
    const bar = el("div", "progbar"); const fill = el("div", "progfill"); fill.style.width = `${Math.round((ripe / cur.items.length) * 100)}%`; bar.appendChild(fill); wrap.appendChild(bar);
    const card = el("div", "card");
    cur.items.forEach((c, i) => {
      const key = `${cur.pfx}${i}`;
      const row = el("div", "row chk");
      row.appendChild(srsDot(key));
      const g = el("div", "grow");
      g.appendChild(el("div", "pt", c.it));
      g.appendChild(el("div", "de", c.de));
      row.appendChild(g);
      row.appendChild(playBtn(c.it, key));
      const again = el("button", "grbtn", "↻");
      again.title = "Nochmal üben";
      again.addEventListener("click", (e) => { e.stopPropagation(); grade(key, false); bumpSkill("hoeren"); viewChecklist(cur.level); });
      const knew = el("button", "grbtn good", "✓");
      knew.title = "Wusste ich";
      knew.addEventListener("click", (e) => { e.stopPropagation(); grade(key, true); bumpSkill("hoeren"); viewChecklist(cur.level); });
      row.appendChild(again); row.appendChild(knew);
      row.addEventListener("click", () => speak(c.it, key));
      card.appendChild(row);
    });
    wrap.appendChild(card);
    render(wrap);
  }

  function missionState() { return LS.get("ciaoit_missions", {}); }
  // Vereinigt die 12 Reisemissionen mit den Story-Missionen aller Lektionen
  // (Stories mit missionId nutzen die Reisemission — keine Doppelliste).
  function allMissionList() {
    const seen = new Set(); const out = [];
    S.missions.forEach(mn => { seen.add(mn.id); out.push({ id: mn.id, title: mn.title, say: mn.say, phase: mn.phase, audioKey: `mis_${mn.id}` }); });
    STORIES.forEach(story => {
      const m = storyMission(story);
      if (seen.has(m.id)) return;
      seen.add(m.id);
      out.push({ id: m.id, title: m.title, say: m.say, de: m.de, phase: "storia", level: story.level, story, audioKey: m.audioKey });
    });
    return out;
  }
  function toggleMission(id) {
    const s = missionState();
    if (s[id]) { delete s[id]; LS.set("ciaoit_missions", s); return; }
    s[id] = { when: Date.now() }; LS.set("ciaoit_missions", s);
    bumpOutput("missionen"); bumpSkill("sprechen"); markPractice(1); addXP(25);
    toast("Mission erledigt! +25 XP 🎯");
  }
  function viewMissions() {
    const wrap = el("div");
    const back = el("button", "back", "‹ Viaggio"); back.addEventListener("click", viewViaggio); wrap.appendChild(back);
    const st = missionState();
    const all = allMissionList();
    const done = all.filter(mn => st[mn.id]).length;
    wrap.appendChild(el("h2", "view-title", "Reise-Missionen"));
    wrap.appendChild(el("p", "view-sub", `${done}/${all.length} erledigt. Echte Aufgaben — aus den Lektionen sowie vor, während und nach der Reise.`));
    const renderRows = (items) => {
      const card = el("div", "card");
      items.forEach(mn => {
        const row = el("div", "row chk");
        const box = el("button", "checkbox" + (st[mn.id] ? " on" : ""), st[mn.id] ? "✓" : "");
        box.addEventListener("click", (e) => { e.stopPropagation(); toggleMission(mn.id); viewMissions(); });
        row.appendChild(box);
        const g = el("div", "grow");
        g.appendChild(el("div", "pt", mn.title));
        if (mn.say) g.appendChild(el("div", "de", `„${mn.say}"`));
        row.appendChild(g);
        if (mn.say) row.appendChild(playBtn(mn.say, mn.audioKey || `mis_${mn.id}`));
        const story = mn.story || STORIES.find(x => x.missionId === mn.id);
        if (story) {
          const go = el("button", "grbtn", "›");
          go.title = "Zur Missions-Seite";
          go.addEventListener("click", (e) => { e.stopPropagation(); viewMissione(story); });
          row.appendChild(go);
        }
        card.appendChild(row);
      });
      wrap.appendChild(card);
    };
    const phases = [["prima", "Vorbereiten"], ["viaggio", "Unterwegs in Italien"], ["dopo", "Nach der Reise — dranbleiben"]];
    phases.forEach(([ph, label]) => {
      const items = all.filter(mn => mn.phase === ph);
      if (!items.length) return;
      wrap.appendChild(el("div", "section-h", label));
      renderRows(items);
    });
    const storyMissions = all.filter(mn => mn.phase === "storia");
    if (storyMissions.length) {
      wrap.appendChild(el("div", "section-h", "Aus den Lektionen"));
      ["A1", "A2", "B1"].forEach(lv => {
        const items = storyMissions.filter(mn => mn.level === lv);
        if (!items.length) return;
        const lvlDone = items.filter(mn => st[mn.id]).length;
        wrap.appendChild(el("div", "section-h level-h", `${lv} <span class="level-count">${lvlDone}/${items.length}</span>`));
        renderRows(items);
      });
    }
    render(wrap);
  }

  function viewDialogue(dl) {
    const wrap = el("div");
    const back = el("button", "back", "‹ Viaggio"); back.addEventListener("click", viewViaggio);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", `${dl.icon} ${dl.title}`));
    const dlLevel = dl.level || "A1";
    const dlMeta = el("p", "view-sub lvl-row");
    dlMeta.appendChild(el("span", "lv " + dlLevel, dlLevel));
    dlMeta.appendChild(el("span", null, `${dl.lines.length} Zeilen · Tempo wählen, dann anhören.`));
    wrap.appendChild(dlMeta);
    let rate = 0.85;
    const tabs = el("div", "tabs");
    [["🐢 Lento", 0.6], ["Normale", 0.85], ["Veloce", 1.05]].forEach(([label, r], i) => {
      const c = el("button", "chip" + (i === 1 ? " active" : ""), label);
      c.addEventListener("click", () => { rate = r; [...tabs.children].forEach(x => x.classList.remove("active")); c.classList.add("active"); });
      tabs.appendChild(c);
    });
    wrap.appendChild(tabs);
    const btnRow = el("div", "btn-row");
    const playAll = el("button", "btn btn-primary", "▶︎ Ganzen Dialog anhören");
    playAll.addEventListener("click", () => { const t = ++seqToken; speakSequence(dl, rate, t); });
    const stopBtn = el("button", "btn btn-ghost", "⏹ Stop");
    stopBtn.addEventListener("click", () => { seqToken++; if (window.speechSynthesis) speechSynthesis.cancel(); toast("Wiedergabe gestoppt"); });
    btnRow.appendChild(playAll); btnRow.appendChild(stopBtn);
    wrap.appendChild(btnRow);
    const story = STORIES.find(x => x.dialogueId === dl.id);
    if (story) {
      const sb = el("button", "btn btn-telha", `🎬 Diese Szene in „${story.title}“ spielen ▶`);
      sb.style.marginTop = "10px";
      sb.addEventListener("click", () => { seqToken++; startStory(story); });
      wrap.appendChild(sb);
    }
    const card = el("div", "card"); card.style.marginTop = "12px";
    dl.lines.forEach((ln, i) => {
      const key = `dlg_${dl.id}_${i}`;
      const mine = ln.who === "Du";
      const row = el("div", "row dlg" + (mine ? " mine" : ""));
      const g = el("div", "grow");
      g.appendChild(el("div", "who", ln.who));
      g.appendChild(el("div", "pt", ln.it));
      g.appendChild(el("div", "de", ln.de));
      row.appendChild(g);
      row.appendChild(playBtn(ln.it, key));
      row.addEventListener("click", () => speak(ln.it, key));
      card.appendChild(row);
    });
    wrap.appendChild(card);
    render(wrap);
  }
  // Spielt einen Dialog Zeile für Zeile — die nächste Zeile beginnt erst,
  // wenn die vorherige fertig ist (MP3 onended, sonst TTS onend, sonst Taktung).
  let seqToken = 0;
  async function speakSequence(dl, rate, token) {
    if (!settings.speak) { toast("Ton ist aus"); return; }
    for (let i = 0; i < dl.lines.length; i++) {
      if (token !== seqToken) return;
      await speakWait(dl.lines[i].it, `dlg_${dl.id}_${i}`, rate);
    }
  }

  /* ============================================================
     PERCORSO (Lernpfad) & STORY-PLAYER
     Jede Story durchläuft: Entdecken → Hören → Erkennen →
     Bauen → Szene → Produzieren → Abschluss (XP + Badge).
     Neue Stories kommen ausschließlich in stories.js hinzu.
     ============================================================ */
  const STORIES = window.IT_STORIES || [];
  const POOL_BY_SLUG = {};
  POOL.forEach(p => { const s = p.key.slice(5); if (!POOL_BY_SLUG[s]) POOL_BY_SLUG[s] = p; });
  // Wörter mit passendem Bestandseintrag teilen dessen SRS/Audio-Schlüssel
  function storyWordKey(story, w) {
    if (w.key) return w.key;
    const s = slug(w.it);
    return POOL_BY_SLUG[s] ? POOL_BY_SLUG[s].key : `story_${story.id}_${s}`;
  }
  const storySentKey = (story, i) => `story_${story.id}_sent_${i}`;
  function sentenceTokens(it) { return it.replace(/[.!?,;:]/g, "").split(/\s+/).filter(Boolean); }

  /* ---------- Reale Mission pro Story (Piazza-Schleife) ---------- */
  function storyMission(story) {
    if (story.missionId) {
      const m = S.missions.find(x => x.id === story.missionId);
      if (m && m.say) return { id: m.id, title: m.title, say: m.say, source: "Reise-Mission", audioKey: `mis_${m.id}` };
    }
    const si = (story.produce || [0])[0] || 0;
    const s = story.sentences[si] || story.sentences[0];
    return { id: `st_${story.id}`, title: story.title, say: s.it, de: s.de, source: "Story-Satz", audioKey: `story_${story.id}_sent_${si}` };
  }
  function missionDone(id) { return !!missionState()[id]; }
  function nextRealMission() {
    for (const st of STORIES) {
      if (!storyDone(st.id)) continue;
      const m = storyMission(st);
      if (!missionDone(m.id)) return { story: st, mission: m };
    }
    return null;
  }

  /* ---------- Bereitschaft (WaniKani-Prinzip: SRS schaltet frei) ---------- */
  function storyReadiness(story) {
    const s = srs();
    const ready = story.words.filter(w => {
      const r = s[storyWordKey(story, w)];
      return r && r.box >= 3;
    }).length;
    return Math.round(ready / story.words.length * 100);
  }
  /* ---------- Espresso del giorno (1 kurze Challenge pro Tag) ---------- */
  function espressoPick() {
    // Tagessstabil: die Wahl wird pro Tag gespeichert
    const today = ymd();
    const saved = LS.get("ciaoit_espresso", null);
    if (saved && saved.day === today) return STORIES.find(s => s.id === saved.id) || null;
    const pool = STORIES.filter(s => !storyDone(s.id));
    if (!pool.length) return null;
    const day = Number(today.replace(/-/g, ""));
    const minis = pool.filter(s => s.mini);
    const list = (day % 2 === 0 && minis.length) ? minis : pool;
    const pick = list[day % list.length];
    LS.set("ciaoit_espresso", { day: today, id: pick.id });
    return pick;
  }
  function espressoDone(pick) { return !pick || storyDone(pick.id); }

  /* ============================================================
     CONGIUGA DEL GIORNO — tägliche Konjugations-Rotation
     1× täglich beim ersten Start: ein Verb, eine Zeit, alle sechs
     Personen in fester Folge (Singular 1./2./3., Plural 1./2./3.).
     Rotation leicht → schwer: pro Level reg. -are → reg. -ere →
     reg. -ire (inkl. -isc) → unregelmäßige; Level A1 → A2 → B1;
     drei Durchläufe: Presente, Passato, Futuro (endlos).
     ============================================================ */
  /* conj-queue:start
     Reine Ableitung der Rotation — ohne DOM/Storage, damit
     tools/check-conj-queue.js exakt denselben Code prüfen kann. */
  const CONJ_TENSES = ["presente", "passato", "futuro"];
  const CONJ_LEVELS = [["A1", 0, 99], ["A2", 100, 118], ["B1", 119, Infinity]];
  const CONJ_PERSONS = ["io", "tu", "lui/lei", "noi", "voi", "loro"]; // Anzeige-Folge; die Daten halten loro=4, voi=5
  const CONJ_CLITIC = ["mi", "ti", "si", "ci", "si", "vi"];
  function conjFold(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().trim().replace(/\s+/g, " ");
  }
  function conjBase(inf) { return /(a|e|i)rsi$/.test(inf) ? inf.slice(0, -2) + "e" : inf; }
  function conjClass(inf) {
    const b = conjBase(inf);
    // Dritte Konjugation und Reste (-urre, -orre) fallen auf "ire" — sie
    // bestehen den Regularitäts-Vergleich ohnehin nicht und landen unregelmäßig.
    return b.endsWith("are") ? "are" : b.endsWith("ere") ? "ere" : "ire";
  }
  function conjStem(inf) { return conjBase(inf).slice(0, -3); }
  // Regelmäßig = Presente folgt der Standard-Endung, inkl. h-Einschub
  // bei -care/-gare (paghi) und dem -isc-Typ (finisco). Alles andere
  // zählt als unregelmäßig und kommt in der Rotation zuletzt.
  function conjIsRegular(verb) {
    if (verb.impersonal) return false;
    const st = conjStem(verb.inf), cls = conjClass(verb.inf);
    // Endungen in Daten-Reihenfolge: io, tu, lui/lei, noi, loro(4), voi(5)
    const patterns = [];
    if (cls === "are") {
      if (/i$/.test(st)) {
        // -iare-Verben kontrahieren: mangi, mangiamo (kein doppeltes i)
        patterns.push([st + "o", st, st + "a", st + "amo", st + "ano", st + "ate"]);
      } else {
        const h = /[cg]$/.test(st) ? "h" : "";
        patterns.push([st + "o", st + h + "i", st + "a", st + h + "iamo", st + "ano", st + "ate"]);
      }
    } else if (cls === "ere") {
      patterns.push([st + "o", st + "i", st + "e", st + "iamo", st + "ono", st + "ete"]);
    } else {
      patterns.push([st + "o", st + "i", st + "e", st + "iamo", st + "ono", st + "ite"]);              // dormire
      patterns.push([st + "isco", st + "isci", st + "isce", st + "iamo", st + "iscono", st + "ite"]);  // finire
    }
    const actual = verb.presente.map((f, i) => conjFold(String(f || "").replace(CONJ_CLITIC[i] + " ", "")));
    return patterns.some(p => p.every((f, i) => conjFold(f) === actual[i]));
  }
  function conjLevel(idx) {
    for (const [name, from, to] of CONJ_LEVELS) if (idx >= from && idx <= to) return name;
    return "A1";
  }
  function buildConjQueue(verbs) {
    const buckets = { A1: { are: [], ere: [], ire: [], irr: [] }, A2: { are: [], ere: [], ire: [], irr: [] }, B1: { are: [], ere: [], ire: [], irr: [] } };
    verbs.forEach((v, idx) => {
      if (v.impersonal) return; // piovere, bisognare: keine volle Konjugation
      const b = buckets[conjLevel(idx)];
      b[conjIsRegular(v) ? conjClass(v.inf) : "irr"].push(v);
    });
    Object.values(buckets).forEach(b => {
      // essere/avere zuerst (wichtigste unregelmäßige), Rest in stabiler Daten-Reihenfolge
      const rank = x => (x.inf === "essere" ? 0 : x.inf === "avere" ? 1 : 2);
      b.irr.sort((x, y) => rank(x) - rank(y));
    });
    const queue = [];
    CONJ_TENSES.forEach(tense => {
      CONJ_LEVELS.forEach(([lvl]) => {
        const b = buckets[lvl];
        [].concat(b.are, b.ere, b.ire, b.irr).forEach(v => queue.push({ v, tense }));
      });
    });
    return queue;
  }
  // Tipp-Vergleich: akzeptiert Gender-Varianten („sono stato/a" → stato|stata)
  // und verzichtet optional auf das Reflexiv-Klitikon („mi chiamo" ≈ „chiamo").
  function conjVariants(form) {
    // „stato/a" heißt: Suffix ersetzen → stato|stata (nicht stato|a)
    const wordVariants = w => {
      const parts = w.split("/").filter(Boolean);
      if (parts.length < 2 || !w.includes("/")) return [w];
      const base = parts[0];
      return [base].concat(parts.slice(1)
        .filter(p => p.length <= base.length)
        .map(p => base.slice(0, base.length - p.length) + p));
    };
    let variants = [""];
    String(form).trim().split(/\s+/).forEach(w => {
      variants = variants.map(pre => wordVariants(w).map(x => (pre ? pre + " " : "") + x)).flat();
    });
    return variants.concat(variants.filter(x => /^(mi|ti|si|ci|vi) /.test(x)).map(x => x.replace(/^(mi|ti|si|ci|vi) /, "")));
  }
  function conjAccept(expected, typed) {
    const t = conjFold(typed);
    return !!t && conjVariants(expected).some(x => conjFold(x) === t);
  }
  // Abfrage-Folge als Daten-Indizes: io→tu→lui/lei→noi→voi→loro
  // (die Daten halten loro=4, voi=5 — deshalb 5 vor 4)
  const CONJ_DISPLAY = [0, 1, 2, 3, 5, 4];
  // Slug wie app.js slug() (hier dupliziert, damit der Marker-Block
  // in Node ohne DOM läuft — siehe ADR-0001)
  function conjSlug(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }
  // verbKey zurückparsen: "verb_<slug>_<tense>_<0-5>" → { v, tense, person }
  function verbKeyParse(key, verbsBySlug) {
    const m = /^verb_(.+)_(presente|passato|futuro)_([0-5])$/.exec(String(key || ""));
    if (!m) return null;
    const v = verbsBySlug[m[1]];
    return v ? { v, tense: m[2], person: Number(m[3]) } : null;
  }
  function verbsBySlugMap(verbs) {
    const map = {};
    verbs.forEach(v => { map[conjSlug(v.inf)] = v; });
    return map;
  }
  /* conj-queue:end */

  const CONJ_QUEUE = buildConjQueue(D.verbs);
  function conjTenseLabel(id) { const t = D.meta.tenses.find(t => t.id === id); return t ? t.label : id; }
  function conjState() { return LS.get("ciaoit_conj", { qi: 0, doneDay: null }); }
  function conjDoneToday() { return conjState().doneDay === ymd(); }
  function conjCurrent() { const len = CONJ_QUEUE.length; return len ? CONJ_QUEUE[conjState().qi % len] : null; }
  // Anzeige-Bilanz (Bestandsprofile haben noch kein stats — lazy)
  function conjStats() {
    const st = conjState();
    if (!st.stats) st.stats = { total: 0, first: 0, asked: [0, 0, 0, 0, 0, 0], hit: [0, 0, 0, 0, 0, 0] };
    return st.stats;
  }

  /* ---------- Nudge-Banner (Body-Level, bis die Tagesaufgabe erledigt ist) ---------- */
  function updateConjBanner() {
    let b = $(".conj-banner");
    if (conjDoneToday()) { if (b) b.remove(); return; }
    const item = conjCurrent();
    if (!item) return;
    if (!b) {
      b = el("button", "conj-banner");
      b.addEventListener("click", openConj);
      document.body.appendChild(b);
    }
    b.innerHTML = `☕ <b>Konjugation des Tages:</b> ${item.v.inf} · ${conjTenseLabel(item.tense)} <span class="arr">›</span>`;
  }

  /* ---------- Overlay: eine volle Konjugation tippen ---------- */
  let conjOpen = false;
  function openConj() {
    if (conjOpen || conjDoneToday()) return;
    const item = conjCurrent();
    if (!item) return;
    conjOpen = true;
    const v = item.v, tense = item.tense;

    const overlay = el("div", "conj-overlay");
    const card = el("div", "conj-card");
    overlay.appendChild(card);
    const dots = CONJ_DISPLAY.map(() => el("span", "conj-dot"));
    const dotsRow = el("div", "conj-dots");
    dots.forEach(d => dotsRow.appendChild(d));
    const personEl = el("div", "conj-person", "io");
    const input = el("input", "conj-input");
    input.type = "text"; input.autocapitalize = "off"; input.autocomplete = "off"; input.spellcheck = false;
    input.setAttribute("aria-label", "Verbform für die angezeigte Person eingeben");
    const feedback = el("div", "conj-feedback");
    const checkBtn = el("button", "btn btn-primary", "Prüfen");
    const laterBtn = el("button", "conj-later", "Später");

    card.appendChild(el("div", "conj-kicker", "Coniugazione del giorno"));
    card.appendChild(el("div", "conj-verb", v.inf));
    card.appendChild(el("div", "conj-de", v.de));
    card.appendChild(el("div", "conj-tense", conjTenseLabel(tense)));
    card.appendChild(dotsRow);
    card.appendChild(personEl);
    card.appendChild(input);
    card.appendChild(feedback);
    card.appendChild(checkBtn);
    card.appendChild(laterBtn);
    document.body.appendChild(overlay);

    let queue = CONJ_DISPLAY.map((_, i) => i); // Abfrage-Slots 0–5 in Anzeige-Folge
    let retry = [];                            // verhakte Slots
    let pos = 0, phase = 1, firstTry = 0, advancing = false;
    const firstOk = [false, false, false, false, false, false]; // Erstversuch je Person (Daten-Index)

    function close() { overlay.remove(); conjOpen = false; updateConjBanner(); }
    function finish() {
      const st = conjState();
      st.qi = (st.qi + 1) % CONJ_QUEUE.length;
      st.doneDay = ymd();
      const cs = st.stats || (st.stats = { total: 0, first: 0, asked: [0, 0, 0, 0, 0, 0], hit: [0, 0, 0, 0, 0, 0] });
      cs.total++; cs.first += firstTry;
      CONJ_DISPLAY.forEach(p => { cs.asked[p]++; if (firstOk[p]) cs.hit[p]++; });
      LS.set("ciaoit_conj", st);
      // Alle 6 Formen still ins Leitner-SRS bewerten (Erstversuch → Box rauf,
      // verhakt → Box 1) — sie werden dann im Verbi-Drill wieder fällig
      CONJ_DISPLAY.forEach(p => grade(verbKey(v.inf, tense, p), !!firstOk[p], true));
      addXP(10); markPractice(1);
      card.innerHTML = "";
      card.appendChild(el("div", "conj-kicker", "Fatto — fertig!"));
      card.appendChild(el("div", "conj-verb", `${firstTry}/6`));
      card.appendChild(el("div", "conj-de", "beim ersten Versuch richtig · +10 XP"));
      const ok = el("button", "btn btn-primary", "Perfetto");
      ok.addEventListener("click", () => { close(); toast(`☕ ${v.inf} konjugiert — bravo!`); });
      card.appendChild(ok);
      updateConjBanner();
    }
    function step() {
      if (!overlay.isConnected) return;
      let note = "";
      if (pos >= queue.length) {
        if (retry.length) {
          queue = retry; retry = []; pos = 0; phase = 2;
          note = "🔁 Noch einmal: die verhakten Formen";
        } else return finish();
      }
      const slot = queue[pos];
      dots[slot].className = "conj-dot now";
      personEl.textContent = PRON[CONJ_DISPLAY[slot]];
      input.className = "conj-input"; input.value = ""; input.disabled = false;
      feedback.className = "conj-feedback"; feedback.textContent = note;
      checkBtn.textContent = "Prüfen"; checkBtn.disabled = false;
      advancing = false;
      input.focus();
    }
    function check() {
      if (advancing || !overlay.isConnected) return;
      const slot = queue[pos];
      const personIdx = CONJ_DISPLAY[slot];
      const expected = v[tense][personIdx];
      const audioKey = verbKey(v.inf, tense, personIdx);
      if (conjAccept(expected, input.value)) {
        advancing = true;
        input.disabled = true;
        input.className = "conj-input ok";
        feedback.className = "conj-feedback ok";
        feedback.textContent = "";
        feedback.appendChild(el("span", null, "✓ giusto"));
        feedback.appendChild(playBtn(expected, audioKey));
        dots[slot].className = "conj-dot " + (phase === 1 ? "ok" : "fix");
        if (phase === 1) { firstTry++; firstOk[personIdx] = true; }
        speak(expected, audioKey);
        checkBtn.disabled = true;
        setTimeout(() => { pos++; step(); }, 750);
      } else {
        advancing = true;
        input.disabled = true;
        input.className = "conj-input bad";
        retry.push(slot);
        feedback.className = "conj-feedback bad";
        feedback.textContent = "";
        feedback.appendChild(el("span", null, "Richtig: "));
        const shown = el("span", "conj-solution");
        shown.appendChild(el("span", null, expected));
        shown.appendChild(playBtn(expected, audioKey));
        feedback.appendChild(shown);
        checkBtn.textContent = "Weiter"; checkBtn.disabled = false;
        checkBtn.focus();
      }
    }
    function onCheck() { if (input.disabled) { pos++; step(); } else check(); }
    checkBtn.addEventListener("click", onCheck);
    input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); onCheck(); } });
    laterBtn.addEventListener("click", close);
    step();
  }

  function viewPercorso() {
    const wrap = el("div");
    wrap.appendChild(el("h2", "view-title", "Percorso"));
    wrap.appendChild(el("p", "view-sub", "Dein Lernpfad: kleine Szenen, jede rund sechs Minuten. Level für Level wächst dein Italienisch."));
    const done = STORIES.filter(s => storyDone(s.id)).length;
    const xpLine = el("div", "xp-line");
    xpLine.appendChild(el("span", "xp-chip", `⭐ ${xpState().xp} XP`));
    xpLine.appendChild(el("span", "xp-chip", `🏅 ${done}/${STORIES.length} Stories`));
    wrap.appendChild(xpLine);
    const badgeIds = xpState().badges;
    if (badgeIds.length) {
      const shelf = el("div", "badge-shelf");
      badgeIds.forEach(id => { const st = STORIES.find(s => s.id === id); if (st) shelf.appendChild(el("span", "badge", st.icon)); });
      wrap.appendChild(shelf);
    }

    const CURR = window.IT_CURRICULUM || {};
    const CHAPS = window.IT_CHAPTERS || [];
    const activeLevels = Object.keys(CURR).filter(lv => STORIES.some(s => s.level === lv));
    let nextMarked = false;
    activeLevels.forEach(lv => {
      const info = CURR[lv];
      const levelStories = STORIES.filter(s => s.level === lv);
      const levelDone = levelStories.filter(s => storyDone(s.id)).length;
      wrap.appendChild(el("div", "section-h level-h",
        `${lv} · ${info.label} <span class="level-count">${levelDone}/${levelStories.length}</span>`));
      const path = el("div", "path");
      // Kapitel-Marken (nur A1): Kapitelname + Meilenstein, wenn komplett
      levelStories.forEach(story => {
        const gIdx = STORIES.indexOf(story);
        if (lv === "A1") {
          const chap = CHAPS.find(c => c.from === gIdx);
          if (chap) {
            const chapStories = STORIES.slice(chap.from, chap.to);
            const chapDone = chapStories.filter(x => storyDone(x.id)).length;
            const complete = chapDone === chapStories.length;
            const head = el("div", "chapter-head");
            head.appendChild(el("span", "chapter-ico", chap.icon));
            const cg = el("div", "grow");
            cg.appendChild(el("div", "chapter-name", chap.name));
            cg.appendChild(el("div", "story-sub", complete
              ? "Kapitel geschafft — Meilenstein freigeschaltet 🎯"
              : `${chapDone}/${chapStories.length} Lektionen`));
            head.appendChild(cg);
            if (complete) {
              head.appendChild(playBtn(chap.say, `chap_${chap.from}`));
              head.addEventListener("click", () => speak(chap.say, `chap_${chap.from}`));
            }
            path.appendChild(head);
          }
        }
        const isDone = storyDone(story.id);
        const isNext = !isDone && !nextMarked;
        if (isNext) nextMarked = true;
        const card = el("button", "story-card" + (isDone ? " done" : "") + (isNext ? " next" : ""));
        card.appendChild(el("span", "story-ico", isDone ? "✓" : story.icon));
        const g = el("div", "grow");
        g.appendChild(el("div", "story-name", `${STORIES.indexOf(story) + 1}. ${story.title}`));
        const sub = story.mini ? `Mini-Lektion · ${story.words.length} Wörter` : `${story.words.length} Wörter · ${story.sentences.length} Sätze`;
        let subTxt = isDone ? "Geschafft — zum Wiederholen tippen" : (story.mini ? `Dran: ca. 3 Minuten · ${sub}` : `Dran: ca. 6 Minuten · ${sub}`);
        if (!isDone && !isNext) subTxt = sub;
        if (isNext && STORIES.indexOf(story) > 0) {
          const pct = storyReadiness(story);
          subTxt = isDone ? subTxt : (pct >= 70
            ? `Bereit ✓ · ${pct} % der Wörter sitzen — ca. ${story.mini ? 3 : 6} Minuten`
            : `Noch nicht ganz bereit (${pct} % sitzen) — aufrischen hilft, starten reicht auch`);
        }
        g.appendChild(el("div", "story-sub", isDone ? "Geschafft — zum Wiederholen tippen" : subTxt));
        card.appendChild(g);
        card.appendChild(el("span", "story-go", isNext ? "▶" : isDone ? "↻" : "•"));
        card.addEventListener("click", () => startStory(story));
        path.appendChild(card);
      });
      wrap.appendChild(path);
    });

    // Levels ohne Stories: theoretisch vorgesehen, noch ohne Inhalte
    const plannedLevels = Object.keys(CURR).filter(lv => !STORIES.some(s => s.level === lv));
    if (plannedLevels.length) {
      wrap.appendChild(el("div", "section-h", "Danach: weitere Level"));
      const levels = el("div", "path");
      plannedLevels.forEach(lv => {
        const info = CURR[lv];
        const card = el("div", "story-card locked");
        card.appendChild(el("span", "story-ico", "🔒"));
        const g = el("div", "grow");
        g.appendChild(el("div", "story-name", `${lv} · ${info.label}`));
        const topicCount = Array.isArray(info.topics) ? info.topics.length : 0;
        g.appendChild(el("div", "story-sub", info.goal || (topicCount ? `${topicCount} Themen vorgesehen` : "Inhalte folgen")));
        card.appendChild(g);
        levels.appendChild(card);
      });
      wrap.appendChild(levels);
      wrap.appendChild(el("p", "view-sub", "Weitere Level sind als Gerüst vorbereitet — die Stories dafür entstehen level für level. Details im KURRICULUM.md."));
    }
    render(wrap);
  }

  function startStory(story) {
    const words = story.words.map(w => Object.assign({ skey: storyWordKey(story, w) }, w));
    // Mini-Lektion: kurzer Ablauf (Entdecken → Hören → Bauen → Produzieren)
    const mini = !!story.mini;
    const steps = [{ type: "intro" }, { type: "discover" }];
    shuffle(words.slice()).slice(0, mini ? 4 : 6).forEach(w => steps.push({ type: "listen", w }));
    if (!mini) shuffle(words.slice()).slice(0, 4).forEach(w => steps.push({ type: "recognize", w }));
    (story.build || []).slice(0, mini ? 1 : 3).forEach(i => steps.push({ type: "build", i }));
    if (!mini && story.dialogueId) {
      const dl = S.dialogues.find(d => d.id === story.dialogueId);
      if (dl) steps.push({ type: "dialog", dl });
    }
    (story.produce || []).slice(0, mini ? 2 : 3).forEach(i => steps.push({ type: "produce", i }));
    steps.push({ type: "finale" });

    let idx = 0, xpEarned = 0, graded = 0, right = 0;
    const wrap = el("div");
    const back = el("button", "back", "‹ Percorso");
    back.addEventListener("click", viewPercorso);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", `${story.icon} ${story.title}`));
    const head = el("div", "story-head");
    const bar = el("div", "progbar"); const fill = el("div", "progfill"); bar.appendChild(fill);
    const xpLive = el("span", "xp-live", "⭐ 0");
    head.appendChild(bar); head.appendChild(xpLive);
    wrap.appendChild(head);
    const host = el("div"); wrap.appendChild(host);
    render(wrap);

    const bump = (n) => { xpEarned += n; addXP(n); xpLive.textContent = `⭐ ${xpEarned}`; };
    const result = (ok) => { graded++; if (ok) right++; };
    const next = () => { idx++; draw(); };

    function draw() {
      fill.style.width = `${Math.min(100, (idx / (steps.length - 1)) * 100)}%`;
      host.innerHTML = "";
      const st = steps[idx];
      if (!st || st.type === "finale") return finale();
      if (st.type === "intro") return intro();
      if (st.type === "discover") return discover();
      if (st.type === "listen") return listen(st.w);
      if (st.type === "recognize") return recognize(st.w);
      if (st.type === "build") return build(st.i);
      if (st.type === "dialog") return scene(st.dl);
      if (st.type === "produce") return produce(st.i);
    }

    function intro() {
      const card = el("div", "drill-card");
      card.appendChild(el("div", "scene-it", `${story.icon} ${story.title}`));
      card.appendChild(el("div", "scene-de", story.scene || "Eine kleine Szene aus Italien."));
      host.appendChild(card);
      const goBtn = el("button", "btn btn-primary", "Los geht's ›");
      goBtn.addEventListener("click", () => { markPractice(1); next(); });
      host.appendChild(goBtn);
    }

    function discover() {
      let i = 0, revealed = false;
      host.appendChild(el("div", "listen-instr", "Neue Wörter: Bild ansehen, zuhören — erst dann die Bedeutung zeigen."));
      const card = el("div", "discover-card");
      const art = el("div", "dc-art");
      const playRow = el("div"); playRow.style.marginTop = "6px";
      const reveal = el("div", "dc-reveal hidden");
      card.appendChild(art); card.appendChild(playRow); card.appendChild(reveal);
      host.appendChild(card);
      const action = el("button", "btn btn-primary", "Bedeutung zeigen");
      action.style.marginTop = "14px";
      host.appendChild(action);

      function drawCard() {
        const w = words[i];
        revealed = false;
        const svg = window.IT_ART && window.IT_ART.get(w.it);
        art.innerHTML = svg
          ? `<span class="dc-svg">${svg}</span>`
          : `<span class="dc-emoji">${w.emoji || ""}</span>`;
        playRow.innerHTML = ""; playRow.appendChild(playBtn(w.it, w.skey));
        reveal.innerHTML = ""; reveal.classList.add("hidden");
        reveal.appendChild(el("div", "dc-it", w.it));
        reveal.appendChild(el("div", "dc-de", w.de));
        action.textContent = "Bedeutung zeigen";
        speak(w.it, w.skey);
      }
      action.addEventListener("click", () => {
        if (!revealed) {
          revealed = true;
          reveal.classList.remove("hidden");
          speak(words[i].it, words[i].skey);
          action.textContent = i === words.length - 1 ? "Weiter ›" : "Nächstes Wort ›";
        } else {
          markPractice(1); bump(2);
          i++;
          if (i < words.length) drawCard(); else next();
        }
      });
      drawCard();
    }

    function wordOptions(w) {
      const others = shuffle(words.filter(x => x.skey !== w.skey && x.de !== w.de).slice()).slice(0, 3);
      return shuffle([w].concat(others));
    }

    function listen(w) {
      const card = el("div", "drill-card");
      card.appendChild(el("div", "listen-instr", "Hör zu — was bedeutet es?"));
      const big = el("button", "listen-btn", "🔊");
      big.addEventListener("click", () => speak(w.it, w.skey));
      card.appendChild(big);
      host.appendChild(card);
      speak(w.it, w.skey);
      const opts = el("div");
      wordOptions(w).forEach(o => {
        const b = el("button", "opt", o.de);
        b.addEventListener("click", () => {
          const ok = markChoice(opts, o.de, w.de);
          result(ok); if (ok) { bump(10); bumpSkill("hoeren"); }
          grade(w.skey, ok);
          setTimeout(next, 850);
        });
        opts.appendChild(b);
      });
      host.appendChild(opts);
    }

    function recognize(w) {
      const card = el("div", "drill-card");
      card.appendChild(el("div", "drill-de", w.it));
      const pw = el("div"); pw.style.textAlign = "center"; pw.appendChild(playBtn(w.it, w.skey));
      card.appendChild(pw);
      host.appendChild(card);
      const opts = el("div");
      wordOptions(w).forEach(o => {
        const b = el("button", "opt", o.de);
        b.addEventListener("click", () => {
          const ok = markChoice(opts, o.de, w.de);
          result(ok); if (ok) { bump(10); bumpSkill("lesen"); }
          grade(w.skey, ok);
          setTimeout(next, 850);
        });
        opts.appendChild(b);
      });
      host.appendChild(opts);
    }

    // Bauen & Produzieren nutzen das Kachel-Format; Produzieren fragt DE→IT ab
    // und mischt Ablenker-Wörter aus den anderen Story-Sätzen dazu.
    function build(i) {
      const s = story.sentences[i];
      renderTiles(host, { type: "tiles", key: storySentKey(story, i), pt: s.it, de: s.de, tokens: sentenceTokens(s.it) },
        ok => { result(ok); if (ok) { bump(12); bumpSkill("lesen"); } next(); });
    }

    function produce(i) {
      const s = story.sentences[i];
      const target = sentenceTokens(s.it);
      const distract = [];
      story.sentences.forEach((o, oi) => {
        if (oi === i) return;
        sentenceTokens(o.it).forEach(t => { if (t.length > 2 && !target.includes(t) && !distract.includes(t)) distract.push(t); });
      });
      // 1–5 Ablenker in zufälliger Anzahl — mal mehr, mal weniger übrig
      const d = withDistractors(target, distract, 1, 5);
      renderTiles(host, { type: "tiles", key: storySentKey(story, i), pt: s.it, de: s.de, tokens: d.tokens, answer: d.answer },
        ok => { result(ok); if (ok) { bump(15); bumpSkill("schreiben"); bumpOutput("satze"); } next(); });
    }

    function scene(dl) {
      let li = 0, advanced = false;
      host.appendChild(el("div", "listen-instr", "Die Szene: Die App spricht die Partner — deine Zeilen sagst du selbst."));
      const card = el("div", "scene-card");
      host.appendChild(card);
      const action = el("button", "btn btn-primary");
      action.style.marginTop = "4px";
      host.appendChild(action);

      function drawLine() {
        advanced = false;
        const ln = dl.lines[li];
        const mine = ln.who === "Du";
        const last = li === dl.lines.length - 1;
        card.className = "scene-card" + (mine ? " mine" : "");
        card.innerHTML = "";
        card.appendChild(el("div", "scene-who", ln.who));
        card.appendChild(el("div", "scene-it" + (mine ? " hidden" : ""), ln.it));
        card.appendChild(el("div", "scene-de", ln.de));
        if (mine) {
          action.textContent = "Auf Italienisch sagen ›";
        } else {
          speak(ln.it, `dlg_${dl.id}_${li}`);
          const pb = playBtn(ln.it, `dlg_${dl.id}_${li}`);
          pb.style.marginTop = "8px";
          card.appendChild(pb);
          action.textContent = last ? "Abschluss ›" : "Weiter ›";
        }
      }
      action.addEventListener("click", () => {
        const ln = dl.lines[li];
        if (ln.who === "Du" && !advanced) {
          advanced = true;
          card.querySelector(".scene-it").classList.remove("hidden");
          speak(ln.it, `dlg_${dl.id}_${li}`);
          action.textContent = li === dl.lines.length - 1 ? "Abschluss ›" : "Weiter ›";
          return;
        }
        markPractice(1); bump(3);
        li++;
        if (li < dl.lines.length) drawLine(); else next();
      });
      drawLine();
    }

    function finale() {
      const pct = graded ? Math.round((right / graded) * 100) : 100;
      const st = storyState();
      const first = !(st[story.id] && st[story.id].done);
      st[story.id] = { done: true, best: Math.max((st[story.id] && st[story.id].best) || 0, pct), at: Date.now() };
      LS.set("ciaoit_stories", st);
      if (first) {
        const x = xpState();
        if (!x.badges.includes(story.id)) { x.badges.push(story.id); LS.set("ciaoit_xp", x); }
        bump(25);
      }
      const mission = story.missionId ? S.missions.find(m => m.id === story.missionId) : null;
      fill.style.width = "100%";
      host.innerHTML = "";
      host.appendChild(el("div", "empty",
        `<div style="font-size:44px">${pct >= 70 ? "🎉" : "💪"}</div><p><b>${story.title}</b> geschafft!</p>` +
        `<p>${right}/${graded} richtig · ⭐ ${xpEarned} XP${first ? ` · Badge ${story.icon}` : ""}</p>` +
        (mission ? `<p>🎯 Reise-Mission: ${mission.title}</p>` : "")));
      if (storyDone(story.id)) {
        const mBtn = el("button", "btn btn-telha", "🎯 Deine echte Aufgabe dazu ›");
        mBtn.addEventListener("click", () => viewMissione(story));
        host.appendChild(mBtn);
      }
      // Direkt weiter: nächste Lektion des Pfads (Reihenfolge wie im Percorso)
      const si = STORIES.findIndex(x => x.id === story.id);
      const nxt = si >= 0 ? STORIES[si + 1] : null;
      if (nxt) {
        const label = nxt.level === story.level
          ? `▶ Nächste Lektion: ${nxt.icon} ${nxt.title}`
          : `▶ Weiter in ${nxt.level}: ${nxt.icon} ${nxt.title}`;
        const nextBtn = el("button", "btn btn-primary", label);
        nextBtn.addEventListener("click", () => startStory(nxt));
        host.appendChild(nextBtn);
      } else {
        host.appendChild(el("p", "view-sub", `🎉 Percorso completo — alle ${STORIES.length} Lektionen geschafft!`));
      }
      const again = el("button", "btn btn-ghost", "Nochmal spielen");
      again.style.marginTop = "10px";
      again.addEventListener("click", () => startStory(story));
      const toPath = el("button", "btn btn-ghost", "Zurück zum Pfad");
      toPath.style.marginTop = "10px";
      toPath.addEventListener("click", viewPercorso);
      host.appendChild(again); host.appendChild(toPath);
    }

    draw();
  }

  /* ============================================================
     MISSIONE — die reale Aufgabe hinter jeder Story
     (Zuhause aussprechen · Vor Ort erleben · Schreiben)
     ============================================================ */
  function viewMissione(story) {
    const m = storyMission(story);
    const recKey = `memo_${m.id}`;
    const done = missionDone(m.id);
    const wrap = el("div");
    const back = el("button", "back", "‹ Zurück");
    back.addEventListener("click", viewHome);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", `${story.icon} ${m.title}`));
    wrap.appendChild(el("p", "view-sub", done ? "Erledigt — kannst du jederzeit wiederholen." : `Freigeschaltet durch „${story.title}“. Jetzt die echte Welt.`));

    const card = el("div", "drill-card");
    card.appendChild(el("div", "listen-instr", `Dein Satz (${m.source}):`));
    card.appendChild(el("div", "scene-it", m.say));
    if (m.de) card.appendChild(el("div", "scene-de", m.de));
    const pr = el("div"); pr.style.marginTop = "8px"; pr.appendChild(playBtn(m.say, m.audioKey || recKey));
    card.appendChild(pr);
    wrap.appendChild(card);

    /* Variante 1: Zuhause laut sagen + optional Memo */
    wrap.appendChild(el("div", "section-h", "1 · Zuhause: Sag es laut"));
    const home1 = el("p", "view-sub", "Spiel den Satz ab und sprich laut nach — dreimal. Dein Ohr ist die Prüfung.");
    wrap.appendChild(home1);
    const status = el("p", "tense-note", done ? "Zuvor schon erledigt ✓" : "");
    let audioEl = null;
    if (canRecord) {
      const recBtn = el("button", "btn btn-ghost", "🎙️ Memo aufnehmen");
      recBtn.addEventListener("click", async () => {
        if (recBtn.dataset.rec === "1") { recBtn._media.stop(); return; }
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mr = new MediaRecorder(stream);
          const chunks = [];
          mr.ondataavailable = e => chunks.push(e.data);
          mr.onstop = async () => {
            stream.getTracks().forEach(t => t.stop());
            const blob = new Blob(chunks, { type: mr.mimeType || "audio/webm" });
            await saveMemo(recKey, blob);
            recBtn.dataset.rec = "0";
            recBtn.textContent = "🎙️ Neu aufnehmen";
            status.textContent = "Memo gespeichert ✓ — hör es dir an und vergleiche mit dem Original.";
            if (audioEl) audioEl.remove();
            audioEl = new Audio(URL.createObjectURL(blob));
            audioEl.controls = true; audioEl.style.width = "100%"; audioEl.style.marginTop = "8px";
            card.appendChild(audioEl);
          };
          mr.start();
          recBtn.dataset.rec = "1"; recBtn._media = mr;
          recBtn.textContent = "⏹️ Aufnahme beenden";
          status.textContent = "Aufnahme läuft … Satz laut sagen!";
        } catch {
          status.textContent = "Mikrofon nicht verfügbar — sag den Satz einfach laut und tippe unten ✓.";
        }
      });
      wrap.appendChild(recBtn);
      MEMODB.get(recKey).then(entry => {
        if (entry && !audioEl) {
          status.textContent = "Du hast ein Memo zu dieser Mission.";
          audioEl = new Audio(URL.createObjectURL(entry.blob));
          audioEl.controls = true; audioEl.style.width = "100%"; audioEl.style.marginTop = "8px";
          card.appendChild(audioEl);
        }
      }).catch(() => {});
    } else {
      wrap.appendChild(el("p", "view-sub", "Aufnahmen funktionieren in dieser Umgebung nicht — sag den Satz laut und bestätige unten."));
    }
    wrap.appendChild(status);

    /* Variante 2: Vor Ort (mit Reisedatum) */
    if (settings.tripDate) {
      wrap.appendChild(el("div", "section-h", "2 · Vor Ort in Italien"));
      wrap.appendChild(el("p", "view-sub", `Reise geplant ab ${settings.tripDate}. Nutze diesen Satz echt — an der Bar, am Schalter, wo immer er passt. Vor Ort zählt: mutig sein, nicht perfekt.`));
    }

    /* Abschluss */
    const doneRow = el("div", "grade-row");
    const okBtn = el("button", "btn btn-primary", done ? "✓ Wiederholt — zählt" : "✓ Geschafft (laut gesagt)");
    okBtn.addEventListener("click", () => {
      const st = missionState(); st[m.id] = { when: Date.now() }; LS.set("ciaoit_missions", st);
      bumpOutput("missionen"); bumpSkill("sprechen"); markPractice(1); addXP(25);
      toast("Mission erledigt! +25 XP 🎯");
      setTimeout(viewHome, 700);
    });
    doneRow.appendChild(okBtn);
    wrap.appendChild(doneRow);

    /* Variante 3: Schreiben (eigene Variante → Tagebuch) */
    wrap.appendChild(el("div", "section-h", "3 · Schreiben: Deine eigene Variante"));
    wrap.appendChild(el("p", "view-sub", "Formuliere den Satz auf deine Art — eigene Sätze bleiben am besten hängen."));
    const ta = el("textarea", "search-input diario-input");
    ta.rows = 2; ta.placeholder = "z. B. " + m.say;
    ta.setAttribute("aria-label", "Eigener italienischer Satz");
    wrap.appendChild(ta);
    const saveBtn = el("button", "btn btn-ghost", "📝 In mein Sprachtagebuch");
    saveBtn.style.marginTop = "8px";
    saveBtn.addEventListener("click", () => {
      const t = (ta.value || "").trim();
      if (t.length < 4) { toast("Schreib zuerst einen Satz"); return; }
      diarioAdd(t);
      toast("Im Tagebuch — kommt ins Wiederholen ✓");
      ta.value = "";
    });
    wrap.appendChild(saveBtn);
    render(wrap);
  }

  /* ============================================================
     PASSAPORTO — dein Können als Profil (statt Zeit-in-App)
     ============================================================ */
  function viewPassaporto() {
    const wrap = el("div");
    wrap.appendChild(el("h2", "view-title", "Passaporto"));
    wrap.appendChild(el("p", "view-sub", "Was du schon kannst — deine Ausgaben, deine Sätze, deine Missionen."));

    /* Serie (entgiftet): Rekord für immer */
    const s = streak();
    const sc = el("div", "streak-card");
    sc.appendChild(el("div", "streak-flame", s.count > 0 ? "🔥" : "💤"));
    const sinfo = el("div", "streak-info grow");
    sinfo.appendChild(el("div", "streak-num", `Aktuell ${s.count} · Rekord ${s.best || 0} Tage`));
    sinfo.appendChild(el("div", "streak-sub", "Der Rekord bleibt für immer — ein ruhender Tag pro Woche ist eingeplant."));
    sc.appendChild(sinfo);
    wrap.appendChild(sc);

    /* Coniugazione: Bilanz des Tages-Rituals */
    const cs = conjStats();
    if (cs.total > 0) {
      const pct = Math.round(cs.first / (cs.total * 6) * 100);
      let weakest = null;
      for (let p = 0; p < 6; p++) {
        if (cs.asked[p] >= 3) {
          const q = cs.hit[p] / cs.asked[p];
          if (!weakest || q < weakest.q) weakest = { p, q };
        }
      }
      const cc = el("div", "streak-card");
      cc.appendChild(el("div", "streak-flame", "☕"));
      const cinfo = el("div", "streak-info grow");
      cinfo.appendChild(el("div", "streak-num", `${cs.total} Konjugation${cs.total === 1 ? "" : "en"} · ${pct} % beim ersten Versuch`));
      cinfo.appendChild(el("div", "streak-sub", weakest
        ? `Schwächste Person: ${PRON[weakest.p]} (${Math.round(weakest.q * 100)} %)`
        : "Jede Person kommt dran — die Bilanz wächst Tag für Tag."));
      cc.appendChild(cinfo);
      wrap.appendChild(cc);
    }

    /* Kompetenz-Radar (Balken) */
    wrap.appendChild(el("div", "section-h", "Kompetenzen"));
    const sk = skills();
    const maxV = Math.max(10, sk.hoeren, sk.lesen, sk.sprechen, sk.schreiben);
    const rows = [["Hören", sk.hoeren, "🔊"], ["Lesen", sk.lesen, "📖"], ["Sprechen", sk.sprechen, "🗣️"], ["Schreiben", sk.schreiben, "✍️"]];
    rows.forEach(([label, v, ico]) => {
      const row = el("div", "skill-row");
      row.appendChild(el("span", "skill-ico", ico));
      const bar = el("div", "skill-bar");
      const fill = el("div", "skill-fill");
      fill.style.width = `${Math.min(100, Math.round(v / maxV * 100))}%`;
      bar.appendChild(fill);
      row.appendChild(bar);
      row.appendChild(el("span", "skill-num", String(v)));
      row.setAttribute("title", `${label}: ${v}`);
      wrap.appendChild(row);
    });
    wrap.appendChild(el("p", "view-sub", "Aus echten Übungen: Hören = Hör-Aufgaben, Lesen = Erkennen/Bauen, Sprechen = Missionen & Memos, Schreiben = Produzieren & Tagebuch."));

    /* Ausgabe-Zähler */
    const o = output();
    const wk = (o.week && o.week.start === isoWeekKey()) ? o.week : { satze: 0, missionen: 0, memos: 0, diario: 0 };
    const statGrid = el("div", "stat-grid");
    statGrid.appendChild(stat(o.total, "Sätze produziert"));
    statGrid.appendChild(stat((wk.satze || 0) + (wk.diario || 0), "diese Woche"));
    statGrid.appendChild(stat(wk.missionen || 0, "Missionen / Woche"));
    wrap.appendChild(statGrid);

    /* Szenarien (abgeschlossene Lektionen = Können) */
    const doneStories = STORIES.filter(x => storyDone(x.id));
    wrap.appendChild(el("div", "section-h", `Szenarien gemeistert · ${doneStories.length}/${STORIES.length}`));
    if (doneStories.length) {
      const chips = el("div", "badge-shelf");
      doneStories.forEach(x => chips.appendChild(el("span", "badge", x.icon)));
      wrap.appendChild(chips);
      const list = el("div", "card");
      doneStories.slice(-8).reverse().forEach(x => {
        const row = el("div", "row");
        row.appendChild(el("span", "mico", x.icon));
        row.appendChild(el("div", "grow", `<div class="pt">${x.title}</div><div class="de">${x.level}</div>`));
        list.appendChild(row);
      });
      wrap.appendChild(list);
    } else {
      wrap.appendChild(el("p", "view-sub", "Noch keine Lektion abgeschlossen — die erste wartet im Percorso."));
    }

    /* Missions-Stempel */
    const st = missionState();
    const stampIds = Object.keys(st);
    wrap.appendChild(el("div", "section-h", `Missions-Stempel · ${stampIds.length}`));
    if (stampIds.length) {
      const list = el("div", "card");
      stampIds.forEach(id => {
        const known = S.missions.find(x => x.id === id);
        const storyMatch = id.startsWith("st_") ? STORIES.find(x => x.id === id.slice(3)) : null;
        const label = known ? known.title : storyMatch ? `Eigene Mission: ${storyMatch.title}` : id;
        const row = el("div", "row");
        row.appendChild(el("span", "mico", "🎯"));
        row.appendChild(el("div", "grow", `<div class="pt">${label}</div>`));
        list.appendChild(row);
      });
      wrap.appendChild(list);
    } else {
      wrap.appendChild(el("p", "view-sub", "Noch keine Mission in der echten Welt erledigt — die erste wartet auf der Startseite."));
    }

    /* Memos */
    wrap.appendChild(el("div", "section-h", "Deine Sprachmemos"));
    // Immer ein Ergebnis: Liste oder Leer-Hinweis — auch bei IDB-Fehler/Timeout
    (async () => {
      const keys = await Promise.race([
        MEMODB.keys(),
        new Promise(r => setTimeout(() => r(null), 2000))
      ]).catch(() => null);
      if (!keys || !keys.length) {
        wrap.appendChild(el("p", "view-sub", "Noch keine Aufnahmen. Missions-Seite → 🎙️ Memo aufnehmen."));
        return;
      }
      const list = el("div", "card");
      keys.forEach(key => {
        const row = el("div", "row");
        const play = el("button", "play", "▶");
        play.addEventListener("click", async () => {
          const entry = await MEMODB.get(key);
          if (entry) new Audio(URL.createObjectURL(entry.blob)).play();
        });
        row.appendChild(play);
        row.appendChild(el("div", "grow", `<div class="pt">${key.replace("memo_", "").replace(/_/g, " ")}</div>`));
        list.appendChild(row);
      });
      wrap.appendChild(list);
    })();

    /* Tagebuch */
    const dia = diario();
    wrap.appendChild(el("div", "section-h", "Sprachtagebuch"));
    if (dia.length) {
      const list = el("div", "card");
      dia.slice(-6).reverse().forEach(entry => {
        const row = el("div", "row");
        row.appendChild(el("div", "grow", `<div class="pt">${entry.t}</div><div class="de">${entry.d}</div>`));
        row.appendChild(playBtn(entry.t, `diario_${entry.d}`));
        list.appendChild(row);
      });
      wrap.appendChild(list);
      const more = el("button", "btn btn-ghost", "✍️ Satz für heute schreiben");
      more.style.marginTop = "10px";
      more.addEventListener("click", () => viewMissione(STORIES.find(x => storyDone(x.id)) || STORIES[0]));
      wrap.appendChild(more);
    } else {
      wrap.appendChild(el("p", "view-sub", "Sette giorni, sette frasi: schreibe täglich einen eigenen Satz — auf einer Missions-Seite."));
    }

    /* Sincronizzazione: Fortschritt auf dem Server sichern */
    wrap.appendChild(el("div", "section-h", "☁️ Sincronizzazione — Server-Backup"));
    const syncCard = el("div", "card");
    syncCard.style.padding = "14px";
    const codeIn = el("input", "search-input");
    codeIn.type = "password";
    codeIn.placeholder = "Sync-Code (mindestens 6 Zeichen)";
    codeIn.value = settings.syncCode || "";
    codeIn.style.marginBottom = "10px";
    codeIn.setAttribute("aria-label", "Sync-Code");
    const syncStatus = el("div", "view-sub");
    function drawSyncStatus() {
      const s = syncState();
      const fmt = t => t ? new Date(t).toLocaleString("de-DE") : null;
      syncStatus.innerHTML = s.lastPush
        ? `Zuletzt gesichert: <b>${fmt(s.lastPush)}</b>${s.lastPull ? ` · geladen: ${fmt(s.lastPull)}` : ""}`
        : "Noch nicht gesichert — Fortschritt liegt nur auf diesem Gerät.";
    }
    drawSyncStatus();
    const syncBtns = el("div", "btn-row");
    const connectBtn = el("button", "btn btn-primary", settings.syncCode ? "Jetzt sichern ☁️" : "Verbinden & sichern");
    connectBtn.addEventListener("click", async () => {
      const v = codeIn.value.trim();
      if (v.length < 6) { toast("Sync-Code: mindestens 6 Zeichen"); return; }
      settings.syncCode = v; saveSettings();
      connectBtn.disabled = true; syncStatus.textContent = "Sichere auf den Server …";
      const r = await syncPush(true).catch(e => ({ ok: false, error: String(e && e.message || e) }));
      connectBtn.disabled = false; drawSyncStatus();
      toast(r.ok ? "Fortschritt gesichert ✓" : "Sync fehlgeschlagen: " + (r.error || "unbekannt"));
    });
    const pullBtn = el("button", "btn btn-ghost", "Vom Server laden");
    pullBtn.addEventListener("click", async () => {
      if (!settings.syncCode) {
        const v = codeIn.value.trim();
        if (v.length < 6) { toast("Erst Sync-Code eingeben"); return; }
        settings.syncCode = v; saveSettings();
      }
      if (!window.confirm("Der Server-Stand ersetzt die Daten auf diesem Gerät. Weiter?")) return;
      pullBtn.disabled = true; syncStatus.textContent = "Lade vom Server …";
      const r = await syncPull(true).catch(() => ({ ok: false }));
      if (r && r.applied) { location.reload(); return; }
      pullBtn.disabled = false; drawSyncStatus();
      toast(r && r.empty ? "Noch keine Daten auf dem Server." : "Laden fehlgeschlagen.");
    });
    syncBtns.appendChild(connectBtn); syncBtns.appendChild(pullBtn);
    syncCard.appendChild(codeIn);
    syncCard.appendChild(syncBtns);
    syncCard.appendChild(syncStatus);
    syncCard.appendChild(el("p", "view-sub", "Alles bleibt zusätzlich lokal (offline nutzbar). Nach jedem Lernen wird automatisch gesichert; beim App-Start wird ein neuerer Server-Stand geladen."));
    wrap.appendChild(syncCard);
    render(wrap);
  }

  /* ============================================================
     ORECCHIE — Hör-Geschichten (graded input)
     Drei Tempi, Satz für Satz, Übersetzung per Tap.
     ============================================================ */
  function viewOrecchie() {
    const eps = window.IT_LISTENING || [];
    const wrap = el("div");
    const back = el("button", "back", "‹ Allenamento");
    back.addEventListener("click", viewTrain);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", "Orecchie"));
    wrap.appendChild(el("p", "view-sub", "Hör-Geschichten: erst nur hören, dann Satz für Satz aufklappen. Input ist der Dünger für dein Italienisch."));
    let levelFilter = null;
    const host = el("div"); wrap.appendChild(host);
    function drawEps() {
      host.innerHTML = "";
      const chips = el("div", "tabs");
      [["Alle", null], ["A1", "A1"], ["A2", "A2"], ["B1", "B1"]].forEach(([label, lv]) => {
        const n = lv ? eps.filter(ep => (ep.level || "A1") === lv).length : eps.length;
        const c = el("button", "chip" + (levelFilter === lv ? " active" : ""), `${label} · ${n}`);
        c.addEventListener("click", () => { levelFilter = lv; drawEps(); });
        chips.appendChild(c);
      });
      host.appendChild(chips);
      const list = el("div", "path");
      eps.filter(ep => !levelFilter || (ep.level || "A1") === levelFilter).forEach(ep => {
        const lvl = ep.level || "A1";
        const card = el("button", "story-card");
        card.appendChild(el("span", "story-ico", ep.icon));
        const g = el("div", "grow");
        const name = el("div", "story-name");
        name.appendChild(document.createTextNode(ep.title));
        name.appendChild(el("span", "lv " + lvl, lvl));
        g.appendChild(name);
        g.appendChild(el("div", "story-sub", `${ep.lines.length} Sätze · ca. 2 Minuten`));
        card.appendChild(g);
        card.appendChild(el("span", "story-go", "▶"));
        card.addEventListener("click", () => viewOrecchieEp(ep));
        list.appendChild(card);
      });
      host.appendChild(list);
    }
    drawEps();
    render(wrap);
  }

  function viewOrecchieEp(ep) {
    const wrap = el("div");
    const back = el("button", "back", "‹ Orecchie");
    back.addEventListener("click", viewOrecchie);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", `${ep.icon} ${ep.title}`));
    const epLevel = ep.level || "A1";
    const epMeta = el("p", "view-sub lvl-row");
    epMeta.appendChild(el("span", "lv " + epLevel, epLevel));
    epMeta.appendChild(el("span", null, "Erst Tempo wählen und hören — dann Satz für Satz die Übersetzung aufklappen."));
    wrap.appendChild(epMeta);

    let rate = 0.6;
    const tabs = el("div", "tabs");
    [["🐢 Lento", 0.6], ["Normale", 0.85], ["Veloce", 1.05]].forEach(([label, r], i) => {
      const c = el("button", "chip" + (i === 0 ? " active" : ""), label);
      c.addEventListener("click", () => {
        rate = r;
        [...tabs.children].forEach(x => x.classList.remove("active"));
        c.classList.add("active");
      });
      tabs.appendChild(c);
    });
    wrap.appendChild(tabs);

    const card = el("div", "card");
    ep.lines.forEach((ln, i) => {
      const row = el("div", "row");
      const play = el("button", "play", "▶");
      play.addEventListener("click", () => speak(ln.it, `ore_${ep.id}_${i}`, rate));
      row.appendChild(play);
      const g = el("div", "grow");
      g.appendChild(el("div", "pt", ln.it));
      const de = el("div", "de hidden", ln.de);
      g.appendChild(de);
      row.appendChild(g);
      row.addEventListener("click", () => de.classList.toggle("hidden"));
      card.appendChild(row);
    });
    wrap.appendChild(card);

    const all = el("button", "btn btn-primary", "▶︎ Ganze Geschichte hören");
    all.addEventListener("click", () => {
      ep.lines.forEach((ln, i) => setTimeout(() => speak(ln.it, `ore_${ep.id}_${i}`, rate), i * 4200));
    });
    all.style.marginTop = "12px";
    wrap.appendChild(all);

    const fin = el("button", "btn btn-telha", "🎧 Verstanden — abschließen (+15 XP)");
    fin.style.marginTop = "10px";
    fin.addEventListener("click", () => {
      bumpSkill("hoeren"); markPractice(ep.lines.length); addXP(15);
      toast("Ottimo ascolto! 🎧");
      setTimeout(viewTrain, 700);
    });
    wrap.appendChild(fin);
    render(wrap);
    speak(ep.lines[0].it, `ore_${ep.id}_0`, rate);
  }

  /* ============================================================
     SAPERE — Aussprache, Grammatik, Redewendungen
     ============================================================ */
  const PHRASES = window.IT_PHRASES || [];
  const phraseKey = (catId, pt) => `phr_${catId}_${slug(pt)}`;
  const PHRASE_POOL = [];
  PHRASES.forEach(cat => cat.items.forEach(p => {
    PHRASE_POOL.push({ key: phraseKey(cat.id, p.it), pt: p.it, de: p.de, hint: p.hint || "", cat: cat.id });
  }));
  function frasiStats(pool) {
    const s = srs(), now = Date.now();
    let due = 0, fresh = 0, ripe = 0;
    pool.forEach(p => {
      const r = s[p.key];
      if (!r) fresh++; else if (r.due <= now) due++;
      if (r && r.box >= 5) ripe++;
    });
    return { due, fresh, ripe };
  }

  function viewSapere() {
    const wrap = el("div");
    wrap.appendChild(el("h2", "view-title", "Sapere"));
    wrap.appendChild(el("p", "view-sub", "Verstehen statt raten — Aussprache-Regeln, Grammatik und feste Wendungen, alles mit Audio."));
    const mkS = (cls, label, fn, sub) => {
      const b = el("button", "btn " + cls, label); b.addEventListener("click", fn);
      const w = el("div", "mode-item"); w.appendChild(b);
      if (sub) w.appendChild(el("div", "mode-sub", sub));
      return w;
    };
    wrap.appendChild(mkS("btn-telha", "🔤 Aussprache", viewPronuncia,
      "12 Regeln mit Hörbeispielen: gn, gli, g/ggio, c/ch, sc, Doppelkonsonanten …"));
    wrap.appendChild(mkS("btn-primary", "✎ Grammatik: Possessivpronomen", viewGrammatica,
      "il mio, la mia, il suo … — warum die Form zum Ding gehört, nicht zum Besitzer."));
    const fs = frasiStats(PHRASE_POOL);
    wrap.appendChild(mkS("btn-ghost", "💬 Redewendungen", viewFrasi,
      `${PHRASE_POOL.length} Wendungen für den Alltag · Karten & Multiple Choice${fs.due ? ` · ${fs.due} fällig` : ""}`));
    render(wrap);
  }

  function viewPronuncia() {
    const wrap = el("div");
    const back = el("button", "back", "‹ Sapere"); back.addEventListener("click", viewSapere);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", "🔤 Aussprache"));
    wrap.appendChild(el("p", "view-sub", "Die Regeln, mit denen du fast jedes Wort richtig liest — tippe auf ▶ und höre hin."));
    const card = el("div", "card");
    (D.pronunciation || []).forEach(rule => {
      const block = el("div", "pron-rule");
      block.appendChild(el("div", "pron-title", rule.title));
      block.appendChild(el("div", "pron-text", rule.rule));
      rule.examples.forEach(ex => {
        const row = el("div", "pron-ex");
        row.appendChild(playBtn(ex.it, `pron_${rule.id}_${slug(ex.it)}`));
        const t = el("div", "grow");
        t.appendChild(el("div", "pt", ex.it));
        t.appendChild(el("div", "de", ex.de));
        row.appendChild(t);
        block.appendChild(row);
      });
      card.appendChild(block);
    });
    wrap.appendChild(card);
    render(wrap);
  }

  function viewGrammatica() {
    const wrap = el("div");
    const back = el("button", "back", "‹ Sapere"); back.addEventListener("click", viewSapere);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", "✎ Grammatica"));
    wrap.appendChild(el("p", "view-sub", "Klare Erklärungen mit Tabelle und Beispielsätzen — zum Nachschlagen und Anhören."));
    (D.grammar || []).forEach(topic => {
      wrap.appendChild(el("div", "section-h", topic.title));
      wrap.appendChild(el("p", "view-sub", topic.intro));
      const tbl = el("div", "gram-table");
      tbl.appendChild(el("div", "gh", "Person"));
      tbl.appendChild(el("div", "gh", "m. Sg."));
      tbl.appendChild(el("div", "gh", "f. Sg."));
      tbl.appendChild(el("div", "gh", "m. Pl."));
      tbl.appendChild(el("div", "gh", "f. Pl."));
      topic.forms.forEach(f => {
        tbl.appendChild(el("div", "who", f.who));
        tbl.appendChild(el("div", null, f.m));
        tbl.appendChild(el("div", null, f.f));
        tbl.appendChild(el("div", null, f.mp));
        tbl.appendChild(el("div", null, f.fp));
      });
      wrap.appendChild(tbl);
      (topic.notes || []).forEach(n => wrap.appendChild(el("div", "gram-note", n)));
      wrap.appendChild(el("div", "section-h", "Beispiele"));
      const card = el("div", "card");
      topic.examples.forEach(ex => {
        const row = el("div", "pron-ex");
        row.appendChild(playBtn(ex.it, `gram_${topic.id}_${slug(ex.it)}`));
        const t = el("div", "grow");
        t.appendChild(el("div", "pt", ex.it));
        t.appendChild(el("div", "de", ex.de));
        row.appendChild(t);
        card.appendChild(row);
      });
      wrap.appendChild(card);
    });
    render(wrap);
  }

  function startFrasiDrill(pool, backFn, backLabel) {
    runSession("Modi di dire", "Wendung lesen oder hören — die richtige Bedeutung wählen.",
      deckFrom(pool, 20).map(p => {
        const options = shuffle([p.de, ...sampleObjs(pool, 3, p.key).map(x => x.de)]);
        return Math.random() < 0.35
          ? { type: "listen", key: p.key, audioText: p.pt, options, answer: p.de }
          : { type: "mc", key: p.key, prompt: p.pt, options, answer: p.de };
      }), backFn, backLabel);
  }

  function viewFrasi() {
    const wrap = el("div");
    const back = el("button", "back", "‹ Sapere"); back.addEventListener("click", viewSapere);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", "💬 Modi di dire"));
    const fs = frasiStats(PHRASE_POOL);
    wrap.appendChild(el("p", "view-sub",
      `${PHRASE_POOL.length} Redewendungen für den Alltag — Karten und Multiple Choice, mit Leitner-Wiederholung. ` +
      `${fs.due ? `${fs.due} fällig · ` : ""}${fs.fresh} noch neu.`));
    const mixCards = el("button", "btn btn-telha", "🃏 Alle mischen — Karten");
    mixCards.addEventListener("click", () => runFlash(deckFrom(PHRASE_POOL, 20), "‹ Modi di dire", viewFrasi));
    wrap.appendChild(mixCards);
    const mixMc = el("button", "btn btn-primary", "🎲 Alle mischen — Erkennen");
    mixMc.style.marginTop = "10px";
    mixMc.addEventListener("click", () => startFrasiDrill(PHRASE_POOL, viewFrasi, "‹ Modi di dire"));
    wrap.appendChild(mixMc);
    wrap.appendChild(el("div", "section-h", "Nach Thema"));
    const grid = el("div", "grid");
    PHRASES.forEach(cat => {
      const items = PHRASE_POOL.filter(p => p.cat === cat.id);
      const st = frasiStats(items);
      const t = el("button", "cat-tile");
      t.appendChild(el("span", "emoji", cat.icon));
      t.appendChild(el("span", "name", cat.title));
      t.appendChild(el("span", "count", `${items.length} Wendungen · ${st.ripe} gelernt`));
      const bar = el("div", "tile-bar");
      const fill = el("div");
      fill.style.width = `${items.length ? Math.round(st.ripe / items.length * 100) : 0}%`;
      bar.appendChild(fill);
      t.appendChild(bar);
      t.addEventListener("click", () => viewFrasiCat(cat));
      grid.appendChild(t);
    });
    wrap.appendChild(grid);
    render(wrap);
  }

  function viewFrasiCat(cat) {
    const pool = PHRASE_POOL.filter(p => p.cat === cat.id);
    const wrap = el("div");
    const back = el("button", "back", "‹ Modi di dire"); back.addEventListener("click", viewFrasi);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", `${cat.icon} ${cat.title}`));
    const st = frasiStats(pool);
    wrap.appendChild(el("p", "view-sub", `${pool.length} Wendungen · ${st.ripe} gelernt · ${st.due} fällig`));
    const cards = el("button", "btn btn-telha", "🃏 Karten üben");
    cards.addEventListener("click", () => runFlash(deckFrom(pool, pool.length), `‹ ${cat.title}`, () => viewFrasiCat(cat)));
    wrap.appendChild(cards);
    const mc = el("button", "btn btn-primary", "🎲 Erkennen (Multiple Choice)");
    mc.style.marginTop = "10px";
    mc.addEventListener("click", () => startFrasiDrill(pool, () => viewFrasiCat(cat), `‹ ${cat.title}`));
    wrap.appendChild(mc);
    const card = el("div", "card");
    card.style.marginTop = "14px";
    pool.forEach(p => {
      const row = el("div", "pron-ex");
      row.appendChild(playBtn(p.pt, p.key));
      const t = el("div", "grow");
      t.appendChild(el("div", "pt", p.pt));
      t.appendChild(el("div", "de", p.de));
      if (p.hint) t.appendChild(el("div", "de", `💡 ${p.hint}`));
      row.appendChild(t);
      card.appendChild(row);
    });
    wrap.appendChild(card);
    render(wrap);
  }

  /* ============================================================
     ROUTER
     ============================================================ */
  const VIEWS = { percorso: viewPercorso, home: viewHome, vocab: viewVocab, verbs: viewVerbs, sapere: viewSapere, train: viewTrain, viaggio: viewViaggio, passaporto: viewPassaporto };
  function go(name) {
    (VIEWS[name] || viewPercorso)();
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === name));
    history.pushState({ v: name }, "", "#" + name);
    updateConjBanner(); // fängt auch Tageswechsel bei laufender App ab
  }
  document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => go(t.dataset.view)));
  window.addEventListener("hashchange", () => {
    const name = (location.hash || "#percorso").slice(1);
    go(VIEWS[name] ? name : "percorso");
  });

  // Speak toggle
  const st = $("#speakToggle");
  function syncSpeak() { st.textContent = settings.speak ? "🔊" : "🔇"; st.classList.toggle("off", !settings.speak); }
  st.addEventListener("click", () => { settings.speak = !settings.speak; saveSettings(); syncSpeak(); toast(settings.speak ? "Ton an" : "Ton aus"); });
  syncSpeak();

  // Passaporto (Topbar)
  $("#passaportoBtn").addEventListener("click", () => go("passaporto"));

  // Start
  const initial = (location.hash || "#percorso").slice(1);
  go(VIEWS[initial] ? initial : "percorso");

  // Congiuga del giorno: beim ersten Start des Tages abfragen
  if (!conjDoneToday()) openConj();

  // Server-Sync: beim Start neueren Server-Stand holen (falls Code gesetzt)
  if (settings.syncCode && navigator.onLine) {
    syncPull(false).then(r => { if (r && r.applied) location.reload(); }).catch(() => {});
  }

  // Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
