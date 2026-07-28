"use strict";

const fs = require("fs");
const path = require("path");
global.window = {};
const root = path.resolve(__dirname, "..");
require(path.join(root, "data.js"));
require(path.join(root, "vocabulary-a1.js"));
require(path.join(root, "verbs-a1.js"));
require(path.join(root, "sentences.js"));

const D = window.IT_DATA;
const S = window.IT_SENT;
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const unique = (values) => new Set(values).size === values.length;

check(D.meta.variant === "Italienisch (it-IT)", "Sprachvariante ist nicht it-IT.");
check(D.categories.length === 29, `Erwartet: 29 Kategorien; gefunden: ${D.categories.length}.`);
check(D.categories.reduce((sum, category) => sum + category.items.length, 0) === 500, "Der Wortschatz muss 500 Einträge enthalten.");
check(unique(D.categories.map((category) => category.id)), "Kategorie-IDs sind nicht eindeutig.");
check(D.verbs.length === 80, `Erwartet: 80 Verben; gefunden: ${D.verbs.length}.`);
check(unique(D.verbs.map((verb) => verb.inf)), "Verb-Infinitive sind nicht eindeutig.");
D.verbs.forEach((verb) => D.meta.tenses.forEach((tense) =>
  check(Array.isArray(verb[tense.id]) && verb[tense.id].length === 5, `${verb.inf}/${tense.id} benötigt fünf Formen.`)
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
check(S.svo.length === 14, `Erwartet: 14 Satzmuster; gefunden: ${S.svo.length}.`);
check(S.dialogues.length === 6, `Erwartet: 6 Dialoge; gefunden: ${S.dialogues.length}.`);
check(S.dialogues.every((dialogue) => dialogue.lines.every((line) => line.it && line.de && line.who)), "Ein Dialogeintrag ist unvollständig.");
check(S.missions.length === 12, `Erwartet: 12 Missionen; gefunden: ${S.missions.length}.`);
check(S.missions.every((mission) => ["prima", "viaggio", "dopo"].includes(mission.phase)), "Eine Mission hat eine ungültige Phase.");
check(S.checklist.length === 30, `Erwartet: 30 Checklisten-Sätze; gefunden: ${S.checklist.length}.`);

const shellFiles = ["index.html", "styles.css", "app.js", "data.js", "vocabulary-a1.js", "verbs-a1.js", "sentences.js", "manifest.webmanifest",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-512-maskable.png", "icons/apple-touch-icon-180.png"];
shellFiles.forEach((file) => check(fs.existsSync(path.join(root, file)) && fs.statSync(path.join(root, file)).size > 0, `App-Shell-Datei fehlt: ${file}`));

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
check(manifest.lang === "it-IT", "Manifest-Sprache ist nicht it-IT.");
check(manifest.display === "standalone", "Manifest ist nicht als Standalone-PWA konfiguriert.");
const audioLines = fs.readFileSync(path.join(root, "AUDIO-MANIFEST.csv"), "utf8").trim().split(/\r?\n/);
check(audioLines.length === 2115, `Audio-Manifest sollte 2114 Datenzeilen haben; gefunden: ${audioLines.length - 1}.`);
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
  generatedSentences: S.svo.length * 5 * 5,
  dialogues: S.dialogues.length,
  dialogueLines: S.dialogues.reduce((sum, dialogue) => sum + dialogue.lines.length, 0),
  missions: S.missions.length,
  checklist: S.checklist.length,
  audioEntries: audioLines.length - 1
}, null, 2));
