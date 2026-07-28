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
    pronouns: ["io", "tu", "lui/lei", "noi", "loro"],
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
  ]
};
