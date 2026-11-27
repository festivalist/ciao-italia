"use strict";
// Pre-Check Runde 7 (A2-Mini→Voll): Key-Existenz, Slug-Kollisionen, Satz-Duplikate
const fs = require("fs");
const path = require("path");
global.window = {};
const root = path.resolve(__dirname, "..", "..");
["data.js","vocabulary-a1.js","vocabulary-a2.js","vocabulary-b1.js","verbs-a1.js","verbs-a2.js","verbs-b1.js","sentences.js","phrases.js","stories.js"]
  .forEach((f) => require(path.join(root, f)));
const D = window.IT_DATA, S = window.IT_SENT, ST = window.IT_STORIES || [];
const design = JSON.parse(fs.readFileSync(path.join(__dirname, "design.json"), "utf8"));
const slug = (v) => v.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

const poolKeys = new Set(D.categories.flatMap((c) => c.items.map((i) => `word_${c.id}_${slug(i.key || i.it)}`)));
const poolSlugs = new Set(D.categories.flatMap((c) => c.items.map((i) => slug(i.key || i.it))));
const poolWordBySlug = new Map();
D.categories.forEach((c) => c.items.forEach((i) => {
  const s = slug(i.key || i.it);
  if (!poolWordBySlug.has(s)) poolWordBySlug.set(s, { it: i.it, de: i.de, key: `word_${c.id}_${s}` });
}));

// Bestehende Story-lokale Deckerwörter (ohne key, Slug nicht im Pool)
const localWordSlugs = new Map();
ST.forEach((story) => story.words.forEach((w) => {
  if (w.key || poolSlugs.has(slug(w.it))) return;
  const s = slug(w.it);
  if (!localWordSlugs.has(s)) localWordSlugs.set(s, []);
  localWordSlugs.get(s).push(story.id);
}));

// Alle existierenden IT-Sätze je Bereich (für exakte Duplikatprüfung)
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

for (const lesson of design.lessons) {
  const story = ST.find((s) => s.id === lesson.id);
  if (!story) { fail(`${lesson.id}: Story nicht gefunden`); continue; }
  if (!story.mini) fail(`${lesson.id}: Story ist schon Voll-Lektion?`);
  console.log(`\n=== ${lesson.id} (aktuell ${story.words.length} Wörter, ${story.sentences.length} Sätze) ===`);

  // (a) Wortkarten: Key-Existenz, Story-interne Slug-Kollisionen, Deckerwort-Kollisionen
  const existingSlugs = new Set(story.words.map((w) => slug(w.it)));
  for (const w of lesson.newWords) {
    const s = slug(w.it);
    if (w.key) {
      if (!poolKeys.has(w.key)) { fail(`${lesson.id}: Key ${w.key} existiert NICHT`); continue; }
      const pool = poolWordBySlug.get(s);
      const matchIt = pool && pool.it === w.it;
      const matchDe = pool && pool.de === w.de;
      console.log(`  Karte "${w.it}" → ${w.key} [Pool: it=${matchIt ? "OK" : "ABWEICHUNG:" + (pool && pool.it)} de=${matchDe ? "OK" : "ABWEICHUNG:" + (pool && pool.de)}]`);
      if (!matchIt || !matchDe) fail(`${lesson.id}: Karte "${w.it}" weicht vom Pool-Eintrag ab`);
    } else {
      console.log(`  Karte "${w.it}" → story-lokal`);
      if (poolSlugs.has(s)) { fail(`${lesson.id}: "${w.it}" ist Pool-Slug — Key-Verweis nutzen!`); continue; }
      if (localWordSlugs.has(s)) fail(`${lesson.id}: Deckerwort "${w.it}" bereits belegt von: ${localWordSlugs.get(s).join(", ")}`);
    }
    if (existingSlugs.has(s)) fail(`${lesson.id}: Slug-Kollision innerhalb der Story: "${w.it}"`);
  }
  const newSlugs = lesson.newWords.map((w) => slug(w.it));
  if (new Set(newSlugs).size !== newSlugs.length) fail(`${lesson.id}: neue Karten untereinander doppelt`);
  // Emoji-Kollisionen innerhalb der Story
  const emojis = new Set(story.words.map((w) => w.emoji));
  lesson.newWords.forEach((w) => {
    if (emojis.has(w.emoji)) fail(`${lesson.id}: Emoji-Kollision "${w.emoji}" (${w.it})`);
    emojis.add(w.emoji);
  });

  // (b) exakte Satz-Duplikate
  for (const s of lesson.newSentences) {
    const hits = corpusIndex.get(s.it.trim());
    if (hits) fail(`${lesson.id}: Satz-Duplikat "${s.it}" → ${hits.join(", ")}`);
    // zusätzlich: gleicher Satz schon in derselben Lektion?
    if (story.sentences.some((x) => x.it === s.it)) fail(`${lesson.id}: Satz "${s.it}" existiert in der Ziel-Story`);
    if (!/[.!?]$/.test(s.it.trim())) fail(`${lesson.id}: Satz ohne Satzzeichen: "${s.it}"`);
    if (!s.de.trim()) fail(`${lesson.id}: fehlende DE-Übersetzung`);
  }
  // DE-Übersetzungen doppelt innerhalb der neuen Sätze?
  const des = lesson.newSentences.map((s) => s.de.trim());
  if (new Set(des).size !== des.length) fail(`${lesson.id}: doppelte DE-Sätze`);

  const targetWords = story.words.length + lesson.newWords.length;
  const targetSentences = story.sentences.length + lesson.newSentences.length;
  const wordsOk = targetWords === 8;
  const sentOk = targetSentences === 7;
  console.log(`  Ziel: ${targetWords} Wörter ${wordsOk ? "OK" : "(ABWEICHUNG von 8)"} / ${targetSentences} Sätze ${sentOk ? "OK" : "(ABWEICHUNG von 7)"}`);
  const avgWords = (story.sentences.concat(lesson.newSentences))
    .map((x) => x.it.trim().split(/\s+/).length)
    .reduce((a, b) => a + b, 0) / targetSentences;
  console.log(`  Ø Wörter/Satz (alle 7): ${avgWords.toFixed(1)}`);
}

console.log(`\n--- Ergebnis: ${problems} Problem(e) ---`);
process.exit(problems ? 1 : 0);
