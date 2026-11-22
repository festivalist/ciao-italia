# Konjugations-Ritual — „Congiuga del giorno"

Status: ready-for-agent

## Comments

- 2026-11-22: Umgesetzt, Node-Regression + Browser-E2E bestanden (Details im ToDo.md-Eintrag vom 22.11.2026; Screenshots unter gui-test-screenshots/).

## Problem

Der Nutzer tut sich schwer mit Verbkonjugationen. Es fehlte eine Übung, die eine **vollständige Konjugation** aktiv abruft (alle sechs Personen in fester Reihenfolge, getippt), eingebettet als kleines tägliches Ritual beim App-Start.

## Entscheidungen (Grilling, 2026-11-22)

1. **Zeitpunkt:** 1× täglich beim ersten App-Start des Tages; weitere Starts bleiben ungestört, *sofern erledigt*.
2. **Eingabe:** Tippen (freie Texteingabe); tolerant bei Groß/Klein, Akzenten, Whitespace; Gender-Alternativen („sono stato/a") akzeptiert; Reflexiv-Klitikon optional („mi chiamo" ≈ „chiamo").
3. **Umfang:** alle 135 Verben, Level A1 → A2 → B1; unpersönliche Verben (piovere, bisognare) ausgenommen → 133 × 3 = 399 Einträge.
4. **Fehlerfall:** richtige Form zeigen, weiter; verhakte Formen am Ende der Runde erneut, bis einmal richtig.
5. **Mahnung:** „Später" schließt das Overlay, aber Banner bleibt + Overlay kommt beim nächsten App-Start (auch am selben Tag) erneut — bis erledigt.
6. **XP:** +10 pro erledigter Tages-Konjugation; zählt 1× aufs Tagesziel (markPractice).
7. **Reihenfolge pro Level:** regelmäßige -are → regelmäßige -ere → regelmäßige -ire (inkl. -isc-Typ) → unregelmäßige (essere/avere zuerst, sonst stabile Daten-Reihenfolge).
8. **Zeiten:** alle drei, in **drei getrennten Durchläufen**: erst Presente für alle Verben, danach Passato, dann Futuro; pro Tag genau ein Verb × eine Zeit (6 Eingaben). Danach endlos von vorn.

## Abfolge im Overlay

Personen in fester Folge **io → tu → lui/lei → noi → voi → loro** (Anzeige-Ordnung `[0,1,2,3,5,4]`, da die Daten loro=4/voi=5 halten — siehe ADR 0001).

## Umsetzung

- `app.js`: Queue-Ableitung (rein, zwischen Markern `conj-queue:start/end`), State `ciaoit_conj { qi, doneDay }` (in `SYNC_KEYS` registriert), Overlay `openConj()`, Nudge-Banner `updateConjBanner()` (auch in `go()` für Tageswechsel), Boot-Hook.
- `styles.css`: `.conj-overlay/.conj-card/.conj-banner`-Sätze im bestehenden Design.
- `tools/check-conj-queue.js`: Node-Regressionstest der Ableitung (führt den app.js-Code zwischen den Markern aus).
- `sw.js`: Bump auf `ciaoit-v25`.
- Datenfix nebenbei: `manciamo → manchiamo` (verbs-a2.js).

## M1 — Conj vertiefen (SRS-Verzahnung, Statistik, Freiübung; 22.11.2026)

Entscheidungen (Grilling):
1. **Freiübung:** 10 Formen pro Session, due-first, Rest aus der Rotation aufgefüllt (auch neue Formen, Zufallsperson).
2. **Ritual → SRS:** alle 6 Formen werden still bewertet (Erstversuch → Box rauf, verhakt → Box 1); `grade(key, knew, quiet)` zählt stille Bewertungen nicht aufs Tagesziel.
3. **Statistik (kompakt):** `ciaoit_conj.stats { total, first, asked[6], hit[6] }`; Passaporto-☕-Karte nach der Streak-Karte (gesamt · %-Erstversuch · schwächste Person ab 3 Anfragen).
4. **XP:** keine für die Freiübung (wie bei allen Trainings-Modi).

Umsetzung: `verbKeyParse`/`verbsBySlugMap`/`conjSlug` im Marker-Block (Node-getestet), `startVerbDrill` + `buildVerbDeck` + `verbDueCount` im Allenamento (Menü-Eintrag nach Zeitform-Flip), sw → v26.

## Verifikation

- Node: `node tools/check-conj-queue.js` (grün, inkl. verbKey-Roundtrip) + `node tools/validate.js` (grün).
- Browser-E2E: frisches Profil, Reihenfolge inkl. voi-vor-loro, Fehler-/Wiederholungspfad, Abbruch + Banner + Re-Overlay, Tagesfortschritt, XP, Sync-Key-Registrierung; M1: Ritual-Grading (6 verb_*-Keys, Boxen), Statistik-Karte, Drill due-first, kein Drill-XP.
