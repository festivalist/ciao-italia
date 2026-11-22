#!/usr/bin/env node
/* ============================================================
   check-conj-queue.js — prüft die Rotations-Ableitung der
   täglichen Konjugation (Congiuga del giorno).

   Lädt die Daten-Dateien wie tools/validate.js (window-Shim) und
   führt anschließend exakt den Code zwischen den Markern
   conj-queue:start / conj-queue:end aus app.js aus — es wird also
   dieselbe Implementierung getestet, die im Browser läuft.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const root = path.join(__dirname, "..");
global.window = {};
["data.js", "verbs-a1.js", "verbs-a2.js", "verbs-b1.js"].forEach(f => require(path.join(root, f)));
const verbs = global.window.IT_DATA.verbs;

const src = fs.readFileSync(path.join(root, "app.js"), "utf8");
const startMarker = "/* conj-queue:start";
const endMarker = "/* conj-queue:end */";
const a = src.indexOf(startMarker);
const b = src.indexOf(endMarker);
assert.ok(a >= 0 && b > a, "Marker conj-queue:start/end in app.js gefunden");
const block = src.slice(a, b + endMarker.length);

const ctx = { console };
vm.createContext(ctx);
vm.runInContext(block + "\nglobalThis.__conj = { buildConjQueue, conjIsRegular, conjClass, CONJ_PERSONS, CONJ_DISPLAY, conjVariants, conjAccept };", ctx);
const { buildConjQueue, conjIsRegular, conjClass, CONJ_PERSONS, CONJ_DISPLAY, conjAccept } = ctx.__conj;

/* ---------- Personen-Folge ---------- */
// Spread nötig: das Array kommt aus dem vm-Kontext (anderer Realm)
assert.deepStrictEqual([...CONJ_PERSONS], ["io", "tu", "lui/lei", "noi", "voi", "loro"],
  "Anzeige-Folge: Singular 1./2./3., Plural 1./2./3. (voi vor loro)");
// Die App rendert PRON[CONJ_DISPLAY[i]] — das Mapping muss dieselbe Folge ergeben
const pronouns = global.window.IT_DATA.meta.pronouns;
assert.deepStrictEqual([...CONJ_DISPLAY].map(i => pronouns[i]), [...CONJ_PERSONS],
  "CONJ_DISPLAY + meta.pronouns ergeben die Anzeige-Folge (voi vor loro)");

/* ---------- Datenbasis ---------- */
assert.strictEqual(verbs.length, 135, "135 Verben insgesamt");
const byInf = inf => verbs.find(v => v.inf === inf);
const idxOf = v => verbs.indexOf(v);

/* ---------- Klassifikation ---------- */
const expectRegular = ["parlare", "pagare", "comprare", "mangiare", "studiare", "cominciare", "vedere", "prendere", "leggere", "dormire", "finire", "capire", "aprire"];
const expectIrregular = ["essere", "avere", "stare", "andare", "venire", "fare", "dare", "dire", "sapere", "volere", "potere", "dovere", "bere", "piacere", "uscire"];
expectRegular.forEach(inf => assert.ok(conjIsRegular(byInf(inf)), `${inf} gilt als regelmäßig`));
expectIrregular.forEach(inf => assert.ok(!conjIsRegular(byInf(inf)), `${inf} gilt als unregelmäßig`));
assert.strictEqual(conjClass("chiamarsi"), "are", "Reflexiv -si wird für die Klasse gestrippt");
assert.strictEqual(conjClass("divertirsi"), "ire", "Reflexiv -irsi → ire");

/* ---------- Queue ---------- */
const queue = buildConjQueue(verbs);
assert.strictEqual(queue.length, 399, "399 Einträge: (135 − 2 unpersönliche) × 3 Zeiten");
assert.ok(!queue.some(e => e.v.impersonal), "unpersönliche Verben (piovere, bisognare) sind ausgeschlossen");
assert.ok(!queue.some(e => e.v.inf === "piovere" || e.v.inf === "bisognare"), "piovere/bisognare fehlen namentlich");

assert.strictEqual(queue[0].v.inf, "parlare", "erster Eintrag: erstes regelmäßiges -are-A1-Verb");
assert.strictEqual(queue[0].tense, "presente", "erster Durchlauf: presente");
assert.strictEqual(queue[133].v.inf, "parlare", "zweiter Durchlauf beginnt wieder mit Verb 1");
assert.strictEqual(queue[133].tense, "passato", "zweiter Durchlauf: passato");
assert.strictEqual(queue[266].v.inf, "parlare", "dritter Durchlauf beginnt wieder mit Verb 1");
assert.strictEqual(queue[266].tense, "futuro", "dritter Durchlauf: futuro");

// Level-Layout im Presente-Durchlauf: 98 A1 (100 − 2 unpersönliche), 19 A2, 16 B1
queue.slice(0, 133).forEach((e, i) => {
  const idx = idxOf(e.v);
  if (i < 98) assert.ok(idx < 100, `Pass-1-Position ${i} ist A1 (${e.v.inf})`);
  else if (i < 117) assert.ok(idx >= 100 && idx <= 118, `Pass-1-Position ${i} ist A2 (${e.v.inf})`);
  else assert.ok(idx >= 119, `Pass-1-Position ${i} ist B1 (${e.v.inf})`);
});

// Innerhalb A1: reg-are → reg-ere → reg-ire → unregelmäßig (essere, avere zuerst)
const a1 = queue.slice(0, 98);
const cls = e => conjIsRegular(e.v) ? conjClass(e.v.inf) : "irr";
const first = c => a1.findIndex(e => cls(e) === c);
assert.ok(first("are") === 0, "A1 beginnt mit regelmäßigen -are");
assert.ok(first("ere") > first("are"), "reg-ere nach reg-are");
assert.ok(first("ire") > first("ere"), "reg-ire nach reg-ere");
assert.ok(first("irr") > first("ire"), "unregelmäßige zuletzt");
assert.strictEqual(a1[first("irr")].v.inf, "essere", "Irregular-Bucket beginnt mit essere");
assert.strictEqual(a1[first("irr") + 1].v.inf, "avere", "danach avere");
const irrSlice = a1.slice(first("irr"));
const irrOrderOk = irrSlice.every((e, i) => i < 2 || idxOf(irrSlice[i].v) > idxOf(irrSlice[i - 1].v));
assert.ok(irrOrderOk, "Irregular-Bucket sonst in stabiler Daten-Reihenfolge");

/* ---------- Tipp-Vergleich ---------- */
assert.ok(conjAccept("sono stato/a", "sono stato"), "Gender-Variante masculin");
assert.ok(conjAccept("sono stato/a", "sono stata"), "Gender-Variante feminin");
assert.ok(conjAccept("siamo stati/e", "siamo state"), "Plural-Gender-Variante");
assert.ok(!conjAccept("sono stato/a", "sono stat"), "falsche Form wird abgelehnt");
assert.ok(conjAccept("mi chiamo", "chiamo"), "Reflexiv: Klitikon optional");
assert.ok(conjAccept("mi chiamo", "mi chiamo"), "Reflexiv: mit Klitikon");
assert.ok(conjAccept("mi sono alzato/a", "sono alzata"), "Klitikon-Weglassung + Gender kombiniert");
assert.ok(conjAccept("è", "e"), "Akzent-Toleranz (è ≈ e)");
assert.ok(conjAccept("dà", "da"), "Akzent-Toleranz (dà ≈ da)");
assert.ok(conjAccept("parlano", "  PARLANO  "), "Groß/Klein- und Whitespace-Toleranz");
assert.ok(!conjAccept("parlano", "parlare"), "Infinitiv zählt nicht");

console.log(`OK — Rotations-Queue: ${queue.length} Einträge, erster: ${queue[0].v.inf} (${queue[0].tense}),` +
  ` A1-Irregular-Beginn bei Position ${first("irr")} (essere, avere).`);
