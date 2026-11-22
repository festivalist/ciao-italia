# EXPOSÉ — Ciao Italia

**Italienisch-Lern-App (PWA) für deutschsprachige Selbstlerner — inhaltlich-funktionale Gesamtbeschreibung.**

Dieses Dokument beschreibt Zweck, Inhalte, Features und Bedienung der App vollständig und unabhängig von der heutigen technischen Umsetzung. Es dient als Grundlage für eine Neuimplementierung: **Wie** die App gebaut wird (Framework, Dateistruktur, Datenspeicherung) ist frei — **was** sie leistet, welche Inhalte sie hat und welches Lernsystem sie fährt, ist hier verbindlich beschrieben.

**Feste Randbedingungen (bleiben erhalten):**
- Die App ist eine **Progressive Web App (PWA)**, die im Browser läuft und sich auf dem Smartphone (insbesondere iPhone) zum Home-Bildschirm installieren lässt.
- Sie läuft auf **eigenem Webspace** (Shared Hosting mit PHP und HTTPS), Deployment per **FTP**. Kein App-Store, kein Account-Zwang, keine Fremd-Dienste.
- Sie funktioniert nach dem ersten vollständigen Laden **komplett offline**.

Stand der Beschreibung: Version ciaoit-v25 (November 2026).

---

## 1. Zweck und Zielbild

**Ciao Italia** bringt deutschsprachige Selbstlerner von null auf reise- und alltagstaugliches Italienisch — und darüber hinaus bis Niveau B1. Die App ist für **eine Person** gebaut (die Betreiberin/den Betreiber), funktioniert aber für jeden Nutzer mit eigenem Geräteprofil.

Leitgedanke: **„Italienisch für die Reise — nach dem Prinzip der kleinsten wirksamen Dosis.“**

- Kein Kurs-Stunden-Denken, sondern **kleine, tägliche Einheiten**: eine Lektion ≈ 6 Minuten, eine Mini-Lektion ≈ 3–4 Minuten, eine Tages-Challenge („Espresso del giorno“) ≈ 3 Minuten, eine Tages-Konjugation („Congiuga del giorno“) ≈ 1–2 Minuten.
- **Aktives Produzieren statt passivem Konsum**: Wer Sätze sagt, baut und schreibt, behält.
- **Bezug zur echten Welt**: Jede Lektion schaltet eine reale Aufgabe („Missione“) frei — sagen, bestellen, fragen — vor, während und nach der Italienreise.
- **Output zählt, nicht Zeit**: Der „Passaporto“ misst produzierte Sätze, erledigte Missionen, Aufnahmen und Kompetenzen — niemals „Minuten in der App“.
- Motivation ohne Druck: Streak mit eingebauten Pausentagen und „Freezes“, Tagesziel 15 Übungen, tägliche Kurz-Challenge — danach ist Feierabend („per oggi basta!“), bewusst **keine** Benachrichtigungs-Nerverei, keine Ranglisten.

Basissprache ist **Deutsch**, Zielsprache **Italienisch (it-IT)**. Die Navigations- und Bereichsnamen sind bewusst italienisch (Percorso, Parole, Verbi …) — das Produkt soll den Lerner vom ersten Tap an „nach Italien versetzen“; alle Erklärungen und Übersetzungen sind Deutsch.

---

## 2. Produktform: PWA, Installation, Offline, Betrieb

- **Web-App** mit App-Manifest (Name „Ciao Italia — Grundkurs“, eigenes Icon, Vollbild-Modus, Portrait, Theme-Farbe Dunkelgrün `#155B45`, Hintergrund Creme `#F6F0E4`).
- **Installation auf dem iPhone**: In Safari öffnen → Teilen → „Zum Home-Bildschirm“. Danach erscheint Ciao Italia als eigenständige App ohne Browser-Chrome.
- **Offline**: Nach dem ersten vollständigen Laden läuft die App ohne Netzverbindung — der komplette Inhalt (App-Hülle + alle Daten) wird auf dem Gerät vorgehalten. Nur die Server-Sicherung des Fortschritts braucht online.
- **Hosting & Deployment**: Upload des gesamten App-Ordners per FTP auf den eigenen Webspace (real: lima-city, Subdomain, SSL erzwungen). Updates werden ebenso per FTP hochgeladen; installierte Geräte erkennen beim nächsten Start eine neue Version (Versionskennung der Offline-Kopie) und laden sie.
- **Serverkomponente (minimal)**: Genau ein kleines Endpunkt-Skript auf demselben Webspace sichert den Lernfortschritt als Datenpaket pro Sync-Code (Details in Abschnitt 15). Sonst gibt es keinen Server, keine Datenbank, keine Nutzerkonten.

---

## 3. Didaktisches Konzept

Die App kombiniert mehrere erprobte Methoden zu einem System:

1. **Dekonstruktion nach Tim Ferriss**: Sechs „Schlüssel-Sätze“ („La mela è rossa.“ → „Lei gliela dà.“) legen die zentrale Grammatik offen — Geschlecht, Besitz mit *di*, indirektes/direktes Objektpronomen, Pronomen-Kombinationen. Sie stehen auf der Startseite mit Erklärung („reveal“) und Audio.
2. **Hochfrequenter Reise-Wortschatz**: 832 Wörter in 52 Alltags-Kategorien, konsequent in Szenen verankert.
3. **Leitner-Wiederholung (SRS)**: Jedes gelernte Element (Wort, Satz, Wendung, Verbform, Checklisten-Satz) wandert durch 8 Boxen mit wachsenden Intervallen (0/1/2/4/7/14/30/60 Tage). Richtige Antwort = eine Box höher, falsche = zurück auf Box 1.
4. **Aktives Abrufen & gemischte Formate**: Multiple Choice, Hören, Lückentext, Satzbau-Kacheln, Shadowing, DE→IT-Produktion — gemischte Aufgabentypen in einer Session wirken am stärksten.
5. **Graded Input**: Kurze Hör-Geschichten auf Level-Niveau (Orecchie) — „Input ist der Dünger für dein Italienisch.“
6. **Piazza-Schleife (Transfer in die echte Welt)**: Lektion → freigeschaltete Missione → laut sagen / aufnehmen / aufschreiben → als erledigt stempeln.
7. **Readiness statt Sperre** (WaniKani-Prinzip): Die nächste Lektion zeigt an, wie viel Prozent ihrer Wörter schon „sitzen“ (SRS-Box ≥ 3). Starten ist aber immer möglich — nichts ist hart gesperrt.
8. **Form follows content**: Jede Übung erzeugt sofortigen, dauerhaften Fortschritt („Jede Antwort war sofort gespeichert“) — auch mitten in einer Session beenden kostet nichts.

---

## 4. Bedienung & Navigation

**Einstieg ist immer der Percorso (Lernpfad).** Darunter eine Tab-Leiste mit sieben Bereichen (italienisch beschriftet):

| Tab | Name | Inhalt |
|---|---|---|
| ◉ | **Percorso** | Der Lernpfad: alle 250 Lektionen, Level für Level, mit Fortschritt |
| ⌂ | **Inizio** | Startseite: Countdown zur Reise, Tagesziel, Espresso del giorno, nächste echte Mission, Wochenbilanz, Kategorie-Fortschritt, Ferriss-Sätze |
| Aa | **Parole** | Wortschatz: 832 Wörter in 52 Kategorien, Suche, Level-Filter |
| ↻ | **Verbi** | 135 Verben mit Konjugationstabellen (3 Zeiten × 6 Personen) |
| ✎ | **Sapere** | Wissen: Aussprache-Regeln, Grammatik, 84 Redewendungen |
| ◎ | **Allenamento** | Freies Training: 8 Trainingsmodi |
| ◇ | **Viaggio** | Reisematerial: Checklisten, Missionen, 18 Dialoge |

Dazu in der Kopfzeile: **🛂 Passaporto** (Profil & Können, Abschnitt 12) und ein **globaler Ton-Schalter** 🔊/🔇.

**Congiuga del giorno (Tages-Konjugation):** Beim ersten App-Start des Tages öffnet sich ein Abfrage-Overlay: ein Verb wird vollständig durchkonjugiert — sechs Personen in fester Folge (io → tu → lui/lei → noi → voi → loro), Formen werden getippt (Akzente, Groß-/Kleinschreibung und Gender-Alternativen wie „stato/a" sind tolerant). Falsche Formen werden aufgelöst und am Ende der Runde erneut abgefragt, bis sie einmal richtig getippt wurden. Das Ritual ist abbrechbar („Später"), aber ein Terrakotta-Banner bleibt auf allen Seiten stehen, und beim nächsten App-Start erscheint das Overlay erneut — bis die Tages-Konjugation erledigt ist (+10 XP, zählt aufs Tagesziel).

**Typischer Tagesablauf eines Nutzers:**
1. App öffnen → **Congiuga del giorno**: das Tages-Verb konjugieren (Overlay; abbrechbar, dann Banner-Erinnerung) → Startseite zeigt „Weiter mit Story X“ oder den **Espresso del giorno** (genau eine kurze Challenge pro Tag, danach „Espresso getrunken — per oggi basta!“).
2. Lektion spielen (≈ 6 Min) oder Training starten, bis das **Tagesziel** (15 Übungen, Ring-Anzeige) erfüllt ist.
3. Falls erledigt: die freigeschaltete **echte Mission** ansehen („Sag es laut, draußen oder schreib es“), ggf. Sprachmemo aufnehmen.
4. Streak (🔥 Tage am Stück) und Wochenbilanz wachsen; nach ca. 8 Sekunden wird der Fortschritt automatisch auf dem Server gesichert (falls Sync-Code gesetzt).

Weitere Bedienelemente: **Reisedatum** festlegen (Countdown „Noch X Tage bis Italien“ / „Buon viaggio — heute!“ / „Reise vorbei — dranbleiben!“), Kapitel-Meilensteine im A1-Pfad, deep-linkbare Bereiche über URL-Anker.

---

## 5. Der Lernpfad (Percorso)

### 5.1 Umfang

**250 Lektionen** in drei aktiven Leveln:

| Level | Label | Lektionen | davon Voll-Stories | davon Mini-Lektionen | Ziel (erzwungen) |
|---|---|---|---|---|---|
| **A1** | Grundwortschatz | **100** | 81 | 19 | 100 |
| **A2** | Alltag ausbauen | **75** | 60 | 15 | 75 |
| **B1** | Sicher im Gespräch | **75** | 39 | 36 | 75 |
| **Summe** | | **250** | 180 | 70 | |

Danach sind **B2 („Nuancieren & argumentieren“), C1 („Stil & Register“), C2 („Perfezionamento“)** als Gerüst vorgesehen (Abschnitt 17).

### 5.2 Lektionsformate

**Voll-Story (7 Schritte, ~6 Minuten):**
1. **Intro** — Titel + Szenenbeschreibung („Eine kleine Szene aus Italien“)
2. **Entdecken** — neue Wortkarten: flache Illustration (oder Emoji), Audio läuft automatisch, italienisches Wort + deutsche Bedeutung werden erst per Tap aufgedeckt
3. **Hören** — Audio → richtige deutsche Bedeutung (4 Optionen)
4. **Erkennen** — italienisches Wort → deutsche Bedeutung (Lesen)
5. **Bauen** — italienischen Satz aus Wort-Kacheln in die richtige Reihenfolge tippen (IT→IT-Verständnis)
6. **Szene** — der Dialog der Story: die App spricht die Partner-Rollen, die eigenen Zeilen („Du“) sagt man zuerst selbst laut, dann Aufdeckung + Audio
7. **Produzieren** — deutscher Satz → italienischen Satz aktiv aus Kacheln bauen (mit Ablenkern aus den anderen Story-Sätzen) → **Abschluss**: XP, ggf. Badge, Verweis auf die echte Mission, Direkt-Weiter zur nächsten Lektion

**Mini-Lektion (`mini`, 4 Schritte, ~3–4 Minuten):** Entdecken (4 Wörter) → Hören (4×) → Bauen (1×) → Produzieren (2×). Minis drillen **bekannte Wörter in neuen Kombinationen** (Listen, Mengen, Zahlen, Farben × Essen, Pronomen, Congiuntivo-Formen …) — sie führen Grammatik-Vertiefung ohne nennenswerten Neuwortschatz durch.

### 5.3 Aufbau & Dramaturgie

- Jede Lektion: **id, Level, Titel (mit Icon), Szenenbeschreibung, 5–8 Wörter, 4–7 Sätze (IT/DE), Bauch-/Produktions-Indizes, optionaler Dialog- und Missions-Verweis, Abdeckungs-Verweis auf Wortschatz-Kategorien** (`covers`).
- **Kapitel-Dramaturgie in A1** (nur dort): Der 100-Lektionen-Pfad ist in 6 Kapitel gegliedert — *L'arrivo* 🧳 (1–4), *La città* 🏛️ (5–8), *Le persone* 👨‍👩‍👧 (9–14), *La pratica* 🛠️ (15–26), *Le combinazioni* 🧩 (27–50), *Espansione* 🚀 (51–100). Ist ein Kapitel komplett, wird ein **Meilenstein-Satz** freigeschaltet (z. B. „Due caffè e un cornetto — quanto fanno?“), der angehört werden kann.
- **Bereitschaft**: Die als „nächste“ markierte Lektion zeigt, wie viele Prozent ihrer Wörter bereits SRS-Box ≥ 3 haben — „Bereit ✓ · 80 % der Wörter sitzen“ oder „Noch nicht ganz bereit (40 %) — aufrischen hilft, starten reicht auch“.
- Erledigte Lektionen sind anytime wiederholbar („Geschafft — zum Wiederholen tippen“).
- Der Pfad listet pro Level Fortschritt („A1 · Grundwortschatz 62/100“), XP-Chip, Badge-Regal; geplante Level erscheinen ausgegraut mit 🔒 und Ziel-Beschreibung.

### 5.4 Themen der Lektionen

**A1 (100):** Die ersten 14 Stories sind szenische Kernlektionen (*Un caffè al bar, Al ristorante, L'arrivo, In albergo, Lo shopping, Aiuto!, Natura e animali, La mia giornata, Famiglia e amici, A casa mia, Il weekend in città, Che lavoro fai?, Un nuovo amico, Piani e desideri*), danach Themenerweiterung (*Al supermercato, La settimana, Che ora è?, La famiglia Rossi, Il tempo libero, Il corpo in movimento, Che cos'è?, I numeri grandi, Dove abiti?, Un giorno di pioggia, Al bar con amici, Il mio giorno*) und ab Lektion 27 kombinatorische Aufbau-Lectionen (*Caffè & numeri, Mengen einkaufen, Smalltalk-Klassiker, Zahlen 60–100 …* bis *Nein sagen, Erste, zweite…*), gefolgt von 19 Mini-Drills (*Sole & ombrello, Die goldenen zehn, Die 4 Zauberwörter …*). Grammatik-Verteilung A1: Präsens überall, formelle Anrede (Lei) in 1–6, du-Form ab 9/13, Passato prossimo als Ausblick, reflexive Verben in Story 8; Zukunft natürlicher A1-Stil („domani + Präsens“).

**A2 (75):** Erzählen & Alltag — *Quando ero piccolo, Problemi in treno, Alla trattoria, Dal medico, Che tempo farà?, Alla posta, L'appartamento, Il colloquio, Un messaggio ad Anna, Cosa metto in valigia?, Come ti senti?, Il fine settimana in Toscana* … bis *Am Telefon II*, dazu 15 Minis (*Einschreiben, Doppel-Pronomen, Umsteigen …*). Grammatik: Imperfetto/Passato-Kontrast, Condizionale, Imperativo (tu/Lei/voi), direkte & indirekte Pronomen, *piacere*, *ne/ci*, Vergleiche, *da* + Zeitraum, Passivo-light.

**B1 (75):** Meinung & Diskussion — *Penso che…, Le notizie di oggi, Ambiente e clima, In aereo, Il grande progetto, Traffico in città, In cucina, Sogni e dubbi, Mi piacciono i film italiani, Il viaggio dei sogni* … plus 36 Minis (*Congiuntivo veloce, il quale/di cui, Se domani…, gliel'ho detto, viene aperto …*). Grammatik: Congiuntivo presente/passato, Gerundio & *stare per*, Passivo, Periodo ipotetico 1, Relativsätze, Discorso indiretto, Pronomen-Pakete, Konnektoren (*tuttavia, nonostante*).

### 5.5 Wortschatz-Verankerung („covers“)

Jede Story deklariert, **welche Wortschatz-Kategorien sie einführt/abdeckt**. Zwei harte inhaltliche Regeln gelten:
- Die `covers`-Angaben **aller Stories eines Levels müssen zusammen jede Wortschatz-Kategorie dieses Levels abdecken** — keine Kategorie bleibt unbenutzt.
- Story-Wörter referenzieren entweder einen **bestehenden Wortschatz-Eintrag** (dann teilen sie dessen Lernzustand) oder sind **einmalige story-lokale Wörter** (Doppelung über alle Stories verboten).

Insgesamt stecken in den 250 Lektionen **1.777 Wortkarten** (davon 276 Verweise auf den Bestand, 1.501 story-lokal) und **1.540 kuratierte Satzpaare (IT/DE)**.

---

## 6. Wortschatz (Parole)

**832 Wörter und Ausdrücke in 52 Kategorien**, jede Kategorie mit Level-Kennzeichnung, Icon, deutschem Titel; jedes Wort mit italienischer Form + deutscher Bedeutung (+ Audio). Ein Wort kann zusätzlich einen stabilen Verweis-Schlüssel tragen (wichtig, wenn dieselbe „Wortkarte“ in mehreren Lektionen den Lernzustand teilen soll).

**Filter:** Alle / A1 / A2 / B1. **Suche** auf Italienisch oder Deutsch (Akzent-unabhängig), ab 100 Treffen Aufforderung zur Eingrenzung. Jede Kategorie-Kachel zeigt Fortschritt („X Wörter · Y gereift“ mit Füllbalken); „gereift“ = SRS-Box ≥ 4.

In jeder Kategorie: **„Diese Kategorie üben“** (Karteikarten-Deck nur dieser Kategorie) und — falls vorhanden — **„Lernen im Kontext: ‹Story-Titel›“** (Sprung in die covernde Lektion).

### Bestand A1 — 33 Kategorien (605 Wörter)
Begrüßung & Höflichkeit (15) · Menschen & Pronomen (12) · Zahlen (14) · Zeit & Tage (15) · Essen & Restaurant (24) · Reisen & Verkehr (15) · Orientierung & Orte (12) · Einkaufen & Geld (8) · Notfall & Gesundheit (8) · Smalltalk & Fragen (10) · Eigenschaften (12) · Fragewörter (8) · Familie & Beziehungen (29) · Haus & Gegenstände (29) · Körper & Befinden (27) · Kleidung & Aussehen (24) · Schule & Sprache (26) · Arbeit & Technik (20) · Stadt & öffentliche Orte (25) · Natur & Wetter (21) · Kalender & Tageszeiten (26) · Weitere Zahlen & Mengen (25) · Freizeit & Kultur (15) · Verbindungs- & Fragewörter (29) · Artikel & kleine Pronomen (21) · Weitere Eigenschaften (30) · Zeit/Ort & Häufigkeit (24) · Weitere Lebensmittel (19) · Weitere Reisewörter (14) · Farben (13) · Tiere (14) · Länder & Städte (12) · Uhrzeit & Dauer (9)

### Bestand A2 — 11 Kategorien (134 Wörter)
Emotionen & Charakter (16) · Gesundheit & Arzt (14) · Wetter vertieft (12) · Unterwegs: Details (12) · Post & Bank (12) · Ausgehen & Menü (12) · Wohnen & Nachbarschaft (12) · Bewerbung & Arbeitswelt (12) · Telefon & Nachrichten (12) · Erzählen & Erinnerung (10) · Kleidung im Detail (10)

### Bestand B1 — 8 Kategorien (93 Wörter)
Meinung & Diskussion (12) · Medien & Nachrichten (12) · Umwelt & Klima (12) · Flug & Fernreisen (10) · Karriere & Projekte (12) · Stadtleben (11) · Küche & Rezepte (12) · Denken & Gefühlswelt (12)

*(832 = 605 + 134 + 93; jede Zahl in Klammern = Wörter je Kategorie.)*

---

## 7. Verben (Verbi)

**135 Verben** — 100 (A1-Kern), 19 (A2-Ergänzung), 16 (B1-Ergänzung) — jeweils mit:
- Infinitiv + deutsche Bedeutung (+ optionaler Merkhinweis),
- vollständiger Konjugation in **Presente, Passato prossimo, Futuro semplice**,
- **6 Personen**: io, tu, lui/lei, noi, loro, voi (Person 6 = *voi*, bewusst ans Ende gestellt),
- bei *essere*-Verben geschlechtsabhängige Partizipien in der Form `stato/a` bzw. `stati/e`,
- handkuratierte Formen (keine Stamm-Automatik über unregelmäßige Verben hinweg).

**Ansicht:** Durchsuchen nach Infinitiv oder Bedeutung; Verbdetail mit Zeit-Chips (Presente/Passato/Futuro), je Form Pronomen + Form + Einzeln-Abspielen, plus eine kurze didaktische Erläuterung zur Zeit („Passato prossimo = avere/essere + Partizip“).

**A2-Neuzugänge (Beispiele):** provare, inviare, raccontare, spiegare, consigliare, succedere, scegliere, salire, scendere, lasciare, mancare, raggiungere, regalare, indossare, guidare, guarire, noleggiare, accomodarsi, fermarsi. **B1-Neuzugänge:** sperare, dubitare, evitare, suggerire, permettere, vietare, ridurre, aumentare, proteggere, inquinare, riciclare, pubblicare, sembrare, sostenere, organizzare, partecipare.

Bekannte bewusste Grenze des heutigen Produkts (kein Muss für die Neuimplementierung, aber dokumentiert): **Verben tragen kein Level** — der Reiter hat keinen Level-Filter.

---

## 8. Sapere — Aussprache, Grammatik, Redewendungen

### 8.1 Aussprache (Pronuncia) — 12 Regeln mit Hörbeispielen
gn → nj · gli → weiches glj · g vor e/i → dsch · gg vor e/i → langes dsch · c vor e/i → tsch · ch → k · gh → hartes g · sc → sch oder sk · h ist immer stumm · Doppelkonsonanten halten länger (nonno ≠ nono) · Betonung meist vorletzte Silbe (città, caffè) · z → ts oder dz. Jede Regel: Titel, einprägsame Erklärung, 3–5 Beispielaudiowörter mit Bedeutung.

### 8.2 Grammatik (Grammatica) — Themenseiten
Bisher ein Thema, ausbaubar: **Possessivpronomen** — Erklär-Intro („Die Form richtet sich nach dem besessenen Ding, nicht nach dem Besitzer“), Tabelle io→loro × m./f./m.Pl./f.Pl. (*il mio … il loro*), drei Merk-Notizen (Artikel+Endung; Verwandte im Singular ohne Artikel; *loro* unveränderlich) und 9 anhörbare Beispielsätze.

### 8.3 Redewendungen (Modi di dire) — 84 Wendungen in 6 Themen
Zeit & Dringlichkeit · Gespräch & Reaktion · Menge & Grad · Ort & Bewegung · Absicht & Art · Feste Wendungen. Beispiele: *non vedo l'ora, ci penso io, mi raccomando, a due passi, per carità, come si dice…?* Jede Wendung optional mit Merkhinweis (💡). Kuration: keine Wendung, die schon als Vokabel existiert.

**Training:** pro Kategorie oder gemischt — Karteikarten (IT→DE) und Multiple Choice (lesen oder hören), volle Leitner-Wiederholung. Wendungen haben bewusst **kein Level** und keine Story-Pflicht.

---

## 9. Allenamento — die Trainingsmodi

Freies Training außerhalb des Pfads; alle Modi speisen sich automatisch aus dem Gesamtwortschatz, den Satzmustern und den Story-Sätzen (fällige Elemente zuerst — „due-first“):

1. **🎲 Misch-Training** (empfohlen, 24 Aufgaben): wechselt zufällig zwischen allen Formaten — Multiple Choice (Wort → Bedeutung), Hör-Auswahl, Lückentext (Verbform), Satzbau-Kacheln.
2. **🧩 Satzbau (Kacheln, 20 Aufgaben):** italienischen Satz aus Wort-Kacheln in richtiger Reihenfolge tippen; **0–4 Ablenker** in zufälliger Anzahl aus dem Drill-Wortschatz; Zurücksetzen/Prüfen; Feedback „Giusto!“/„Richtig: …“.
3. **🃏 Karteikarten (Wörter, bis 40):** klassisches Umdrehen IT→DE mit Selbstbewertung („✓ Wusste ich“ / „↻ Nochmal“), Akzent-Lautsprecher, Antwort zählt sofort.
4. **🗣️ Satz-Drill (DE→IT, 24):** Pimsleur-Stil — deutschen Satz lesen, italienisch **laut sagen**, dann „Lösung & anhören“ aufdecken und selbst bewerten. Zeitform-Badge zeigt Presente/Passato/Futuro.
5. **🔁 Zeitform-Flip (minimal pairs):** derselbe Satz in einer Person — erst Presente, dann Vergangenheit, dann Zukunft; Verbform hervorgehoben; man formt jeweils um, bevor man weiterklickt.
6. **🎙️ Shadowing (24):** hören → laut nachsprechen → Text zeigen (IT + DE). Trainiert Aussprache und Hörverstehen.
7. **💬 Redewendungen:** siehe 8.3.
8. **🎧 Orecchie (Hör-Geschichten):** siehe Abschnitt 11.

**Satz-Engine (inhaltliches Prinzip):** Aus 14 kuratierten SVO-Mustern (*mangiare il pane, bere l'acqua, pagare il conto, comprare un biglietto, avere tempo* …) entstehen durch Kombination mit 6 Personen × 3 Zeiten **210 vollständige Satzpaare** — die deutsche Seite wird dabei grammatisch passend erzeugt (Präsens/Präteritum/perfekt-artiges „haben + Partizip“/Futur mit *werden*). Zusätzlich entstehen daraus Verneinungen („Io non mangio pane.“) und Fragen („Mangi il pane?“). Zusammen mit den 1.540 Story-Sätzen (dedupliziert) bildet das den Drillsatz-Pool. Lückentext-Ablenker stammen ausschließlich aus echten Verbformen.

Abschluss jeder Session: Ergebnis („X/Y richtig“), Nochmal (Optionen neu gemischt), Zurück.

---

## 10. Viaggio — Reisematerial

### 10.1 Reisechecklisten (je Level)
Wörtlich abhakbare „Sätze, die man können muss“, je Satz: anhören, laut sagen, dann selbst bewerten (✓ wusste ich / ↻ nochmal) — **alles wandert in die Leitner-Wiederholung**; ein Fortschrittsbalken zeigt „X/Y sitzen sicher“ (SRS-Box ≥ 4).
- **A1: 30 Sätze** — Höflichkeit, Verständnis-SOS (*Può ripetere?*, *Non capisco*), Bestellen, Zahlen, Weg, Notfall.
- **A2: 15 Sätze** — langsamer sprechen bitten, günstigerer Zug, Wetter, Apotheke, Post, Bank, WLAN, Rechnung teilen.
- **B1: 15 Sätze** — Missverständnis, Reklamation (beschädigtes Gepäck), Bewerbung, respectfully widersprechen, Rückruf.

### 10.2 Missionen — echte Aufgaben in der Welt
**12 Reise-Missionen** in drei Phasen:
- **Vorbereiten (prima):** alle 30 Sätze der Reisecheckliste A1 einmal geschafft.
- **Unterwegs (viaggio):** „Bestelle einen Kaffee auf Italienisch“ (*Un caffè, per favore.*), „Bitte im Restaurant um die Rechnung“, „Frag eine Person nach dem Weg“, „Kauf eine Fahrkarte am Schalter“, „Bedanke dich ohne Englisch“ (*Grazie mille!*), „Frag, ob Karte geht“, „Bestelle ein Gelato“, „Grüße morgens drei Menschen mit Buongiorno“.
- **Nach der Reise (dopo):** sieben Tage weitergelernt, ein kurzes Gespräch mit Muttersprachler (*Parlo un po' d'italiano.*), einen italienischen Film mit Untertiteln.

Dazu **automatisch eine Mission pro abgeschlossener Lektion** (Story-Satz oder verknüpfte Reise-Mission), gruppiert nach Level mit Fortschrittszählern. Erledigen einer Mission: +25 XP, Stempel im Passaporto, Toast „Mission erledigt! 🎯“.

**Missione-Detailseite** (hinter jeder Story): drei Varianten der Erfüllung —
1. **Zuhause laut sagen** (dreimal nachsprechen; optional **Sprachmemo aufnehmen**, das gespeichert und wieder abspielbar ist),
2. **Vor Ort** (erscheint bei gesetztem Reisedatum: „Nutze diesen Satz echt — an der Bar, am Schalter. Vor Ort zählt: mutig sein, nicht perfekt.“),
3. **Schreiben:** eigene Variante formulieren → landet im Sprachtagebuch.

### 10.3 Reise-Dialoge — 18 Szenen, Level A1–B1
Jeder Dialog: 5–7 Zeilen mit Rollen (Kellner, Rezeption, Passant, „Du“ …), italienisch + deutsch, einzeln anhörbar oder **am Stück in drei Tempi** (🐢 Lento / Normale / Veloce), Stop-Taste; Sprung in die verknüpfte Story-Szene und zurück.

| Level | Dialoge |
|---|---|
| **A1 (9)** | Im Restaurant · In der Bar · Bus & Bahn · Im Hotel · Einkaufen · Um Hilfe bitten · Familie vorstellen · Bei mir zuhause · Am Bahnsteig |
| **A2 (5)** | Beim Arzt · In der Apotheke · Verspätung am Bahnhof · Smalltalk: Wetter · Tisch reservieren am Telefon |
| **B1 (4)** | Film-Diskussion · Am Flughafen: Gepäck verloren · Beim Vorstellungsgespräch · Über die Nachrichten sprechen |

Level-Konvention: Einordnung nach der „schwärzesten“ Grammatik des Dialogs (Congiuntivo → B1). Je aktivem Level mindestens ein Dialog — das ist eine garantierte Regel.

---

## 11. Orecchie — Hör-Geschichten (Graded Input)

**9 kurze Hör-Episoden (3 je Level, ~6 Zeilen / ~2 Minuten):**
- **A1:** Il primo giorno a Roma 🛬 · Al mercato 🧺 · La domenica di Anna 🌤️
- **A2:** La gita in funivia 🚡 · All'ufficio postale 📮 · Il nuovo lavoro di Luca 🏨
- **B1:** La notizia della sera 📺 · Il bagaglio perso 🧳 · Il colloquio di Martina 💼

Ablauf: Tempo wählen (Lento 0.6 / Normale 0.85 / Veloce 1.05) → **erst nur hören** (ganze Geschichte am Stück oder Zeile für Zeile) → Übersetzung per Tap aufklappen → Selbstcheck „Verstanden — abschließen (+15 XP)“. Episoden-Grammatik folgt dem Level (A1 Presente/Passato prossimo; A2 Imperfetto/Condizionale; B1 Congiuntivo/Gerundio/Passivo). Konvention: mindestens 3 Episoden je aktiven Level, stabile Episoden-IDs (Fortschritt hängt daran).

---

## 12. Passaporto — dein Können als Profil

Der „Reisepass“ zeigt **Können statt Zeit-in-App**:

- **Serie (Streak)**: aktuell + **Rekord für immer**; „ein ruhender Tag pro Woche ist eingeplant“; ❄️-Freezes.
- **Kompetenz-Radar**: vier Balken 🔊 Hören, 📖 Lesen, 🗣️ Sprechen, ✍️ Schreiben — gefüllt nur aus echten Übungen (Hören = Hör-Aufgaben; Lesen = Erkennen/Bauen; Sprechen = Missionen & Memos; Schreiben = Produzieren & Tagebuch).
- **Ausgabe-Zähler**: produzierte Sätze gesamt, diese Woche (Sätze + Tagebuch), Missionen/Woche.
- **Szenarien gemeistert**: Badges (Icons) aller abgeschlossenen Lektionen + Liste der letzten 8.
- **Missions-Stempel**: alle erledigten echten Aufgaben.
- **Sprachmemos**: alle Aufnahmen (abspielbar, benannt nach Mission).
- **Sprachtagebuch** (*Sette giorni, sette frasi*): eigene italienische Sätze mit Datum, anhörbar; „Satz für heute schreiben“ springt auf eine Missions-Seite.
- **☁️ Sincronizzazione**: Sync-Code-Feld, „Verbinden & sichern“, „Vom Server laden“, Status der letzten Sicherung (Abschnitt 15).

---

## 13. Lern-Mechanik im Detail (verbindliche Werte)

- **Leitner-Boxen:** 8 Boxen, Intervalle in Tagen **0, 1, 2, 4, 7, 14, 30, 60**. Richtig = Box +1 (max 8), falsch = Box 1. Fällig = `due ≤ jetzt`.
- **Reifegrad:** Kategorie-Fortschritt zählt Box ≥ 4 als „gereift“; „gut gelernt“ (Startseite) zählt Box ≥ 5; Story-Bereitschaft zählt Box ≥ 3.
- **Tagesziel:** **15 Übungen** pro Tag (Ringanzeige; jede abgeschlossene Übung zählt 1).
- **Streak:** +1 Tag bei Aktivität an Folgetag; **2 Freezes** (ein verpasster Tag verbraucht einen); **1 Pausentag pro Woche** ist erlaubt, ohne die Serie zu brechen; Rekord bleibt dauerhaft.
- **XP:** Wort entdeckt +2 · Hören/Erkennen richtig +10 · Bauen richtig +12 · Produzieren richtig +15 · Szene-Zeile +3 · Lektion erstmals abgeschlossen +25 (dazu Badge) · Mission +25 · Orecchie abgeschlossen +15 · Tagebuchsatz +20 · Sprachmemo +15 · Tages-Konjugation +10.
- **Espresso del giorno:** tagstabil (Datum-Seed; gerade Tage bevorzugen Mini-Lektionen), genau einer pro Tag, ~3 Minuten, nach Erledigung: „morgen gibt es den nächsten“.
- **Congiuga del giorno (Tages-Konjugation):** beim ersten Start des Tages ein Verb × eine Zeit, alle 6 Personen per Tipp-Eingabe in fester Folge (io → tu → lui/lei → noi → voi → loro; Akzente/Großschreibung egal; Gender-Alternativen „stato/a" akzeptiert, Reflexiv-Klitika optional). Falsch = richtige Form zeigen + am Ende der Runde wiederholen, bis einmal richtig. Rotation leicht → schwer: pro Level regelmäßige -are → -ere → -ire (inkl. -isc-Typ, -iare-Kontraktion, h-Einschub bei -care/-gare) → unregelmäßige (essere/avere zuerst); Level A1 → A2 → B1; drei Durchläufe Presente → Passato → Futuro, danach endlos von vorn (399 Einträge; unpersönliche Verben wie piovere ausgenommen). Abbrechbar, aber Banner + erneutes Overlay beim nächsten Start bis zur Erledigung; Fortschritt (Rotationsindex + Erledigungstag) wird gesynchronisiert.
- **Output-Wochenbilanz** (Startseite): Sätze produziert (Training + Tagebuch), Missionen, Memos der laufenden ISO-Woche.

---

## 14. Audio-Konzept

- **Zwei-Stufen-Audio:** Zuerst wird eine hinterlegte Audiodatei (MP3) gesucht; **fehlt sie, fällt die App automatisch auf die Gerätesprachausgabe (TTS) für it-IT zurück** (Geschwindigkeit standardmäßig 0.9; Hör-Geschichten/Dialoge wählbar 0.6/0.85/1.05).
- **Jedes sprechenbare Element hat einen stabilen Audioschlüssel** (Wort, Verbform, Satz, Dialogzeile, Regel-Beispiel, Checklisten-Satz, Missions-Satz, Kapitel-Meilenstein, Tagebuch-Eintrag). Die erwartbaren Dateinamen sind in einer Manifest-Liste erzeugbar — **MP3s bleiben optional**, die App ist ohne eine einzige Audiodatei voll funktionsfähig.
- **iPhone:** Standardstimme it-IT; in den iOS-Einstellungen kann eine hochwertigere italienische Stimme nachgeladen werden.
- **Globaler Ton-Schalter** in der Kopfzeile; Ton-aus respektieren alle Auto-Aufrufe.
- Dialoge werden **sequenziell** gesprochen (nächste Zeile erst nach Ende der vorherigen — egal ob Datei oder TTS).

---

## 15. Fortschritt & Sincronizzazione (Server-Backup)

**Local-first:** Der komplette Fortschritt lebt auf dem Gerät (offline nutzbar). Der Server ist nur ein Backup/Ziel für Gerätewechsel.

- **Sync-Code** statt Konto: min. 6 Zeichen, frei gewählt. **Trust-on-first-use**: Der erste Kontakt legt den Code fest (serverseitig wird nur ein Hash gespeichert); danach wird jeder Zugriff code-geprüft. Code vergessen = nicht wiederherstellbar; Code ändern = Serverdaten per FTP löschen (das ist dokumentiert und gewollt).
- **Was gesichert wird:** das gesamte Fortschritts-Paket — Einstellungen, SRS-Zustand, Streak, XP/Badges, Lektions- und Missionsfortschritt, Checklisten, Output, Kompetenzen, Sprachtagebuch, Espresso-Wahl, Konjugations-Rotation **und die Sprachmemos** (als Base64-Audio; Notbremse: sind die Daten > ~5,5 MB, werden nur die Fortschrittsdaten gesichert; Serverlimit 6 MB).
- **Automatik:** ~8 Sekunden nach jeder Änderung wird gesichert (falls online + Code gesetzt); **beim App-Start** wird ein neuerer Server-Stand automatisch geladen (Zeitstempel-Vergleich; „letzter Schreiber gewinnt“ als Konfliktregel).
- **Schutzmechanismen:** Ein fast leerer Gerätestand überschreibt den Server **nie** automatisch (nur nach ausdrücklicher Bestätigung). Beim Laden wird der eigene Sync-Code niemals ausgelöscht. „Vom Server laden“ fragt nach Bestätigung und lädt die App danach neu.
- **Gerät wechseln:** App installieren → Passaporto → Code eingeben → „Vom Server laden“.
- **Ablage:** eine JSON-Datei pro Code (Dateiname = Hash des Codes), geschützt liegender Ordner ohne Verzeichnisliste; Zugriffe nur über den Endpunkt. Hinweis ehrlich dokumentiert: das Backup liegt als unverschlüsselte JSON auf dem eigenen Server — Sync-Code geheim halten; **sync-data/ niemals löschen** (dort liegen Code-Verankerung und alle Backups).

---

## 16. Inhaltliche Qualitäts-Regeln (Garantien)

Diese Regeln sind Produktverfassung — die Neuimplementierung sollte sie **automatisiert prüfen können** (heute tut das ein Validierungslauf, der vor jedem Deploy grün sein muss):

1. **Vollabdeckung:** Die `covers` aller Stories decken jede Wortschatz-Kategorie des jeweiligen Levels ab; Stories ohne Level-Gleichheit zählen nicht.
2. **Lektionsziel-Erzwingung:** A1 = 100, A2 = 75, B1 = 75 Lektionen (weniger schlägt fehl; mehr über Zahlausgleich erklärbar).
3. **Verbtabellen vollständig:** je Verb 6 Formen × 3 Zeiten.
4. **Eindeutigkeit:** Story-IDs, Dialog-IDs, Episoden-IDs, story-lokale Wörter sind global einmalig.
5. **Level-Pflichten:** je aktivem Level ≥ 1 Dialog und ≥ 1 (Konvention: ≥ 3) Hör-Episoden; Checklisten/Dialoge tragen gültige Level.
6. **Satz-Korrektheit:** italienische und deutsche Sätze/Dialoge sind sprachlich korrekt und niveau-gerecht — nicht verhandelbar.
7. **Fortschritts-Stabilität:** Alle Lernzustände hängen an stabilen Schlüsseln (Wort, Satz-Index im Kontext, Dialogzeile, Checklisten-Index …). Inhalte dürfen wachsen, ohne dass bestehender Fortschritt bricht (Konvention: Reihenfolge indexbasierter Bestände nie umsortieren; neue Wörter in Bestands-Stories nur per Verweis).
8. **Audio-Manifest-Vollständigkeit:** jede neue Inhaltsquelle muss in die erwartbaren Audio-Dateinamen einfließen.

---

## 17. Ausbaustand & Roadmap

**Aktiv:** A1, A2, B1 vollständig (250 Lektionen, siehe 5.1). **Gerüst („geplant“, im Pfad ausgegraut sichtbar):**

- **B2 — Nuancieren & argumentieren** (~10 Storys): Congiuntivo imperfetto/trapassato, Periodo ipotetico 2, Discorso indiretto, Forme implicite, Konnektoren der Schriftsprache, Beschwerde & Reklamation, Diskussion, Arbeitswelt vertieft, Kultur & Film, Ripasso-Lesestory.
- **C1 — Stil & Register** (~8): Hoch- vs. Umgangssprache, Geschäftskorrespondenz, Idiomatik, Presse, Literatur, Präsentieren, Verhandlung, Ripasso.
- **C2 — Perfezionamento** (~6): Bedeutungsnuancen, regionale Varianten, Stilanalyse, Fachsprache Alltag, Free Production (Vortrag, Essay).

Jedes neue Level bringt: eigene Wortschatz-Kategorien (mit Level-Kennzeichen), eigene Verben-Ergänzung, Stories mit `covers`, Dialoge, Checkliste mit eigenem Präfix, Hör-Episoden — und Anpassung der Level-Filter überall (bekannte Stolperfalle des heutigen Produkts: Level-Chips und Level-Listen sind zentral zu pflegen).

---

## 18. Gestaltung & Tonalität

- **Farbwelt:** Italien-Assoziation ohne Kitsch — Tiefes Grün (Verde `#155B45`), Terrakotta (`#B8433F`), Gold/Ocker (`#A9782E`), Creme (`#F6F0E4`), dazu Himmelblau/Rosa/Holz als Illustrationsakzente.
- **Illustrationen:** ~450 flächige, gezeichnete Miniaturen im 100×100-Raster für Wortkarten (Espresso, Gnocchi, Zug, Familie …). Eine Zeichnung gilt artikel-agnostic für alle Wortformen („il treno“ → Zeichnung „treno“); Wörter ohne Zeichnung fallen auf Emoji zurück. Kein Foto-Material, keine externen Assets.
- **Mobile-first, eine Hand:** alles tippt sich daumengerecht; Karten-, Kachel- und Listenmuster; dezente Animationen (Kartenflip, Fortschrittsringe, Toasts).
- **Tonalität:** ermutigend, italienisch durchsetzt (*Molto bene!*, *Ottima pronuncia!*, *boa! 🎉*, *per oggi basta!*), deutsch erklärt; Fehler sind Alltag („Richtig: …“), nie Strafe. Belohnungen sind inhaltlich (Badge, Missions-Freischaltung, Meilenstein-Satz), nicht Casino (bewusst keine Leaderboards, keine Push-Nerven).

---

## 19. Zahlen-Übersicht (Ist-Stand v24)

| Inhalt | Umfang |
|---|---|
| Lektionen | **250** (A1 100 · A2 75 · B1 75; 180 Voll / 70 Mini) |
| Wortschatz | **832 Wörter** in **52 Kategorien** (A1 33/605 · A2 11/134 · B1 8/93) |
| Verben | **135** × 3 Zeiten × 6 Personen (handkuratiert) |
| Satzmuster-Engine | 14 Muster → 210 Sätze + Negationen + Fragen |
| Story-Inhalte | 1.777 Wortkarten · 1.540 Satzpaare |
| Redewendungen | 84 in 6 Themen |
| Dialoge | 18 (A1 9 · A2 5 · B1 4) |
| Checklisten | 60 Sätze (A1 30 · A2 15 · B1 15) |
| Missionen | 12 Reise-Missionen + 1 je Lektion (250) |
| Hör-Geschichten | 9 Episoden (3 je Level) |
| Aussprache-Regeln | 12 mit ~45 Hörbeispielen |
| Dekonstruktionssätze (Ferriss) | 6 |
| Illustrationen | ~450 flächige Zeichnungen (Artikel-agnostic, Emoji-Fallback) |
| Lernsystem | Leitner 8 Boxen (0–60 Tage), Tagesziel 15, Streak mit 2 Freezes + 1 Pausentag/Woche, XP-Ökonomie siehe 13 |
| Sync | Code-basiert (≥ 6 Zeichen), Auto-Push 8 s, Auto-Pull beim Start, Limit 6 MB |

*Ende des Exposés.*
