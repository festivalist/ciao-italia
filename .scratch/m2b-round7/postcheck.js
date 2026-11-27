"use strict";
// Post-Check Runde 7: Struktur, Duplikate, 0-3-Stabilität vs. git HEAD
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
global.window = {};
const root = path.resolve(__dirname, "..", "..");
["data.js","vocabulary-a1.js","vocabulary-a2.js","vocabulary-b1.js","verbs-a1.js","verbs-a2.js","verbs-b1.js","sentences.js","phrases.js","stories.js"]
  .forEach((f) => require(path.join(root, f)));
const D = window.IT_DATA, S = window.IT_SENT, ST = window.IT_STORIES || [];
const design = JSON.parse(fs.readFileSync(path.join(__dirname, "design.json"), "utf8"));
const slug = (v) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

// Alte Version aus git HEAD holen (PortableGit-Fallback)
let gitExe = "git";
try { execFileSync("git", ["--version"], { stdio: "ignore" }); }
catch { gitExe = path.join(process.env.LOCALAPPDATA, "Programs", "PortableGit", "cmd", "git.exe"); }
const oldSrc = execFileSync(gitExe, ["show", "HEAD:stories.js"], { cwd: root, maxBuffer: 64 * 1024 * 1024 }).toString("utf8");
// Alte Mini-Sätze (0-3) direkt aus dem HEAD-Quelltext rekonstruieren:
const oldMiniByWordCount = (id) => {
  const m = oldSrc.match(new RegExp(`id: "${id.replace(/-/g, "\\-")}"[\\s\\S]*?sentences: \\[([\\s\\S]*?)\\],\\n    build: \\[0\\]`));
  if (!m) return null;
  return [...m[1].matchAll(/it: "((?:[^"\\]|\\.)*)", de: "(?:[^"\\]|\\.)*"/g)].map((x) => x[1]);
};

const poolSlugs = new Set(D.categories.flatMap((c) => c.items.map((i) => slug(i.key || i.it))));
const poolKeys = new Set(D.categories.flatMap((c) => c.items.map((i) => `word_${c.id}_${slug(i.key || i.it)}`)));
const corpus = [];
ST.forEach((story) => story.sentences.forEach((s, i) => corpus.push({ txt: s.it, where: `story:${story.id}#${i}` })));
S.dialogues.forEach((d) => d.lines.forEach((l, i) => corpus.push({ txt: l.it, where: `dialog:${d.id}#${i}` })));
["checklist","checklistA2","checklistB1"].forEach((k) => (S[k] || []).forEach((item, i) => corpus.push({ txt: item.it, where: `${k}#${i}` })));
(window.IT_LISTENING || []).forEach((e) => e.lines.forEach((l, i) => corpus.push({ txt: l.it, where: `orecchie:${e.id}#${i}` })));
S.missions.forEach((m) => { if (m.say) corpus.push({ txt: m.say, where: `mission:${m.id}` }); });
(window.IT_CHAPTERS || []).forEach((c) => { if (c.say) corpus.push({ txt: c.say, where: `chapter:${c.name}` }); });
(window.IT_PHRASES || []).forEach((c) => c.items.forEach((i) => corpus.push({ txt: i.it, where: `phrase:${c.id}:${i.it}` })));
(D.pronunciation || []).forEach((r) => r.examples.forEach((ex) => corpus.push({ txt: ex.it, where: `pron:${r.id}` })));
(D.grammar || []).forEach((t) => t.examples.forEach((ex) => corpus.push({ txt: ex.it, where: `gram:${t.id}` })));
const corpusIndex = new Map();
corpus.forEach((c) => { const k = c.txt.trim(); if (!corpusIndex.has(k)) corpusIndex.set(k, []); corpusIndex.get(k).push(c.where); });

let problems = 0;
const fail = (msg) => { problems++; console.log("PROBLEM: " + msg); };
const miniCount = {};
["A1","A2","B1"].forEach((lv) => { miniCount[lv] = ST.filter((s) => s.level === lv && s.mini).length; });
console.log("Minis je Level:", JSON.stringify(miniCount));

for (const lesson of design.lessons) {
  const story = ST.find((s) => s.id === lesson.id);
  console.log(`\n=== ${lesson.id} ===`);
  if (story.mini) fail(`${lesson.id}: mini:true noch gesetzt`);
  if (/\bMini\b/.test(story.title)) fail(`${lesson.id}: Titel enthält noch "Mini": ${story.title}`);
  if (story.words.length !== 8) fail(`${lesson.id}: ${story.words.length} Wörter (erwartet 8)`);
  if (story.sentences.length !== 7) fail(`${lesson.id}: ${story.sentences.length} Sätze (erwartet 7)`);
  if (JSON.stringify(story.build) !== JSON.stringify([0, 4, 5])) fail(`${lesson.id}: build falsch: ${JSON.stringify(story.build)}`);
  if (JSON.stringify(story.produce) !== JSON.stringify([1, 2, 6])) fail(`${lesson.id}: produce falsch: ${JSON.stringify(story.produce)}`);

  // Indizes 0-3 + Wortkarten 0-5 byte-identisch zu HEAD
  const oldIts = oldMiniByWordCount(lesson.id);
  if (!oldIts || oldIts.length !== 4) { fail(`${lesson.id}: alte Sätze 0-3 nicht aus HEAD rekonstruiert`); }
  else {
    for (let i = 0; i < 4; i++) {
      if (story.sentences[i].it !== oldIts[i]) fail(`${lesson.id}: Satz ${i} verändert! alt="${oldIts[i]}" neu="${story.sentences[i].it}"`);
    }
    console.log(`  Sätze 0-3 identisch zu HEAD: ${story.sentences.slice(0, 4).map((s, i) => s.it === oldIts[i]).every(Boolean) ? "OK" : "FEHLER"}`);
  }

  // Neue Karten: key vorhanden oder lokal eindeutig; Story-intern eindeutig
  const storySlugs = new Set(story.words.map((w) => slug(w.it)));
  if (storySlugs.size !== story.words.length) fail(`${lesson.id}: Wort-Slugs innerhalb der Story doppelt`);
  story.words.slice(6).forEach((w) => {
    if (w.key && !poolKeys.has(w.key)) fail(`${lesson.id}: Key ${w.key} fehlt im Pool`);
    if (!w.key && poolSlugs.has(slug(w.it))) fail(`${lesson.id}: "${w.it}" ohne key, aber Pool-Slug — SRS-Link wäre story-übergreifend ungewollt?`);
  });

  // Sätze 4-6: gegen ALLES prüfen, aber eigene Story-Sätze ausnehmen
  lesson.newSentences.forEach((s, j) => {
    if (story.sentences[4 + j].it !== s.it) fail(`${lesson.id}: Satz ${4 + j} stimmt nicht mit Design überein`);
    const hits = (corpusIndex.get(s.it.trim()) || []).filter((w) => !w.startsWith(`story:${lesson.id}#`));
    if (hits.length) fail(`${lesson.id}: Duplikat "${s.it}" → ${hits.join(", ")}`);
  });
  console.log(`  7 Sätze: ${story.sentences.map((s) => s.it.split(/\s+/).length).join("+")} Wörter`);
}

// Story-lokale Deckerwörter global eindeutig (validate macht das auch — Double-Check)
const localMap = new Map();
ST.forEach((story) => story.words.forEach((w) => {
  if (w.key || poolSlugs.has(slug(w.it))) return;
  const s = slug(w.it);
  if (localMap.has(s)) fail(`Deckerwort "${w.it}" doppelt: ${localMap.get(s)} & ${story.id}`);
  localMap.set(s, story.id);
}));

console.log(`\n--- Ergebnis: ${problems} Problem(e) ---`);
process.exit(problems ? 1 : 0);
