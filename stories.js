/* ============================================================
   stories.js — Der Lernpfad ("Percorso")
   ------------------------------------------------------------
   Jede Story ist eine kleine Szene aus dem italienischen Alltag.
   Der Story-Player (app.js) baut daraus automatisch den
   7-Schritte-Ablauf (Voll-Story) bzw. den 4-Schritte-Mini-
   Ablauf (mini: true):
     1 Entdecken  (SVG/Emoji-Karte + Audio, Deutsch per Tap)
     2 Hören      (Audio → richtige Bedeutung)
     3 Erkennen   (IT → DE Multiple Choice)
     4 Bauen      (Satzbau-Kacheln)
     5 Szene      (Dialog mit Rollenwechsel, optional)
     6 Produzieren(DE → IT aktiv zusammenbauen)
     7 Abschluss  (XP + Badge, Wörter in die SRS)

   Schema einer Story:
     id, level ("A1"…"C2"), title, icon, scene
     words       5–8 Wörter: { it, de, emoji, key? }
     sentences   4–7 Sätze: { it, de }
     build /     Indizes in sentences (Satzbau / DE→IT)
     produce
     dialogueId, missionId, covers (Kategorie-IDs)
     mini        true = kurze Lektion (4 Schritte)
   Neue Story = hier einen Eintrag ergänzen. Siehe KURRICULUM.md.
   ============================================================ */

/* Level-Gerüst: A1/A2/B1 sind befüllt, B2–C2 vorgesehen. */
window.IT_CURRICULUM = {
  A1: { label: "Grundwortschatz", status: "aktiv", target: 100, enforceTarget: true,
        goal: "Alltag und Reise meistern: Grundwörter in vielen Kombinationen, erste Sätze in drei Zeiten." },
  A2: { label: "Alltag ausbauen", status: "aktiv", target: 75, enforceTarget: true,
        goal: "Vergangenheit erzählen und Wünsche ausdrücken.",
        topics: ["Imperfetto", "Condizionale (vorrei, potrei …)", "Imperativo",
                 "Direkte Objektpronomen (lo, la, li, le)", "Vergleiche (più … di …)",
                 "Wetter, Gesundheit, Ausgehen", "Auf der Post / beim Arzt"] },
  B1: { label: "Sicher im Gespräch", status: "aktiv", target: 75, enforceTarget: true,
        goal: "Meinungen, Erfahrungen und Hypothesen ausdrücken.",
        topics: ["Congiuntivo presente & passato", "Gerundio & stare per …",
                 "Passivo", "Periodo ipotetico (Typ 1)", "Relativsätze",
                 "Arbeit & Bewerbung", "Nachrichten & Medien"] },
  B2: { label: "Nuancieren & argumentieren", status: "geplant",
        goal: "Flüssig diskutieren, telefonieren, formulieren.",
        topics: ["Congiuntivo imperfetto & trapassato", "Periodo ipotetico (Typ 2)",
                 "Discorso indiretto", "Forme implicite (infinito, gerundio)",
                 "Textsorten: E-Mail, Beschwerde, Kurzbericht"] },
  C1: { label: "Stil & Register", status: "geplant",
        goal: "Unterschiedliche Register sicher bedienen.",
        topics: ["Hoch- und Umgangssprache", "Konnektoren der geschriebenen Sprache",
                 "Idiomatik", "Authentische Lektüre (Presse, Literatur)"] },
  C2: { label: "Perfezionamento", status: "geplant",
        goal: "Fast muttersprachliche Präzision und Nuance.",
        topics: ["Feine Bedeutungsnuancen", "Regionale Varianten",
                 "Stilistische Analyse", "Free production (Vortrag, Essay)"] }
};

/* Kapitel-Dramaturgie des A1-Pfads (from/to = Story-Indizes, to exklusiv).
   Ist ein Kapitel komplett, wird der Meilenstein-Satz (say) freigeschaltet. */
window.IT_CHAPTERS = [
  { name: "L'arrivo", icon: "🧳", from: 0, to: 4,
    say: "Un caffè e un cornetto, per favore.", de: "Einen Espresso und ein Hörnchen, bitte." },
  { name: "La città", icon: "🏛️", from: 4, to: 8,
    say: "Scusi, dov'è la farmacia?", de: "Entschuldigung, wo ist die Apotheke?" },
  { name: "Le persone", icon: "👨‍👩‍👧", from: 8, to: 14,
    say: "Piacere, sono Anna. Di dove sei?", de: "Freut mich, ich bin Anna. Woher kommst du?" },
  { name: "La pratica", icon: "🛠️", from: 14, to: 26,
    say: "Che ora è? — Sono le nove in punto.", de: "Wie viel Uhr ist es? — Es ist genau neun Uhr." },
  { name: "Le combinazioni", icon: "🧩", from: 26, to: 50,
    say: "Due caffè e un cornetto — quanto fanno?", de: "Zwei Espressi und ein Hörnchen — wie viel macht das?" },
  { name: "Espansione", icon: "🚀", from: 50, to: 100,
    say: "Adesso parlo italiano, piano piano!", de: "Jetzt spreche ich Italienisch, Schritt für Schritt!" }
];

/* Orecchie: kurze Hör-Geschichten (graded input, TTS in drei Tempi).
   Satz für Satz hören, Übersetzung per Tap — Selbstcheck speist SRS. */
window.IT_LISTENING = [
  {
    id: "primo-giorno", level: "A1", title: "Il primo giorno a Roma", icon: "🛬",
    lines: [
      { it: "Marco arriva a Roma la mattina.", de: "Marco kommt morgens in Rom an." },
      { it: "Prende un caffè in un piccolo bar.", de: "Er trinkt einen Espresso in einer kleinen Bar." },
      { it: "Il caffè costa un euro e venti.", de: "Der Espresso kostet eins zwanzig." },
      { it: "Dopo cammina fino al Colosseo.", de: "Danach läuft er bis zum Kolosseum." },
      { it: "La città è bellissima e molto antica.", de: "Die Stadt ist wunderschön und sehr alt." },
      { it: "„Che bello“, pensa Marco, „torno domani!“", de: "„Wie schön“, denkt Marco, „ich komme morgen wieder!“" }
    ]
  },
  {
    id: "al-mercato", level: "A1", title: "Al mercato", icon: "🧺",
    lines: [
      { it: "La signora Rossi va al mercato il sabato.", de: "Frau Rossi geht samstags auf den Markt." },
      { it: "Compra pomodori, pane e formaggio.", de: "Sie kauft Tomaten, Brot und Käse." },
      { it: "Tutto è fresco e non è caro.", de: "Alles ist frisch und nicht teuer." },
      { it: "Il mercante le dà anche della frutta.", de: "Der Händler gibt ihr auch Obst." },
      { it: "A casa prepara un pranzo semplice.", de: "Zu Hause bereitet sie ein einfaches Mittagessen zu." },
      { it: "Mangia insieme a suo marito.", de: "Sie isst mit ihrem Mann." }
    ]
  },
  {
    id: "la-domenica", level: "A1", title: "La domenica di Anna", icon: "🌤️",
    lines: [
      { it: "Anna si sveglia tardi la domenica.", de: "Anna wacht sonntags spät auf." },
      { it: "Prima beve un caffè con la sua famiglia.", de: "Zuerst trinkt sie Kaffee mit ihrer Familie." },
      { it: "Poi vanno tutti al parco.", de: "Dann gehen alle in den Park." },
      { it: "Nel parco ci sono molti cani e bambini.", de: "Im Park gibt es viele Hunde und Kinder." },
      { it: "La sera guardano un film insieme.", de: "Am Abend schauen sie zusammen einen Film." },
      { it: "Per Anna la domenica è il giorno più bello.", de: "Für Anna ist der Sonntag der schönste Tag." }
    ]
  },

  /* A2: Erzählen mit Imperfetto und Condizionale, Objektpronomen,
     Themen aus dem A2-Wortschatz (Wetter, Post, Arbeit). */
  {
    id: "gita-funivia", level: "A2", title: "La gita in funivia", icon: "🚡",
    lines: [
      { it: "Sabato scorso Giulia voleva dormire fino a tardi.", de: "Letzten Samstag wollte Giulia bis spät schlafen." },
      { it: "Mentre beveva il caffè, leggeva i messaggi degli amici.", de: "Während sie ihren Kaffee trank, las sie die Nachrichten ihrer Freunde." },
      { it: "Le amiche le hanno proposto una gita in funivia.", de: "Die Freundinnen haben ihr einen Ausflug mit der Seilbahn vorgeschlagen." },
      { it: "„Potrei venire anch'io“, ha detto suo fratello minore.", de: "„Ich könnte doch auch mitkommen“, hat ihr kleiner Bruder gesagt." },
      { it: "Sulla montagna c'era un po' di nebbia, ma il panorama era stupendo.", de: "Auf dem Berg stand etwas Nebel, aber die Aussicht war großartig." },
      { it: "È stata una gita semplice, ma Giulia era contentissima.", de: "Es war ein unkomplizierter Ausflug, aber Giulia war überglücklich." }
    ]
  },
  {
    id: "posta", level: "A2", title: "All'ufficio postale", icon: "📮",
    lines: [
      { it: "Il signor Bianchi doveva spedire un pacco a sua figlia.", de: "Herr Bianchi musste ein Paket zu seiner Tochter schicken." },
      { it: "All'ufficio postale c'era una fila lunghissima.", de: "Auf der Post stand eine sehr lange Schlange." },
      { it: "Mentre aspettava, compilava il modulo con calma.", de: "Während er wartete, füllte er in Ruhe das Formular aus." },
      { it: "Alla fine ha comprato anche dei francobolli nuovi.", de: "Zum Schluss hat er auch ein paar neue Briefmarken gekauft." },
      { it: "L'impiegata gli ha sorriso: „Buona giornata!“", de: "Die Angestellte hat ihm zugelächelt: „Einen schönen Tag!“" },
      { it: "Uscendo, pensava: „Quanta pazienza ci vuole!“", de: "Beim Hinausgehen dachte er: „Wie viel Geduld man nötig hat!“" }
    ]
  },
  {
    id: "lavoro-luca", level: "A2", title: "Il nuovo lavoro di Luca", icon: "🏨",
    lines: [
      { it: "Luca ha trovato un nuovo lavoro in un albergo.", de: "Luca hat eine neue Stelle in einem Hotel gefunden." },
      { it: "Il colloquio era difficile, ma lui era ben preparato.", de: "Das Vorstellungsgespräch war schwer, aber er war gut vorbereitet." },
      { it: "Adesso fa il turno del mattino, dalle sei alle due.", de: "Jetzt macht er die Frühschicht, von sechs bis zwei." },
      { it: "Lo stipendio non è alto, però i colleghi sono simpatici.", de: "Das Gehalt ist nicht hoch, aber die Kollegen sind nett." },
      { it: "A Luca piacerebbe diventare direttore un giorno.", de: "Luca würde eines Tages gern Direktor werden." },
      { it: "„Se continuo così, ce la faccio di sicuro“, pensa.", de: "„Wenn ich so weitermache, schaffe ich es ganz sicher“, denkt er." }
    ]
  },

  /* B1: Congiuntivo, Gerundio, Passivo und Hypothesen — Themen aus
     dem B1-Wortschatz (Medien, Reisen im Detail, Arbeitswelt). */
  {
    id: "notizia-sera", level: "B1", title: "La notizia della sera", icon: "📺",
    lines: [
      { it: "Ieri sera la famiglia Rossi ha guardato il telegiornale.", de: "Gestern Abend hat die Familie Rossi die Nachrichtensendung gesehen." },
      { it: "Il giornalista ha annunciato che il centro storico sarà chiuso al traffico.", de: "Der Journalist hat angekündigt, dass die Altstadt für den Verkehr gesperrt werden soll." },
      { it: "Secondo il ministro, la misura serve a ridurre l'inquinamento.", de: "Nach Angaben des Ministers dient die Maßnahme dazu, die Umweltverschmutzung zu verringern." },
      { it: "„Penso che sia una buona idea“, ha detto la mamma.", de: "„Ich finde, das ist eine gute Idee“, hat die Mutter gesagt." },
      { it: "Il papà invece teme che i negozi perdano clienti.", de: "Der Vater hingegen befürchtet, dass die Geschäfte Kunden verlieren." },
      { it: "A cena ne hanno discusso a lungo, senza arrivare a un accordo.", de: "Beim Abendessen haben sie lange darüber diskutiert, ohne zu einer Einigung zu kommen." }
    ]
  },
  {
    id: "bagaglio-perso", level: "B1", title: "Il bagaglio perso", icon: "🧳",
    lines: [
      { it: "Dopo lo scalo a Milano, il bagaglio di Sara non è arrivato.", de: "Nach dem Zwischenstopp in Mailand kam Saras Gepäck nicht an." },
      { it: "All'ufficio oggetti smarriti c'era una coda infinita.", de: "Am Schalter für Fundsachen gab es eine endlose Schlange." },
      { it: "L'impiegato le ha chiesto di mostrare l'etichetta della valigia.", de: "Der Angestellte bat sie, den Gepäckanhänger des Koffers zu zeigen." },
      { it: "Compilando il modulo, Sara raccontava com'era andata.", de: "Während sie das Formular ausfüllte, erzählte Sara, wie es passiert war." },
      { it: "Le hanno promesso che la valigia sarà consegnata in albergo.", de: "Man hat ihr versprochen, dass der Koffer ins Hotel geliefert wird." },
      { it: "„Se non arriva domani, presenterò un reclamo“, ha deciso.", de: "„Wenn er morgen nicht ankommt, reiche ich eine Beschwerde ein“, hat sie beschlossen." }
    ]
  },
  {
    id: "colloquio-martina", level: "B1", title: "Il colloquio di Martina", icon: "💼",
    lines: [
      { it: "Martina ha sostenuto un colloquio per una posizione a Roma.", de: "Martina hat ein Bewerbungsgespräch für eine Stelle in Rom geführt." },
      { it: "Avendo studiato a Bologna, parla un ottimo italiano.", de: "Da sie in Bologna studiert hat, spricht sie ein hervorragendes Italienisch." },
      { it: "L'azienda cerca una persona che abbia competenze digitali.", de: "Der Betrieb sucht eine Person, die digitale Kompetenzen mitbringt." },
      { it: "Le hanno chiesto quando potrebbe cominciare.", de: "Man hat sie gefragt, wann sie anfangen könnte." },
      { it: "„Comincerei anche domani“, ha risposto ridendo.", de: "„Ich würde sogar morgen anfangen“, antwortete sie lachend." },
      { it: "Uscendo dall'ufficio, si sentiva già un po' più sicura.", de: "Als sie aus dem Büro kam, fühlte sie sich schon etwas sicherer." }
    ]
  }
];

window.IT_STORIES = [
  /* ================= A1 (50 Lektionen: 26 Voll-Stories +
     24 Mini-Lektionen; zusammen decken sie alle A1-Kategorien ab) ================= */

  {
    id: "bar",
    level: "A1",
    title: "Un caffè al bar",
    icon: "☕",
    scene: "Du kommst morgens in eine italienische Bar. An der Theke gibt es den Espresso stehend — schnell, heiß und für wenige Euro.",
    words: [
      { it: "un caffè", de: "ein Espresso", emoji: "☕" },
      { it: "un cornetto", de: "ein Hörnchen / Croissant", emoji: "🥐", key: "word_ristorante_cornetto" },
      { it: "l'acqua", de: "das Wasser", emoji: "💧", key: "word_ristorante_acqua" },
      { it: "il conto", de: "die Rechnung", emoji: "🧾" },
      { it: "euro", de: "Euro (Geld)", emoji: "💶" },
      { it: "ecco", de: "hier ist / da ist", emoji: "👉" },
      { it: "ancora", de: "noch / noch einmal", emoji: "🔁" },
      { it: "insieme", de: "zusammen", emoji: "🤝" }
    ],
    sentences: [
      { it: "Buongiorno! Un caffè, per favore.", de: "Guten Morgen! Einen Espresso, bitte." },
      { it: "Desidera altro?", de: "Möchten Sie noch etwas?" },
      { it: "Vorrei un cornetto, per favore.", de: "Ich hätte gern ein Hörnchen, bitte." },
      { it: "Quanto costa?", de: "Wie viel kostet das?" },
      { it: "Sono due euro.", de: "Das macht zwei Euro." },
      { it: "Il conto, per favore.", de: "Die Rechnung, bitte." },
      { it: "Ecco a Lei. Grazie mille!", de: "Hier, bitte. Vielen Dank!" }
    ],
    build: [0, 4, 5],
    produce: [2, 3, 5],
    dialogueId: "bar",
    missionId: "caffe",
    covers: ["saluti", "ristorante", "acquisti", "numeri"]
  },
  {
    id: "ristorante",
    level: "A1",
    title: "Al ristorante",
    icon: "🍝",
    scene: "Am Abend gehst du mit Freunden essen. In Italien bestellt man vor, isst in Ruhe und ruft die Rechnung mit einem freundlichen „Il conto, per favore“.",
    words: [
      { it: "il menù", de: "die Speisekarte", emoji: "📋" },
      { it: "il pesce", de: "der Fisch (Essen)", emoji: "🐟", key: "word_ristorante_pesce" },
      { it: "il vino", de: "der Wein", emoji: "🍷", key: "word_ristorante_vino" },
      { it: "il pane", de: "das Brot", emoji: "🍞", key: "word_ristorante_pane" },
      { it: "il formaggio", de: "der Käse", emoji: "🧀", key: "word_ristorante_formaggio" },
      { it: "il gelato", de: "das Eis", emoji: "🍨", key: "word_ristorante_gelato" },
      { it: "la cena", de: "das Abendessen", emoji: "🍽️", key: "word_ristorante_cena" },
      { it: "buono", de: "gut / lecker", emoji: "😋" }
    ],
    sentences: [
      { it: "Buonasera! Avete un tavolo per due?", de: "Guten Abend! Haben Sie einen Tisch für zwei?" },
      { it: "Vorrei il pesce, per favore.", de: "Ich hätte gern Fisch, bitte." },
      { it: "Il pesce è molto buono.", de: "Der Fisch ist sehr lecker." },
      { it: "Ancora un po' di vino, per favore.", de: "Noch etwas Wein, bitte." },
      { it: "Prendiamo anche un dolce.", de: "Wir nehmen auch einen Nachtisch." },
      { it: "Il conto, per favore.", de: "Die Rechnung, bitte." },
      { it: "Sono trentadue euro.", de: "Es sind zweiunddreißig Euro." }
    ],
    build: [0, 1, 3],
    produce: [2, 5, 6],
    dialogueId: "ristorante",
    missionId: "conto",
    covers: ["ristorante", "aggettivi", "numeri"]
  },
  {
    id: "arrivo",
    level: "A1",
    title: "L'arrivo",
    icon: "🚆",
    scene: "Angekommen in Italien: erste Fahrkarte, erste Wegbeschreibung. Mit „Scusi, dov'è …?“ kommst du überall hin.",
    words: [
      { it: "il treno", de: "der Zug", emoji: "🚂", key: "word_viaggio_treno" },
      { it: "il biglietto", de: "die Fahrkarte", emoji: "🎫", key: "word_viaggio_biglietto" },
      { it: "la stazione", de: "der Bahnhof", emoji: "🚉", key: "word_viaggio_stazione" },
      { it: "la fermata", de: "die Haltestelle", emoji: "🚏", key: "word_viaggio_fermata" },
      { it: "a destra", de: "rechts", emoji: "➡️", key: "word_orientamento_a_destra" },
      { it: "a sinistra", de: "links", emoji: "⬅️", key: "word_orientamento_a_sinistra" },
      { it: "dritto", de: "geradeaus", emoji: "⬆️", key: "word_orientamento_dritto" },
      { it: "vicino", de: "nah / in der Nähe", emoji: "📍", key: "word_orientamento_vicino" }
    ],
    sentences: [
      { it: "Scusi, dov'è la stazione?", de: "Entschuldigung, wo ist der Bahnhof?" },
      { it: "È lì, sulla destra.", de: "Er ist dort, auf der rechten Seite." },
      { it: "Un biglietto per Firenze, per favore.", de: "Eine Fahrkarte nach Florenz, bitte." },
      { it: "Solo andata. Quanto costa?", de: "Nur hin. Wie viel kostet das?" },
      { it: "Il treno parte alle nove.", de: "Der Zug fährt um neun Uhr ab." },
      { it: "Sempre dritto, poi a sinistra.", de: "Immer geradeaus, dann nach links." },
      { it: "La fermata è vicina.", de: "Die Haltestelle ist in der Nähe." }
    ],
    build: [0, 2, 5],
    produce: [2, 3, 4],
    dialogueId: "trasporti",
    missionId: "biglietto",
    covers: ["viaggio", "orientamento", "interrogativi"]
  },
  {
    id: "albergo",
    level: "A1",
    title: "In albergo",
    icon: "🏨",
    scene: "Check-in im Hotel: Reservierung nennen, Reisepass zeigen, Zimmerschlüssel nehmen — und nach dem Frühstück fragen.",
    words: [
      { it: "l'albergo", de: "das Hotel", emoji: "🏨", key: "word_orientamento_albergo" },
      { it: "la chiave", de: "der Schlüssel", emoji: "🔑", key: "word_viaggio_chiave" },
      { it: "il passaporto", de: "der Reisepass", emoji: "🛂", key: "word_viaggio_a1_passaporto" },
      { it: "la valigia", de: "der Koffer", emoji: "🧳", key: "word_viaggio_valigia" },
      { it: "la camera", de: "das (Hotel-)Zimmer", emoji: "🛏️", key: "word_casa_camera" },
      { it: "la prenotazione", de: "die Reservierung", emoji: "📝" },
      { it: "domani", de: "morgen", emoji: "📆", key: "word_tempo_domani" },
      { it: "la colazione", de: "das Frühstück", emoji: "🥐", key: "word_ristorante_colazione" }
    ],
    sentences: [
      { it: "Buonasera, ho una prenotazione.", de: "Guten Abend, ich habe eine Reservierung." },
      { it: "A nome Rossi, per tre notti.", de: "Auf den Namen Rossi, für drei Nächte." },
      { it: "Ecco il passaporto.", de: "Hier ist der Reisepass." },
      { it: "Ecco la chiave. Camera sette, al secondo piano.", de: "Hier ist der Schlüssel. Zimmer sieben, im zweiten Stock." },
      { it: "La colazione è dalle sette alle dieci.", de: "Das Frühstück ist von sieben bis zehn Uhr." },
      { it: "Dov'è l'ascensore?", de: "Wo ist der Aufzug?" },
      { it: "Domani vogliamo visitare la città.", de: "Morgen wollen wir die Stadt besichtigen." }
    ],
    build: [0, 3, 4],
    produce: [2, 5, 6],
    dialogueId: "albergo",
    covers: ["viaggio_a1", "tempo", "persone", "numeri"]
  },
  {
    id: "shopping",
    level: "A1",
    title: "Lo shopping",
    icon: "🛍️",
    scene: "In der Boutique fragst du nach Größe, Farbe und Preis — und entscheidest mit „È troppo caro“ oder „Mi piace“.",
    words: [
      { it: "la maglietta", de: "das T-Shirt", emoji: "👕", key: "word_abbigliamento_maglietta" },
      { it: "i pantaloni", de: "die Hose", emoji: "👖", key: "word_abbigliamento_pantaloni" },
      { it: "le scarpe", de: "die Schuhe", emoji: "👟", key: "word_abbigliamento_scarpa" },
      { it: "il cappotto", de: "der Mantel", emoji: "🧥", key: "word_abbigliamento_cappotto" },
      { it: "rosso", de: "rot", emoji: "🔴" },
      { it: "blu", de: "blau", emoji: "🔵" },
      { it: "la taglia", de: "die Größe (Kleidung)", emoji: "📏", key: "word_abbigliamento_taglia" },
      { it: "caro", de: "teuer", emoji: "💸", key: "word_acquisti_caro" }
    ],
    sentences: [
      { it: "Quanto costa questa maglietta?", de: "Wie viel kostet dieses T-Shirt?" },
      { it: "Costa venticinque euro.", de: "Es kostet fünfundzwanzig Euro." },
      { it: "È troppo caro per me.", de: "Das ist zu teuer für mich." },
      { it: "Avete la taglia media?", de: "Haben Sie Größe M?" },
      { it: "Mi piace il blu.", de: "Mir gefällt das Blau." },
      { it: "Posso provarlo?", de: "Kann ich es anprobieren?" },
      { it: "Il cappotto rosso è bellissimo.", de: "Der rote Mantel ist wunderschön." }
    ],
    build: [1, 3, 6],
    produce: [0, 4, 5],
    dialogueId: "acquisti",
    missionId: "carta",
    covers: ["acquisti", "abbigliamento", "colori"]
  },
  {
    id: "aiuto",
    level: "A1",
    title: "Aiuto!",
    icon: "🆘",
    scene: "Kleine Notlage: Kopfschmerzen, der Weg zur Apotheke, ein Arztgespräch. So hilfst du dir ohne Englisch.",
    words: [
      { it: "aiuto", de: "Hilfe", emoji: "🆘" },
      { it: "il medico", de: "der Arzt", emoji: "👨‍⚕️", key: "word_emergenza_medico" },
      { it: "la farmacia", de: "die Apotheke", emoji: "🏪", key: "word_emergenza_farmacia" },
      { it: "il dolore", de: "der Schmerz", emoji: "🤒", key: "word_emergenza_dolore" },
      { it: "la testa", de: "der Kopf", emoji: "🤕", key: "word_corpo_testa" },
      { it: "la medicina", de: "die Medizin / das Medikament", emoji: "💊", key: "word_corpo_medicina" },
      { it: "il poliziotto", de: "der Polizist", emoji: "👮" },
      { it: "il telefono", de: "das Telefon", emoji: "📞", key: "word_lavoro_telefono" }
    ],
    sentences: [
      { it: "Scusi, può aiutarmi?", de: "Entschuldigung, können Sie mir helfen?" },
      { it: "Non mi sento bene.", de: "Ich fühle mich nicht wohl." },
      { it: "Ho mal di testa.", de: "Ich habe Kopfschmerzen." },
      { it: "Dov'è la farmacia più vicina?", de: "Wo ist die nächste Apotheke?" },
      { it: "Ho bisogno di un medico.", de: "Ich brauche einen Arzt." },
      { it: "Può chiamare un taxi, per favore?", de: "Können Sie bitte ein Taxi rufen?" },
      { it: "Grazie mille per l'aiuto!", de: "Vielen Dank für die Hilfe!" }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    dialogueId: "aiuto",
    covers: ["emergenza", "corpo"]
  },
  {
    id: "natura",
    level: "A1",
    title: "Natura e animali",
    icon: "🌳",
    scene: "Ein Ausflug ins Grüne: Sonne, Wolken, Tiere auf dem Land. Wetterfloskeln und die Farben der Landschaft.",
    words: [
      { it: "il sole", de: "die Sonne", emoji: "☀️", key: "word_natura_sole" },
      { it: "la pioggia", de: "der Regen", emoji: "🌧️", key: "word_natura_pioggia" },
      { it: "il cielo", de: "der Himmel", emoji: "🌤️", key: "word_natura_cielo" },
      { it: "il fiore", de: "die Blume", emoji: "🌸", key: "word_natura_fiore" },
      { it: "il mare", de: "das Meer", emoji: "🌊", key: "word_natura_mare" },
      { it: "il cavallo", de: "das Pferd", emoji: "🐴", key: "word_animali_cavallo" },
      { it: "l'uccello", de: "der Vogel", emoji: "🐦", key: "word_animali_uccello" },
      { it: "la farfalla", de: "der Schmetterling", emoji: "🦋", key: "word_animali_farfalla" }
    ],
    sentences: [
      { it: "Oggi il cielo è blu.", de: "Heute ist der Himmel blau." },
      { it: "Che bel sole!", de: "Was für eine schöne Sonne!" },
      { it: "Domani piove, portiamo l'ombrello.", de: "Morgen regnet es, wir nehmen den Regenschirm mit." },
      { it: "Guarda! Una farfalla sul fiore.", de: "Schau! Ein Schmetterling auf der Blume." },
      { it: "In montagna c'è la neve.", de: "In den Bergen liegt Schnee." },
      { it: "Nel parco ci sono molti cani.", de: "Im Park gibt es viele Hunde." },
      { it: "Adoro il mare in estate.", de: "Ich liebe das Meer im Sommer." }
    ],
    build: [2, 4, 6],
    produce: [0, 3, 5],
    covers: ["natura", "animali", "colori"]
  },
  {
    id: "giornata",
    level: "A1",
    title: "La mia giornata",
    icon: "⏰",
    scene: "Vom Wecker bis zum Abend: erzähle deinen Tag mit reflexiven Verben — und lerne, wie man auf Italienisch Uhrzeiten sagt.",
    words: [
      { it: "la mattina", de: "der Morgen / vormittags", emoji: "🌅", key: "word_calendario_mattina" },
      { it: "il pomeriggio", de: "der Nachmittag", emoji: "🕑", key: "word_calendario_pomeriggio" },
      { it: "la sera", de: "der Abend", emoji: "🌆", key: "word_calendario_sera" },
      { it: "presto", de: "früh / bald", emoji: "⏰", key: "word_avverbi_a1_presto" },
      { it: "tardi", de: "spät", emoji: "🌙", key: "word_avverbi_a1_tardi" },
      { it: "mi sveglio", de: "ich wache auf", emoji: "😴" },
      { it: "mi alzo", de: "ich stehe auf", emoji: "🛏️" },
      { it: "sempre", de: "immer", emoji: "🔁", key: "word_avverbi_a1_sempre" }
    ],
    sentences: [
      { it: "Mi sveglio alle sette.", de: "Ich wache um sieben Uhr auf." },
      { it: "Mi alzo sempre presto.", de: "Ich stehe immer früh auf." },
      { it: "La mattina bevo un caffè.", de: "Am Morgen trinke ich einen Kaffee." },
      { it: "Il pomeriggio lavoro fino alle sei.", de: "Am Nachmittag arbeite ich bis sechs Uhr." },
      { it: "La sera guardo la televisione.", de: "Am Abend sehe ich fern." },
      { it: "Mi addormento tardi, verso mezzanotte.", de: "Ich schlafe spät ein, gegen Mitternacht." },
      { it: "Mai prima del caffè!", de: "Niemals vor dem Kaffee!" }
    ],
    build: [0, 1, 3],
    produce: [2, 4, 5],
    covers: ["calendario", "uhrzeit", "avverbi_a1"]
  },
  {
    id: "famiglia",
    level: "A1",
    title: "Famiglia e amici",
    icon: "👨‍👩‍👧",
    scene: "Auf einer Piazza stellst du deine Schwester vor — Herkunft, Familie und Nationalität sind die perfekten Smalltalk-Themen.",
    words: [
      { it: "la madre", de: "die Mutter", emoji: "👩", key: "word_famiglia_madre" },
      { it: "il padre", de: "der Vater", emoji: "👨", key: "word_famiglia_padre" },
      { it: "il fratello", de: "der Bruder", emoji: "🧑", key: "word_famiglia_fratello" },
      { it: "la sorella", de: "die Schwester", emoji: "👧", key: "word_famiglia_sorella" },
      { it: "il nonno", de: "der Großvater", emoji: "👴", key: "word_famiglia_nonno" },
      { it: "la nonna", de: "die Großmutter", emoji: "👵", key: "word_famiglia_nonna" },
      { it: "la Germania", de: "Deutschland", emoji: "🇩🇪" },
      { it: "italiano", de: "Italiener / italienisch", emoji: "🇮🇹", key: "word_scuola_italiano" }
    ],
    sentences: [
      { it: "Questa è mia sorella Anna.", de: "Das ist meine Schwester Anna." },
      { it: "Mio fratello ha vent'anni.", de: "Mein Bruder ist zwanzig Jahre alt." },
      { it: "I miei genitori abitano a Berlino.", de: "Meine Eltern wohnen in Berlin." },
      { it: "Di dove sei?", de: "Woher kommst du?" },
      { it: "Sono tedesco, ma vivo in Italia.", de: "Ich bin Deutscher, aber ich lebe in Italien." },
      { it: "Mia nonna cucina la pasta perfetta.", de: "Meine Oma kocht die Pasta perfekt." },
      { it: "La mia famiglia viene da Napoli.", de: "Meine Familie kommt aus Neapel." }
    ],
    build: [0, 1, 4],
    produce: [2, 3, 5],
    dialogueId: "famiglia",
    covers: ["famiglia", "paesi"]
  },
  {
    id: "casa",
    level: "A1",
    title: "A casa mia",
    icon: "🏠",
    scene: "Besuch in deiner italienischen Wohnung: Zimmer zeigen, Gegenstände beschreiben, höflich heißen — mit Artikel-Wörtern ganz nebenbei.",
    words: [
      { it: "la casa", de: "das Haus / Zuhause", emoji: "🏠", key: "word_casa_casa" },
      { it: "la cucina", de: "die Küche", emoji: "🍳", key: "word_casa_cucina" },
      { it: "il letto", de: "das Bett", emoji: "🛏️", key: "word_casa_letto" },
      { it: "il tavolo", de: "der Tisch", emoji: "🍽️", key: "word_casa_tavolo" },
      { it: "la porta", de: "die Tür", emoji: "🚪", key: "word_casa_porta" },
      { it: "la finestra", de: "das Fenster", emoji: "🪟", key: "word_casa_finestra" },
      { it: "il quadro", de: "das Bild / Gemälde", emoji: "🖼️", key: "word_casa_quadro" },
      { it: "il bicchiere", de: "das Glas", emoji: "🥃", key: "word_casa_bicchiere" }
    ],
    sentences: [
      { it: "Questa è la mia casa.", de: "Das ist mein Zuhause." },
      { it: "La cucina è a destra.", de: "Die Küche ist rechts." },
      { it: "Il libro è sul tavolo.", de: "Das Buch liegt auf dem Tisch." },
      { it: "Chiudi la porta, per favore.", de: "Schließ bitte die Tür." },
      { it: "Il mio appartamento è al terzo piano.", de: "Meine Wohnung ist im dritten Stock." },
      { it: "Dalla finestra si vede il giardino.", de: "Vom Fenster aus sieht man den Garten." },
      { it: "Benvenuto a casa mia!", de: "Willkommen in meinem Zuhause!" }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    dialogueId: "casa",
    covers: ["casa", "articoli_pronomi"]
  },
  {
    id: "citta",
    level: "A1",
    title: "Il weekend in città",
    icon: "🏛️",
    scene: "Freizeit in der Stadt: Verabredung auf der Piazza, Museum, Kino, ein Geburtstagsfest. Zahlen von 11 bis 99 kommen natürlich vor.",
    words: [
      { it: "il centro", de: "das Zentrum", emoji: "🏛️", key: "word_citta_centro" },
      { it: "la piazza", de: "der Platz", emoji: "⛲", key: "word_citta_piazza" },
      { it: "il museo", de: "das Museum", emoji: "🏺", key: "word_citta_museo" },
      { it: "il cinema", de: "das Kino", emoji: "🎬", key: "word_citta_cinema" },
      { it: "il parco", de: "der Park", emoji: "🌳", key: "word_citta_parco" },
      { it: "la festa", de: "das Fest / die Feier", emoji: "🎉", key: "word_tempo_libero_festa" },
      { it: "il film", de: "der Film", emoji: "🎥", key: "word_tempo_libero_film" },
      { it: "il compleanno", de: "der Geburtstag", emoji: "🎂", key: "word_tempo_libero_compleanno" }
    ],
    sentences: [
      { it: "Sabato andiamo in centro.", de: "Samstag fahren wir ins Zentrum." },
      { it: "Ci vediamo in piazza alle dieci.", de: "Wir treffen uns um zehn Uhr auf dem Platz." },
      { it: "Il museo chiude alle diciassette.", de: "Das Museum schließt um siebzehn Uhr." },
      { it: "La domenica vado al parco.", de: "Sonntag gehe ich in den Park." },
      { it: "Stasera guardiamo un film.", de: "Heute Abend schauen wir einen Film." },
      { it: "Il compleanno di Marco è in aprile.", de: "Marcos Geburtstag ist im April." },
      { it: "Che bella festa!", de: "Was für ein schönes Fest!" }
    ],
    build: [0, 1, 4],
    produce: [2, 3, 6],
    covers: ["citta", "tempo_libero", "numeri_estesi"]
  },
  {
    id: "lavoro",
    level: "A1",
    title: "Che lavoro fai?",
    icon: "💼",
    scene: "Beruf und Alltag: sagen, was du machst, wann du arbeitest und wo dein Termin stattfindet.",
    words: [
      { it: "il lavoro", de: "die Arbeit", emoji: "💼", key: "word_lavoro_lavoro" },
      { it: "l'ufficio", de: "das Büro", emoji: "🏢", key: "word_lavoro_ufficio" },
      { it: "l'impiegato", de: "der Angestellte", emoji: "🧑‍💼", key: "word_lavoro_impiegato" },
      { it: "l'insegnante", de: "der Lehrer / die Lehrerin", emoji: "👩‍🏫", key: "word_scuola_insegnante" },
      { it: "lo studente", de: "der Student / Schüler", emoji: "🎓", key: "word_scuola_studente" },
      { it: "il corso", de: "der Kurs", emoji: "📖", key: "word_scuola_corso" },
      { it: "l'appuntamento", de: "der Termin / die Verabredung", emoji: "📅", key: "word_lavoro_appuntamento" },
      { it: "l'orario", de: "der Zeitplan / Fahrplan", emoji: "🕒", key: "word_lavoro_orario" }
    ],
    sentences: [
      { it: "Che lavoro fai?", de: "Was machst du beruflich?" },
      { it: "Sono impiegato in un ufficio.", de: "Ich bin Angestellter in einem Büro." },
      { it: "Mia sorella è insegnante.", de: "Meine Schwester ist Lehrerin." },
      { it: "Ho un appuntamento alle tre.", de: "Ich habe einen Termin um drei Uhr." },
      { it: "Il corso d'italiano comincia lunedì.", de: "Der Italienischkurs beginnt am Montag." },
      { it: "Lavoro dalle nove alle cinque.", de: "Ich arbeite von neun bis fünf." },
      { it: "Il mio orario è molto libero.", de: "Mein Zeitplan ist sehr frei." }
    ],
    build: [0, 2, 5],
    produce: [1, 3, 4],
    covers: ["lavoro", "scuola"]
  },
  {
    id: "amico",
    level: "A1",
    title: "Un nuovo amico",
    icon: "🤝",
    scene: "Erstes Kennenlernen im Park: Namen, Herkunft, ein Kompliment — und „Piacere“.",
    words: [
      { it: "come stai?", de: "wie geht es dir?", emoji: "🙂" },
      { it: "simpatico", de: "sympathisch / nett", emoji: "😊", key: "word_aggettivi_a1_simpatico" },
      { it: "felice", de: "glücklich", emoji: "😄", key: "word_aggettivi_a1_felice" },
      { it: "stanco", de: "müde", emoji: "🥱", key: "word_aggettivi_a1_stanco" },
      { it: "contento", de: "froh / zufrieden", emoji: "🥳", key: "word_aggettivi_a1_contento" },
      { it: "vero", de: "wahr / echt", emoji: "❓", key: "word_aggettivi_a1_vero" },
      { it: "il nome", de: "der Name", emoji: "📝", key: "word_famiglia_nome" },
      { it: "l'amico", de: "der Freund", emoji: "🫂", key: "word_persone_amico" }
    ],
    sentences: [
      { it: "Ciao! Come ti chiami?", de: "Hallo! Wie heißt du?" },
      { it: "Mi chiamo Anna, e tu?", de: "Ich heiße Anna, und du?" },
      { it: "Piacere, sono Marco. Sei tedesca?", de: "Freut mich, ich bin Marco. Bist du Deutsche?" },
      { it: "Sì, sono di Berlino. E tu sei italiano?", de: "Ja, ich komme aus Berlin. Und du bist Italiener?" },
      { it: "Sì! Sei molto simpatica.", de: "Ja! Du bist sehr sympathisch." },
      { it: "Sono felice di conoscerti.", de: "Ich bin froh, dich kennenzulernen." },
      { it: "Anch'io sono contento!", de: "Ich bin auch froh!" }
    ],
    build: [0, 3, 5],
    produce: [1, 2, 6],
    covers: ["conversazione", "aggettivi_a1", "persone"]
  },
  {
    id: "piani",
    level: "A1",
    title: "Piani e desideri",
    icon: "🎯",
    scene: "Wünsche äußern und ablehnen: „Vorrei …“ ist das Magic Word — mit „ma“, „quindi“ und „perché“ verbindest du die Sätze.",
    words: [
      { it: "vorrei", de: "ich möchte / ich hätte gern", emoji: "🙏" },
      { it: "e", de: "und", emoji: "➕", key: "word_parole_funzione_e" },
      { it: "ma", de: "aber", emoji: "↩️", key: "word_parole_funzione_ma" },
      { it: "perché", de: "warum / weil", emoji: "❓" },
      { it: "quindi", de: "also / deshalb", emoji: "➡️" },
      { it: "anche", de: "auch", emoji: "✅", key: "word_parole_funzione_anche" },
      { it: "la pizza", de: "die Pizza", emoji: "🍕", key: "word_cibo_a1_pizza" },
      { it: "la verdura", de: "das Gemüse", emoji: "🥦", key: "word_cibo_a1_verdura" }
    ],
    sentences: [
      { it: "Vorrei una pizza, per favore.", de: "Ich hätte gern eine Pizza, bitte." },
      { it: "Vorrei mangiare più verdura.", de: "Ich möchte mehr Gemüse essen." },
      { it: "Vuoi venire al ristorante con noi?", de: "Willst du mit uns ins Restaurant kommen?" },
      { it: "Vorrei, ma sono molto stanco.", de: "Ich würde gern, aber ich bin sehr müde." },
      { it: "È tardi, quindi andiamo a casa.", de: "Es ist spät, also gehen wir nach Hause." },
      { it: "Perché non mangiamo insieme?", de: "Warum essen wir nicht zusammen?" },
      { it: "Vorrei un dolce e un caffè, per favore.", de: "Ich hätte gern einen Nachtisch und einen Kaffee, bitte." }
    ],
    build: [0, 2, 4],
    produce: [1, 5, 6],
    covers: ["parole_funzione", "cibo_a1"]
  },

  {
    id: "supermercato",
    level: "A1",
    title: "Al supermercato",
    icon: "🛒",
    scene: "Im Supermarkt: Liste lesen, Warenkorb füllen, an der Kasse zahlen — Wörter des Alltags in echten Kombinationen.",
    words: [
      { it: "il supermercato", de: "der Supermarkt", emoji: "🏪" },
      { it: "il carrello", de: "der Einkaufswagen", emoji: "🛒" },
      { it: "la lista", de: "die Liste", emoji: "📝" },
      { it: "la cassa", de: "die Kasse", emoji: "🏧" },
      { it: "il pane", de: "das Brot", emoji: "🍞", key: "word_ristorante_pane" },
      { it: "la frutta", de: "das Obst", emoji: "🍎", key: "word_ristorante_frutta" },
      { it: "la spesa", de: "der Einkauf", emoji: "🛍️" },
      { it: "il sacchetto", de: "die Tüte", emoji: "🛍️" }
    ],
    sentences: [
      { it: "Prendo un carrello, per favore.", de: "Ich nehme einen Einkaufswagen, bitte." },
      { it: "La lista è lunga oggi.", de: "Die Liste ist heute lang." },
      { it: "Il pane è al secondo scaffale.", de: "Das Brot ist im zweiten Regal." },
      { it: "La frutta qui è fresca.", de: "Das Obst hier ist frisch." },
      { it: "Dov'è la cassa?", de: "Wo ist die Kasse?" },
      { it: "Pago in contanti, grazie.", de: "Ich zahle bar, danke." },
      { it: "Un sacchetto, per favore.", de: "Eine Tüte, bitte." }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    covers: ["acquisti", "cibo_a1"]
  },
  {
    id: "settimana",
    level: "A1",
    title: "La settimana",
    icon: "📅",
    scene: "Die Woche im Blick: Was passiert an welchem Tag? Wochentage fest verankern durch Wiederholung in Kontext.",
    words: [
      { it: "lunedì", de: "Montag", emoji: "①" },
      { it: "mercoledì", de: "Mittwoch", emoji: "③" },
      { it: "venerdì", de: "Freitag", emoji: "⑤" },
      { it: "sabato", de: "Samstag", emoji: "⑥" },
      { it: "domenica", de: "Sonntag", emoji: "⑦" },
      { it: "il giorno", de: "der Tag", emoji: "📆", key: "word_tempo_giorno" },
      { it: "la settimana", de: "die Woche", emoji: "🗓️", key: "word_tempo_settimana" },
      { it: "il weekend", de: "das Wochenende", emoji: "🎉" }
    ],
    sentences: [
      { it: "Lunedì comincio il lavoro.", de: "Montag beginne ich die Arbeit." },
      { it: "Mercoledì faccio la spesa.", de: "Mittwoch mache ich den Einkauf." },
      { it: "Venerdì mangiamo insieme.", de: "Freitag essen wir zusammen." },
      { it: "Sabato è festa.", de: "Samstag ist Feiertag — wir haben frei." },
      { it: "La domenica riposo.", de: "Sonntags ruhe ich mich aus." },
      { it: "Il weekend è sempre breve.", de: "Das Wochenende ist immer kurz." },
      { it: "Sette giorni sono una settimana.", de: "Sieben Tage sind eine Woche." }
    ],
    build: [0, 2, 3],
    produce: [1, 4, 6],
    covers: ["tempo", "calendario"]
  },
  {
    id: "ora",
    level: "A1",
    title: "Che ora è?",
    icon: "🕐",
    scene: "Uhrzeit fragen und sagen: „in punto“, „e mezzo“, „e un quarto“ — mit den Uhrzeiten des Alltags.",
    words: [
      { it: "che ora è?", de: "wie viel Uhr ist es?", emoji: "🕐" },
      { it: "in punto", de: "um genau", emoji: "⏱️" },
      { it: "e mezzo", de: "um halb (nach)", emoji: "🕜" },
      { it: "e un quarto", de: "um Viertel nach", emoji: "∱" },
      { it: "mezzogiorno", de: "der Mittag / zwölf Uhr", emoji: "🕛", key: "word_calendario_mezzogiorno" },
      { it: "mezzanotte", de: "die Mitternacht", emoji: "🌌", key: "word_calendario_mezzanotte" },
      { it: "il minuto", de: "die Minute", emoji: "⏲️", key: "word_calendario_minuto" },
      { it: "il momento", de: "der Moment", emoji: "✨", key: "word_calendario_momento" }
    ],
    sentences: [
      { it: "Scusa, che ora è?", de: "Sorry, wie viel Uhr ist es?" },
      { it: "Sono le nove in punto.", de: "Es ist genau neun Uhr." },
      { it: "È mezzogiorno e mezzo.", de: "Es ist halb eins." },
      { it: "Il treno parte alle tre e un quarto.", de: "Der Zug fährt um Viertel nach drei ab." },
      { it: "Aspetta un momento, per favore.", de: "Warte einen Moment, bitte." },
      { it: "Arrivo tra dieci minuti.", de: "Ich komme in zehn Minuten." },
      { it: "A mezzanotte dormo.", de: "Um Mitternacht schlafe ich." }
    ],
    build: [0, 1, 3],
    produce: [2, 4, 6],
    covers: ["uhrzeit", "calendario"]
  },
  {
    id: "famiglia-rossi",
    level: "A1",
    title: "La famiglia Rossi",
    icon: "🏡",
    scene: "Die Familie Rossi stellt sich vor: Besitz aneignen mit „mio/tuo/suo“ — und Familienwörter in echten Sätzen.",
    words: [
      { it: "il figlio", de: "der Sohn", emoji: "👦", key: "word_famiglia_figlio" },
      { it: "la figlia", de: "die Tochter", emoji: "👧", key: "word_famiglia_figlia" },
      { it: "il marito", de: "der Ehemann", emoji: "🤵", key: "word_famiglia_marito" },
      { it: "la moglie", de: "die Ehefrau", emoji: "👰", key: "word_famiglia_moglie" },
      { it: "i genitori", de: "die Eltern", emoji: "👨‍👩‍👦" },
      { it: "il cugino", de: "der Cousin", emoji: "🧑" },
      { it: "la cugina", de: "die Cousine", emoji: "👩" },
      { it: "grande", de: "groß", emoji: "🔺", key: "word_aggettivi_grande" }
    ],
    sentences: [
      { it: "La famiglia Rossi è grande.", de: "Die Familie Rossi ist groß." },
      { it: "Mio figlio ha sei anni.", de: "Mein Sohn ist sechs Jahre alt." },
      { it: "Mia figlia si chiama Giulia.", de: "Meine Tochter heißt Giulia." },
      { it: "Mio marito lavora molto.", de: "Mein Mann arbeitet viel." },
      { it: "I miei genitori abitano a Roma.", de: "Meine Eltern wohnen in Rom." },
      { it: "Il mio cugino ha una figlia.", de: "Mein Cousin hat eine Tochter." },
      { it: "La nostra casa è piccola ma bella.", de: "Unser Haus ist klein, aber schön." }
    ],
    build: [0, 1, 4],
    produce: [2, 3, 6],
    covers: ["famiglia", "persone"]
  },
  {
    id: "tempo-libero",
    level: "A1",
    title: "Il tempo libero",
    icon: "🎾",
    scene: "Freizeit: was machst du gern? Sport, Musik, Bücher — Verben + Substantive in persönlichen Sätzen.",
    words: [
      { it: "lo sport", de: "der Sport", emoji: "⚽", key: "word_tempo_libero_sport" },
      { it: "il calcio", de: "der Fußball", emoji: "🥅", key: "word_tempo_libero_calcio" },
      { it: "la musica", de: "die Musik", emoji: "🎵", key: "word_tempo_libero_musica" },
      { it: "il libro", de: "das Buch", emoji: "📕", key: "word_scuola_libro" },
      { it: "il gioco", de: "das Spiel", emoji: "🎲", key: "word_tempo_libero_gioco" },
      { it: "il nuoto", de: "das Schwimmen", emoji: "🏊" },
      { it: "la corsa", de: "das Laufen", emoji: "🏃" },
      { it: "il ballo", de: "das Tanzen", emoji: "💃" }
    ],
    sentences: [
      { it: "Il mio sport preferito è il calcio.", de: "Mein Lieblingssport ist Fußball." },
      { it: "Ascolto musica ogni giorno.", de: "Ich höre jeden Tag Musik." },
      { it: "Leggo un libro alla sera.", de: "Am Abend lese ich ein Buch." },
      { it: "Il nuoto è divertente.", de: "Schwimmen macht Spaß." },
      { it: "Faccio la corsa al parco.", de: "Ich laufe im Park." },
      { it: "Il ballo è bellissimo.", de: "Tanzen ist wunderschön." },
      { it: "Nel tempo libero gioco con i bambini.", de: "In der Freizeit spiele ich mit den Kindern." }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    covers: ["tempo_libero"]
  },
  {
    id: "corpo-mosso",
    level: "A1",
    title: "Il corpo in movimento",
    icon: "🖐️",
    scene: "Körperteile in Aktion: Hände, Füße, Augen — so bleiben sie im Gedächtnis.",
    words: [
      { it: "la mano", de: "die Hand", emoji: "✋", key: "word_corpo_mano" },
      { it: "il piede", de: "der Fuß", emoji: "🦶", key: "word_corpo_piede" },
      { it: "l'occhio", de: "das Auge", emoji: "👁️", key: "word_corpo_occhio" },
      { it: "l'orecchio", de: "das Ohr", emoji: "👂", key: "word_corpo_orecchio" },
      { it: "il ginocchio", de: "das Knie", emoji: "🦵", key: "word_corpo_ginocchio" },
      { it: "correre", de: "laufen / rennen", emoji: "💨" },
      { it: "nuotare", de: "schwimmen", emoji: "🌊" },
      { it: "camminare", de: "spazieren / gehen", emoji: "🚶" }
    ],
    sentences: [
      { it: "Cammino a piedi al lavoro.", de: "Ich gehe zu Fuß zur Arbeit." },
      { it: "Corro nel parco ogni mattina.", de: "Ich renne jeden Morgen im Park." },
      { it: "Nuoto con gli amici.", de: "Ich schwimme mit Freunden." },
      { it: "Chiudo gli occhi, per favore.", de: "Schließ die Augen, bitte." },
      { it: "Il bambino ha le ginocchia sporche.", de: "Das Kind hat schmutzige Knie." },
      { it: "Alzo la mano.", de: "Ich hebe die Hand." },
      { it: "Ascolto con le orecchie.", de: "Ich höre mit den Ohren." }
    ],
    build: [0, 1, 5],
    produce: [2, 3, 6],
    covers: ["corpo"]
  },
  {
    id: "cosa-è",
    level: "A1",
    title: "Che cos'è?",
    icon: "❓",
    scene: "Dinge benennen und fragen: „Che cos'è? — È un libro“ — Fragewörter und Hinweiswörter zusammen.",
    words: [
      { it: "che cos'è?", de: "was ist das?", emoji: "❓" },
      { it: "questo", de: "dieses / dieses hier", emoji: "👆", key: "word_articoli_pronomi_questo" },
      { it: "quello", de: "das dort", emoji: "👇", key: "word_articoli_pronomi_quello" },
      { it: "qui", de: "hier", emoji: "📍", key: "word_orientamento_qui" },
      { it: "lì", de: "dort", emoji: "🧭" },
      { it: "la cosa", de: "die Sache / das Ding", emoji: "📦" },
      { it: "l'esempio", de: "das Beispiel", emoji: "🧩" },
      { it: "la risposta", de: "die Antwort", emoji: "💬", key: "word_scuola_risposta" }
    ],
    sentences: [
      { it: "Scusa, che cos'è questo?", de: "Sorry, was ist das hier?" },
      { it: "È un libro di italiano.", de: "Es ist ein italienisches Buch." },
      { it: "E quello là?", de: "Und das dort?" },
      { it: "È la mia borsa.", de: "Das ist meine Tasche." },
      { it: "La cosa è qui, non là.", de: "Die Sache ist hier, nicht dort." },
      { it: "Faccio un esempio.", de: "Ich gebe ein Beispiel." },
      { it: "La risposta è giusta!", de: "Die Antwort ist richtig!" }
    ],
    build: [0, 2, 5],
    produce: [1, 3, 6],
    covers: ["interrogativi", "conversazione"]
  },
  {
    id: "numeri-grandi",
    level: "A1",
    title: "I numeri grandi",
    icon: "💯",
    scene: "Große Zahlen im Alltag: Preise, Zimmer, Alter — Zahlen automatisch lesen lernen.",
    words: [
      { it: "cento", de: "hundert", emoji: "💯" },
      { it: "mille", de: "tausend", emoji: "🧮" },
      { it: "venti", de: "zwanzig", emoji: "2️⃣" },
      { it: "trenta", de: "dreißig", emoji: "3️⃣", key: "word_numeri_estesi_trenta" },
      { it: "quaranta", de: "vierzig", emoji: "4️⃣", key: "word_numeri_estesi_quaranta" },
      { it: "sessanta", de: "sechzig", emoji: "6️⃣", key: "word_numeri_estesi_sessanta" },
      { it: "il prezzo", de: "der Preis", emoji: "🏷️" },
      { it: "il numero", de: "die Nummer", emoji: "🔢", key: "word_numeri_estesi_numero" }
    ],
    sentences: [
      { it: "Il libro costa cento euro.", de: "Das Buch kostet hundert Euro." },
      { it: "Il mio numero è il trenta.", de: "Meine Nummer ist die dreißig." },
      { it: "Roma ha duemila anni.", de: "Rom ist zweitausend Jahre alt." },
      { it: "Il prezzo è di quaranta euro.", de: "Der Preis beträgt vierzig Euro." },
      { it: "L'hotel ha sessanta camere.", de: "Das Hotel hat sechzig Zimmer." },
      { it: "Il nonno ha ottanta anni.", de: "Der Opa ist achtzig Jahre alt." },
      { it: "Che numero hai chiamato?", de: "Welche Nummer hast du gewählt?" }
    ],
    build: [0, 1, 3],
    produce: [2, 4, 6],
    covers: ["numeri", "numeri_estesi"]
  },
  {
    id: "dove-abiti",
    level: "A1",
    title: "Dove abiti?",
    icon: "🏘️",
    scene: "Wohnort und Adresse: Straße, Stockwerk, Nummer — wie man über Wohnen spricht.",
    words: [
      { it: "l'appartamento", de: "die Wohnung", emoji: "🏢", key: "word_casa_appartamento" },
      { it: "la via", de: "die Straße", emoji: "🛣️", key: "word_citta_via" },
      { it: "la strada", de: "die Straße / der Weg", emoji: "🚏", key: "word_orientamento_strada" },
      { it: "il piano", de: "das Stockwerk", emoji: "🎚️", key: "word_casa_piano" },
      { it: "l'indirizzo", de: "die Adresse", emoji: "📬", key: "word_lavoro_indirizzo" },
      { it: "vicino", de: "nah", emoji: "📍", key: "word_orientamento_vicino" },
      { it: "lontano", de: "weit", emoji: "🛰️", key: "word_orientamento_lontano" },
      { it: "abito", de: "ich wohne", emoji: "🏠" }
    ],
    sentences: [
      { it: "Abito in Via Roma, numero dieci.", de: "Ich wohne in der Via Roma, Nummer zehn." },
      { it: "Il mio appartamento è al terzo piano.", de: "Meine Wohnung ist im dritten Stock." },
      { it: "L'indirizzo è facile da trovare.", de: "Die Adresse ist leicht zu finden." },
      { it: "La stazione è vicino a casa.", de: "Der Bahnhof ist nah am Haus." },
      { it: "Il centro è lontano a piedi.", de: "Das Zentrum ist zu Fuß weit." },
      { it: "La nostra strada è tranquilla.", de: "Unsere Straße ist ruhig." },
      { it: "Abiti con la tua famiglia?", de: "Wohnst du mit deiner Familie?" }
    ],
    build: [0, 1, 4],
    produce: [2, 3, 6],
    covers: ["casa", "citta"]
  },
  {
    id: "giorno-pioggia",
    level: "A1",
    title: "Un giorno di pioggia",
    icon: "🌧️",
    scene: "Ein Regentag: Wetter kleidet ein — Kombination von Wetter- und Kleidungswörtern.",
    words: [
      { it: "la pioggia", de: "der Regen", emoji: "🌧️", key: "word_natura_pioggia" },
      { it: "il vento", de: "der Wind", emoji: "💨", key: "word_natura_vento" },
      { it: "l'ombrello", de: "der Regenschirm", emoji: "☔", key: "word_abbigliamento_ombrello" },
      { it: "il cappotto", de: "der Mantel", emoji: "🧥", key: "word_abbigliamento_cappotto" },
      { it: "freddo", de: "kalt", emoji: "🥶", key: "word_aggettivi_freddo" },
      { it: "caldo", de: "heiß / warm", emoji: "🥵", key: "word_aggettivi_caldo" },
      { it: "dentro", de: "drinnen", emoji: "🏠", key: "word_avverbi_a1_dentro" },
      { it: "fuori", de: "draußen", emoji: "🌳", key: "word_avverbi_a1_fuori" }
    ],
    sentences: [
      { it: "Oggi piove, resto dentro.", de: "Heute regnet es, ich bleibe drinnen." },
      { it: "Fuori c'è molto vento.", de: "Draußen ist viel Wind." },
      { it: "Fa freddo, prendo il cappotto.", de: "Es ist kalt, ich nehme den Mantel." },
      { it: "L'ombrello è vicino alla porta.", de: "Der Regenschirm ist neben der Tür." },
      { it: "In estate fa caldo, in inverno fa freddo.", de: "Im Sommer ist es heiß, im Winter kalt." },
      { it: "Dopo la pioggia esco.", de: "Nach dem Regen gehe ich raus." },
      { it: "A casa è caldo e asciutto.", de: "Zu Hause ist es warm und trocken." }
    ],
    build: [0, 2, 3],
    produce: [1, 4, 5],
    covers: ["natura", "abbigliamento"]
  },
  {
    id: "bar-amici",
    level: "A1",
    title: "Al bar con amici",
    icon: "🥂",
    scene: "Zusammen an der Bar: Getränke bestellen, sich unterhalten — Höflichkeit und Getränke kombinieren.",
    words: [
      { it: "l'amico", de: "der Freund", emoji: "🧑‍🤝‍🧑", key: "word_persone_amico" },
      { it: "l'amica", de: "die Freundin", emoji: "👭", key: "word_persone_amica" },
      { it: "il tavolo", de: "der Tisch", emoji: "🍽️", key: "word_casa_tavolo" },
      { it: "il succo", de: "der Saft", emoji: "🧃", key: "word_ristorante_succo" },
      { it: "il tè", de: "der Tee", emoji: "🍵" },
      { it: "ridere", de: "lachen", emoji: "😆" },
      { it: "parlare", de: "sprechen / reden", emoji: "💬" },
      { it: "stare bene", de: "sich wohlfühlen", emoji: "😊" }
    ],
    sentences: [
      { it: "Sediamoci a quel tavolo.", de: "Setzen wir uns an den Tisch dort." },
      { it: "Prendo un succo di frutta.", de: "Ich nehme einen Fruchtsaft." },
      { it: "E tu? Cosa prendi?", de: "Und du? Was nimmst du?" },
      { it: "Un tè caldo, grazie.", de: "Einen warmen Tee, danke." },
      { it: "Ridiamo e parliamo insieme.", de: "Wir lachen und reden zusammen." },
      { it: "Sto bene con gli amici.", de: "Mit Freunden geht es mir gut." },
      { it: "Alla prossima volta!", de: "Bis zum nächsten Mal!" }
    ],
    build: [0, 1, 4],
    produce: [2, 3, 5],
    covers: ["saluti", "conversazione"]
  },
  {
    id: "mio-giorno",
    level: "A1",
    title: "Il mio giorno",
    icon: "📆",
    scene: "Zeitwörter im Alltag: heute, morgen, gestern, jetzt — so hängt die Geschichte zusammen.",
    words: [
      { it: "oggi", de: "heute", emoji: "📌", key: "word_tempo_oggi" },
      { it: "domani", de: "morgen", emoji: "➡️", key: "word_tempo_domani" },
      { it: "ieri", de: "gestern", emoji: "⬅️", key: "word_tempo_ieri" },
      { it: "adesso", de: "jetzt", emoji: "⏱️", key: "word_tempo_adesso" },
      { it: "dopo", de: "später / danach", emoji: "⏭️", key: "word_tempo_dopo" },
      { it: "prima", de: "vorher / zuerst", emoji: "⏮️", key: "word_avverbi_a1_prima" },
      { it: "la mattina", de: "der Morgen", emoji: "🌅", key: "word_calendario_mattina" },
      { it: "la sera", de: "der Abend", emoji: "🌆", key: "word_calendario_sera" }
    ],
    sentences: [
      { it: "Oggi lavoro fino alle sei.", de: "Heute arbeite ich bis sechs Uhr." },
      { it: "Prima faccio la colazione.", de: "Zuerst frühstücke ich." },
      { it: "Dopo vado in ufficio.", de: "Danach gehe ich ins Büro." },
      { it: "Ieri sono stato a casa.", de: "Gestern war ich zu Hause." },
      { it: "Domani ho un appuntamento.", de: "Morgen habe ich einen Termin." },
      { it: "Adesso non posso, scusa.", de: "Jetzt kann ich nicht, sorry." },
      { it: "La sera riposo un po'.", de: "Am Abend ruhe ich mich etwas aus." }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    covers: ["tempo", "avverbi_a1"]
  },

  {
    id: "m-caffe-numeri",
    level: "A1",
    title: "Caffè & numeri",
    icon: "☕",
    scene: "An der Bar bestellen und zahlen: Bestellungen mit Zahlen, das italienische Frühstück und die Rechnung.",
    words: [
      { it: "un caffè", de: "ein Espresso", emoji: "☕" },
      { it: "cornetto", de: "Hörnchen", emoji: "🥐" },
      { it: "il conto", de: "die Rechnung", emoji: "🧾" },
      { it: "euro", de: "Euro", emoji: "💶" },
      { it: "dieci", de: "zehn", emoji: "🔟" },
      { it: "grazie mille", de: "vielen Dank", emoji: "🙏" },
      { it: "l'acqua", de: "Wasser", emoji: "💧", key: "word_ristorante_acqua" },
      { it: "la colazione", de: "das Frühstück", emoji: "🍳", key: "word_ristorante_colazione" }
    ],
    sentences: [
      { it: "Due caffè e un cornetto, per favore.", de: "Zwei Espressi und ein Hörnchen, bitte." },
      { it: "Sono dieci euro.", de: "Es sind zehn Euro." },
      { it: "Il conto, per favore.", de: "Die Rechnung, bitte." },
      { it: "Grazie mille, arrivederci!", de: "Vielen Dank, auf Wiedersehen!" },
      { it: "Due caffè e un cornetto, quanto fa?", de: "Zwei Espressi und ein Hörnchen, wie viel macht das?" },
      { it: "La colazione italiana è un caffè e un cornetto.", de: "Das italienische Frühstück ist ein Espresso und ein Hörnchen." },
      { it: "Il conto fa dodici euro.", de: "Die Rechnung macht zwölf Euro." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["ristorante"] },
  {
    id: "m-vie",
    level: "A1",
    title: "Wege & Orte",
    icon: "🧭",
    scene: "Wegbeschreibungen: geradeaus, links, rechts — und wonach du fragst, um einen Ort zu finden.",
    words: [
      { it: "dritto", de: "geradeaus", emoji: "⬆️" },
      { it: "a destra", de: "rechts", emoji: "➡️" },
      { it: "a sinistra", de: "links", emoji: "⬅️" },
      { it: "vicino", de: "nah", emoji: "📍" },
      { it: "bagno", de: "Toilette", emoji: "🚻" },
      { it: "stazione", de: "Bahnhof", emoji: "🚉" },
      { it: "sempre", de: "immer", emoji: "♾️", key: "word_avverbi_a1_sempre" },
      { it: "poi", de: "dann / danach", emoji: "⏭️", key: "word_avverbi_a1_poi" }
    ],
    sentences: [
      { it: "Vai sempre dritto.", de: "Geh immer geradeaus." },
      { it: "Poi gira a destra.", de: "Dann biege rechts ab." },
      { it: "Dov'è il bagno?", de: "Wo ist die Toilette?" },
      { it: "Il bagno è vicino al bar.", de: "Die Toilette ist neben der Bar." },
      { it: "Scusi, dov'è la chiesa?", de: "Entschuldigung, wo ist die Kirche?" },
      { it: "Sempre dritto, poi gira a sinistra.", de: "Immer geradeaus, dann links abbiegen." },
      { it: "La chiesa è vicino alla piazza.", de: "Die Kirche ist nah am Platz." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["orientamento"] },
  {
    id: "m-famiglia-anni",
    level: "A1",
    title: "Familie & Alter",
    icon: "👨‍👩‍👦",
    scene: "Familienwörter mit Zahlen kombinieren: Wie alt ist jemand, und wie sagst du dein eigenes Alter?",
    words: [
      { it: "padre", de: "Vater", emoji: "👨" },
      { it: "madre", de: "Mutter", emoji: "👩" },
      { it: "fratello", de: "Bruder", emoji: "🧑" },
      { it: "sorella", de: "Schwester", emoji: "👧" },
      { it: "venti", de: "zwanzig", emoji: "2️⃣" },
      { it: "cinquanta", de: "fünfzig", emoji: "5️⃣" },
      { it: "il nonno", de: "der Großvater", emoji: "👴", key: "word_famiglia_nonno" },
      { it: "trenta", de: "dreißig", emoji: "3️⃣", key: "word_numeri_estesi_trenta" }
    ],
    sentences: [
      { it: "Mio padre ha cinquant'anni.", de: "Mein Vater ist fünfzig Jahre alt." },
      { it: "Mia madre ha quaranta anni.", de: "Meine Mutter ist vierzig Jahre alt." },
      { it: "Mia sorella ha venti anni.", de: "Meine Schwester ist zwanzig Jahre alt." },
      { it: "Quanti anni ha tuo fratello?", de: "Wie alt ist dein Bruder?" },
      { it: "Quanti anni hai?", de: "Wie alt bist du?" },
      { it: "Mio fratello ha trent'anni.", de: "Mein Bruder ist dreißig Jahre alt." },
      { it: "Mia nonna ha settanta anni.", de: "Meine Oma ist siebzig Jahre alt." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["famiglia"] },
  {
    id: "m-ordina",
    level: "A1",
    title: "Am Tisch bestellen",
    icon: "🍽️",
    scene: "Essenswörter in Bestell-Sätzen: vom Menü bis „Vorrei“ — höflich am Tisch ordern.",
    words: [
      { it: "pesce", de: "Fisch", emoji: "🐟" },
      { it: "vino", de: "Wein", emoji: "🍷" },
      { it: "pane", de: "Brot", emoji: "🍞" },
      { it: "buono", de: "gut / lecker", emoji: "😋" },
      { it: "il menù", de: "die Speisekarte", emoji: "📋" },
      { it: "l'acqua", de: "Wasser", emoji: "💧", key: "word_ristorante_acqua" },
      { it: "l'insalata", de: "der Salat", emoji: "🥗", key: "word_cibo_a1_insalata" },
      { it: "il formaggio", de: "der Käse", emoji: "🧀", key: "word_ristorante_formaggio" }
    ],
    sentences: [
      { it: "Il pesce è molto buono.", de: "Der Fisch ist sehr lecker." },
      { it: "Prendiamo anche il vino.", de: "Wir nehmen auch den Wein." },
      { it: "Del pane, per favore.", de: "Brot, bitte." },
      { it: "Il menù, per favore.", de: "Die Speisekarte, bitte." },
      { it: "Io prendo il pesce, e tu?", de: "Ich nehme den Fisch, und du?" },
      { it: "L'insalata è fresca e buona.", de: "Der Salat ist frisch und lecker." },
      { it: "Vorrei del formaggio, per favore.", de: "Ich hätte gern Käse, bitte." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["ristorante", "aggettivi"] },
  {
    id: "m-hotel-numeri",
    level: "A1",
    title: "Hotel & Zahlen",
    icon: "🏨",
    scene: "Im Hotel: Zimmernummer, Stockwerk, Schlüssel und die Frühstückszeit — Zahlen im Alltag.",
    words: [
      { it: "camera", de: "Zimmer", emoji: "🛏️" },
      { it: "chiave", de: "Schlüssel", emoji: "🔑" },
      { it: "venti", de: "zwanzig", emoji: "2️⃣" },
      { it: "bagno", de: "Toilette", emoji: "🛁" },
      { it: "dove", de: "wo", emoji: "❓" },
      { it: "il piano", de: "das Stockwerk", emoji: "🎚️", key: "word_casa_piano" },
      { it: "la colazione", de: "das Frühstück", emoji: "🍳", key: "word_ristorante_colazione" },
      { it: "grande", de: "groß", emoji: "🐘", key: "word_aggettivi_grande" }
    ],
    sentences: [
      { it: "Camera venti, per favore.", de: "Zimmer zwanzig, bitte." },
      { it: "Dov'è la chiave?", de: "Wo ist der Schlüssel?" },
      { it: "Il bagno è qui.", de: "Das Bad ist hier." },
      { it: "La camera è al primo piano.", de: "Das Zimmer ist im ersten Stock." },
      { it: "Ho una camera al secondo piano.", de: "Ich habe ein Zimmer im zweiten Stock." },
      { it: "La colazione è alle otto.", de: "Das Frühstück ist um acht Uhr." },
      { it: "Ecco la chiave, grazie!", de: "Hier ist der Schlüssel, danke!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["viaggio"] },
  {
    id: "m-zahlen-11-19",
    level: "A1",
    title: "Zahlen 11–19",
    icon: "🔢",
    scene: "Elf bis neunzehn in echten Sätzen: Preise, Uhrzeiten, Alter — und eine kleine Rechenaufgabe.",
    words: [
      { it: "undici", de: "elf", emoji: "1️⃣" },
      { it: "dodici", de: "zwölf", emoji: "2️⃣" },
      { it: "tredici", de: "dreizehn", emoji: "3️⃣" },
      { it: "quattordici", de: "vierzehn", emoji: "4️⃣" },
      { it: "quindici", de: "fünfzehn", emoji: "5️⃣" },
      { it: "euro", de: "Euro", emoji: "💶" },
      { it: "sedici", de: "sechzehn", emoji: "6️⃣", key: "word_numeri_estesi_sedici" },
      { it: "diciassette", de: "siebzehn", emoji: "7️⃣", key: "word_numeri_estesi_diciassette" }
    ],
    sentences: [
      { it: "Ho dodici euro.", de: "Ich habe zwölf Euro." },
      { it: "Il treno parte alle tredici.", de: "Der Zug fährt um dreizehn Uhr ab." },
      { it: "Sono quattordici euro.", de: "Es sind vierzehn Euro." },
      { it: "Abito al numero quindici.", de: "Ich wohne in der Nummer fünfzehn." },
      { it: "Il treno arriva alle sedici.", de: "Der Zug kommt um sechzehn Uhr an." },
      { it: "Tredici più quattro fanno diciassette.", de: "Dreizehn plus vier gibt siebzehn." },
      { it: "Ho sedici anni e mio fratello ha diciotto.", de: "Ich bin sechzehn und mein Bruder ist achtzehn." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["numeri_estesi"] },
  {
    id: "m-verkehr-zeit",
    level: "A1",
    title: "Unterwegs & Zeit",
    icon: "🚌",
    scene: "Verkehrsmittel mit Uhrzeiten verbinden: Abfahrt, Ankunft und die berühmte Verspätung.",
    words: [
      { it: "treno", de: "Zug", emoji: "🚂" },
      { it: "autobus", de: "Bus", emoji: "🚌" },
      { it: "tram", de: "Straßenbahn", emoji: "🚋" },
      { it: "taxi", de: "Taxi", emoji: "🚕" },
      { it: "adesso", de: "jetzt", emoji: "⏱️" },
      { it: "ora", de: "Stunde / Uhrzeit", emoji: "🕒" },
      { it: "l'aeroporto", de: "der Flughafen", emoji: "✈️", key: "word_viaggio_aeroporto" },
      { it: "presto", de: "früh / bald", emoji: "🌅", key: "word_avverbi_a1_presto" }
    ],
    sentences: [
      { it: "Il treno parte alle otto.", de: "Der Zug fährt um acht Uhr ab." },
      { it: "L'autobus arriva adesso.", de: "Der Bus kommt jetzt an." },
      { it: "Il tram è lento ma economico.", de: "Die Tram ist langsam, aber günstig." },
      { it: "Prendiamo un taxi.", de: "Nehmen wir ein Taxi." },
      { it: "Il treno è in ritardo.", de: "Der Zug hat Verspätung." },
      { it: "Andiamo all'aeroporto in taxi.", de: "Fahren wir mit dem Taxi zum Flughafen." },
      { it: "Il primo tram parte alle sei.", de: "Die erste Straßenbahn fährt um sechs Uhr ab." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["viaggio", "tempo"] },
  {
    id: "m-colori-tavola",
    level: "A1",
    title: "Farben am Teller",
    icon: "🎨",
    scene: "Farben mit Lebensmitteln verknüpfen: Welche Speise hat welche Farbe — und welche nicht?",
    words: [
      { it: "rosso", de: "rot", emoji: "🔴" },
      { it: "verde", de: "grün", emoji: "🟢" },
      { it: "giallo", de: "gelb", emoji: "🟡" },
      { it: "bianco", de: "weiß", emoji: "⚪" },
      { it: "pomodoro", de: "Tomate", emoji: "🍅" },
      { it: "latte", de: "Milch", emoji: "🥛" },
      { it: "nero", de: "schwarz", emoji: "⚫", key: "word_colori_nero" },
      { it: "l'insalata", de: "der Salat", emoji: "🥗", key: "word_cibo_a1_insalata" }
    ],
    sentences: [
      { it: "Il pomodoro è rosso.", de: "Die Tomate ist rot." },
      { it: "Il latte è bianco.", de: "Die Milch ist weiß." },
      { it: "Il vino è rosso.", de: "Der Wein ist rot." },
      { it: "Il formaggio è giallo.", de: "Der Käse ist gelb." },
      { it: "L'insalata è verde.", de: "Der Salat ist grün." },
      { it: "Il caffè è nero.", de: "Der Espresso ist schwarz." },
      { it: "Il formaggio non è bianco, è giallo.", de: "Der Käse ist nicht weiß, sondern gelb." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["colori", "cibo_a1"] },
  {
    id: "m-corpo-fame",
    level: "A1",
    title: "Körpergefühle",
    icon: "🫀",
    scene: "Hunger, Durst, Hitze, Müdigkeit — sagen, wie du dich fühlst, und was du dann machst.",
    words: [
      { it: "fame", de: "Hunger", emoji: "🍽️" },
      { it: "sete", de: "Durst", emoji: "🥤" },
      { it: "sonno", de: "Müdigkeit", emoji: "😴" },
      { it: "acqua", de: "Wasser", emoji: "💧" },
      { it: "gelato", de: "Eis", emoji: "🍨" },
      { it: "adesso", de: "jetzt", emoji: "⏱️" },
      { it: "stanco", de: "müde", emoji: "🥱", key: "word_aggettivi_a1_stanco" },
      { it: "caldo", de: "heiß / warm", emoji: "🥵", key: "word_aggettivi_caldo" }
    ],
    sentences: [
      { it: "Ho fame.", de: "Ich habe Hunger." },
      { it: "Ho sete, bevo acqua.", de: "Ich habe Durst, ich trinke Wasser." },
      { it: "Ho sonno, è tardi.", de: "Ich bin müde, es ist spät." },
      { it: "Ancora un gelato, per favore.", de: "Noch ein Eis, bitte." },
      { it: "Ho fame, mangio una pizza.", de: "Ich habe Hunger, ich esse eine Pizza." },
      { it: "Ho caldo, apro la finestra.", de: "Mir ist heiß, ich mache das Fenster auf." },
      { it: "Adesso mangiamo, poi prendiamo un gelato.", de: "Jetzt essen wir, dann nehmen wir ein Eis." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["corpo", "ristorante"] },
  {
    id: "m-citta-vicino",
    level: "A1",
    title: "Stadt & Entfernung",
    icon: "🏛️",
    scene: "Orte in der Stadt beschreiben: Was liegt nah, was liegt weit — und wie kommen wir hin?",
    words: [
      { it: "centro", de: "Zentrum", emoji: "🏛️" },
      { it: "piazza", de: "Platz", emoji: "⛲" },
      { it: "parco", de: "Park", emoji: "🌳" },
      { it: "museo", de: "Museum", emoji: "🏺" },
      { it: "vicino", de: "nah", emoji: "📍" },
      { it: "lontano", de: "weit", emoji: "🛰️" },
      { it: "la chiesa", de: "die Kirche", emoji: "⛪", key: "word_citta_chiesa" },
      { it: "a piedi", de: "zu Fuß", emoji: "🚶", key: "word_viaggio_a_piedi" }
    ],
    sentences: [
      { it: "Il museo è in centro.", de: "Das Museum ist im Zentrum." },
      { it: "La piazza è vicina.", de: "Der Platz ist nah." },
      { it: "Il parco è lontano?", de: "Ist der Park weit?" },
      { it: "Ci vediamo in piazza.", de: "Wir sehen uns auf dem Platz." },
      { it: "La chiesa è vicino al centro.", de: "Die Kirche ist nah am Zentrum." },
      { it: "Andiamo al museo a piedi?", de: "Gehen wir zu Fuß zum Museum?" },
      { it: "Il centro è lontano, prendiamo l'autobus.", de: "Das Zentrum ist weit, wir nehmen den Bus." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["citta", "orientamento"] },
  {
    id: "m-mengen",
    level: "A1",
    title: "Mengen einkaufen",
    icon: "🧺",
    scene: "Flaschen, Gläser, Kilo — einkaufen wie in Italien: Mengen angeben und an der Kasse freundlich bleiben.",
    words: [
      { it: "bottiglia", de: "Flasche", emoji: "🍾" },
      { it: "bicchiere", de: "Glas", emoji: "🥃" },
      { it: "acqua", de: "Wasser", emoji: "💧" },
      { it: "vino", de: "Wein", emoji: "🍷" },
      { it: "frutta", de: "Obst", emoji: "🍎" },
      { it: "grazie", de: "danke", emoji: "🙏" },
      { it: "il pane", de: "Brot", emoji: "🍞", key: "word_ristorante_pane" },
      { it: "il mercato", de: "der Markt", emoji: "🏪", key: "word_acquisti_mercato" }
    ],
    sentences: [
      { it: "Due bottiglie d'acqua, per favore.", de: "Zwei Flaschen Wasser, bitte." },
      { it: "Un bicchiere di vino.", de: "Ein Glas Wein." },
      { it: "Un chilo di frutta.", de: "Ein Kilo Obst." },
      { it: "È tutto, grazie.", de: "Das ist alles, danke." },
      { it: "Quanto costa un chilo di pomodori?", de: "Wie viel kostet ein Kilo Tomaten?" },
      { it: "Prendo anche il pane e del formaggio.", de: "Ich nehme auch Brot und Käse." },
      { it: "Il mercato apre alle otto.", de: "Der Markt öffnet um acht Uhr." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["acquisti", "casa"] },
  {
    id: "m-smalltalk",
    level: "A1",
    title: "Smalltalk-Klassiker",
    icon: "💬",
    scene: "Die wichtigsten Höflichkeitsformeln im Wechsel: grüßen, nach dem Befinden fragen, sich bedanken und verabschieden.",
    words: [
      { it: "buongiorno", de: "guten Tag", emoji: "🌅" },
      { it: "come sta?", de: "wie geht es Ihnen?", emoji: "🤝" },
      { it: "tutto bene?", de: "alles gut?", emoji: "😊" },
      { it: "grazie", de: "danke", emoji: "🙏" },
      { it: "di niente", de: "gern geschehen", emoji: "🙆" },
      { it: "a dopo", de: "bis später", emoji: "👋" },
      { it: "arrivederci", de: "auf Wiedersehen", emoji: "🚪", key: "word_saluti_arrivederci" },
      { it: "prego", de: "bitte / gern geschehen", emoji: "🫱", key: "word_saluti_prego" }
    ],
    sentences: [
      { it: "Buongiorno! Come sta?", de: "Guten Tag! Wie geht es Ihnen?" },
      { it: "Tutto bene, grazie.", de: "Alles gut, danke." },
      { it: "Di niente, prego.", de: "Gern geschehen, bitte schön." },
      { it: "A dopo, arrivederci!", de: "Bis später, auf Wiedersehen!" },
      { it: "Buonasera! Come sta?", de: "Guten Abend! Wie geht es Ihnen?" },
      { it: "Piacere, mi chiamo Anna.", de: "Freut mich, ich heiße Anna." },
      { it: "A domani, grazie mille!", de: "Bis morgen, vielen Dank!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["saluti", "conversazione"] },
  {
    id: "m-casa-dinti",
    level: "A1",
    title: "Haus & Dinge",
    icon: "🏠",
    scene: "Dinge im Haus beschreiben: Wo steht was, was ist neu und was ist alt — und eine Bitte zum Fenster.",
    words: [
      { it: "libro", de: "Buch", emoji: "📕" },
      { it: "tavolo", de: "Tisch", emoji: "🪵" },
      { it: "porta", de: "Tür", emoji: "🚪" },
      { it: "finestra", de: "Fenster", emoji: "🪟" },
      { it: "quadro", de: "Bild", emoji: "🖼️" },
      { it: "bello", de: "schön", emoji: "✨" },
      { it: "la sedia", de: "der Stuhl", emoji: "🪑", key: "word_casa_sedia" },
      { it: "il letto", de: "das Bett", emoji: "🛏️", key: "word_casa_letto" }
    ],
    sentences: [
      { it: "Il libro è sul tavolo.", de: "Das Buch liegt auf dem Tisch." },
      { it: "La porta è chiusa.", de: "Die Tür ist geschlossen." },
      { it: "La finestra è aperta.", de: "Das Fenster ist offen." },
      { it: "Il quadro è bellissimo.", de: "Das Bild ist wunderschön." },
      { it: "La sedia è nuova, il tavolo è vecchio.", de: "Der Stuhl ist neu, der Tisch ist alt." },
      { it: "Apri la finestra, per favore.", de: "Mach das Fenster auf, bitte." },
      { it: "Il libro è sul letto, non sul tavolo.", de: "Das Buch liegt auf dem Bett, nicht auf dem Tisch." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["casa", "aggettivi"] },
  {
    id: "m-wetter-kleid",
    level: "A1",
    title: "Wetter & Kleidung",
    icon: "🧥",
    scene: "Bei welchem Wetter ziehe ich was an? Wetter, Kleidung und Farben in einem Satz.",
    words: [
      { it: "freddo", de: "kalt", emoji: "🥶" },
      { it: "caldo", de: "warm / heiß", emoji: "🥵" },
      { it: "ombrello", de: "Regenschirm", emoji: "☂️" },
      { it: "cappotto", de: "Mantel", emoji: "🧥" },
      { it: "maglione", de: "Pullover", emoji: "🧶" },
      { it: "oggi", de: "heute", emoji: "📌" },
      { it: "la maglietta", de: "das T-Shirt", emoji: "👕", key: "word_abbigliamento_maglietta" },
      { it: "la pioggia", de: "der Regen", emoji: "🌧️", key: "word_natura_pioggia" }
    ],
    sentences: [
      { it: "Fa caldo oggi.", de: "Heute ist es heiß." },
      { it: "Domani fa freddo.", de: "Morgen wird es kalt." },
      { it: "Prendo il cappotto e l'ombrello.", de: "Ich nehme Mantel und Schirm." },
      { it: "Il maglione è molto caldo.", de: "Der Pullover ist sehr warm." },
      { it: "La pioggia è forte, resto qui.", de: "Der Regen ist stark, ich bleibe hier." },
      { it: "La maglietta è bianca e nera.", de: "Das T-Shirt ist weiß und schwarz." },
      { it: "Domani piove, resto a casa.", de: "Morgen regnet es, ich bleibe zu Hause." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["abbigliamento", "natura"] },
  {
    id: "m-zahlen-60-100",
    level: "A1",
    title: "Zahlen 60–100",
    icon: "💯",
    scene: "Große Zehner sicher lesen: Preise, Rechnungen, Alter — und eine Rechenaufgabe dazu.",
    words: [
      { it: "sessanta", de: "sechzig", emoji: "6️⃣" },
      { it: "settanta", de: "siebzig", emoji: "7️⃣" },
      { it: "ottanta", de: "achtzig", emoji: "8️⃣" },
      { it: "novanta", de: "neunzig", emoji: "9️⃣" },
      { it: "cento", de: "hundert", emoji: "💯" },
      { it: "libro", de: "Buch", emoji: "📕" },
      { it: "cinquanta", de: "fünfzig", emoji: "5️⃣", key: "word_numeri_estesi_cinquanta" },
      { it: "mille", de: "tausend", emoji: "🧮", key: "word_numeri_mille" }
    ],
    sentences: [
      { it: "Il libro costa sessanta euro.", de: "Das Buch kostet sechzig Euro." },
      { it: "Sono settanta euro.", de: "Es sind siebzig Euro." },
      { it: "L'hotel ha ottanta camere.", de: "Das Hotel hat achtzig Zimmer." },
      { it: "Il nonno ha novanta anni.", de: "Der Opa ist neunzig Jahre alt." },
      { it: "Sessanta più trenta fanno novanta.", de: "Sechzig plus dreißig gibt neunzig." },
      { it: "Devo pagare cento euro.", de: "Ich muss hundert Euro bezahlen." },
      { it: "Mille grazie, arrivederci!", de: "Tausend Dank, auf Wiedersehen!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["numeri_estesi"] },
  {
    id: "m-famiglia-domande",
    level: "A1",
    title: "Familie fragen",
    icon: "❓",
    scene: "Familienmitglieder orten und fragen: Wo ist wer — im Haus, im Garten, in der Nähe?",
    words: [
      { it: "dove", de: "wo", emoji: "❓" },
      { it: "madre", de: "Mutter", emoji: "👩" },
      { it: "padre", de: "Vater", emoji: "👨" },
      { it: "nonna", de: "Großmutter", emoji: "👵" },
      { it: "qui", de: "hier", emoji: "📍" },
      { it: "casa", de: "Haus / Zuhause", emoji: "🏠" },
      { it: "la sorella", de: "die Schwester", emoji: "👧", key: "word_famiglia_sorella" },
      { it: "il giardino", de: "der Garten", emoji: "🌻", key: "word_casa_giardino" }
    ],
    sentences: [
      { it: "Dov'è tua madre?", de: "Wo ist deine Mutter?" },
      { it: "È qui, in casa.", de: "Sie ist hier, im Haus." },
      { it: "E tuo padre?", de: "Und dein Vater?" },
      { it: "Il nonno e la nonna sono nel giardino.", de: "Opa und Oma sind im Garten." },
      { it: "Dov'è tua sorella?", de: "Wo ist deine Schwester?" },
      { it: "Il bambino è nel giardino.", de: "Der Junge ist im Garten." },
      { it: "Mio nonno abita qui vicino.", de: "Mein Opa wohnt hier in der Nähe." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["famiglia"] },
  {
    id: "m-ristorante-conto",
    level: "A1",
    title: "Restaurant & Rechnung",
    icon: "🧾",
    scene: "Vom Teller zur Rechnung: nachfragen, was das Essen kostet, und zum Abschluss einen Nachtisch.",
    words: [
      { it: "pizza", de: "Pizza", emoji: "🍕" },
      { it: "dolce", de: "Nachtisch", emoji: "🍰" },
      { it: "il conto", de: "die Rechnung", emoji: "🧾" },
      { it: "venti", de: "zwanzig", emoji: "2️⃣" },
      { it: "carta", de: "Bankkarte", emoji: "💳" },
      { it: "prego", de: "bitte schön", emoji: "🙆" },
      { it: "la birra", de: "das Bier", emoji: "🍺", key: "word_ristorante_birra" },
      { it: "la cena", de: "das Abendessen", emoji: "🍝", key: "word_ristorante_cena" }
    ],
    sentences: [
      { it: "Avete la pizza?", de: "Haben Sie Pizza?" },
      { it: "Ancora un dolce, per favore.", de: "Noch einen Nachtisch, bitte." },
      { it: "Il conto sono venti euro.", de: "Die Rechnung beträgt zwanzig Euro." },
      { it: "Posso pagare con la carta?", de: "Kann ich mit der Karte zahlen?" },
      { it: "Quanto fa il conto?", de: "Wie viel macht die Rechnung?" },
      { it: "Prendo una birra fredda.", de: "Ich nehme ein kühles Bier." },
      { it: "Dopo la cena, prendiamo il dolce.", de: "Nach dem Abendessen nehmen wir einen Nachtisch." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["ristorante", "acquisti"] },
  {
    id: "m-freizeit-tage",
    level: "A1",
    title: "Freizeit & Tage",
    icon: "🎭",
    scene: "Was machst du an welchem Tag? Kino, Bücher, Musik — die Woche gehört dir.",
    words: [
      { it: "domenica", de: "Sonntag", emoji: "⑦" },
      { it: "sabato", de: "Samstag", emoji: "⑥" },
      { it: "calcio", de: "Fußball", emoji: "⚽" },
      { it: "musica", de: "Musik", emoji: "🎵" },
      { it: "film", de: "Film", emoji: "🎥" },
      { it: "libro", de: "Buch", emoji: "📕" },
      { it: "il cinema", de: "das Kino", emoji: "🎬", key: "word_citta_cinema" },
      { it: "venerdì", de: "Freitag", emoji: "⑤", key: "word_tempo_venerdi" }
    ],
    sentences: [
      { it: "Domenica guardo un film.", de: "Sonntag schaue ich einen Film." },
      { it: "Sabato gioco a calcio.", de: "Samstag spiele ich Fußball." },
      { it: "Ascolto musica la sera.", de: "Am Abend höre ich Musik." },
      { it: "Il libro è interessante.", de: "Das Buch ist interessant." },
      { it: "Venerdì andiamo al cinema.", de: "Freitag gehen wir ins Kino." },
      { it: "Leggo un libro la sera.", de: "Abends lese ich ein Buch." },
      { it: "Domenica vado al mare.", de: "Sonntags fahre ich ans Meer." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["tempo_libero", "tempo"] },
  {
    id: "m-sport-fuori",
    level: "A1",
    title: "Sport draußen",
    icon: "🏃",
    scene: "Bewegung an der frischen Luft: laufen, Fußball spielen, mit dem Fahrrad losfahren.",
    words: [
      { it: "parco", de: "Park", emoji: "🌳" },
      { it: "spiaggia", de: "Strand", emoji: "🏖️" },
      { it: "mare", de: "Meer", emoji: "🌊" },
      { it: "calcio", de: "Fußball", emoji: "⚽" },
      { it: "fuori", de: "draußen", emoji: "🌤️" },
      { it: "oggi", de: "heute", emoji: "📌" },
      { it: "il sole", de: "die Sonne", emoji: "☀️", key: "word_natura_sole" },
      { it: "la bicicletta", de: "das Fahrrad", emoji: "🚲", key: "word_viaggio_a1_bicicletta" }
    ],
    sentences: [
      { it: "Gioco a calcio nel parco.", de: "Ich spiele im Park Fußball." },
      { it: "Cammino fino alla spiaggia.", de: "Ich gehe bis zum Strand." },
      { it: "Il mare è bellissimo oggi.", de: "Das Meer ist heute wunderschön." },
      { it: "Fuori fa bel tempo.", de: "Draußen ist schönes Wetter." },
      { it: "Corro nel parco la mattina.", de: "Ich laufe morgens im Park." },
      { it: "Il sole è caldo, il mare è bello.", de: "Die Sonne ist warm, das Meer ist schön." },
      { it: "Andiamo in bicicletta al parco.", de: "Fahren wir mit dem Fahrrad in den Park." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["natura", "tempo_libero"] },
  {
    id: "m-orientazione",
    level: "A1",
    title: "Hier & dort",
    icon: "📍",
    scene: "Orte orten: hier, dort, nah, weit — und fragen, wie man am besten dorthin kommt.",
    words: [
      { it: "qui", de: "hier", emoji: "📍" },
      { it: "lì", de: "dort", emoji: "🧭" },
      { it: "vicino", de: "nah", emoji: "🤏" },
      { it: "lontano", de: "weit", emoji: "🛰️" },
      { it: "farmacia", de: "Apotheke", emoji: "🏪" },
      { it: "bagno", de: "Toilette", emoji: "🚻" },
      { it: "il centro", de: "das Zentrum", emoji: "🏛️", key: "word_citta_centro" },
      { it: "la strada", de: "die Straße / der Weg", emoji: "🛣️", key: "word_orientamento_strada" }
    ],
    sentences: [
      { it: "La farmacia è qui vicino.", de: "Die Apotheke ist hier in der Nähe." },
      { it: "Il bagno è là.", de: "Die Toilette ist dort." },
      { it: "La stazione è lontana.", de: "Der Bahnhof ist weit." },
      { it: "Siamo vicini al centro.", de: "Wir sind nah am Zentrum." },
      { it: "Il bagno non è qui, è là.", de: "Die Toilette ist nicht hier, sondern dort." },
      { it: "Scusi, dov'è il centro?", de: "Entschuldigung, wo ist das Zentrum?" },
      { it: "Devo girare a destra?", de: "Muss ich rechts abbiegen?" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["orientamento"] },
  {
    id: "m-giorni-alltag",
    level: "A1",
    title: "Tage & Alltag",
    icon: "🗓️",
    scene: "Wochentage fest im Satz verankern: Was macht man an welchem Tag — und wann ist endlich Wochenende?",
    words: [
      { it: "lunedì", de: "Montag", emoji: "①" },
      { it: "sabato", de: "Samstag", emoji: "⑥" },
      { it: "domenica", de: "Sonntag", emoji: "⑦" },
      { it: "oggi", de: "heute", emoji: "📌" },
      { it: "domani", de: "morgen", emoji: "➡️" },
      { it: "lavoro", de: "Arbeit", emoji: "💼" },
      { it: "venerdì", de: "Freitag", emoji: "⑤", key: "word_tempo_venerdi" },
      { it: "giovedì", de: "Donnerstag", emoji: "④", key: "word_tempo_giovedi" }
    ],
    sentences: [
      { it: "Oggi è lunedì.", de: "Heute ist Montag." },
      { it: "Domani è sabato.", de: "Morgen ist Samstag." },
      { it: "Sabato non lavoro.", de: "Samstag arbeite ich nicht." },
      { it: "La domenica è il mio giorno.", de: "Der Sonntag ist mein Tag." },
      { it: "Da lunedì a venerdì lavoro.", de: "Von Montag bis Freitag arbeite ich." },
      { it: "Martedì e giovedì vado in centro.", de: "Dienstags und donnerstags fahre ich ins Zentrum." },
      { it: "Il weekend è troppo corto.", de: "Das Wochenende ist zu kurz." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["tempo"] },
  {
    id: "m-bevande",
    level: "A1",
    title: "Getränke",
    icon: "🥤",
    scene: "Trinken nach Temperatur und Geschmack: kalt oder zu heiß, und was trinkst du am liebsten?",
    words: [
      { it: "acqua", de: "Wasser", emoji: "💧" },
      { it: "latte", de: "Milch", emoji: "🥛" },
      { it: "succo", de: "Saft", emoji: "🧃" },
      { it: "birra", de: "Bier", emoji: "🍺" },
      { it: "vino", de: "Wein", emoji: "🍷" },
      { it: "freddo", de: "kalt", emoji: "🧊" },
      { it: "caffè", de: "Espresso / Kaffee", emoji: "☕" },
      { it: "bere", de: "trinken", emoji: "🥂" }
    ],
    sentences: [
      { it: "Bevo acqua fresca.", de: "Ich trinke frisches Wasser." },
      { it: "Il latte è freddo.", de: "Die Milch ist kalt." },
      { it: "Un succo, per favore.", de: "Einen Saft, bitte." },
      { it: "Il vino è buono.", de: "Der Wein ist gut." },
      { it: "Il caffè è troppo caldo.", de: "Der Espresso ist zu heiß." },
      { it: "Devo bere più acqua.", de: "Ich muss mehr Wasser trinken." },
      { it: "Un caffè e un succo, quanto fanno?", de: "Ein Espresso und ein Saft, wie viel macht das?" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["ristorante", "aggettivi"] },
  {
    id: "m-einkaufen-zahlen",
    level: "A1",
    title: "Einkaufen & Zahlen",
    icon: "🛍️",
    scene: "Preise fragen und zahlen: zu teuer? zusammen zählen? — im Geschäft alles auf Italienisch.",
    words: [
      { it: "quanto costa?", de: "wie viel kostet das?", emoji: "❓" },
      { it: "borsa", de: "Tasche", emoji: "👜" },
      { it: "cinquanta", de: "fünfzig", emoji: "5️⃣" },
      { it: "carta", de: "Bankkarte", emoji: "💳" },
      { it: "soldi", de: "Geld", emoji: "💰" },
      { it: "euro", de: "Euro", emoji: "💶" },
      { it: "caro", de: "teuer", emoji: "💸", key: "word_acquisti_caro" },
      { it: "il negozio", de: "das Geschäft", emoji: "🏬", key: "word_acquisti_negozio" }
    ],
    sentences: [
      { it: "Quanto costa questa borsa?", de: "Wie viel kostet diese Tasche?" },
      { it: "Costa cinquanta euro.", de: "Sie kostet fünfzig Euro." },
      { it: "Pago con la carta.", de: "Ich zahle mit Karte." },
      { it: "Grazie, ecco i soldi.", de: "Danke, hier ist das Geld." },
      { it: "È troppo caro!", de: "Das ist zu teuer!" },
      { it: "Posso pagare qui?", de: "Kann ich hier zahlen?" },
      { it: "Quanto costa tutto insieme?", de: "Wie viel kostet alles zusammen?" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["acquisti"] },
  {
    id: "m-casa-colori",
    level: "A1",
    title: "Haus & Farben",
    icon: "🎨",
    scene: "Möbel mit Farben beschreiben: Welche Farbe hat was — und passt das zusammen?",
    words: [
      { it: "cucina", de: "Küche", emoji: "🍳" },
      { it: "porta", de: "Tür", emoji: "🚪" },
      { it: "sedia", de: "Stuhl", emoji: "🪑" },
      { it: "bianco", de: "weiß", emoji: "⚪" },
      { it: "nero", de: "schwarz", emoji: "⚫" },
      { it: "viola", de: "lila", emoji: "🟣" },
      { it: "grigio", de: "grau", emoji: "🩶", key: "word_colori_grigio" },
      { it: "azzurro", de: "hellblau", emoji: "🩵", key: "word_colori_azzurro" }
    ],
    sentences: [
      { it: "La cucina è bianca.", de: "Die Küche ist weiß." },
      { it: "La porta è nera.", de: "Die Tür ist schwarz." },
      { it: "La sedia è viola.", de: "Der Stuhl ist lila." },
      { it: "Il tavolo è grigio.", de: "Der Tisch ist grau." },
      { it: "Che colore ha la cucina?", de: "Welche Farbe hat die Küche?" },
      { it: "Il bagno è azzurro.", de: "Das Bad ist hellblau." },
      { it: "Il quadro è viola, la porta è grigia.", de: "Das Bild ist lila, die Tür ist grau." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["casa", "colori"] },

  {
    id: "telefono", level: "A1", title: "Pronto? Al telefono", icon: "☎️",
    scene: "Telefonieren auf Italienisch: sich melden, nach einer Person fragen, eine Nachricht hinterlassen.",
    words: [
      { it: "pronto", de: "hallo (am Telefon)", emoji: "☎️" },
      { it: "il cellulare", de: "das Handy", emoji: "📱", key: "word_lavoro_cellulare" },
      { it: "chiama", de: "er/sie ruft an", emoji: "📲" },
      { it: "il numero", de: "die Nummer", emoji: "🔢", key: "word_numeri_estesi_numero" },
      { it: "occupato", de: "besetzt", emoji: "🚫", key: "word_comunicare_occupato" },
      { it: "un sms", de: "eine SMS", emoji: "✉️" },
      { it: "libero", de: "frei", emoji: "🆓", key: "word_aggettivi_a1_libero" }
    ],
    sentences: [
      { it: "Pronto? Chi parla?", de: "Hallo? Wer spricht?" },
      { it: "Sono Marco. Posso parlare con Anna?", de: "Hier ist Marco. Kann ich mit Anna sprechen?" },
      { it: "Mi dispiace, la linea è occupata.", de: "Tut mir leid, die Leitung ist besetzt." },
      { it: "Richiamami dopo, ti prego.", de: "Ruf mich später zurück, ich bitte dich." },
      { it: "Il mio numero è il tre quattro sette.", de: "Meine Nummer ist die drei vier sieben." },
      { it: "Ti scrivo un messaggio adesso.", de: "Ich schreibe dir jetzt eine Nachricht." },
      { it: "Ciao, a più tardi!", de: "Ciao, bis später!" }
    ],
    build: [1, 4, 5],
    produce: [2, 3, 6],
    covers: ["conversazione", "numeri"]
  },
  {
    id: "cucina-nonna", level: "A1", title: "In cucina con la nonna", icon: "👩‍🍳",
    scene: "Beim Kochen mit der Oma lernt man die wichtigsten Küchenwörter — und dass italienische Omas nur „buono“ kennen.",
    words: [
      { it: "la nonna", de: "die Oma", emoji: "👵", key: "word_famiglia_nonna" },
      { it: "la ricetta", de: "das Rezept", emoji: "📜" },
      { it: "il pomodoro", de: "die Tomate", emoji: "🍅", key: "word_cibo_a1_pomodoro" },
      { it: "il sale", de: "das Salz", emoji: "🧂", key: "word_ristorante_sale" },
      { it: "mescola", de: "rühre", emoji: "🥄" },
      { it: "assaggia", de: "kostet (Probieren)", emoji: "👅" },
      { it: "il gusto", de: "der Geschmack", emoji: "😋" },
      { it: "buono", de: "gut / lecker", emoji: "🤤" }
    ],
    sentences: [
      { it: "La nonna prepara la pasta.", de: "Die Oma bereitet die Pasta zu." },
      { it: "Mescola bene la salsa.", de: "Rühre die Soße gut um." },
      { it: "Assaggia: serve un po' di sale.", de: "Koste: es braucht etwas Salz." },
      { it: "Il pomodoro è molto buono.", de: "Die Tomate ist sehr lecker." },
      { it: "Aggiungi anche il formaggio.", de: "Füge auch Käse hinzu." },
      { it: "Il gusto è perfetto!", de: "Der Geschmack ist perfekt!" },
      { it: "A tavola, tutti insieme!", de: "Zu Tisch, alle zusammen!" }
    ],
    build: [0, 2, 4],
    produce: [3, 6, 1],
    covers: ["ristorante", "cibo_a1"]
  },
  {
    id: "cane-casa", level: "A1", title: "Il nostro cane Bello", icon: "🐕",
    scene: "Der Familienhund Bello erzählt (fast) selbst, wie sein Tag aussieht.",
    words: [
      { it: "il cane", de: "der Hund", emoji: "🐕", key: "word_natura_cane" },
      { it: "gioca", de: "er/sie spielt", emoji: "🎾" },
      { it: "l'osso", de: "der Knochen", emoji: "🦴" },
      { it: "felice", de: "glücklich", emoji: "😄", key: "word_aggettivi_a1_felice" },
      { it: "il parco", de: "der Park", emoji: "🌳", key: "word_citta_parco" },
      { it: "corre", de: "er/sie rennt", emoji: "💨" },
      { it: "la coda", de: "der Schwanz", emoji: "🐕‍🦺" }
    ],
    sentences: [
      { it: "Il nostro cane si chiama Bello.", de: "Unser Hund heißt Bello." },
      { it: "Gioca sempre con l'osso.", de: "Er spielt immer mit dem Knochen." },
      { it: "Corre veloce nel parco.", de: "Er rennt schnell im Park." },
      { it: "Quando è felice, muove la coda.", de: "Wenn er glücklich ist, wedelt er mit dem Schwanz." },
      { it: "I cani sono amici fedeli.", de: "Hunde sind treue Freunde." },
      { it: "La sera dorme sul suo cuscino.", de: "Abends schläft er auf seinem Kissen." },
      { it: "Chi ama gli animali ha un cuore grande.", de: "Wer Tiere liebt, hat ein großes Herz." }
    ],
    build: [1, 2, 4],
    produce: [0, 3, 6],
    covers: ["natura", "famiglia"]
  },
  {
    id: "tanti-colori", level: "A1", title: "Tanti colori", icon: "🌈",
    scene: "Farben überall: am Himmel, in der Stadt, auf der Flagge — Farben und ihre Übereinstimmung trainieren.",
    words: [
      { it: "rosso", de: "rot", emoji: "🔴" },
      { it: "blu", de: "blau", emoji: "🔵" },
      { it: "verde", de: "grün", emoji: "🟢" },
      { it: "giallo", de: "gelb", emoji: "🟡" },
      { it: "viola", de: "lila", emoji: "🟣" },
      { it: "chiaro", de: "hell", emoji: "🔆" },
      { it: "scuro", de: "dunkel", emoji: "🌑" },
      { it: "la bandiera", de: "die Flagge", emoji: "🏁" }
    ],
    sentences: [
      { it: "Che colore ha il mare? È blu.", de: "Welche Farbe hat das Meer? Es ist blau." },
      { it: "L'erba è verde.", de: "Das Gras ist grün." },
      { it: "Il sole è giallo, quasi arancione.", de: "Die Sonne ist gelb, fast orange." },
      { it: "La notte è nera.", de: "Die Nacht ist schwarz." },
      { it: "Questa maglietta è chiara, quella è scura.", de: "Dieses T-Shirt ist hell, jenes ist dunkel." },
      { it: "La bandiera italiana è verde, bianca e rossa.", de: "Die italienische Flagge ist grün, weiß und rot." },
      { it: "Che colore preferisci?", de: "Welche Farbe bevorzugst du?" }
    ],
    build: [3, 4, 5],
    produce: [0, 6, 2],
    covers: ["colori", "natura"]
  },
  {
    id: "pizzeria", level: "A1", title: "In pizzeria", icon: "🍕",
    scene: "Abendessen in der Pizzeria: bestellen, trinken, loben — die italienischeste Szene überhaupt.",
    words: [
      { it: "la pizza", de: "die Pizza", emoji: "🍕", key: "word_cibo_a1_pizza" },
      { it: "il pizzaiolo", de: "der Pizzabäcker", emoji: "👨‍🍳" },
      { it: "la focaccia", de: "die Focaccia", emoji: "🫓" },
      { it: "subito", de: "sofort", emoji: "⚡" },
      { it: "il bicchiere", de: "das Glas", emoji: "🥛", key: "word_casa_bicchiere" },
      { it: "l'acqua", de: "das Wasser", emoji: "💧", key: "word_ristorante_acqua" },
      { it: "deliziosa", de: "köstlich", emoji: "🤩" },
      { it: "il cameriere", de: "der Kellner", emoji: "🤵" }
    ],
    sentences: [
      { it: "Questa pizzeria è famosa.", de: "Diese Pizzeria ist berühmt." },
      { it: "Il pizzaiolo fa una pizza buonissima.", de: "Der Pizzabäcker macht eine köstliche Pizza." },
      { it: "Vorrei una margherita e una focaccia.", de: "Ich hätte gern eine Margherita und eine Focaccia." },
      { it: "Subito, signora!", de: "Sofort, meine Dame!" },
      { it: "Con acqua frizzante o naturale?", de: "Mit Sprudelwasser oder still?" },
      { it: "Un bicchiere grande, per favore.", de: "Ein großes Glas, bitte." },
      { it: "La pizza è deliziosa, complimenti!", de: "Die Pizza ist köstlich, Kompliment!" }
    ],
    build: [1, 4, 5],
    produce: [2, 6, 3],
    covers: ["ristorante", "persone"]
  },
  {
    id: "a-festa", level: "A1", title: "A festa!", icon: "🎉",
    scene: "Überraschungsparty für Giulia: Torte, Luftballons, Gäste — Vokabeln des Feierns in Aktion.",
    words: [
      { it: "la festa", de: "die Party", emoji: "🎊", key: "word_tempo_libero_festa" },
      { it: "la torta", de: "die Torte", emoji: "🎂" },
      { it: "i palloncini", de: "die Luftballons", emoji: "🎈" },
      { it: "il regalo", de: "das Geschenk", emoji: "🎁" },
      { it: "il compleanno", de: "der Geburtstag", emoji: "🎂", key: "word_tempo_libero_compleanno" },
      { it: "gli invitati", de: "die Gäste", emoji: "🧑‍🤝‍🧑" },
      { it: "la musica", de: "die Musik", emoji: "🎶", key: "word_tempo_libero_musica" }
    ],
    sentences: [
      { it: "Oggi è il compleanno di Giulia.", de: "Heute ist Giulias Geburtstag." },
      { it: "Facciamo una festa a sorpresa.", de: "Wir machen eine Überraschungsparty." },
      { it: "La torta ha venti candeline.", de: "Die Torte hat zwanzig Kerzen." },
      { it: "I palloncini sono rossi e gialli.", de: "Die Luftballons sind rot und gelb." },
      { it: "Il regalo è in salotto.", de: "Das Geschenk ist im Wohnzimmer." },
      { it: "Arrivano tutti gli invitati alle otto.", de: "Alle Gäste kommen um acht Uhr an." },
      { it: "Che bella festa, auguri Giulia!", de: "Was für eine schöne Party, alles Gute Giulia!" }
    ],
    build: [0, 2, 5],
    produce: [1, 4, 6],
    covers: ["tempo_libero", "famiglia"]
  },
  {
    id: "sto-bene", level: "A1", title: "Sto bene!", icon: "💪",
    scene: "Gesund leben: bewegen, trinken, schlafen — einfache Sätze für ein gutes Gefühl.",
    words: [
      { it: "sano", de: "gesund", emoji: "🥗", key: "word_salute2_sano" },
      { it: "la palestra", de: "das Fitnessstudio", emoji: "🏋️" },
      { it: "mi alleno", de: "ich trainiere", emoji: "🏃" },
      { it: "dormo", de: "ich schlafe", emoji: "😴" },
      { it: "l'acqua", de: "das Wasser", emoji: "💧", key: "word_ristorante_acqua" },
      { it: "la frutta", de: "das Obst", emoji: "🍎", key: "word_ristorante_frutta" },
      { it: "la vita", de: "das Leben", emoji: "🌱" }
    ],
    sentences: [
      { it: "Sto bene, mi sento forte.", de: "Mir geht es gut, ich fühle mich stark." },
      { it: "Mi alleno tre volte alla settimana.", de: "Ich trainiere dreimal pro Woche." },
      { it: "Bevo tanta acqua.", de: "Ich trinke viel Wasser." },
      { it: "Mangio molta frutta e verdura.", de: "Ich esse viel Obst und Gemüse." },
      { it: "Dormo otto ore ogni notte.", de: "Ich schlafe jede Nacht acht Stunden." },
      { it: "La vita sana non è difficile.", de: "Gesundes Leben ist nicht schwer." },
      { it: "Il corpo ringrazia!", de: "Der Körper dankt es dir!" }
    ],
    build: [1, 3, 4],
    produce: [2, 5, 6],
    covers: ["corpo", "aggettivi"]
  },
  {
    id: "che-tempo", level: "A1", title: "Che tempo fa?", icon: "⛅",
    scene: "Wetter-Smalltalk: Sonne, Regen, Schnee — und was man dann macht.",
    words: [
      { it: "fa", de: "es macht (Wetter)", emoji: "🌤️" },
      { it: "il sole", de: "die Sonne", emoji: "☀️", key: "word_natura_sole" },
      { it: "piove", de: "es regnet", emoji: "🌧️" },
      { it: "nevica", de: "es schneit", emoji: "❄️" },
      { it: "il vento", de: "der Wind", emoji: "💨", key: "word_natura_vento" },
      { it: "la nebbia", de: "der Nebel", emoji: "🌫️" },
      { it: "l'ombrello", de: "der Regenschirm", emoji: "☂️", key: "word_abbigliamento_ombrello" },
      { it: "che tempo fa?", de: "wie ist das Wetter?", emoji: "❓" }
    ],
    sentences: [
      { it: "Che tempo fa oggi?", de: "Wie ist das Wetter heute?" },
      { it: "Fa bello, c'è il sole.", de: "Es ist schön, die Sonne scheint." },
      { it: "In montagna nevica.", de: "In den Bergen schneit es." },
      { it: "A Roma piove, prendi l'ombrello.", de: "In Rom regnet es, nimm den Schirm." },
      { it: "Il vento è molto forte sulla spiaggia.", de: "Der Wind ist sehr stark am Strand." },
      { it: "Con la nebbia guidiamo piano.", de: "Bei Nebel fahren wir langsam." },
      { it: "In estate fa caldo, in inverno fa freddo.", de: "Im Sommer ist es heiß, im Winter kalt." }
    ],
    build: [0, 2, 4],
    produce: [1, 5, 6],
    covers: ["natura", "tempo"]
  },
  {
    id: "casa-ordine", level: "A1", title: "Tutto in ordine", icon: "🧹",
    scene: "Samstag = Putztag: aufräumen, staubwischen, Ordnung halten — Haushaltsverben in Aktion.",
    words: [
      { it: "in ordine", de: "in Ordnung / aufgeräumt", emoji: "🧺" },
      { it: "sistemo", de: "ich räume", emoji: "🧹" },
      { it: "la camera", de: "das Zimmer", emoji: "🛏️", key: "word_casa_camera" },
      { it: "il letto", de: "das Bett", emoji: "🛌", key: "word_casa_letto" },
      { it: "lo scaffale", de: "das Regal", emoji: "🗄️" },
      { it: "la polvere", de: "der Staub", emoji: "🌫️" },
      { it: "pulisco", de: "ich putze", emoji: "🧽" }
    ],
    sentences: [
      { it: "Il sabato sistemo tutta la casa.", de: "Samstags räume ich die ganze Wohnung auf." },
      { it: "Metto i libri in ordine.", de: "Ich stelle die Bücher ordentlich hin." },
      { it: "Pulisco la polvere dal tavolo.", de: "Ich wische den Staub vom Tisch." },
      { it: "La camera è ora perfetta.", de: "Das Zimmer ist jetzt perfekt." },
      { it: "Il letto è fatto?", de: "Ist das Bett gemacht?" },
      { it: "I vestiti sono nell'armadio.", de: "Die Kleidung ist im Schrank." },
      { it: "Casa pulita, vita più bella!", de: "Sauberes Haus, schöneres Leben!" }
    ],
    build: [0, 2, 4],
    produce: [1, 5, 6],
    covers: ["casa", "aggettivi"]
  },
  {
    id: "tram-milano", level: "A1", title: "In tram a Milano", icon: "🚋",
    scene: "Mit der Tram durch Mailand: Ticket ziehen, einsteigen, sitzen bleiben — Nahverkehr auf Italienisch.",
    words: [
      { it: "il tram", de: "die Straßenbahn", emoji: "🚋", key: "word_viaggio_tram" },
      { it: "Milano", de: "Mailand", emoji: "🏙️" },
      { it: "il biglietto", de: "das Ticket", emoji: "🎫", key: "word_viaggio_biglietto" },
      { it: "la fermata", de: "die Haltestelle", emoji: "🚏", key: "word_viaggio_fermata" },
      { it: "la gente", de: "die Leute", emoji: "👥" },
      { it: "pieno", de: "voll", emoji: "🧳" },
      { it: "lento", de: "langsam", emoji: "🐌" }
    ],
    sentences: [
      { it: "Milano è una città grande.", de: "Mailand ist eine große Stadt." },
      { it: "Il tram numero due va in centro.", de: "Die Linie zwei fährt ins Zentrum." },
      { it: "Il biglietto si compra alla macchinetta.", de: "Das Ticket kauft man am Automaten." },
      { it: "Alla fermata aspettano molte persone.", de: "An der Haltestelle warten viele Leute." },
      { it: "Il tram è pieno ma veloce.", de: "Die Tram ist voll, aber schnell." },
      { it: "Con l'automobile si va lentamente.", de: "Mit dem Auto fährt man langsam." },
      { it: "Il tram è economico e comodo.", de: "Die Tram ist günstig und bequem." }
    ],
    build: [1, 4, 6],
    produce: [2, 3, 5],
    covers: ["viaggio", "citta"]
  },
  {
    id: "lei-o-tu", level: "A1", title: "Lei o tu?", icon: "🙋",
    scene: "Wann sage ich „ciao“ und wann „buongiorno“? Höflichkeitsformen verstehen und richtig wählen.",
    words: [
      { it: "Lei", de: "Sie (höflich)", emoji: "🎩", key: "word_persone_lei_cortesia" },
      { it: "tu", de: "du", emoji: "🙋" },
      { it: "scusi", de: "entschuldigen Sie", emoji: "🙇" },
      { it: "prego", de: "bitte schön", emoji: "🙆" },
      { it: "arrivederci", de: "auf Wiedersehen", emoji: "👋" },
      { it: "ciao", de: "hallo / tschüss", emoji: "🤙" },
      { it: "la forma", de: "die Form (der Anrede)", emoji: "📐" }
    ],
    sentences: [
      { it: "Con gli amici diciamo ciao.", de: "Mit Freunden sagen wir ciao." },
      { it: "Con il medico diciamo buongiorno e Lei.", de: "Zum Arzt sagen wir buongiorno und Sie." },
      { it: "Scusi, può aiutarmi?", de: "Entschuldigung, können Sie mir helfen?" },
      { it: "Ciao! Come stai?", de: "Hallo! Wie geht es dir?" },
      { it: "Prego, si accomodi.", de: "Bitte schön, nehmen Sie Platz." },
      { it: "Arrivederci e grazie!", de: "Auf Wiedersehen und danke!" },
      { it: "Tu o Lei? Dipende dalla persona.", de: "Du oder Sie? Es kommt auf die Person an." }
    ],
    build: [0, 2, 4],
    produce: [1, 5, 6],
    covers: ["saluti", "persone"]
  },
  {
    id: "da-uno-a-dieci", level: "A1", title: "Da uno a dieci", icon: "🔟",
    scene: "Zahlen festigen: zählen, rechnen, würfeln — Zahlen bis zehn in Bewegung.",
    words: [
      { it: "uno", de: "eins", emoji: "1️⃣" },
      { it: "tre", de: "drei", emoji: "3️⃣" },
      { it: "cinque", de: "fünf", emoji: "5️⃣" },
      { it: "sette", de: "sieben", emoji: "7️⃣" },
      { it: "nove", de: "neun", emoji: "9️⃣" },
      { it: "dieci", de: "zehn", emoji: "🔟" },
      { it: "il dado", de: "der Würfel", emoji: "🎲" },
      { it: "la mano", de: "die Hand", emoji: "🖐️", key: "word_corpo_mano" }
    ],
    sentences: [
      { it: "Contiamo da uno a dieci.", de: "Wir zählen von eins bis zehn." },
      { it: "Una mano ha cinque dita.", de: "Eine Hand hat fünf Finger." },
      { it: "Due più due fanno quattro.", de: "Zwei plus zwei macht vier." },
      { it: "Compro tre mele e cinque pere.", de: "Ich kaufe drei Äpfel und fünf Birnen." },
      { it: "Il dado mostra il numero sei.", de: "Der Würfel zeigt die Zahl sechs." },
      { it: "Nove, otto, sette… via!", de: "Neun, acht, sieben… los!" },
      { it: "Dieci dita, dieci piedi.", de: "Zehn Finger, zehn Zehen." }
    ],
    build: [0, 3, 5],
    produce: [2, 4, 6],
    covers: ["numeri", "corpo"]
  },
  {
    id: "posso-vuoi", level: "A1", title: "Io posso, tu vuoi", icon: "🔑",
    scene: "Modalverben: wollen, können, müssen — damit sagst du, was du willst und was geht.",
    words: [
      { it: "voglio", de: "ich will", emoji: "💪" },
      { it: "puoi", de: "du kannst", emoji: "🙌" },
      { it: "devo", de: "ich muss", emoji: "⏰" },
      { it: "possiamo", de: "wir können", emoji: "🤝" },
      { it: "va bene", de: "in Ordnung", emoji: "👌" },
      { it: "adesso", de: "jetzt", emoji: "⏱️" },
      { it: "domani", de: "morgen", emoji: "➡️" }
    ],
    sentences: [
      { it: "Voglio imparare l'italiano.", de: "Ich will Italienisch lernen." },
      { it: "Puoi parlare più lentamente?", de: "Kannst du langsamer sprechen?" },
      { it: "Devo andare a casa ora.", de: "Ich muss jetzt nach Hause." },
      { it: "Possiamo incontrarci domani.", de: "Wir können uns morgen treffen." },
      { it: "Va bene, a che ora?", de: "In Ordnung, um wie viel Uhr?" },
      { it: "Adesso devo studiare.", de: "Jetzt muss ich lernen." },
      { it: "Se vuoi, mangiamo insieme.", de: "Wenn du willst, essen wir zusammen." }
    ],
    build: [0, 3, 4],
    produce: [1, 5, 6],
    covers: ["tempo", "persone"]
  },
  {
    id: "non-mai", level: "A1", title: "Non… mai!", icon: "🚫",
    scene: "Negation in allen Varianten: non, mai, niente, nessuno — höflich Nein sagen.",
    words: [
      { it: "non capisco", de: "ich verstehe nicht", emoji: "🤷" },
      { it: "mai", de: "nie", emoji: "🚫" },
      { it: "niente", de: "nichts", emoji: "∅" },
      { it: "nessuno", de: "niemand / kein", emoji: "🙅" },
      { it: "non lo so", de: "ich weiß es nicht", emoji: "💭" },
      { it: "per niente", de: "gar nicht", emoji: "❎" }
    ],
    sentences: [
      { it: "Non capisco, può ripetere?", de: "Ich verstehe nicht, können Sie wiederholen?" },
      { it: "Non mangio mai la carne a colazione.", de: "Ich esse nie Fleisch zum Frühstück." },
      { it: "Non c'è niente nel frigo.", de: "Im Kühlschrank ist nichts." },
      { it: "Non c'è nessuno a casa.", de: "Zu Hause ist niemand." },
      { it: "Non lo so, scusa.", de: "Ich weiß es nicht, sorry." },
      { it: "Mai dire mai!", de: "Sage nie nie!" },
      { it: "Niente panico, andiamo piano.", de: "Keine Panik, wir gehen langsam." }
    ],
    build: [0, 3, 4],
    produce: [1, 2, 6],
    covers: ["parole_funzione", "conversazione"]
  },
  {
    id: "arrivederci-grazie", level: "A1", title: "Arrivederci e grazie", icon: "👋",
    scene: "Sich verabschieden wie ein Italiener: fünf Varianten für jeden Anlass.",
    words: [
      { it: "arrivederci", de: "auf Wiedersehen", emoji: "👋" },
      { it: "buonasera", de: "guten Abend", emoji: "🌆" },
      { it: "buonanotte", de: "gute Nacht", emoji: "🌙" },
      { it: "a dopo", de: "bis später", emoji: "🔁" },
      { it: "permesso", de: "darf ich?", emoji: "🚪" },
      { it: "di niente", de: "gern geschehen", emoji: "🙆" },
      { it: "grazie mille", de: "vielen Dank", emoji: "🙏" }
    ],
    sentences: [
      { it: "Buonasera a tutti!", de: "Guten Abend zusammen!" },
      { it: "Permesso, posso passare?", de: "Erlaubnis — darf ich durch?" },
      { it: "Grazie mille per la cena.", de: "Vielen Dank für das Abendessen." },
      { it: "Di niente, è stato un piacere.", de: "Gern geschehen, es war ein Vergnügen." },
      { it: "È tardi, devo andare.", de: "Es ist spät, ich muss gehen." },
      { it: "Buonanotte e sogni d'oro.", de: "Gute Nacht und träum süß." },
      { it: "A dopo, arrivederci!", de: "Bis später, auf Wiedersehen!" }
    ],
    build: [0, 2, 5],
    produce: [1, 3, 6],
    covers: ["saluti", "conversazione"]
  },

  {
    id: "m2-verbi-cibo",
    level: "A1",
    title: "Verbi & Cibo",
    icon: "🍝",
    scene: "Essen und Zeiten kombinieren: Wann isst du was — und was machst du bei Hunger?",
    words: [
      { it: "pane", de: "Brot", emoji: "🍞" },
      { it: "vino", de: "Wein", emoji: "🍷" },
      { it: "formaggio", de: "Käse", emoji: "🧀" },
      { it: "cena", de: "Abendessen", emoji: "🍽️" },
      { it: "fame", de: "Hunger", emoji: "🫗" },
      { it: "pranzo", de: "Mittagessen", emoji: "🍱" },
      { it: "mangiare", de: "essen", emoji: "🍴" },
      { it: "il dolce", de: "der Nachtisch", emoji: "🍰", key: "word_ristorante_dolce" }
    ],
    sentences: [
      { it: "A cena mangio il pane con il formaggio.", de: "Zum Abendessen esse ich Brot mit Käse." },
      { it: "Ho fame, pranzo subito.", de: "Ich habe Hunger, ich esse sofort zu Mittag." },
      { it: "Il pranzo è pronto.", de: "Das Mittagessen ist fertig." },
      { it: "Bevo vino solo a cena.", de: "Ich trinke Wein nur zum Abendessen." },
      { it: "Mangio bene, bevo poco.", de: "Ich esse gut, ich trinke wenig." },
      { it: "La cena è alle nove.", de: "Das Abendessen ist um neun Uhr." },
      { it: "Ho ancora fame, mangio un dolce.", de: "Ich habe noch Hunger, ich esse einen Nachtisch." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["ristorante"] },
  {
    id: "m2-giorni-ore",
    level: "A1",
    title: "Giorni & Ore",
    icon: "🕰️",
    scene: "Tage und Uhrzeiten verbinden: Wann wachst du auf, wann schläfst du — und wann ist es zu spät?",
    words: [
      { it: "lunedì", de: "Montag", emoji: "①" },
      { it: "sabato", de: "Samstag", emoji: "⑥" },
      { it: "ora", de: "Stunde / Uhrzeit", emoji: "🕒" },
      { it: "mezzogiorno", de: "Mittag", emoji: "🕛" },
      { it: "presto", de: "früh", emoji: "🌅" },
      { it: "tardi", de: "spät", emoji: "🌙" },
      { it: "la mattina", de: "der Morgen", emoji: "🌄", key: "word_calendario_mattina" },
      { it: "mezzanotte", de: "Mitternacht", emoji: "🌌", key: "word_calendario_mezzanotte" }
    ],
    sentences: [
      { it: "Lunedì mi sveglio presto.", de: "Montag wache ich früh auf." },
      { it: "Il sabato pranzo a mezzogiorno.", de: "Samstags esse ich um zwölf zu Mittag." },
      { it: "Che ora è? È tardi.", de: "Wie viel Uhr ist es? Es ist spät." },
      { it: "Stasera resto a casa.", de: "Heute Abend bleibe ich zu Hause." },
      { it: "La domenica dormo fino a tardi.", de: "Sonntags schlafe ich bis spät." },
      { it: "La mattina ho sempre fame.", de: "Morgens habe ich immer Hunger." },
      { it: "Domani mi alzo presto, alle sei.", de: "Morgen stehe ich früh auf, um sechs." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["tempo", "uhrzeit"] },
  {
    id: "m2-colori-vestiti",
    level: "A1",
    title: "Colori & Vestiti",
    icon: "👕",
    scene: "Farben auf Kleidung: Was trägst du gern — und welche Farbe ist deine Lieblingsfarbe?",
    words: [
      { it: "maglietta", de: "T-Shirt", emoji: "👕" },
      { it: "pantaloni", de: "Hose", emoji: "👖" },
      { it: "cappotto", de: "Mantel", emoji: "🧥" },
      { it: "rosso", de: "rot", emoji: "🔴" },
      { it: "blu", de: "blau", emoji: "🔵" },
      { it: "nero", de: "schwarz", emoji: "⚫" },
      { it: "la giacca", de: "die Jacke", emoji: "🧥", key: "word_abbigliamento_giacca" },
      { it: "verde", de: "grün", emoji: "🟢", key: "word_colori_verde" }
    ],
    sentences: [
      { it: "La maglietta è rossa.", de: "Das T-Shirt ist rot." },
      { it: "I pantaloni sono blu.", de: "Die Hose ist blau." },
      { it: "Il cappotto è nero.", de: "Der Mantel ist schwarz." },
      { it: "Che colore hai scelto?", de: "Welche Farbe hast du gewählt?" },
      { it: "La giacca è verde.", de: "Die Jacke ist grün." },
      { it: "Ho un maglione giallo.", de: "Ich habe einen gelben Pullover." },
      { it: "Il mio colore preferito è il blu.", de: "Meine Lieblingsfarbe ist Blau." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["abbigliamento", "colori"] },
  {
    id: "m2-animali-numeri",
    level: "A1",
    title: "Animali & Numeri",
    icon: "🐴",
    scene: "Tiere zählen: Wie viele Schmetterlinge fliegen, wie viele Vögel singen — und wie alt ist der Hund?",
    words: [
      { it: "cavallo", de: "Pferd", emoji: "🐴" },
      { it: "uccello", de: "Vogel", emoji: "🐦" },
      { it: "farfalla", de: "Schmetterling", emoji: "🦋" },
      { it: "due", de: "zwei", emoji: "2️⃣" },
      { it: "sette", de: "sieben", emoji: "7️⃣" },
      { it: "dieci", de: "zehn", emoji: "🔟" },
      { it: "il cane", de: "der Hund", emoji: "🐕", key: "word_natura_cane" },
      { it: "il gatto", de: "die Katze", emoji: "🐈", key: "word_natura_gatto" }
    ],
    sentences: [
      { it: "Nel prato ci sono due cavalli.", de: "Auf der Wiese gibt es zwei Pferde." },
      { it: "L'uccello canta alle sette.", de: "Der Vogel singt um sieben." },
      { it: "Una farfalla, due farfalle.", de: "Ein Schmetterling, zwei Schmetterlinge." },
      { it: "Contiamo gli animali: uno, due, dieci!", de: "Wir zählen die Tiere: eins, zwei, zehn!" },
      { it: "Il cane e il gatto dormono.", de: "Hund und Katze schlafen." },
      { it: "Ho quattro farfalle e sette uccelli.", de: "Ich habe vier Schmetterlinge und sieben Vögel." },
      { it: "Quanti anni ha il tuo cane?", de: "Wie alt ist dein Hund?" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["animali", "numeri"] },
  {
    id: "m2-casa-oggetti",
    level: "A1",
    title: "In casa",
    icon: "🏠",
    scene: "Dinge im Haus orten: Wo steht der Teller, wo liegt das Glas — und wohin mit dem Bett?",
    words: [
      { it: "cucina", de: "Küche", emoji: "🍳" },
      { it: "tavolo", de: "Tisch", emoji: "🪵" },
      { it: "sedia", de: "Stuhl", emoji: "🪑" },
      { it: "porta", de: "Tür", emoji: "🚪" },
      { it: "finestra", de: "Fenster", emoji: "🪟" },
      { it: "bicchiere", de: "Glas", emoji: "🥃" },
      { it: "il letto", de: "das Bett", emoji: "🛏️", key: "word_casa_letto" },
      { it: "l'armadio", de: "der Schrank", emoji: "🗄️", key: "word_casa_armadio" }
    ],
    sentences: [
      { it: "In cucina c'è un tavolo.", de: "In der Küche gibt es einen Tisch." },
      { it: "La sedia è vicino alla finestra.", de: "Der Stuhl ist neben dem Fenster." },
      { it: "Chiudi la porta, per favore.", de: "Schließ bitte die Tür." },
      { it: "Portami un bicchiere, ti prego.", de: "Bring mir bitte ein Glas." },
      { it: "I piatti sono in cucina.", de: "Die Teller sind in der Küche." },
      { it: "Il bicchiere è nell'armadio.", de: "Das Glas ist im Schrank." },
      { it: "Il letto è nella stanza.", de: "Das Bett ist im Zimmer." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["casa"] },
  {
    id: "m2-saluti-form",
    level: "A1",
    title: "Buongiorno o Ciao?",
    icon: "🤝",
    scene: "Höflich oder locker? Formelle Anrede und du-Form im direkten Vergleich — von Buongiorno bis Buonanotte.",
    words: [
      { it: "buongiorno", de: "guten Tag", emoji: "🌅" },
      { it: "buonasera", de: "guten Abend", emoji: "🌆" },
      { it: "ciao", de: "hallo / tschüss", emoji: "🤙" },
      { it: "arrivederci", de: "auf Wiedersehen", emoji: "👋" },
      { it: "scusi", de: "entschuldigen Sie", emoji: "🙇" },
      { it: "prego", de: "bitte schön", emoji: "🙆" },
      { it: "buonanotte", de: "gute Nacht", emoji: "🌙", key: "word_saluti_buonanotte" },
      { it: "come va?", de: "wie geht's?", emoji: "🙂" }
    ],
    sentences: [
      { it: "Buongiorno, dottoressa!", de: "Guten Tag, Frau Doktor!" },
      { it: "Ciao, che piacere vederti!", de: "Hallo, schön dich zu sehen!" },
      { it: "Scusi, è libero questo posto?", de: "Entschuldigung, ist dieser Platz frei?" },
      { it: "Prego, si sieda.", de: "Bitte, setzen Sie sich." },
      { it: "Ciao Anna, come va?", de: "Hallo Anna, wie geht's?" },
      { it: "Buonanotte, dormi bene!", de: "Gute Nacht, schlaf gut!" },
      { it: "Prego, entri!", de: "Bitte, kommen Sie herein!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["saluti"] },
  {
    id: "m2-numeri-prezzi",
    level: "A1",
    title: "Prezzi & Numeri",
    icon: "💶",
    scene: "Preise laut denken: fragen, staunen, handeln — Zahlen im Kaufalltag.",
    words: [
      { it: "euro", de: "Euro", emoji: "💶" },
      { it: "venti", de: "zwanzig", emoji: "2️⃣" },
      { it: "trenta", de: "dreißig", emoji: "3️⃣" },
      { it: "cento", de: "hundert", emoji: "💯" },
      { it: "quanto costa?", de: "wie viel kostet das?", emoji: "❓" },
      { it: "caro", de: "teuer", emoji: "💸" },
      { it: "quaranta", de: "vierzig", emoji: "4️⃣", key: "word_numeri_estesi_quaranta" },
      { it: "cinquanta", de: "fünfzig", emoji: "5️⃣", key: "word_numeri_estesi_cinquanta" }
    ],
    sentences: [
      { it: "Quanto costa? Venti euro.", de: "Wie viel kostet es? Zwanzig Euro." },
      { it: "Trenta euro? È caro!", de: "Dreißig Euro? Das ist teuer!" },
      { it: "Cento euro per un libro?", de: "Hundert Euro für ein Buch?" },
      { it: "Alla fine pago cinquanta euro.", de: "Am Ende zahle ich fünfzig Euro." },
      { it: "Quaranta euro? Va bene.", de: "Vierzig Euro? In Ordnung." },
      { it: "Il prezzo è buono, prendo due.", de: "Der Preis ist gut, ich nehme zwei." },
      { it: "Un euro per l'acqua, due per il vino.", de: "Ein Euro fürs Wasser, zwei für den Wein." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["acquisti", "numeri"] },
  {
    id: "m2-famiglia-casa",
    level: "A1",
    title: "Famiglia a casa",
    icon: "👨‍👩‍👦",
    scene: "Familie im Haus verteilt: Wer ist wo — und wie verwandt ist wer mit wem?",
    words: [
      { it: "madre", de: "Mutter", emoji: "👩" },
      { it: "padre", de: "Vater", emoji: "👨" },
      { it: "fratello", de: "Bruder", emoji: "🧑" },
      { it: "casa", de: "Haus", emoji: "🏠" },
      { it: "cucina", de: "Küche", emoji: "🍳" },
      { it: "giardino", de: "Garten", emoji: "🌿" },
      { it: "la sorella", de: "die Schwester", emoji: "👧", key: "word_famiglia_sorella" },
      { it: "il nonno", de: "der Großvater", emoji: "👴", key: "word_famiglia_nonno" }
    ],
    sentences: [
      { it: "Mia madre è in cucina.", de: "Meine Mutter ist in der Küche." },
      { it: "Mio padre lavora in giardino.", de: "Mein Vater arbeitet im Garten." },
      { it: "Il fratello sta a casa.", de: "Der Bruder bleibt zu Hause." },
      { it: "Siamo tutti a tavola!", de: "Wir sind alle am Tisch!" },
      { it: "Mia sorella abita con noi.", de: "Meine Schwester wohnt bei uns." },
      { it: "La sorella di mio padre è mia zia.", de: "Die Schwester meines Vaters ist meine Tante." },
      { it: "Anche il gatto è a tavola!", de: "Auch die Katze sitzt am Tisch!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["famiglia", "casa"] },
  {
    id: "m2-citta-orient",
    level: "A1",
    title: "Orientamento",
    icon: "🧭",
    scene: "In der Stadt navigieren: links, rechts, geradeaus — und wie viele Gehminuten bis zum Zentrum?",
    words: [
      { it: "centro", de: "Zentrum", emoji: "🏛️" },
      { it: "piazza", de: "Platz", emoji: "⛲" },
      { it: "stazione", de: "Bahnhof", emoji: "🚉" },
      { it: "vicino", de: "nah", emoji: "📍" },
      { it: "a destra", de: "rechts", emoji: "➡️" },
      { it: "dritto", de: "geradeaus", emoji: "⬆️" },
      { it: "a sinistra", de: "links", emoji: "⬅️", key: "word_orientamento_a_sinistra" },
      { it: "la chiesa", de: "die Kirche", emoji: "⛪", key: "word_citta_chiesa" }
    ],
    sentences: [
      { it: "Il centro è vicino?", de: "Ist das Zentrum nah?" },
      { it: "Alla piazza vai sempre dritto.", de: "Zum Platz gehst du immer geradeaus." },
      { it: "La stazione è a destra.", de: "Der Bahnhof ist rechts." },
      { it: "Siamo vicini, due minuti.", de: "Wir sind nah dran, zwei Minuten." },
      { it: "Gira a sinistra alla chiesa.", de: "Bieg an der Kirche links ab." },
      { it: "Dov'è la stazione? A destra o a sinistra?", de: "Wo ist der Bahnhof? Rechts oder links?" },
      { it: "Il centro è a dieci minuti a piedi.", de: "Das Zentrum ist zehn Gehminuten entfernt." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["citta", "orientamento"] },
  {
    id: "m2-tempo-lib",
    level: "A1",
    title: "Hobby & amici",
    icon: "⚽",
    scene: "Freizeit mit Freunden: Kino, Musik, Fußball — was macht Freude, und was macht man sonntags?",
    words: [
      { it: "calcio", de: "Fußball", emoji: "⚽" },
      { it: "musica", de: "Musik", emoji: "🎵" },
      { it: "film", de: "Film", emoji: "🎥" },
      { it: "festa", de: "Party", emoji: "🎉" },
      { it: "amico", de: "Freund", emoji: "🧑‍🤝‍🧑" },
      { it: "libro", de: "Buch", emoji: "📕" },
      { it: "il cinema", de: "das Kino", emoji: "🎬", key: "word_citta_cinema" },
      { it: "leggere", de: "lesen", emoji: "📖" }
    ],
    sentences: [
      { it: "Gioco a calcio con gli amici.", de: "Ich spiele mit Freunden Fußball." },
      { it: "Ascolto musica ogni sera.", de: "Ich höre jeden Abend Musik." },
      { it: "Il film è divertente.", de: "Der Film ist lustig." },
      { it: "Il mio amico ama leggere un libro.", de: "Mein Freund liest gern ein Buch." },
      { it: "Al cinema con gli amici!", de: "Ins Kino mit Freunden!" },
      { it: "La musica mi piace molto.", de: "Musik gefällt mir sehr." },
      { it: "Domenica faccio una festa a casa.", de: "Sonntags feiere ich ein Fest zu Hause." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["tempo_libero"]
  },
  {
    id: "m2-corpo-dolore",
    level: "A1",
    title: "Klein weh",
    icon: "🩹",
    scene: "Kleine Wehwehchen benennen: Kopf, Hals, Fieber — und der Weg zur Apotheke.",
    words: [
      { it: "testa", de: "Kopf", emoji: "🤕" },
      { it: "gola", de: "Hals", emoji: "🗣️" },
      { it: "dolore", de: "Schmerz", emoji: "🤒" },
      { it: "medicina", de: "Medikament", emoji: "💊" },
      { it: "medico", de: "Arzt", emoji: "👨‍⚕️" },
      { it: "la febbre", de: "Fieber", emoji: "🌡️" },
      { it: "la farmacia", de: "Apotheke", emoji: "🏪", key: "word_emergenza_farmacia" },
      { it: "il letto", de: "das Bett", emoji: "🛏️", key: "word_casa_letto" }
    ],
    sentences: [
      { it: "Ho mal di testa.", de: "Ich habe Kopfschmerzen." },
      { it: "La gola fa male.", de: "Der Hals tut weh." },
      { it: "Il medico dà la medicina.", de: "Der Arzt gibt das Medikament." },
      { it: "Niente febbre, tutto ok!", de: "Kein Fieber, alles okay!" },
      { it: "Ho mal di gola e mal di testa.", de: "Ich habe Halsschmerzen und Kopfschmerzen." },
      { it: "Devo andare in farmacia.", de: "Ich muss in die Apotheke." },
      { it: "Prendo la medicina e vado a letto.", de: "Ich nehme das Medikament und gehe ins Bett." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["corpo", "emergenza"] },
  {
    id: "m2-mangiare-ora",
    level: "A1",
    title: "Essenszeiten",
    icon: "🍱",
    scene: "Wann isst man was? Frühstück, Mittag, Abend — der Tag hat seinen eigenen Speiseplan.",
    words: [
      { it: "colazione", de: "Frühstück", emoji: "🥐" },
      { it: "pranzo", de: "Mittagessen", emoji: "🍱" },
      { it: "cena", de: "Abendessen", emoji: "🍽️" },
      { it: "mattina", de: "Morgen", emoji: "🌅" },
      { it: "sera", de: "Abend", emoji: "🌆" },
      { it: "notte", de: "Nacht", emoji: "🌙" },
      { it: "mezzogiorno", de: "Mittag", emoji: "🕛", key: "word_calendario_mezzogiorno" },
      { it: "poi", de: "dann / danach", emoji: "⏭️", key: "word_avverbi_a1_poi" }
    ],
    sentences: [
      { it: "La colazione è la mattina.", de: "Das Frühstück ist am Morgen." },
      { it: "Il pranzo è a mezzogiorno.", de: "Das Mittagessen ist am Mittag." },
      { it: "La cena è la sera.", de: "Das Abendessen ist am Abend." },
      { it: "Di notte dormo.", de: "In der Nacht schlafe ich." },
      { it: "Prima la colazione, poi il lavoro.", de: "Zuerst das Frühstück, dann die Arbeit." },
      { it: "Alle dieci prendo un caffè.", de: "Um zehn trinke ich einen Espresso." },
      { it: "Dopo cena guardo un film.", de: "Nach dem Abendessen schaue ich einen Film." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["ristorante", "calendario"] },
  {
    id: "m2-viaggio-mezzi",
    level: "A1",
    title: "Unterwegs",
    icon: "🚆",
    scene: "Alle Verkehrsmittel einmal: Zug, Bus, Flugzeug — und womit fährst du zum Meer?",
    words: [
      { it: "treno", de: "Zug", emoji: "🚂" },
      { it: "autobus", de: "Bus", emoji: "🚌" },
      { it: "aereo", de: "Flugzeug", emoji: "✈️" },
      { it: "a piedi", de: "zu Fuß", emoji: "🚶" },
      { it: "macchina", de: "Auto", emoji: "🚗" },
      { it: "bicicletta", de: "Fahrrad", emoji: "🚲" },
      { it: "l'aeroporto", de: "der Flughafen", emoji: "🛫", key: "word_viaggio_aeroporto" },
      { it: "taxi", de: "Taxi", emoji: "🚕", key: "word_viaggio_taxi" }
    ],
    sentences: [
      { it: "Vado in treno.", de: "Ich fahre mit dem Zug." },
      { it: "L'aereo vola alto.", de: "Das Flugzeug fliegt hoch." },
      { it: "Vado al lavoro a piedi.", de: "Ich gehe zu Fuß zur Arbeit." },
      { it: "La macchina è in garage.", de: "Das Auto ist in der Garage." },
      { it: "L'aereo parte alle sette.", de: "Das Flugzeug fliegt um sieben Uhr ab." },
      { it: "In autobus o in bicicletta?", de: "Mit dem Bus oder mit dem Fahrrad?" },
      { it: "Vado al mare in macchina.", de: "Ich fahre mit dem Auto ans Meer." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["viaggio"] },
  {
    id: "m2-frutta-verdura",
    level: "A1",
    title: "Frutta & Verdura",
    icon: "🍅",
    scene: "Gesund essen: Was kaufst du auf dem Markt, und was kommt auf den Teller?",
    words: [
      { it: "frutta", de: "Obst", emoji: "🍎" },
      { it: "verdura", de: "Gemüse", emoji: "🥦" },
      { it: "pomodoro", de: "Tomate", emoji: "🍅" },
      { it: "uovo", de: "Ei", emoji: "🥚" },
      { it: "riso", de: "Reis", emoji: "🍚" },
      { it: "pane", de: "Brot", emoji: "🍞" },
      { it: "l'insalata", de: "der Salat", emoji: "🥗", key: "word_cibo_a1_insalata" },
      { it: "comprare", de: "kaufen", emoji: "🛒" }
    ],
    sentences: [
      { it: "Mangio frutta ogni giorno.", de: "Ich esse jeden Tag Obst." },
      { it: "La verdura è fresca.", de: "Das Gemüse ist frisch." },
      { it: "Un uovo al pomodoro.", de: "Ein Ei mit Tomate." },
      { it: "Il pane è di casa.", de: "Das Brot ist selbstgemacht." },
      { it: "Compro le mele al mercato.", de: "Ich kaufe Äpfel auf dem Markt." },
      { it: "L'insalata con pomodori è fresca.", de: "Der Salat mit Tomaten ist frisch." },
      { it: "Il riso con le verdure è buono.", de: "Reis mit Gemüse ist lecker." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["cibo_a1", "ristorante"] },
  {
    id: "m2-negazioni",
    level: "A1",
    title: "Nein sagen",
    icon: "🚫",
    scene: "Höflich ablehnen: nein danke, nicht möglich, nie ohne Kaffee — Negation im Alltag.",
    words: [
      { it: "mai", de: "nie", emoji: "🚫" },
      { it: "niente", de: "nichts", emoji: "∅" },
      { it: "non capisco", de: "ich verstehe nicht", emoji: "🤷" },
      { it: "no", de: "nein", emoji: "❌" },
      { it: "sì", de: "ja", emoji: "✅" },
      { it: "grazie", de: "danke", emoji: "🙏" },
      { it: "nessuno", de: "niemand / kein", emoji: "🙅", key: "word_parole_funzione_nessuno" },
      { it: "non posso", de: "ich kann nicht", emoji: "⛔" }
    ],
    sentences: [
      { it: "No, grazie, niente altro.", de: "Nein danke, nichts mehr." },
      { it: "Sì, senza problema.", de: "Ja, ohne Problem." },
      { it: "Non capisco, mi scusi.", de: "Ich verstehe nicht, entschuldigen Sie." },
      { it: "Mai senza il mio caffè!", de: "Niemals ohne meinen Kaffee!" },
      { it: "Non posso oggi, domani sì!", de: "Heute kann ich nicht, morgen ja!" },
      { it: "Niente vino per me, grazie.", de: "Kein Wein für mich, danke." },
      { it: "Non è possibile!", de: "Das ist nicht möglich!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["parole_funzione", "saluti"] },
  {
    id: "m2-numeri-ord",
    level: "A1",
    title: "Erste, zweite…",
    icon: "🥇",
    scene: "Ordnungszahlen im Leben: der erste Mai, der fünfte Stock — und wann fährt der letzte Bus?",
    words: [
      { it: "primo", de: "erste(r/s)", emoji: "🥇" },
      { it: "secondo", de: "zweite(r/s)", emoji: "🥈" },
      { it: "terzo", de: "dritte(r/s)", emoji: "🥉" },
      { it: "quarto", de: "vierte(r/s)", emoji: "4️⃣" },
      { it: "numero", de: "Nummer", emoji: "🔢" },
      { it: "paio", de: "Paar", emoji: "👯" },
      { it: "quinto", de: "fünfte(r/s)", emoji: "5️⃣" },
      { it: "ultimo", de: "letzte(r/s)", emoji: "🔚" }
    ],
    sentences: [
      { it: "Il primo giro è mio.", de: "Die erste Runde geht auf mich." },
      { it: "Sei secondo! Complimenti.", de: "Du bist Zweiter! Glückwunsch." },
      { it: "Il terzo piano ha vista mare.", de: "Der dritte Stock hat Meerblick." },
      { it: "Un paio di scarpe, per favore.", de: "Ein Paar Schuhe, bitte." },
      { it: "Vivo al quinto piano.", de: "Ich wohne im fünften Stock." },
      { it: "Il primo maggio è una festa.", de: "Der erste Mai ist ein Feiertag." },
      { it: "L'ultimo autobus parte alle dieci.", de: "Der letzte Bus fährt um zehn Uhr ab." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["numeri_estesi"]
  },
  { id: "m2-meteo-vocab", level: "A1", mini: true, title: "Mini: Sole & ombrello", icon: "☂️", scene: "Wetter und Folgen.",
    words: [{ it: "sole", de: "Sonne", emoji: "☀️" }, { it: "pioggia", de: "Regen", emoji: "🌧️" }, { it: "nuvola", de: "Wolke", emoji: "☁️" }, { it: "ombrello", de: "Regenschirm", emoji: "☂️" }, { it: "caldo", de: "warm", emoji: "🥵" }, { it: "freddo", de: "kalt", emoji: "🥶" }],
    sentences: [
      { it: "Il sole scalda la spiaggia.", de: "Die Sonne wärmt den Strand." },
      { it: "La pioggia bagna la strada.", de: "Der Regen macht die Straße nass." },
      { it: "Una nuvola grande e grigia.", de: "Eine große graue Wolke." },
      { it: "Con la pioggia prendo l'ombrello.", de: "Bei Regen nehme ich den Schirm." }
    ],
    build: [0], produce: [1, 2], covers: ["natura"]
  },
  { id: "m2-verbi-giornata", level: "A1", mini: true, title: "Mini: Meine Routine", icon: "⏱️", scene: "Häufigkeitswörter im Tag.",
    words: [{ it: "adesso", de: "jetzt", emoji: "⏱️" }, { it: "dopo", de: "danach", emoji: "⏭️" }, { it: "sempre", de: "immer", emoji: "🔁" }, { it: "spesso", de: "oft", emoji: "📊" }, { it: "mai", de: "nie", emoji: "🚫" }, { it: "quasi", de: "fast", emoji: "🪜" }],
    sentences: [
      { it: "Adesso studio italiano.", de: "Jetzt lerne ich Italienisch." },
      { it: "Dopo mangio una mela.", de: "Danach esse ich einen Apfel." },
      { it: "Sempre piano, mai fretta.", de: "Immer langsam, nie Eile." },
      { it: "Quasi finito!", de: "Fast fertig!" }
    ],
    build: [0], produce: [1, 2], covers: ["avverbi_a1", "tempo"]
  },
  { id: "m2-emozioni-facce", level: "A1", mini: true, title: "Mini: Gefühle zeigen", icon: "😊", scene: "Gefühle laut aussprechen.",
    words: [{ it: "arrabbiato", de: "verärgert", emoji: "😠" }, { it: "triste", de: "traurig", emoji: "😢" }, { it: "contento", de: "froh", emoji: "🙂" }, { it: "nervoso", de: "nervös", emoji: "😬" }, { it: "innamorato", de: "verliebt", emoji: "😍" }, { it: "tranquillo", de: "gelassen", emoji: "😌" }],
    sentences: [
      { it: "Sono contento oggi.", de: "Ich bin heute froh." },
      { it: "Marco è un po' nervoso.", de: "Marco ist etwas nervös." },
      { it: "Perché sei triste?", de: "Warum bist du traurig?" },
      { it: "Resta tranquillo, va tutto bene.", de: "Bleib gelassen, alles ist gut." }
    ],
    build: [0], produce: [1, 2], covers: ["aggettivi_a1", "conversazione"]
  },
  { id: "m2-ristorante-piatti", level: "A1", mini: true, title: "Mini: Gänge im Restaurant", icon: "🍽️", scene: "Vorspeise bis Rechnung.",
    words: [{ it: "l'antipasto", de: "Vorspeise", emoji: "🫒" }, { it: "il primo", de: "erster Gang", emoji: "🍝" }, { it: "il secondo", de: "zweiter Gang", emoji: "🍖" }, { it: "il conto", de: "Rechnung", emoji: "🧾" }, { it: "vino", de: "Wein", emoji: "🍷" }, { it: "acqua", de: "Wasser", emoji: "💧" }],
    sentences: [
      { it: "Come antipasto prendiamo bruschette.", de: "Als Vorspeise nehmen wir Bruschetta." },
      { it: "Il primo è risotto.", de: "Der erste Gang ist Risotto." },
      { it: "Il secondo è carne alla griglia.", de: "Der zweite Gang ist Grillfleisch." },
      { it: "Il conto, per favore.", de: "Die Rechnung, bitte." }
    ],
    build: [0], produce: [1, 2], covers: ["ristorante"]
  },
  { id: "m2-casa-numeri", level: "A1", mini: true, title: "Mini: Zimmer & Nummern", icon: "🏨", scene: "Hotel-Details sicher sagen.",
    words: [{ it: "camera", de: "Zimmer", emoji: "🛏️" }, { it: "piano", de: "Stockwerk", emoji: "🎚️" }, { it: "numero", de: "Nummer", emoji: "🔢" }, { it: "primo", de: "erste(r/s)", emoji: "🥇" }, { it: "secondo", de: "zweite(r/s)", emoji: "🥈" }, { it: "chiave", de: "Schlüssel", emoji: "🔑" }],
    sentences: [
      { it: "Camera numero dieci.", de: "Zimmer Nummer zehn." },
      { it: "Al secondo piano, grazie.", de: "Im zweiten Stock, danke." },
      { it: "La chiave della camera sette.", de: "Der Schlüssel zu Zimmer sieben." },
      { it: "Il primo hotel è pieno.", de: "Das erste Hotel ist voll." }
    ],
    build: [0], produce: [1, 2], covers: ["viaggio", "numeri_estesi"]
  },
  { id: "m2-tempo-frasi", level: "A1", mini: true, title: "Mini: Heute–morgen", icon: "📆", scene: "Zeitwörter hintereinanderschalten.",
    words: [{ it: "oggi", de: "heute", emoji: "📌" }, { it: "domani", de: "morgen", emoji: "➡️" }, { it: "ieri", de: "gestern", emoji: "⬅️" }, { it: "adesso", de: "jetzt", emoji: "⏱️" }, { it: "poi", de: "dann", emoji: "⏩" }, { it: "dopo", de: "danach", emoji: "⏭️" }],
    sentences: [
      { it: "Oggi studio, domani viaggio.", de: "Heute lerne ich, morgen reise ich." },
      { it: "Ieri ho riposato.", de: "Gestern habe ich mich ausgeruht." },
      { it: "Prima mangio, poi esco.", de: "Zuerst esse ich, dann gehe ich raus." },
      { it: "Adesso basta, dopo parliamo.", de: "Jetzt reicht es, später reden wir." }
    ],
    build: [0], produce: [1, 2], covers: ["tempo"]
  },
  { id: "m2-scrittura", level: "A1", mini: true, title: "Mini: Kleine Wörter", icon: "🔗", scene: "Konjunktionen im Minisatz.", 
    words: [{ it: "e", de: "und", emoji: "➕" }, { it: "o", de: "oder", emoji: "🔀" }, { it: "ma", de: "aber", emoji: "↩️" }, { it: "anche", de: "auch", emoji: "✅" }, { it: "con", de: "mit", emoji: "🤝" }, { it: "senza", de: "ohne", emoji: "🚫" }],
    sentences: [
      { it: "Un caffè senza zucchero.", de: "Ein Espresso ohne Zucker." },
      { it: "Pane e pomodoro.", de: "Brot und Tomate." },
      { it: "Vuoi tè o caffè?", de: "Möchtest du Tee oder Kaffee?" },
      { it: "Anche io, ma dopo.", de: "Ich auch, aber später." }
    ],
    build: [0], produce: [1, 2], covers: ["parole_funzione"]
  },
  { id: "m2-famiglia-nomi", level: "A1", mini: true, title: "Mini: Wer ist wer?", icon: "👪", scene: "Familienbeziehungen benennen.",
    words: [{ it: "moglie", de: "Ehefrau", emoji: "👰" }, { it: "marito", de: "Ehemann", emoji: "🤵" }, { it: "nonno", de: "Großvater", emoji: "👴" }, { it: "nonna", de: "Großmutter", emoji: "👵" }, { it: "nome", de: "Vorname", emoji: "📝" }, { it: "cognome", de: "Nachname", emoji: "🏷️" }],
    sentences: [
      { it: "Il nonno di Marco è simpatico.", de: "Marcos Opa ist sympathisch." },
      { it: "La nonna cucina per tutti.", de: "Die Oma kocht für alle." },
      { it: "Suo marito si chiama Luca.", de: "Ihr Mann heißt Luca." },
      { it: "Nome e cognome, per favore.", de: "Vor- und Nachname, bitte." }
    ],
    build: [0], produce: [1, 2], covers: ["famiglia"]
  },
  { id: "m2-natura-cielo", level: "A1", mini: true, title: "Mini: Himmel & Erde", icon: "🌳", scene: "Natur eindrucksvoll beschreiben.",
    words: [{ it: "cielo", de: "Himmel", emoji: "🌤️" }, { it: "sole", de: "Sonne", emoji: "☀️" }, { it: "albero", de: "Baum", emoji: "🌳" }, { it: "fiore", de: "Blume", emoji: "🌸" }, { it: "montagna", de: "Berg", emoji: "⛰️" }, { it: "mare", de: "Meer", emoji: "🌊" }],
    sentences: [
      { it: "Il cielo sopra la montagna è blu.", de: "Der Himmel über dem Berg ist blau." },
      { it: "L'albero è alto e verde.", de: "Der Baum ist hoch und grün." },
      { it: "Un fiore per te.", de: "Eine Blume für dich." },
      { it: "Il mare calma la mente.", de: "Das Meer beruhigt den Kopf." }
    ],
    build: [0], produce: [1, 2], covers: ["natura"]
  },
  { id: "m2-vestiti-meteo", level: "A1", mini: true, title: "Mini: Anziehen nach Wetter", icon: "🧥", scene: "Wetter → Kleidung.",
    words: [{ it: "cappotto", de: "Mantel", emoji: "🧥" }, { it: "maglione", de: "Pullover", emoji: "🧶" }, { it: "ombrello", de: "Regenschirm", emoji: "☂️" }, { it: "caldo", de: "warm", emoji: "🥵" }, { it: "freddo", de: "kalt", emoji: "🥶" }, { it: "vento", de: "Wind", emoji: "💨" }],
    sentences: [
      { it: "Fa freddo: mettiti il maglione.", de: "Es ist kalt: zieh den Pullover an." },
      { it: "Con il vento prendo il cappotto.", de: "Bei Wind nehme ich den Mantel." },
      { it: "Fa caldo, niente cappotto.", de: "Es ist warm, kein Mantel." },
      { it: "L'ombrello è per la pioggia.", de: "Der Schirm ist für den Regen." }
    ],
    build: [0], produce: [1, 2], covers: ["abbigliamento", "natura"]
  },
  { id: "m2-bar-ordine", level: "A1", mini: true, title: "Mini: An der Bar", icon: "☕", scene: "Bestell-Formeln aus der Bar.",
    words: [{ it: "un caffè", de: "ein Espresso", emoji: "☕" }, { it: "un cappuccino", de: "ein Cappuccino", emoji: "🥛" }, { it: "birra", de: "Bier", emoji: "🍺" }, { it: "vino", de: "Wein", emoji: "🍷" }, { it: "euro", de: "Euro", emoji: "💶" }, { it: "prego", de: "bitte schön", emoji: "🙆" }],
    sentences: [
      { it: "Un cappuccino e una brioche.", de: "Ein Cappuccino und eine Brioche." },
      { it: "Due birre, per favore.", de: "Zwei Biere, bitte." },
      { it: "Sono sei euro.", de: "Es sind sechs Euro." },
      { it: "Prego, serviti pure.", de: "Bitte, bedienen Sie sich." }
    ],
    build: [0], produce: [1, 2], covers: ["ristorante"]
  },
  { id: "m2-supermercato-list", level: "A1", mini: true, title: "Mini: Einkaufsliste", icon: "🛒", scene: "Einkaufen mit Liste.",
    words: [{ it: "supermercato", de: "Supermarkt", emoji: "🏪" }, { it: "pane", de: "Brot", emoji: "🍞" }, { it: "latte", de: "Milch", emoji: "🥛" }, { it: "uovo", de: "Ei", emoji: "🥚" }, { it: "verdura", de: "Gemüse", emoji: "🥦" }, { it: "zucchero", de: "Zucker", emoji: "🍬" }],
    sentences: [
      { it: "Al supermercato compro tutto.", de: "Im Supermarkt kaufe ich alles." },
      { it: "Pane, latte e uova.", de: "Brot, Milch und Eier." },
      { it: "Verdura fresca e un po' di zucchero.", de: "Frisches Gemüse und etwas Zucker." },
      { it: "La lista è lunga ma completa.", de: "Die Liste ist lang, aber vollständig." }
    ],
    build: [0], produce: [1, 2], covers: ["acquisti", "cibo_a1"]
  },
  { id: "m2-corpo-sport", level: "A1", mini: true, title: "Mini: Bewegung", icon: "🏃", scene: "Körper und Sport verbinden.",
    words: [{ it: "testa", de: "Kopf", emoji: "🤕" }, { it: "gamba", de: "Bein", emoji: "🦵" }, { it: "piede", de: "Fuß", emoji: "🦶" }, { it: "parco", de: "Park", emoji: "🌳" }, { it: "sport", de: "Sport", emoji: "⚽" }, { it: "acqua", de: "Wasser", emoji: "💧" }],
    sentences: [
      { it: "Muovi testa e gambe!", de: "Beweg Kopf und Beine!" },
      { it: "Cammino a piedi fino al parco.", de: "Ich gehe zu Fuß bis zum Park." },
      { it: "Lo sport fa bene.", de: "Sport tut gut." },
      { it: "Bevo acqua dopo lo sport.", de: "Ich trinke Wasser nach dem Sport." }
    ],
    build: [0], produce: [1, 2], covers: ["corpo", "tempo_libero"]
  },
  { id: "m2-artikoli", level: "A1", mini: true, title: "Mini: der / die / das", icon: "🧩", scene: "Artikel im echten Satz.",
    words: [{ it: "il", de: "der (m.)", emoji: "🔵" }, { it: "la", de: "die (w.)", emoji: "🔴" }, { it: "un / uno / una", de: "ein / eine", emoji: "1️⃣" }, { it: "questo", de: "dieser", emoji: "👆" }, { it: "quello", de: "das dort", emoji: "👇" }, { it: "mio", de: "mein", emoji: "🫵" }],
    sentences: [
      { it: "Il libro, la penna, un quaderno.", de: "Das Buch, der Stift, ein Heft." },
      { it: "Questo è mio, quello è tuo.", de: "Das ist meins, das ist deins." },
      { it: "La mia casa è piccola.", de: "Mein Haus ist klein." },
      { it: "Un amico vero è un tesoro.", de: "Ein wahrer Freund ist ein Schatz." }
    ],
    build: [0], produce: [1, 2], covers: ["articoli_pronomi"]
  },
  { id: "m2-vere-frasi", level: "A1", mini: true, title: "Mini: Die goldenen zehn", icon: "🌟", scene: "Die wichtigsten Reisesätze im Wechsel.",
    words: [{ it: "per favore", de: "bitte", emoji: "🙏" }, { it: "grazie mille", de: "vielen Dank", emoji: "💛" }, { it: "scusi", de: "entschuldigen Sie", emoji: "🙇" }, { it: "permesso", de: "darf ich?", emoji: "🚪" }, { it: "quanto costa?", de: "wie viel kostet das?", emoji: "❓" }, { it: "dove", de: "wo", emoji: "🧭" }],
    sentences: [
      { it: "Scusi, dov'è il bagno?", de: "Entschuldigung, wo ist die Toilette?" },
      { it: "Quanto costa questo biglietto?", de: "Was kostet dieses Ticket?" },
      { it: "Per favore, piano.", de: "Bitte, langsam." },
      { it: "Grazie mille, gentilissimo!", de: "Vielen Dank, sehr freundlich!" }
    ],
    build: [0], produce: [1, 2], covers: ["saluti", "interrogativi"]
  },
  { id: "m2-feste", level: "A1", mini: true, title: "Mini: Feste & Auguri", icon: "🎂", scene: "Feiern und gratulieren.",
    words: [{ it: "festa", de: "Fest", emoji: "🎉" }, { it: "compleanno", de: "Geburtstag", emoji: "🎂" }, { it: "augurio", de: "Glückwunsch", emoji: "🎊" }, { it: "dolce", de: "Nachtisch", emoji: "🍰" }, { it: "musica", de: "Musik", emoji: "🎵" }, { it: "amico", de: "Freund", emoji: "🧑‍🤝‍🧑" }],
    sentences: [
      { it: "Auguri di buon compleanno!", de: "Alles Gute zum Geburtstag!" },
      { it: "La festa comincia alle otto.", de: "Die Party beginnt um acht." },
      { it: "Un dolce e tanta musica.", de: "Ein Dessert und viel Musik." },
      { it: "Gli amici portano i regali.", de: "Die Freunde bringen die Geschenke." }
    ],
    build: [0], produce: [1, 2], covers: ["tempo_libero"]
  },
  { id: "m2-luoghi-terra", level: "A1", mini: true, title: "Mini: Stadt & Land", icon: "🏞️", scene: "Kontraste beschreiben.",
    words: [{ it: "città", de: "Stadt", emoji: "🏙️" }, { it: "campagna", de: "Land", emoji: "🌾" }, { it: "montagna", de: "Berg", emoji: "⛰️" }, { it: "mare", de: "Meer", emoji: "🌊" }, { it: "lago", de: "See", emoji: "🏞️" }, { it: "negozio", de: "Geschäft", emoji: "🏪" }],
    sentences: [
      { it: "La città è grande e vivace.", de: "Die Stadt ist groß und lebendig." },
      { it: "La campagna è silenziosa.", de: "Das Land ist still." },
      { it: "La montagna d'inverno è bianca.", de: "Der Berg ist im Winter weiß." },
      { it: "Il lago in estate è perfetto.", de: "Der See ist im Sommer perfekt." }
    ],
    build: [0], produce: [1, 2], covers: ["citta", "natura"]
  },
  { id: "m2-frasi-utili", level: "A1", mini: true, title: "Mini: Die 4 Zauberwörter", icon: "✨", scene: "Höflichkeit automatisieren.",
    words: [{ it: "per favore", de: "bitte", emoji: "🙏" }, { it: "prego", de: "bitte schön", emoji: "🙆" }, { it: "scusi", de: "entschuldigen Sie", emoji: "🙇" }, { it: "grazie", de: "danke", emoji: "💛" }, { it: "sì", de: "ja", emoji: "✅" }, { it: "no", de: "nein", emoji: "❌" }],
    sentences: [
      { it: "Sì, per favore.", de: "Ja, bitte." },
      { it: "No, grazie.", de: "Nein, danke." },
      { it: "Scusi, un secondo.", de: "Entschuldigung, einen Moment." },
      { it: "Prego, con piacere.", de: "Bitte, gern." }
    ],
    build: [0], produce: [1, 2], covers: ["saluti"]
  },
  { id: "m2-tempo-passato", level: "A1", mini: true, title: "Mini: Gestern & heute", icon: "⏳", scene: "Erste Vergangenheitserfahrungen.",
    words: [{ it: "oggi", de: "heute", emoji: "📌" }, { it: "ieri", de: "gestern", emoji: "⬅️" }, { it: "domani", de: "morgen", emoji: "➡️" }, { it: "adesso", de: "jetzt", emoji: "⏱️" }, { it: "tutto bene?", de: "alles gut?", emoji: "😊" }, { it: "sto male", de: "mir geht es schlecht", emoji: "🤒" }],
    sentences: [
      { it: "Ieri sono stato a casa.", de: "Gestern war ich zu Hause." },
      { it: "Oggi sto bene.", de: "Heute geht es mir gut." },
      { it: "Domani va meglio.", de: "Morgen wird es besser." },
      { it: "Adesso basta — a dopo!", de: "Jetzt reicht es — bis später!" }
    ],
    build: [0], produce: [1, 2], covers: ["tempo", "emergenza"]
  },

  /* ================= A2 (12 Stories — Imperfetto, Condizionale,
     Imperativo, Pronomen, Vergleiche; validate.js erzwingt, dass
     jede covers-Kategorie das Level A2 trägt) ================= */

  {
    id: "infanzia",
    level: "A2",
    title: "Quando ero piccolo",
    icon: "🧸",
    scene: "Erzählzeit! Mit dem Imperfetto beschreibst du, wie es früher war — Gewohnheiten und Erinnerungen aus der Kindheit.",
    words: [
      { it: "il ricordo", de: "die Erinnerung", emoji: "🧠" },
      { it: "l'infanzia", de: "die Kindheit", emoji: "👶" },
      { it: "una volta", de: "einmal / früher", emoji: "📖" },
      { it: "di solito", de: "gewöhnlich", emoji: "🕰️" },
      { it: "ogni tanto", de: "ab und zu", emoji: "🔁" },
      { it: "l'abitudine", de: "die Gewohnheit", emoji: "🔄" },
      { it: "invece", de: "stattdessen / dagegen", emoji: "↩️" },
      { it: "la storia", de: "die Geschichte", emoji: "🏺" }
    ],
    sentences: [
      { it: "Da bambino giocavo sempre in strada.", de: "Als Kind habe ich immer auf der Straße gespielt." },
      { it: "Mia nonna raccontava sempre belle storie.", de: "Meine Oma erzählte immer schöne Geschichten." },
      { it: "Ogni estate andavamo al mare.", de: "Jeden Sommer fuhren wir ans Meer." },
      { it: "Di solito mangiavamo alle otto.", de: "Gewöhnlich aßen wir um acht Uhr." },
      { it: "Che tempo faceva a Roma?", de: "Wie war das Wetter in Rom?" },
      { it: "Era tutto più semplice.", de: "Alles war einfacher." },
      { it: "Ora vivo nella grande città, invece.", de: "Heute lebe ich stattdessen in der Großstadt." }
    ],
    build: [0, 2, 3],
    produce: [1, 4, 6],
    covers: ["racconto"]
  },
  {
    id: "treno",
    level: "A2",
    title: "Problemi in treno",
    icon: "🚄",
    scene: "Der Zug hat Verspätung, du musst umsteigen — und erzählst hinterher, was passiert ist. Imperfetto trifft Passato prossimo.",
    words: [
      { it: "il ritardo", de: "die Verspätung", emoji: "⏱️" },
      { it: "il binario", de: "das Gleis", emoji: "🛤️" },
      { it: "la coincidenza", de: "der Anschluss", emoji: "🔗" },
      { it: "il controllore", de: "der Schaffner", emoji: "🧑‍✈️" },
      { it: "la multa", de: "das Bußgeld", emoji: "🚨" },
      { it: "il passeggero", de: "der Passagier", emoji: "🧍" },
      { it: "in orario", de: "pünktlich", emoji: "⌚" },
      { it: "è successo", de: "es ist passiert", emoji: "🫢" }
    ],
    sentences: [
      { it: "Che cosa è successo?", de: "Was ist passiert?" },
      { it: "Il treno aveva venti minuti di ritardo.", de: "Der Zug hatte zwanzig Minuten Verspätung." },
      { it: "Non c'era nessun problema, però.", de: "Es gab aber kein Problem." },
      { it: "Ho cambiato treno a Bologna.", de: "Ich bin in Bologna umgestiegen." },
      { it: "Il controllore ha controllato i biglietti.", de: "Der Schaffner hat die Fahrkarten kontrolliert." },
      { it: "Mi è piaciuta molto la città.", de: "Die Stadt hat mir sehr gefallen." },
      { it: "Alla fine siamo arrivati in orario.", de: "Am Ende sind wir pünktlich angekommen." }
    ],
    build: [1, 4, 6],
    produce: [0, 2, 5],
    covers: ["trasporti2"]
  },
  {
    id: "trattoria",
    level: "A2",
    title: "Alla trattoria",
    icon: "🫒",
    scene: "In der Trattoria bestellen wir Gang für Gang — mit „vorrei“ und „potrei“ bleibt man höflich, der Cameriere empfiehlt.",
    words: [
      { it: "il coperto", de: "das Gedeck", emoji: "🕯️" },
      { it: "il cameriere", de: "der Kellner", emoji: "🧑‍🍳" },
      { it: "l'antipasto", de: "die Vorspeise", emoji: "🫒" },
      { it: "il primo", de: "der erste Gang", emoji: "🍝" },
      { it: "il secondo", de: "der zweite Gang", emoji: "🍖" },
      { it: "il contorno", de: "die Beilage", emoji: "🥗" },
      { it: "la specialità", de: "die Spezialität", emoji: "⭐" },
      { it: "al dente", de: "al dente", emoji: "🍜" }
    ],
    sentences: [
      { it: "Cosa ci consiglia?", de: "Was empfehlen Sie uns?" },
      { it: "Vorrei la pasta al dente, per favore.", de: "Ich hätte die Nudeln gern al dente, bitte." },
      { it: "Come antipasto prendiamo le bruschette.", de: "Als Vorspeise nehmen wir Bruschetta." },
      { it: "Potrei avere il menù, per favore?", de: "Könnte ich die Speisekarte haben, bitte?" },
      { it: "Il coperto è incluso?", de: "Ist das Gedeck inbegriffen?" },
      { it: "La specialità della casa è ottima.", de: "Die Spezialität des Hauses ist ausgezeichnet." },
      { it: "Il vino della casa era molto buono.", de: "Der Hauswein war sehr gut." }
    ],
    build: [1, 4, 5],
    produce: [0, 2, 3],
    covers: ["uscire"]
  },
  {
    id: "medico",
    level: "A2",
    title: "Dal medico",
    icon: "🌡️",
    scene: "Arztbesuch in Italien: Beschwerden schildern, das Rezept verstehen — und mit der formellen Anrede höflich bleiben.",
    words: [
      { it: "la febbre", de: "das Fieber", emoji: "🌡️" },
      { it: "la tosse", de: "der Husten", emoji: "😷" },
      { it: "il raffreddore", de: "die Erkältung", emoji: "🤧" },
      { it: "l'influenza", de: "die Grippe", emoji: "🦠" },
      { it: "la ricetta", de: "das Rezept", emoji: "📜" },
      { it: "la tisana", de: "der Kräutertee", emoji: "🍵" },
      { it: "il farmacista", de: "der Apotheker", emoji: "🧑‍⚕️" },
      { it: "sano", de: "gesund", emoji: "🥗" }
    ],
    sentences: [
      { it: "Dottore, mi fa male la gola.", de: "Herr Doktor, mein Hals tut weh." },
      { it: "Ho la febbre da tre giorni.", de: "Ich habe seit drei Tagen Fieber." },
      { it: "Tossisco soprattutto la notte.", de: "Ich huste besonders nachts." },
      { it: "Le prescrivo una tisana e molto riposo.", de: "Ich verschreibe Ihnen einen Kräutertee und viel Ruhe." },
      { it: "Deve stare a letto due giorni.", de: "Sie müssen zwei Tage im Bett bleiben." },
      { it: "Non fumi e beva tanta acqua.", de: "Rauchen Sie nicht und trinken Sie viel Wasser." },
      { it: "Guarirò presto, spero!", de: "Ich werde hoffentlich bald gesund!" }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    dialogueId: "medico",
    covers: ["salute2"]
  },
  {
    id: "tempo",
    level: "A2",
    title: "Che tempo farà?",
    icon: "🌈",
    scene: "Wetterfrosch-Modus: Vorhersagen mit dem Futuro — „sarà“, „scenderà“, „farà“ — und das perfekte Gewitter-Vokabular.",
    words: [
      { it: "la temperatura", de: "die Temperatur", emoji: "🌡️" },
      { it: "la nebbia", de: "der Nebel", emoji: "🌫️" },
      { it: "il tuono", de: "der Donner", emoji: "⛈️" },
      { it: "il fulmine", de: "der Blitz", emoji: "⚡" },
      { it: "l'arcobaleno", de: "der Regenbogen", emoji: "🌈" },
      { it: "il ghiaccio", de: "das Eis", emoji: "🧊" },
      { it: "la previsione", de: "die Wettervorhersage", emoji: "📺" },
      { it: "umido", de: "feucht / schwül", emoji: "💧" }
    ],
    sentences: [
      { it: "Domani sarà una giornata nuvolosa.", de: "Morgen wird ein bewölkter Tag." },
      { it: "La temperatura scenderà a dieci gradi.", de: "Die Temperatur wird auf zehn Grad sinken." },
      { it: "Ci saranno anche tuoni e fulmini.", de: "Es wird auch Donner und Blitze geben." },
      { it: "Con questa nebbia non si vede niente.", de: "Bei diesem Nebel sieht man nichts." },
      { it: "In montagna farà molto freddo.", de: "In den Bergen wird es sehr kalt." },
      { it: "La previsione dice pioggia per domani.", de: "Die Vorhersage sagt Regen für morgen." },
      { it: "Dopo la pioggia arriva l'arcobaleno.", de: "Nach dem Regen kommt der Regenbogen." }
    ],
    build: [1, 4, 6],
    produce: [0, 2, 3],
    covers: ["tempo2"]
  },
  {
    id: "posta",
    level: "A2",
    title: "Alla posta",
    icon: "📮",
    scene: "Paket nach Hause schicken, Formular ausfüllen, Überweisung machen — formelle Imperative inklusive.",
    words: [
      { it: "il francobollo", de: "die Briefmarke", emoji: "📮" },
      { it: "la busta", de: "der Briefumschlag", emoji: "✉️" },
      { it: "il pacco", de: "das Paket", emoji: "📦" },
      { it: "il modulo", de: "das Formular", emoji: "📋" },
      { it: "la fila", de: "die Schlange", emoji: "👥" },
      { it: "il bonifico", de: "die Überweisung", emoji: "🏦" },
      { it: "i contanti", de: "das Bargeld", emoji: "💵" },
      { it: "la firma", de: "die Unterschrift", emoji: "✍️" }
    ],
    sentences: [
      { it: "Vorrei spedire questo pacco in Germania.", de: "Ich möchte dieses Paket nach Deutschland schicken." },
      { it: "Quanti francobolli servono?", de: "Wie viele Briefmarken braucht man?" },
      { it: "Compili questo modulo, per favore.", de: "Füllen Sie dieses Formular aus, bitte." },
      { it: "Firmi qui, per favore.", de: "Unterschreiben Sie hier, bitte." },
      { it: "C'è molta fila oggi.", de: "Es gibt heute eine lange Schlange." },
      { it: "Posso pagare col bancomat?", de: "Kann ich mit der Geldkarte zahlen?" },
      { it: "Il bonifico arriva in due giorni.", de: "Die Überweisung kommt in zwei Tagen an." }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    covers: ["servizi"]
  },
  {
    id: "appartamento",
    level: "A2",
    title: "L'appartamento",
    icon: "🔑",
    scene: "Wohnungssuche in Italien: Miete, Kaution, Nachbarn — so klingt eine Besichtigung auf Italienisch.",
    words: [
      { it: "l'affitto", de: "die Miete", emoji: "🏷️" },
      { it: "il contratto", de: "der Vertrag", emoji: "📄" },
      { it: "la cauzione", de: "die Kaution", emoji: "💰" },
      { it: "ammobiliato", de: "möbliert", emoji: "🛋️" },
      { it: "il monolocale", de: "das Einzimmerapartment", emoji: "🚪" },
      { it: "il vicino", de: "der Nachbar", emoji: "🧑‍🤝‍🧑" },
      { it: "la zona", de: "das Viertel", emoji: "🗺️" },
      { it: "il rumore", de: "der Lärm", emoji: "🔊" }
    ],
    sentences: [
      { it: "Cerco un appartamento vicino al centro.", de: "Ich suche eine Wohnung nahe dem Zentrum." },
      { it: "Quanto costa l'affitto al mese?", de: "Wie viel kostet die Miete im Monat?" },
      { it: "L'appartamento è ammobiliato?", de: "Ist die Wohnung möbliert?" },
      { it: "Devo lasciare una cauzione?", de: "Muss ich eine Kaution hinterlegen?" },
      { it: "Il monolocale è piccolo ma luminoso.", de: "Das Einzimmerapartment ist klein, aber hell." },
      { it: "Il rumore della strada è forte di notte.", de: "Der Straßenlärm ist nachts laut." },
      { it: "I vicini sono molto gentili.", de: "Die Nachbarn sind sehr freundlich." }
    ],
    build: [1, 3, 5],
    produce: [0, 2, 6],
    covers: ["abitare"]
  },
  {
    id: "colloquio",
    level: "A2",
    title: "Il colloquio",
    icon: "📑",
    scene: "Vorstellungsgespräch: Erfahrung schildern, nach Gehalt und Urlaub fragen — „da + Zeitraum“ ist der Schlüssel.",
    words: [
      { it: "lo stipendio", de: "das Gehalt", emoji: "💲" },
      { it: "il turno", de: "die Schicht", emoji: "🕐" },
      { it: "il curriculum", de: "der Lebenslauf", emoji: "📑" },
      { it: "il colloquio", de: "das Vorstellungsgespräch", emoji: "🤝" },
      { it: "l'esperienza", de: "die Erfahrung", emoji: "📈" },
      { it: "la ditta", de: "die Firma", emoji: "🏭" },
      { it: "la feria", de: "der Urlaubstag", emoji: "🏖️" },
      { it: "l'azienda", de: "der Betrieb", emoji: "🏬" }
    ],
    sentences: [
      { it: "Ho un colloquio giovedì alle dieci.", de: "Ich habe Donnerstag um zehn Uhr ein Vorstellungsgespräch." },
      { it: "Porto il curriculum e i documenti.", de: "Ich bringe den Lebenslauf und die Unterlagen mit." },
      { it: "Che esperienza ha nel settore?", de: "Welche Erfahrung haben Sie in der Branche?" },
      { it: "Lavoro nel commercio da cinque anni.", de: "Ich arbeite seit fünf Jahren im Handel." },
      { it: "Lo stipendio è negoziabile?", de: "Ist das Gehalt verhandelbar?" },
      { it: "Le ferie sono pagate?", de: "Sind die Urlaubstage bezahlt?" },
      { it: "L'azienda ha cinquanta dipendenti.", de: "Der Betrieb hat fünfzig Mitarbeiter." }
    ],
    build: [1, 3, 4],
    produce: [0, 2, 6],
    covers: ["lavoro2"]
  },
  {
    id: "messaggio",
    level: "A2",
    title: "Un messaggio ad Anna",
    icon: "💬",
    scene: "Telefonieren und Chatten: Pronomen vor dem Verb („ti ho inviato“, „l'hai ricevuto?“) und der Anrufbeantworter.",
    words: [
      { it: "il messaggio", de: "die Nachricht", emoji: "💬" },
      { it: "la chiamata", de: "der Anruf", emoji: "📞" },
      { it: "la segreteria", de: "der Anrufbeantworter", emoji: "📼" },
      { it: "l'impegno", de: "die Verpflichtung", emoji: "📆" },
      { it: "la linea", de: "die Leitung", emoji: "📶" },
      { it: "occupato", de: "besetzt", emoji: "🚫" },
      { it: "la videochiamata", de: "der Videoanruf", emoji: "📹" },
      { it: "il segnale", de: "das Signal", emoji: "📡" }
    ],
    sentences: [
      { it: "Ti ho inviato un messaggio.", de: "Ich habe dir eine Nachricht geschickt." },
      { it: "L'hai ricevuto?", de: "Hast du ihn bekommen?" },
      { it: "La linea è occupata, riprova più tardi.", de: "Die Leitung ist besetzt, versuch es später wieder." },
      { it: "Lasciami un messaggio sulla segreteria.", de: "Hinterlass mir eine Nachricht auf dem Anrufbeantworter." },
      { it: "Mia madre chiama sempre a quest'ora.", de: "Meine Mutter ruft immer um diese Zeit an." },
      { it: "Non ho tempo adesso, richiamami dopo.", de: "Ich habe jetzt keine Zeit, ruf mich später zurück." },
      { it: "Alla fine ci siamo sentiti per telefono.", de: "Am Ende haben wir telefoniert." }
    ],
    build: [0, 3, 6],
    produce: [1, 2, 5],
    covers: ["comunicare"]
  },
  {
    id: "valigia",
    level: "A2",
    title: "Cosa metto in valigia?",
    icon: "🧣",
    scene: "Packen und Vergleichen: „più caldo“, „meno caro“ — und „questo/quello“ entscheidet das Outfit.",
    words: [
      { it: "comodo", de: "bequem", emoji: "😌" },
      { it: "elegante", de: "elegant", emoji: "🤵" },
      { it: "sportivo", de: "sportlich", emoji: "🏃" },
      { it: "di lana", de: "aus Wolle", emoji: "🐑" },
      { it: "la cintura", de: "der Gürtel", emoji: "👖" },
      { it: "i guanti", de: "die Handschuhe", emoji: "🧤" },
      { it: "la sciarpa", de: "der Schal", emoji: "🧣" },
      { it: "il bottone", de: "der Knopf", emoji: "🔘" }
    ],
    sentences: [
      { it: "Cosa indosso a cena stasera?", de: "Was ziehe ich heute Abend zum Essen an?" },
      { it: "Il vestito blu o quello nero?", de: "Das blaue oder das schwarze Kleid?" },
      { it: "Questo maglione è più caldo di quello.", de: "Dieser Pullover ist wärmer als der da." },
      { it: "Questa sciarpa di lana è comodissima.", de: "Dieser Wollschal ist sehr bequem." },
      { it: "Hai i guanti? Fa freddo!", de: "Hast du Handschuhe? Es ist kalt!" },
      { it: "Il bottone è staccato.", de: "Der Knopf ist ab." },
      { it: "Queste scarpe sono meno comode, ma più eleganti.", de: "Diese Schuhe sind weniger bequem, aber eleganter." }
    ],
    build: [1, 3, 6],
    produce: [0, 2, 5],
    covers: ["abiti2"]
  },
  {
    id: "emozioni",
    level: "A2",
    title: "Come ti senti?",
    icon: "😠",
    scene: "Gefühle benennen mit „sentirsi“ — und mit „perché“ nach dem Warum fragen.",
    words: [
      { it: "arrabbiato", de: "verärgert / wütend", emoji: "😠" },
      { it: "triste", de: "traurig", emoji: "😢" },
      { it: "nervoso", de: "nervös", emoji: "😬" },
      { it: "tranquillo", de: "ruhig / gelassen", emoji: "😌" },
      { it: "preoccupato", de: "besorgt", emoji: "😟" },
      { it: "sorpreso", de: "überrascht", emoji: "😲" },
      { it: "innamorato", de: "verliebt", emoji: "😍" },
      { it: "timido", de: "schüchtern", emoji: "😳" }
    ],
    sentences: [
      { it: "Come ti senti oggi?", de: "Wie fühlst du dich heute?" },
      { it: "Mi sento un po' stanco, ma contento.", de: "Ich fühle mich etwas müde, aber froh." },
      { it: "Perché sei arrabbiata?", de: "Warum bist du verärgert?" },
      { it: "Sono preoccupata per l'esame.", de: "Ich bin wegen der Prüfung besorgt." },
      { it: "Marco è molto timido, ma simpatico.", de: "Marco ist sehr schüchtern, aber sympathisch." },
      { it: "Siamo felici insieme.", de: "Wir sind glücklich zusammen." },
      { it: "Non essere triste, domani va meglio!", de: "Sei nicht traurig, morgen wird es besser!" }
    ],
    build: [0, 2, 6],
    produce: [1, 3, 4],
    covers: ["emozioni"]
  },
  {
    id: "toscana",
    level: "A2",
    title: "Il fine settimana in Toscana",
    icon: "🏞️",
    scene: "Ripasso-Story: ein Wochenende voller Erinnerungen — Imperfetto für die Bilder, Passato prossimo für die Handlungen.",
    words: [
      { it: "noleggiamo", de: "wir mieten", emoji: "🚲" },
      { it: "la funivia", de: "die Seilbahn", emoji: "🚡" },
      { it: "il cambio", de: "das Umsteigen", emoji: "🔀" },
      { it: "diretto", de: "direkt", emoji: "🚄" },
      { it: "il paesaggio", de: "die Landschaft", emoji: "🏞️" },
      { it: "il viaggio", de: "die Reise", emoji: "🧳", key: "word_viaggio_a1_viaggio" },
      { it: "felici", de: "glücklich (Plural)", emoji: "😊", key: "word_aggettivi_a1_felice" },
      { it: "la passeggiata", de: "der Spaziergang", emoji: "🚶" }
    ],
    sentences: [
      { it: "Sabato abbiamo noleggiato due biciclette.", de: "Samstag haben wir zwei Fahrräder gemietet." },
      { it: "Il paesaggio era bellissimo.", de: "Die Landschaft war wunderschön." },
      { it: "Prima abbiamo visitato Siena, poi abbiamo pranzato.", de: "Zuerst haben wir Siena besichtigt, dann haben wir zu Mittag gegessen." },
      { it: "La funivia saliva verso la montagna.", de: "Die Seilbahn stieg zum Berg hinauf." },
      { it: "Dall'alto si vedeva tutto il lago.", de: "Von oben sah man den ganzen See." },
      { it: "La sera siamo tornati stanchi ma felici.", de: "Am Abend kamen wir müde, aber glücklich zurück." },
      { it: "È stato un viaggio indimenticabile.", de: "Es war eine unvergessliche Reise." }
    ],
    build: [0, 2, 5],
    produce: [1, 3, 4],
    covers: ["racconto", "trasporti2"]
  },

    {
    id: "vacanze-bambini", level: "A2", title: "Le vacanze da bambini", icon: "🏖️",
    scene: "Mehr Imperfetto: Sommerferien am Meer — Bilder der Kindheit in der Vergangenheitsform.",
    words: [
      { it: "l'estate", de: "der Sommer", emoji: "☀️", key: "word_natura_estate" },
      { it: "la spiaggia", de: "der Strand", emoji: "🏖️", key: "word_orientamento_spiaggia" },
      { it: "il mare", de: "das Meer", emoji: "🌊", key: "word_natura_mare" },
      { it: "giocavo", de: "ich spielte", emoji: "🎾" },
      { it: "l'aranciata", de: "die Orangenlimonade", emoji: "🧃" },
      { it: "ogni estate", de: "jeden Sommer", emoji: "🔁" }
    ],
    sentences: [
      { it: "Da bambino andavo sempre al mare.", de: "Als Kind fuhr ich immer ans Meer." },
      { it: "Ogni estate giocavo sulla spiaggia.", de: "Jeden Sommer spielte ich am Strand." },
      { it: "Mio fratello nuotava come un pesce.", de: "Mein Bruder schwamm wie ein Fisch." },
      { it: "Mangiavamo l'aranciata e tanti gelati.", de: "Wir tranken Orangenlimonade und aßen viele Eise." },
      { it: "Faceva sempre caldo, quasi afoso.", de: "Es war immer heiß, fast schwül." },
      { it: "La sera tornavamo a casa stanchi.", de: "Am Abend kamen wir müde nach Hause." },
      { it: "Erano vacanze semplici e felici.", de: "Es waren einfache und glückliche Ferien." }
    ],
    build: [0, 2, 5],
    produce: [1, 3, 6],
    covers: ["racconto"]
  },
  {
    id: "vorrei-ma", level: "A2", title: "Vorrei, ma…", icon: "🎭",
    scene: "Der Condizionale im Alltag: höflich wollen, schonender absagen — mit „potrei“, „dovresti“, „mi piacerebbe“.",
    words: [
      { it: "potrei", de: "ich könnte", emoji: "🤔" },
      { it: "dovresti", de: "du solltest", emoji: "👉" },
      { it: "mi piacerebbe", de: "es würde mir gefallen", emoji: "💗" },
      { it: "sarebbe", de: "es wäre", emoji: "🌀" },
      { it: "peccato", de: "schade", emoji: "😞" },
      { it: "domani", de: "morgen", emoji: "➡️", key: "word_tempo_domani" }
    ],
    sentences: [
      { it: "Potrei venire, ma devo lavorare.", de: "Ich könnte kommen, aber ich muss arbeiten." },
      { it: "Dovresti riposarti un po'.", de: "Du solltest dich etwas ausruhen." },
      { it: "Mi piacerebbe vedere Venezia.", de: "Ich würde gern Venedig sehen." },
      { it: "Sarebbe bellissimo, ma è caro.", de: "Es wäre wunderschön, aber es ist teuer." },
      { it: "Peccato! La prossima volta.", de: "Schade! Beim nächsten Mal." },
      { it: "Vorrei un caffè, per favore.", de: "Ich hätte gern einen Espresso, bitte." },
      { it: "Domani potremmo andare al cinema.", de: "Morgen könnten wir ins Kino gehen." }
    ],
    build: [0, 3, 6],
    produce: [1, 2, 4],
    covers: ["emozioni"]
  },
  {
    id: "consigli-nonna", level: "A2", title: "I consigli della nonna", icon: "👵",
    scene: "Ratschläge der Oma: bejahte und verneinte Imperative — gut gemeint und grammatisch goldrichtig.",
    words: [
      { it: "la nonna", de: "die Oma", emoji: "👵", key: "word_famiglia_nonna" },
      { it: "il consiglio", de: "der Rat", emoji: "💡" },
      { it: "mettiti", de: "zieh dir an", emoji: "🧥" },
      { it: "mangia", de: "iss", emoji: "🍽️" },
      { it: "non preoccuparti", de: "mach dir keine Sorgen", emoji: "🧘" },
      { it: "riposati", de: "ruh dich aus", emoji: "🛌" },
      { it: "la salute", de: "die Gesundheit", emoji: "💚" }
    ],
    sentences: [
      { it: "La nonna dà sempre buoni consigli.", de: "Die Oma gibt immer gute Ratschläge." },
      { it: "Mettiti il cappotto, fa freddo.", de: "Zieh den Mantel an, es ist kalt." },
      { it: "Mangia piano e bevi piano.", de: "Iss langsam und trink langsam." },
      { it: "Non preoccuparti per tutto.", de: "Mach dir nicht wegen allem Sorgen." },
      { it: "Riposati almeno otto ore.", de: "Ruh dich mindestens acht Stunden aus." },
      { it: "Cammina ogni giorno, è gratis.", de: "Geh jeden Tag spazieren, es kostet nichts." },
      { it: "La salute viene prima di tutto.", de: "Die Gesundheit kommt vor allem anderen." }
    ],
    build: [1, 3, 4],
    produce: [0, 6, 2],
    covers: ["salute2"]
  },
  {
    id: "pronomi-cucina", level: "A2", title: "Me lo dai?", icon: "🤲",
    scene: "Pronomen in der Küche: „me lo“, „te lo“, „li lavo“ — Dinge weitergeben und benennen.",
    words: [
      { it: "il sale", de: "das Salz", emoji: "🧂", key: "word_ristorante_sale" },
      { it: "il pane", de: "das Brot", emoji: "🍞", key: "word_ristorante_pane" },
      { it: "i pomodori", de: "die Tomaten", emoji: "🍅", key: "word_cibo_a1_pomodoro" },
      { it: "me lo", de: "es mir", emoji: "🫴" },
      { it: "te lo", de: "es dir", emoji: "🤲" },
      { it: "li lavo", de: "ich wasche sie", emoji: "🧼" },
      { it: "un tesoro", de: "ein Schatz", emoji: "💎" }
    ],
    sentences: [
      { it: "Mi passi il sale, per favore?", de: "Reichst du mir das Salz, bitte?" },
      { it: "Sì, te lo passo subito.", de: "Ja, ich reiche es dir sofort." },
      { it: "Mi dai anche il pane?", de: "Gibst du mir auch das Brot?" },
      { it: "Certo, te lo do adesso.", de: "Klar, ich gebe es dir jetzt." },
      { it: "E i pomodori? Li lavi tu.", de: "Und die Tomaten? Du wäschst sie." },
      { it: "Sì, li lavo e li taglio.", de: "Ja, ich wasche und schneide sie." },
      { it: "Grazie, sei un tesoro!", de: "Danke, du bist ein Schatz!" }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    covers: ["abitare"]
  },
  {
    id: "meglio-peggio", level: "A2", title: "Meglio o peggio?", icon: "⚖️",
    scene: "Vergleiche auf Italienisch: meglio/peggio, maggiore/minore — und der unregelmäßige Superlativ.",
    words: [
      { it: "meglio", de: "besser", emoji: "📈" },
      { it: "peggio", de: "schlechter", emoji: "📉" },
      { it: "maggiore", de: "größer / älter", emoji: "⬆️" },
      { it: "minore", de: "kleiner / jünger", emoji: "⬇️" },
      { it: "il migliore", de: "der beste", emoji: "🥇" },
      { it: "il peggiore", de: "der schlechteste", emoji: "🥉" },
      { it: "uguale", de: "gleich", emoji: "🟰" }
    ],
    sentences: [
      { it: "Il caffè è meglio al bar che a casa.", de: "Espresso ist im Bar besser als zu Hause." },
      { it: "Oggi sto meglio, grazie.", de: "Mir geht es heute besser, danke." },
      { it: "Questa pizza è peggiore di quella.", de: "Diese Pizza ist schlechter als jene." },
      { it: "Mio fratello è maggiore di me.", de: "Mein Bruder ist älter als ich." },
      { it: "Mia sorella è la minore della famiglia.", de: "Meine Schwester ist die Jüngste der Familie." },
      { it: "Questo è il miglior gelato della città.", de: "Das ist das beste Eis der Stadt." },
      { it: "Il prezzo è uguale, ma la qualità no.", de: "Der Preis ist gleich, aber die Qualität nicht." }
    ],
    build: [0, 3, 5],
    produce: [1, 2, 6],
    covers: ["uscire"]
  },
  {
    id: "weekend-mosso", level: "A2", title: "Un weekend movimentato" , icon: "🎢",
    scene: "Unregelmäßige Partizipien im Einsatz: fatto, detto, venuto — ein bewegtes Wochenende erzählen.",
    words: [
      { it: "fatto", de: "gemacht", emoji: "🛠️" },
      { it: "detto", de: "gesagt", emoji: "💬" },
      { it: "venuto", de: "gekommen", emoji: "🚪" },
      { it: "ho perso", de: "ich habe verloren", emoji: "🔍" },
      { it: "siamo usciti", de: "wir sind ausgegangen", emoji: "🕺" },
      { it: "sabato", de: "Samstag", emoji: "⑥" },
      { it: "domenica", de: "Sonntag", emoji: "⑦" }
    ],
    sentences: [
      { it: "Sabato abbiamo fatto tante cose.", de: "Am Samstag haben wir viel gemacht." },
      { it: "Prima siamo usciti con gli amici.", de: "Zuerst sind wir mit Freunden ausgegangen." },
      { it: "Ho detto a tutti: oggi resto a casa!", de: "Ich sagte zu allen: heute bleibe ich zu Hause!" },
      { it: "Ma poi è venuto Marco a trovarci.", de: "Aber dann kam Marco uns besuchen." },
      { it: "Ho perso il telefono nel parco.", de: "Ich habe das Telefon im Park verloren." },
      { it: "Per fortuna l'ho ritrovato.", de: "Zum Glück habe ich es wiedergefunden." },
      { it: "Domenica abbiamo riposato tutto il giorno.", de: "Sonntag haben wir den ganzen Tag geruht." }
    ],
    build: [0, 1, 4],
    produce: [2, 3, 6],
    covers: ["racconto"]
  },
  {
    id: "facevi-ieri", level: "A2", title: "Che facevi ieri?", icon: "🎮",
    scene: "Gestern im Imperfetto: Gewohnheiten erzählen — studiare, guardare, aiutare.",
    words: [
      { it: "studiavo", de: "ich lernte / studierte", emoji: "📚" },
      { it: "guardavo", de: "ich schaute", emoji: "📺" },
      { it: "aiutavo", de: "ich half", emoji: "🤲" },
      { it: "il pomeriggio", de: "der Nachmittag", emoji: "🕑", key: "word_calendario_pomeriggio" },
      { it: "la sera", de: "der Abend", emoji: "🌆", key: "word_calendario_sera" },
      { it: "ogni tanto", de: "ab und zu", emoji: "🔁" }
    ],
    sentences: [
      { it: "Ieri mattina studiavo italiano.", de: "Gestern Morgen lernte ich Italienisch." },
      { it: "Il pomeriggio guardavo la TV.", de: "Am Nachmittag sah ich fern." },
      { it: "Aiutavo mamma in cucina.", de: "Ich half Mama in der Küche." },
      { it: "La sera uscivo con gli amici.", de: "Am Abend ging ich mit Freunden aus." },
      { it: "Ogni tanto giocavo ai videogiochi.", de: "Ab und zu spielte ich Videospiele." },
      { it: "Sempre la stessa cosa, più o meno.", de: "Immer dasselbe, mehr oder weniger." },
      { it: "E tu? Cosa facevi?", de: "Und du? Was hast du gemacht?" }
    ],
    build: [0, 3, 4],
    produce: [1, 2, 6],
    covers: ["racconto"]
  },
  {
    id: "farmacia2", level: "A2", title: "In farmacia", icon: "💊",
    scene: "Der zweite Arztbesuch: Einnahme-Hinweise mit formellen Imperativen — „due volte al giorno“.",
    words: [
      { it: "il farmacista", de: "der Apotheker", emoji: "🧑‍⚕️" },
      { it: "la ricetta", de: "das Rezept", emoji: "📜" },
      { it: "la pillola", de: "die Tablette", emoji: "💊" },
      { it: "la tisana", de: "der Kräutertee", emoji: "🍵" },
      { it: "due volte al giorno", de: "zweimal täglich", emoji: "⏰" },
      { it: "prima dei pasti", de: "vor den Mahlzeiten", emoji: "🍽️" },
      { it: "guarisci presto", de: "gute Besserung", emoji: "🌟" }
    ],
    sentences: [
      { it: "Buongiorno, ho la ricetta del medico.", de: "Guten Tag, ich habe das Rezept vom Arzt." },
      { it: "Prende una pillola al giorno, a colazione.", de: "Nehmen Sie eine Tablette täglich, zum Frühstück." },
      { it: "Questa tisana è leggera e naturale.", de: "Dieser Kräutertee ist mild und natürlich." },
      { it: "Due volte al giorno, prima dei pasti.", de: "Zweimal täglich, vor den Mahlzeiten." },
      { it: "Ha anche qualcosa per la tosse?", de: "Haben Sie auch etwas gegen den Husten?" },
      { it: "Certo, questo sciroppo è dolce.", de: "Natürlich, dieser Sirup ist süß." },
      { it: "Grazie, guarisci presto!", de: "Danke, gute Besserung!" }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 5],
    covers: ["salute2"]
  },
  {
    id: "m2a-imperfetto-blitz",
    level: "A2",
    title: "Imperfetto-Blitz",
    icon: "🕰️",
    scene: "Sechs Imperfetto-Formen in Alltagsszenen: Kindheit, Gewohnheiten und die Sonntage der Oma.",
    words: [
      { it: "andavo", de: "ich ging/fuhr", emoji: "🚶" },
      { it: "mangiava", de: "er/sie aß", emoji: "🍽️" },
      { it: "dormivo", de: "ich schlief", emoji: "😴" },
      { it: "cantava", de: "er/sie sang", emoji: "🎤" },
      { it: "faceva", de: "er/sie machte", emoji: "🛠️" },
      { it: "leggeva", de: "er/sie las", emoji: "📖" },
      { it: "studiava", de: "er/sie lernte", emoji: "📚" },
      { it: "lavorava", de: "er/sie arbeitete", emoji: "💼" }
    ],
    sentences: [
      { it: "Da bambino andavo al mare.", de: "Als Kind fuhr ich ans Meer." },
      { it: "Mangiava sempre la pasta.", de: "Er aß immer Pasta." },
      { it: "Dormivo con la finestra aperta.", de: "Ich schlief bei offenem Fenster." },
      { it: "Le nonne cantavano canzoni antiche.", de: "Die Omas sangen alte Lieder." },
      { it: "Mio nonno studiava poco, lavorava molto.", de: "Mein Opa lernte wenig, arbeitete viel." },
      { it: "La nonna leggeva il giornale ogni mattina.", de: "Die Oma las jeden Morgen die Zeitung." },
      { it: "Che belle estati facevamo!", de: "Was für schöne Sommer wir hatten!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["racconto"] },
  {
    id: "m2a-condizionale-corto",
    level: "A2",
    title: "Condizionale corto",
    icon: "🎭",
    scene: "Höflich wollen und können: wäre, würde, könnte — mit den kleinen Wörtern dazwischen.",
    words: [
      { it: "magari", de: "wäre schön", emoji: "🍀" },
      { it: "forse", de: "vielleicht", emoji: "❔" },
      { it: "purtroppo", de: "leider", emoji: "😞" },
      { it: "invece", de: "stattdessen", emoji: "↩️" },
      { it: "sicuramente", de: "sicherlich", emoji: "✅" },
      { it: "davvero", de: "wirklich", emoji: "‼️" },
      { it: "dovremmo", de: "wir sollten", emoji: "🤝" },
      { it: "andrei", de: "ich würde (gern)", emoji: "🚶" }
    ],
    sentences: [
      { it: "Potrei venire domani.", de: "Ich könnte morgen kommen." },
      { it: "Dovresti riposarti.", de: "Du solltest dich ausruhen." },
      { it: "Magari è possibile.", de: "Vielleicht ist es möglich." },
      { it: "Forse hai ragione.", de: "Vielleicht hast du recht." },
      { it: "Dovremmo partire presto.", de: "Wir sollten früh losfahren." },
      { it: "Andrei con voi, ma domani lavoro.", de: "Ich würde gern mitkommen, aber morgen arbeite ich." },
      { it: "Purtroppo non posso.", de: "Leider kann ich nicht." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["emozioni"] },
  {
    id: "m2a-pronomi-schnell",
    level: "A2",
    title: "Pronomi schnell",
    icon: "🤲",
    scene: "Kombinierte Pronomen in echten Sätzen: sagen, leihen, lassen, schreiben — wer bekommt was von wem?",
    words: [
      { it: "glielo", de: "es ihm/ihr", emoji: "🫴" },
      { it: "gliela", de: "sie ihm/ihr", emoji: "🤲" },
      { it: "me la", de: "sie mir", emoji: "🙋" },
      { it: "te le", de: "sie dir", emoji: "🙌" },
      { it: "glieli", de: "sie (pl.) ihm/ihr", emoji: "👉" },
      { it: "gliele", de: "sie (pl.) ihm/ihr", emoji: "👈" },
      { it: "ce lo", de: "es uns", emoji: "👆" },
      { it: "me li", de: "sie (pl.) mir", emoji: "👇" }
    ],
    sentences: [
      { it: "Gliele ho dette ieri.", de: "Ich habe sie ihr gestern gesagt." },
      { it: "Me la presti, per favore?", de: "Leihst du sie mir, bitte?" },
      { it: "Te le lascio sul tavolo.", de: "Ich lasse sie dir auf dem Tisch." },
      { it: "Glielo dico domani.", de: "Ich sage es ihm morgen." },
      { it: "Non me lo dire, ti prego!", de: "Sag es mir bitte nicht!" },
      { it: "I libri? Glieli ho letti tutti.", de: "Die Bücher? Ich habe sie alle gelesen." },
      { it: "Me le dai domani?", de: "Gibst du sie mir morgen?" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["comunicare"] },
  {
    id: "m2a-meglio-peggio",
    level: "A2",
    title: "Più & meno",
    icon: "⚖️",
    scene: "Vergleiche im Alltag: besser oder schlechter, mehr oder weniger — und „Besser spät als nie“.",
    words: [
      { it: "più", de: "mehr", emoji: "➕" },
      { it: "meno", de: "weniger", emoji: "➖" },
      { it: "come", de: "wie / so wie", emoji: "🟰" },
      { it: "quanto", de: "wie viel", emoji: "❓" },
      { it: "molto", de: "sehr / viel", emoji: "💯" },
      { it: "poco", de: "wenig", emoji: "🤏" },
      { it: "migliore", de: "besser / beste(r/s)", emoji: "🥇" },
      { it: "peggiore", de: "schlechter / schlechteste(r/s)", emoji: "🥉" }
    ],
    sentences: [
      { it: "Il tè è meglio del caffè, per me.", de: "Tee ist besser als Kaffee, für mich." },
      { it: "Questa è la migliore!", de: "Das ist die beste!" },
      { it: "Più piano, per favore.", de: "Langsamer, bitte." },
      { it: "Meno sale, più salute.", de: "Weniger Salz, mehr Gesundheit." },
      { it: "Sto meglio di ieri, grazie.", de: "Mir geht es besser als gestern, danke." },
      { it: "Meglio tardi che mai!", de: "Besser spät als nie!" },
      { it: "Il caffè qui è molto più buono.", de: "Der Espresso hier ist viel besser." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["uscire"] },


  {
    id: "primo-lavoro", level: "A2", title: "Il primo giorno di lavoro", icon: "💼",
    scene: "Marcos erster Arbeitstag: passato prossimo erzählen — und mit „da“ sagen, seit wann es läuft.",
    words: [
      { it: "il colloquio", de: "das Vorstellungsgespräch", emoji: "🤝" },
      { it: "lo stipendio", de: "das Gehalt", emoji: "💲" },
      { it: "il turno", de: "die Schicht", emoji: "🕐" },
      { it: "l'esperienza", de: "die Erfahrung", emoji: "📈" },
      { it: "la ditta", de: "die Firma", emoji: "🏭" },
      { it: "il datore di lavoro", de: "der Arbeitgeber", emoji: "🧑‍💼" },
      { it: "assunto", de: "eingestellt", emoji: "✅" }
    ],
    sentences: [
      { it: "Ieri ho iniziato il mio nuovo lavoro.", de: "Gestern habe ich meine neue Arbeit angefangen." },
      { it: "Il colloquio è andato molto bene.", de: "Das Vorstellungsgespräch ist sehr gut gelaufen." },
      { it: "La ditta è piccola ma moderna.", de: "Die Firma ist klein, aber modern." },
      { it: "Il mio datore di lavoro è molto gentile.", de: "Mein Arbeitgeber ist sehr freundlich." },
      { it: "Il turno comincia alle nove.", de: "Die Schicht beginnt um neun Uhr." },
      { it: "Lo stipendio non è alto, ma l'esperienza è importante.", de: "Das Gehalt ist nicht hoch, aber die Erfahrung ist wichtig." },
      { it: "Da lunedì lavoro in centro.", de: "Seit Montag arbeite ich im Zentrum." }
    ],
    build: [1, 4, 6],
    produce: [0, 2, 5],
    covers: ["lavoro2"]
  },
  {
    id: "sorpresa-giulia", level: "A2", title: "Una sorpresa per Giulia", icon: "🎁",
    scene: "Eine Überraschungsparty Planen und Erleben — Imperfetto für die Stimmung, Passato für die Handlungen.",
    words: [
      { it: "la chiamata", de: "der Anruf", emoji: "📞" },
      { it: "il messaggio", de: "die Nachricht", emoji: "💬" },
      { it: "sorpreso", de: "überrascht", emoji: "😲" },
      { it: "preoccupato", de: "besorgt", emoji: "😟" },
      { it: "tranquillo", de: "ruhig / gelassen", emoji: "😌" },
      { it: "curioso", de: "neugierig", emoji: "🤔" },
      { it: "la videochiamata", de: "der Videoanruf", emoji: "📹" }
    ],
    sentences: [
      { it: "Sabato abbiamo organizzato una sorpresa.", de: "Samstag haben wir eine Überraschung organisiert." },
      { it: "Giulia era preoccupata per il ritardo.", de: "Giulia war wegen der Verspätung besorgt." },
      { it: "Le ho mandato un messaggio veloce.", de: "Ich habe ihr eine schnelle Nachricht geschickt." },
      { it: "Poi ho fatto una videochiamata a Marco.", de: "Dann habe ich Marco videoangerufen." },
      { it: "Quando è arrivata, era molto sorpresa.", de: "Als sie ankam, war sie sehr überrascht." },
      { it: "A mezzanotte ho ricevuto un messaggio da parte di Sara.", de: "Um Mitternacht habe ich eine Nachricht von Sara bekommen." },
      { it: "Che bello, le è piaciuto tutto!", de: "Wie schön, ihr hat alles gefallen!" }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    covers: ["emozioni", "comunicare"]
  },
  {
    id: "ordinare", level: "A2", title: "Ordinare come un italiano", icon: "🍽️",
    scene: "Gang für Gang bestellen wie ein Einheimischer — vom Antipasto bis zum dolce.",
    words: [
      { it: "l'antipasto", de: "die Vorspeise", emoji: "🫒" },
      { it: "il primo", de: "der erste Gang", emoji: "🍝" },
      { it: "il secondo", de: "der zweite Gang", emoji: "🍖" },
      { it: "il contorno", de: "die Beilage", emoji: "🥗" },
      { it: "la specialità", de: "die Spezialität", emoji: "⭐" },
      { it: "al dente", de: "al dente", emoji: "🍜" },
      { it: "il cameriere", de: "der Kellner", emoji: "🤵" }
    ],
    sentences: [
      { it: "Buonasera, avete un tavolo per tre?", de: "Guten Abend, haben Sie einen Tisch für drei?" },
      { it: "Il cameriere ci ha portato il menù.", de: "Der Kellner hat uns die Speisekarte gebracht." },
      { it: "Come antipasto ho preso le bruschette.", de: "Als Vorspeise habe ich Bruschetta genommen." },
      { it: "Per primo ho ordinato le tagliatelle al dente.", de: "Als ersten Gang habe ich die Tagliatelle al dente bestellt." },
      { it: "Il secondo era pesce, con contorno di verdure.", de: "Der zweite Gang war Fisch, mit Gemüse als Beilage." },
      { it: "La specialità della casa era squisita.", de: "Die Spezialität des Hauses war köstlich." },
      { it: "Abbiamo mangiato piano, come si deve.", de: "Wir haben langsam gegessen, wie es sich gehört." }
    ],
    build: [1, 3, 6],
    produce: [2, 4, 5],
    covers: ["uscire"]
  },
  {
    id: "gita-montagna", level: "A2", title: "La gita in montagna", icon: "⛰️",
    scene: "Ein Ausflug, der anders kommt als geplant: Wetter, Verspätung, verpasster Anschluss.",
    words: [
      { it: "la previsione", de: "die Wettervorhersage", emoji: "📺" },
      { it: "la nebbia", de: "der Nebel", emoji: "🌫️" },
      { it: "il ghiaccio", de: "das Eis", emoji: "🧊" },
      { it: "mite", de: "mild", emoji: "🍃" },
      { it: "il binario", de: "das Gleis", emoji: "🛤️" },
      { it: "la coincidenza", de: "der Anschluss", emoji: "🔗" },
      { it: "il ritardo", de: "die Verspätung", emoji: "⏱️" },
      { it: "in pullman", de: "mit dem Bus", emoji: "🚌" }
    ],
    sentences: [
      { it: "Sabato siamo andati in montagna in pullman.", de: "Samstag sind wir mit dem Bus ins Gebirge gefahren." },
      { it: "La previsione diceva tempo mite.", de: "Die Vorhersage sagte mildes Wetter." },
      { it: "Invece c'era molta nebbia.", de: "Stattdessen gab es viel Nebel." },
      { it: "Il pullman ha avuto mezz'ora di ritardo.", de: "Der Bus hatte eine halbe Stunde Verspätung." },
      { it: "Alla stazione abbiamo perso la coincidenza.", de: "Am Bahnhof haben wir den Anschluss verpasst." },
      { it: "Il binario era cambiato all'improvviso.", de: "Das Gleis hatte sich plötzlich geändert." },
      { it: "Per fortuna, sopra il passo non c'era ghiaccio.", de: "Zum Glück gab es oben am Pass kein Eis." }
    ],
    build: [0, 4, 6],
    produce: [1, 2, 3],
    covers: ["tempo2", "trasporti2"]
  },
  {
    id: "trasloco", level: "A2", title: "Il trasloco", icon: "📦",
    scene: "Umzug: alter Vertrag zu teuer, neue Wohnung, neue Nachbarn — Vergangenheit und Gegenwart mischen.",
    words: [
      { it: "l'affitto", de: "die Miete", emoji: "🏷️" },
      { it: "la cauzione", de: "die Kaution", emoji: "💰" },
      { it: "il contratto", de: "der Vertrag", emoji: "📄" },
      { it: "ammobiliato", de: "möbliert", emoji: "🛋️" },
      { it: "il vicino", de: "der Nachbar", emoji: "🧑‍🤝‍🧑" },
      { it: "la zona", de: "das Viertel", emoji: "🗺️" },
      { it: "il rumore", de: "der Lärm", emoji: "🔊" }
    ],
    sentences: [
      { it: "Il mese scorso mi sono trasferito.", de: "Letzten Monat bin ich umgezogen." },
      { it: "Ho pagato la cauzione e ho firmato il contratto.", de: "Ich habe die Kaution bezahlt und den Vertrag unterschrieben." },
      { it: "Il vecchio affitto costava troppo.", de: "Die alte Miete kostete zu viel." },
      { it: "L'appartamento è ammobiliato: c'è già tutto.", de: "Die Wohnung ist möbliert: es ist schon alles da." },
      { it: "I vicini fanno un po' di rumore la sera.", de: "Die Nachbarn machen abends etwas Lärm." },
      { it: "Ma la zona è tranquilla e centrale.", de: "Aber das Viertel ist ruhig und zentral." },
      { it: "Mi trovo bene nella nuova casa.", de: "Ich fühle mich im neuen Zuhause wohl." }
    ],
    build: [1, 3, 5],
    produce: [0, 4, 6],
    covers: ["abitare"]
  },
  {
    id: "in-banca", level: "A2", title: "In banca", icon: "🏦",
    scene: "Bankbesuch mit Schlange, Schalter, Ausweis — Abheben und Überweisen in der Vergangenheit.",
    words: [
      { it: "il bancomat", de: "der Geldautomat", emoji: "🏧" },
      { it: "il prelievo", de: "die Abhebung", emoji: "💶" },
      { it: "il bonifico", de: "die Überweisung", emoji: "🏦" },
      { it: "i contanti", de: "das Bargeld", emoji: "💵" },
      { it: "lo sportello", de: "der Schalter", emoji: "🪟" },
      { it: "la carta d'identità", de: "der Personalausweis", emoji: "🪪" },
      { it: "la fila", de: "die Schlange", emoji: "👥" }
    ],
    sentences: [
      { it: "Ieri mattina sono andato in banca.", de: "Gestern Morgen bin ich zur Bank gegangen." },
      { it: "C'era una fila lunghissima.", de: "Es gab eine extrem lange Schlange." },
      { it: "Allo sportello ho mostrato la carta d'identità.", de: "Am Schalter habe ich den Personalausweis gezeigt." },
      { it: "Ho fatto un prelievo di duecento euro.", de: "Ich habe zweihundert Euro abgehoben." },
      { it: "Poi ho fatto un bonifico a mio fratello.", de: "Dann habe ich eine Überweisung an meinen Bruder gemacht." },
      { it: "Preferisco i contanti per le piccole spese.", de: "Ich bevorzuge Bargeld für kleine Ausgaben." },
      { it: "Il bancomat era fuori servizio.", de: "Der Geldautomat war außer Betrieb." }
    ],
    build: [0, 4, 6],
    produce: [2, 3, 5],
    covers: ["servizi"]
  },
  {
    id: "febbre-estate", level: "A2", title: "Una febbre d'estate", icon: "🌡️",
    scene: "Grippe im Juli: Imperfetto für die Symptome, Passato für den Arztbesuch.",
    words: [
      { it: "la febbre", de: "das Fieber", emoji: "🌡️" },
      { it: "il raffreddore", de: "die Erkältung", emoji: "🤧" },
      { it: "l'influenza", de: "die Grippe", emoji: "🦠" },
      { it: "la ricetta", de: "das Rezept", emoji: "📜" },
      { it: "la pillola", de: "die Tablette", emoji: "💊" },
      { it: "il pronto soccorso", de: "die Notaufnahme", emoji: "🚑" },
      { it: "la visita", de: "die (ärztliche) Untersuchung", emoji: "🩺" }
    ],
    sentences: [
      { it: "A luglio ho avuto l'influenza, incredibile!", de: "Im Juli hatte ich die Grippe, unglaublich!" },
      { it: "La febbre saliva la sera.", de: "Das Fieber stieg am Abend." },
      { it: "Il raffreddore non mi passava.", de: "Die Erkältung ging mir nicht weg." },
      { it: "Sono andato dal medico per una visita.", de: "Ich bin für eine Untersuchung zum Arzt gegangen." },
      { it: "Mi ha scritto una ricetta semplice.", de: "Er hat mir ein einfaches Rezept geschrieben." },
      { it: "Ho preso una pillola dopo i pasti.", de: "Ich habe nach den Mahlzeiten eine Tablette genommen." },
      { it: "Dopo tre giorni stavo già meglio.", de: "Nach drei Tagen ging es mir schon besser." }
    ],
    build: [0, 3, 5],
    produce: [1, 2, 6],
    covers: ["salute2"]
  },
  {
    id: "regalo-perfetto", level: "A2", title: "Il regalo perfetto", icon: "🎀",
    scene: "Gemeinsam Geschenke organisieren: Chat, Vorschläge, Verkäuferin — und piacere am Ende.",
    words: [
      { it: "il messaggio", de: "die Nachricht", emoji: "💬" },
      { it: "la chat", de: "der Chat", emoji: "📱" },
      { it: "la suoneria", de: "der Klingelton", emoji: "🔔" },
      { it: "la sciarpa", de: "der Schal", emoji: "🧣" },
      { it: "comodo", de: "bequem", emoji: "😌" },
      { it: "elegante", de: "elegant", emoji: "🤵" },
      { it: "il pacchetto", de: "das Geschenkpäckchen", emoji: "🎁" }
    ],
    sentences: [
      { it: "Il compleanno di Sara era vicino.", de: "Saras Geburtstag stand vor der Tür." },
      { it: "Abbiamo aperto una chat per il regalo.", de: "Wir haben einen Chat für das Geschenk eröffnet." },
      { it: "Marco ha proposto una sciarpa elegante.", de: "Marco hat einen eleganten Schal vorgeschlagen." },
      { it: "Il negozio aveva anche cinture comode.", de: "Das Geschäft hatte auch bequeme Gürtel." },
      { it: "La commessa ha fatto il pacchetto regalo.", de: "Die Verkäuferin hat das Geschenkpäckchen gemacht." },
      { it: "A mezzanotte ho ricevuto un messaggio di Sara.", de: "Um Mitternacht habe ich eine Nachricht von Sara bekommen." },
      { it: "Che bello, le è piaciuto tutto!", de: "Wie schön, ihr hat alles gefallen!" }
    ],
    build: [2, 4, 5],
    produce: [0, 3, 6],
    covers: ["comunicare", "abiti2"]
  },
  {
    id: "amici-volta", level: "A2", title: "Gli amici di una volta", icon: "👥",
    scene: "Wiedersehen mit einem alten Freund: Kindheit im Imperfetto, Gegenwart im Passato.",
    words: [
      { it: "il ricordo", de: "die Erinnerung", emoji: "🧠" },
      { it: "l'infanzia", de: "die Kindheit", emoji: "👶" },
      { it: "una volta", de: "einmal / früher", emoji: "📖" },
      { it: "di solito", de: "gewöhnlich", emoji: "🕰️" },
      { it: "l'abitudine", de: "die Gewohnheit", emoji: "🔄" },
      { it: "il passato", de: "die Vergangenheit", emoji: "⏳" }
    ],
    sentences: [
      { it: "Sabato ho incontrato Paolo, un amico di una volta.", de: "Samstag habe ich Paolo getroffen, einen alten Freund." },
      { it: "Da bambini eravamo vicini di casa.", de: "Als Kinder waren wir Nachbarn." },
      { it: "Di solito andavamo a scuola insieme.", de: "Gewöhnlich gingen wir zusammen zur Schule." },
      { it: "Avevamo l'abitudine di giocare a calcio.", de: "Wir hatten die Gewohnheit, Fußball zu spielen." },
      { it: "Ci siamo raccontati tanti ricordi.", de: "Wir haben uns viele Erinnerungen erzählt." },
      { it: "Il passato ritorna, quando meno te lo aspetti.", de: "Die Vergangenheit kommt zurück, wenn man es am wenigsten erwartet." },
      { it: "È stata una giornata speciale.", de: "Es war ein besonderer Tag." }
    ],
    build: [1, 2, 4],
    produce: [0, 3, 5],
    covers: ["racconto"]
  },
  {
    id: "concerto-piazza", level: "A2", title: "Il concerto in piazza", icon: "🎤",
    scene: "Sommerkonzert mit Gewitter-Zwischenspiel — Wetter im Imperfetto und Passato.",
    words: [
      { it: "la temperatura", de: "die Temperatur", emoji: "🌡️" },
      { it: "afoso", de: "schwül", emoji: "🥵" },
      { it: "umido", de: "feucht / schwül", emoji: "💧" },
      { it: "il tuono", de: "der Donner", emoji: "⛈️" },
      { it: "il fulmine", de: "der Blitz", emoji: "⚡" },
      { it: "l'arcobaleno", de: "der Regenbogen", emoji: "🌈" },
      { it: "il grado", de: "das Grad", emoji: "📏" }
    ],
    sentences: [
      { it: "Sabato sera c'era un concerto in piazza.", de: "Samstagabend gab es ein Konzert auf dem Platz." },
      { it: "La temperatura era di trenta gradi.", de: "Die Temperatur war dreißig Grad." },
      { it: "L'aria era afosa e umida.", de: "Die Luft war schwül und feucht." },
      { it: "All'improvviso si è sentito un tuono.", de: "Plötzlich hörte man einen Donner." },
      { it: "Un fulmine ha illuminato il cielo.", de: "Ein Blitz hat den Himmel erleuchtet." },
      { it: "È piovuto per dieci minuti soltanto.", de: "Es hat nur zehn Minuten geregnet." },
      { it: "Dopo la pioggia è apparso un arcobaleno.", de: "Nach dem Regen erschien ein Regenbogen." }
    ],
    build: [1, 3, 5],
    produce: [2, 4, 6],
    covers: ["tempo2"]
  },
  {
    id: "treno-sette", level: "A2", title: "Il treno delle sette", icon: "🚄",
    scene: "Morgenbahn, Kontrolle, ein Schwarzfahrer — nebensächliche Geschichten auf Schienen.",
    words: [
      { it: "il passeggero", de: "der Passagier", emoji: "🧍" },
      { it: "il controllore", de: "der Schaffner", emoji: "🧑‍✈️" },
      { it: "diretto", de: "direkt / durchgehend", emoji: "🚄" },
      { it: "il cambio", de: "das Umsteigen", emoji: "🔀" },
      { it: "il binario", de: "das Gleis", emoji: "🛤️" },
      { it: "in orario", de: "pünktlich", emoji: "⌚" },
      { it: "la multa", de: "das Bußgeld", emoji: "🚨" }
    ],
    sentences: [
      { it: "Il treno delle sette era pieno di passeggeri.", de: "Der Sieben-Uhr-Zug war voller Passagiere." },
      { it: "Il controllore scendeva lungo il corridoio.", de: "Der Schaffner kam den Gang entlang." },
      { it: "Un signore non aveva il biglietto.", de: "Ein Herr hatte kein Ticket." },
      { it: "Ha dovuto pagare una multa.", de: "Er musste ein Bußgeld zahlen." },
      { it: "Sono sceso a Bologna per il cambio.", de: "Ich bin in Bologna zum Umsteigen ausgestiegen." },
      { it: "Il treno dopo era diretto, senza fermate.", de: "Der folgende Zug war direkt, ohne Halt." },
      { it: "Alla fine sono arrivato in orario.", de: "Am Ende bin ich pünktlich angekommen." }
    ],
    build: [0, 4, 6],
    produce: [2, 3, 5],
    covers: ["trasporti2"]
  },
  {
    id: "natale-famiglia", level: "A2", title: "Natale in famiglia", icon: "🎄",
    scene: "Weihnachten in den Bergen: Wollschal von Oma, Überraschung in der Tasche — Objektpronomen inklusive.",
    words: [
      { it: "di lana", de: "aus Wolle", emoji: "🐑" },
      { it: "la sciarpa", de: "der Schal", emoji: "🧣" },
      { it: "i guanti", de: "die Handschuhe", emoji: "🧤" },
      { it: "il bottone", de: "der Knopf", emoji: "🔘" },
      { it: "la tasca", de: "die Tasche (Kleidung)", emoji: "🧥" },
      { it: "comodo", de: "bequem", emoji: "😌" },
      { it: "sportivo", de: "sportlich", emoji: "🏃" }
    ],
    sentences: [
      { it: "A Natale fa sempre freddo in montagna.", de: "Zu Weihnachten ist es in den Bergen immer kalt." },
      { it: "La nonna mi ha fatto una sciarpa di lana.", de: "Die Oma hat mir einen Wollschal gemacht." },
      { it: "I guanti li ho ricevuti da zio Luca.", de: "Die Handschuhe habe ich von Onkel Luca bekommen." },
      { it: "Il maglione aveva un bottone in più.", de: "Der Pullover hatte einen Knopf zu viel." },
      { it: "Nella tasca ho trovato una sorpresa.", de: "In der Tasche habe ich eine Überraschung gefunden." },
      { it: "Eravamo tutti contenti e un po' pigri.", de: "Wir waren alle froh und ein bisschen faul." },
      { it: "Che Natale comodo, senza fretta!", de: "Was für ein bequemes Weihnachtsfest, ohne Eile!" }
    ],
    build: [1, 3, 4],
    produce: [0, 2, 6],
    covers: ["abiti2", "emozioni"]
  },
  {
    id: "nuova-vicina", level: "A2", title: "La nuova vicina", icon: "🏡",
    scene: "Eine Nachbarin zieht ein: Klingel am Citofono, erst schüchtern, dann neugierig.",
    words: [
      { it: "il vicino", de: "der Nachbar", emoji: "🧑‍🤝‍🧑" },
      { it: "il citofono", de: "die Gegensprechanlage", emoji: "🔔" },
      { it: "il portone", de: "das Haustor", emoji: "🚪" },
      { it: "silenzioso", de: "leise / ruhig", emoji: "🤫" },
      { it: "timido", de: "schüchtern", emoji: "😳" },
      { it: "disponibile", de: "hilfsbereit / verfügbar", emoji: "🤝" },
      { it: "curioso", de: "neugierig", emoji: "🤔" }
    ],
    sentences: [
      { it: "La settimana scorsa è arrivata una nuova vicina.", de: "Letzte Woche ist eine neue Nachbarin eingezogen." },
      { it: "Ha suonato al citofono per presentarsi.", de: "Sie hat an der Gegensprechanlage geklingelt, um sich vorzustellen." },
      { it: "Il portone era aperto, così è salita.", de: "Das Haustor war offen, so kam sie hoch." },
      { it: "All'inizio sembrava timida.", de: "Anfangs wirkte sie schüchtern." },
      { it: "Invece è molto disponibile e curiosa.", de: "Stattdessen ist sie sehr hilfsbereit und neugierig." },
      { it: "Il palazzo è silenzioso di giorno.", de: "Das Gebäude ist tagsüber still." },
      { it: "Che fortuna, una persona così!", de: "Was für ein Glück, so ein Mensch!" }
    ],
    build: [1, 3, 4],
    produce: [0, 2, 6],
    covers: ["abitare", "emozioni"]
  },
  {
    id: "sciopero-treni", level: "A2", title: "Lo sciopero dei treni", icon: "🚨",
    scene: "Streiktag: Züge verspätet, Passagiere verärgert, Arbeitnehmer fordern mehr Lohn.",
    words: [
      { it: "lo sciopero", de: "der Streik", emoji: "🪧" },
      { it: "l'azienda", de: "der Betrieb", emoji: "🏬" },
      { it: "il turno", de: "die Schicht", emoji: "🕐" },
      { it: "la paga", de: "der Lohn", emoji: "💲" },
      { it: "il ritardo", de: "die Verspätung", emoji: "⏱️" },
      { it: "la multa", de: "das Bußgeld", emoji: "🚨" },
      { it: "il passeggero", de: "der Passagier", emoji: "🧍" }
    ],
    sentences: [
      { it: "Venerdì c'era lo sciopero dei treni.", de: "Freitag gab es den Bahnstreik." },
      { it: "L'azienda ha comunicato i ritardi.", de: "Der Betrieb hat die Verspätungen mitgeteilt." },
      { it: "Molti treni hanno avuto lunghi ritardi.", de: "Viele Züge hatten lange Verspätungen." },
      { it: "Alcuni passeggeri erano arrabbiati.", de: "Einige Passagiere waren verärgert." },
      { it: "I dipendenti chiedevano una paga più giusta.", de: "Die Beschäftigten forderten einen gerechteren Lohn." },
      { it: "Il mio turno cominciava alle dieci.", de: "Meine Schicht begann um zehn Uhr." },
      { it: "Sono arrivato comunque in orario, in autobus.", de: "Ich bin trotzdem pünktlich angekommen, mit dem Bus." }
    ],
    build: [0, 4, 6],
    produce: [1, 3, 5],
    covers: ["trasporti2", "lavoro2"]
  },
  {
    id: "corso-cucina", level: "A2", title: "Il corso di cucina", icon: "👩‍🍳",
    scene: "Kochkurs mit strengem Chef: „Mescolate piano!“ — Imperativ-voi und Gänge-Vokabular.",
    words: [
      { it: "la specialità", de: "die Spezialität", emoji: "⭐" },
      { it: "al dente", de: "al dente", emoji: "🍜" },
      { it: "ben cotto", de: "durchgebraten", emoji: "🍳" },
      { it: "la porzione", de: "die Portion", emoji: "🍽️" },
      { it: "il grembiule", de: "die Schürze", emoji: "👔" },
      { it: "squisito", de: "köstlich", emoji: "🤤" }
    ],
    sentences: [
      { it: "Al corso di cucina ho imparato tante cose.", de: "Im Kochkurs habe ich viel gelernt." },
      { it: "Lo chef ci ha dato un grembiule bianco.", de: "Der Koch hat uns eine weiße Schürze gegeben." },
      { it: "Mescolate piano, ha detto, e assaggiate spesso!", de: "Rührt langsam, hat er gesagt, und kostet oft!" },
      { it: "La carne era ben cotta, la pasta al dente.", de: "Das Fleisch war durchgebraten, die Pasta al dente." },
      { it: "Ogni porzione era piccola ma squisita.", de: "Jede Portion war klein, aber köstlich." },
      { it: "La specialità finale era il tiramisù.", de: "Die finale Spezialität war das Tiramisù." },
      { it: "Il corso è costato trenta euro per due ore.", de: "Der Kurs hat dreißig Euro für zwei Stunden gekostet." }
    ],
    build: [2, 4, 5],
    produce: [0, 3, 6],
    covers: ["uscire"]
  },
  {
    id: "chiacchiere-bar", level: "A2", title: "Chiacchiere al bar", icon: "☕",
    scene: "Klingelndes Telefon, besetzte Leitung, Beantworter — Kommunikation im Alltag.",
    words: [
      { it: "la chat", de: "der Chat", emoji: "📱" },
      { it: "la chiamata", de: "der Anruf", emoji: "📞" },
      { it: "la segreteria", de: "der Anrufbeantworter", emoji: "📼" },
      { it: "occupato", de: "besetzt", emoji: "🚫" },
      { it: "il segnale", de: "das Signal", emoji: "📡" },
      { it: "la linea", de: "die Leitung", emoji: "📶" },
      { it: "la suoneria", de: "der Klingelton", emoji: "🔔" }
    ],
    sentences: [
      { it: "Al bar si parla di tutto.", de: "In der Bar spricht man über alles." },
      { it: "Ieri il telefono di Anna non smetteva di suonare.", de: "Gestern hörte Annas Telefon nicht auf zu klingeln." },
      { it: "La suoneria era altissima.", de: "Der Klingelton war sehr laut." },
      { it: "Marco ha provato una chiamata, ma la linea era occupata.", de: "Marco hat einen Anruf versucht, aber die Leitung war besetzt." },
      { it: "Allora le ha lasciato un messaggio in segreteria.", de: "Dann hat er ihr eine Nachricht auf den Beantworter gesprochen." },
      { it: "Il segnale non prende in quell'angolo del bar.", de: "In der Ecke der Bar gibt es keinen Empfang." },
      { it: "Alla fine si sono sentiti in chat.", de: "Am Ende haben sie sich im Chat geschrieben." }
    ],
    build: [1, 3, 5],
    produce: [2, 4, 6],
    covers: ["comunicare"]
  },
  {
    id: "loft-luca", level: "A2", title: "Il loft di Luca", icon: "🛋️",
    scene: "Lucas neues Loft: hohe Miete, leere Räume, Markt um die Ecke.",
    words: [
      { it: "la zona", de: "das Viertel", emoji: "🗺️" },
      { it: "il vicino", de: "der Nachbar", emoji: "🧑‍🤝‍🧑" },
      { it: "ammobiliato", de: "möbliert", emoji: "🛋️" },
      { it: "la spesa", de: "der Einkauf", emoji: "🛍️" },
      { it: "silenzioso", de: "leise / ruhig", emoji: "🤫" },
      { it: "il rumore", de: "der Lärm", emoji: "🔊" },
      { it: "l'affitto", de: "die Miete", emoji: "🏷️" }
    ],
    sentences: [
      { it: "Luca ha trovato un loft in centro.", de: "Luca hat ein Loft im Zentrum gefunden." },
      { it: "La zona è viva, piena di negozi.", de: "Das Viertel ist lebendig, voller Geschäfte." },
      { it: "L'affitto è alto, ma la casa è bellissima.", de: "Die Miete ist hoch, aber das Haus ist wunderschön." },
      { it: "Il loft non è ammobiliato: serve tutto.", de: "Das Loft ist nicht möbliert: es fehlt alles." },
      { it: "Per la spesa c'è un mercato qui vicino.", de: "Für den Einkauf gibt es hier einen Markt in der Nähe." },
      { it: "L'unico problema è il rumore la sera.", de: "Das einzige Problem ist der Lärm am Abend." },
      { it: "Per il resto, i vicini sono gentili.", de: "Ansonsten sind die Nachbarn freundlich." }
    ],
    build: [0, 2, 4],
    produce: [3, 5, 6],
    covers: ["abitare"]
  },
  {
    id: "ferragosto", level: "A2", title: "Ferragosto", icon: "☀️",
    scene: "Italiens heißester Feiertag: Schwüle am Meer, milde Luft im Gebirge.",
    words: [
      { it: "la temperatura", de: "die Temperatur", emoji: "🌡️" },
      { it: "la previsione", de: "die Wettervorhersage", emoji: "📺" },
      { it: "afoso", de: "schwül", emoji: "🥵" },
      { it: "umido", de: "feucht / schwül", emoji: "💧" },
      { it: "secco", de: "trocken", emoji: "🏜️" },
      { it: "mite", de: "mild", emoji: "🍃" },
      { it: "il grado", de: "das Grad", emoji: "📏" }
    ],
    sentences: [
      { it: "A Ferragosto tutti vanno al mare.", de: "Zu Ferragosto fahren alle ans Meer." },
      { it: "La previsione diceva trentotto gradi.", de: "Die Vorhersage sagte achtunddreißig Grad." },
      { it: "L'aria era afosa anche la mattina.", de: "Die Luft war auch morgens schwül." },
      { it: "La sera la temperatura scendeva a trenta.", de: "Abends sank die Temperatur auf dreißig." },
      { it: "Il vento era secco e leggero.", de: "Der Wind war trocken und leicht." },
      { it: "In montagna, invece, l'aria era mite.", de: "Im Gebirge war die Luft dagegen mild." },
      { it: "Che caldo, quell'agosto!", de: "Was für eine Hitze, dieser August!" }
    ],
    build: [1, 3, 5],
    produce: [2, 4, 6],
    covers: ["tempo2"]
  },
  {
    id: "laurea-futuro", level: "A2", title: "Laurea e futuro", icon: "🎓",
    scene: "Martina ist fertig: Diplom, Lebenslauf, drei Gespräche — und ein Blick nach vorn.",
    words: [
      { it: "laurea", de: "der Abschluss (Laurea)", emoji: "🎓" },
      { it: "la tesi", de: "die Abschlussarbeit", emoji: "📜" },
      { it: "il curriculum", de: "der Lebenslauf", emoji: "📑" },
      { it: "l'esperienza", de: "die Erfahrung", emoji: "📈" },
      { it: "la ditta", de: "die Firma", emoji: "🏭" },
      { it: "lo stipendio", de: "das Gehalt", emoji: "💲" },
      { it: "il colloquio", de: "das Vorstellungsgespräch", emoji: "🤝" }
    ],
    sentences: [
      { it: "Martina si è laureata con lode.", de: "Martina hat mit Auszeichnung abgeschlossen." },
      { it: "La tesi era sul turismo sostenibile.", de: "Die Abschlussarbeit war über nachhaltigen Tourismus." },
      { it: "Ha mandato il curriculum a dieci ditte.", de: "Sie hat den Lebenslauf an zehn Firmen geschickt." },
      { it: "Tre ditte le hanno offerto un colloquio.", de: "Drei Firmen haben ihr ein Gespräch angeboten." },
      { it: "Con l'esperienza giusta, lo stipendio salirà.", de: "Mit der richtigen Erfahrung wird das Gehalt steigen." },
      { it: "Martina pensava già al futuro.", de: "Martina dachte schon an die Zukunft." },
      { it: "Le auguriamo una carriera brillante!", de: "Wir wünschen ihr eine glänzende Karriere!" }
    ],
    build: [1, 3, 4],
    produce: [0, 2, 6],
    covers: ["lavoro2"]
  },
  {
    id: "ritorno-viaggio", level: "A2", title: "Il ritorno dal viaggio", icon: "🧳",
    scene: "Rückreise-Erzählung: Seilbahn-Erinnerung, verpasster Anschluss, Direktzug als Rettung.",
    words: [
      { it: "il ricordo", de: "die Erinnerung", emoji: "🧠" },
      { it: "il passato", de: "die Vergangenheit", emoji: "⏳" },
      { it: "la coincidenza", de: "der Anschluss", emoji: "🔗" },
      { it: "diretto", de: "direkt / durchgehend", emoji: "🚄" },
      { it: "il controllo", de: "die Kontrolle", emoji: "🎫" },
      { it: "la funivia", de: "die Seilbahn", emoji: "🚡" },
      { it: "il ritardo", de: "die Verspätung", emoji: "⏱️" }
    ],
    sentences: [
      { it: "Siamo tornati ieri dal viaggio in Trentino.", de: "Wir sind gestern von der Reise aus Trentino zurückgekommen." },
      { it: "Il ricordo più bello? La funivia sul lago.", de: "Die schönste Erinnerung? Die Seilbahn über dem See." },
      { it: "Salendo si vedeva tutto il lago.", de: "Beim Hinauffahren sah man den ganzen See." },
      { it: "Abbiamo perso una coincidenza, ma abbiamo preso un diretto.", de: "Wir haben einen Anschluss verpasst, aber einen Direkten genommen." },
      { it: "Alla stazione ci aspettava un controllo.", de: "Am Bahnhof erwartete uns eine Kontrolle." },
      { it: "Con mezz'ora di ritardo, siamo arrivati.", de: "Mit einer halben Stunde Verspätung sind wir angekommen." },
      { it: "Torneremo, questo è poco ma sicuro.", de: "Wir werden wiederkommen, das ist so sicher wie das Amen in der Kirche." }
    ],
    build: [1, 4, 5],
    produce: [0, 3, 6],
    covers: ["racconto", "trasporti2"]
  },

  /* ---------- A2-Minis: M2b (31 Kombinations-Drills) ---------- */

  {
    id: "m2b-imperfetto-abitudini",
    level: "A2",
    title: "Wir waren immer…",
    icon: "🕰️",
    scene: "Imperfetto-Gewohnheiten im Wir: Sommer am Meer, Sandschlösser — früher gab es mehr Zeit.",
    words: [
      { it: "una volta", de: "einmal / früher", emoji: "📖" },
      { it: "andavamo", de: "wir gingen / fuhren", emoji: "🚶" },
      { it: "giocavamo", de: "wir spielten", emoji: "🎾" },
      { it: "mangiavamo", de: "wir aßen", emoji: "🍽️" },
      { it: "scrivevo", de: "ich schrieb", emoji: "✍️" },
      { it: "ogni tanto", de: "ab und zu", emoji: "🔁" },
      { it: "raccontavano", de: "sie erzählten", emoji: "🗣️" },
      { it: "facevamo", de: "wir machten", emoji: "🛠️" }
    ],
    sentences: [
      { it: "Andavamo al mare ogni estate.", de: "Wir fuhren jeden Sommer ans Meer." },
      { it: "Giocavamo fino a sera.", de: "Wir spielten bis zum Abend." },
      { it: "Ogni tanto scrivevo un diario.", de: "Ab und zu schrieb ich ein Tagebuch." },
      { it: "Mangiavamo pane e marmellata.", de: "Wir aßen Brot und Marmelade." },
      { it: "I nonni raccontavano storie lunghe.", de: "Die Großeltern erzählten lange Geschichten." },
      { it: "Facevamo i castelli di sabbia.", de: "Wir bauten Sandschlösser." },
      { it: "Una volta c'era più tempo.", de: "Früher gab es mehr Zeit." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["racconto"] },
  {
    id: "m2b-passato-imperfetto",
    level: "A2",
    title: "Passato o imperfetto?",
    icon: "⚖️",
    scene: "Der Kontrast in echten Sätzen: Was lief nebenher (imperfetto), was brach die Szene (passato)?",
    words: [
      { it: "era", de: "es war (imperfetto)", emoji: "🌫️" },
      { it: "è stato", de: "es ist gewesen (passato)", emoji: "✨" },
      { it: "ascoltavo", de: "ich hörte", emoji: "🎧" },
      { it: "il ricordo", de: "die Erinnerung", emoji: "🧠" },
      { it: "il passato", de: "die Vergangenheit", emoji: "⏳" },
      { it: "di solito", de: "gewöhnlich", emoji: "🕰️" },
      { it: "succedeva", de: "geschah", emoji: "❓" }
    ],
    sentences: [
      { it: "Mentre ascoltavo musica, è suonato il telefono.", de: "Während ich Musik hörte, klingelte das Telefon." },
      { it: "Era una sera tranquilla.", de: "Es war ein ruhiger Abend." },
      { it: "Il film è stato lungo ma bello.", de: "Der Film war lang, aber schön." },
      { it: "Di solito non telefona nessuno.", de: "Normalerweise ruft niemand an." },
      { it: "Mentre studiavo, mio fratello guardava un film.", de: "Während ich lernte, sah mein Bruder einen Film." },
      { it: "Che cosa è successo dopo?", de: "Was ist dann passiert?" },
      { it: "Ancora oggi mi ricordo quel giorno.", de: "Bis heute erinnere ich mich an diesen Tag." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["racconto"] },
  {
    id: "m2b-vorrei",
    level: "A2",
    title: "Vorrei-Training",
    icon: "🍝",
    scene: "Condizionale höflich bestellen: vom Antipasto bis zum Tiramisù — alle Gänge auf Italienisch.",
    words: [
      { it: "vorremmo", de: "wir möchten", emoji: "🙏" },
      { it: "vorrebbero", de: "sie möchten", emoji: "👥" },
      { it: "gradirei", de: "ich hätte gern (formell)", emoji: "🎩" },
      { it: "l'antipasto", de: "die Vorspeise", emoji: "🫒" },
      { it: "il primo", de: "der erste Gang", emoji: "🍝" },
      { it: "il contorno", de: "die Beilage", emoji: "🥗" },
      { it: "il secondo", de: "der zweite Gang", emoji: "🍖" },
      { it: "il dolce", de: "der Nachtisch", emoji: "🍰", key: "word_ristorante_dolce" }
    ],
    sentences: [
      { it: "Gradirei un antipasto misto.", de: "Ich hätte gern einen gemischten Vorspeisenteller." },
      { it: "Noi vorremmo il primo a base di pesce.", de: "Wir würden gern den ersten Gang mit Fisch haben." },
      { it: "Loro vorrebbero anche un contorno.", de: "Sie hätten gern auch eine Beilage." },
      { it: "Per secondo, gradirei la specialità.", de: "Als zweiten Gang hätte ich gern die Spezialität." },
      { it: "Per dolce, vorrei il tiramisù.", de: "Als Nachtisch hätte ich gern Tiramisu." },
      { it: "Per secondo prendo il pesce.", de: "Als zweiten Gang nehme ich den Fisch." },
      { it: "Gradirei anche un caffè, grazie.", de: "Ich hätte gern auch einen Espresso, danke." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["uscire"] },
  {
    id: "m2b-bitte",
    level: "A2",
    title: "Höflich bitten",
    icon: "📮",
    scene: "Potrei, dovrei, potresti auf dem Postamt: Pakete, Briefmarken und ein Schalterpersonal, das „Subito“ sagt.",
    words: [
      { it: "dovrei", de: "ich müsste", emoji: "🤔" },
      { it: "potresti", de: "könntest du", emoji: "🙌" },
      { it: "potremmo", de: "wir könnten", emoji: "🤝" },
      { it: "il francobollo", de: "die Briefmarke", emoji: "📮" },
      { it: "la busta", de: "der Briefumschlag", emoji: "✉️" },
      { it: "il pacco", de: "das Paket", emoji: "📦" },
      { it: "subito", de: "sofort", emoji: "⚡", key: "word_avverbi_a1_subito" },
      { it: "prego", de: "bitte schön", emoji: "🙆", key: "word_saluti_prego" }
    ],
    sentences: [
      { it: "Potrei avere un francobollo per la Germania?", de: "Könnte ich eine Briefmarke für Deutschland haben?" },
      { it: "Dovrei spedire questo pacco oggi.", de: "Ich müsste dieses Paket heute verschicken." },
      { it: "Potresti firmare qui, per favore?", de: "Könntest du hier unterschreiben, bitte?" },
      { it: "Potremmo pagare con la carta?", de: "Könnten wir mit Karte zahlen?" },
      { it: "Subito, ecco il pacco.", de: "Sofort, hier ist das Paket." },
      { it: "Mi scusi, quanto costa spedire?", de: "Entschuldigen Sie, wie viel kostet das Verschicken?" },
      { it: "Prego, ecco il modulo.", de: "Bitte schön, hier ist das Formular." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["servizi"] },
  {
    id: "m2b-imperativo-tu",
    level: "A2",
    title: "Ratschläge (tu)",
    icon: "💊",
    scene: "Du-Imperativ für die Genesung: nimm, trink, schlaf — und jeden Tag ein bisschen spazieren.",
    words: [
      { it: "bevi", de: "trink", emoji: "🥤" },
      { it: "riposa", de: "ruh dich aus", emoji: "🛌" },
      { it: "prendi", de: "nimm", emoji: "💊" },
      { it: "torna", de: "komm wieder", emoji: "↩️" },
      { it: "la tisana", de: "der Kräutertee", emoji: "🍵" },
      { it: "la pillola", de: "die Tablette", emoji: "💊" },
      { it: "dormi", de: "schlaf", emoji: "😴" },
      { it: "cammina", de: "geh spazieren", emoji: "🚶" }
    ],
    sentences: [
      { it: "Prendi la pillola con l'acqua.", de: "Nimm die Tablette mit Wasser." },
      { it: "Bevi una tisana calda la sera.", de: "Trink abends einen heißen Kräutertee." },
      { it: "Riposa almeno due giorni.", de: "Ruh dich mindestens zwei Tage aus." },
      { it: "Se la febbre continua, torna dal medico.", de: "Wenn das Fieber bleibt, geh wieder zum Arzt." },
      { it: "Mangia qualcosa di leggero.", de: "Iss etwas Leichtes." },
      { it: "Dormi almeno otto ore.", de: "Schlaf mindestens acht Stunden." },
      { it: "Cammina un po' ogni giorno.", de: "Geh jeden Tag ein bisschen spazieren." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["salute2"] },
  {
    id: "m2b-imperativo-lei",
    level: "A2",
    title: "Höflich (Lei)",
    icon: "🏛️",
    scene: "Lei-Imperativ im Amt: füllen Sie aus, setzen Sie sich, vergessen Sie die Unterschrift nicht!",
    words: [
      { it: "compili", de: "füllen Sie aus", emoji: "📋" },
      { it: "metta", de: "setzen Sie", emoji: "✍️" },
      { it: "aspetti", de: "warten Sie", emoji: "⏳" },
      { it: "il modulo", de: "das Formular", emoji: "📋" },
      { it: "la firma", de: "die Unterschrift", emoji: "🖋️" },
      { it: "lo sportello", de: "der Schalter", emoji: "🪟" },
      { it: "si accomodi", de: "nehmen Sie Platz", emoji: "🪑" },
      { it: "scusi", de: "Entschuldigung (höflich)", emoji: "🙇", key: "word_saluti_scusi" }
    ],
    sentences: [
      { it: "Compili il modulo, per favore.", de: "Füllen Sie das Formular aus, bitte." },
      { it: "Metta la firma qui, per favore.", de: "Setzen Sie hier bitte Ihre Unterschrift." },
      { it: "Aspetti il suo numero, prego.", de: "Warten Sie bitte auf Ihre Nummer." },
      { it: "Lo sportello cinque è libero.", de: "Schalter fünf ist frei." },
      { it: "Si accomodi, la chiamo tra poco.", de: "Setzen Sie sich, ich rufe Sie gleich auf." },
      { it: "Scusi, quale sportello per i pacchi?", de: "Entschuldigung, welcher Schalter ist für Pakete?" },
      { it: "Non dimentichi la firma!", de: "Vergessen Sie die Unterschrift nicht!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["servizi"] },
  {
    id: "m2b-pronomi-diretti",
    level: "A2",
    title: "lo, la, li, le",
    icon: "🤲",
    scene: "Direkte Pronomen statt Namen: rufen, sehen, suchen, wissen — was klingt hier überhaupt nach?",
    words: [
      { it: "lo chiamo", de: "ich rufe ihn", emoji: "📞" },
      { it: "la vedo", de: "ich sehe sie", emoji: "👀" },
      { it: "li aspetto", de: "ich erwarte sie (m.)", emoji: "🧍" },
      { it: "le scrivo", de: "ich schreibe sie (f.)", emoji: "✍️" },
      { it: "il messaggio", de: "die Nachricht", emoji: "💬" },
      { it: "la chat", de: "der Chat", emoji: "📱" },
      { it: "lo so", de: "ich weiß es", emoji: "💡" },
      { it: "li prendo", de: "ich nehme sie (m.)", emoji: "🤲" }
    ],
    sentences: [
      { it: "Marco? Lo chiamo stasera.", de: "Marco? Ich rufe ihn heute Abend an." },
      { it: "Anna? La vedo domani.", de: "Anna? Ich sehe sie morgen." },
      { it: "I ragazzi? Li aspetto qui.", de: "Die Jungs? Ich erwarte sie hier." },
      { it: "Le lettere? Le scrivo raramente.", de: "Briefe? Die schreibe ich selten." },
      { it: "Il libro? Lo leggo domani.", de: "Das Buch? Das lese ich morgen." },
      { it: "Le chiavi? Le cerco da dieci minuti.", de: "Die Schlüssel? Ich suche sie seit zehn Minuten." },
      { it: "Lo so, è facile!", de: "Ich weiß es, es ist einfach!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["comunicare"] },
  {
    id: "m2b-pronomi-indiretti",
    level: "A2",
    title: "mi, ti, gli",
    icon: "💬",
    scene: "Indirekte Pronomen im Alltag: schreiben, antworten, anrufen — wem schreibst du eigentlich?",
    words: [
      { it: "mi scrive", de: "er/sie schreibt mir", emoji: "📨" },
      { it: "ti dice", de: "er/sie sagt dir", emoji: "🗣️" },
      { it: "gli parlo", de: "ich spreche mit ihm", emoji: "🧑" },
      { it: "le chiedo", de: "ich frage sie", emoji: "🙋" },
      { it: "il messaggio", de: "die Nachricht", emoji: "💬" },
      { it: "la chat", de: "der Chat", emoji: "📱" },
      { it: "vi scrivo", de: "ich schreibe euch", emoji: "✉️" },
      { it: "le rispondo", de: "ich antworte ihr", emoji: "↩️" }
    ],
    sentences: [
      { it: "Ogni tanto mi scrive un messaggio lungo.", de: "Ab und zu schreibt er mir eine lange Nachricht." },
      { it: "Che cosa ti dice Marco del concerto?", de: "Was sagt dir Marco von dem Konzert?" },
      { it: "Gli parlo domani, non ti preoccupare.", de: "Ich spreche morgen mit ihm, keine Sorge." },
      { it: "Le chiedo scusa per il ritardo.", de: "Ich entschuldige mich bei ihr für die Verspätung." },
      { it: "Vi scrivo domani, promesso.", de: "Ich schreibe euch morgen, versprochen." },
      { it: "Le rispondo appena posso.", de: "Ich antworte ihr, sobald ich kann." },
      { it: "Mi hai chiamato? Grazie!", de: "Hast du mich angerufen? Danke!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["comunicare"] },
  {
    id: "m2b-piacere",
    level: "A2",
    title: "piacere & Co.",
    icon: "💗",
    scene: "Gefallen in allen Richtungen: Singular „piace“, Plural „piacciono“ — wer mag was?",
    words: [
      { it: "mi piaceva", de: "es gefiel mir", emoji: "🧠" },
      { it: "ti piace", de: "es gefällt dir", emoji: "🙂" },
      { it: "ci piace", de: "es gefällt uns", emoji: "👫" },
      { it: "gli piace", de: "es gefällt ihm", emoji: "🧑" },
      { it: "timido", de: "schüchtern", emoji: "😳" },
      { it: "curioso", de: "neugierig", emoji: "🤔" },
      { it: "vi piace", de: "es gefällt euch", emoji: "😄" },
      { it: "piacciono", de: "sie gefallen", emoji: "💕" }
    ],
    sentences: [
      { it: "Da bambina mi piaceva il gelato al limone.", de: "Als Kind liebte ich Zitroneneis." },
      { it: "Ti piace questa canzone?", de: "Gefällt dir dieses Lied?" },
      { it: "Ci piace la sera in piazza.", de: "Wir mögen den Abend auf dem Platz." },
      { it: "Gli piaceva fare il timido.", de: "Er spielte gern den Schüchternen." },
      { it: "Vi piace il mio nuovo lavoro?", de: "Gefällt euch meine neue Arbeit?" },
      { it: "Mi piacciono le canzoni italiane.", de: "Mir gefallen italienische Lieder." },
      { it: "Gli piacciono i dolci, ma non la frutta.", de: "Ihm gefallen Süßigkeiten, aber nicht Obst." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["emozioni"] },
  {
    id: "m2b-ne",
    level: "A2",
    title: "ne — davon",
    icon: "🍞",
    scene: "Partitivo ne beim Essen: Wie viele Portionen? Davon haben wir noch — und darüber reden wir beim Essen.",
    words: [
      { it: "ne vorrei", de: "ich hätte davon gern", emoji: "🤲" },
      { it: "ne prendo", de: "ich nehme davon", emoji: "🍽️" },
      { it: "ne abbiamo", de: "wir haben davon", emoji: "📦" },
      { it: "al dente", de: "al dente", emoji: "🍜" },
      { it: "la porzione", de: "die Portion", emoji: "🍽️" },
      { it: "il primo", de: "der erste Gang", emoji: "🍝" },
      { it: "ne parliamo", de: "wir sprechen darüber", emoji: "💬" },
      { it: "ne vuole", de: "er/sie möchte davon", emoji: "🙋" }
    ],
    sentences: [
      { it: "Ne vorrei due porzioni, per favore.", de: "Ich hätte gern zwei Portionen davon, bitte." },
      { it: "Ne prendo anche io, grazie.", de: "Ich nehme auch davon, danke." },
      { it: "Il pane? Ne abbiamo ancora.", de: "Brot? Davon haben wir noch." },
      { it: "La pasta era al dente, ne ho mangiata tanta.", de: "Die Pasta war al dente, ich habe viel davon gegessen." },
      { it: "Ne parliamo a cena.", de: "Wir sprechen darüber beim Abendessen." },
      { it: "Quante mele vuoi? Ne prendo tre.", de: "Wie viele Äpfel willst du? Ich nehme drei." },
      { it: "Ne vuole anche suo fratello?", de: "Möchte sein Bruder auch davon?" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["uscire"] },
  {
    id: "m2b-ci",
    level: "A2",
    title: "ci — dort",
    icon: "📍",
    scene: "Das kleine ci: dort wohnen, dorthin gehen — und „ci sono“ für „es gibt“.",
    words: [
      { it: "ci vado", de: "ich gehe dorthin", emoji: "🚶" },
      { it: "ci resto", de: "ich bleibe dort", emoji: "🛑" },
      { it: "ci vivono", de: "sie wohnen dort", emoji: "🏠" },
      { it: "ci torno", de: "ich komme dorthin zurück", emoji: "↩️" },
      { it: "la zona", de: "das Viertel", emoji: "🗺️" },
      { it: "il vicino", de: "der Nachbar", emoji: "🧑‍🤝‍🧑" },
      { it: "ci sono", de: "es gibt", emoji: "🎯" },
      { it: "ci vediamo", de: "wir sehen uns", emoji: "👋" }
    ],
    sentences: [
      { it: "Al mercato ci vado il sabato.", de: "Zum Markt gehe ich samstags." },
      { it: "Ci resto fino a sera.", de: "Ich bleibe dort bis zum Abend." },
      { it: "I miei vicini ci vivono da anni.", de: "Meine Nachbarn wohnen seit Jahren dort." },
      { it: "Ci torno volentieri, che bella zona!", de: "Ich komme gern dorthin zurück, was für ein Viertel!" },
      { it: "Ci sono mille motivi.", de: "Es gibt tausend Gründe." },
      { it: "Ci vediamo in centro alle sei.", de: "Wir sehen uns um sechs im Zentrum." },
      { it: "Ci credo, è una bella città!", de: "Das glaube ich, es ist eine schöne Stadt!" }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["abitare"] },
  {
    id: "m2b-da-tempo",
    level: "A2",
    title: "Seit wann?",
    icon: "⏳",
    scene: "da + Zeitraum: seit drei Jahren, seit Kurzem — und „un anno fa“ schaut zurück.",
    words: [
      { it: "da tre anni", de: "seit drei Jahren", emoji: "📆" },
      { it: "da sempre", de: "seit immer", emoji: "♾️" },
      { it: "da un mese", de: "seit einem Monat", emoji: "📅" },
      { it: "da luglio", de: "seit Juli", emoji: "☀️" },
      { it: "il turno", de: "die Schicht", emoji: "🕐" },
      { it: "lo stipendio", de: "das Gehalt", emoji: "💲" },
      { it: "da poco", de: "erst seit Kurzem", emoji: "🌱" },
      { it: "un anno fa", de: "vor einem Jahr", emoji: "⏮️" }
    ],
    sentences: [
      { it: "Lavoro in questa ditta da tre anni.", de: "Ich arbeite seit drei Jahren in dieser Firma." },
      { it: "Il mio vicino abita qui da sempre.", de: "Mein Nachbar wohnt hier schon immer." },
      { it: "Da un mese faccio il turno di notte.", de: "Seit einem Monat mache ich Nachtschicht." },
      { it: "Da luglio lo stipendio è aumentato.", de: "Seit Juli ist das Gehalt gestiegen." },
      { it: "Abito qui da poco.", de: "Ich wohne hier erst seit Kurzem." },
      { it: "Un anno fa cercavo un lavoro.", de: "Vor einem Jahr suchte ich eine Arbeit." },
      { it: "Da quando lavoro, ho meno tempo.", de: "Seitdem ich arbeite, habe ich weniger Zeit." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["lavoro2"] },
  {
    id: "m2b-confronti",
    level: "A2",
    title: "più / meno",
    icon: "📏",
    scene: "Vergleiche mit Kleidung: bequemer, günstiger, eleganter — und was ist komplett anders?",
    words: [
      { it: "più comodo", de: "bequemer", emoji: "😌" },
      { it: "meno caro", de: "günstiger", emoji: "💸" },
      { it: "più elegante", de: "eleganter", emoji: "🤵" },
      { it: "meno pesante", de: "leichter", emoji: "🪶" },
      { it: "la sciarpa", de: "der Schal", emoji: "🧣" },
      { it: "la cintura", de: "der Gürtel", emoji: "👖" },
      { it: "diverso", de: "anders / verschieden", emoji: "🔀" },
      { it: "lo zaino", de: "der Rucksack", emoji: "🎒", key: "word_viaggio_a1_zaino" }
    ],
    sentences: [
      { it: "Questa sciarpa è più comoda di quella.", de: "Dieser Schal ist bequemer als der da." },
      { it: "Il mercato è meno caro del negozio.", de: "Der Markt ist günstiger als das Geschäft." },
      { it: "La cintura nera è più elegante.", de: "Der schwarze Gürtel ist eleganter." },
      { it: "D'inverno cerco maglioni meno pesanti.", de: "Im Winter suche ich leichtere Pullover." },
      { it: "Questo maglione è uguale al tuo.", de: "Dieser Pullover ist genau wie deiner." },
      { it: "La cintura marrone è diversa.", de: "Der braune Gürtel ist anders." },
      { it: "La borsa è pratica, lo zaino è più comodo.", de: "Die Tasche ist praktisch, der Rucksack ist bequemer." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["abiti2"] },
  {
    id: "m2b-meglio-migliore",
    level: "A2",
    title: "meglio o migliore?",
    icon: "🥇",
    scene: "Unregelmäßige Vergleiche beim Arzt und Apotheker: die beste Tisana — und was empfiehlt der Profi?",
    words: [
      { it: "la migliore", de: "die beste", emoji: "🥇" },
      { it: "la peggiore", de: "die schlechteste", emoji: "🥉" },
      { it: "la visita", de: "die Untersuchung", emoji: "🩺" },
      { it: "la ricetta", de: "das Rezept", emoji: "📜" },
      { it: "la tisana", de: "der Kräutertee", emoji: "🍵" },
      { it: "il farmacista", de: "der Apotheker", emoji: "🧑‍⚕️" },
      { it: "la salute", de: "die Gesundheit", emoji: "💚", key: "word_salute2_la_salute" },
      { it: "consiglia", de: "er/sie empfiehlt", emoji: "💬" }
    ],
    sentences: [
      { it: "Questa è la migliore tisana della città.", de: "Das ist der beste Kräutertee der Stadt." },
      { it: "È stata la peggiore influenza dell'anno.", de: "Es war die schlimmste Grippe des Jahres." },
      { it: "Oggi sto meglio, grazie.", de: "Mir geht es heute besser, danke." },
      { it: "Col caffè dormo peggio.", de: "Mit Kaffee schlafe ich schlechter." },
      { it: "Prima la salute, poi il resto.", de: "Zuerst die Gesundheit, dann der Rest." },
      { it: "Prendo la ricetta e vado in farmacia.", de: "Ich nehme das Rezept und gehe in die Apotheke." },
      { it: "Il farmacista consiglia questa tisana.", de: "Der Apotheker empfiehlt diesen Kräutertee." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["salute2"] },
  {
    id: "m2b-tempo-verbi",
    level: "A2",
    title: "Es regnete…",
    icon: "🌦️",
    scene: "Wetterverben im Imperfetto: Nebel, Donner — und am Ende der Regenbogen.",
    words: [
      { it: "pioveva", de: "es regnete", emoji: "🌧️" },
      { it: "faceva caldo", de: "es war heiß", emoji: "🥵" },
      { it: "la nebbia", de: "der Nebel", emoji: "🌫️" },
      { it: "il ghiaccio", de: "das Eis", emoji: "🧊" },
      { it: "la temperatura", de: "die Temperatur", emoji: "🌡️" },
      { it: "il tuono", de: "der Donner", emoji: "⛈️" },
      { it: "nevicava", de: "es schneite", emoji: "❄️" },
      { it: "l'arcobaleno", de: "der Regenbogen", emoji: "🌈", key: "word_tempo2_l_arcobaleno" }
    ],
    sentences: [
      { it: "Ieri pioveva e tirava vento.", de: "Gestern regnete es und es war windig." },
      { it: "Faceva caldo, quasi trenta gradi.", de: "Es war heiß, fast dreißig Grad." },
      { it: "Con la nebbia non si vedeva niente.", de: "Bei Nebel sah man nichts." },
      { it: "Sul sentiero c'era ghiaccio.", de: "Auf dem Weg gab es Eis." },
      { it: "In montagna nevicava già a ottobre.", de: "In den Bergen schneite es schon im Oktober." },
      { it: "Dopo il tuono è arrivato l'arcobaleno.", de: "Nach dem Donner kam der Regenbogen." },
      { it: "La temperatura scendeva piano piano.", de: "Die Temperatur sank langsam." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["tempo2"] },
  {
    id: "m2b-telefono",
    level: "A2",
    title: "Am Telefon II",
    icon: "📞",
    scene: "Leitungs-Floskeln: besetzt, schwaches Signal — und die Nachricht auf dem Anrufbeantworter.",
    words: [
      { it: "resto in linea", de: "ich bleibe am Apparat", emoji: "☎️" },
      { it: "riprovo", de: "ich versuche es wieder", emoji: "🔁" },
      { it: "ti richiamo", de: "ich rufe dich zurück", emoji: "📲" },
      { it: "la segreteria", de: "der Anrufbeantworter", emoji: "📼" },
      { it: "occupato", de: "besetzt", emoji: "🚫" },
      { it: "il segnale", de: "das Signal", emoji: "📡" },
      { it: "non ti sento", de: "ich höre dich nicht", emoji: "🙉" },
      { it: "la linea", de: "die Leitung", emoji: "📶", key: "word_comunicare_la_linea" }
    ],
    sentences: [
      { it: "Pronto? Resto in linea, grazie.", de: "Hallo? Ich bleibe am Apparat, danke." },
      { it: "Il numero è occupato, riprovo tra cinque minuti.", de: "Die Nummer ist besetzt, ich versuche es in fünf Minuten wieder." },
      { it: "Ti richiamo dopo il lavoro.", de: "Ich rufe dich nach der Arbeit zurück." },
      { it: "Qui il segnale è debole.", de: "Hier ist das Signal schwach." },
      { it: "Scusa, non ti sento!", de: "Sorry, ich höre dich nicht!" },
      { it: "La linea è ancora occupata.", de: "Die Leitung ist noch besetzt." },
      { it: "Lascio un messaggio in segreteria.", de: "Ich hinterlasse eine Nachricht auf dem Anrufbeantworter." }
    ],
    build: [0, 4, 5],
    produce: [1, 2, 6],
    covers: ["comunicare"] },
  { id: "m2b-posta", level: "A2", mini: true, title: "Mini: Einschreiben", icon: "📬", scene: "Post-Schalter formell.",
    words: [{ it: "desidero", de: "ich möchte (formell)", emoji: "🎩" }, { it: "spedire", de: "verschicken", emoji: "📤" }, { it: "raccomandata", de: "Einschreiben", emoji: "📮" }, { it: "il pacco", de: "das Paket", emoji: "📦" }, { it: "la busta", de: "der Briefumschlag", emoji: "✉️" }, { it: "il francobollo", de: "die Briefmarke", emoji: "📮" }],
    sentences: [
      { it: "Desidero spedire una raccomandata.", de: "Ich möchte ein Einschreiben verschicken." },
      { it: "Anche questo pacco, per favore.", de: "Auch dieses Paket, bitte." },
      { it: "Quanti francobolli servono per la Germania?", de: "Wie viele Briefmarken braucht man für Deutschland?" },
      { it: "Una busta piccola, grazie.", de: "Einen kleinen Umschlag, danke." }
    ],
    build: [0], produce: [1, 2], covers: ["servizi"] },
  { id: "m2b-sentimenti", level: "A2", mini: true, title: "Mini: Gefühle gestern", icon: "😅", scene: "Gefühle im Imperfetto.",
    words: [{ it: "ero arrabbiato", de: "ich war verärgert", emoji: "😠" }, { it: "ero triste", de: "ich war traurig", emoji: "😢" }, { it: "mi sentivo", de: "ich fühlte mich", emoji: "💭" }, { it: "ero stufo", de: "ich hatte es satt", emoji: "😤" }, { it: "nervoso", de: "nervös", emoji: "😬" }, { it: "tranquillo", de: "gelassen", emoji: "😌" }],
    sentences: [
      { it: "Ieri ero arrabbiato con il vicino.", de: "Gestern war ich auf den Nachbarn wütend." },
      { it: "Mi sentivo tranquillo dopo la chiamata.", de: "Nach dem Anruf fühlte ich mich ruhig." },
      { it: "Ero triste quando sei partito.", de: "Ich war traurig, als du abgefahren bist." },
      { it: "Alla fine ero stufo del rumore.", de: "Am Ende hatte ich den Lärm satt." }
    ],
    build: [0], produce: [1, 2], covers: ["emozioni"] },
  { id: "m2b-medico", level: "A2", mini: true, title: "Mini: Beim Arzt sagen", icon: "🩺", scene: "Symptome schildern.",
    words: [{ it: "mi fa male", de: "es tut mir weh", emoji: "🤕" }, { it: "da quanto tempo", de: "seit wann", emoji: "⏳" }, { it: "respiro", de: "ich atme", emoji: "🫁" }, { it: "la tosse", de: "der Husten", emoji: "😷" }, { it: "il raffreddore", de: "die Erkältung", emoji: "🤧" }, { it: "la febbre", de: "das Fieber", emoji: "🌡️" }],
    sentences: [
      { it: "Dottore, mi fa male qui.", de: "Herr Doktor, hier tut es mir weh." },
      { it: "Da quanto tempo ha questo dolore?", de: "Seit wann haben Sie diesen Schmerz?" },
      { it: "Ho la tosse da tre giorni.", de: "Ich habe seit drei Tagen Husten." },
      { it: "Respiro con un po' di fatica.", de: "Ich atme etwas schwer." }
    ],
    build: [0], produce: [1, 2], covers: ["salute2"] },
  { id: "m2b-ristorante", level: "A2", mini: true, title: "Mini: Gedeck & Co.", icon: "🍽️", scene: "Restaurant-Feinheiten.",
    words: [{ it: "è incluso", de: "ist inbegriffen", emoji: "✅" }, { it: "il coperto", de: "das Gedeck", emoji: "🕯️" }, { it: "la specialità", de: "die Spezialität", emoji: "⭐" }, { it: "al dente", de: "al dente", emoji: "🍜" }, { it: "ben cotto", de: "durchgebraten", emoji: "🍳" }, { it: "la porzione", de: "die Portion", emoji: "🍽️" }],
    sentences: [
      { it: "Il coperto è incluso nel prezzo?", de: "Ist das Gedeck im Preis inbegriffen?" },
      { it: "La porzione era abbondante.", de: "Die Portion war reichlich." },
      { it: "La carne era ben cotta.", de: "Das Fleisch war gut durchgebraten." },
      { it: "La specialità della casa va assaggiata.", de: "Die Spezialität des Hauses muss man probieren." }
    ],
    build: [0], produce: [1, 2], covers: ["uscire"] },
  { id: "m2b-appartamento", level: "A2", mini: true, title: "Mini: Wohnungsdaten", icon: "🏠", scene: "Miete, Kaution, Stockwerk.",
    words: [{ it: "al quarto piano", de: "im vierten Stock", emoji: "🎚️" }, { it: "l'affitto", de: "die Miete", emoji: "🏷️" }, { it: "il contratto", de: "der Vertrag", emoji: "📄" }, { it: "la cauzione", de: "die Kaution", emoji: "💰" }, { it: "ammobiliato", de: "möbliert", emoji: "🛋️" }, { it: "la zona", de: "das Viertel", emoji: "🗺️" }],
    sentences: [
      { it: "L'appartamento è al quarto piano.", de: "Die Wohnung ist im vierten Stock." },
      { it: "L'affitto è ottocento euro al mese.", de: "Die Miete beträgt achthundert Euro im Monat." },
      { it: "La cauzione è di due mensilità.", de: "Die Kaution beträgt zwei Monatsmieten." },
      { it: "Il contratto è per un appartamento ammobiliato.", de: "Der Vertrag ist für eine möblierte Wohnung." }
    ],
    build: [0], produce: [1, 2], covers: ["abitare"] },
  { id: "m2b-streik", level: "A2", mini: true, title: "Mini: Streik-Meldung", icon: "⛔", scene: "Bahnhofsdurchsagen verstehen.",
    words: [{ it: "è stato cancellato", de: "wurde gestrichen", emoji: "🚫" }, { it: "binario sette", de: "Gleis sieben", emoji: "7️⃣" }, { it: "lo sciopero", de: "der Streik", emoji: "🪧" }, { it: "il ritardo", de: "die Verspätung", emoji: "⏱️" }, { it: "la coincidenza", de: "der Anschluss", emoji: "🔗" }, { it: "la multa", de: "das Bußgeld", emoji: "🚨" }],
    sentences: [
      { it: "Il treno delle otto è stato cancellato.", de: "Der Acht-Uhr-Zug wurde gestrichen." },
      { it: "Partenza dal binario sette.", de: "Abfahrt von Gleis sieben." },
      { it: "Con lo sciopero, tutto era in ritardo.", de: "Wegen des Streiks war alles verspätet." },
      { it: "Chi non convalida il biglietto prende la multa.", de: "Wer das Ticket nicht entwertet, kriegt ein Bußgeld." }
    ],
    build: [0], produce: [1, 2], covers: ["trasporti2"] },
  { id: "m2b-notte", level: "A2", mini: true, title: "Mini: Eine Nacht", icon: "🌙", scene: "si-Imperfetto beim Fest.",
    words: [{ it: "si rideva", de: "man lachte", emoji: "😄" }, { it: "si ballava", de: "man tanzte", emoji: "💃" }, { it: "era tardi", de: "es war spät", emoji: "🌙" }, { it: "il ricordo", de: "die Erinnerung", emoji: "🧠" }, { it: "una volta", de: "einmal / früher", emoji: "📖" }],
    sentences: [
      { it: "Una volta, al matrimonio di Luca, si ballava fino a notte.", de: "Einmal, bei Lucas Hochzeit, tanzte man bis zur Nacht." },
      { it: "Si rideva per qualsiasi cosa.", de: "Man lachte über alles Mögliche." },
      { it: "Era tardi, ma nessuno aveva sonno.", de: "Es war spät, aber niemand war müde." },
      { it: "Che ricordo bellissimo!", de: "Was für eine schöne Erinnerung!" }
    ],
    build: [0], produce: [1, 2], covers: ["racconto"] },
  { id: "m2b-vestiti", level: "A2", mini: true, title: "Mini: Anprobe", icon: "👔", scene: "Beratung in der Kabine.",
    words: [{ it: "sta bene", de: "er/sie steht gut", emoji: "👌" }, { it: "provala", de: "probier sie an", emoji: "🪞" }, { it: "taglia media", de: "Größe M", emoji: "📏" }, { it: "la cintura", de: "der Gürtel", emoji: "👖" }, { it: "di lana", de: "aus Wolle", emoji: "🐑" }, { it: "elegante", de: "elegant", emoji: "🤵" }],
    sentences: [
      { it: "Questo cappotto ti sta bene!", de: "Dieser Mantel steht dir gut!" },
      { it: "Provala nella taglia media.", de: "Probier sie in Größe M." },
      { it: "Una sciarpa di lana è più calda.", de: "Ein Wollschal ist wärmer." },
      { it: "Per la festa serve qualcosa di elegante.", de: "Für die Party braucht man etwas Elegantes." }
    ],
    build: [0], produce: [1, 2], covers: ["abiti2"] },
  { id: "m2b-lavoro", level: "A2", mini: true, title: "Mini: Berufs-Smalltalk", icon: "💬", scene: "Beruf, Suche, Schicht.",
    words: [{ it: "faccio l'ingegnere", de: "ich arbeite als Ingenieur", emoji: "👷" }, { it: "cerco lavoro", de: "ich suche eine Stelle", emoji: "🔍" }, { it: "turno di notte", de: "Nachtschicht", emoji: "🌙" }, { it: "il colloquio", de: "das Vorstellungsgespräch", emoji: "🤝" }, { it: "la ditta", de: "die Firma", emoji: "🏭" }, { it: "l'esperienza", de: "die Erfahrung", emoji: "📈" }],
    sentences: [
      { it: "Faccio l'ingegnere in una ditta piccola.", de: "Ich arbeite als Ingenieur in einer kleinen Firma." },
      { it: "Mio fratello cerca lavoro da giugno.", de: "Mein Bruder sucht seit Juni eine Stelle." },
      { it: "Il colloquio è andato bene, aspettiamo.", de: "Das Gespräch ist gut gelaufen, wir warten." },
      { it: "Il turno di notte è duro, ma l'esperienza conta.", de: "Die Nachtschicht ist hart, aber Erfahrung zählt." }
    ],
    build: [0], produce: [1, 2], covers: ["lavoro2"] },
  { id: "m2b-messaggi", level: "A2", mini: true, title: "Mini: Schreib mir", icon: "✉️", scene: "Nachrichten-Floskeln.",
    words: [{ it: "ti scrivo", de: "ich schreibe dir", emoji: "✍️" }, { it: "le mando", de: "ich schicke ihr/Ihnen", emoji: "📤" }, { it: "ci sentiamo", de: "wir hören uns", emoji: "📞" }, { it: "la chat", de: "der Chat", emoji: "📱" }, { it: "il messaggio", de: "die Nachricht", emoji: "💬" }, { it: "la videochiamata", de: "der Videoanruf", emoji: "📹" }],
    sentences: [
      { it: "Ti scrivo appena arrivo.", de: "Ich schreibe dir, sobald ich ankomme." },
      { it: "Le mando la posizione in chat.", de: "Ich schicke ihr den Standort im Chat." },
      { it: "Ci sentiamo dopo la riunione.", de: "Wir hören uns nach dem Meeting." },
      { it: "Meglio una videochiamata, così ci vediamo.", de: "Besser ein Videoanruf, so sehen wir uns." }
    ],
    build: [0], produce: [1, 2], covers: ["comunicare"] },
  { id: "m2b-nonna", level: "A2", mini: true, title: "Mini: Opas Geschichten", icon: "👴", scene: "Unregelmäßige Imperfetto-Formen.",
    words: [{ it: "sapeva", de: "er wusste / konnte", emoji: "🧠" }, { it: "poteva", de: "er konnte", emoji: "💪" }, { it: "voleva", de: "er wollte", emoji: "🙏" }, { it: "avevamo", de: "wir hatten", emoji: "🤝" }, { it: "il ricordo", de: "die Erinnerung", emoji: "🧠" }, { it: "l'infanzia", de: "die Kindheit", emoji: "👶" }],
    sentences: [
      { it: "Il nonno sapeva tutte le storie.", de: "Der Opa kannte alle Geschichten." },
      { it: "Da piccolo non potevo stare alzato.", de: "Als Kind durfte ich nicht aufbleiben." },
      { it: "Voleva sempre raccontare ancora.", de: "Er wollte immer noch mehr erzählen." },
      { it: "Avevamo cinque anni, eravamo piccoli.", de: "Wir waren fünf, wir waren klein." }
    ],
    build: [0], produce: [1, 2], covers: ["racconto"] },
  { id: "m2b-previsione", level: "A2", mini: true, title: "Mini: Wetter morgen", icon: "📺", scene: "Vorhersagen im Futuro.",
    words: [{ it: "scenderà", de: "sie wird sinken", emoji: "📉" }, { it: "salirà", de: "sie wird steigen", emoji: "📈" }, { it: "sarà", de: "es wird sein", emoji: "🔮" }, { it: "grandinerà", de: "es wird hageln", emoji: "🧊" }, { it: "la temperatura", de: "die Temperatur", emoji: "🌡️" }, { it: "la previsione", de: "die Wettervorhersage", emoji: "📺" }],
    sentences: [
      { it: "Domani la temperatura scenderà di dieci gradi.", de: "Morgen sinkt die Temperatur um zehn Grad." },
      { it: "In montagna salirà la nebbia.", de: "Im Gebirge wird der Nebel aufsteigen." },
      { it: "Sabato sarà una giornata perfetta.", de: "Samstag wird ein perfekter Tag." },
      { it: "La previsione dice che grandinerà.", de: "Die Vorhersage sagt, dass es hageln wird." }
    ],
    build: [0], produce: [1, 2], covers: ["tempo2"] },
  { id: "m2b-condizionale", level: "A2", mini: true, title: "Mini: Ich käme gern…", icon: "🙃", scene: "Condizionale für Ausreden und Wünsche.",
    words: [{ it: "dovrei studiare", de: "ich müsste lernen", emoji: "📚" }, { it: "sarei", de: "ich wäre", emoji: "🌀" }, { it: "verrei", de: "ich käme", emoji: "🚶" }, { it: "vorresti", de: "du möchtest", emoji: "🙋" }, { it: "magari", de: "vielleicht / wäre schön", emoji: "🍀" }],
    sentences: [
      { it: "Verrei volentieri, ma dovrei studiare.", de: "Ich käme gern, aber ich müsste lernen." },
      { it: "Sarei più felice con un gelato.", de: "Ich wäre glücklicher mit einem Eis." },
      { it: "Tu vorresti venire al mare?", de: "Möchtest du ans Meer kommen?" },
      { it: "Magari domani, chi lo sa!", de: "Vielleicht morgen, wer weiß!" }
    ],
    build: [0], produce: [1, 2], covers: ["emozioni"] },
  { id: "m2b-doppi", level: "A2", mini: true, title: "Mini: Doppel-Pronomen", icon: "🍴", scene: "Kombinierte Pronomen am Tisch.",
    words: [{ it: "gliene", de: "ihm/Ihnen davon", emoji: "🫴" }, { it: "ve lo", de: "es Ihnen (Pl.)", emoji: "🤲" }, { it: "ce li", de: "sie uns", emoji: "👥" }, { it: "la porzione", de: "die Portion", emoji: "🍽️" }, { it: "il cameriere", de: "der Kellner", emoji: "🤵" }],
    sentences: [
      { it: "Gliene porto subito un altro.", de: "Ich bringe Ihnen sofort noch eines." },
      { it: "Ve lo porto tra due minuti.", de: "Ich bringe es Ihnen in zwei Minuten." },
      { it: "Il pane? Ce lo porta subito.", de: "Das Brot? Das bringt er uns sofort." },
      { it: "Quante porzioni? Gliene abbiamo portate tre.", de: "Wie viele Portionen? Wir haben Ihnen drei gebracht." }
    ],
    build: [0], produce: [1, 2], covers: ["uscire"] },
  { id: "m2b-vie", level: "A2", mini: true, title: "Mini: Umsteigen", icon: "🔀", scene: "Wegbeschreibung im Nahverkehr.",
    words: [{ it: "scendi qui", de: "steig hier aus", emoji: "🚏" }, { it: "cambia a", de: "steig um in", emoji: "🔀" }, { it: "il cambio", de: "das Umsteigen", emoji: "🔁" }, { it: "diretto", de: "direkt", emoji: "🚄" }, { it: "il binario", de: "das Gleis", emoji: "🛤️" }],
    sentences: [
      { it: "Scendi qui e cambia alla linea tre.", de: "Steigen Sie hier aus und wechseln Sie zur Linie 3." },
      { it: "Il cambio si fa a Termini.", de: "Das Umsteigen macht man in Termini." },
      { it: "Questo è un treno diretto, non ferma.", de: "Das ist ein Direktzug, er hält nicht." },
      { it: "Il tuo binario è il numero due.", de: "Dein Gleis ist Nummer zwei." }
    ],
    build: [0], produce: [1, 2], covers: ["trasporti2"] },

/* ================= B1 (10 Stories — Congiuntivo, Periodo
     ipotetico Typ 1, Pronomen-Kombinationen, Diskussion;
     validate.js erzwingt Level-Match der covers) ================= */

  {
    id: "opinione",
    level: "B1",
    title: "Penso che…",
    icon: "💭",
    scene: "Meinung sagen wie ein Italiener: nach „penso che“ und „credo che“ kommt der Congiuntivo — „sia“, „abbia“, „piova“.",
    words: [
      { it: "l'opinione", de: "die Meinung", emoji: "💭" },
      { it: "d'accordo", de: "einverstanden", emoji: "🤝" },
      { it: "secondo me", de: "meiner Meinung nach", emoji: "🤔" },
      { it: "forse", de: "vielleicht", emoji: "❔" },
      { it: "magari", de: "vielleicht / wäre schön", emoji: "🍀" },
      { it: "purtroppo", de: "leider", emoji: "😞" },
      { it: "davvero", de: "wirklich", emoji: "‼️" },
      { it: "sicuramente", de: "sicher(lich)", emoji: "✅" }
    ],
    sentences: [
      { it: "Penso che la vita sia bella.", de: "Ich denke, dass das Leben schön ist." },
      { it: "Credo che Marco abbia ragione.", de: "Ich glaube, dass Marco recht hat." },
      { it: "Secondo me, è una buona idea.", de: "Meiner Meinung nach ist es eine gute Idee." },
      { it: "Non sono d'accordo con te.", de: "Ich bin nicht einverstanden mit dir." },
      { it: "Sembra che piova domani.", de: "Es scheint, dass es morgen regnet." },
      { it: "Forse hai ragione, purtroppo.", de: "Vielleicht hast du recht, leider." },
      { it: "Magari domani va meglio!", de: "Vielleicht geht es morgen besser!" }
    ],
    build: [0, 3, 4],
    produce: [1, 2, 6],
    covers: ["opinioni"]
  },
  {
    id: "notizie",
    level: "B1",
    title: "Le notizie di oggi",
    icon: "📰",
    scene: "Medien und Nachrichten besprechen — mit Meinung und Congiuntivo.",
    words: [
      { it: "la notizia", de: "die Nachricht", emoji: "📰" },
      { it: "il telegiornale", de: "die Nachrichtensendung", emoji: "📺" },
      { it: "l'articolo", de: "der Artikel", emoji: "📄" },
      { it: "il giornalista", de: "der Journalist", emoji: "🎤" },
      { it: "la rivista", de: "die Zeitschrift", emoji: "📔" },
      { it: "la puntata", de: "die Folge", emoji: "🎬" },
      { it: "il podcast", de: "der Podcast", emoji: "🎧" },
      { it: "il commento", de: "der Kommentar", emoji: "🖋️" }
    ],
    sentences: [
      { it: "Hai letto le notizie di oggi?", de: "Hast du die Nachrichten von heute gelesen?" },
      { it: "Il telegiornale inizia alle otto.", de: "Die Nachrichtensendung beginnt um acht Uhr." },
      { it: "Penso che questo articolo sia interessante.", de: "Ich denke, dass dieser Artikel interessant ist." },
      { it: "Il giornalista ha scritto un libro.", de: "Der Journalist hat ein Buch geschrieben." },
      { it: "Non credo che sia vero.", de: "Ich glaube nicht, dass es wahr ist." },
      { it: "La nuova puntata è online.", de: "Die neue Folge ist online." },
      { it: "Ascolto un podcast mentre cammino.", de: "Ich höre einen Podcast, während ich spazieren gehe." }
    ],
    build: [1, 3, 4],
    produce: [0, 2, 5],
    covers: ["media"]
  },
  {
    id: "ambiente",
    level: "B1",
    title: "Ambiente e clima",
    icon: "🌍",
    scene: "Über Umwelt sprechen: reduzieren, schützen, recyceln — und der echte Bedingungssatz „Se tutti riciclano …“.",
    words: [
      { it: "l'ambiente", de: "die Umwelt", emoji: "🌍" },
      { it: "l'inquinamento", de: "die Umweltverschmutzung", emoji: "🏭" },
      { it: "la spazzatura", de: "der Müll", emoji: "🗑️" },
      { it: "il riciclo", de: "das Recycling", emoji: "♻️" },
      { it: "l'energia", de: "die Energie", emoji: "🔋" },
      { it: "il riscaldamento", de: "die Heizung", emoji: "🔥" },
      { it: "la bolletta", de: "die Rechnung (Strom)", emoji: "🧾" },
      { it: "sostenibile", de: "nachhaltig", emoji: "🌱" }
    ],
    sentences: [
      { it: "Dobbiamo ridurre l'inquinamento.", de: "Wir müssen die Umweltverschmutzung verringern." },
      { it: "Riciclo la spazzatura ogni giorno.", de: "Ich recycle den Müll jeden Tag." },
      { it: "Penso che l'ambiente sia importante.", de: "Ich denke, dass die Umwelt wichtig ist." },
      { it: "Questa città è molto sostenibile.", de: "Diese Stadt ist sehr nachhaltig." },
      { it: "La bolletta della luce è aumentata.", de: "Die Stromrechnung ist gestiegen." },
      { it: "Proteggiamo la natura, per favore.", de: "Schützen wir die Natur, bitte." },
      { it: "Se tutti riciclano, il clima migliora.", de: "Wenn alle recyceln, verbessert sich das Klima." }
    ],
    build: [0, 1, 5],
    produce: [2, 3, 6],
    covers: ["ambiente"]
  },
  {
    id: "aereo",
    level: "B1",
    title: "In aereo",
    icon: "✈️",
    scene: "Am Flughafen: Boarding, Zoll, Anschluss — und der Bedingungssatz „Se il volo è in ritardo …“.",
    words: [
      { it: "il volo", de: "der Flug", emoji: "✈️" },
      { it: "l'imbarco", de: "das Boarding", emoji: "🛫" },
      { it: "lo scalo", de: "der Zwischenstopp", emoji: "🛬" },
      { it: "la dogana", de: "der Zoll", emoji: "🛃" },
      { it: "la frontiera", de: "die Grenze", emoji: "🚧" },
      { it: "la destinazione", de: "das Reiseziel", emoji: "📍" },
      { it: "l'itinerario", de: "die Reiseroute", emoji: "🗺️" },
      { it: "la conferma", de: "die Bestätigung", emoji: "✅" }
    ],
    sentences: [
      { it: "Dov'è l'imbarco per il volo a Roma?", de: "Wo ist das Boarding für den Flug nach Rom?" },
      { it: "Ho una conferma della prenotazione.", de: "Ich habe eine Bestätigung der Reservierung." },
      { it: "Il volo ha uno scalo a Parigi.", de: "Der Flug hat einen Zwischenstopp in Paris." },
      { it: "Se il volo è in ritardo, prendiamo il treno.", de: "Wenn der Flug Verspätung hat, nehmen wir den Zug." },
      { it: "Al controllo passaporti c'è molta fila.", de: "An der Passkontrolle gibt es eine lange Schlange." },
      { it: "La dogana controlla i bagagli.", de: "Der Zoll kontrolliert das Gepäck." },
      { it: "Che bella destinazione!", de: "Was für ein schönes Reiseziel!" }
    ],
    build: [2, 4, 5],
    produce: [0, 1, 3],
    covers: ["viaggi2"]
  },
  {
    id: "progetto",
    level: "B1",
    title: "Il grande progetto",
    icon: "📊",
    scene: "Projektalltag in einer italienischen Firma: Termine, Kunden, Herausforderungen.",
    words: [
      { it: "il progetto", de: "das Projekt", emoji: "📊" },
      { it: "la riunione", de: "die Besprechung", emoji: "👥" },
      { it: "le competenze", de: "die Kompetenzen", emoji: "🎯" },
      { it: "la formazione", de: "die Ausbildung", emoji: "🎓" },
      { it: "la carriera", de: "die Karriere", emoji: "🪜" },
      { it: "la sfida", de: "die Herausforderung", emoji: "⚔️" },
      { it: "il cliente", de: "der Kunde", emoji: "🤵" },
      { it: "la laurea", de: "das Diplom", emoji: "📜" }
    ],
    sentences: [
      { it: "Il progetto comincia lunedì prossimo.", de: "Das Projekt beginnt am kommenden Montag." },
      { it: "La riunione è alle nove in punto.", de: "Die Besprechung ist um genau neun Uhr." },
      { it: "Credo che il cliente abbia fretta.", de: "Ich glaube, dass der Kunde es eilig hat." },
      { it: "Ho tutte le competenze per questo ruolo.", de: "Ich habe alle Kompetenzen für diese Rolle." },
      { it: "Dopo la laurea ho fatto uno stage.", de: "Nach dem Diplom habe ich ein Praktikum gemacht." },
      { it: "È una grande sfida per la mia carriera.", de: "Es ist eine große Herausforderung für meine Karriere." },
      { it: "Spero di essere all'altezza.", de: "Ich hoffe, dass ich der Aufgabe gewachsen bin." }
    ],
    build: [0, 2, 5],
    produce: [3, 4, 6],
    covers: ["lavoro3"]
  },
  {
    id: "traffico",
    level: "B1",
    title: "Traffico in città",
    icon: "🚦",
    scene: "Stadtalltag: Ampel, U-Bahn, Altstadt — und Vergleiche zwischen Zentrum und Stadtrand.",
    words: [
      { it: "il traffico", de: "der Verkehr", emoji: "🚗" },
      { it: "il semaforo", de: "die Ampel", emoji: "🚦" },
      { it: "l'incrocio", de: "die Kreuzung", emoji: "🔀" },
      { it: "la metropolitana", de: "die U-Bahn", emoji: "🚇" },
      { it: "il centro storico", de: "die Altstadt", emoji: "🏰" },
      { it: "il monumento", de: "das Denkmal", emoji: "🗿" },
      { it: "il quartiere", de: "das Viertel", emoji: "🏘️" },
      { it: "la periferia", de: "der Stadtrand", emoji: "🌆" }
    ],
    sentences: [
      { it: "Il traffico in centro è incredibile.", de: "Der Verkehr im Zentrum ist unglaublich." },
      { it: "Aspetta il verde al semaforo!", de: "Warte auf Grün an der Ampel!" },
      { it: "Prendiamo la metropolitana, è più veloce.", de: "Nehmen wir die U-Bahn, sie ist schneller." },
      { it: "Il centro storico è chiuso al traffico.", de: "Die Altstadt ist für Verkehr gesperrt." },
      { it: "Questo monumento ha mille anni.", de: "Dieses Denkmal ist tausend Jahre alt." },
      { it: "Abito in un quartiere tranquillo.", de: "Ich wohne in einem ruhigen Viertel." },
      { it: "La periferia è più economica del centro.", de: "Der Stadtrand ist günstiger als das Zentrum." }
    ],
    build: [2, 4, 6],
    produce: [0, 1, 3],
    covers: ["citta3"]
  },
  {
    id: "cucina",
    level: "B1",
    title: "In cucina",
    icon: "🍳",
    scene: "Rezeptzeit: kurze Imperative („taglia“, „scalda“, „aggiungi“) und Mengen auf Italienisch.",
    words: [
      { it: "l'ingrediente", de: "die Zutat", emoji: "🥘" },
      { it: "il piatto", de: "der Teller / das Gericht", emoji: "🍛" },
      { it: "il forno", de: "der Backofen", emoji: "🔥" },
      { it: "la padella", de: "die Pfanne", emoji: "🍳" },
      { it: "il litro", de: "der Liter", emoji: "🥛" },
      { it: "il grammo", de: "das Gramm", emoji: "⚖️" },
      { it: "il sapore", de: "der Geschmack", emoji: "😋" },
      { it: "piccante", de: "scharf / würzig", emoji: "🌶️" }
    ],
    sentences: [
      { it: "Taglia la cipolla finemente!", de: "Schneide die Zwiebel fein!" },
      { it: "Scalda l'olio nella padella.", de: "Erwärme das Öl in der Pfanne." },
      { it: "Aggiungi duecento grammi di farina.", de: "Füge zweihundert Gramm Mehl hinzu." },
      { it: "Metti tutto nel forno per trenta minuti.", de: "Gib alles für dreißig Minuten in den Ofen." },
      { it: "Questo piatto ha un sapore piccante.", de: "Dieses Gericht hat einen scharfen Geschmack." },
      { it: "Serve un litro di latte.", de: "Es braucht einen Liter Milch." },
      { it: "Che buon odore!", de: "Was riecht das gut!" }
    ],
    build: [0, 2, 3],
    produce: [4, 5, 6],
    covers: ["cucina2"]
  },
  {
    id: "sogni",
    level: "B1",
    title: "Sogni e dubbi",
    icon: "💡",
    scene: "Hoffnungen und Zweifel: „spero che tu abbia ragione“ — Congiuntivo für Gefühle und Unsicherheit.",
    words: [
      { it: "il dubbio", de: "der Zweifel", emoji: "🤨" },
      { it: "la certezza", de: "die Gewissheit", emoji: "💯" },
      { it: "la speranza", de: "die Hoffnung", emoji: "🕊️" },
      { it: "il desiderio", de: "der Wunsch", emoji: "⭐" },
      { it: "il problema", de: "das Problem", emoji: "❗" },
      { it: "la soluzione", de: "die Lösung", emoji: "💡" },
      { it: "l'ipotesi", de: "die Vermutung", emoji: "🧪" },
      { it: "la possibilità", de: "die Möglichkeit", emoji: "🎲" }
    ],
    sentences: [
      { it: "Ho un dubbio su questa ipotesi.", de: "Ich habe einen Zweifel an dieser Vermutung." },
      { it: "Non c'è nessun problema.", de: "Es gibt kein Problem." },
      { it: "Spero che tu abbia ragione.", de: "Ich hoffe, dass du recht hast." },
      { it: "Dubito che sia così semplice.", de: "Ich bezweifle, dass es so einfach ist." },
      { it: "Anche se piove, usciamo.", de: "Auch wenn es regnet, gehen wir aus." },
      { it: "Troviamo una soluzione insieme.", de: "Finden wir gemeinsam eine Lösung." },
      { it: "Nel dubbio, chiedi a tua madre.", de: "Im Zweifel frag deine Mutter." }
    ],
    build: [1, 4, 6],
    produce: [0, 2, 3],
    covers: ["mente"]
  },
  {
    id: "film",
    level: "B1",
    title: "Mi piacciono i film italiani",
    icon: "🎬",
    scene: "Diskussion über Filme: Pronomen-Kombinationen („me lo“, „gliele“) und Medienwortschatz — Szene inklusive.",
    words: [
      { it: "secondo me", de: "meiner Meinung nach", emoji: "🤔" },
      { it: "davvero", de: "wirklich", emoji: "‼️" },
      { it: "invece", de: "stattdessen", emoji: "↩️" },
      { it: "probabilmente", de: "wahrscheinlich", emoji: "📊" },
      { it: "tuttavia", de: "jedoch", emoji: "↪️" },
      { it: "nonostante", de: "trotz / obwohl", emoji: "🧱" },
      { it: "anche se", de: "auch wenn", emoji: "☔" },
      { it: "purtroppo", de: "leider", emoji: "😞" }
    ],
    sentences: [
      { it: "Mi piacciono i film italiani.", de: "Mir gefallen italienische Filme." },
      { it: "Non mi piace il doppiaggio.", de: "Mir gefällt die Synchronisation nicht." },
      { it: "Me lo puoi prestare?", de: "Kannst du es mir leihen?" },
      { it: "Gliele ho consigliate io.", de: "Ich habe sie ihr empfohlen." },
      { it: "Anche se è lungo, vale la pena.", de: "Auch wenn er lang ist, lohnt er sich." },
      { it: "Nonostante il traffico, siamo arrivati in orario.", de: "Trotz des Verkehrs sind wir pünktlich angekommen." },
      { it: "Purtroppo oggi non posso.", de: "Leider kann ich heute nicht." }
    ],
    build: [0, 4, 6],
    produce: [1, 2, 3],
    dialogueId: "discussione",
    covers: ["opinioni", "mente"]
  },
  {
    id: "viaggio-sogni",
    level: "B1",
    title: "Il viaggio dei sogni",
    icon: "🗺️",
    scene: "Ripasso-Story: die Traumreise planen — Bedingungssatz Typ 1, Congiuntivo und Futuro in einer Erzählung.",
    words: [
      { it: "l'avventura", de: "das Abenteuer", emoji: "🗺️" },
      { it: "la meta", de: "das Ziel (Reise)", emoji: "🎯" },
      { it: "la sosta", de: "der Zwischenhalt", emoji: "☕" },
      { it: "il diario", de: "das Tagebuch", emoji: "📔" },
      { it: "la fotografia", de: "die Fotografie / das Foto", emoji: "📷", key: "word_lavoro_fotografia" },
      { it: "l'estate", de: "der Sommer", emoji: "☀️", key: "word_natura_estate" },
      { it: "il volo", de: "der Flug", emoji: "✈️" },
      { it: "la libertà", de: "die Freiheit", emoji: "🕊️" }
    ],
    sentences: [
      { it: "Quest'estate vorrei fare un grande viaggio.", de: "Diesen Sommer möchte ich eine große Reise machen." },
      { it: "Se avrò tempo e soldi, partirò in agosto.", de: "Wenn ich Zeit und Geld habe, fahre ich im August los." },
      { it: "Spero che il volo non sia costoso.", de: "Ich hoffe, dass der Flug nicht teuer ist." },
      { it: "Penso che la Toscana sia la meta perfetta.", de: "Ich denke, dass die Toskana das perfekte Ziel ist." },
      { it: "Scriverò un diario del viaggio.", de: "Ich werde ein Tagebuch der Reise schreiben." },
      { it: "Farò molte fotografie, probabilmente.", de: "Ich werde wahrscheinlich viele Fotos machen." },
      { it: "Sarebbe bellissimo!", de: "Das wäre wunderschön!" }
    ],
    build: [1, 3, 4],
    produce: [0, 2, 5],
    covers: ["viaggi2", "mente"]
  },

  {
    id: "sia-stato", level: "B1", title: "Penso che sia stato così", icon: "🧠",
    scene: "Der Congiuntivo passato: über Vergangenes spekulieren — „sia stato“, „abbia detto“, „sia andato“.",
    words: [
      { it: "sia stato", de: "dass er gewesen ist", emoji: "🧠" },
      { it: "sia stata", de: "dass sie gewesen ist", emoji: "💭" },
      { it: "abbia detto", de: "dass er/sie gesagt hat", emoji: "💬" },
      { it: "sia andato", de: "dass er gegangen ist", emoji: "🚶" },
      { it: "probabilmente", de: "wahrscheinlich", emoji: "📊" },
      { it: "secondo me", de: "meiner Meinung nach", emoji: "🤔" },
      { it: "forse", de: "vielleicht", emoji: "❔" }
    ],
    sentences: [
      { it: "Penso che Marco sia stato a Roma.", de: "Ich denke, dass Marco in Rom war." },
      { it: "Credo che Anna sia stata con lui.", de: "Ich glaube, dass Anna mit ihm dort war." },
      { it: "Secondo me è piovuto tutto il giorno.", de: "Meiner Meinung nach hat es den ganzen Tag geregnet." },
      { it: "Dubito che abbiano visto il Colosseo.", de: "Ich bezweifle, dass sie das Kolosseum gesehen haben." },
      { it: "Probabilmente hanno bevuto un caffè.", de: "Wahrscheinlich haben sie einen Espresso getrunken." },
      { it: "Forse lei gli ha detto la verità.", de: "Vielleicht hat sie ihm die Wahrheit gesagt." },
      { it: "Non so come è andata a finire.", de: "Ich weiß nicht, wie es ausgegangen ist." }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    covers: ["opinioni"]
  },
  {
    id: "libro-leggendo", level: "B1", title: "Il libro che sto leggendo", icon: "📚",
    scene: "Relativsätze: che, cui und der Verweis zurück — Sätze elegant verbinden.",
    words: [
      { it: "che", de: "der / die / das (Relativpronomen)", emoji: "🔗" },
      { it: "cui", de: "dem / der / wo (Relativpronomen)", emoji: "🧩" },
      { it: "lo scrittore", de: "der Schriftsteller", emoji: "✍️" },
      { it: "il capitolo", de: "das Kapitel", emoji: "📄" },
      { it: "la pagina", de: "die Seite", emoji: "📃" },
      { it: "il personaggio", de: "die Figur (im Buch)", emoji: "🎭" },
      { it: "interessante", de: "interessant", emoji: "🤓" }
    ],
    sentences: [
      { it: "Il libro che sto leggendo è bello.", de: "Das Buch, das ich lese, ist schön." },
      { it: "Lo scrittore, che è milanese, ha cinquant'anni.", de: "Der Schriftsteller, der aus Mailand stammt, ist fünfzig Jahre alt." },
      { it: "La pagina su cui mi sono fermato è l'ultima.", de: "Die Seite, auf der ich stehen geblieben bin, ist die letzte." },
      { it: "La storia, che comincia a Venezia, mi emoziona.", de: "Die Geschichte, die in Venedig beginnt, berührt mich." },
      { it: "Il personaggio di cui ti parlavo è un ladro.", de: "Die Figur, von der ich dir erzählt habe, ist ein Dieb." },
      { it: "È un libro che consiglio a tutti.", de: "Es ist ein Buch, das ich allen empfehle." },
      { it: "La sera leggo le pagine che mi restano.", de: "Am Abend lese ich die Seiten, die mir bleiben." }
    ],
    build: [0, 3, 5],
    produce: [1, 4, 6],
    covers: ["media"]
  },
  {
    id: "gerundio", level: "B1", title: "Stavo uscendo…", icon: "🚶",
    scene: "Gerundio und „stare per“: Gleichzeitigkeit und unmittelbare Zukunft ausdrücken.",
    words: [
      { it: "stavo uscendo", de: "ich war gerade am Rausgehen", emoji: "🚪" },
      { it: "camminando", de: "gehend / beim Gehen", emoji: "🚶" },
      { it: "mentre", de: "während", emoji: "⏳" },
      { it: "sto per", de: "ich bin kurz davor zu", emoji: "⏱️" },
      { it: "aspettando", de: "wartend", emoji: "🛗" },
      { it: "tardi", de: "spät", emoji: "🌙", key: "word_avverbi_a1_tardi" }
    ],
    sentences: [
      { it: "Stavo uscendo quando è arrivato Luca.", de: "Ich war gerade beim Rausgehen, als Luca ankam." },
      { it: "Camminando per il centro ho visto Anna.", de: "Beim Laufen durch das Zentrum sah ich Anna." },
      { it: "Mentre parlavamo, pioveva.", de: "Während wir sprachen, regnete es." },
      { it: "Sto per partire, un minuto!", de: "Ich fahre gleich los, eine Minute!" },
      { it: "Aspettando il treno, bevo un caffè.", de: "Beim Warten auf den Zug trinke ich einen Espresso." },
      { it: "Andando piano si arriva lontano.", de: "Wer langsam geht, kommt weit." },
      { it: "È tardi, sto correndo!", de: "Es ist spät, ich renne schon!" }
    ],
    build: [0, 3, 5],
    produce: [1, 2, 4],
    covers: ["mente"]
  },
  {
    id: "si-parla", level: "B1", title: "Qui si parla italiano", icon: "🗣️",
    scene: "Das kleine Passivo: „si mangia“, „si vede“, „viene costruito“ — unpersönliche Aussagen meistern.",
    words: [
      { it: "si parla", de: "man spricht", emoji: "🗣️" },
      { it: "si mangia", de: "man isst", emoji: "🍽️" },
      { it: "si vede", de: "man sieht", emoji: "👁️" },
      { it: "si trova", de: "man findet / es befindet sich", emoji: "📍" },
      { it: "viene costruito", de: "wird gebaut", emoji: "🏗️" },
      { it: "è aperto", de: "ist geöffnet", emoji: "🚪" },
      { it: "benvenuti", de: "willkommen", emoji: "🙌" }
    ],
    sentences: [
      { it: "In questa osteria si mangia benissimo.", de: "In dieser Trattoria isst man ausgezeichnet." },
      { it: "Dalla finestra si vede il lago.", de: "Vom Fenster aus sieht man den See." },
      { it: "Il museo si trova in centro.", de: "Das Museum befindet sich im Zentrum." },
      { it: "Il nuovo ponte viene costruito quest'anno.", de: "Die neue Brücke wird dieses Jahr gebaut." },
      { it: "Il mercato è aperto fino a mezzogiorno.", de: "Der Markt ist bis Mittag geöffnet." },
      { it: "Qui si parla italiano e anche dialetto.", de: "Hier spricht man Italienisch und auch Dialekt." },
      { it: "Benvenuti, cosa posso offrire?", de: "Willkommen, was kann ich Ihnen anbieten?" }
    ],
    build: [0, 2, 4],
    produce: [1, 3, 6],
    covers: ["citta3"]
  },
  {
    id: "avrei-voluto", level: "B1", title: "Avrei voluto…", icon: "🎭",
    scene: "Der Condizionale composto: „hätte ich gern getan“ — verpasste Chancen elegant ausdrücken.",
    words: [
      { it: "avrei voluto", de: "ich hätte gern gewollt", emoji: "💭" },
      { it: "sarebbe stato", de: "es wäre gewesen", emoji: "🌀" },
      { it: "avremmo fatto", de: "wir hätten gemacht", emoji: "🤝" },
      { it: "avresti visto", de: "du hättest gesehen", emoji: "👀" },
      { it: "purtroppo", de: "leider", emoji: "😞", key: "word_opinioni_purtroppo" },
      { it: "una volta", de: "einmal / früher", emoji: "📖" }
    ],
    sentences: [
      { it: "Avrei voluto partire con voi.", de: "Ich wäre gern mit euch gefahren." },
      { it: "Sarebbe stato un viaggio bellissimo.", de: "Es wäre eine wunderschöne Reise geworden." },
      { it: "Avremmo fatto un giro del lago.", de: "Wir hätten eine Runde um den See gemacht." },
      { it: "Avresti visto la Toscana dal treno.", de: "Du hättest die Toskana aus dem Zug gesehen." },
      { it: "Purtroppo il lavoro non aspetta.", de: "Leider wartet die Arbeit nicht." },
      { it: "Una volta l'anno, però, si riposa.", de: "Einmal im Jahr ruht man sich aber aus." },
      { it: "La prossima volta verrò con voi.", de: "Das nächste Mal komme ich mit euch." }
    ],
    build: [0, 2, 6],
    produce: [1, 3, 4],
    covers: ["viaggi2"]
  },
  {
    id: "colloquio2", level: "B1", title: "Il secondo colloquio", icon: "💼",
    scene: "Die zweite Runde im Bewerbungsprozess: Projekte, Kunden, Erwartungen — B1-Berufssprache.",
    words: [
      { it: "la posizione", de: "die Position / Stelle", emoji: "📍" },
      { it: "la riunione", de: "die Besprechung", emoji: "👥" },
      { it: "le competenze", de: "die Kompetenzen", emoji: "🎯" },
      { it: "il successo", de: "der Erfolg", emoji: "🏆" },
      { it: "la sfida", de: "die Herausforderung", emoji: "⚔️" },
      { it: "il cliente", de: "der Kunde", emoji: "🤵" },
      { it: "ho superato", de: "ich habe bestanden", emoji: "✅" }
    ],
    sentences: [
      { it: "Ho superato il primo colloquio!", de: "Ich habe das erste Gespräch bestanden!" },
      { it: "Il secondo è con il direttore.", de: "Das zweite ist mit dem Direktor." },
      { it: "La posizione richiede molta esperienza.", de: "Die Position verlangt viel Erfahrung." },
      { it: "Nella riunione di oggi parliamo del progetto.", de: "In der heutigen Besprechung sprechen wir über das Projekt." },
      { it: "Il cliente vuole vedere i risultati.", de: "Der Kunde möchte die Ergebnisse sehen." },
      { it: "È una sfida, ma anche un'opportunità.", de: "Es ist eine Herausforderung, aber auch eine Chance." },
      { it: "Il successo arriva con la pazienza.", de: "Der Erfolg kommt mit Geduld." }
    ],
    build: [0, 3, 5],
    produce: [1, 2, 4],
    covers: ["lavoro3"]
  },
  {
    id: "giornale", level: "B1", title: "Il giornale di oggi", icon: "📰",
    scene: "Nachrichten lesen und wiedergeben: Passivo light („è stato pubblicato“) und Medienwortschatz.",
    words: [
      { it: "pubblicato", de: "veröffentlicht", emoji: "🗞️" },
      { it: "la notizia", de: "die Nachricht", emoji: "📰" },
      { it: "l'articolo", de: "der Artikel", emoji: "📄" },
      { it: "il giornalista", de: "der Journalist", emoji: "🎤" },
      { it: "il titolo", de: "der Titel / die Schlagzeile", emoji: "🔖" },
      { it: "la stampa", de: "die Presse", emoji: "🗞️" },
      { it: "il telegiornale", de: "die Nachrichtensendung", emoji: "📺" }
    ],
    sentences: [
      { it: "L'articolo è stato pubblicato stamattina.", de: "Der Artikel wurde heute Morgen veröffentlicht." },
      { it: "La notizia corre su tutti i titoli.", de: "Die Nachricht läuft über alle Schlagzeilen." },
      { it: "Il giornalista ha intervistato il sindaco.", de: "Der Journalist hat den Bürgermeister interviewt." },
      { it: "Il telegiornale inizia alle ore venti.", de: "Die Nachrichtensendung beginnt um zwanzig Uhr." },
      { it: "La stampa parla solo di questo.", de: "Die Presse spricht nur darüber." },
      { it: "Secondo il giornale, tutto andrà meglio.", de: "Laut der Zeitung wird alles besser." },
      { it: "Che ne dici? Leggiamo insieme?", de: "Was meinst du? Lesen wir zusammen?" }
    ],
    build: [0, 3, 4],
    produce: [1, 2, 6],
    covers: ["media"]
  },
  { id: "m3-congiuntivo-veloce", level: "B1", mini: true, title: "Mini: Congiuntivo veloce", icon: "💭", scene: "Vier Kongruenzen im CongiuntivoPresente.",
    words: [{ it: "sia", de: "dass er/sie ist", emoji: "🪞" }, { it: "abbia", de: "dass er/sie hat", emoji: "🫴" }, { it: "faccia", de: "dass er/sie macht", emoji: "🛠️" }, { it: "vada", de: "dass er/sie geht", emoji: "🚶" }, { it: "chi", de: "wer", emoji: "❓" }, { it: "che", de: "dass / der, die, das", emoji: "🔗" }],
    sentences: [
      { it: "Credo che sia tardi.", de: "Ich glaube, dass es spät ist." },
      { it: "Penso che abbiano ragione.", de: "Ich denke, dass sie recht haben." },
      { it: "Sembra che vada tutto bene.", de: "Es scheint, dass alles gut läuft." },
      { it: "È importante che faccia esercizio.", de: "Es ist wichtig, dass er/sie Übung macht." }
    ],
    build: [0], produce: [1, 2], covers: ["opinioni"] },
  { id: "m3-che-cui", level: "B1", mini: true, title: "Mini: che & cui" , icon: "🔗", scene: "Relativpronomen sauber setzen.",
    words: [{ it: "che", de: "der / die / das", emoji: "🔗" }, { it: "chi", de: "wer", emoji: "❓" }, { it: "come", de: "wie", emoji: "🤔" }, { it: "quando", de: "wann", emoji: "⏰" }, { it: "quale", de: "welche(r/s)", emoji: "🔢" }, { it: "perché", de: "warum / weil", emoji: "❓" }],
    sentences: [
      { it: "Il libro che leggo è nuovo.", de: "Das Buch, das ich lese, ist neu." },
      { it: "La persona di cui ti parlavo è qui.", de: "Die Person, von der ich dir erzählt habe, ist hier." },
      { it: "La città in cui vivo è piccola.", de: "Die Stadt, in der ich lebe, ist klein." },
      { it: "Chi cerca, trova.", de: "Wer sucht, findet." }
    ],
    build: [0], produce: [1, 2], covers: ["media"] },
  { id: "m3-doppi-pronomi", level: "B1", mini: true, title: "Mini: Doppi pronomi", icon: "🤲", scene: "Zwei Pronomen in Folge, korrekt verbunden.",
    words: [{ it: "me ne", de: "mich davon", emoji: "🚶" }, { it: "ce ne", de: "uns davon", emoji: "👫" }, { it: "se lo", de: "sich es", emoji: "🪞" }, { it: "se la", de: "sich sie", emoji: "🪞" }],
    sentences: [
      { it: "Me ne vado adesso.", de: "Ich gehe jetzt." },
      { it: "Ce ne andiamo insieme?", de: "Gehen wir zusammen?" },
      { it: "Se lo merita, davvero.", de: "Er/sie hat es wirklich verdient." },
      { it: "Se la ricorda sempre.", de: "Er/sie erinnert sich immer daran." }
    ],
    build: [0], produce: [1, 2], covers: ["mente"] },
  /* ================= A2-Erweiterung auf 75 (20 Stories +
     31 Minis: Imperfetto/Passato-Kontrast, Condizionale,
     Imperativo tu/Lei, Pronomen, piacere, ne/ci, Vergleiche,
     da + Zeitraum) ================= */

  /* ================= B1-Erweiterung auf 75 (22 Stories +
     33 Minis: Congiuntivo presente/passato, Gerundio, Passivo,
     Periodo ipotetico 1, Relativsätze, Discorso indiretto,
     Pronomen-Kombinationen, Connectors) ================= */

  {
    id: "posto-fisso", level: "B1", title: "Il posto fisso", icon: "💼",
    scene: "Vorstellungsgespräch für eine Festanstellung: Congiuntivo nach „qualcuno che“, Bedingungssatz, Futuro.",
    words: [
      { it: "la posizione", de: "die Position / Stelle", emoji: "📍" },
      { it: "il ruolo", de: "die Rolle", emoji: "🎭" },
      { it: "le competenze", de: "die Kompetenzen", emoji: "🎯" },
      { it: "la formazione", de: "die Ausbildung", emoji: "🎓" },
      { it: "la riunione", de: "die Besprechung", emoji: "👥" },
      { it: "il cliente", de: "der Kunde", emoji: "🤵" },
      { it: "sicuramente", de: "sicher(lich)", emoji: "✅" }
    ],
    sentences: [
      { it: "Domani ho il colloquio per un posto fisso.", de: "Morgen habe ich das Gespräch für eine Festanstellung." },
      { it: "Penso che il ruolo sia perfetto per me.", de: "Ich denke, dass die Rolle perfekt für mich ist." },
      { it: "Il direttore cerca qualcuno che abbia esperienza.", de: "Der Direktor sucht jemanden, der Erfahrung hat." },
      { it: "Le competenze richieste sono chiare.", de: "Die geforderten Kompetenzen sind klar." },
      { it: "Se tutto va bene, firmerò la settimana prossima.", de: "Wenn alles gut läuft, unterschreibe ich nächste Woche." },
      { it: "Alla riunione ho già conosciuto il team.", de: "Bei der Besprechung habe ich das Team schon kennengelernt." },
      { it: "Sicuramente sarà una giornata importante.", de: "Sicherlich wird es ein wichtiger Tag." }
    ],
    build: [1, 3, 5],
    produce: [0, 2, 6],
    covers: ["lavoro3"]
  },
  {
    id: "riunione-lunedi", level: "B1", title: "La riunione di lunedì", icon: "📊",
    scene: "Montagsmeeting: Gerundio für das Gleichzeitige, indirekte Frage des Chefs, Konnektor nonostante.",
    words: [
      { it: "la riunione", de: "die Besprechung", emoji: "👥" },
      { it: "il progetto", de: "das Projekt", emoji: "📊" },
      { it: "la posizione", de: "die Position / Stelle", emoji: "📍" },
      { it: "la formazione", de: "die Weiterbildung", emoji: "🎓" },
      { it: "la sfida", de: "die Herausforderung", emoji: "⚔️" },
      { it: "il successo", de: "der Erfolg", emoji: "🏆" },
      { it: "probabilmente", de: "wahrscheinlich", emoji: "📊" }
    ],
    sentences: [
      { it: "Alla riunione di lunedì si parlava del nuovo progetto.", de: "In der Montagsbesprechung sprach man über das neue Projekt." },
      { it: "Mentre il capo parlava, prendevo appunti.", de: "Während der Chef sprach, machte ich Notizen." },
      { it: "Sto finendo la relazione proprio adesso.", de: "Ich beende den Bericht gerade jetzt." },
      { it: "Il progetto è andato avanti nonostante le difficoltà.", de: "Das Projekt ist trotz der Schwierigkeiten vorangekommen." },
      { it: "Il capo ha chiesto se ho finito la relazione.", de: "Der Chef hat gefragt, ob ich den Bericht beendet habe." },
      { it: "Secondo me, la sfida più grande è il tempo.", de: "Meiner Meinung nach ist die größte Herausforderung die Zeit." },
      { it: "Probabilmente presenteremo i risultati in maggio.", de: "Wahrscheinlich präsentieren wir die Ergebnisse im Mai." }
    ],
    build: [1, 3, 6],
    produce: [0, 4, 5],
    covers: ["lavoro3"]
  },
  {
    id: "intervista", level: "B1", title: "L'intervista", icon: "🎤",
    scene: "Ein Interview geben und hinterher lesen, was daraus geworden ist — Discorso indiretto pur.",
    words: [
      { it: "il giornalista", de: "der Journalist", emoji: "🎤" },
      { it: "l'articolo", de: "der Artikel", emoji: "📄" },
      { it: "la notizia", de: "die Nachricht", emoji: "📰" },
      { it: "il titolo", de: "die Schlagzeile", emoji: "🔖" },
      { it: "il commento", de: "der Kommentar", emoji: "🖋️" },
      { it: "l'edizione", de: "die Ausgabe", emoji: "📚" },
      { it: "davvero", de: "wirklich", emoji: "‼️" }
    ],
    sentences: [
      { it: "Ieri ho dato un'intervista al giornalista.", de: "Gestern habe ich dem Journalisten ein Interview gegeben." },
      { it: "Mi ha chiesto se lavoro nel turismo.", de: "Er hat mich gefragt, ob ich im Tourismus arbeite." },
      { it: "Ho risposto che il turismo è cambiato molto.", de: "Ich habe geantwortet, dass sich der Tourismus stark verändert hat." },
      { it: "Ha scritto che la città è più viva che mai.", de: "Er hat geschrieben, dass die Stadt lebendiger ist denn je." },
      { it: "L'articolo uscirà nell'edizione del weekend.", de: "Der Artikel erscheint in der Wochenendausgabe." },
      { it: "Il titolo era già pronto: era davvero efficace.", de: "Die Schlagzeile war schon fertig: sie war wirklich wirkungsvoll." },
      { it: "Spero che il commento dei lettori sia positivo.", de: "Ich hoffe, dass das Kommentar der Leser positiv ist." }
    ],
    build: [1, 2, 4],
    produce: [0, 3, 6],
    covers: ["media"]
  },
  {
    id: "podcast-clima", level: "B1", title: "Il podcast sul clima", icon: "🎧",
    scene: "Eine Podcast-Folge über das Klima: Zitate im Indirekten, Congiuntivo, Bedingungssatz mit Passivo.",
    words: [
      { it: "il podcast", de: "der Podcast", emoji: "🎧" },
      { it: "la puntata", de: "die Folge", emoji: "🎬" },
      { it: "il clima", de: "das Klima", emoji: "🌤️" },
      { it: "il cambiamento", de: "die Veränderung", emoji: "🔄" },
      { it: "l'energia", de: "die Energie", emoji: "🔋" },
      { it: "il risparmio", de: "die Einsparung", emoji: "💰" },
      { it: "sostenibile", de: "nachhaltig", emoji: "🌱" }
    ],
    sentences: [
      { it: "Ho ascoltato una puntata sul clima.", de: "Ich habe eine Folge über das Klima gehört." },
      { it: "Il conduttore ha detto che il cambiamento è già qui.", de: "Der Moderator hat gesagt, dass der Wandel schon da ist." },
      { it: "Parlava dell'energia pulita e del risparmio.", de: "Er sprach über saubere Energie und Einsparungen." },
      { it: "Credo che ogni gesto conti, anche piccolo.", de: "Ich glaube, dass jede Geste zählt, auch eine kleine." },
      { it: "Se ricicliamo tutti, il risultato si vedrà.", de: "Wenn wir alle recyceln, wird man das Ergebnis sehen." },
      { it: "La città ha aperto un centro sostenibile.", de: "Die Stadt hat ein nachhaltiges Zentrum eröffnet." },
      { it: "Vale la pena ascoltarlo, davvero.", de: "Er lohnt sich zu hören, wirklich." }
    ],
    build: [1, 4, 5],
    produce: [0, 3, 6],
    covers: ["ambiente", "media"]
  },
  {
    id: "citta-cambia", level: "B1", title: "La città che cambia", icon: "🏗️",
    scene: "Stadt im Umbau: Passivo im Futuro und Passato, si-Formen, Konnektor nonostante.",
    words: [
      { it: "la metropolitana", de: "die U-Bahn", emoji: "🚇" },
      { it: "il centro storico", de: "die Altstadt", emoji: "🏰" },
      { it: "la zona pedonale", de: "die Fußgängerzone", emoji: "🚶" },
      { it: "il quartiere", de: "das Viertel", emoji: "🏘️" },
      { it: "la folla", de: "die Menschenmenge", emoji: "👥" },
      { it: "il traffico", de: "der Verkehr", emoji: "🚗" },
      { it: "la periferia", de: "der Stadtrand", emoji: "🌆" }
    ],
    sentences: [
      { it: "La nostra città sta cambiando volto.", de: "Unsere Stadt verändert gerade ihr Gesicht." },
      { it: "La nuova metropolitana verrà aperta in primavera.", de: "Die neue U-Bahn wird im Frühjahr eröffnet." },
      { it: "Il centro storico è stato chiuso al traffico.", de: "Die Altstadt wurde für den Verkehr gesperrt." },
      { it: "Adesso c'è una zona pedonale piena di vita.", de: "Jetzt gibt es eine Fußgängerzone voller Leben." },
      { it: "La sera la folla riempie le piazze.", de: "Am Abend füllen die Menschenmassen die Plätze." },
      { it: "In periferia, invece, si vive più tranquilli.", de: "Am Stadtrand lebt man dagegen ruhiger." },
      { it: "Nonostante i cantieri, la città resta bellissima.", de: "Trotz der Baustellen bleibt die Stadt wunderschön." }
    ],
    build: [1, 2, 4],
    produce: [0, 3, 6],
    covers: ["citta3"]
  },
  {
    id: "volo-cancellato", level: "B1", title: "Il volo cancellato", icon: "✈️",
    scene: "Reisechaos: Passivo, Bedingungssatz und ein Retter namens Bahn.",
    words: [
      { it: "il volo", de: "der Flug", emoji: "✈️" },
      { it: "l'imbarco", de: "das Boarding", emoji: "🛫" },
      { it: "lo scalo", de: "der Zwischenstopp", emoji: "🛬" },
      { it: "la dogana", de: "der Zoll", emoji: "🛃" },
      { it: "il bagaglio a mano", de: "das Handgepäck", emoji: "🎒" },
      { it: "la destinazione", de: "das Reiseziel", emoji: "📍" },
      { it: "la conferma", de: "die Bestätigung", emoji: "✅" }
    ],
    sentences: [
      { it: "Il nostro volo è stato cancellato all'improvviso.", de: "Unser Flug wurde plötzlich gestrichen." },
      { it: "La destinazione era vicina, ma irraggiungibile.", de: "Das Ziel war nah, aber unerreichbar." },
      { it: "Se il volo non riparte, prenderemo il treno.", de: "Wenn der Flug nicht startet, nehmen wir den Zug." },
      { it: "Allo scalo hanno perso il nostro bagaglio.", de: "Am Zwischenstopp haben sie unser Gepäck verloren." },
      { it: "Alla dogana la fila era lunghissima.", de: "Beim Zoll war die Schlange extrem lang." },
      { it: "Il bagaglio a mano, almeno, era con noi.", de: "Das Handgepäck war wenigstens bei uns." },
      { it: "La conferma del nuovo volo è arrivata via sms.", de: "Die Bestätigung des neuen Flugs kam per SMS." }
    ],
    build: [0, 3, 6],
    produce: [1, 2, 5],
    covers: ["viaggi2"]
  },
  {
    id: "ricetta-segreta", level: "B1", title: "La ricetta segreta", icon: "👩‍🍳",
    scene: "Ein Familienrezept weitergeben: Imperativ mit Pronomen („mescolali!“) und Küchen-Passivo-Feeling.",
    words: [
      { it: "l'ingrediente", de: "die Zutat", emoji: "🥘" },
      { it: "la cottura", de: "das Garen / die Garzeit", emoji: "⏲️" },
      { it: "il forno", de: "der Backofen", emoji: "🔥" },
      { it: "la padella", de: "die Pfanne", emoji: "🍳" },
      { it: "il sapore", de: "der Geschmack", emoji: "😋" },
      { it: "piccante", de: "scharf / würzig", emoji: "🌶️" },
      { it: "il barattolo", de: "das Glas", emoji: "🫙" }
    ],
    sentences: [
      { it: "La ricetta segreta? Te la dico volentieri.", de: "Das geheime Rezept? Das sage ich dir gern." },
      { it: "Prendi la padella e scalda l'olio.", de: "Nimm die Pfanne und erhitze das Öl." },
      { it: "Aggiungi gli ingredienti e mescolali piano.", de: "Füge die Zutaten hinzu und rühre sie langsam um." },
      { it: "La cottura richiede pazienza e amore.", de: "Das Garen erfordert Geduld und Liebe." },
      { it: "Metti tutto in forno per venti minuti.", de: "Gib alles für zwanzig Minuten in den Ofen." },
      { it: "Il sapore? Piccante ma equilibrato.", de: "Der Geschmack? Scharf, aber ausgewogen." },
      { it: "Alla fine chiudi tutto nel barattolo.", de: "Am Ende schließt du alles im Glas." }
    ],
    build: [1, 2, 4],
    produce: [0, 3, 6],
    covers: ["cucina2"]
  },
  {
    id: "che-ne-pensi", level: "B1", title: "Che ne pensi?", icon: "💭",
    scene: "Eine Diskussion über Remote-Arbeit: Meinungsbausteine, Congiuntivo, „invece di“ + Infinitiv.",
    words: [
      { it: "l'opinione", de: "die Meinung", emoji: "💭" },
      { it: "il punto di vista", de: "der Standpunkt", emoji: "🧭" },
      { it: "d'accordo", de: "einverstanden", emoji: "🤝" },
      { it: "secondo me", de: "meiner Meinung nach", emoji: "🤔" },
      { it: "a mio parere", de: "meines Erachtens", emoji: "🎩" },
      { it: "invece", de: "stattdessen", emoji: "↩️" },
      { it: "tuttavia", de: "jedoch", emoji: "↪️" }
    ],
    sentences: [
      { it: "Che ne pensi del lavoro da remoto?", de: "Was hältst du von Remote-Arbeit?" },
      { it: "A mio parere, risparmia molto tempo.", de: "Meines Erachtens spart sie viel Zeit." },
      { it: "Il mio collega non è d'accordo: lui ama l'ufficio.", de: "Mein Kollege ist nicht einverstanden: er liebt das Büro." },
      { it: "Rispetto il suo punto di vista, tuttavia preferisco casa mia.", de: "Ich respektiere seinen Standpunkt, jedoch bevorzuge ich mein Zuhause." },
      { it: "Secondo me, l'importante è l'equilibrio.", de: "Nach meiner Meinung ist das Wichtigste das Gleichgewicht." },
      { it: "Penso che ognuno scelga la sua strada.", de: "Ich denke, dass jeder seinen Weg wählt." },
      { it: "Invece di discutere, proviamo entrambi.", de: "Anstatt zu diskutieren, probieren wir beide." }
    ],
    build: [2, 4, 6],
    produce: [1, 3, 5],
    covers: ["opinioni"]
  },
  {
    id: "giornale-mattino", level: "B1", title: "Il giornale del mattino", icon: "🗞️",
    scene: "Zeitungsritual: Passivo in den Schlagzeilen, „pare che“ + Congiuntivo.",
    words: [
      { it: "la stampa", de: "die Presse", emoji: "🗞️" },
      { it: "il telegiornale", de: "die Nachrichtensendung", emoji: "📺" },
      { it: "la notizia", de: "die Nachricht", emoji: "📰" },
      { it: "il notiziario", de: "die Nachrichtenübersicht", emoji: "📻" },
      { it: "l'edizione", de: "die Ausgabe", emoji: "📚" },
      { it: "il commento", de: "der Kommentar", emoji: "🖋️" },
      { it: "il titolo", de: "die Schlagzeile", emoji: "🔖" }
    ],
    sentences: [
      { it: "La mattina leggo il giornale con il caffè.", de: "Morgens lese ich mit dem Espresso die Zeitung." },
      { it: "Oggi il titolo parla di economia.", de: "Heute handelt die Schlagzeile von der Wirtschaft." },
      { it: "Le notizie sono state pubblicate di notte.", de: "Die Nachrichten wurden über Nacht veröffentlicht." },
      { it: "Il telegiornale della sera ripeterà tutto.", de: "Die Abendnachrichten werden alles wiederholen." },
      { it: "Il commento del direttore è sempre acuto.", de: "Der Kommentar des Direktors ist immer scharfsinnig." },
      { it: "Pare che la stampa scriva le stesse cose.", de: "Es scheint, dass die Presse dieselben Dinge schreibt." },
      { it: "L'edizione digitale esce a mezzanotte.", de: "Die digitale Ausgabe erscheint um Mitternacht." }
    ],
    build: [2, 4, 6],
    produce: [1, 3, 5],
    covers: ["media"]
  },
  {
    id: "mercato-contadino", level: "B1", title: "Il mercato contadino", icon: "🥬",
    scene: "Bauernmarkt statt Supermarkt: Umwelt-Wortschatz in echten Entscheidungen.",
    words: [
      { it: "l'ambiente", de: "die Umwelt", emoji: "🌍" },
      { it: "il riciclo", de: "das Recycling", emoji: "♻️" },
      { it: "la spazzatura", de: "der Müll", emoji: "🗑️" },
      { it: "l'inquinamento", de: "die Umweltverschmutzung", emoji: "🏭" },
      { it: "la protezione", de: "der Schutz", emoji: "🛡️" },
      { it: "il risparmio", de: "die Einsparung", emoji: "💰" },
      { it: "fresco", de: "frisch", emoji: "🥗" }
    ],
    sentences: [
      { it: "Il sabato vado al mercato contadino.", de: "Samstags gehe ich zum Bauernmarkt." },
      { it: "La frutta è fresca e senza plastica.", de: "Das Obst ist frisch und ohne Plastik." },
      { it: "Meno imballaggi significano meno spazzatura.", de: "Weniger Verpackungen bedeuten weniger Müll." },
      { it: "Così contribuisco alla protezione dell'ambiente.", de: "So trage ich zum Schutz der Umwelt bei." },
      { it: "Porto la mia borsa: niente sacchetti.", de: "Ich bringe meine Tasche mit: keine Tüten." },
      { it: "L'inquinamento delle città mi preoccupa davvero.", de: "Die Verschmutzung der Städte beunruhigt mich wirklich." },
      { it: "Ogni risparmio di plastica è una vittoria.", de: "Jede Plastikersparnis ist ein Sieg." }
    ],
    build: [1, 3, 6],
    produce: [0, 4, 5],
    covers: ["ambiente"]
  },
  {
    id: "metro-nuova", level: "B1", title: "La metro nuova", icon: "🚇",
    scene: "Neue U-Bahn-Haltestelle im Viertel: Pro und Kontra, Passivo, Bedingungssatz.",
    words: [
      { it: "la metropolitana", de: "die U-Bahn", emoji: "🚇" },
      { it: "il semaforo", de: "die Ampel", emoji: "🚦" },
      { it: "l'incrocio", de: "die Kreuzung", emoji: "🔀" },
      { it: "la serata", de: "der Abend (Veranstaltung)", emoji: "🌙" },
      { it: "il quartiere", de: "das Viertel", emoji: "🏘️" },
      { it: "il monumento", de: "das Denkmal", emoji: "🗿" },
      { it: "probabilmente", de: "wahrscheinlich", emoji: "📊" }
    ],
    sentences: [
      { it: "Hanno annunciato una fermata nel nostro quartiere.", de: "Sie haben eine Haltestelle in unserem Viertel angekündigt." },
      { it: "Probabilmente i lavori dureranno due anni.", de: "Wahrscheinlich werden die Arbeiten zwei Jahre dauern." },
      { it: "C'è chi è contento e chi si lamenta.", de: "Es gibt welche, die froh sind, und welche, die sich beschweren." },
      { it: "Io dico: se arriva la metro, guadagniamo tutti.", de: "Ich sage: Wenn die U-Bahn kommt, gewinnen wir alle." },
      { it: "Al vecchio incrocio il semaforo è già stato sostituito.", de: "An der alten Kreuzung wurde die Ampel schon ersetzt." },
      { it: "La serata di apertura sarà memorabile.", de: "Der Eröffnungsabend wird denkwürdig." },
      { it: "Il monumento vicino avrà finalmente più visitatori.", de: "Das nahe Denkmal wird endlich mehr Besucher haben." }
    ],
    build: [3, 4, 6],
    produce: [0, 1, 2],
    covers: ["citta3", "opinioni"]
  },
  {
    id: "corso-scrittura", level: "B1", title: "Il corso di scrittura", icon: "✍️",
    scene: "Schreibkurs gegen Selbstzweifel: „anche se“ + Indikativ, Hoffnungssatz mit „di“ + Infinitiv.",
    words: [
      { it: "il dubbio", de: "der Zweifel", emoji: "🤨" },
      { it: "la speranza", de: "die Hoffnung", emoji: "🕊️" },
      { it: "il desiderio", de: "der Wunsch", emoji: "⭐" },
      { it: "la soluzione", de: "die Lösung", emoji: "💡" },
      { it: "la possibilità", de: "die Möglichkeit", emoji: "🎲" },
      { it: "la certezza", de: "die Gewissheit", emoji: "💯" },
      { it: "anche se", de: "auch wenn", emoji: "☔" }
    ],
    sentences: [
      { it: "Mi sono iscritto a un corso di scrittura.", de: "Ich habe mich zu einem Schreibkurs angemeldet." },
      { it: "Il primo giorno avevo solo dubbi.", de: "Am ersten Tag hatte ich nur Zweifel." },
      { it: "L'insegnante dice che ognuno ha una storia.", de: "Die Lehrerin sagt, dass jeder eine Geschichte hat." },
      { it: "Io scrivo anche se nessuno mi legge.", de: "Ich schreibe, auch wenn mich niemand liest." },
      { it: "La speranza è di pubblicare qualcosa, un giorno.", de: "Die Hoffnung ist, eines Tages etwas zu veröffentlichen." },
      { it: "Nel dubbio, taglio le frasi lunghe.", de: "Im Zweifel schneide ich lange Sätze." },
      { it: "La certezza più bella: scrivere mi piace.", de: "Die schönste Gewissheit: Schreiben gefällt mir." }
    ],
    build: [1, 4, 6],
    produce: [0, 3, 5],
    covers: ["mente"]
  },
  {
    id: "road-trip", level: "B1", title: "Il road trip", icon: "🚗",
    scene: "Roadtrip durch drei Regionen: Gerundio („cantando“), Relativsätze, Grenzerlebnis.",
    words: [
      { it: "l'itinerario", de: "die Reiseroute", emoji: "🗺️" },
      { it: "la destinazione", de: "das Reiseziel", emoji: "📍" },
      { it: "la frontiera", de: "die Grenze", emoji: "🚧" },
      { it: "la conferma", de: "die Bestätigung", emoji: "✅" },
      { it: "la classe", de: "die (Buchungs-)Klasse", emoji: "💺" },
      { it: "l'imbarco", de: "das Boarding", emoji: "🛫" }
    ],
    sentences: [
      { it: "Abbiamo progettato un road trip avventuroso.", de: "Wir haben einen abenteuerlichen Roadtrip geplant." },
      { it: "L'itinerario toccava tre regioni.", de: "Die Reiseroute berührte drei Regionen." },
      { it: "Ogni destinazione era una sorpresa.", de: "Jedes Reiseziel war eine Überraschung." },
      { it: "Alla frontiera non ci hanno fermati.", de: "An der Grenze haben sie uns nicht aufgehalten." },
      { it: "Abbiamo guidato cantando a squarciagola.", de: "Wir sind aus voller Kehle singend gefahren." },
      { it: "La conferma dell'hotel è arrivata alle tre.", de: "Die Hotelbestätigung kam um drei." },
      { it: "Al ritorno, l'imbarco era già chiuso: che avventura!", de: "Bei der Rückkehr war das Boarding schon geschlossen: was für ein Abenteuer!" }
    ],
    build: [1, 3, 4],
    produce: [0, 2, 6],
    covers: ["viaggi2"]
  },
  {
    id: "critica-film", level: "B1", title: "La critica del film", icon: "🎬",
    scene: "Rezension lesen und widersprechen: Congiuntivo passato, Indirektes, Imperativ mit „ne“.",
    words: [
      { it: "la rivista", de: "die Zeitschrift", emoji: "📔" },
      { it: "l'articolo", de: "der Artikel", emoji: "📄" },
      { it: "il commento", de: "der Kommentar", emoji: "🖋️" },
      { it: "il punto di vista", de: "der Standpunkt", emoji: "🧭" },
      { it: "d'accordo", de: "einverstanden", emoji: "🤝" },
      { it: "purtroppo", de: "leider", emoji: "😞" },
      { it: "davvero", de: "wirklich", emoji: "‼️" }
    ],
    sentences: [
      { it: "Ho letto una recensione del nuovo film.", de: "Ich habe eine Rezension des neuen Films gelesen." },
      { it: "Il critico scrive che la storia è debole.", de: "Der Kritiker schreibt, dass die Geschichte schwach ist." },
      { it: "Non sono d'accordo con il suo punto di vista.", de: "Ich bin nicht einverstanden mit seinem Standpunkt." },
      { it: "Penso che il regista abbia fatto un ottimo lavoro.", de: "Ich denke, dass der Regisseur eine sehr gute Arbeit gemacht hat." },
      { it: "L'articolo sulla rivista era severo, purtroppo.", de: "Der Artikel in der Zeitschrift war streng, leider." },
      { it: "Il commento dei lettori era diviso.", de: "Das Kommentar der Leser war gespalten." },
      { it: "Andatelo a vedere, poi ne parliamo!", de: "Geht ihn ansehen, dann reden wir darüber!" }
    ],
    build: [2, 4, 5],
    produce: [1, 3, 6],
    covers: ["opinioni", "media"]
  },
  {
    id: "menu-degustazione", level: "B1", title: "Il menu degustazione", icon: "🍷",
    scene: "Degustationsmenü: Mengen, Garzeiten, Geschmäcker — kulinarisches Erzählen.",
    words: [
      { it: "il piatto", de: "das Gericht", emoji: "🍛" },
      { it: "il grammo", de: "das Gramm", emoji: "⚖️" },
      { it: "il litro", de: "der Liter", emoji: "🥛" },
      { it: "la scatola", de: "die Dose / Schachtel", emoji: "📦" },
      { it: "la cottura", de: "die Garzeit", emoji: "⏲️" },
      { it: "fresco", de: "frisch / gekühlt", emoji: "🥗" },
      { it: "piccante", de: "scharf / würzig", emoji: "🌶️" }
    ],
    sentences: [
      { it: "Abbiamo provato il menu degustazione.", de: "Wir haben das Degustationsmenü probiert." },
      { it: "Ogni piatto raccontava una regione.", de: "Jedes Gericht erzählte von einer Region." },
      { it: "Il primo pesava meno di cento grammi.", de: "Der erste Gang wog weniger als hundert Gramm." },
      { it: "La cottura della carne era perfetta.", de: "Die Garzeit des Fleisches war perfekt." },
      { it: "Il vino bianco, fresco, accompagnava il pesce.", de: "Der gekühlte Weißwein begleitete den Fisch." },
      { it: "Un piatto era troppo piccante per me.", de: "Ein Gericht war zu scharf für mich." },
      { it: "Alla fine ci hanno regalato una scatola di cioccolatini.", de: "Am Ende haben sie uns eine Schachtel Pralinen geschenkt." }
    ],
    build: [1, 3, 4],
    produce: [0, 2, 6],
    covers: ["cucina2"]
  },
  {
    id: "smart-working", level: "B1", title: "Lo smart working", icon: "💻",
    scene: "Homeoffice-Debatte im Büro: si-Passivo, Congiuntivo, Bedingungssatz.",
    words: [
      { it: "il ruolo", de: "die Rolle", emoji: "🎭" },
      { it: "la formazione", de: "die Weiterbildung", emoji: "🎓" },
      { it: "le competenze", de: "die Kompetenzen", emoji: "🎯" },
      { it: "la riunione", de: "die Besprechung", emoji: "👥" },
      { it: "il successo", de: "der Erfolg", emoji: "🏆" },
      { it: "il progetto", de: "das Projekt", emoji: "📊" },
      { it: "invece", de: "stattdessen / dagegen", emoji: "↩️" }
    ],
    sentences: [
      { it: "La ditta ha adottato lo smart working.", de: "Die Firma hat Homeoffice eingeführt." },
      { it: "Il mio ruolo non è cambiato molto.", de: "Meine Rolle hat sich nicht stark verändert." },
      { it: "Le riunioni si fanno in videochiamata.", de: "Die Besprechungen macht man per Videocall." },
      { it: "Credo che le competenze contino più del luogo.", de: "Ich glaube, dass die Kompetenzen mehr zählen als der Ort." },
      { it: "La formazione online funziona bene, invece.", de: "Die Online-Weiterbildung funktioniert dagegen gut." },
      { it: "Se il progetto va bene, resteremo a casa.", de: "Wenn das Projekt gut läuft, bleiben wir zu Hause." },
      { it: "Il successo di questo modello è già evidente.", de: "Der Erfolg dieses Modells ist schon offensichtlich." }
    ],
    build: [2, 3, 5],
    produce: [0, 4, 6],
    covers: ["lavoro3", "opinioni"]
  },
  {
    id: "colloquio-finale", level: "B1", title: "Il colloquio finale", icon: "🤝",
    scene: "Letzte Runde im Bewerbungsprozess: Condizionale composto im Indirekten, Futuro.",
    words: [
      { it: "la posizione", de: "die Stelle", emoji: "📍" },
      { it: "la carriera", de: "die Karriere", emoji: "🪜" },
      { it: "lo stage", de: "das Praktikum", emoji: "🧑‍🎓" },
      { it: "la laurea", de: "das Diplom (Laurea)", emoji: "🎓" },
      { it: "la sfida", de: "die Herausforderung", emoji: "⚔️" },
      { it: "il cliente", de: "der Kunde", emoji: "🤵" },
      { it: "sicuramente", de: "sicher(lich)", emoji: "✅" }
    ],
    sentences: [
      { it: "Ho superato l'ultimo colloquio del processo.", de: "Ich habe das letzte Gespräch des Verfahrens bestanden." },
      { it: "Il direttore ha detto che avrei dovuto iniziare a giugno.", de: "Der Direktor hat gesagt, ich hätte im Juni anfangen sollen." },
      { it: "La posizione prevede viaggi e clienti.", de: "Die Stelle sieht Reisen und Kunden vor." },
      { it: "Dopo la laurea ho fatto uno stage qui.", de: "Nach dem Diplom habe ich hier ein Praktikum gemacht." },
      { it: "La carriera conta, ma anche il gruppo.", de: "Die Karriere zählt, aber auch die Gruppe." },
      { it: "Sicuramente la sfida mi farà crescere.", de: "Sicherlich wird mich die Herausforderung wachsen lassen." },
      { it: "Ho firmato: adesso si festeggia!", de: "Ich habe unterschrieben: jetzt wird gefeiert!" }
    ],
    build: [1, 4, 6],
    produce: [0, 2, 5],
    covers: ["lavoro3"]
  },
  {
    id: "sogno-ufficio", level: "B1", title: "Sogno un ufficio così", icon: "💭",
    scene: "Vom Traum-Büro zum Kompromiss: Hypothesen, „nel caso“ + Congiuntivo, Sprichwort.",
    words: [
      { it: "il desiderio", de: "der Wunsch", emoji: "⭐" },
      { it: "la possibilità", de: "die Möglichkeit", emoji: "🎲" },
      { it: "l'ipotesi", de: "die Hypothese", emoji: "🧪" },
      { it: "la soluzione", de: "die Lösung", emoji: "💡" },
      { it: "la speranza", de: "die Hoffnung", emoji: "🕊️" },
      { it: "nel caso", de: "im Fall (dass)", emoji: "❓" },
      { it: "il problema", de: "das Problem", emoji: "❗" }
    ],
    sentences: [
      { it: "Sogno un ufficio con vista sul parco.", de: "Ich träume von einem Büro mit Blick auf den Park." },
      { it: "Il problema è che costa troppo.", de: "Das Problem ist, dass es zu viel kostet." },
      { it: "L'ipotesi di dividerlo con qualcuno è concreta.", de: "Die Hypothese, es mit jemandem zu teilen, ist konkret." },
      { it: "Nel caso non funzioni, cambieremo stanza.", de: "Falls es nicht funktioniert, wechseln wir das Zimmer." },
      { it: "La soluzione migliore resta cercare ancora.", de: "Die beste Lösung bleibt weiterzusuchen." },
      { it: "La speranza è l'ultima a morire.", de: "Die Hoffnung stirbt zuletzt." },
      { it: "Ogni desiderio porta con sé una possibilità.", de: "Jeder Wunsch trägt eine Möglichkeit in sich." }
    ],
    build: [2, 4, 5],
    produce: [0, 1, 6],
    covers: ["mente", "lavoro3"]
  },
  {
    id: "monumento-nascosto", level: "B1", title: "Il monumento nascosto", icon: "🗿",
    scene: "Ein verstecktes Denkmal entdecken: si-Formen, „ci si arriva“, Congiuntivo als Aufforderung.",
    words: [
      { it: "il monumento", de: "das Denkmal", emoji: "🗿" },
      { it: "il centro storico", de: "die Altstadt", emoji: "🏰" },
      { it: "la folla", de: "die Menschenmenge", emoji: "👥" },
      { it: "il quartiere", de: "das Viertel", emoji: "🏘️" },
      { it: "la metropolitana", de: "die U-Bahn", emoji: "🚇" },
      { it: "la periferia", de: "der Stadtrand", emoji: "🌆" },
      { it: "la zona pedonale", de: "die Fußgängerzone", emoji: "🚶" }
    ],
    sentences: [
      { it: "Nel centro storico ho scoperto un monumento nascosto.", de: "In der Altstadt habe ich ein verstecktes Denkmal entdeckt." },
      { it: "La guida diceva che nessuno lo visita.", de: "Der Reiseführer sagte, dass es niemand besucht." },
      { it: "Si trova in un quartiere silenzioso.", de: "Es befindet sich in einem ruhigen Viertel." },
      { it: "Lontano dalla folla, si respira storia.", de: "Fern von den Menschenmassen atmet man Geschichte." },
      { it: "Ci si arriva con la metropolitana, poi a piedi.", de: "Dort kommt man mit der U-Bahn hin, dann zu Fuß." },
      { it: "La periferia nasconde angoli speciali.", de: "Der Stadtrand verbirgt besondere Ecken." },
      { it: "Chi cerca la zona pedonale, chieda pure!", de: "Wer die Fußgängerzone sucht, frag einfach!" }
    ],
    build: [1, 4, 5],
    produce: [0, 2, 6],
    covers: ["citta3"]
  },
  {
    id: "aeroporto-alba", level: "B1", title: "L'aeroporto all'alba", icon: "🌅",
    scene: "Frühflug-Chaos: gemischte Zeiten, Passiv-artige Konstruktion, Gerundio beim Landen.",
    words: [
      { it: "il volo", de: "der Flug", emoji: "✈️" },
      { it: "l'imbarco", de: "das Boarding", emoji: "🛫" },
      { it: "la dogana", de: "der Zoll", emoji: "🛃" },
      { it: "il bagaglio a mano", de: "das Handgepäck", emoji: "🎒" },
      { it: "la destinazione", de: "das Reiseziel", emoji: "📍" },
      { it: "la certezza", de: "die Gewissheit", emoji: "💯" },
      { it: "il dubbio", de: "der Zweifel", emoji: "🤨" }
    ],
    sentences: [
      { it: "Il volo partiva all'alba, così ci siamo alzati alle quattro.", de: "Der Flug ging bei Sonnenaufgang, so standen wir um vier auf." },
      { it: "All'imbarco c'era già una coda lunghissima.", de: "Beim Boarding gab es schon eine extrem lange Schlange." },
      { it: "Ho avuto il dubbio di aver dimenticato qualcosa.", de: "Ich hatte den Zweifel, etwas vergessen zu haben." },
      { it: "La certezza? Il passaporto era nella tasca.", de: "Die Gewissheit? Der Pass war in der Tasche." },
      { it: "Alla dogana ci hanno fatto aprire il bagaglio a mano.", de: "Beim Zoll ließen sie uns das Handgepäck öffnen." },
      { it: "La destinazione finale valeva ogni fatica.", de: "Das endgültige Ziel war jede Mühe wert." },
      { it: "Atterrando, il sole già scaldava.", de: "Bei der Landung wärmte die Sonne schon." }
    ],
    build: [1, 4, 6],
    produce: [0, 2, 5],
    covers: ["viaggi2", "mente"]
  },
  {
    id: "cena-importante", level: "B1", title: "La cena importante", icon: "🍽️",
    scene: "Kochen für zehn: Passivo im Trapassato, Konkordanz der Meinungen, Infinitiv-Konstruktion.",
    words: [
      { it: "il piatto", de: "das Gericht", emoji: "🍛" },
      { it: "il forno", de: "der Backofen", emoji: "🔥" },
      { it: "la padella", de: "die Pfanne", emoji: "🍳" },
      { it: "l'ingrediente", de: "die Zutat", emoji: "🥘" },
      { it: "il sapore", de: "der Geschmack", emoji: "😋" },
      { it: "la cottura", de: "die Garzeit", emoji: "⏲️" },
      { it: "d'accordo", de: "einverstanden", emoji: "🤝" }
    ],
    sentences: [
      { it: "Sabato ho cucinato per dieci persone.", de: "Samstag habe ich für zehn Personen gekocht." },
      { it: "Ogni ingrediente era stato scelto con cura.", de: "Jede Zutat war mit Sorgfalt ausgewählt worden." },
      { it: "Il forno funzionava a intermittenza, purtroppo.", de: "Der Ofen funktionierte zeitweise, leider." },
      { it: "La cottura è stata un'avventura.", de: "Das Garen war ein Abenteuer." },
      { it: "Tutti erano d'accordo: il sapore era eccellente.", de: "Alle waren einverstanden: der Geschmack war hervorragend." },
      { it: "Il piatto migliore è uscito dalla padella per ultimo.", de: "Das beste Gericht kam als letztes aus der Pfanne." },
      { it: "Mi hanno chiesto di rifarlo l'anno prossimo!", de: "Sie haben mich gebeten, es nächstes Jahr zu wiederholen!" }
    ],
    build: [2, 4, 6],
    produce: [0, 3, 5],
    covers: ["cucina2", "opinioni"]
  },
  {
    id: "weekend-lago", level: "B1", title: "Il weekend al lago", icon: "⛵",
    scene: "See-Wochenende: „sembra che“ + Congiuntivo passato, Stadtkontrast, Ruhe.",
    words: [
      { it: "la destinazione", de: "das Reiseziel", emoji: "📍" },
      { it: "la conferma", de: "die Bestätigung", emoji: "✅" },
      { it: "la serata", de: "der Abend", emoji: "🌙" },
      { it: "la folla", de: "die Menschenmenge", emoji: "👥" },
      { it: "il quartiere", de: "das Viertel", emoji: "🏘️" },
      { it: "la metropolitana", de: "die U-Bahn", emoji: "🚇" },
      { it: "davvero", de: "wirklich", emoji: "‼️" }
    ],
    sentences: [
      { it: "La destinazione del weekend era un lago tranquillo.", de: "Das Wochenendziel war ein ruhiger See." },
      { it: "Abbiamo prenotato tardi, ma la conferma è arrivata subito.", de: "Wir haben spät gebucht, aber die Bestätigung kam sofort." },
      { it: "La serata sul lungolago era magica.", de: "Der Abend an der Uferpromenade war magisch." },
      { it: "Niente folla, niente metropolitana, solo silenzio.", de: "Keine Menschenmassen, keine U-Bahn, nur Stille." },
      { it: "Il quartiere di case di legno sembrava uscito da un film.", de: "Das Viertel aus Holzhäusern schien einem Film entsprungen." },
      { it: "Sembra che il tempo si sia fermato.", de: "Es scheint, dass die Zeit stehen geblieben ist." },
      { it: "Un weekend così rigenera davvero.", de: "So ein Wochenende regeneriert wirklich." }
    ],
    build: [1, 3, 6],
    produce: [0, 2, 5],
    covers: ["viaggi2", "citta3"]
  },

  /* ---------- B1-Minis: M3b (33 Drills) ---------- */

  { id: "m3b-congiuntivo-irregolare", level: "B1", mini: true, title: "Mini: Congiuntivo irregolare", icon: "💭", scene: "sappia, possa, voglia, venga.",
    words: [{ it: "sappia", de: "dass er/sie weiß / kann", emoji: "🧠" }, { it: "possa", de: "dass er/sie kann", emoji: "💪" }, { it: "voglia", de: "dass er/sie will", emoji: "🙏" }, { it: "venga", de: "dass er/sie kommt", emoji: "🚶" }, { it: "il punto di vista", de: "der Standpunkt", emoji: "🧭" }, { it: "d'accordo", de: "einverstanden", emoji: "🤝" }],
    sentences: [
      { it: "Non so se Marco sappia la notizia.", de: "Ich weiß nicht, ob Marco die Nachricht kennt." },
      { it: "Spero che tu possa venire.", de: "Ich hoffe, dass du kommen kannst." },
      { it: "Vogliono che tutto venga controllato.", de: "Sie wollen, dass alles kontrolliert wird." },
      { it: "Penso che il suo punto di vista conti.", de: "Ich denke, dass sein Standpunkt zählt." }
    ],
    build: [0], produce: [1, 2], covers: ["opinioni"] },
  { id: "m3b-congiuntivo-passato", level: "B1", mini: true, title: "Mini: Congiuntivo passato", icon: "🕰️", scene: "Vermutungen über Gestern.",
    words: [{ it: "abbia finito", de: "dass er beendet hat", emoji: "✅" }, { it: "siano partiti", de: "dass sie losgefahren sind", emoji: "🚗" }, { it: "abbiate capito", de: "dass ihr verstanden habt", emoji: "🧠" }, { it: "si siano sentiti", de: "dass sie sich gemeldet haben", emoji: "📞" }, { it: "forse", de: "vielleicht", emoji: "❔" }, { it: "magari", de: "vielleicht / wäre schön", emoji: "🍀" }],
    sentences: [
      { it: "Credo che Marco abbia finito il rapporto.", de: "Ich glaube, dass Marco den Bericht beendet hat." },
      { it: "Penso che siano partiti stamattina.", de: "Ich denke, dass sie heute Morgen losgefahren sind." },
      { it: "Ho spiegato tutto: spero che abbiate capito.", de: "Ich habe alles erklärt: ich hoffe, ihr habt verstanden." },
      { it: "Mi sembra che si siano sentiti dopo.", de: "Mir scheint, dass sie sich danach gemeldet haben." }
    ],
    build: [0], produce: [1, 2], covers: ["opinioni"] },
  { id: "m3b-stare-gerundio", level: "B1", mini: true, title: "Mini: sto … gerade", icon: "⏳", scene: "stare + Gerundio im Büro.",
    words: [{ it: "sto scrivendo", de: "ich schreibe gerade", emoji: "✍️" }, { it: "stiamo aspettando", de: "wir warten gerade", emoji: "🛗" }, { it: "stai dormendo?", de: "schläfst du gerade?", emoji: "😴" }, { it: "sto finendo", de: "ich bin gleich fertig", emoji: "🏁" }, { it: "la riunione", de: "die Besprechung", emoji: "👥" }, { it: "il progetto", de: "das Projekt", emoji: "📊" }],
    sentences: [
      { it: "Non chiamarmi: sto scrivendo la relazione.", de: "Ruf mich nicht an: ich schreibe gerade den Bericht." },
      { it: "Stiamo aspettando l'ascensore da cinque minuti.", de: "Wir warten seit fünf Minuten auf den Aufzug." },
      { it: "Stai dormendo? Svegliati!", de: "Schläfst du gerade? Wach auf!" },
      { it: "Sto finendo: due minuti e arrivo.", de: "Ich bin fast fertig: zwei Minuten und ich komme." }
    ],
    build: [0], produce: [1, 2], covers: ["lavoro3"] },
  { id: "m3b-gerundio-cronik", level: "B1", mini: true, title: "Mini: Beim …-en", icon: "📝", scene: "Gerundio für Begleitumstände.",
    words: [{ it: "uscendo", de: "beim Rausgehen", emoji: "🚪" }, { it: "pensando", de: "beim Nachdenken", emoji: "🤔" }, { it: "guardando", de: "beim Anschauen", emoji: "👀" }, { it: "sorridendo", de: "lächelnd", emoji: "🙂" }, { it: "il dubbio", de: "der Zweifel", emoji: "🤨" }, { it: "la soluzione", de: "die Lösung", emoji: "💡" }],
    sentences: [
      { it: "Uscendo ho incontrato la vicina.", de: "Beim Rausgehen habe ich die Nachbarin getroffen." },
      { it: "Pensando al problema, ho trovato la soluzione.", de: "Beim Nachdenken über das Problem habe ich die Lösung gefunden." },
      { it: "Guardando le foto, è tornato il dubbio.", de: "Beim Anschauen der Fotos kam der Zweifel zurück." },
      { it: "Sorridendo, ha chiuso la discussione.", de: "Lächelnd hat sie die Diskussion beendet." }
    ],
    build: [0], produce: [1, 2], covers: ["mente"] },
  { id: "m3b-passivo-presente", level: "B1", mini: true, title: "Mini: viene aperto", icon: "🏗️", scene: "Passivo im Präsens.",
    words: [{ it: "viene aperto", de: "wird geöffnet", emoji: "🔓" }, { it: "vengono venduti", de: "werden verkauft", emoji: "🛒" }, { it: "viene chiuso", de: "wird geschlossen", emoji: "🔒" }, { it: "è vietato", de: "ist verboten", emoji: "⛔" }, { it: "la zona pedonale", de: "die Fußgängerzone", emoji: "🚶" }, { it: "il centro storico", de: "die Altstadt", emoji: "🏰" }],
    sentences: [
      { it: "Il museo viene aperto alle nove.", de: "Das Museum wird um neun geöffnet." },
      { it: "Qui vengono venduti i biglietti all'ingresso.", de: "Hier werden die Tickets am Eingang verkauft." },
      { it: "Il parco viene chiuso al tramonto.", de: "Der Park wird bei Sonnenuntergang geschlossen." },
      { it: "Nella zona pedonale è vietato entrare in auto.", de: "In der Fußgängerzone ist das Einfahren mit dem Auto verboten." }
    ],
    build: [0], produce: [1, 2], covers: ["citta3"] },
  { id: "m3b-passivo-passato", level: "B1", mini: true, title: "Mini: è stato …", icon: "📰", scene: "Passivo im Passato.",
    words: [{ it: "è stato aperto", de: "wurde geöffnet", emoji: "🔓" }, { it: "sono stati pubblicati", de: "wurden veröffentlicht", emoji: "🗞️" }, { it: "è stata vinta", de: "wurde gewonnen", emoji: "🏆" }, { it: "è stato scritto", de: "wurde geschrieben", emoji: "✍️" }, { it: "la notizia", de: "die Nachricht", emoji: "📰" }, { it: "l'edizione", de: "die Ausgabe", emoji: "📚" }],
    sentences: [
      { it: "Il nuovo ponte è stato aperto ieri.", de: "Die neue Brücke wurde gestern eröffnet." },
      { it: "I risultati sono stati pubblicati stamattina.", de: "Die Ergebnisse wurden heute Morgen veröffentlicht." },
      { it: "La gara è stata vinta dalla squadra più giovane.", de: "Der Wettbewerb wurde vom jüngsten Team gewonnen." },
      { it: "Questo articolo è stato scritto di notte.", de: "Dieser Artikel wurde nachts geschrieben." }
    ],
    build: [0], produce: [1, 2], covers: ["media"] },
  { id: "m3b-si-formen", level: "B1", mini: true, title: "Mini: In cucina si…", icon: "🔄", scene: "si-Passivale mit Konjunktiv.",
    words: [{ it: "si cucina", de: "man kocht", emoji: "🍳" }, { it: "si dice", de: "man sagt", emoji: "🗣️" }, { it: "si usa", de: "man verwendet", emoji: "🥄" }, { it: "si beve", de: "man trinkt", emoji: "🍷" }, { it: "il sapore", de: "der Geschmack", emoji: "😋" }, { it: "la cottura", de: "die Garzeit", emoji: "⏲️" }],
    sentences: [
      { it: "In questa casa si cucina ancora insieme.", de: "In diesem Haus kocht man noch zusammen." },
      { it: "Si dice che il segreto sia il fuoco basso.", de: "Man sagt, das Geheimnis sei das kleine Feuer." },
      { it: "Qui si usa l'olio extravergine.", de: "Hier verwendet man natives Olivenöl extra." },
      { it: "Si beve locale, si mangia stagionale.", de: "Man trinkt regional, man isst saisonal." }
    ],
    build: [0], produce: [1, 2], covers: ["cucina2"] },
  { id: "m3b-relativi", level: "B1", mini: true, title: "Mini: il quale, di cui", icon: "🔗", scene: "Relativpronomen variieren.",
    words: [{ it: "il quale", de: "welcher / der", emoji: "🧩" }, { it: "di cui", de: "von dem", emoji: "💬" }, { it: "in cui", de: "in dem / an dem", emoji: "📍" }, { it: "l'articolo", de: "der Artikel", emoji: "📄" }, { it: "il podcast", de: "der Podcast", emoji: "🎧" }, { it: "il giornalista", de: "der Journalist", emoji: "🎤" }],
    sentences: [
      { it: "L'autore, il quale vive a Torino, scrive bene.", de: "Der Autor, der in Turin lebt, schreibt gut." },
      { it: "Il podcast di cui ti parlavo è finito.", de: "Der Podcast, von dem ich dir erzählt habe, ist vorbei." },
      { it: "Ricordo il giorno in cui ci siamo conosciuti.", de: "Ich erinnere mich an den Tag, an dem wir uns kennengelernt haben." },
      { it: "Il giornalista che intervista sa ascoltare.", de: "Der Journalist, der interviewt, kann zuhören." }
    ],
    build: [0], produce: [1, 2], covers: ["media"] },
  { id: "m3b-se-domani", level: "B1", mini: true, title: "Mini: Se domani…", icon: "🔮", scene: "Periodo ipotetico Typ 1.",
    words: [{ it: "se farà bello", de: "wenn das Wetter schön wird", emoji: "☀️" }, { it: "se avremo tempo", de: "wenn wir Zeit haben", emoji: "⏰" }, { it: "se il volo partirà", de: "wenn der Flug startet", emoji: "✈️" }, { it: "la destinazione", de: "das Reiseziel", emoji: "📍" }, { it: "la conferma", de: "die Bestätigung", emoji: "✅" }],
    sentences: [
      { it: "Se farà bello, andremo in spiaggia.", de: "Wenn das Wetter schön wird, gehen wir an den Strand." },
      { it: "Se avremo tempo, visiteremo il museo.", de: "Wenn wir Zeit haben, besuchen wir das Museum." },
      { it: "Se il volo partirà in orario, arriveremo a mezzogiorno.", de: "Wenn der Flug pünktlich startet, kommen wir um zwölf an." },
      { it: "Se no, cambieremo destinazione.", de: "Wenn nicht, wechseln wir das Reiseziel." }
    ],
    build: [0], produce: [1, 2], covers: ["viaggi2"] },
  { id: "m3b-se-ambiente", level: "B1", mini: true, title: "Mini: Wenn wir alle…", icon: "♻️", scene: "Iphotesi für die Umwelt.",
    words: [{ it: "se ricicliamo", de: "wenn wir recyceln", emoji: "♻️" }, { it: "se consumiamo", de: "wenn wir verbrauchen", emoji: "🔌" }, { it: "se piantiamo", de: "wenn wir pflanzen", emoji: "🌳" }, { it: "l'energia", de: "die Energie", emoji: "🔋" }, { it: "il clima", de: "das Klima", emoji: "🌤️" }, { it: "la protezione", de: "der Schutz", emoji: "🛡️" }],
    sentences: [
      { it: "Se ricicliamo tutto, produrremo meno rifiuti.", de: "Wenn wir alles recyceln, produzieren wir weniger Abfall." },
      { it: "Se consumiamo meno, risparmieremo energia.", de: "Wenn wir weniger verbrauchen, sparen wir Energie." },
      { it: "Se piantiamo alberi, il clima migliorerà.", de: "Wenn wir Bäume pflanzen, wird sich das Klima verbessern." },
      { it: "La protezione dell'ambiente comincia da qui.", de: "Der Schutz der Umwelt beginnt hier." }
    ],
    build: [0], produce: [1, 2], covers: ["ambiente"] },
  { id: "m3b-disco-indiretto", level: "B1", mini: true, title: "Mini: Er hat gefragt, ob…", icon: "💬", scene: "Discorso indiretto im Büro.",
    words: [{ it: "ha chiesto se", de: "er hat gefragt, ob", emoji: "❓" }, { it: "ha detto che", de: "er hat gesagt, dass", emoji: "🗣️" }, { it: "ho risposto che", de: "ich habe geantwortet, dass", emoji: "↩️" }, { it: "ha annunciato che", de: "er hat angekündigt, dass", emoji: "📢" }, { it: "il cliente", de: "der Kunde", emoji: "🤵" }, { it: "la riunione", de: "die Besprechung", emoji: "👥" }],
    sentences: [
      { it: "Il capo ha chiesto se ho finito.", de: "Der Chef hat gefragt, ob ich fertig bin." },
      { it: "Ha detto che la riunione slitta alle sei.", de: "Er hat gesagt, dass sich die Besprechung auf sechs verschiebt." },
      { it: "Ho risposto che arrivo tra cinque minuti.", de: "Ich habe geantwortet, dass ich in fünf Minuten komme." },
      { it: "Il cliente ha annunciato che confermerà domani.", de: "Der Kunde hat angekündigt, dass er morgen bestätigt." }
    ],
    build: [0], produce: [1, 2], covers: ["lavoro3"] },
  { id: "m3b-pronomen-buendel", level: "B1", mini: true, title: "Mini: gliel'ho detto", icon: "🤲", scene: "Pronomen-Pakete im Satz.",
    words: [{ it: "gliel'ho detto", de: "ich habe es ihm gesagt", emoji: "💬" }, { it: "me l'ha dato", de: "er hat es mir gegeben", emoji: "🫴" }, { it: "ce l'hanno portato", de: "sie haben es uns gebracht", emoji: "📦" }, { it: "te le mando", de: "ich schicke sie dir", emoji: "📤" }, { it: "la possibilità", de: "die Möglichkeit", emoji: "🎲" }, { it: "la soluzione", de: "die Lösung", emoji: "💡" }],
    sentences: [
      { it: "Il segreto? Gliel'ho detto ieri.", de: "Das Geheimnis? Das habe ich ihm gestern gesagt." },
      { it: "Il libro? Me l'ha dato Luca.", de: "Das Buch? Das hat mir Luca gegeben." },
      { it: "I documenti? Ce l'hanno portati stamattina.", de: "Die Dokumente? Die haben sie uns heute Morgen gebracht." },
      { it: "Le chiavi? Te le mando con Marco.", de: "Die Schlüssel? Die schicke ich dir mit Marco." }
    ],
    build: [0], produce: [1, 2], covers: ["mente"] },
  { id: "m3b-obbligo", level: "B1", mini: true, title: "Mini: Muss & sollte", icon: "📋", scene: "dovere in allen Personen.",
    words: [{ it: "devo finire", de: "ich muss beenden", emoji: "⏳" }, { it: "dovresti leggere", de: "du solltest lesen", emoji: "📖" }, { it: "dobbiamo partire", de: "wir müssen losfahren", emoji: "🚗" }, { it: "devi firmare", de: "du musst unterschreiben", emoji: "✍️" }, { it: "il ruolo", de: "die Rolle", emoji: "🎭" }, { it: "le competenze", de: "die Kompetenzen", emoji: "🎯" }],
    sentences: [
      { it: "Devo finire il report entro venerdì.", de: "Ich muss den Bericht bis Freitag beenden." },
      { it: "Dovresti leggere il contratto due volte.", de: "Du solltest den Vertrag zweimal lesen." },
      { it: "Dobbiamo partire presto domani.", de: "Wir müssen morgen früh losfahren." },
      { it: "Devi firmare l'ultima pagina.", de: "Du musst die letzte Seite unterschreiben." }
    ],
    build: [0], produce: [1, 2], covers: ["lavoro3"] },
  { id: "m3b-periferia", level: "B1", mini: true, title: "Mini: Laggiù in periferia", icon: "🌆", scene: "Stadt-Substantive im Satz.",
    words: [{ it: "la periferia", de: "der Stadtrand", emoji: "🌆" }, { it: "la serata", de: "der Abend", emoji: "🌙" }, { it: "il quartiere", de: "das Viertel", emoji: "🏘️" }, { it: "la folla", de: "die Menschenmenge", emoji: "👥" }, { it: "l'incrocio", de: "die Kreuzung", emoji: "🔀" }, { it: "il semaforo", de: "die Ampel", emoji: "🚦" }],
    sentences: [
      { it: "In periferia la vita costa meno.", de: "Am Stadtrand kostet das Leben weniger." },
      { it: "La serata al festival è stata lunga.", de: "Der Abend beim Festival war lang." },
      { it: "Al quinto incrocio, gira al semaforo.", de: "An der fünften Kreuzung bieg an der Ampel ab." },
      { it: "La folla scorre come un fiume.", de: "Die Menge fließt wie ein Fluss." }
    ],
    build: [0], produce: [1, 2], covers: ["citta3"] },
  { id: "m3b-ingredienti", level: "B1", mini: true, title: "Mini: Mengen & Gläser", icon: "🧂", scene: "Küchen-Mengen sicher sagen.",
    words: [{ it: "il grammo", de: "das Gramm", emoji: "⚖️" }, { it: "il litro", de: "der Liter", emoji: "🥛" }, { it: "la scatola", de: "die Dose", emoji: "🥫" }, { it: "il barattolo", de: "das Glas", emoji: "🫙" }, { it: "l'ingrediente", de: "die Zutat", emoji: "🥘" }, { it: "la padella", de: "die Pfanne", emoji: "🍳" }],
    sentences: [
      { it: "Cento grammi di farina bastano.", de: "Hundert Gramm Mehl reichen." },
      { it: "Mezzo litro di latte, per favore.", de: "Ein halber Liter Milch, bitte." },
      { it: "Apri una scatola di pelati.", de: "Öffne eine Dose Tomaten." },
      { it: "L'ingrediente segreto sta nel barattolo piccolo.", de: "Die geheime Zutat steckt im kleinen Glas." }
    ],
    build: [0], produce: [1, 2], covers: ["cucina2"] },
  { id: "m3b-titoli", level: "B1", mini: true, title: "Mini: Schlagzeilen", icon: "📰", scene: "Medien-Substantive im Satz.",
    words: [{ it: "la notizia", de: "die Nachricht", emoji: "📰" }, { it: "il titolo", de: "die Schlagzeile", emoji: "🔖" }, { it: "il telegiornale", de: "die Nachrichtensendung", emoji: "📺" }, { it: "la stampa", de: "die Presse", emoji: "🗞️" }, { it: "il commento", de: "der Kommentar", emoji: "🖋️" }, { it: "l'articolo", de: "der Artikel", emoji: "📄" }],
    sentences: [
      { it: "La notizia è corsa in un attimo.", de: "Die Nachricht lief in einem Augenblick herum." },
      { it: "Il titolo diceva tutto in cinque parole.", de: "Die Schlagzeile sagte alles in fünf Worten." },
      { it: "Il telegiornale ha aperto con lo sciopero.", de: "Die Nachrichtensendung hat mit dem Streik eröffnet." },
      { it: "La stampa estera ha ripreso il commento.", de: "Die ausländische Presse hat das Kommentar aufgegriffen." }
    ],
    build: [0], produce: [1, 2], covers: ["media"] },
  { id: "m3b-parere", level: "B1", mini: true, title: "Mini: A mio parere", icon: "🧭", scene: "Meinungsbausteine üben.",
    words: [{ it: "a mio parere", de: "meines Erachtens", emoji: "🎩" }, { it: "il punto di vista", de: "der Standpunkt", emoji: "🧭" }, { it: "d'accordo", de: "einverstanden", emoji: "🤝" }, { it: "secondo me", de: "meiner Meinung nach", emoji: "🤔" }, { it: "tuttavia", de: "jedoch", emoji: "↪️" }, { it: "purtroppo", de: "leider", emoji: "😞" }],
    sentences: [
      { it: "A mio parere, il film era lungo.", de: "Meines Erachtens war der Film lang." },
      { it: "Il suo punto di vista è interessante.", de: "Sein Standpunkt ist interessant." },
      { it: "Sono d'accordo fino a un certo punto.", de: "Ich bin bis zu einem gewissen Punkt einverstanden." },
      { it: "Secondo me, tuttavia, vince la semplicità.", de: "Meiner Meinung nach gewinnt jedoch die Einfachheit." }
    ],
    build: [0], produce: [1, 2], covers: ["opinioni"] },
  { id: "m3b-dubbio-costante", level: "B1", mini: true, title: "Mini: Zweifel & Hoffnung", icon: "🤔", scene: "mente-Substantive im Satz.",
    words: [{ it: "il dubbio", de: "der Zweifel", emoji: "🤨" }, { it: "la certezza", de: "die Gewissheit", emoji: "💯" }, { it: "la speranza", de: "die Hoffnung", emoji: "🕊️" }, { it: "l'ipotesi", de: "die Hypothese", emoji: "🧪" }, { it: "la possibilità", de: "die Möglichkeit", emoji: "🎲" }, { it: "nonostante", de: "trotz / obwohl", emoji: "🧱" }],
    sentences: [
      { it: "Il dubbio accompagna ogni scelta.", de: "Der Zweifel begleitet jede Wahl." },
      { it: "Nonostante il dubbio, la speranza resta.", de: "Trotz des Zweifels bleibt die Hoffnung." },
      { it: "La mia ipotesi è semplice: proviamo.", de: "Meine Vermutung ist einfach: probieren wir." },
      { it: "Ogni possibilità apre una certezza nuova.", de: "Jede Möglichkeit eröffnet eine neue Gewissheit." }
    ],
    build: [0], produce: [1, 2], covers: ["mente"] },
  { id: "m3b-checkin", level: "B1", mini: true, title: "Mini: Check-in perfekt", icon: "🛫", scene: "Flughafen-Substantive im Satz.",
    words: [{ it: "l'imbarco", de: "das Boarding", emoji: "🛫" }, { it: "la classe", de: "die Buchungsklasse", emoji: "💺" }, { it: "il bagaglio a mano", de: "das Handgepäck", emoji: "🎒" }, { it: "la dogana", de: "der Zoll", emoji: "🛃" }, { it: "lo scalo", de: "der Zwischenstopp", emoji: "🛬" }, { it: "la frontiera", de: "die Grenze", emoji: "🚧" }],
    sentences: [
      { it: "L'imbarco comincia mezz'ora prima.", de: "Das Boarding beginnt eine halbe Stunde vorher." },
      { it: "Abbiamo prenotato in classe economica.", de: "Wir haben Economy gebucht." },
      { it: "Il bagaglio a mano pesava poco.", de: "Das Handgepäck wog wenig." },
      { it: "Lo scalo di Vienna è durato tre ore.", de: "Der Zwischenstopp in Wien dauerte drei Stunden." }
    ],
    build: [0], produce: [1, 2], covers: ["viaggi2"] },
  { id: "m3b-emozioni-cong", level: "B1", mini: true, title: "Mini: Mi dispiace che…", icon: "❤️", scene: "Congiuntivo nach Gefühlsverben.",
    words: [{ it: "mi dispiace che", de: "es tut mir leid, dass", emoji: "😔" }, { it: "mi sorprende che", de: "es überrascht mich, dass", emoji: "😲" }, { it: "mi fa piacere che", de: "es freut mich, dass", emoji: "😊" }, { it: "temo che", de: "ich fürchte, dass", emoji: "😨" }, { it: "davvero", de: "wirklich", emoji: "‼️" }, { it: "invece", de: "stattdessen", emoji: "↩️" }],
    sentences: [
      { it: "Mi dispiace che tu vada via.", de: "Es tut mir leid, dass du gehst." },
      { it: "Mi sorprende che diano tutto gratis.", de: "Es überrascht mich, dass sie alles gratis geben." },
      { it: "Mi fa piacere che siate venuti.", de: "Es freut mich, dass ihr gekommen seid." },
      { it: "Temo che invece piova domani.", de: "Ich fürchte, dass es morgen stattdessen regnet." }
    ],
    build: [0], produce: [1, 2], covers: ["opinioni"] },
  { id: "m3b-lavorare-bene", level: "B1", mini: true, title: "Mini: Karriere-Bausteine", icon: "💼", scene: "Arbeits-Substantive im Satz.",
    words: [{ it: "la carriera", de: "die Karriere", emoji: "🪜" }, { it: "la posizione", de: "die Stelle", emoji: "📍" }, { it: "la laurea", de: "das Diplom", emoji: "🎓" }, { it: "la formazione", de: "die Weiterbildung", emoji: "📚" }, { it: "il successo", de: "der Erfolg", emoji: "🏆" }, { it: "la sfida", de: "die Herausforderung", emoji: "⚔️" }],
    sentences: [
      { it: "La carriera non è tutto nella vita.", de: "Die Karriere ist nicht alles im Leben." },
      { it: "Lo stage mi ha aperto gli occhi.", de: "Das Praktikum hat mir die Augen geöffnet." },
      { it: "Dopo la laurea, la formazione continua.", de: "Nach dem Diplom geht die Weiterbildung weiter." },
      { it: "Il successo arriva dopo la sfida.", de: "Der Erfolg kommt nach der Herausforderung." }
    ],
    build: [0], produce: [1, 2], covers: ["lavoro3"] },
  { id: "m3b-guardando", level: "B1", mini: true, title: "Mini: Guardando avanti", icon: "👀", scene: "Gerundio der großen Verben.",
    words: [{ it: "lavorando", de: "arbeitend", emoji: "🔧" }, { it: "studiando", de: "lernend", emoji: "📚" }, { it: "viaggiando", de: "reisend", emoji: "🧳" }, { it: "leggendo", de: "lesend", emoji: "📖" }, { it: "la speranza", de: "die Hoffnung", emoji: "🕊️" }, { it: "il desiderio", de: "der Wunsch", emoji: "⭐" }],
    sentences: [
      { it: "Lavorando, ho imparato l'umiltà.", de: "Während der Arbeit habe ich Demut gelernt." },
      { it: "Studiando la sera, si impara di più.", de: "Abends lernend lernt man mehr." },
      { it: "Viaggiando, nasce il desiderio di restare.", de: "Beim Reisen entsteht der Wunsch zu bleiben." },
      { it: "Leggendo, ogni speranza sembra vicina.", de: "Beim Lesen scheint jede Hoffnung nah." }
    ],
    build: [0], produce: [1, 2], covers: ["mente"] },
  { id: "m3b-niente-plastica", level: "B1", mini: true, title: "Mini: Haushalt & Umwelt", icon: "🌱", scene: "Umwelt-Substantive im Satz.",
    words: [{ it: "la spazzatura", de: "der Müll", emoji: "🗑️" }, { it: "il riciclo", de: "das Recycling", emoji: "♻️" }, { it: "l'inquinamento", de: "die Umweltverschmutzung", emoji: "🏭" }, { it: "la bolletta", de: "die Rechnung (Strom)", emoji: "🧾" }, { it: "il riscaldamento", de: "die Heizung", emoji: "🔥" }, { it: "l'energia", de: "die Energie", emoji: "🔋" }],
    sentences: [
      { it: "La spazzatura si separa in cucina.", de: "Der Müll wird in der Küche getrennt." },
      { it: "Il riciclo qui è obbligatorio.", de: "Das Recycling ist hier Pflicht." },
      { it: "La bolletta è scesa con il nuovo impianto.", de: "Die Rechnung ist mit der neuen Anlage gesunken." },
      { it: "Il riscaldamento basso risparmia energia.", de: "Die niedrige Heizung spart Energie." }
    ],
    build: [0], produce: [1, 2], covers: ["ambiente"] },
  { id: "m3b-imperativo-gentile", level: "B1", mini: true, title: "Mini: Mi dica pure", icon: "🙏", scene: "Lei-Imperativ mit Pronomen.",
    words: [{ it: "mi scusi", de: "entschuldigen Sie mich", emoji: "🙇" }, { it: "mi dica", de: "sagen Sie mir", emoji: "🗣️" }, { it: "mi porti", de: "bringen Sie mir", emoji: "🫱" }, { it: "mi dia", de: "geben Sie mir", emoji: "🫴" }, { it: "il monumento", de: "das Denkmal", emoji: "🗿" }, { it: "la metropolitana", de: "die U-Bahn", emoji: "🚇" }],
    sentences: [
      { it: "Mi scusi, dov'è la metropolitana?", de: "Entschuldigen Sie, wo ist die U-Bahn?" },
      { it: "Mi dica pure, l'ascolto.", de: "Sagen Sie ruhig, ich höre zu." },
      { it: "Mi porti il conto, per favore.", de: "Bringen Sie mir bitte die Rechnung." },
      { it: "Mi dia una mano, per cortesia.", de: "Helfen Sie mir bitte." }
    ],
    build: [0], produce: [1, 2], covers: ["citta3"] },
  { id: "m3b-film-ieri", level: "B1", mini: true, title: "Mini: Feuilleton", icon: "🎥", scene: "Medien + Meinung kombinieren.",
    words: [{ it: "l'articolo", de: "der Artikel", emoji: "📄" }, { it: "la rivista", de: "die Zeitschrift", emoji: "📔" }, { it: "il commento", de: "der Kommentar", emoji: "🖋️" }, { it: "il podcast", de: "der Podcast", emoji: "🎧" }, { it: "d'accordo", de: "einverstanden", emoji: "🤝" }, { it: "invece", de: "stattdessen", emoji: "↩️" }],
    sentences: [
      { it: "L'articolo di ieri era severo.", de: "Der Artikel von gestern war streng." },
      { it: "La rivista gli ha dato tre stelle.", de: "Die Zeitschrift gab ihm drei Sterne." },
      { it: "Il commento online divide i lettori.", de: "Das Online-Kommentar spaltet die Leser." },
      { it: "Il podcast invece l'ha difeso.", de: "Der Podcast hat ihn dagegen verteidigt." }
    ],
    build: [0], produce: [1, 2], covers: ["media", "opinioni"] },
  { id: "m3b-sapori", level: "B1", mini: true, title: "Mini: Piatti & sapori", icon: "😋", scene: "Küchen-Urteile formulieren.",
    words: [{ it: "il piatto", de: "das Gericht", emoji: "🍛" }, { it: "il sapore", de: "der Geschmack", emoji: "😋" }, { it: "la cottura", de: "die Garzeit", emoji: "⏲️" }, { it: "il forno", de: "der Backofen", emoji: "🔥" }, { it: "piccante", de: "scharf", emoji: "🌶️" }, { it: "fresco", de: "frisch", emoji: "🥗" }],
    sentences: [
      { it: "Il piatto del giorno è quasi finito.", de: "Das Tagesgericht ist fast aus." },
      { it: "Il suo sapore cambia con la cottura.", de: "Sein Geschmack ändert sich mit der Garzeit." },
      { it: "Dal forno esce un profumo piccante.", de: "Aus dem Ofen kommt ein scharfer Duft." },
      { it: "Il pesce era freschissimo, davvero.", de: "Der Fisch war sehr frisch, wirklich." }
    ],
    build: [0], produce: [1, 2], covers: ["cucina2"] },
  { id: "m3b-alla-partenza", level: "B1", mini: true, title: "Mini: Partendo…", icon: "🧳", scene: "Gerundio + Reisen.",
    words: [{ it: "partendo", de: "beim Losfahren", emoji: "🚗" }, { it: "arrivando", de: "bei der Ankunft", emoji: "🛬" }, { it: "tornando", de: "auf dem Rückweg", emoji: "↩️" }, { it: "ripartendo", de: "beim Wiederabfahren", emoji: "🔁" }, { it: "il volo", de: "der Flug", emoji: "✈️" }, { it: "la destinazione", de: "das Reiseziel", emoji: "📍" }],
    sentences: [
      { it: "Partendo presto, evitiamo il traffico.", de: "Wenn wir früh losfahren, vermeiden wir den Verkehr." },
      { it: "Arrivando tardi, perderemo l'imbarco.", de: "Wenn wir zu spät ankommen, verpassen wir das Boarding." },
      { it: "Tornando, passeremo da Roma.", de: "Auf dem Rückweg kommen wir über Rom." },
      { it: "Ripartendo, abbiamo già nostalgia.", de: "Beim Wiederabfahren haben wir schon Heimweh." }
    ],
    build: [0], produce: [1, 2], covers: ["viaggi2"] },
  { id: "m3b-verbale", level: "B1", mini: true, title: "Mini: Das Protokoll", icon: "📄", scene: "Passivo + Indirektes im Büroprotokoll.",
    words: [{ it: "è stato deciso", de: "es wurde beschlossen", emoji: "✅" }, { it: "verrà convocata", de: "wird einberufen", emoji: "📅" }, { it: "è stato assegnato", de: "wurde zugewiesen", emoji: "🎯" }, { it: "ha confermato che", de: "er hat bestätigt, dass", emoji: "🤝" }, { it: "il progetto", de: "das Projekt", emoji: "📊" }, { it: "il ruolo", de: "die Rolle", emoji: "🎭" }],
    sentences: [
      { it: "È stato deciso di proseguire il progetto.", de: "Es wurde beschlossen, das Projekt fortzusetzen." },
      { it: "La prossima riunione verrà convocata venerdì.", de: "Die nächste Besprechung wird auf Freitag einberufen." },
      { it: "Il ruolo di capo è stato assegnato a Sara.", de: "Die Leitungsrolle wurde Sara zugewiesen." },
      { it: "Il cliente ha confermato che tutto procede.", de: "Der Kunde hat bestätigt, dass alles läuft." }
    ],
    build: [0], produce: [1, 2], covers: ["lavoro3"] },
  { id: "m3b-speriamo", level: "B1", mini: true, title: "Mini: Spero che tu stia", icon: "🕊️", scene: "Congiuntivo nach Ausdrücken der Hoffnung.",
    words: [{ it: "spero che", de: "ich hoffe, dass", emoji: "🕊️" }, { it: "auguro che", de: "ich wünsche, dass", emoji: "🍀" }, { it: "l'importante è che", de: "das Wichtigste ist, dass", emoji: "⭐" }, { it: "basta che", de: "hauptsache", emoji: "👌" }, { it: "la speranza", de: "die Hoffnung", emoji: "🌤️" }, { it: "la certezza", de: "die Gewissheit", emoji: "💯" }],
    sentences: [
      { it: "Spero che tu stia meglio.", de: "Ich hoffe, dass es dir besser geht." },
      { it: "Auguro che tutto vada liscio.", de: "Ich wünsche, dass alles glattläuft." },
      { it: "L'importante è che siate felici.", de: "Das Wichtigste ist, dass ihr glücklich seid." },
      { it: "Basta che arriviate in orario.", de: "Hauptsache, ihr kommt pünktlich." }
    ],
    build: [0], produce: [1, 2], covers: ["mente"] },
  { id: "m3b-quartiere-nuovo", level: "B1", mini: true, title: "Mini: Wo ich wohne", icon: "🏘️", scene: "Relativsätze mit Orten.",
    words: [{ it: "il quartiere", de: "das Viertel", emoji: "🏘️" }, { it: "la serata", de: "der Abend", emoji: "🌙" }, { it: "la folla", de: "die Menschenmenge", emoji: "👥" }, { it: "la metropolitana", de: "die U-Bahn", emoji: "🚇" }, { it: "il monumento", de: "das Denkmal", emoji: "🗿" }, { it: "il centro storico", de: "die Altstadt", emoji: "🏰" }],
    sentences: [
      { it: "Il quartiere dove abito è tranquillo.", de: "Das Viertel, in dem ich wohne, ist ruhig." },
      { it: "Il bar in cui ci siamo visti ha chiuso.", de: "Die Bar, in der wir uns gesehen haben, hat geschlossen." },
      { it: "La serata che ricordo di più è quella.", de: "Der Abend, an den ich mich am meisten erinnere, ist jener." },
      { it: "La folla che esce dal teatro riempie la strada.", de: "Die Menge, die aus dem Theater kommt, füllt die Straße." }
    ],
    build: [0], produce: [1, 2], covers: ["citta3"] },
  { id: "m3b-consumo", level: "B1", mini: true, title: "Mini: Bewusst kaufen", icon: "♻️", scene: "Iphotesi + Umwelt zusammen.",
    words: [{ it: "se smettiamo", de: "wenn wir aufhören", emoji: "⏹️" }, { it: "se compriamo", de: "wenn wir kaufen", emoji: "🛒" }, { it: "se spegniamo", de: "wenn wir ausschalten", emoji: "💡" }, { it: "l'ambiente", de: "die Umwelt", emoji: "🌍" }, { it: "il riciclo", de: "das Recycling", emoji: "♻️" }, { it: "il cambiamento", de: "die Veränderung", emoji: "🔄" }],
    sentences: [
      { it: "Se smettiamo di stampare, risparmiamo carta.", de: "Wenn wir aufhören zu drucken, sparen wir Papier." },
      { it: "Se compriamo usato, produciamo meno rifiuti.", de: "Wenn wir Gebrauchtes kaufen, produzieren wir weniger Abfall." },
      { it: "Se spegniamo le luci, la bolletta scende.", de: "Wenn wir die Lichter ausmachen, sinkt die Rechnung." },
      { it: "Il cambiamento comincia da un gesto.", de: "Die Veränderung beginnt mit einer Geste." }
    ],
    build: [0], produce: [1, 2], covers: ["ambiente"] },
  { id: "m3b-cong-o-ind", level: "B1", mini: true, title: "Mini: Congiuntivo o indicativo?", icon: "⚖️", scene: "penso che vs so che.",
    words: [{ it: "penso che", de: "ich denke, dass", emoji: "💭" }, { it: "so che", de: "ich weiß, dass", emoji: "🧠" }, { it: "credo che", de: "ich glaube, dass", emoji: "🤔" }, { it: "è certo che", de: "es ist sicher, dass", emoji: "✅" }, { it: "forse", de: "vielleicht", emoji: "❔" }, { it: "sicuramente", de: "sicherlich", emoji: "💯" }],
    sentences: [
      { it: "Penso che sia giusto così.", de: "Ich denke, dass es so richtig ist." },
      { it: "So che arriva domani, me l'ha scritto.", de: "Ich weiß, dass er morgen ankommt, er hat es mir geschrieben." },
      { it: "Credo che abbiano ragione loro.", de: "Ich glaube, dass sie recht haben." },
      { it: "È certo che il treno parte alle otto.", de: "Es ist sicher, dass der Zug um acht fährt." }
    ],
    build: [0], produce: [1, 2], covers: ["opinioni"] },
  { id: "m3b-festa-ufficio", level: "B1", mini: true, title: "Mini: Festa in ufficio", icon: "🎉", scene: "Arbeit + Küche + Futuro anteriore.",
    words: [{ it: "la riunione", de: "die Besprechung", emoji: "👥" }, { it: "il cliente", de: "der Kunde", emoji: "🤵" }, { it: "il piatto", de: "das Gericht", emoji: "🍛" }, { it: "il sapore", de: "der Geschmack", emoji: "😋" }, { it: "la carriera", de: "die Karriere", emoji: "🪜" }, { it: "la formazione", de: "die Weiterbildung", emoji: "📚" }],
    sentences: [
      { it: "Dopo la riunione abbiamo fatto una piccola festa.", de: "Nach der Besprechung haben wir ein kleines Fest gemacht." },
      { it: "Ogni cliente ha portato un piatto.", de: "Jeder Kunde hat ein Gericht mitgebracht." },
      { it: "Il sapore del tiramisù ha vinto su tutto.", de: "Der Geschmack des Tiramisù hat über alles gewonnen." },
      { it: "Fra un anno, la carriera di tutti sarà cambiata.", de: "In einem Jahr wird sich die Karriere aller geändert haben." }
    ],
    build: [0], produce: [1, 2], covers: ["lavoro3", "cucina2"] },

];
