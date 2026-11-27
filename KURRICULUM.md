# KURRICULUM — Ciao Italia

Der Lernpfad (Percorso) führt Level für Level durch den Wortschatz.
Jede Story ist eine ~6-Minuten-Szene aus 7 Schritten (Entdecken → Hören →
Erkennen → Bauen → Szene → Produzieren → Abschluss). Alle Stories leben in
`stories.js`; der Inhaltstyp ist im Dateikopf dort dokumentiert.

**Harte Garantie:** `tools/validate.js` prüft, dass die `covers`-Angaben
aller Stories zusammen **jede** Wortschatz-Kategorie abdecken. Wird eine
Kategorie vergessen oder eine Story gelöscht, schlägt die Validierung fehl.

---

## A1 — Grundwortschatz (aktiv, 100 Lektionen — verdoppelt)

**Bestand:** 33 Kategorien / 605 Wörter · 100 Verben · 9 Dialoge · **100 Lektionen**
(81 Voll-Stories + 19 Mini-Lektionen). `validate.js` erzwingt das Ziel von
100 Lektionen für A1 (`IT_CURRICULUM.A1.enforceTarget`).

**Lektionsformate:**
- **Voll-Story** (7 Schritte, ~6 Min): Entdecken → Hören → Erkennen → Bauen →
  Szene → Produzieren → Abschluss.
- **Mini-Lektion** (`mini: true`, 4 Schritte, ~3–4 Min): Entdecken → Hören ×4 →
  Bauen ×1 → Produzieren ×2. Drills bestehende A1-Wörter in neuen
  Kombinationen (Listen, Mengen, Zahlen, Tage, Farben × Essen, …).

**Bilder:** Wortkarten nutzen flache SVG-Illustrationen
(`illustrations.js`, abrufbar über `IT_ART.get(word)`; Artikel am Wortanfang
werden ignoriert). Wörter ohne Zeichnung fallen auf Emoji zurück.

Stories 1–14: siehe Tabelle unten. Stories 15–26 (Themenerweiterung):
Al supermercato 🛒, La settimana 📅, Che ora è? 🕐, La famiglia Rossi 🏡,
Il tempo libero 🎾, Il corpo in movimento 🖐️, Che cos'è? ❓,
I numeri grandi 💯, Dove abiti? 🏘️, Un giorno di pioggia 🌧️,
Al bar con amici 🥂, Il mio giorno 📆.
Lektionen 27–50 und 66–81 (ehem. Minis, **zu Voll-Stories ausgebaut**, 12.10.2026):
27–36: Caffè & numeri ☕, Wege & Orte 🧭, Familie & Alter 👨‍👩‍👦,
Am Tisch bestellen 🍽️, Hotel & Zahlen 🏨, Zahlen 11–19 🔢,
Unterwegs & Zeit 🚌, Farben am Teller 🎨, Körpergefühle 🫀,
Stadt & Entfernung 🏛️ · 37–46: Mengen einkaufen 🧺,
Smalltalk-Klassiker 💬, Haus & Dinge 🏠, Wetter & Kleidung 🧥,
Zahlen 60–100 💯, Familie fragen ❓, Restaurant & Rechnung 🧾,
Freizeit & Tage 🎭, Sport draußen 🏃, Hier & dort 📍 ·
47–50 („m-"-Reihe komplett): Tage & Alltag 🗓️, Getränke 🥤,
Einkaufen & Zahlen 🛍️, Haus & Farben 🎨 · 66–71 (Beginn „m2-"-Reihe):
Verbi & Cibo 🍝, Giorni & Ore 🕰️, Colori & Vestiti 👕,
Animali & Numeri 🐴, In casa 🏠, Buongiorno o Ciao? 🤝 ·
72–81 (Rest der „m2-"-Reihe): Prezzi & Numeri 💶, Famiglia a casa 👨‍👩‍👦,
Orientamento 🧭, Hobby & amici ⚽, Klein weh 🩹, Essenszeiten 🍱,
Unterwegs 🚆, Frutta & Verdura 🍅, Nein sagen 🚫, Erste, zweite… 🥇 —
je 8 Wörter / 7 Sätze, neue Wortkarten nur via Bestand (`key:`-Verweise,
Ausnahme: bewusst story-lokale Karten wie bere, mangiare, come va?,
leggere, comprare, quinto, ultimo), Satz-Indizes 0–3 unverändert
(SRS/Audio-Keys stabil, Fortschritt bleibt).
Lektionen 51–65: 15 weitere Voll-Stories (Pronto? Al telefono ☎️,
In cucina con la nonna 👩‍🍳, Il nostro cane Bello 🐕, Tanti colori 🌈,
In pizzeria 🍕, A festa! 🎉, Sto bene! 💪, Che tempo fa? ⛅,
Tutto in ordine 🧹, In tram a Milano 🚋, Lei o tu? 🙋, Da uno a dieci 🔟,
Io posso, tu vuoi 🔑, Non… mai! 🚫, Arrivederci e grazie 👋).
Minis 82–100: 19 Kombinations-Drills (Rest der „m2-”-Reihe).

| # | Story | Deckt Kategorien ab (covers) | Kern-Sätze üben |
|---|-------|------------------------------|-----------------|
| 1 | ☕ Un caffè al bar | saluti, ristorante, acquisti, numeri | Bestellen, Preise, Höflichkeit |
| 2 | 🍝 Al ristorante | ristorante, aggettivi, numeri | Tisch, Bestellung, Rechnung, „Sono … euro“ |
| 3 | 🚆 L'arrivo | viaggio, orientamento, interrogativi | Weg fragen, Fahrkarte, „dov'è?“ |
| 4 | 🏨 In albergo | viaggio_a1, tempo, persone, numeri | Check-in, Pass, Uhrzeiten, Etage |
| 5 | 🛍️ Lo shopping | acquisti, abbigliamento, **colori** | Preis, Größe, Farben, „Mi piace“ |
| 6 | 🆘 Aiuto! | emergenza, corpo | Hilfe holen, Körperbefinden, „Ho mal di testa“ |
| 7 | 🌳 Natura e animali | natura, **animali**, colori | Wetter, Landschaft, Tiere |
| 8 | ⏰ La mia giornata | calendario, **uhrzeit**, avverbi_a1 | Tagesablauf mit reflexiven Verben, Uhrzeit |
| 9 | 👨‍👩‍👧 Famiglia e amici | famiglia, **paesi** | Familie vorstellen, Herkunft, Nationalität |
| 10 | 🏠 A casa mia | casa, articoli_pronomi | Wohnen, Gegenstände, Artikel im Satz |
| 11 | 🏛️ Il weekend in città | citta, tempo_libero, numeri_estesi | Verabredungen, Freizeit, Zahlen 11–99 |
| 12 | 💼 Che lavoro fai? | lavoro, scuola | Beruf, Termine, Arbeitszeiten |
| 13 | 🤝 Un nuovo amico | conversazione, aggettivi_a1, persone | Kennenlernen, Eigenschaften, tu-Form |
| 14 | 🎯 Piani e desideri | parole_funzione, cibo_a1 | „Vorrei“, Konnektoren (ma, quindi, perché) |

Fett = Kategorien, die für den Pfad **neu** hinzugekommen sind
(`colori`, `animali`, `paesi`, `uhrzeit` in `vocabulary-a1.js`).
Neue Verben in `verbs-a1.js`: conoscere, ricordare, dimenticare, pensare,
credere, servire + reflexiv: alzarsi, lavarsi, addormentarsi, sentirsi.
Neue Dialoge in `sentences.js`: „famiglia“ (Familie vorstellen) und
„casa“ (Bei mir zuhause).

### Grammatik-Verteilung A1
- **Präsens** in allen Stories; **formelle Anrede (Lei)** in 1–6,
  **du-Form (tu)** ab Story 9 (dialogue famiglia) und 13.
- **Passato prossimo** als Ausblick in Sätzen wie „Mi sono perso“ (Dialog aiuto).
- **Futuro**-Formen stehen in der Verben-Referenz; Sätze nutzen
  „domani + Präsens“ (natürlicher A1-Stil).
- Reflexive Verben konzentriert in Story 8 (giornata).

---

## A2 — Alltag ausbauen (aktiv, 75 Lektionen)

Bestand gesamt: 52 Kategorien / 773 Wörter · 125 Verben · 10 Dialoge · 36 Stories.

A2 wurde auf 75 Lektionen ausgebaut; Stand 27.11.2026: **70 Voll-Stories +
5 Mini-Lektionen** — 30 Minis sind inzwischen zu Voll-Lektionen ausgebaut
(die „m2a-"-Reihe und fast die gesamte „m2b-"-Reihe: Pronomen direkt/
indirekt, piacere, ne, ci, da + Zeit, Vergleiche, meglio/migliore,
Wetter-Imperfetto, Telefon, Einschreiben, Gefühle gestern, Beim Arzt sagen,
Gedeck & Co., Wohnungsdaten, Streik-Meldung, Eine Nacht, Anprobe,
Berufs-Smalltalk, Schreib mir), je 8 Wörter / 7 Sätze, Satz-Indizes 0–3
stabil. Übrig bleiben 5 A2-Minis: Opas Geschichten, Wetter morgen,
Ich käme gern…, Doppel-Pronomen, Umsteigen.
Themen: Imperfetto/Passato-Kontrast, Condizionale, Imperativo tu/Lei/voi,
direkte & indirekte Pronomen, piacere, ne/ci, Vergleiche, da + Zeitraum,
Passivo-light (è stato cancellato, va assaggiata, sono stati avvisati).

A2-Kategorien (in `vocabulary-a2.js`, je `level: "A2"`): Emotionen & Charakter,
Gesundheit & Arzt, Wetter vertieft, Unterwegs: Details, Post & Bank,
Ausgehen & Menü, Wohnen & Nachbarschaft, Bewerbung & Arbeitswelt,
Telefon & Nachrichten, Erzählen & Erinnerung, Kleidung im Detail.
A2-Verben (in `verbs-a2.js`, 19 neue): provare, inviare, raccontare,
spiegare, consigliare, succedere, scegliere, salire, scendere, lasciare,
mancare, raggiungere, regalare, indossare, guidare, guarire, noleggiare,
accomodarsi (refl.), fermarsi (refl.). Neuer Dialog: „Beim Arzt“.

| # | Story | Deckt ab (A2-Kategorien) | Grammatik-Fokus |
|---|-------|--------------------------|-----------------|
| 15 | 🧸 Quando ero piccolo | racconto | **Imperfetto** (Gewohnheiten) |
| 16 | 🚄 Problemi in treno | trasporti2 | Imperfetto × Passato prossimo |
| 17 | 🫒 Alla trattoria | uscire | Condizionale (vorrei, potrei) |
| 18 | 🌡️ Dal medico | salute2 | Imperativo formale (Lei), Futuro |
| 19 | 🌈 Che tempo farà? | tempo2 | Futuro semplice (Vorhersagen) |
| 20 | 📮 Alla posta | servizi | Imperativo formale (compili, firmi) |
| 21 | 🔑 L'appartamento | abitare | cercare + Adjektive |
| 22 | 📑 Il colloquio | lavoro2 | da + Zeitraum, Fachwortschatz |
| 23 | 💬 Un messaggio ad Anna | comunicare | Objektpronomen + Passato |
| 24 | 🧣 Cosa metto in valigia? | abiti2 | Vergleiche (più/meno … di), quello |
| 25 | 😠 Come ti senti? | emozioni | sentirsi + Grund für Gefühle |
| 26 | 🏞️ Il fine settimana in Toscana | racconto, trasporti2 | Ripasso: Imperfetto + Passato |

## B1 — Sicher im Gespräch (aktiv, 10 Lektionen — Ziel 50, Ausbau offen)

B1-Kategorien (in `vocabulary-b1.js`, je `level: "B1"`): Meinung & Diskussion,
Medien & Nachrichten, Umwelt & Klima, Flug & Fernreisen, Karriere &
Projekte, Stadtleben, Küche & Rezepte, Denken & Gefühlswelt.
B1 wurde auf 75 Lektionen ausgebaut (10 + 12 Voll-Stories + 33 Minis):
Congiuntivo presente/passato (auch nach jemand/emotion verbs), Gerundio & stare per,
Passivo (presente/passato/futuro, si-Formen, ci si arrive), Periodo ipotetico 1,
Relativsätze (che/cui/il quale/dove/in cui), Discorso indiretto, Pronomen-Pakete
(gliel ho detto, me l ha dato), Connectors (tuttavia, nonostante, invece di).

B1-Verben (in `verbs-b1.js`, 16 neue): sperare, dubitare, evitare,
suggerire, permettere, vietare, ridurre, aumentare, proteggere, inquinare,
riciclare, pubblicare, sembrare, sostenere, organizzare, partecipare.
Neuer Dialog: „Film-Diskussion“ (mit Congiuntivo).

| # | Story | Deckt ab (B1-Kategorien) | Grammatik-Fokus |
|---|-------|--------------------------|-----------------|
| 27 | 💭 Penso che… | opinioni | **Congiuntivo presente** (sia, abbia, piova) |
| 28 | 📰 Le notizie di oggi | media | Congiuntivo nach penso/credo |
| 29 | 🌍 Ambiente e clima | ambiente | dovere + inf., Typ-0-Bedingung |
| 30 | ✈️ In aereo | viaggi2 | **Periodo ipotetico Typ 1** |
| 31 | 📊 Il grande progetto | lavoro3 | credo che + Congiuntivo, di + inf. |
| 32 | 🚦 Traffico in città | citta3 | Imperativ tu, Vergleiche (del centro) |
| 33 | 🍳 In cucina | cucina2 | Imperativ tu (Rezepte), Mengen |
| 34 | 💡 Sogni e dubbi | mente | spero/dubito che + Congiuntivo |
| 35 | 🎬 Mi piacciono i film italiani | opinioni, mente | Pronomen-Kombis (me lo, gliele), nonostante |
| 36 | 🗺️ Il viaggio dei sogni | viaggi2, mente | Ripasso: Typ 1 + Congiuntivo + Futuro |

## B2 — Nuancieren & argumentieren *(Gerüst)*

**Ziel:** Diskutieren, formulieren, telefoniaffin. Geplant: ~10 Stories.
1. Congiuntivo imperfetto & trapassato
2. Periodo ipotetico Typ 2
3. Discorso indiretto
4. Forme implicite (infinito, gerundio, particpio)
5. Konnektoren der Schriftsprache (tuttavia, pertanto, nonostante)
6. Beschwerde & Reklamation
7. Diskussion & Meinungsbildung
8. Arbeitswelt vertieft
9. Kultur & Film
10. Ripasso-Lesestory (längere Erzählung)

## C1 — Stil & Register *(Gerüst)*

**Ziel:** Registerwechsel sicher beherrschen. Geplant: ~8 Stories.
1. Hochsprache vs. Umgangssprache (Paare gleicher Szenen)
2. Geschäftskorrespondenz
3. Idiomatik & feste Wendungen
4. Presse: Artikel verstehen
5. Literatur: Kurztexte
6. Präsentieren & Vortragen
7. Verhandlung & Überzeugungsarbeit
8. Ripasso-Story

## C2 — Perfezionamento *(Gerüst)*

**Ziel:** Fast muttersprachliche Präzision. Geplant: ~6 Stories.
1. Feine Bedeutungsnuancen (Synonym-Paare im Kontext)
2. Regionale Varianten (Nord/Süd, Standards vs. Dialektfärbung)
3. Stilistische Analyse (Register,ironie, Euphemismus)
4. Fachsprache Alltag (Verträge, Smallprint)
5. Free production: Vortrag
6. Free production: Essay & Diskussion

---

## Workflow: neue Story anlegen

1. In `stories.js` einen Eintrag ergänzen (Schema oben in der Datei).
2. `level` setzen; für ein neues Level vorher in `IT_CURRICULUM` die
   `status: "geplant"`-Zeile auf `"aktiv"` setzen.
3. `covers` pflegen (Kategorie-IDs) — validate erzwingt Vollabdeckung.
4. `node tools/generate-audio-manifest.js` ausführen.
5. `node tools/validate.js` muss grün sein.
6. Optional: lokaler Test mit `node tools/serve.js 8080`.
7. Deployment: Ordner hochladen; dabei `CACHE` in `sw.js` hochzählen.
