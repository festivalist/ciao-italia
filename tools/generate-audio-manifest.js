"use strict";

const fs = require("fs");
const path = require("path");
global.window = {};
require(path.resolve(__dirname, "..", "data.js"));
require(path.resolve(__dirname, "..", "vocabulary-a1.js"));
require(path.resolve(__dirname, "..", "verbs-a1.js"));
require(path.resolve(__dirname, "..", "sentences.js"));

const D = window.IT_DATA;
const S = window.IT_SENT;
const rows = [];
const add = (key, text, area) => rows.push({ key, text, area });
const slug = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
const wordKey = (category, text) => `word_${category}_${slug(text)}`;
const verbKey = (inf, tense, person) => `verb_${slug(inf)}_${tense}_${person}`;
const sentKey = (item, person, tense) => `sent_${item.id}_${tense}_${person}`;

D.deconstruction.forEach((item, index) => add(`decon_${index}`, item.it, "Dekonstruktion"));
D.categories.forEach((category) => category.items.forEach((item) =>
  add(wordKey(category.id, item.key || item.it), item.it, `Wortschatz: ${category.title}`)
));
D.verbs.forEach((verb) => D.meta.tenses.forEach((tense) => verb[tense.id].forEach((form, index) => {
  if (form) add(verbKey(verb.inf, tense.id, index), form, `Verb: ${verb.inf} / ${tense.label}`);
})));

function sentence(item, person, tense) {
  return `${S.subjects.it[person]} ${D.verbs.find((verb) => verb.inf === item.verb)[tense][person]} ${item.itObj}.`;
}

S.svo.forEach((item) => {
  D.meta.tenses.forEach((tense) => S.subjects.it.forEach((_, person) =>
    add(sentKey(item, person, tense.id), sentence(item, person, tense.id), `Satz: ${tense.label}`)
  ));
  S.subjects.it.forEach((subject, person) => {
    const form = D.verbs.find((verb) => verb.inf === item.verb).presente[person];
    add(`neg_${item.id}_${person}`, `${subject} non ${form} ${item.itObjNeg || item.itObj}.`, "Satz: Verneinung");
    add(`q_${item.id}_${person}`, `${subject} ${form} ${item.itObj}?`, "Satz: Frage");
  });
});

S.checklist.forEach((item, index) => add(`chk_${index}`, item.it, "Reisecheckliste"));
S.dialogues.forEach((dialogue) => dialogue.lines.forEach((line, index) =>
  add(`dlg_${dialogue.id}_${index}`, line.it, `Dialog: ${dialogue.title}`)
));
S.missions.filter((mission) => mission.say).forEach((mission) =>
  add(`mis_${mission.id}`, mission.say, "Reise-Mission")
);

const root = path.resolve(__dirname, "..");
const quote = (value) => `"${String(value).replace(/"/g, '""')}"`;
const csv = ["key,text,bereich", ...rows.map((row) => [row.key, row.text, row.area].map(quote).join(","))].join("\r\n") + "\r\n";
const txt = [
  "CIAO ITALIA — AUDIO-MANIFEST",
  "========================================",
  "Lege optionale MP3-Dateien im Ordner audio/ ab.",
  "Dateiname = <key>.mp3. Ohne Datei nutzt die App it-IT-TTS.",
  "",
  ...rows.map((row) => `${row.key}.mp3\t${row.text}\t[${row.area}]`)
].join("\r\n") + "\r\n";

fs.writeFileSync(path.join(root, "AUDIO-MANIFEST.csv"), csv, "utf8");
fs.writeFileSync(path.join(root, "AUDIO-MANIFEST.txt"), txt, "utf8");
console.log(`${rows.length} Audioeinträge geschrieben.`);
