/* ============================================================
   sentences.js — Satzbaukasten, Reisedialoge und Missionen
   ------------------------------------------------------------
   Die Bedeutungen sind kuratiert; die italienische Morphologie
   kommt aus IT_DATA. Aus jedem SVO-Muster entstehen fünf
   Personen mal drei Zeiten.
   ============================================================ */

window.IT_SENT = {
  subjects: {
    it: ["Io", "Tu", "Lui", "Noi", "Loro"],
    de: ["ich", "du", "er", "wir", "sie"]
  },
  werden: ["werde", "wirst", "wird", "werden", "werden"],
  habenPraes: ["habe", "hast", "hat", "haben", "haben"],

  deVerbs: {
    mangiare: { praes: ["esse","isst","isst","essen","essen"], part: "gegessen", inf: "essen" },
    bere: { praes: ["trinke","trinkst","trinkt","trinken","trinken"], part: "getrunken", inf: "trinken" },
    vedere: { praes: ["sehe","siehst","sieht","sehen","sehen"], part: "gesehen", inf: "sehen" },
    pagare: { praes: ["bezahle","bezahlst","bezahlt","bezahlen","bezahlen"], part: "bezahlt", inf: "bezahlen" },
    comprare: { praes: ["kaufe","kaufst","kauft","kaufen","kaufen"], part: "gekauft", inf: "kaufen" },
    avere: { praes: ["habe","hast","hat","haben","haben"], praet: ["hatte","hattest","hatte","hatten","hatten"], part: "gehabt", inf: "haben" }
  },

  svo: [
    { id: "mangiare_pane", verb: "mangiare", itObj: "il pane", deObj: "Brot", deObjNeg: "kein Brot", itObjNeg: "pane" },
    { id: "mangiare_pesce", verb: "mangiare", itObj: "il pesce", deObj: "Fisch", deObjNeg: "keinen Fisch", itObjNeg: "pesce" },
    { id: "mangiare_frutta", verb: "mangiare", itObj: "la frutta", deObj: "Obst", deObjNeg: "kein Obst", itObjNeg: "frutta" },
    { id: "bere_acqua", verb: "bere", itObj: "l'acqua", deObj: "Wasser", deObjNeg: "kein Wasser", itObjNeg: "acqua" },
    { id: "bere_vino", verb: "bere", itObj: "il vino", deObj: "Wein", deObjNeg: "keinen Wein", itObjNeg: "vino" },
    { id: "bere_caffe", verb: "bere", itObj: "il caffè", deObj: "Kaffee", deObjNeg: "keinen Kaffee", itObjNeg: "caffè" },
    { id: "vedere_menu", verb: "vedere", itObj: "il menù", deObj: "die Speisekarte", deObjNeg: "die Speisekarte nicht" },
    { id: "vedere_spiaggia", verb: "vedere", itObj: "la spiaggia", deObj: "den Strand", deObjNeg: "den Strand nicht" },
    { id: "pagare_conto", verb: "pagare", itObj: "il conto", deObj: "die Rechnung", deObjNeg: "die Rechnung nicht" },
    { id: "pagare_caffe", verb: "pagare", itObj: "il caffè", deObj: "den Kaffee", deObjNeg: "den Kaffee nicht" },
    { id: "comprare_biglietto", verb: "comprare", itObj: "un biglietto", deObj: "eine Fahrkarte", deObjNeg: "keine Fahrkarte", itObjNeg: "biglietti" },
    { id: "comprare_frutta", verb: "comprare", itObj: "della frutta", deObj: "Obst", deObjNeg: "kein Obst", itObjNeg: "frutta" },
    { id: "avere_problema", verb: "avere", itObj: "un problema", deObj: "ein Problem", deObjNeg: "kein Problem", itObjNeg: "problemi" },
    { id: "avere_tempo", verb: "avere", itObj: "tempo", deObj: "Zeit", deObjNeg: "keine Zeit", itObjNeg: "tempo" }
  ],

  dialogues: [
    { id: "ristorante", title: "Im Restaurant", icon: "🍝", lines: [
      { who: "Kellner", it: "Buonasera! Avete una prenotazione?", de: "Guten Abend! Haben Sie eine Reservierung?" },
      { who: "Du", it: "No, siamo in due.", de: "Nein, wir sind zu zweit." },
      { who: "Kellner", it: "Certamente. Ecco il menù.", de: "Natürlich. Hier ist die Speisekarte." },
      { who: "Du", it: "Vorrei il pesce, per favore.", de: "Ich hätte gern Fisch, bitte." },
      { who: "Du", it: "Il conto, per favore.", de: "Die Rechnung, bitte." },
      { who: "Du", it: "Posso pagare con la carta?", de: "Kann ich mit Karte zahlen?" }
    ]},
    { id: "bar", title: "In der Bar", icon: "☕", lines: [
      { who: "Du", it: "Buongiorno! Un caffè, per favore.", de: "Guten Morgen! Einen Espresso, bitte." },
      { who: "Bedienung", it: "Desidera altro?", de: "Möchten Sie noch etwas?" },
      { who: "Du", it: "Un cornetto, per favore.", de: "Ein Hörnchen, bitte." },
      { who: "Bedienung", it: "Sono due euro.", de: "Das macht zwei Euro." },
      { who: "Du", it: "Ecco a Lei. Grazie!", de: "Hier, bitte. Danke!" }
    ]},
    { id: "trasporti", title: "Bus & Bahn", icon: "🚆", lines: [
      { who: "Du", it: "Scusi, dov'è la stazione?", de: "Entschuldigung, wo ist der Bahnhof?" },
      { who: "Passant", it: "È lì, sulla destra.", de: "Er ist dort, auf der rechten Seite." },
      { who: "Du", it: "Un biglietto per Roma, per favore.", de: "Eine Fahrkarte nach Rom, bitte." },
      { who: "Schalter", it: "Andata e ritorno?", de: "Hin und zurück?" },
      { who: "Du", it: "Solo andata. Quanto costa?", de: "Nur hin. Wie viel kostet das?" }
    ]},
    { id: "albergo", title: "Im Hotel", icon: "🏨", lines: [
      { who: "Du", it: "Buonasera, ho una prenotazione.", de: "Guten Abend, ich habe eine Reservierung." },
      { who: "Rezeption", it: "A che nome?", de: "Auf welchen Namen?" },
      { who: "Du", it: "A nome Müller.", de: "Auf den Namen Müller." },
      { who: "Rezeption", it: "Ecco la chiave. Camera dodici.", de: "Hier ist der Schlüssel. Zimmer zwölf." },
      { who: "Du", it: "A che ora è la colazione?", de: "Um wie viel Uhr gibt es Frühstück?" }
    ]},
    { id: "acquisti", title: "Einkaufen", icon: "🛍️", lines: [
      { who: "Du", it: "Quanto costa questo?", de: "Wie viel kostet das?" },
      { who: "Verkäufer", it: "Costa cinque euro.", de: "Das kostet fünf Euro." },
      { who: "Du", it: "È troppo caro.", de: "Das ist zu teuer." },
      { who: "Du", it: "Accettate la carta?", de: "Nehmen Sie Karte?" },
      { who: "Verkäufer", it: "Sì, certamente.", de: "Ja, natürlich." }
    ]},
    { id: "aiuto", title: "Um Hilfe bitten", icon: "🆘", lines: [
      { who: "Du", it: "Scusi, può aiutarmi?", de: "Entschuldigung, können Sie mir helfen?" },
      { who: "Du", it: "Mi sono perso.", de: "Ich habe mich verlaufen." },
      { who: "Du", it: "Dov'è la farmacia?", de: "Wo ist die Apotheke?" },
      { who: "Du", it: "Ho bisogno di un medico.", de: "Ich brauche einen Arzt." },
      { who: "Passant", it: "Chiamo aiuto.", de: "Ich rufe Hilfe." }
    ]}
  ],

  missions: [
    { id: "caffe", phase: "viaggio", title: "Bestelle einen Kaffee auf Italienisch", say: "Un caffè, per favore." },
    { id: "conto", phase: "viaggio", title: "Bitte im Restaurant um die Rechnung", say: "Il conto, per favore." },
    { id: "strada", phase: "viaggio", title: "Frag eine Person nach dem Weg", say: "Scusi, dov'è la stazione?" },
    { id: "biglietto", phase: "viaggio", title: "Kauf eine Fahrkarte am Schalter", say: "Un biglietto, per favore." },
    { id: "grazie", phase: "viaggio", title: "Bedanke dich auf Italienisch – ohne Englisch", say: "Grazie mille!" },
    { id: "carta", phase: "viaggio", title: "Frag, ob du mit Karte zahlen kannst", say: "Posso pagare con la carta?" },
    { id: "gelato", phase: "viaggio", title: "Bestelle ein Gelato", say: "Un gelato, per favore." },
    { id: "buongiorno", phase: "viaggio", title: "Grüße morgens drei Menschen mit „Buongiorno“", say: "Buongiorno!" },
    { id: "preparare", phase: "prima", title: "Alle 30 Sätze der Reisecheckliste einmal geschafft", say: "" },
    { id: "routine", phase: "dopo", title: "Nach der Reise sieben Tage weitergelernt", say: "" },
    { id: "conversazione", phase: "dopo", title: "Ein kurzes Gespräch mit einem Muttersprachler geführt", say: "Parlo un po' d'italiano." },
    { id: "film", phase: "dopo", title: "Einen italienischen Film mit Untertiteln angesehen", say: "" }
  ],

  checklist: [
    { it: "Buongiorno!", de: "Guten Morgen / guten Tag!" },
    { it: "Buonasera!", de: "Guten Abend!" },
    { it: "Grazie.", de: "Danke." },
    { it: "Per favore.", de: "Bitte." },
    { it: "Scusi.", de: "Entschuldigung." },
    { it: "Permesso.", de: "Verzeihung / darf ich?" },
    { it: "Parla inglese?", de: "Sprechen Sie Englisch?" },
    { it: "Non parlo italiano.", de: "Ich spreche kein Italienisch." },
    { it: "Parlo un po' d'italiano.", de: "Ich spreche ein bisschen Italienisch." },
    { it: "Non capisco.", de: "Ich verstehe nicht." },
    { it: "Può ripetere, per favore?", de: "Können Sie das wiederholen?" },
    { it: "Può parlare più lentamente?", de: "Können Sie langsamer sprechen?" },
    { it: "Quanto costa?", de: "Wie viel kostet das?" },
    { it: "Il conto, per favore.", de: "Die Rechnung, bitte." },
    { it: "Posso pagare con la carta?", de: "Kann ich mit Karte zahlen?" },
    { it: "Vorrei un caffè, per favore.", de: "Ich hätte gern einen Espresso." },
    { it: "Vorrei il menù, per favore.", de: "Ich hätte gern die Speisekarte." },
    { it: "Avete un tavolo per due?", de: "Haben Sie einen Tisch für zwei?" },
    { it: "Dov'è il bagno?", de: "Wo ist die Toilette?" },
    { it: "Dov'è la stazione?", de: "Wo ist der Bahnhof?" },
    { it: "Dov'è l'albergo?", de: "Wo ist das Hotel?" },
    { it: "Un biglietto per Roma, per favore.", de: "Eine Fahrkarte nach Rom, bitte." },
    { it: "A che ora?", de: "Um wie viel Uhr?" },
    { it: "Quanto tempo ci vuole?", de: "Wie lange dauert es?" },
    { it: "Può aiutarmi?", de: "Können Sie mir helfen?" },
    { it: "Mi sono perso. / Mi sono persa.", de: "Ich habe mich verlaufen. (m / w)" },
    { it: "Ho bisogno di un medico.", de: "Ich brauche einen Arzt." },
    { it: "Dov'è la farmacia?", de: "Wo ist die Apotheke?" },
    { it: "Sì, per favore. / No, grazie.", de: "Ja, bitte. / Nein, danke." },
    { it: "Grazie mille per l'aiuto!", de: "Vielen Dank für die Hilfe!" }
  ]
};
