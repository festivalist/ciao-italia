---
name: ciao-vocab-erweitern
description: Pflicht-Workflow für Ciao Italia, immer wenn Wortschatz erweitert wird — neue Wörter, Kategorien, Verben, ein neues Level (z. B. B2) oder zusätzliche Lektionen. Jede Wortschatz-Erweiterung inkludiert zwangsläufig drei Dinge: Audit aller bestehenden Features, Einbau des erweiterten Wortschatzes in die Features (Dialoge, Checklisten, Missionen, Orecchie, Drills, Stories), und Fortschritts-Sicherheit inklusive E2E-Test. Auch nutzen bei Formulierungen wie „füge Wörter hinzu", „neue Kategorie anlegen", „B2-Gerüst befüllen", „Lektionen ergänzen", „Wortschatz auf X erweitern" — selbst wenn der Nutzer Features nicht ausdrücklich erwähnt.
---

# Ciao Italia: Wortschatz erweitern (mit Pflicht-Feature-Integration)

## Die Kernregel und warum sie existiert

Der Wortschatz dieser App lebt nicht nur in `vocabulary-*.js`. Er wird von über
einem Dutzend Stellen konsumiert: Views, Drill-Pools, Dialoge, Checklisten,
Hör-Geschichten, Audio-Manifest, Validierung, Service-Worker. Eine
Wortschatz-Erweiterung ohne Feature-Integration erzeugt **stumme Lücken** —
z. B. ein neues Level ohne Orecchie-Episoden oder eine Checkliste, die weiter
nur A1-Sätze zeigt. Der Nutzer hat diese Regel ausdrücklich so festgelegt:

> Eine Erweiterung des Wortschatzes schließt immer die Prüfung der vorhandenen
> Features ein und deckt die Erweiterung der Features bzw. das Einbauen des
> erweiterten Wortschatzes in die Features ab.

Deshalb ist keine der Phasen 2–5 optional, egal wie klein die Erweiterung wirkt.

## Phase 1 — Daten anlegen

Neue Wortschatz-Datei nach dem Muster der Bestehenden (Vorlage: `vocabulary-a2.js`
bzw. `verbs-a2.js`): IIFE, das in `window.IT_DATA` merged, Dopplungs-Check gegen
den Bestand, `level`-Feld an jeder Kategorie. Bei einem **neuen Level** zusätzlich:

- `IT_CURRICULUM` in `stories.js` um das Level ergänzen (`status`, `target`, ggf. `enforceTarget`).
- `index.html`: `<script>`-Tag in der korrekten Reihenfolge (nach `data.js`, vor `sentences.js`).
- `tools/validate.js` und `tools/generate-audio-manifest.js`: `require` ergänzen.
- `sw.js`: neue Datei in `SHELL` aufnehmen; `tools/validate.js`: `shellFiles` ergänzen.

## Phase 2 — Pflicht-Audit aller Features

Lies **jetzt** [references/feature-inventar.md](references/feature-inventar.md).
Es listet jede konsumierende Stelle mit Datenquelle und dem, was bei einer
Erweiterung zu prüfen bzw. auszubauen ist. Bestimme für jede Inventar-Zeile einen
Status: `ok` (alles angepasst), `erweitert` (in dieser Session geändert), `LÜCKE`
(muss in Phase 3 gearbeitet werden). Das Ergebnis fließt als Matrix in den
Abschlussreport. Für den Zahlen-Teil des Audits gibt es ein fertiges Skript:

```bash
"/c/Program Files/nodejs/node.exe" .agents/skills/ciao-feature-audit/scripts/abdeckung.js
```

## Phase 3 — Integration: erweiterten Wortschatz in die Features einbauen

Arbeite jede `LÜCKE` aus Phase 2 mit den jeweiligen Inventar-Schritten ab.
Content-Qualität ist nicht verhandelbar:

- Italienisch und Deutsch müssen korrekt und natürlich sein — im Zweifel den Satz
  streichen oder vereinfachen, nie „irgendwie okay" durchlassen.
- Neue Inhalte nutzen die **Level-typische Grammatik** (A2: Imperfetto,
  Condizionale, Objektpronomen, Vergleiche; B1: Congiuntivo, Gerundio, Passivo,
  Periodo ipotetico, Relativsätze) und **Wörter des erweiterten Bestands** — sonst
  ist es keine Integration, nur Append.
- Bestehende Listen nur am **Ende** erweitern; niemals Einträge davor einfügen
  (siehe Phase 4).
- Keine Bulk-Regex-Umschreibungen über quote-lastigen Mehrzeilen-Quelltext
  (Dialoge/Story-Zeilen mit „…"/«…»); solche Dateien von Hand editieren.

## Phase 4 — Fortschrittssicherheit (vor jedem Key-Kontakt lesen)

Lies [references/fortschritts-regeln.md](references/fortschritts-regeln.md), bevor
du SRS-Keys, IDs oder Reihenfolgen anfasst. Kurzfassung der goldenen Regeln:

1. `S.checklist` (A1) ist **indexbasiert** verankert (`chk_0…chk_29`) — nie
   umsortieren, nie vorne einfügen; nur hinten anhängen, wenn wirklich nötig.
2. Neue Level-Inhalte bekommen eigene Arrays + eigene Key-Präfixe (`chkA2_`,
   `chkB1_`, …) — niemals gemeinsame Keys mit Bestehendem.
3. IDs (Dialoge, Episoden, Stories, Missionen) niemals umbenennen.
4. Key-Mapping an drei Stellen synchron halten: `app.js`,
   `tools/generate-audio-manifest.js`, `tools/validate.js`.

## Phase 5 — Abschluss-Checks (feste Reihenfolge, alle Pflicht)

```bash
# 1. Syntax je geänderter Datei
"/c/Program Files/nodejs/node.exe" --check app.js sentences.js stories.js

# 2. Audio-Manifest regenerieren (Generator vorher für neue Quellen erweitern!)
"/c/Program Files/nodejs/node.exe" tools/generate-audio-manifest.js

# 3. Validierung muss 0 Fehler melden (validate.js vorher um neue Regeln erweitern)
"/c/Program Files/nodejs/node.exe" tools/validate.js

# 4. sw.js: CACHE-Version bumpen, damit installierte Geräte aktualisieren
```

5. Browser-E2E (Pflicht, Anleitung in `fortschritts-regeln.md`): Service-Worker
   resetten, einen typischen Alt-Fortschritt seeden, die geänderten
   Klickpfade durchspielen, Reload — und verifizieren, dass der geseedete
   Fortschritt danach exakt unverändert ist.

## Phase 6 — Report

Berichte auf Deutsch und in dieser Reihenfolge:

1. **Deckungsmatrix** Feature × Status (`ok` / `erweitert` / `LÜCKE`), vor und nach.
2. **Zahlen**: Dialoge je Level, Checklisten-Sätze je Level, Orecchie-Episoden je
   Level, Wörter/Kategorien gesamt (aus validate.js-Stats bzw. `abdeckung.js`).
3. **Fortschritts-Nachweis**: welche Keys geseedet wurden, welche Counts danach
   erwartet und gemessen wurden.
4. **Geänderte Dateien** inkl. `sw.js`-Version.
5. Eintrag in `ToDo.md` ergänzen; bei neuen Konventionen die Projekt-Memory
   aktualisieren.

Deploys macht der Nutzer selbst per FTP (inkl. `sync-data/`) — nicht durch den
Agenten erledigen, nur an merken.
