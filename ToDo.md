# ToDo — Stand 12.10.2026

- [x] **M3: Dialog-Rollen-Modus (Rollenspiel)** (22.11.2026):
      „🎭 Rollenspiel"-Button in jedem Viaggio-Dialog: geführter Modus,
      in dem die App die Partner-Rollen spricht und man die „Du"-Zeilen
      selbst sagt — Italienisch zuerst versteckt (wie Story-Szenen),
      optional per MediaRecorder aufnehmen (mehrere Takes, eigener Take
      abspielbar), dann „Lösung & anhören" + Selbstbewertung
      (✓ Sauber / ↻ Nochmal). Aufnahmen flüchtig (nichts in MEMODB/Sync);
      ohne Mikro komplett durchspielbar (Laut-Sprechen-Fallback).
      Belohnung: +15 XP pro beendetem Rollenspiel; je bewerteter
      Du-Zeile Sprechen-Skill +1, Tagesziel +1, Wochenbilanz
      „Sätze produziert" +1. E2E mikro-frei bestanden: „Im Restaurant"
      4/4 Zeilen, Fallback-Text, +15 XP, Sprechen +4, satze +4,
      todayCount +4, Endscreen, Zurück zur Lese-Ansicht, 0 JS-Fehler.
      sw v27 → v28; Spec: .scratch/m3-dialog-rollenspiel/spec.md.

- [x] **M2: XP-Identität + Quick Wins** (22.11.2026):
      XP-Stufen (rein abgeleitet, kein neuer Storage): 🧭 Turista (0) ·
      🎒 Viaggiatore (150) · 🤝 Amico del posto (500) · ☕ Quasi italiano
      (1.200) · 🏆 Italiano doc (2.500). Passaporto-Stufenkarte mit
      Fortschrittsbalken vor der Streak-Karte; Titel zusätzlich in
      Home-XP-Zeile und Percorso-Chip. Verbi-Tab: Level-Chips
      (Alle/A1/A2/B1, Parole-Muster) + Level-Badge je Zeile via
      VERB_LEVEL-Map (conjLevel); Detail zeigt Level +
      „regelmäßig/unregelmäßig" (conjIsRegular) — schließt die
      dokumentierte Lücke „Verben ohne Level". Reisedatum: Overlay mit
      input[type=date] (Speichern/Abbrechen/Löschen) ersetzt das letzte
      blockierende window.prompt und repariert die Datums-Validierung.
      Ritual-Gate (Readiness): Overlay + Banner erst nach der ersten
      abgeschlossenen Lektion (Bestandsprofile unberührt). E2E bestanden:
      Gate hält/löst, Stufenkarte rechnet (23 % bei 230 XP), Filter-Zählung
      100/19/16/135,essere-Detail „A1 · unregelmäßig", Trip-Dialog komplett
      ohne nativen Dialog, 0 JS-Fehler. sw v26 → v27; Spec:
      .scratch/m2-identitaet-quickwins/spec.md.

- [x] **M1: Conj vertiefen — SRS-Verzahnung, Statistik, Freiübung** (22.11.2026):
      Das Tages-Ritual bewertet jetzt alle 6 Formen still ins Leitner-SRS
      (verb_<slug>_<zeit>_<person>; Erstversuch → Box rauf, verhakt → Box 1;
      zählt nicht extra aufs Tagesziel — grade() hat dafür den quiet-
      Parameter). Neuer Allenamento-Modus „✏️ Verbformen (Tippen)": 10
      Formen due-first, aufgefüllt mit frischen Formen aus der Rotation
      (Zufallsperson, kommende Verben, heutiges Ritual-Verb ausgenommen),
      Tipp-Prüfung mit Akzent-/Gender-Toleranz wie im Ritual, keine XP
      (wie bei allen Trainings). Passaporto zeigt nach der Streak-Karte
      eine ☕-Bilanz: Konjugationen gesamt · Ø-Erstversuchs-Quote ·
      schwächste Person (ab 3 Anfragen je Person). verbKeyParse/
      verbsBySlugMap im Node-getesteten Marker-Block (Roundtrip über
      alle ~2.400 Formen, Slug-Eindeutigkeit). E2E bestanden: Ritual-
      Grading (Box 1/2, todayCount 1), Drill due-first + Endscreen,
      Statistik-Karte, Sync-Roundtrip (Push/Pull), kein Drill-XP,
      0 JS-Fehler. sw v25 → v26.

- [x] **Congiuga del giorno — tägliches Konjugations-Ritual** (22.11.2026):
      Beim ersten App-Start des Tages erscheint ein Overlay: ein Verb × eine
      Zeit, alle 6 Personen per Tipp-Eingabe in fester Folge (io → tu →
      lui/lei → noi → voi → loro — voi vor loro trotz Daten-Reihenfolge
      loro=4/voi=5). Falsch = Lösung zeigen + Nachholrunde bis einmal
      richtig. Abbrechbar über „Später", aber Terrakotta-Banner auf allen
      Seiten + erneutes Overlay beim nächsten Start bis zur Tages-Erledigung
      (+10 XP, zählt aufs Tagesziel). Rotation leicht → schwer, zur Laufzeit
      abgeleitet: pro Level reg. -are → -ere → -ire (inkl. -isc, -iare,
      -care/-gare mit h) → unregelmäßige (essere/avere zuerst), A1 → A2 →
      B1; drei Durchläufe Presente → Passato → Futuro (399 Einträge,
      unpersönliche Verben ausgenommen). Tipp-Toleranz: Akzente, Groß/Klein,
      Gender-Slash („sono stato/a"), Reflexiv-Klitikon optional. Neuer
      Sync-Key ciaoit_conj. Datenfix nebenbei: mancare „manciamo" →
      „manchiamo". Node-Regressionstest tools/check-conj-queue.js (prüft
      den app.js-Code zwischen Markern), validate 0 Fehler, sw v24 → v25,
      Browser-E2E bestanden (7 Szenarien, Screenshots in
      gui-test-screenshots/). Spec: .scratch/konjugations-ritual/spec.md,
      ADR: docs/adr/0001.

- [x] **Sechste Runde Minilektionen → Voll-Lektionen (A2: 10 weitere Minis)** (12.10.2026):
      lo la li le, mi ti gli, piacere & Co., ne — davon, ci — dort,
      Seit wann?, più / meno, meglio o migliore?, Es regnete…, Am Telefon II.
      Grammatik-Drills verstärkt: Plural-„piacciono“, ne mit Mengen, ci als
      „es gibt“, da + Zeit mit „un anno fa“-Kontrast, Unregelmäßige Vergleiche.
      1 Duplikat abgefangen („La salute viene prima di tutto.“ in
      consigli-nonna → variiert zu „Prima la salute, poi il resto.“).
      Neue A2-Pool-Karten: la salute, l'arcobaleno, la linea, lo zaino.
      A2 jetzt 60 Voll / 15 Minis. validate 0 Fehler, Audit 0 Lücken,
      Manifest 5.913 → 5.959, sw v23 → v24, Browser-E2E bestanden.

- [x] **Fünfte Runde Minilektionen → Voll-Lektionen (A2: die ersten 10 Minis)** (12.10.2026):
      Beginn mit A2 — die „m2a-"-Reihe komplett (Imperfetto-Blitz,
      Condizionale corto, Pronomi schnell, Più & meno) plus die ersten 6
      „m2b-"-Minis (Wir waren immer…, Passato o imperfetto?, Vorrei-Training,
      Höflich bitten, Ratschläge (tu), Höflich (Lei)). Gleiche Methode.
      Validate/Audit fingen 3 Kollisionen ab: „mentre" ist bereits
      Deckerwort der B1-Story „gerundio" (Karte entfernt), „Subito, signora!"
      (pizzeria) und „Oggi sto meglio, grazie." (meglio-peggio) → variiert.
      A2 jetzt 50 Voll / 25 Minis, A1 unverändert 81 Voll / 19 Minis.
      validate 0 Fehler, Audit 0 Lücken, Manifest 5.867 → 5.913,
      sw v22 → v23, Browser-E2E bestanden.

- [x] **Vierte Runde Minilektionen → Voll-Lektionen (A1 72–81)** (12.10.2026):
      Die „m2-"-Reihe ist jetzt komplett ausgebaut: Prezzi & Numeri,
      Famiglia a casa, Orientamento, Hobby & amici, Klein weh, Essenszeiten,
      Unterwegs, Frutta & Verdura, Nein sagen, Erste, zweite… — gleiche
      Methode (je 8 Wörter / 7 Sätze, key:-Verweise, Indizes 0–3 stabil).
      Validate hat einen falsch geratenen Key abgefangen (farmacia liegt in
      emergenza, nicht orientamento → korrigiert). A1 jetzt 81 Voll /
      19 Minis. validate 0 Fehler, Audit 0 Lücken, Manifest 5.832 → 5.867,
      sw v21 → v22, Browser-E2E bestanden.

- [x] **Dritte Runde Minilektionen → Voll-Lektionen (A1 47–50 + 66–71)** (12.10.2026):
      Damit ist die „m-"-Reihe komplett: Tage & Alltag, Getränke, Einkaufen &
      Zahlen, Haus & Farben. Dazu die ersten 6 „m2-"-Minis: Verbi & Cibo,
      Giorni & Ore, Colori & Vestiti, Animali & Numeri, In casa,
      Buongiorno o Ciao? — gleiche Methode (je 8 Wörter / 7 Sätze, key:-
      Verweise auf den Bestand, Indizes 0–3 stabil). Kleinkorrekturen:
      holprige Übersetzung in Giorni & Ore gefixt („um Mittag zu Mittag“ →
      „um zwölf zu Mittag“), Emoji-Kollision (armadio/porta) aufgelöst.
      A1 jetzt 71 Voll / 29 Minis. validate 0 Fehler, Audit 0 Lücken,
      Manifest 5.798 → 5.832, sw v20 → v21, Browser-E2E bestanden.

- [x] **Nächste 10 Minilektionen zu Voll-Lektionen ausgebaut (A1 37–46)** (12.10.2026):
      Mengen einkaufen, Smalltalk-Klassiker, Haus & Dinge, Wetter & Kleidung,
      Zahlen 60–100, Familie fragen, Restaurant & Rechnung, Freizeit & Tage,
      Sport draußen, Hier & dort — gleiche Methode wie 27–36: je 8 Wörter /
      7 Sätze, neue Wortkarten nur via Bestand (`key:`-Verweise), IDs und
      Satz-Indizes 0–3 stabil. 2 Satz-Duplikate abgefangen („Che tempo fa
      oggi?“ / „Con la pioggia …“ existierten schon → variiert). A1 jetzt
      61 Voll / 39 Minis. validate 0 Fehler, Audit 0 Lücken,
      Manifest 5.768 → 5.798, sw v19 → v20, Browser-E2E bestanden.

- [x] **Erste 10 Minilektionen zu Voll-Lektionen ausgebaut** (12.10.2026):
      A1 27–36 („m-"-Reihe) sind jetzt Voll-Stories im 7-Schritte-Format:
      Caffè & numeri, Wege & Orte, Familie & Alter, Am Tisch bestellen,
      Hotel & Zahlen, Zahlen 11–19, Unterwegs & Zeit, Farben am Teller,
      Körpergefühle, Stadt & Entfernung — je 8 Wörter / 7 Sätze (+3 neue
      Sätze, +2–3 Wortkarten je Lektion). Neue Wortkarten ausschließlich
      über Bestands-Vokabular (`key:`-Verweise, kein neuer Wortschatz);
      Story-IDs und Satz-Indizes 0–3 unverändert → SRS-/Audio-Keys und
      abgeschlossener Fortschritt bleiben erhalten. Titel ohne „Mini:"-Präfix,
      gleiche `covers`. A1 jetzt 51 Voll / 49 Minis. validate 0 Fehler,
      Audit 0 Lücken, Manifest 5.738 → 5.768, sw v18 → v19.

- [x] **Neuer Reiter „Sapere“ + 4 Feature-Wünsche umgesetzt** (12.10.2026):
      7. Tab „Sapere“ (✎, zwischen Verbi und Allenamento) als Sammelort für
      Erklär-Content mit drei Bereichen: **Pronuncia** — 12 Aussprache-Regeln in
      data.js (gn/gli/g-gio/gg/c-ch/gh/sc/h stumm/Doppelkonsonanten/Betonung/z)
      mit je 3–5 Hörbeispielen (gnocchi, campeggio, parco giochi …), Keys
      pron_<regel>_<slug>; **Grammatica** — erstes Thema Possessivpronomen
      (il mio/la mia … il loro): 6-Personen-Tabelle, 3 Merksätze (Verwandte ohne
      Artikel, il suo = sein UND ihr, loro unveränderlich), 9 Beispielsätze,
      Keys gram_possessivi_<slug>; **Modi di dire** — neue Datei phrases.js mit
      84 Redewendungen in 6 Kategorien (Zeit, Gespräch, Menge, Ort, Absicht,
      feste Wendungen; fra l'altro, al più presto, fra poco …), eigener
      Key-Raum phr_<kat>_<slug> (bewusst KEINE IT_DATA-Kategorie → kein
      Story-covers-Zwang, getrenntes Training), Karten- und MC-Training mit
      Leitner-SRS, zusätzlich als Allenamento-Modus und Sapere-/Home-Verweis.
      **Nächste-Lektion-Button** im Story-Finale (Reihenfolge wie Percorso,
      Level-Wechsel-Label „Weiter in A2“, Komplett-Text bei letzter Lektion).
      **Satzbau-Varianz**: withDistractors() ersetzt die festen 2 Ablenker —
      Produzieren jetzt 1–5, Allenamento-Satzbau/Misch-Training 0–4 zufällige
      Ablenker. **Flashcard-Beruhigung**: Toast „✓ N Antworten gespeichert“
      beim vorzeitigen Verlassen + Schlusshinweis (Antworten waren schon immer
      pro Karte sofort in ciaoit_srs gespeichert). validate.js +6 Regelblöcke
      (inkl. Vokabular-Kollisionscheck für Redewendungen), Manifest 5.597 →
      5.738, sw v17 → v18; Browser-E2E: 7 Tabs, alle Views, phr-Keys sofort
      persistent, Ablenker-Varianz (4/4/3/3/4), Next-Button startet Lektion 28,
      geseedeter Fortschritt nach Reload byte-identisch.

- [x] **voi (2. Person Plural) in alle Verbformen eingebaut** (26.09.2026): Schema
      von 5 auf 6 Personen erweitert — „voi" steht als **letzter Personenindex 5**,
      damit bestehende SRS-Keys (verb_*_*_0…4) ihre Bedeutung behalten (Fortschritt
      bleibt erhalten, kein Migration nötig). Alle 135 Verben × 3 Zeiten um
      handkurierte voi-Formen ergänzt (sein→siete, haben→avete, andare→andate,
      piacere→piacete …), Passato/Futuro/Reflexiv automatisch über die Helper
      (avete/siete/ete/vi); unpersönliche Verben (piovere, bisognare) bleiben
      nur lui/lei. Deutsch dazu: subjects/werden/habenPraes/deVerbs (ihr, werdet,
      habt, esst/seht/habt…). Zeitform-Flip-Satzdrill zieht jetzt auch voi-Sätze
      (neue Keys _5, +70). Dabei **Bugfix A2-Plural**: agreed() in verbs-a2.js
      lieferte „siamo salito/a" statt „siamo saliti/e" für alle Essere-Verben
      (salire/scendere/succedere/accomodarsi/fermarsi) — behoben und
      personengerecht wie in A1. validate.js erzwingt jetzt 6 Formen; Manifest
      5.597 (+469); sw v17; Browser-E2E:essere-Tabelle 6 Zeilen, Drill
      „Voi mangiate/avete mangiato/mangerete il pane — Ihr esst/habt/werdet",
      geseedeter Fortschritt nach Reload exakt unverändert.

- [x] **A1-Wortschatz +10 % via ciao-vocab-erweitern** (26.09.2026): 59 neue
      Wortkarten in 20 bestehenden A1-Kategorien (nur hinten angehängt, keine
      neuen Kategorien → Story-Abdeckung bleibt valide) inkl. „avere bisogno di“
      (brauchen); 10 neue A1-Verben (bisognare unpersönlich wie piovere, perdere,
      diventare, correre, cadere, accompagnare, assaggiare, accendere, spegnere,
      sedersi) — provare/consigliare/salire/scendere existierten bereits als
      A2-Karten; neuer A1-Dialog „Am Bahnsteig“ (binario) nutzt 7 neue Einträge;
      Fehler gefixt: sentirsi-Futur „senterò“ → „sentirò“; servire-Notiz ergänzt
      (mi serve = ich brauche). Duplikat-Verzicht, da in A2/B1 vorhanden: forse,
      invece, d’accordo, comodo, purtroppo, in orario. Manifest 5.128 Einträge,
      validate 0 Fehler, sw v16, Browser-E2E inkl. Fortschritts-Seed bestanden.
      A1 jetzt 605 Wörter / 100 Verben / 9 Dialoge.

- [x] **Projekt-Skills für Wortschatz-Erweiterung geschaffen** (26.09.2026):
      `.agents/skills/ciao-vocab-erweitern/` — Pflicht-Workflow (Daten anlegen →
      Feature-Audit über references/feature-inventar.md → Integration →
      Fortschritts-Regeln → Checks: Manifest/validate/sw-Bump/Browser-E2E → Report)
      und `.agents/skills/ciao-feature-audit/` — Nur-Lese-Audit mit
      `scripts/abdeckung.js` (Level-×-Feature-Deckungsmatrix, hartkodierte
      Level-Listen, Manifest-Abgleich; Exit 1 bei Lücken). Erster Audit-Lauf:
      0 Lücken.

- [x] **Viaggio & Orecchie auf A2/B1 skaliert** (26.09.2026): Reise-Dialoge mit
      Level-Labels (8×A1, 5×A2, 4×B1; „Beim Arzt“ → A2, „Film-Diskussion“ → B1)
      plus 8 neue Dialoge (Apotheke, Bahnhof-Verspätung, Wetter, Telefon-Reservierung,
      Flughafen, Vorstellungsgespräch, Nachrichten), Level-Filter-Chips und Badges;
      Reisecheckliste jetzt dreistufig (A1 30 / A2 15 / B1 15) — A1 behält die alten
      chk_-Keys, A2/B1 nutzen chkA2_/chkB1_, Fortschritt bleibt erhalten;
      Orecchie von 3 auf 9 Hör-Geschichten (3 je Level, A2: Imperfetto/Condizionale,
      B1: Congiuntivo/Gerundio/Passivo) mit Level-Filter; Audio-Manifest +108 Einträge
      (4.931), validate.js erzwingt jetzt Level-Vollständigkeit, sw v15.

- [x] **Bilder verbessert:** Flache SVG-Illustrationen statt Emojis (`illustrations.js`,
      ~490 Zeichnungen, 56 % Abdeckung; Funktionswörter bleiben Emoji-Fallback).
- [x] **A1 auf 50 Lektionen:** 26 Voll-Stories + 24 Mini-Lektionen, Ziel wird von
      `tools/validate.js` erzwungen.
- [x] **Ciao Italia 2.0, Runde 1 „Piazza & Passaporto":** Echte-Welt-Mission als
      Kernschleife (3 Varianten: laut sagen · vor Ort · schreiben), Sprachmemos
      (MediaRecorder → IndexedDB, ohne ASR), Sprachtagebuch „Sette giorni, sette
      frasi", Output-Zähler (produzierte Sätze), Passaporto-Ansicht (Kompetenz-
      Radar, Szenarien, Stempel, Memos), Streak-Entgiftung (Rekord für immer,
      1 Pausentag/Woche, Wochenbilanz).
- [x] **Runde 2 „Il momento giusto":** Readiness-Gate (SRS-Box ≥ 3 → „bereit"),
      Espresso del giorno (eine Tages-Challenge, danach Ruhe), Endowed-Progress-
      Zeile im Hero.
- [x] **Runde 3 „La Campagna & Orecchie":** 5 Reise-Kapitel mit Meilenstein-Sätzen,
      Hör-Geschichten (Orecchie) in drei Tempi mit Tap-Übersetzung.
- [x] **Lektionszahlen verdoppelt:** A1 100/100 ✓ (erzwungen), A2 24/24 ✓, B1 20/20 ✓ — validate erzwingt alle drei Ziele.
- [x] **A2 auf 75 Lektionen erweitert** (20 Stories + 31 Minis), Ziel von validate.js erzwungen.
- [x] **B1 auf 75 Lektionen erweitert** (22 Stories + 33 Minis), Ziel von validate.js erzwungen.
- [x] **Server-Sync gebaut** (sync.php + Passaporto-Sektion): Fortschritt + Memos landen auf dem Server, Auto-Push nach dem Lernen, Auto-Pull beim Start, Schutz vor Leer-Überschreiben, 401 bei falschem Code.
- [x] **Portugal-Relikte bereinigt** (DE→PT, PT→DE, „Muito bem“ → italienisch) und **Allenamento skalier**: Story-Sätze (~1.350) in alle Drill-Pools integriert (Pool 350 → 1.696 Sätze), Session-Größen erhöht (Misch 24, Satzbau 20, Karteikarten 40, Drill 24, Shadowing 24).
- [x] **Viaggio & Parole modernisiert:** Missions-Liste mit allen 258 Missionen (Reise + Lektionen, je +25 XP), Checkliste mit SRS-Grading (alte Häkchen migriert), Dialog-Wiedergabe ohne Überlappung (Tempo + Stop), Story-Verweise; Parole mit Level-Filtern, Lernstand-Balken, Lernpunkte pro Wort und Kategorie-Üben.
- [x] **Release-Check komplett:** Alle Reiter + Klickpfade getestet. Gefunden & gefixt: IDBRequest-Bug (Memo-Liste/tx lieferte immer undefined), MEMODB.open gehärtet (onblocked + Timeout), Audio-Manifest um Kapitel- und Orecchie-Keys erweitert (4.823), Sync-Erstkontakt/Gerätewechsel erneut verifiziert.
- [ ] **Später:** Minilektionen schrittweise zu Voll-Lektionen ausbauen — als
      Nächstes die letzten 15 A2-Minis, dann B1 ab 43 (36 „m-"-Minis);
      A1 offen: 82–100 (19 Minis). Insgesamt noch ~70 Minis
      (kein Generator, alle handgeschrieben).
- [ ] **Später:** Web-Push, echte Audioaufnahmen, ggf. B2-Gerüst befüllen.
- [ ] **Optional später:** Web-Push-Erinnerungen (iOS 16.4+), echte Audioaufnahmen
      für Hör-Geschichten statt TTS, A2/B2-Kapiteldramaturgie.
