---
name: ciao-feature-audit
description: Nur-Lese-Audit für Ciao Italia — prüft, ob alle Features (Parole, Verbi, Percorso-Stories, Allenamento-Drills, Viaggio-Dialoge/-Checklisten/-Missionen, Orecchie, Audio-Manifest, validate.js, sw.js) an den vorhandenen Wortschatz und alle aktiven Level angepasst sind. Immer nutzen, wenn gefragt wird, ob die Features „an den erweiterten Wortschatz angepasst" sind, ob es Abdeckungslücken gibt, was eine Wortschatz-Erweiterung alles nach sich ziehen würde — sowie als Standalone-Check vor oder nach einer Erweiterung. Liefert eine Deckungsmatrix Level × Feature mit konkreten Fundstellen (Datei + Stelle); repariert nichts selbst.
---

# Ciao Italia: Feature-Abdeckungs-Audit (nur lesend)

## Zweck

Beantwortet die Frage „Sind alle Features an den (erweiterten) Wortschatz
angepasst?" mit Fakten statt Gefühl. Das Audit **ändert nichts** — gefundene
Lücken werden gemeldet; wer sie schließt, folgt dem Skill `ciao-vocab-erweitern`
(nur wenn der Nutzer es will).

## Schritt 1 — Zahlen-Coverage erheben

```bash
"/c/Program Files/nodejs/node.exe" .agents/skills/ciao-feature-audit/scripts/abdeckung.js
```

Das Skript lädt alle Datenquellen und druckt je aktivem Level: Kategorien,
Wörter, Verben, Lektionen (inkl. Soll/Ist beim Curriculum-Ziel), Dialoge,
Checklisten-Sätze, Orecchie-Episoden — plus die Fundstellen hartkodierter
Level-Listen und den Abdeckungs-Stand des Audio-Manifests. Exit-Code 1 signalisiert
Lücken (für automatische Gates).

## Schritt 2 — Inventar abarbeiten

Lies `.agents/skills/ciao-vocab-erweitern/references/feature-inventar.md`
(einzige Quelle der Feature-Wahrheit) und prüfe je Zeile die Spalte
„was zu prüfen ist" gegen den Ist-Stand — das Skript deckt die Zahlen ab, das
Inventar die View-/Logik-Seite (Level-Chips vorhanden? Badges? hartkodierte
Listen? neue Quellen im Manifest-Generator? validate-Regeln?).

## Schritt 3 — Stichproben im Browser (nur wenn Views im Verdacht stehen)

Bei Verdacht auf View-Lücken: lokalen Server starten
(`"/c/Program Files/nodejs/node.exe" tools/serve.js 8080`), Service-Worker
resetten (unregister + Caches löschen + Reload), betreffende Reiter öffnen und
Chips/Badges/Filter visuell prüfen. Server danach stoppen.

## Schritt 4 — Report (auf Deutsch)

Format — Deckungsmatrix mit einer Zeile je Feature, je Level eine Spalte:

```
Feature                A1      A2      B1      Befund
Parole (Kategorien)    16✅    14✅    8✅     Level-Chips ok
Verbi                  —               ⚠️     kein Level-Filter (flacher Bestand)
Orecchie (Episoden)    3✅     3✅     3✅     Badges + Filter ok
Reisecheckliste        30✅    15✅    15✅    Key-Schemata intakt
Dialoge                8✅     5✅     4✅     …
```

Dahinter, nur wenn vorhanden:

- **Lücken** mit Fundstelle (Datei + Ansicht/Funktion) und konkreter
  Empfehlung, welche Phase von `ciao-vocab-erweitern` sie schließt.
- **Hinweise** auf bekannte Grenzen (z. B. Verbi ohne Level-Konzept,
  A1-only-Kapitel-Dramaturgie) — melden, nicht heimlich als Fehler verkaufen.

Ende mit einer Ein-Satz-Fazit-Zeile („Alle aktiven Level in allen
wortschatzkonsumierenden Features abgedeckt" oder was zutrifft).
