"use strict";

/* Abdeckungs-Audit für Ciao Italia: druckt je aktivem Level, wie stark
   jedes wortschatzkonsumierende Feature den Bestand abbildet, und findet
   hartkodierte Level-Listen. Exit 1, wenn Lücken bleiben.
   Aufruf: node .agents/skills/ciao-feature-audit/scripts/abdeckung.js */

const fs = require("fs");
const path = require("path");
global.window = {};
const root = path.resolve(__dirname, "..", "..", "..", "..");

const dataFiles = [
  "data.js", "vocabulary-a1.js", "vocabulary-a2.js", "vocabulary-b1.js",
  "verbs-a1.js", "verbs-a2.js", "verbs-b1.js", "sentences.js", "stories.js"
];

// Verben tragen kein Level-Feld — Beitrag je Datei über Deltas messen.
const verbCounts = {};
let D, S, ST, LI, CUR;
dataFiles.forEach((file) => {
  require(path.join(root, file));
  D = window.IT_DATA;
  if (file.startsWith("verbs-")) verbCounts[file.replace("verbs-", "").replace(".js", "")] = D.verbs.length;
});

S = window.IT_SENT;
ST = window.IT_STORIES || [];
LI = window.IT_LISTENING || [];
CUR = window.IT_CURRICULUM || {};

const levels = Object.keys(CUR).filter((lv) => CUR[lv].status === "aktiv");
if (!levels.length) levels.push("A1", "A2", "B1");
const byLevel = (arr) => {
  const out = {};
  levels.forEach((lv) => { out[lv] = arr.filter((x) => (x.level || "A1") === lv).length; });
  return out;
};

const checklists = {
  A1: (S.checklist || []).length,
  A2: (S.checklistA2 || []).length,
  B1: (S.checklistB1 || []).length
};

const coverage = {
  aktiveLevel: levels,
  wortschatz: {
    kategorien: byLevel(D.categories),
    woerter: Object.fromEntries(levels.map((lv) => [
      lv, D.categories.filter((c) => (c.level || "A1") === lv)
        .reduce((sum, c) => sum + c.items.length, 0)
    ]))
  },
  verben: {
    hinweis: "flacher Bestand ohne level-Feld — Beitrag je Quelldatei",
    jeDatei: verbCounts,
    gesamt: D.verbs.length
  },
  lektionen: Object.fromEntries(levels.map((lv) => [
    lv, { ist: ST.filter((s) => s.level === lv).length, ziel: (CUR[lv] && CUR[lv].target) || null }
  ])),
  dialoge: byLevel(S.dialogues),
  reisechecklisten: checklists,
  orecchie: byLevel(LI),
  kapitelDramaturgie: { hinweis: "IT_CHAPTERS deckt nur A1 ab (Index-basiert)", kapitel: (window.IT_CHAPTERS || []).length }
};

// Hartkodierte Level-Listen: Fundstellen, an denen ein neues Level ergänzt
// werden müsste (grep-ähnlich, bewusst einfach).
const sources = ["app.js", "tools/validate.js", "tools/generate-audio-manifest.js", "stories.js", "sw.js", "index.html"];
const pattern = /"A1",\s*"A2",\s*"B1"|\[\s*"A1"|checklistA2|checklistsByLevel|CHECKLISTS/;
const hardcoded = [];
sources.forEach((file) => {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) return;
  fs.readFileSync(full, "utf8").split(/\r?\n/).forEach((line, i) => {
    if (pattern.test(line)) hardcoded.push(`${file}:${i + 1}: ${line.trim().slice(0, 90)}`);
  });
});

// Audio-Manifest deckt die aktuellen Quellen ab?
const manifestKeys = new Set(
  fs.readFileSync(path.join(root, "AUDIO-MANIFEST.csv"), "utf8").trim().split(/\r?\n/)
    .slice(1).map((line) => line.match(/^"([^"]+)"/)?.[1]).filter(Boolean)
);
const missingAudio = [];
levels.forEach((lv) => {
  const pfx = lv === "A1" ? "chk_" : `chk${lv}_`;
  (checklists[lv] ? [checklists[lv]] : [0]).forEach((n) => {
    for (let i = 0; i < n; i++) if (!manifestKeys.has(`${pfx}${i}`)) missingAudio.push(`${pfx}${i}`);
  });
});
S.dialogues.forEach((d) => d.lines.forEach((_, i) => {
  if (!manifestKeys.has(`dlg_${d.id}_${i}`)) missingAudio.push(`dlg_${d.id}_${i}`);
}));
LI.forEach((ep) => ep.lines.forEach((_, i) => {
  if (!manifestKeys.has(`ore_${ep.id}_${i}`)) missingAudio.push(`ore_${ep.id}_${i}`);
}));

// Lücken: je aktivem Level muss jedes Feature Bestand haben.
const luecken = [];
levels.forEach((lv) => {
  if (!coverage.wortschatz.kategorien[lv]) luecken.push(`Level ${lv}: keine Wortschatz-Kategorien`);
  if (!coverage.lektionen[lv].ist) luecken.push(`Level ${lv}: keine Lektionen`);
  if ((coverage.lektionen[lv].ziel || 0) > coverage.lektionen[lv].ist) luecken.push(`Level ${lv}: Lektionsziel ${coverage.lektionen[lv].ziel} verfehlt (ist ${coverage.lektionen[lv].ist})`);
  if (!coverage.dialoge[lv]) luecken.push(`Level ${lv}: keine Reise-Dialoge`);
  if (!checklists[lv]) luecken.push(`Level ${lv}: keine Reisecheckliste`);
  if (!coverage.orecchie[lv]) luecken.push(`Level ${lv}: keine Orecchie-Episoden`);
  if (coverage.orecchie[lv] && coverage.orecchie[lv] < 3) luecken.push(`Level ${lv}: nur ${coverage.orecchie[lv]} Orecchie-Episoden (Konvention: ≥ 3)`);
});
if (missingAudio.length) luecken.push(`Audio-Manifest fehlt ${missingAudio.length} Keys (Generator laufen lassen), z. B. ${missingAudio.slice(0, 3).join(", ")}`);

console.log("=== CIAO ITALIA — FEATURE-ABDECKUNG ===");
console.log(JSON.stringify(coverage, null, 2));
console.log("\n--- Hartkodierte Level-Listen (bei neuem Level hier erweitern) ---");
console.log(hardcoded.length ? hardcoded.join("\n") : "keine Fundstellen");
console.log("\n--- LÜCKEN ---");
console.log(luecken.length ? luecken.map((l) => `- ${l}`).join("\n") : "keine — alle aktiven Level in allen Pflicht-Features abgedeckt");

process.exit(luecken.length ? 1 : 0);
