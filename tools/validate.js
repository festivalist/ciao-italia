"use strict";

const fs = require("fs");
const path = require("path");
global.window = {};
const root = path.resolve(__dirname, "..");
require(path.join(root, "data.js"));
require(path.join(root, "vocabulary-a1.js"));
require(path.join(root, "vocabulary-a2.js"));
require(path.join(root, "vocabulary-b1.js"));
require(path.join(root, "verbs-a1.js"));
require(path.join(root, "verbs-a2.js"));
require(path.join(root, "verbs-b1.js"));
require(path.join(root, "sentences.js"));
require(path.join(root, "phrases.js"));
require(path.join(root, "stories.js"));

const D = window.IT_DATA;
const S = window.IT_SENT;
const ST = window.IT_STORIES || [];
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const unique = (values) => new Set(values).size === values.length;
const slug = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

// Der Bestand darf wachsen; geprüft werden Konsistenz und Verweise.
check(D.meta.variant === "Italienisch (it-IT)", "Sprachvariante ist nicht it-IT.");
check(D.categories.length > 0, "Keine Kategorien vorhanden.");
check(unique(D.categories.map((category) => category.id)), "Kategorie-IDs sind nicht eindeutig.");
D.categories.forEach((category) => {
  check(category.items.length > 0, `Kategorie ${category.id} ist leer.`);
  check(unique(category.items.map((item) => slug(item.key || item.it))), `Kategorie ${category.id} enthält doppelte Wörter.`);
});
check(D.verbs.length > 0, "Keine Verben vorhanden.");
check(unique(D.verbs.map((verb) => verb.inf)), "Verb-Infinitive sind nicht eindeutig.");
D.verbs.forEach((verb) => D.meta.tenses.forEach((tense) =>
  check(Array.isArray(verb[tense.id]) && verb[tense.id].length === 6, `${verb.inf}/${tense.id} benötigt sechs Formen.`)
));
D.verbs.forEach((verb) => D.meta.tenses.forEach((tense) => {
  const forms = verb[tense.id] || [];
  if (verb.impersonal) {
    check(forms[2] && forms.filter(Boolean).length === 1, `${verb.inf}/${tense.id} muss genau eine unpersönliche Form enthalten.`);
  } else {
    check(forms.every((form) => typeof form === "string" && form.trim()), `${verb.inf}/${tense.id} enthält eine leere Form.`);
  }
}));

const verbNames = new Set(D.verbs.map((verb) => verb.inf));
S.svo.forEach((item) => {
  check(verbNames.has(item.verb), `Satzmuster ${item.id}: Verb ${item.verb} fehlt.`);
  check(Boolean(S.deVerbs[item.verb]), `Satzmuster ${item.id}: deutsche Konjugation fehlt.`);
  check(Boolean(item.itObj && item.deObj && item.deObjNeg), `Satzmuster ${item.id}: Objektfelder fehlen.`);
});
check(unique(S.svo.map((item) => item.id)), "Satzmuster-IDs sind nicht eindeutig.");
check(S.dialogues.length > 0, "Keine Dialoge vorhanden.");
check(S.dialogues.every((dialogue) => dialogue.lines.every((line) => line.it && line.de && line.who)), "Ein Dialogeintrag ist unvollständig.");
check(S.dialogues.every((dialogue) => ["A1", "A2", "B1"].includes(dialogue.level)), "Ein Dialog hat kein gültiges Level (A1/A2/B1).");
check(unique(S.dialogues.map((dialogue) => dialogue.id)), "Dialog-IDs sind nicht eindeutig.");
["A1", "A2", "B1"].forEach((lv) =>
  check(S.dialogues.some((dialogue) => dialogue.level === lv), `Kein Dialog für Level ${lv} vorhanden.`));
check(S.missions.length > 0, "Keine Missionen vorhanden.");
check(S.missions.every((mission) => ["prima", "viaggio", "dopo"].includes(mission.phase)), "Eine Mission hat eine ungültige Phase.");
check(S.checklist.length > 0, "Keine Checklisten-Sätze vorhanden.");
// Checklisten je Level: vollständig, eindeutig, mit Satzzeichen
[["checklistA2", "A2"], ["checklistB1", "B1"]].forEach(([key, lv]) => {
  const items = S[key] || [];
  check(items.length >= 10, `Reisecheckliste ${lv} braucht mindestens 10 Sätze (${items.length}).`);
  check(items.every((item) => item.it && item.de), `Reisecheckliste ${lv} enthält einen unvollständigen Satz.`);
  check(items.every((item) => /[.!?]$/.test(item.it.trim())), `Reisecheckliste ${lv}: Satz endet ohne Satzzeichen.`);
  check(unique(items.map((item) => item.it)), `Reisecheckliste ${lv} enthält doppelte Sätze.`);
});
// Orecchie: jede aktive Stufe braucht Hör-Geschichten mit vollständigem Schema
const LISTENING = window.IT_LISTENING || [];
check(LISTENING.length > 0, "Keine Hör-Geschichten vorhanden.");
check(unique(LISTENING.map((episode) => episode.id)), "Hör-Geschichten-IDs sind nicht eindeutig.");
LISTENING.forEach((episode) => {
  check(["A1", "A2", "B1"].includes(episode.level), `Hör-Geschichte ${episode.id}: ungültiges Level.`);
  check(episode.title && episode.icon, `Hör-Geschichte ${episode.id}: Titel oder Icon fehlt.`);
  check(episode.lines.length >= 4, `Hör-Geschichte ${episode.id}: mindestens 4 Sätze erwartet.`);
  check(episode.lines.every((line) => line.it && line.de), `Hör-Geschichte ${episode.id}: unvollständige Zeile.`);
  check(episode.lines.every((line) => /[.!?]["'«»„“”]*$/.test(line.it.trim())), `Hör-Geschichte ${episode.id}: Zeile endet ohne Satzzeichen.`);
});
["A1", "A2", "B1"].forEach((lv) =>
  check(LISTENING.some((episode) => episode.level === lv), `Keine Hör-Geschichte für Level ${lv} vorhanden.`));

// Aussprache-Regeln (Sapere → Pronuncia): Schema, Eindeutigkeit, Mindestumfang
check(Array.isArray(D.pronunciation) && D.pronunciation.length >= 10, "Aussprache: mindestens 10 Regeln erwartet.");
check(unique((D.pronunciation || []).map((rule) => rule.id)), "Aussprache-Regel-IDs sind nicht eindeutig.");
(D.pronunciation || []).forEach((rule) => {
  check(Boolean(rule.title && rule.rule), `Aussprache-Regel ${rule.id || "?"}: Titel oder Erklärung fehlt.`);
  check(Array.isArray(rule.examples) && rule.examples.length >= 3, `Aussprache-Regel ${rule.id}: mindestens 3 Beispiele erwartet.`);
  check((rule.examples || []).every((ex) => ex.it && ex.de), `Aussprache-Regel ${rule.id}: unvollständiges Beispiel.`);
  check(unique((rule.examples || []).map((ex) => slug(ex.it))), `Aussprache-Regel ${rule.id}: doppelte Beispiele.`);
});

// Grammatik-Themen (Sapere → Grammatica): Schema und vollständige Formen
check(Array.isArray(D.grammar) && D.grammar.length > 0, "Keine Grammatik-Themen vorhanden.");
check(unique((D.grammar || []).map((topic) => topic.id)), "Grammatik-Themen-IDs sind nicht eindeutig.");
(D.grammar || []).forEach((topic) => {
  check(Boolean(topic.title && topic.intro), `Grammatik-Thema ${topic.id}: Titel oder Intro fehlt.`);
  check(Array.isArray(topic.forms) && topic.forms.length === 6, `Grammatik-Thema ${topic.id}: 6 Personen-Zeilen erwartet.`);
  check((topic.forms || []).every((f) => f.who && f.m && f.f && f.mp && f.fp), `Grammatik-Thema ${topic.id}: Formenzeile unvollständig.`);
  check(Array.isArray(topic.examples) && topic.examples.length >= 5, `Grammatik-Thema ${topic.id}: mindestens 5 Beispiele erwartet.`);
  check((topic.examples || []).every((ex) => ex.it && ex.de), `Grammatik-Thema ${topic.id}: unvollständiges Beispiel.`);
  check((topic.examples || []).every((ex) => /[.!?]$/.test(ex.it.trim())), `Grammatik-Thema ${topic.id}: Beispiel endet ohne Satzzeichen.`);
});

// Redewendungen (phrases.js, eigener Key-Raum phr_<kat>_<slug>): Schema,
// Mindestumfang und keine Duplikate zum Vokabular-Bestand
const PH = window.IT_PHRASES || [];
check(PH.length >= 6, "Redewendungen: mindestens 6 Kategorien erwartet.");
check(unique(PH.map((category) => category.id)), "Redewendungs-Kategorie-IDs sind nicht eindeutig.");
check(unique(PH.flatMap((category) => category.items.map((item) => slug(item.it)))), "Redewendungen enthalten doppelte Wendungen.");
const vocabSlugs = new Set(D.categories.flatMap((category) => category.items.map((item) => slug(item.key || item.it))));
PH.forEach((category) => {
  check(Boolean(category.id && category.title && category.icon), "Redewendungs-Kategorie ist unvollständig.");
  check(category.items.length >= 10, `Redewendung-Kategorie ${category.id}: mindestens 10 Wendungen erwartet.`);
  check(category.items.every((item) => item.it && item.de), `Redewendung-Kategorie ${category.id}: unvollständige Wendung.`);
  category.items.forEach((item) =>
    check(!vocabSlugs.has(slug(item.it)), `Redewendung „${item.it}“ existiert bereits als Vokabel.`));
});

// Stories: Schema, Eindeutigkeit, Verweise auf Dialoge und Missionen
const dialogueIds = new Set(S.dialogues.map((dialogue) => dialogue.id));
const missionIds = new Set(S.missions.map((mission) => mission.id));
const poolKeys = new Set(D.categories.flatMap((category) =>
  category.items.map((item) => `word_${category.id}_${slug(item.key || item.it)}`)));
const poolSlugs = new Set(D.categories.flatMap((category) =>
  category.items.map((item) => slug(item.key || item.it))));
const categoryIds = new Set(D.categories.map((category) => category.id));
const categoryLevel = new Map(D.categories.map((category) => [category.id, category.level || "A1"]));
const curriculum = window.IT_CURRICULUM || {};
const coveredCategories = new Set();
const localWordSlugs = new Map(); // Story-Schlüssel-Wörter dürfen pro Wort nur einmal vorkommen
check(unique(ST.map((story) => story.id)), "Story-IDs sind nicht eindeutig.");
check(ST.length > 0, "Keine Stories vorhanden.");
ST.forEach((story) => {
  check(story.words.length >= 4 && story.words.length <= 10, `Story ${story.id}: 4–10 Wörter erwartet (${story.words.length}).`);
  check(story.sentences.length >= 3 && story.sentences.length <= 8, `Story ${story.id}: 3–8 Sätze erwartet (${story.sentences.length}).`);
  check(story.words.every((word) => word.it && word.de && word.emoji), `Story ${story.id}: unvollständiges Wort.`);
  check(story.sentences.every((sentence) => sentence.it && sentence.de), `Story ${story.id}: unvollständiger Satz.`);
  check(unique(story.words.map((word) => slug(word.it))), `Story ${story.id}: doppelte Wörter.`);
  check(unique(story.sentences.map((sentence) => sentence.it)), `Story ${story.id}: doppelte Sätze.`);
  check(story.sentences.every((sentence) => /[.!?]$/.test(sentence.it.trim())), `Story ${story.id}: Satz endet ohne Satzzeichen.`);
  (story.build || []).forEach((index) =>
    check(index >= 0 && index < story.sentences.length, `Story ${story.id}: build-Index ${index} außerhalb.`));
  (story.produce || []).forEach((index) =>
    check(index >= 0 && index < story.sentences.length, `Story ${story.id}: produce-Index ${index} außerhalb.`));
  if (story.dialogueId) check(dialogueIds.has(story.dialogueId), `Story ${story.id}: Dialog ${story.dialogueId} fehlt.`);
  if (story.missionId) check(missionIds.has(story.missionId), `Story ${story.id}: Mission ${story.missionId} fehlt.`);
  check(Boolean(curriculum[story.level]), `Story ${story.id}: Level ${story.level} fehlt im Curriculum.`);
  check(Array.isArray(story.covers) && story.covers.length > 0, `Story ${story.id}: covers fehlen.`);
  (story.covers || []).forEach((catId) => {
    check(categoryIds.has(catId), `Story ${story.id}: covers nennt unbekannte Kategorie ${catId}.`);
    check(categoryLevel.get(catId) === story.level,
      `Story ${story.id} (${story.level}) deckt Kategorie ${catId} (${categoryLevel.get(catId)}) des falschen Levels ab.`);
    coveredCategories.add(catId);
  });
  story.words.forEach((word) => {
    if (word.key) {
      check(poolKeys.has(word.key), `Story ${story.id}: Wortschlüssel ${word.key} existiert nicht im Wortschatz.`);
      return;
    }
    const wordSlug = slug(word.it);
    if (poolSlugs.has(wordSlug)) return; // Bestandswort: geteilter SRS-Schlüssel, Wiederholung erlaubt
    const other = localWordSlugs.get(wordSlug);
    check(!other, `Story-Deckerwort „${word.it}“ doppelt: ${other} und ${story.id}.`);
    localWordSlugs.set(wordSlug, story.id);
  });
});
// Kern-Garantie des Lernpfads: zusammen decken alle Stories den kompletten Bestand ab
categoryIds.forEach((catId) =>
  check(coveredCategories.has(catId), `Kategorie ${catId} wird von keiner Story abgedeckt.`));
// Jedes aktive Level braucht mindestens eine Story
Object.keys(curriculum).forEach((lv) => {
  if (curriculum[lv].status === "aktiv") {
    check(ST.some((story) => story.level === lv), `Level ${lv} ist aktiv, hat aber keine Stories.`);
  }
  // Level-Ziel (Lektionsanzahl) erzwingen, wenn aktiviert
  if (curriculum[lv].enforceTarget) {
    const n = ST.filter((story) => story.level === lv).length;
    check(n >= (curriculum[lv].target || 0), `Level ${lv}: Ziel ${curriculum[lv].target} Lektionen, vorhanden ${n}.`);
  }
});

const shellFiles = ["index.html", "styles.css", "app.js", "data.js", "vocabulary-a1.js", "vocabulary-a2.js", "vocabulary-b1.js", "verbs-a1.js", "verbs-a2.js", "verbs-b1.js", "sentences.js", "phrases.js", "stories.js", "illustrations.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-512-maskable.png", "icons/apple-touch-icon-180.png"];
shellFiles.forEach((file) => check(fs.existsSync(path.join(root, file)) && fs.statSync(path.join(root, file)).size > 0, `App-Shell-Datei fehlt: ${file}`));

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
check(manifest.lang === "it-IT", "Manifest-Sprache ist nicht it-IT.");
check(manifest.display === "standalone", "Manifest ist nicht als Standalone-PWA konfiguriert.");
const audioLines = fs.readFileSync(path.join(root, "AUDIO-MANIFEST.csv"), "utf8").trim().split(/\r?\n/);
check(audioLines.length > 1, "Audio-Manifest hat keine Datenzeilen.");
const audioKeys = audioLines.slice(1).map((line) => line.match(/^"([^"]+)"/)?.[1]).filter(Boolean);
check(audioKeys.length === audioLines.length - 1, "Mindestens eine Audiozeile besitzt keinen gültigen Schlüssel.");
check(unique(audioKeys), "Audio-Schlüssel sind nicht eindeutig.");

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("Validierung erfolgreich");
console.log(JSON.stringify({
  categories: D.categories.length,
  words: D.categories.reduce((sum, category) => sum + category.items.length, 0),
  verbs: D.verbs.length,
  patterns: S.svo.length,
  generatedSentences: S.svo.length * 5 * 5,
  dialogues: S.dialogues.length,
  dialogueLines: S.dialogues.reduce((sum, dialogue) => sum + dialogue.lines.length, 0),
  missions: S.missions.length,
  checklist: S.checklist.length,
  checklistA2: (S.checklistA2 || []).length,
  checklistB1: (S.checklistB1 || []).length,
  listening: LISTENING.length,
  stories: ST.length,
  storyWords: ST.reduce((sum, story) => sum + story.words.length, 0),
  pronunciationRules: (D.pronunciation || []).length,
  grammarTopics: (D.grammar || []).length,
  phraseCategories: PH.length,
  phrases: PH.reduce((sum, category) => sum + category.items.length, 0),
  audioEntries: audioLines.length - 1
}, null, 2));
