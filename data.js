/* ============================================================
   data.js — Inhalte (Italienisch, it-IT)
   ------------------------------------------------------------
   Methode nach Tim Ferriss (The 4-Hour Chef):
   - wenige Dekonstruktionssätze, die zentrale Grammatik zeigen
   - hochfrequenter Grundwortschatz für Reisen
   - drei nützliche Zeiten: Presente, Passato prossimo,
     Futuro semplice

   AUDIO: Jedes Element besitzt einen stabilen Schlüssel. Die App
   sucht zuerst audio/<key>.mp3 und verwendet andernfalls die
   Gerätestimme für Italienisch (it-IT).
   ============================================================ */

window.IT_DATA = {
  meta: {
    variant: "Italienisch (it-IT)",
    // Reihenfolge = SRS-Personenindex. „voi" steht absichtlich am Ende
    // (Index 5): bestehende Fortschritts-Keys verb_*_*_0…4 bleiben stabil.
    pronouns: ["io", "tu", "lui/lei", "noi", "loro", "voi"],
    tenses: [
      { id: "presente", label: "Presente", de: "Gegenwart" },
      { id: "passato", label: "Passato prossimo", de: "Vergangenheit" },
      { id: "futuro", label: "Futuro semplice", de: "Zukunft" }
    ]
  },

  deconstruction: [
    { it: "La mela è rossa.", de: "Der Apfel ist rot.",
      reveals: "Geschlecht und Angleichung: mela ist weiblich – daher la und rossa, nicht il und rosso." },
    { it: "È la mela di Giovanni.", de: "Es ist Giovannis Apfel.",
      reveals: "Besitz wird meist mit di ausgedrückt. Einen deutschen Genitiv mit -s gibt es hier nicht." },
    { it: "Do la mela a Giovanni.", de: "Ich gebe Giovanni den Apfel.",
      reveals: "Das indirekte Objekt steht mit a. Do ist die unregelmäßige Form für „ich gebe“." },
    { it: "Gli diamo la mela.", de: "Wir geben ihm den Apfel.",
      reveals: "Das indirekte Objektpronomen gli steht normalerweise vor dem konjugierten Verb." },
    { it: "Lui la dà a Giovanni.", de: "Er gibt sie Giovanni.",
      reveals: "Das direkte Objektpronomen la steht vor dem Verb; dà trägt zur Unterscheidung einen Akzent." },
    { it: "Lei gliela dà.", de: "Sie gibt sie ihm.",
      reveals: "Zwei Pronomen verbinden sich: gli + la wird zu gliela und steht vor dem Verb." }
  ],

  categories: [
    {
      id: "saluti", title: "Begrüßung & Höflichkeit", icon: "👋",
      items: [
        { it: "ciao", de: "hallo / tschüss (informell)" },
        { it: "buongiorno", de: "guten Morgen / guten Tag" },
        { it: "buonasera", de: "guten Abend" },
        { it: "buonanotte", de: "gute Nacht" },
        { it: "arrivederci", de: "auf Wiedersehen" },
        { it: "a dopo", de: "bis später" },
        { it: "per favore", de: "bitte" },
        { it: "prego", de: "bitte / gern geschehen" },
        { it: "grazie", de: "danke" },
        { it: "grazie mille", de: "vielen Dank" },
        { it: "di niente", de: "gern geschehen" },
        { it: "scusi", de: "Entschuldigung (höflich)" },
        { it: "permesso", de: "Verzeihung / darf ich?" },
        { it: "sì", de: "ja" },
        { it: "no", de: "nein" }
      ]
    },
    {
      id: "persone", title: "Menschen & Pronomen", icon: "🧑",
      items: [
        { it: "io", de: "ich" },
        { it: "tu", de: "du" },
        { it: "Lei", de: "Sie (höflich)", key: "lei_cortesia" },
        { it: "lui", de: "er" },
        { it: "lei", de: "sie" },
        { it: "noi", de: "wir" },
        { it: "loro", de: "sie (Plural)" },
        { it: "uomo", de: "Mann" },
        { it: "donna", de: "Frau" },
        { it: "amico", de: "Freund" },
        { it: "amica", de: "Freundin" },
        { it: "famiglia", de: "Familie" }
      ]
    },
    {
      id: "numeri", title: "Zahlen", icon: "🔢",
      items: [
        { it: "zero", de: "null" }, { it: "uno", de: "eins" },
        { it: "due", de: "zwei" }, { it: "tre", de: "drei" },
        { it: "quattro", de: "vier" }, { it: "cinque", de: "fünf" },
        { it: "sei", de: "sechs" }, { it: "sette", de: "sieben" },
        { it: "otto", de: "acht" }, { it: "nove", de: "neun" },
        { it: "dieci", de: "zehn" }, { it: "venti", de: "zwanzig" },
        { it: "cento", de: "hundert" }, { it: "mille", de: "tausend" }
      ]
    },
    {
      id: "tempo", title: "Zeit & Tage", icon: "🕒",
      items: [
        { it: "oggi", de: "heute" }, { it: "domani", de: "morgen" },
        { it: "ieri", de: "gestern" }, { it: "adesso", de: "jetzt" },
        { it: "dopo", de: "später / danach" },
        { it: "lunedì", de: "Montag" }, { it: "martedì", de: "Dienstag" },
        { it: "mercoledì", de: "Mittwoch" }, { it: "giovedì", de: "Donnerstag" },
        { it: "venerdì", de: "Freitag" }, { it: "sabato", de: "Samstag" },
        { it: "domenica", de: "Sonntag" }, { it: "giorno", de: "Tag" },
        { it: "settimana", de: "Woche" }, { it: "ora", de: "Stunde / Uhrzeit" }
      ]
    },
    {
      id: "ristorante", title: "Essen & Restaurant", icon: "🍝",
      items: [
        { it: "il menù", de: "die Speisekarte" },
        { it: "il conto", de: "die Rechnung" },
        { it: "acqua", de: "Wasser" },
        { it: "un caffè", de: "ein Espresso" },
        { it: "un cappuccino", de: "ein Cappuccino" },
        { it: "una birra alla spina", de: "ein Bier vom Fass" },
        { it: "birra", de: "Bier" }, { it: "vino", de: "Wein" },
        { it: "pane", de: "Brot" }, { it: "pesce", de: "Fisch" },
        { it: "carne", de: "Fleisch" }, { it: "frutta", de: "Obst" },
        { it: "sale", de: "Salz" }, { it: "colazione", de: "Frühstück" },
        { it: "pranzo", de: "Mittagessen" }, { it: "cena", de: "Abendessen" },
        { it: "zuppa", de: "Suppe" }, { it: "formaggio", de: "Käse" },
        { it: "prosciutto", de: "Schinken" }, { it: "succo", de: "Saft" },
        { it: "latte", de: "Milch" }, { it: "gelato", de: "Eis" },
        { it: "dolce", de: "Nachtisch" }, { it: "cornetto", de: "Hörnchen / Croissant" }
      ]
    },
    {
      id: "viaggio", title: "Reisen & Verkehr", icon: "🚆",
      items: [
        { it: "treno", de: "Zug" }, { it: "autobus", de: "Bus" },
        { it: "tram", de: "Straßenbahn" }, { it: "biglietto", de: "Fahrkarte / Ticket" },
        { it: "fermata", de: "Haltestelle" }, { it: "stazione", de: "Bahnhof" },
        { it: "aeroporto", de: "Flughafen" }, { it: "macchina", de: "Auto" },
        { it: "taxi", de: "Taxi" }, { it: "a piedi", de: "zu Fuß" },
        { it: "aereo", de: "Flugzeug" }, { it: "traghetto", de: "Fähre" },
        { it: "mappa", de: "Karte (Plan)" }, { it: "valigia", de: "Koffer" },
        { it: "chiave", de: "Schlüssel" }
      ]
    },
    {
      id: "orientamento", title: "Orientierung & Orte", icon: "🧭",
      items: [
        { it: "dove", de: "wo" }, { it: "qui", de: "hier" },
        { it: "lì", de: "dort" }, { it: "a sinistra", de: "links" },
        { it: "a destra", de: "rechts" }, { it: "dritto", de: "geradeaus" },
        { it: "vicino", de: "nah" }, { it: "lontano", de: "weit" },
        { it: "bagno", de: "Toilette" }, { it: "strada", de: "Straße" },
        { it: "spiaggia", de: "Strand" }, { it: "albergo", de: "Hotel" }
      ]
    },
    {
      id: "acquisti", title: "Einkaufen & Geld", icon: "🛍️",
      items: [
        { it: "quanto costa?", de: "wie viel kostet das?" },
        { it: "soldi", de: "Geld" }, { it: "carta", de: "Bankkarte" },
        { it: "negozio", de: "Geschäft" }, { it: "mercato", de: "Markt" },
        { it: "caro", de: "teuer" }, { it: "economico", de: "preiswert" },
        { it: "euro", de: "Euro" }
      ]
    },
    {
      id: "emergenza", title: "Notfall & Gesundheit", icon: "🩺",
      items: [
        { it: "aiuto", de: "Hilfe" }, { it: "aiuto!", de: "Hilfe! (Notruf)", key: "aiuto_esclamazione" },
        { it: "medico", de: "Arzt" }, { it: "farmacia", de: "Apotheke" },
        { it: "ospedale", de: "Krankenhaus" }, { it: "polizia", de: "Polizei" },
        { it: "dolore", de: "Schmerz" }, { it: "sto male", de: "mir geht es schlecht" }
      ]
    },
    {
      id: "conversazione", title: "Smalltalk & Fragen", icon: "💬",
      items: [
        { it: "come sta?", de: "wie geht es Ihnen?" },
        { it: "tutto bene?", de: "alles gut?" },
        { it: "come si chiama?", de: "wie heißen Sie?" },
        { it: "mi chiamo…", de: "ich heiße…" },
        { it: "non capisco", de: "ich verstehe nicht" },
        { it: "parla inglese?", de: "sprechen Sie Englisch?" },
        { it: "parla tedesco?", de: "sprechen Sie Deutsch?" },
        { it: "che cos'è?", de: "was ist das?" },
        { it: "quando parte?", de: "wann fährt es ab?" }, { it: "perché?", de: "warum?" }
      ]
    },
    {
      id: "aggettivi", title: "Eigenschaften", icon: "✨",
      items: [
        { it: "buono", de: "gut (m.)" }, { it: "buona", de: "gut (w.)" },
        { it: "cattivo", de: "schlecht" }, { it: "grande", de: "groß" },
        { it: "piccolo", de: "klein" }, { it: "caldo", de: "heiß / warm" },
        { it: "freddo", de: "kalt" }, { it: "aperto", de: "geöffnet" },
        { it: "chiuso", de: "geschlossen" }, { it: "bello", de: "schön" },
        { it: "molto", de: "sehr / viel" }, { it: "poco", de: "wenig" }
      ]
    },
    {
      id: "interrogativi", title: "Fragewörter", icon: "❓",
      items: [
        { it: "che cosa?", de: "was?" }, { it: "chi?", de: "wer?" },
        { it: "quale?", de: "welche/r/s?" }, { it: "come?", de: "wie?" },
        { it: "quando?", de: "wann?" }, { it: "dove?", de: "wo?" },
        { it: "quanto?", de: "wie viel?" }, { it: "a che ora?", de: "um wie viel Uhr?" }
      ]
    }
  ],

  /* Reihenfolge: io, tu, lui/lei, noi, loro. Bei Verben mit
     essere zeigt /a bzw. /e die geschlechtsabhängige Endung. */
  verbs: [
    { inf: "essere", de: "sein", presente: ["sono","sei","è","siamo","sono"], passato: ["sono stato/a","sei stato/a","è stato/a","siamo stati/e","sono stati/e"], futuro: ["sarò","sarai","sarà","saremo","saranno"] },
    { inf: "stare", de: "sein / sich befinden", presente: ["sto","stai","sta","stiamo","stanno"], passato: ["sono stato/a","sei stato/a","è stato/a","siamo stati/e","sono stati/e"], futuro: ["starò","starai","starà","staremo","staranno"] },
    { inf: "avere", de: "haben", presente: ["ho","hai","ha","abbiamo","hanno"], passato: ["ho avuto","hai avuto","ha avuto","abbiamo avuto","hanno avuto"], futuro: ["avrò","avrai","avrà","avremo","avranno"] },
    { inf: "andare", de: "gehen / fahren", presente: ["vado","vai","va","andiamo","vanno"], passato: ["sono andato/a","sei andato/a","è andato/a","siamo andati/e","sono andati/e"], futuro: ["andrò","andrai","andrà","andremo","andranno"] },
    { inf: "fare", de: "machen / tun", presente: ["faccio","fai","fa","facciamo","fanno"], passato: ["ho fatto","hai fatto","ha fatto","abbiamo fatto","hanno fatto"], futuro: ["farò","farai","farà","faremo","faranno"] },
    { inf: "volere", de: "wollen / möchten", presente: ["voglio","vuoi","vuole","vogliamo","vogliono"], passato: ["ho voluto","hai voluto","ha voluto","abbiamo voluto","hanno voluto"], futuro: ["vorrò","vorrai","vorrà","vorremo","vorranno"] },
    { inf: "potere", de: "können / dürfen", presente: ["posso","puoi","può","possiamo","possono"], passato: ["ho potuto","hai potuto","ha potuto","abbiamo potuto","hanno potuto"], futuro: ["potrò","potrai","potrà","potremo","potranno"] },
    { inf: "vedere", de: "sehen", presente: ["vedo","vedi","vede","vediamo","vedono"], passato: ["ho visto","hai visto","ha visto","abbiamo visto","hanno visto"], futuro: ["vedrò","vedrai","vedrà","vedremo","vedranno"] },
    { inf: "dire", de: "sagen", presente: ["dico","dici","dice","diciamo","dicono"], passato: ["ho detto","hai detto","ha detto","abbiamo detto","hanno detto"], futuro: ["dirò","dirai","dirà","diremo","diranno"] },
    { inf: "dare", de: "geben", presente: ["do","dai","dà","diamo","danno"], passato: ["ho dato","hai dato","ha dato","abbiamo dato","hanno dato"], futuro: ["darò","darai","darà","daremo","daranno"] },
    { inf: "sapere", de: "wissen", presente: ["so","sai","sa","sappiamo","sanno"], passato: ["ho saputo","hai saputo","ha saputo","abbiamo saputo","hanno saputo"], futuro: ["saprò","saprai","saprà","sapremo","sapranno"] },
    { inf: "venire", de: "kommen", presente: ["vengo","vieni","viene","veniamo","vengono"], passato: ["sono venuto/a","sei venuto/a","è venuto/a","siamo venuti/e","sono venuti/e"], futuro: ["verrò","verrai","verrà","verremo","verranno"] },
    { inf: "mangiare", de: "essen", presente: ["mangio","mangi","mangia","mangiamo","mangiano"], passato: ["ho mangiato","hai mangiato","ha mangiato","abbiamo mangiato","hanno mangiato"], futuro: ["mangerò","mangerai","mangerà","mangeremo","mangeranno"] },
    { inf: "bere", de: "trinken", presente: ["bevo","bevi","beve","beviamo","bevono"], passato: ["ho bevuto","hai bevuto","ha bevuto","abbiamo bevuto","hanno bevuto"], futuro: ["berrò","berrai","berrà","berremo","berranno"] },
    { inf: "parlare", de: "sprechen", presente: ["parlo","parli","parla","parliamo","parlano"], passato: ["ho parlato","hai parlato","ha parlato","abbiamo parlato","hanno parlato"], futuro: ["parlerò","parlerai","parlerà","parleremo","parleranno"] },
    { inf: "comprare", de: "kaufen", presente: ["compro","compri","compra","compriamo","comprano"], passato: ["ho comprato","hai comprato","ha comprato","abbiamo comprato","hanno comprato"], futuro: ["comprerò","comprerai","comprerà","compreremo","compreranno"] },
    { inf: "pagare", de: "bezahlen", presente: ["pago","paghi","paga","paghiamo","pagano"], passato: ["ho pagato","hai pagato","ha pagato","abbiamo pagato","hanno pagato"], futuro: ["pagherò","pagherai","pagherà","pagheremo","pagheranno"] },
    { inf: "dovere", de: "müssen / sollen", presente: ["devo","devi","deve","dobbiamo","devono"], passato: ["ho dovuto","hai dovuto","ha dovuto","abbiamo dovuto","hanno dovuto"], futuro: ["dovrò","dovrai","dovrà","dovremo","dovranno"] },
    { inf: "amare", de: "lieben / gernhaben", presente: ["amo","ami","ama","amiamo","amano"], passato: ["ho amato","hai amato","ha amato","abbiamo amato","hanno amato"], futuro: ["amerò","amerai","amerà","ameremo","ameranno"] },
    { inf: "arrivare", de: "ankommen", presente: ["arrivo","arrivi","arriva","arriviamo","arrivano"], passato: ["sono arrivato/a","sei arrivato/a","è arrivato/a","siamo arrivati/e","sono arrivati/e"], futuro: ["arriverò","arriverai","arriverà","arriveremo","arriveranno"] },
    { inf: "aiutare", de: "helfen", presente: ["aiuto","aiuti","aiuta","aiutiamo","aiutano"], passato: ["ho aiutato","hai aiutato","ha aiutato","abbiamo aiutato","hanno aiutato"], futuro: ["aiuterò","aiuterai","aiuterà","aiuteremo","aiuteranno"] },
    { inf: "restare", de: "bleiben", presente: ["resto","resti","resta","restiamo","restano"], passato: ["sono restato/a","sei restato/a","è restato/a","siamo restati/e","sono restati/e"], futuro: ["resterò","resterai","resterà","resteremo","resteranno"] },
    { inf: "aprire", de: "öffnen", presente: ["apro","apri","apre","apriamo","aprono"], passato: ["ho aperto","hai aperto","ha aperto","abbiamo aperto","hanno aperto"], futuro: ["aprirò","aprirai","aprirà","apriremo","apriranno"] },
    { inf: "partire", de: "abfahren / abreisen", presente: ["parto","parti","parte","partiamo","partono"], passato: ["sono partito/a","sei partito/a","è partito/a","siamo partiti/e","sono partiti/e"], futuro: ["partirò","partirai","partirà","partiremo","partiranno"] }
  ],

  /* Aussprache-Regeln (Sapere → Pronuncia). Audio-Keys:
     pron_<regel>_<slug(beispiel)> — muss zu app.js (viewPronuncia)
     und tools/generate-audio-manifest.js passen. */
  pronunciation: [
    {
      id: "gn", title: "gn → nj",
      rule: "gn klingt wie nj: gnocchi = njokki, signora = sinjora — nie getrennt als n-g.",
      examples: [
        { it: "gnocchi", de: "Gnocchi (Kartoffelklöße)" }, { it: "il bagno", de: "das Bad / die Toilette" },
        { it: "la signora", de: "die Dame / Frau" }, { it: "la montagna", de: "der Berg" }
      ]
    },
    {
      id: "gli", title: "gli → weiches glj",
      rule: "gli ist ein einziger weicher Laut wie glj in „famiglia“ — nicht g-l-i getrennt. Nur der Artikel gli klingt wie li: gli amici.",
      examples: [
        { it: "la famiglia", de: "die Familie" }, { it: "il figlio", de: "der Sohn" },
        { it: "la bottiglia", de: "die Flasche" }, { it: "gli amici", de: "die Freunde (Artikel: li)" }
      ]
    },
    {
      id: "g-dolce", title: "g vor e/i → dsch",
      rule: "Vor e und i wird g weich wie dsch in „Dschungel“: gelato = dschelato. Darum enden viele Wörter auf -gio/-gia: viaggio klingt „viadscho“.",
      examples: [
        { it: "il gelato", de: "das Eis" }, { it: "il giorno", de: "der Tag" },
        { it: "il viaggio", de: "die Reise" }, { it: "il parco giochi", de: "der Spielplatz" },
        { it: "la gente", de: "die Leute" }
      ]
    },
    {
      id: "gg", title: "gg vor e/i → langes, kräftiges dsch",
      rule: "Doppel-g vor e/i wird gedehnt und kräftig gesprochen — der Laut dauert doppelt so lang: campeggio = kam-ped-dschio.",
      examples: [
        { it: "il campeggio", de: "das Camping / der Zeltplatz" }, { it: "oggi", de: "heute" },
        { it: "il formaggio", de: "der Käse" }, { it: "leggere", de: "lesen" }
      ]
    },
    {
      id: "c-dolce", title: "c vor e/i → tsch",
      rule: "Vor e und i wird c weich wie tsch in „Tschüss“: ciao = tschau. Vor a, o, u bleibt es hart wie k (casa = kasa).",
      examples: [
        { it: "ciao", de: "hallo / tschüss" }, { it: "il cinema", de: "das Kino" },
        { it: "la cena", de: "das Abendessen" }, { it: "la cioccolata", de: "die Schokolade" }
      ]
    },
    {
      id: "ch", title: "ch → k",
      rule: "Das h macht das c hart: ch klingt immer wie k — chiesa heißt „kiesa“, perché „perke“.",
      examples: [
        { it: "la chiave", de: "der Schlüssel" }, { it: "perché", de: "warum / weil" },
        { it: "la chiesa", de: "die Kirche" }, { it: "il bicchiere", de: "das Glas" }
      ]
    },
    {
      id: "gh", title: "gh → hartes g",
      rule: "Das h macht auch das g hart: gh klingt wie g in „gut“ — spaghetti = spagetti, das h selbst ist stumm.",
      examples: [
        { it: "gli spaghetti", de: "die Spaghetti" }, { it: "i laghi", de: "die Seen" },
        { it: "il ghiaccio", de: "das Eis (Gefrorenes)" }
      ]
    },
    {
      id: "sc", title: "sc → sch oder sk",
      rule: "Vor e und i klingt sc wie sch (pesce = pesche), vor a, o und u hart wie sk (scuola = skola).",
      examples: [
        { it: "il pesce", de: "der Fisch" }, { it: "l'uscita", de: "der Ausgang" },
        { it: "la scuola", de: "die Schule (sk!)" }, { it: "la sciarpa", de: "der Schal (sch!)" }
      ]
    },
    {
      id: "h", title: "h ist immer stumm",
      rule: "Das italienische h wird nie gesprochen: ho, hai, hanno klingen wie o, ai, anno — geschrieben wird es nur, um Wörter zu unterscheiden.",
      examples: [
        { it: "ho", de: "ich habe" }, { it: "hai", de: "du hast" },
        { it: "hanno", de: "sie haben" }, { it: "l'hotel", de: "das Hotel" }
      ]
    },
    {
      id: "doppio", title: "Doppelkonsonanten halten länger",
      rule: "Verdoppelte Konsonanten deutlich länger und kräftiger sprechen — oft ändert die Länge die Bedeutung: nonno (Großvater) ≠ nono (neunter).",
      examples: [
        { it: "il nonno", de: "der Großvater" }, { it: "nono", de: "neunter" },
        { it: "la palla", de: "der Ball" }, { it: "la mamma", de: "die Mama" }
      ]
    },
    {
      id: "accento", title: "Betonung: meist vorletzte Silbe",
      rule: "Fast alle Wörter betonen die vorletzte Silbe (TA-vo-lo). Endet das Wort auf einem betonten Vokal, trägt er einen Akzent: città, caffè.",
      examples: [
        { it: "il tavolo", de: "der Tisch (TA-vo-lo)" }, { it: "la città", de: "die Stadt" },
        { it: "il caffè", de: "der Kaffee" }, { it: "l'università", de: "die Universität" }
      ]
    },
    {
      id: "z", title: "z → ts oder weiches dz",
      rule: "z klingt meist wie ts (pizza = pitsa), bei einigen Wörtern weich und stimmhaft wie dz (zero, zaino) — höre auf die Beispiele.",
      examples: [
        { it: "la pizza", de: "die Pizza" }, { it: "il pranzo", de: "das Mittagessen" },
        { it: "lo zio", de: "der Onkel" }, { it: "lo zero", de: "die Null (weiches dz)" }
      ]
    }
  ],

  /* Grammatik-Themen (Sapere → Grammatica). Audio-Keys:
     gram_<thema>_<slug(beispiel)> — muss zu app.js (viewGrammatica)
     und tools/generate-audio-manifest.js passen. */
  grammar: [
    {
      id: "possessivi", title: "Possessivpronomen",
      intro: "Mein, dein, sein: Die Form richtet sich nach dem besessenen Ding (Geschlecht + Zahl) — nicht nach dem Besitzer. il suo bedeutet darum „sein“ UND „ihr“; der Kontext entscheidet.",
      forms: [
        { who: "io", m: "il mio", f: "la mia", mp: "i miei", fp: "le mie" },
        { who: "tu", m: "il tuo", f: "la tua", mp: "i tuoi", fp: "le tue" },
        { who: "lui/lei", m: "il suo", f: "la sua", mp: "i suoi", fp: "le sue" },
        { who: "noi", m: "il nostro", f: "la nostra", mp: "i nostri", fp: "le nostre" },
        { who: "voi", m: "il vostro", f: "la vostra", mp: "i vostri", fp: "le vostre" },
        { who: "loro", m: "il loro", f: "la loro", mp: "i loro", fp: "le loro" }
      ],
      notes: [
        "Artikel + Endung zeigen den Besitz: la mia valigia — la verrät das weibliche Ding, -ia verrät „mein“.",
        "Verwandte im Singular verlieren den Artikel: mia madre (meine Mutter), suo fratello (sein Bruder). Im Plural kommt er zurück: i suoi genitori (seine Eltern).",
        "loro ändert sich nie — nur der Artikel passt sich an: il loro hotel, la loro casa, le loro valigie."
      ],
      examples: [
        { it: "Questa è la mia valigia.", de: "Das ist mein Koffer. (valigia ist weiblich!)" },
        { it: "Dov'è il tuo passaporto?", de: "Wo ist dein Pass?" },
        { it: "Il suo treno parte alle otto.", de: "Sein / ihr Zug fährt um acht Uhr." },
        { it: "La sua camera è molto bella.", de: "Sein / ihr Zimmer ist sehr schön." },
        { it: "Le nostre valigie sono pesanti.", de: "Unsere Koffer sind schwer." },
        { it: "Dove sono i vostri biglietti?", de: "Wo sind eure Tickets?" },
        { it: "Il loro hotel è vicino alla stazione.", de: "Ihr Hotel ist in der Nähe des Bahnhofs." },
        { it: "Mia sorella abita a Roma.", de: "Meine Schwester wohnt in Rom. (Verwandte: ohne Artikel)" },
        { it: "I miei amici sono simpatici.", de: "Meine Freunde sind nett." }
      ]
    }
  ]
};
