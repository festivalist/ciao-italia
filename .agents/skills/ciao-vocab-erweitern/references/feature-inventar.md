# Feature-Inventar: Wer konsumiert den Wortschatz?

Einzige Quelle der Wahrheit für das Pflicht-Audit (genutzt von
`ciao-vocab-erweitern` Phase 2 und vom Skill `ciao-feature-audit`).
Jede Zeile: Reiter/Feature → Datenquelle → verhält sich automatisch? →
was bei einer Wortschatz-Erweiterung geprüft bzw. ausgebaut werden muss.

## Übersicht

| # | Feature | Datenquelle | Automatisch? |
|---|---------|-------------|--------------|
| 1 | Parole (viewVocab) | `D.categories` ← `vocabulary-*.js` | Wörter ja, Level-Chips nein |
| 2 | Verbi (viewVerbs) | `D.verbs` ← `verbs-*.js` | Wörter ja, Level-Konzept fehlt |
| 3 | Percorso/Stories | `IT_STORIES`, `IT_CURRICULUM`, `IT_CHAPTERS` | nein — Abdeckung ist Pflicht |
| 4 | Allenamento-Drills | POOL + `S.svo` + Story-Sätze | meist ja |
| 5 | Viaggio: Dialoge | `S.dialogues` | nein — Level-Pflicht |
| 6 | Viaggio: Checklisten | `S.checklist`/`checklistA2`/`checklistB1` | nein — Key-Regeln! |
| 7 | Viaggio: Missionen | `S.missions` + Story-Missionen | größtenteils |
| 8 | Orecchie | `IT_LISTENING` | nein — Level-Pflicht |
| 9 | Passaporto/Inizio | indirekt (Stories, Zähler) | ja |
| 10 | Hartkodierte Level-Listen | `app.js`, `tools/*.js` | nein — grep-Pflicht |
| 11 | Audio-Manifest | `tools/generate-audio-manifest.js` | Quellen nein |
| 12 | validate.js | eigene Regeln | Regeln nein |
| 13 | sw.js / App-Shell | `SHELL`, `CACHE` | nein |
| 14 | Sync & Deploy | `SYNC_KEYS`, FTP | ja (ganze Blobs) |

## Details

### 1. Parole (app.js: viewVocab, viewCategory)
- Neue Kategorien/Wörter erscheinen automatisch (POOL flacht `D.categories` ab).
- **Prüfen:** Kategorie trägt `level` (Default „A1"); Suchindex und
  Kategorie-Üben funktionieren ohne Zutun.
- **Erweitern bei neuem Level:** Die Level-Chips sind hartkodiert —
  `viewVocab` (`["Alle", null], ["A1","A1"], …`) um das Level ergänzen.

### 2. Verbi (app.js: viewVerbs, viewVerb)
- Neue Verben erscheinen automatisch; `validate.js` erzwingt je Zeit 5 Formen.
- **Bekannte Grenze (als LÜCKE melden, nicht heimlich behalten):** Verben tragen
  kein `level`-Feld, der Reiter hat keinen Level-Filter. Wer Level-Gleichheit
  will, muss `verbs-*.js` um `level` ergänzen + Filter in `viewVerbs` bauen.
- Neue **Zeit** (z. B. Imperfetto für A2) ist ein eigener Eingriff:
  `D.meta.tenses` + **alle** Verb-Dateien + Generator + validate.

### 3. Percorso / Stories (stories.js)
- **Pflicht:** Jede neue Wortschatz-Kategorie muss von einer Story **desselben
  Levels** über `covers` abgedeckt werden — `validate.js` erzwingt Abdeckung und
  Level-Gleichheit, sonst schlägt die Validierung fehl.
- **Pflicht bei aktivem `enforceTarget`:** Lektionszahl je Level erreichen
  (aktuell A1 100 / A2 75 / B1 75). Mehr Lektionen = Stories/Minis anlegen
  (Schema-Kommentar oben in stories.js).
- Story-Wörter: entweder `key` auf einen Bestandsschlüssel (`word_<cat>_<slug>`,
  teilt SRS-Zustand — Key muss existieren) oder einmaliges lokales Wort
  (`story_<id>_<slug>`; Dopplung über alle Stories verboten, validate prüft).
- `IT_CHAPTERS` ist reines A1 — Kapitel-Dramaturgie für neue Level ist optional
  und gehört in `ToDo.md`, nicht stillschweigend übergangen.

### 4. Allenamento (app.js: buildDeck/startTiles/startSentenceDrill/startTenseFlip/startShadow/startMix)
- Pools speisen sich automatisch aus POOL (Wörter), `S.svo` (Mustersätze) und den
  Sätzen aller Stories. Neue Wörter/Verben/Stories fließen also von selbst hinein.
- **Nur bei NEUEN Daten-Arrays** (z. B. neue Checkliste, neuer Satztyp): prüfen,
  ob der neue Bestand in die Drill-Pools eingebunden werden soll, und die
  Pool-Builder entsprechend ergänzen.

### 5. Viaggio: Reise-Dialoge (sentences.js `S.dialogues`, app.js viewViaggio/viewDialogue)
- **Pflicht:** Jeder Dialog trägt `level:"A1"|"A2"|"B1"`; je aktivem Level
  mindestens ein Dialog (validate erzwingt beides). Einordnung nach Grammatik
  des schwärzesten Satzes (z. B. Congiuntivo → B1).
- Neue Dialoge: neue, sprechende `id` (Fortschritts-Keys hängen daran), 5–7
  Zeilen, `who`-Rollen, korrektes IT/DE, Wörter des erweiterten Bestands nutzen.
- **Erweitern bei neuem Level:** Level-Chips in `viewViaggio`
  (`["Alle", null], ["A1","A1"], …`) und ggf. `viewMissions`-Level-Gruppierung.

### 6. Viaggio: Reisechecklisten (sentences.js, app.js viewChecklist)
- Key-Schema ist fortschrittskritisch (Details: `fortschritts-regeln.md`):
  A1 = `S.checklist` + `chk_<i>` (indexbasiert, **unveränderlich in Reihenfolge**),
  A2 = `S.checklistA2` + `chkA2_<i>`, B1 = `S.checklistB1` + `chkB1_<i>`.
- **Erweitern bei neuem Level:** neues Array + neues Präfix + Eintrag in
  `CHECKLISTS` (app.js) + `add(…)`-Zeile im Manifest-Generator + validate-Regel.
- Inhalt: 10–30 nützliche Reise-/Alltagssätze in Level-typischer Grammatik.

### 7. Viaggio: Missionen (sentences.js `S.missions`, app.js allMissionList)
- Die 12 Reise-Missionen sind level-agnostisch (echte Welt-Aufgaben) — bei
  neuem Level keine Zwangsanpassung, aber prüfen, ob Texte (z. B.
  „Reisecheckliste (A1)") noch stimmen.
- Story-Missionen entstehen automatisch je Story inkl. Level-Gruppierung.

### 8. Orecchie / Hör-Geschichten (stories.js `IT_LISTENING`)
- **Pflicht:** je aktivem Level Episoden (Konvention: ≥ 3 je Level; validate
  erzwingt mindestens eine je Level + vollständiges Schema `it`/`de`, ≥ 4 Zeilen,
  Satzzeichen). Stabile `id` — Zeilen-Keys sind `ore_<id>_<i>`.
- Neue Episoden in Level-typischer Grammatik verfassen (A1: Presente/Passato
  prossimo; A2: Imperfetto/Condizionale; B1: Congiuntivo/Gerundio/Passivo).
- **Erweitern bei neuem Level:** Level-Chips in `viewOrecchie` ergänzen.

### 9. Passaporto / Inizio
- Keine direkte Wortschatz-Nutzung; zeigen Story-Fortschritt/Zähler. Nur prüfen,
  dass nach neuem Level nichts Hartkodiertes falsch zählt (→ #10).

### 10. Hartkodierte Level-Listen — grep-Pflicht nach jeder Level-Erweiterung

```bash
grep -n '"A1", "A2", "B1"\|\["A1"' app.js tools/*.js stories.js
```

Bekannte Fundstellen: `viewVocab`-Chips, `CHECKLISTS`, `viewMissions`-Loop,
`viewViaggio`-/`viewOrecchie`-Chips (app.js); Dialog-/Checklisten-Level-Checks
(tools/validate.js); Checklist-Arrays (tools/generate-audio-manifest.js).

### 11. Audio-Manifest (tools/generate-audio-manifest.js → AUDIO-MANIFEST.csv/.txt)
- Der Generator kennt jede Quelle einzeln (`add(…)`-Zeilen). **Neue Quellen
  zuerst dort anmelden**, dann ausführen; MP3-Dateien bleiben optional (Fallback
  it-IT-TTS). Typen mit Key-Präfixen: siehe `fortschritts-regeln.md`.

### 12. validate.js
- Bei neuem Content-Typ oder Level: Regeln ergänzen (Vollständigkeit, eindeutige
  IDs, gültige Level, Level-Abdeckung, Mindestumfang). Neue Dateien in
  `shellFiles` aufnehmen. Die Validierung ist die Maschine, die diese Konvention
  dauerhaft erzwingt — eine Regel hier ersetzt zehn Erinnerungen im Chat.

### 13. sw.js / App-Shell
- Neue Dateien in `SHELL` aufnehmen; bei jeder Inhaltsänderung `CACHE` bumpen
  (sonst sehen installierte Geräte alt+cachierten Content).

### 14. Sync & Deploy
- `SYNC_KEYS` synchronisiert ganze localStorage-Blobs — neue SRS-Keys sind
  automatisch synchronisiert, es gibt nichts zu migrieren. Deploy per FTP macht
  der Nutzer (inkl. `sync-data/`, Rechte 755, Fallback 775/777).
