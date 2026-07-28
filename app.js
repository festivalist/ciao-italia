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
    set(k, v)   { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
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
  function speak(text, key) {
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
      // 2) Fallback: Gerätesprachausgabe (it-IT)
      if (!window.speechSynthesis) return;
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "it-IT"; u.rate = 0.9;
        if (ttsVoice) u.voice = ttsVoice;
        speechSynthesis.speak(u);
      } catch {}
    });
  }
  function hasAudioFlag(key) { return key in audioCache && !audioCache[key].error; }

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
  function grade(key, knew) {
    const s = srs();
    const r = s[key] || { box: 1 };
    r.box = knew ? Math.min(INTERVALS.length, (r.box || 1) + 1) : 1;
    r.due = Date.now() + INTERVALS[r.box - 1] * DAY;
    s[key] = r; srsSave(s);
    markPractice(1);
  }
  /* ---------- Streak & Tagesziel (reise-bewusst, läuft danach weiter) ---------- */
  const DAILY_GOAL = 15; // Übungen pro Tag
  function ymd(d) {
    d = d || new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  function daysApart(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / DAY); }
  function streak() { return LS.get("ciaoit_streak", { last: null, count: 0, freezes: 2, day: null, todayCount: 0, best: 0 }); }
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
        else s.count = 1;
      }
      s.last = today;
      s.best = Math.max(s.best || 0, s.count);
    }
    LS.set("ciaoit_streak", s);
  }
  function goalToday() { const s = streak(); return s.day === ymd() ? s.todayCount : 0; }

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
    return due.concat(fresh).concat(later).slice(0, 20);
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

    // Streak + Tagesziel
    const stk = streak(); const todayN = goalToday();
    const sc = el("div", "streak-card");
    sc.appendChild(el("div", "streak-flame", todayN > 0 || stk.count > 0 ? "🔥" : "💤"));
    const sinfo = el("div", "streak-info grow");
    sinfo.appendChild(el("div", "streak-num", `${stk.count} ${stk.count === 1 ? "Tag" : "Tage"} am Stück`));
    sinfo.appendChild(el("div", "streak-sub", `Heute ${Math.min(todayN, DAILY_GOAL)}/${DAILY_GOAL} Übungen${stk.freezes ? ` · ❄️ ${stk.freezes}` : ""}`));
    sc.appendChild(sinfo);
    const ring = el("div", "goal-ring"); ring.style.setProperty("--p", Math.min(100, Math.round(todayN / DAILY_GOAL * 100)));
    ring.appendChild(el("span", null, todayN >= DAILY_GOAL ? "✓" : String(Math.max(0, DAILY_GOAL - todayN))));
    sc.appendChild(ring);
    wrap.appendChild(sc);

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
    menu.appendChild(b1); menu.appendChild(b2);
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
    const wrap = el("div");
    wrap.appendChild(el("h2", "view-title", "Parole"));
    wrap.appendChild(el("p", "view-sub", `${POOL.length} Wörter und Ausdrücke nach Kategorie. Suche auf Italienisch oder Deutsch.`));
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
        const grid = el("div", "grid");
        D.categories.forEach(cat => {
          const t = el("button", "cat-tile");
          t.appendChild(el("span", "emoji", cat.icon));
          t.appendChild(el("span", "name", cat.title));
          t.appendChild(el("span", "count", `${cat.items.length} Wörter`));
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
    const card = el("div", "card");
    cat.items.forEach(it => {
      const key = wordKey(cat.id, it.key || it.it);
      const row = el("div", "row");
      row.appendChild(playBtn(it.it, key));
      const g = el("div", "grow");
      g.appendChild(el("div", "pt", it.it));
      g.appendChild(el("div", "de", it.de));
      row.appendChild(g);
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
    wrap.appendChild(mk("btn-ghost", "🗣️ Satz-Drill (DE → PT)", startSentenceDrill, "Pimsleur: erst selbst sagen, dann auflösen."));
    wrap.appendChild(mk("btn-ghost", "🔁 Zeitform-Flip", startTenseFlip, "Derselbe Satz in Presente, Passato prossimo und Futuro semplice."));
    wrap.appendChild(mk("btn-ghost", "🎙️ Shadowing", startShadow, "Hören und laut nachsprechen."));

    wrap.appendChild(el("div", "section-h", "Warum das wirkt"));
    wrap.appendChild(el("p", "view-sub", "Aktives Abrufen schlägt passives Wiederholen — und gemischte Aufgabentypen wirken am stärksten. Die Wiederholung (Leitner) reicht jetzt bis zwei Monate, damit es auch nach der Reise sitzt."));
    render(wrap);
  }

  /* ---------- Flashcards ---------- */
  function startFlash() {
    const deck = buildDeck();
    if (!deck.length) { toast("Alles wiederholt — boa! 🎉"); return; }
    let i = 0, flipped = false;
    const wrap = el("div");
    const back = el("button", "back", "‹ Allenamento");
    back.addEventListener("click", viewTrain);
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
        const done = el("div", "empty", `<div style="font-size:40px">🎉</div><p>${deck.length} Karten geübt. Muito bem!</p>`);
        const again2 = el("button", "btn btn-primary", "Nochmal");
        again2.addEventListener("click", startFlash);
        fw.appendChild(done); fw.appendChild(again2);
        return;
      }
      flipped = false; flip.classList.remove("flipped");
      const c = deck[i];
      prog.innerHTML = `<span>Karte ${i + 1} / ${deck.length}</span><span>PT → DE</span>`;
      frontBig.textContent = c.pt;
      backBig.textContent = c.de; backSub.textContent = c.pt;
      speak(c.pt, c.key);
    }
    flip.addEventListener("click", () => { flipped = !flipped; flip.classList.toggle("flipped", flipped); if (flipped) speak(deck[i].pt, deck[i].key); });
    again.addEventListener("click", () => { grade(deck[i].key, false); i++; load(); });
    knew.addEventListener("click", () => { grade(deck[i].key, true); i++; load(); });
    render(wrap); load();
  }

  /* ---------- Quiz ---------- */
  function startQuiz() {
    const pool = shuffle(POOL.slice());
    const N = Math.min(10, pool.length);
    let i = 0, score = 0;
    const wrap = el("div");
    const back = el("button", "back", "‹ Allenamento");
    back.addEventListener("click", viewTrain);
    wrap.appendChild(back);
    const host = el("div"); wrap.appendChild(host);
    render(wrap);

    function question() {
      if (i >= N) {
        host.innerHTML = "";
        host.appendChild(el("div", "empty", `<div style="font-size:40px">${score >= N * 0.7 ? "🌟" : "💪"}</div><p>${score} / ${N} richtig</p>`));
        const b = el("button", "btn btn-primary", "Nochmal");
        b.addEventListener("click", startQuiz); host.appendChild(b);
        return;
      }
      const q = pool[i];
      const opts = shuffle([q, ...shuffle(POOL.filter(p => p.key !== q.key)).slice(0, 3)]);
      host.innerHTML = "";
      host.appendChild(el("div", "quiz-score", `Frage ${i + 1} / ${N} · ${score} richtig`));
      const qd = el("div", "quiz-q", q.pt);
      host.appendChild(qd);
      const pb = el("div"); pb.style.textAlign = "center"; pb.style.marginBottom = "8px";
      pb.appendChild(playBtn(q.pt, q.key));
      host.appendChild(pb);
      host.appendChild(el("div", "quiz-prompt", "Was bedeutet das?"));
      opts.forEach(o => {
        const b = el("button", "opt", o.de);
        b.addEventListener("click", () => {
          [...host.querySelectorAll(".opt")].forEach(x => x.disabled = true);
          if (o.key === q.key) { b.classList.add("correct"); score++; }
          else { b.classList.add("wrong"); host.querySelectorAll(".opt").forEach(x => { if (x.textContent === q.de) x.classList.add("correct"); }); }
          setTimeout(() => { i++; question(); }, 850);
        });
        host.appendChild(b);
      });
    }
    question();
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
    const deck = deckFrom(SENT_POOL, 14);
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
      const bt = tenseBadge(c.tense); card.appendChild(bt);
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
      const person = (Math.random() * 5) | 0;
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
    host.appendChild(el("div", "empty", `<div style="font-size:40px">🎉</div><p>${n} geübt. Muito bem!</p>`));
    const a = el("button", "btn btn-primary", "Nochmal"); a.addEventListener("click", again);
    const h = el("button", "btn btn-ghost", "Zurück"); h.style.marginTop = "10px"; h.addEventListener("click", home);
    host.appendChild(a); host.appendChild(h);
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
    if (r < 0.4) {
      const options = shuffle([s.blank, ...sampleVals(ALL_FORMS, 3, s.blank)]);
      return { type: "cloze", key: s.key, full: s.pt, blank: s.blank, de: s.de, options, answer: s.blank };
    }
    if (r < 0.8) return { type: "tiles", key: s.key, pt: s.pt, de: s.de, tokens: s.tokens };
    const options = shuffle([s.de, ...sampleObjs(ALL_SENT, 3, s.key).map(x => x.de)]);
    return { type: "listen", key: s.key, audioText: s.pt, options, answer: s.de };
  }

  function runSession(title, sub, exercises, backFn) {
    let i = 0, correct = 0;
    const wrap = el("div");
    const back = el("button", "back", "‹ Allenamento"); back.addEventListener("click", backFn || viewTrain); wrap.appendChild(back);
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
  function reroll(ex) { return ex; } // Platzhalter (Reihenfolge bleibt, Inhalt stabil)

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
  function renderTiles(host, ex, done) {
    const card = el("div", "drill-card");
    card.appendChild(el("div", "tiles-de", ex.de));
    const answer = el("div", "tiles-answer"); const bank = el("div", "tiles-bank");
    card.appendChild(answer); card.appendChild(bank); host.appendChild(card);
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
      const ok = chosen.join(" ") === ex.tokens.join(" ");
      const res = el("div", "tiles-result " + (ok ? "good" : "bad")); res.textContent = (ok ? "Giusto! " : "Richtig: ") + ex.pt;
      card.appendChild(res); speak(ex.pt, ex.key); grade(ex.key, ok);
      check.disabled = true; reset.disabled = true;
      setTimeout(() => done(ok), 1300);
    });
    ctrl.appendChild(reset); ctrl.appendChild(check); host.appendChild(ctrl);
  }

  // Einstiegspunkte der Modi
  function startMix()   { runSession("Misch-Training", "Wechselnde Aufgaben: wählen, hören, Lücke füllen, Satz bauen.", deckFrom(WORD_SRC.concat(ALL_SENT), 14).map(makeExercise), viewTrain); }
  function startTiles() { runSession("Satzbau", "Tippe die Wörter in die richtige Reihenfolge.", deckFrom(ALL_SENT, 12).map(s => ({ type: "tiles", key: s.key, pt: s.pt, de: s.de, tokens: s.tokens })), viewTrain); }

  function startShadow() {
    const picks = deckFrom(WORD_SRC.concat(ALL_SENT), 14); let i = 0;
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
     VIAGEM (Reise-Material): Checkliste + Dialoge
     ============================================================ */
  function viewViaggio() {
    const wrap = el("div");
    wrap.appendChild(el("h2", "view-title", "Viaggio"));
    wrap.appendChild(el("p", "view-sub", "Dein Reisematerial: die wichtigsten Sätze und echte Mini-Dialoge."));
    const b1 = el("button", "btn btn-primary", "✅ Reisecheckliste (30 Sätze)");
    b1.addEventListener("click", viewChecklist);
    wrap.appendChild(b1);
    const bm = el("button", "btn btn-telha", "🗺️ Reise-Missionen");
    bm.style.marginTop = "10px"; bm.addEventListener("click", viewMissions);
    wrap.appendChild(bm);
    wrap.appendChild(el("div", "section-h", "Reise-Dialoge"));
    const grid = el("div", "grid");
    S.dialogues.forEach(dl => {
      const t = el("button", "cat-tile");
      t.appendChild(el("span", "emoji", dl.icon));
      t.appendChild(el("span", "name", dl.title));
      t.appendChild(el("span", "count", `${dl.lines.length} Zeilen`));
      t.addEventListener("click", () => viewDialogue(dl));
      grid.appendChild(t);
    });
    wrap.appendChild(grid);
    render(wrap);
  }

  function checkState() { return LS.get("ciaoit_check", {}); }
  function viewChecklist() {
    const wrap = el("div");
    const back = el("button", "back", "‹ Viaggio"); back.addEventListener("click", viewViaggio);
    wrap.appendChild(back);
    const st = checkState();
    const done = S.checklist.filter((_, i) => st[i]).length;
    wrap.appendChild(el("h2", "view-title", "Reisecheckliste"));
    wrap.appendChild(el("p", "view-sub", `${done} / ${S.checklist.length} sitzen. Antippen zum Anhören, Haken wenn es sitzt.`));
    const bar = el("div", "progbar"); const fill = el("div", "progfill"); fill.style.width = `${(done / S.checklist.length) * 100}%`; bar.appendChild(fill); wrap.appendChild(bar);
    const card = el("div", "card");
    S.checklist.forEach((c, i) => {
      const key = `chk_${i}`;
      const row = el("div", "row chk");
      const box = el("button", "checkbox" + (st[i] ? " on" : ""), st[i] ? "✓" : "");
      box.addEventListener("click", (e) => {
        e.stopPropagation();
        const s = checkState(); s[i] = !s[i]; LS.set("ciaoit_check", s); viewChecklist();
      });
      row.appendChild(box);
      const g = el("div", "grow");
      g.appendChild(el("div", "pt", c.it));
      g.appendChild(el("div", "de", c.de));
      row.appendChild(g);
      row.appendChild(playBtn(c.it, key));
      row.addEventListener("click", () => speak(c.it, key));
      card.appendChild(row);
    });
    wrap.appendChild(card);
    render(wrap);
  }

  function missionState() { return LS.get("ciaoit_missions", {}); }
  function viewMissions() {
    const wrap = el("div");
    const back = el("button", "back", "‹ Viaggio"); back.addEventListener("click", viewViaggio); wrap.appendChild(back);
    const st = missionState();
    const done = S.missions.filter(mn => st[mn.id]).length;
    wrap.appendChild(el("h2", "view-title", "Reise-Missionen"));
    wrap.appendChild(el("p", "view-sub", `${done}/${S.missions.length} erledigt. Echte Aufgaben — vor, während und nach der Reise.`));
    const phases = [["prima", "Vorbereiten"], ["viaggio", "Unterwegs in Italien"], ["dopo", "Nach der Reise — dranbleiben"]];
    phases.forEach(([ph, label]) => {
      const items = S.missions.filter(mn => mn.phase === ph);
      if (!items.length) return;
      wrap.appendChild(el("div", "section-h", label));
      const card = el("div", "card");
      items.forEach(mn => {
        const row = el("div", "row chk");
        const box = el("button", "checkbox" + (st[mn.id] ? " on" : ""), st[mn.id] ? "✓" : "");
        box.addEventListener("click", (e) => { e.stopPropagation(); const s = missionState(); s[mn.id] = !s[mn.id]; LS.set("ciaoit_missions", s); viewMissions(); });
        row.appendChild(box);
        const g = el("div", "grow");
        g.appendChild(el("div", "pt", mn.title));
        if (mn.say) g.appendChild(el("div", "de", `„${mn.say}"`));
        row.appendChild(g);
        if (mn.say) row.appendChild(playBtn(mn.say, `mis_${mn.id}`));
        card.appendChild(row);
      });
      wrap.appendChild(card);
    });
    render(wrap);
  }

  function viewDialogue(dl) {
    const wrap = el("div");
    const back = el("button", "back", "‹ Viaggio"); back.addEventListener("click", viewViaggio);
    wrap.appendChild(back);
    wrap.appendChild(el("h2", "view-title", `${dl.icon} ${dl.title}`));
    const playAll = el("button", "btn btn-ghost", "▶︎ Ganzen Dialog anhören");
    playAll.addEventListener("click", () => speakSequence(dl));
    wrap.appendChild(playAll);
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
  // Spielt einen Dialog Zeile für Zeile (nutzt vorhandene Audio/TTS)
  function speakSequence(dl) {
    if (!settings.speak) { toast("Ton ist aus"); return; }
    let i = 0;
    const go = () => {
      if (i >= dl.lines.length) return;
      const ln = dl.lines[i]; const key = `dlg_${dl.id}_${i}`; i++;
      // nach Datei oder TTS: einfache Taktung über Timeout
      speak(ln.it, key);
      setTimeout(go, Math.max(1400, ln.it.length * 90));
    };
    go();
  }

  /* ============================================================
     ROUTER
     ============================================================ */
  const VIEWS = { home: viewHome, vocab: viewVocab, verbs: viewVerbs, train: viewTrain, viaggio: viewViaggio };
  function go(name) {
    (VIEWS[name] || viewHome)();
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === name));
    history.replaceState({ v: name }, "", "#" + name);
  }
  document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => go(t.dataset.view)));

  // Speak toggle
  const st = $("#speakToggle");
  function syncSpeak() { st.textContent = settings.speak ? "🔊" : "🔇"; st.classList.toggle("off", !settings.speak); }
  st.addEventListener("click", () => { settings.speak = !settings.speak; saveSettings(); syncSpeak(); toast(settings.speak ? "Ton an" : "Ton aus"); });
  syncSpeak();

  // Start
  const initial = (location.hash || "#home").slice(1);
  go(VIEWS[initial] ? initial : "home");

  // Service Worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
