/* ============================================================
   sentences.js — Satzbaukasten, Reisedialoge und Missionen
   ------------------------------------------------------------
   Die Bedeutungen sind kuratiert; die italienische Morphologie
   kommt aus IT_DATA. Aus jedem SVO-Muster entstehen fünf
   Personen mal drei Zeiten.
   ============================================================ */

window.IT_SENT = {
  subjects: {
    it: ["Io", "Tu", "Lui", "Noi", "Loro", "Voi"],
    de: ["ich", "du", "er", "wir", "sie", "ihr"]
  },
  werden: ["werde", "wirst", "wird", "werden", "werden", "werdet"],
  habenPraes: ["habe", "hast", "hat", "haben", "haben", "habt"],

  deVerbs: {
    mangiare: { praes: ["esse","isst","isst","essen","essen","esst"], part: "gegessen", inf: "essen" },
    bere: { praes: ["trinke","trinkst","trinkt","trinken","trinken","trinkt"], part: "getrunken", inf: "trinken" },
    vedere: { praes: ["sehe","siehst","sieht","sehen","sehen","seht"], part: "gesehen", inf: "sehen" },
    pagare: { praes: ["bezahle","bezahlst","bezahlt","bezahlen","bezahlen","bezahlt"], part: "bezahlt", inf: "bezahlen" },
    comprare: { praes: ["kaufe","kaufst","kauft","kaufen","kaufen","kauft"], part: "gekauft", inf: "kaufen" },
    avere: { praes: ["habe","hast","hat","haben","haben","habt"], praet: ["hatte","hattest","hatte","hatten","hatten","hattet"], part: "gehabt", inf: "haben" }
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

  /* Dialoge tragen level:"A1"|"A2"|"B1" — Viaggio filtert danach. */
  dialogues: [
    { id: "ristorante", level: "A1", title: "Im Restaurant", icon: "🍝", lines: [
      { who: "Kellner", it: "Buonasera! Avete una prenotazione?", de: "Guten Abend! Haben Sie eine Reservierung?" },
      { who: "Du", it: "No, siamo in due.", de: "Nein, wir sind zu zweit." },
      { who: "Kellner", it: "Certamente. Ecco il menù.", de: "Natürlich. Hier ist die Speisekarte." },
      { who: "Du", it: "Vorrei il pesce, per favore.", de: "Ich hätte gern Fisch, bitte." },
      { who: "Du", it: "Il conto, per favore.", de: "Die Rechnung, bitte." },
      { who: "Du", it: "Posso pagare con la carta?", de: "Kann ich mit Karte zahlen?" }
    ]},
    { id: "bar", level: "A1", title: "In der Bar", icon: "☕", lines: [
      { who: "Du", it: "Buongiorno! Un caffè, per favore.", de: "Guten Morgen! Einen Espresso, bitte." },
      { who: "Bedienung", it: "Desidera altro?", de: "Möchten Sie noch etwas?" },
      { who: "Du", it: "Un cornetto, per favore.", de: "Ein Hörnchen, bitte." },
      { who: "Bedienung", it: "Sono due euro.", de: "Das macht zwei Euro." },
      { who: "Du", it: "Ecco a Lei. Grazie!", de: "Hier, bitte. Danke!" }
    ]},
    { id: "trasporti", level: "A1", title: "Bus & Bahn", icon: "🚆", lines: [
      { who: "Du", it: "Scusi, dov'è la stazione?", de: "Entschuldigung, wo ist der Bahnhof?" },
      { who: "Passant", it: "È lì, sulla destra.", de: "Er ist dort, auf der rechten Seite." },
      { who: "Du", it: "Un biglietto per Roma, per favore.", de: "Eine Fahrkarte nach Rom, bitte." },
      { who: "Schalter", it: "Andata e ritorno?", de: "Hin und zurück?" },
      { who: "Du", it: "Solo andata. Quanto costa?", de: "Nur hin. Wie viel kostet das?" }
    ]},
    { id: "albergo", level: "A1", title: "Im Hotel", icon: "🏨", lines: [
      { who: "Du", it: "Buonasera, ho una prenotazione.", de: "Guten Abend, ich habe eine Reservierung." },
      { who: "Rezeption", it: "A che nome?", de: "Auf welchen Namen?" },
      { who: "Du", it: "A nome Müller.", de: "Auf den Namen Müller." },
      { who: "Rezeption", it: "Ecco la chiave. Camera dodici.", de: "Hier ist der Schlüssel. Zimmer zwölf." },
      { who: "Du", it: "A che ora è la colazione?", de: "Um wie viel Uhr gibt es Frühstück?" }
    ]},
    { id: "acquisti", level: "A1", title: "Einkaufen", icon: "🛍️", lines: [
      { who: "Du", it: "Quanto costa questo?", de: "Wie viel kostet das?" },
      { who: "Verkäufer", it: "Costa cinque euro.", de: "Das kostet fünf Euro." },
      { who: "Du", it: "È troppo caro.", de: "Das ist zu teuer." },
      { who: "Du", it: "Accettate la carta?", de: "Nehmen Sie Karte?" },
      { who: "Verkäufer", it: "Sì, certamente.", de: "Ja, natürlich." }
    ]},
    { id: "aiuto", level: "A1", title: "Um Hilfe bitten", icon: "🆘", lines: [
      { who: "Du", it: "Scusi, può aiutarmi?", de: "Entschuldigung, können Sie mir helfen?" },
      { who: "Du", it: "Mi sono perso.", de: "Ich habe mich verlaufen." },
      { who: "Du", it: "Dov'è la farmacia?", de: "Wo ist die Apotheke?" },
      { who: "Du", it: "Ho bisogno di un medico.", de: "Ich brauche einen Arzt." },
      { who: "Passant", it: "Chiamo aiuto.", de: "Ich rufe Hilfe." }
    ]},
    { id: "famiglia", level: "A1", title: "Familie vorstellen", icon: "👨‍👩‍👧", lines: [
      { who: "Du", it: "Ciao Marco! Come stai?", de: "Hallo Marco! Wie geht's?" },
      { who: "Marco", it: "Bene grazie! E tu?", de: "Gut, danke! Und dir?" },
      { who: "Du", it: "Tutto bene. Questa è mia sorella, Anna.", de: "Alles gut. Das ist meine Schwester, Anna." },
      { who: "Marco", it: "Piacere, Anna. Di dove sei?", de: "Freut mich, Anna. Woher kommst du?" },
      { who: "Anna", it: "Sono di Berlino, sono tedesca.", de: "Ich komme aus Berlin, ich bin Deutsche." },
      { who: "Marco", it: "Che bello! La mia famiglia viene da Napoli.", de: "Wie schön! Meine Familie kommt aus Neapel." }
    ]},
    { id: "casa", level: "A1", title: "Bei mir zuhause", icon: "🏠", lines: [
      { who: "Du", it: "Benvenuto! Questa è la mia casa.", de: "Willkommen! Das ist mein Zuhause." },
      { who: "Luca", it: "Che bella casa! Il soggiorno è grande.", de: "Was für ein schönes Zuhause! Das Wohnzimmer ist groß." },
      { who: "Du", it: "Sì, e la cucina è là a destra.", de: "Ja, und die Küche ist dort rechts." },
      { who: "Luca", it: "Il quadro sopra il divano è bellissimo.", de: "Das Bild über dem Sofa ist wunderschön." },
      { who: "Du", it: "Grazie! È un regalo di mia nonna.", de: "Danke! Es ist ein Geschenk meiner Oma." },
      { who: "Luca", it: "Ora ti lascio, è tardi. Ciao!", de: "Jetzt lasse ich dich, es ist spät. Tschüss!" }
    ]},
    { id: "medico", level: "A2", title: "Beim Arzt", icon: "🩺", lines: [
      { who: "Du", it: "Dottore, non mi sento bene.", de: "Herr Doktor, ich fühle mich nicht wohl." },
      { who: "Dottore", it: "Che cosa ha esattamente?", de: "Was fehlt Ihnen genau?" },
      { who: "Du", it: "Ho la gola infiammata e tossisco.", de: "Mein Hals ist entzündet, und ich huste." },
      { who: "Dottore", it: "Le prescrivo una medicina.", de: "Ich verschreibe Ihnen ein Medikament." },
      { who: "Du", it: "Devo stare a casa?", de: "Muss ich zu Hause bleiben?" },
      { who: "Dottore", it: "Sì, tre giorni di riposo.", de: "Ja, drei Tage Ruhe." }
    ]},
    { id: "discussione", level: "B1", title: "Film-Diskussion", icon: "🎬", lines: [
      { who: "Du", it: "Secondo me, questo film è bellissimo.", de: "Meiner Meinung nach ist dieser Film wunderschön." },
      { who: "Sara", it: "Non sono d'accordo! Penso che sia noioso.", de: "Da bin ich nicht einverstanden! Ich finde, er ist langweilig." },
      { who: "Du", it: "Noioso? Ma se non hai visto la fine!", de: "Langweilig? Aber du hast doch das Ende nicht gesehen!" },
      { who: "Sara", it: "Ho provato, ma mi sono addormentata.", de: "Ich habe es versucht, aber ich bin eingeschlafen." },
      { who: "Du", it: "Spero che tu cambi idea un giorno.", de: "Ich hoffe, dass du eines Tages deine Meinung änderst." }
    ]},
    { id: "farmacia", level: "A2", title: "In der Apotheke", icon: "💊", lines: [
      { who: "Du", it: "Buongiorno, ho mal di gola e un po' di febbre.", de: "Guten Tag, ich habe Halsschmerzen und etwas Fieber." },
      { who: "Apotheker", it: "Da quanti giorni si sente così?", de: "Seit wie vielen Tagen fühlen Sie sich so?" },
      { who: "Du", it: "Da tre giorni. Ho anche la tosse.", de: "Seit drei Tagen. Ich habe auch Husten." },
      { who: "Apotheker", it: "Le do qualcosa per la tosse e delle pastiglie per la gola.", de: "Ich gebe Ihnen etwas gegen den Husten und Lutschtabletten für den Hals." },
      { who: "Du", it: "Quanto costa tutto? Posso pagare con la carta?", de: "Wie viel kostet alles? Kann ich mit Karte zahlen?" },
      { who: "Apotheker", it: "Dodici euro. Se non passa entro una settimana, vada dal medico.", de: "Zwölf Euro. Wenn es nicht innerhalb einer Woche vorbei ist, gehen Sie zum Arzt." }
    ]},
    { id: "ritardo", level: "A2", title: "Verspätung am Bahnhof", icon: "🚦", lines: [
      { who: "Du", it: "Scusi, il treno per Firenze è in ritardo?", de: "Entschuldigung, hat der Zug nach Florenz Verspätung?" },
      { who: "Bahnpersonal", it: "Sì, ha venti minuti di ritardo. Arriva al binario sette.", de: "Ja, er hat zwanzig Minuten Verspätung. Er kommt auf Gleis sieben an." },
      { who: "Du", it: "Devo cambiare a Bologna: perdo la coincidenza?", de: "Ich muss in Bologna umsteigen: verliere ich den Anschluss?" },
      { who: "Bahnpersonal", it: "No, quello per Roma parte alle quattordici e dieci.", de: "Nein, der nach Rom fährt um vierzehn Uhr zehn ab." },
      { who: "Du", it: "Meno male! Dov'è il binario sette, per favore?", de: "Gott sei Dank! Wo ist bitte Gleis sieben?" },
      { who: "Bahnpersonal", it: "Laggiù in fondo: prenda la scala mobile a destra.", de: "Dort hinten: nehmen Sie die Rolltreppe rechts." }
    ]},
    { id: "tempo", level: "A2", title: "Smalltalk: Wetter", icon: "🌦️", lines: [
      { who: "Du", it: "Che tempo fa oggi qui da voi?", de: "Wie ist heute das Wetter bei euch?" },
      { who: "Giulia", it: "È umido e al mattino c'è un po' di nebbia.", de: "Es ist feucht, und morgens gibt es etwas Nebel." },
      { who: "Du", it: "E in montagna? Vale la pena prendere la funivia?", de: "Und im Gebirge? Lohnt es sich, die Seilbahn zu nehmen?" },
      { who: "Giulia", it: "Domani è prevista pioggia, ma oggi il cielo è sereno.", de: "Für morgen ist Regen angesagt, aber heute ist der Himmel klar." },
      { who: "Du", it: "Però fa piuttosto fresco, no? Quanti gradi ci sono?", de: "Aber es ist ziemlich kühl, oder? Wie viel Grad sind es?" },
      { who: "Giulia", it: "Dieci. Portati una sciarpa e dei guanti!", de: "Zehn. Nimm dir einen Schal und Handschuhe mit!" }
    ]},
    { id: "telefono", level: "A2", title: "Tisch reservieren am Telefon", icon: "📞", lines: [
      { who: "Du", it: "Pronto, buonasera! Vorrei prenotare un tavolo per stasera.", de: "Hallo, guten Abend! Ich würde gern einen Tisch für heute Abend reservieren." },
      { who: "Restaurant", it: "Buonasera! Per quante persone e a che ora?", de: "Guten Abend! Für wie viele Personen und um wie viel Uhr?" },
      { who: "Du", it: "Per quattro persone, alle otto. Sarebbe possibile un tavolo tranquillo?", de: "Für vier Personen, um acht. Wäre ein ruhiger Tisch möglich?" },
      { who: "Restaurant", it: "Certamente, quello in fondo alla sala. A nome?", de: "Natürlich, der hinten im Saal. Auf welchen Namen?" },
      { who: "Du", it: "A nome Weber. E il coperto è incluso?", de: "Auf den Namen Weber. Und ist das Gedeck inbegriffen?" },
      { who: "Restaurant", it: "Sì, due euro a persona. Vi aspettiamo!", de: "Ja, zwei Euro pro Person. Wir freuen uns auf euch!" }
    ]},
    { id: "aeroporto", level: "B1", title: "Am Flughafen: Gepäck verloren", icon: "🧳", lines: [
      { who: "Du", it: "Mi scusi, il mio bagaglio non è arrivato.", de: "Entschuldigung, mein Gepäck ist nicht angekommen." },
      { who: "Mitarbeiter", it: "Mi mostri la carta d'imbarco e l'etichetta della valigia, per favore.", de: "Zeigen Sie mir bitte die Bordkarte und den Gepäckanhänger des Koffers." },
      { who: "Du", it: "Eccole qui. All'imbarco c'era una fila lunghissima.", de: "Hier bitte. Beim Boarding stand eine sehr lange Schlange." },
      { who: "Mitarbeiter", it: "Purtroppo capita spesso in alta stagione. Compili questo modulo, per cortesia.", de: "Leider passiert das in der Hochsaison oft. Füllen Sie bitte dieses Formular aus." },
      { who: "Du", it: "E la valigia? Verrà spedita in albergo?", de: "Und der Koffer? Wird er ins Hotel geschickt?" },
      { who: "Mitarbeiter", it: "Sì, entro domani mattina. Le auguriamo un buon soggiorno e ci scusiamo per il disagio.", de: "Ja, bis morgen früh. Wir wünschen Ihnen einen guten Aufenthalt und bitten um Entschuldigung für die Unannehmlichkeiten." }
    ]},
    { id: "colloquio", level: "B1", title: "Beim Vorstellungsgespräch", icon: "💼", lines: [
      { who: "Personaler", it: "Ci parli della sua esperienza nel settore alberghiero.", de: "Erzählen Sie uns von Ihrer Erfahrung im Hotelgewerbe." },
      { who: "Du", it: "Ho lavorato per tre anni in un albergo a Berlino, dove mi occupavo della reception.", de: "Ich habe drei Jahre in einem Berliner Hotel gearbeitet, wo ich den Empfang betreut habe." },
      { who: "Personaler", it: "Perché vorrebbe lavorare proprio con noi?", de: "Warum möchten Sie ausgerechnet bei uns arbeiten?" },
      { who: "Du", it: "Perché la vostra azienda investe nella formazione e io voglio crescere professionalmente.", de: "Weil Ihr Betrieb in Weiterbildung investiert und ich mich beruflich weiterentwickeln möchte." },
      { who: "Personaler", it: "Che aspettative di stipendio ha?", de: "Welche Gehaltsvorstellungen haben Sie?" },
      { who: "Du", it: "Penso che possiamo trovare un'intesa. Quando ci darebbe una risposta?", de: "Ich denke, dass wir eine Einigung finden. Wann würden Sie uns Bescheid geben?" }
    ]},
    { id: "notizie", level: "B1", title: "Über die Nachrichten sprechen", icon: "📰", lines: [
      { who: "Du", it: "Hai letto l'articolo sul traffico nel centro storico?", de: "Hast du den Artikel über den Verkehr in der Altstadt gelesen?" },
      { who: "Marco", it: "Sì, l'ho visto anche al telegiornale.", de: "Ja, ich habe es auch in den Nachrichten gesehen." },
      { who: "Du", it: "Secondo me la zona pedonale è la soluzione giusta.", de: "Meiner Meinung nach ist die Fußgängerzone die richtige Lösung." },
      { who: "Marco", it: "Non sono d'accordo: i negozi perdono clienti se nessuno trova parcheggio.", de: "Da bin ich nicht einverstanden: Die Geschäfte verlieren Kunden, wenn niemand einen Parkplatz findet." },
      { who: "Du", it: "Tuttavia così l'inquinamento diminuisce, e questo conta di più.", de: "Dennoch sinkt so die Umweltverschmutzung, und das zählt mehr." },
      { who: "Marco", it: "Hai ragione, anche se il problema della folla resta aperto.", de: "Du hast recht, auch wenn das Problem der Menschenmengen offen bleibt." }
    ]},
    { id: "binario", level: "A1", title: "Am Bahnsteig", icon: "🚉", lines: [
      { who: "Du", it: "Scusi, da quale binario parte il treno per Venezia?", de: "Entschuldigung, von welchem Bahnsteig fährt der Zug nach Venedig?" },
      { who: "Personal", it: "Dal binario due, ma il treno è in ritardo di dieci minuti.", de: "Von Bahnsteig zwei, aber der Zug hat zehn Minuten Verspätung." },
      { who: "Du", it: "Meno male, allora ho tempo per un caffè.", de: "Nur gut, dann habe ich Zeit für einen Kaffee." },
      { who: "Personal", it: "Attenzione: la partenza è tra un minuto!", de: "Achtung: Die Abfahrt ist in einer Minute!" },
      { who: "Du", it: "Oh no, corro subito! Non voglio perdere il treno.", de: "Oh nein, ich laufe sofort los! Ich will den Zug nicht verpassen." },
      { who: "Personal", it: "Buon viaggio!", de: "Gute Reise!" }
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
    { id: "preparare", phase: "prima", title: "Alle 30 Sätze der Reisecheckliste (A1) einmal geschafft", say: "" },
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
  ],

  /* Reisechecklisten für die höheren Stufen. A1 bleibt oben unangetastet
     (Fortschritts-Keys chk_0 … chk_29); A2/B1 nutzen eigene Präfixe. */
  checklistA2: [
    { it: "Potrebbe parlarmi più lentamente, per favore?", de: "Könnten Sie bitte langsamer mit mir sprechen?" },
    { it: "C'è un treno più economico per Verona?", de: "Gibt es einen günstigeren Zug nach Verona?" },
    { it: "Che tempo fa domani? È prevista pioggia?", de: "Wie wird das Wetter morgen? Ist Regen angesagt?" },
    { it: "Ho mal di testa da due giorni.", de: "Ich habe seit zwei Tagen Kopfschmerzen." },
    { it: "Avete qualcosa per il raffreddore?", de: "Haben Sie etwas gegen die Erkältung?" },
    { it: "Vorrei dei francobolli per la Germania, per favore.", de: "Ich hätte gern Briefmarken für Deutschland, bitte." },
    { it: "Dove posso ritirare un pacco?", de: "Wo kann ich ein Paket abholen?" },
    { it: "Vorrei prelevare duecento euro, per favore.", de: "Ich würde gern zweihundert Euro abheben." },
    { it: "Qual è la password del Wi-Fi?", de: "Wie lautet das Passwort fürs WLAN?" },
    { it: "Che cosa mi consiglia?", de: "Was empfehlen Sie mir?" },
    { it: "Il conto lo paghiamo a metà, va bene?", de: "Die Rechnung teilen wir uns, ist das okay?" },
    { it: "Ci può chiamare un taxi, per favore?", de: "Könnten Sie uns bitte ein Taxi rufen?" },
    { it: "A che ora apre la farmacia di turno?", de: "Um wie viel Uhr öffnet die Notdienst-Apotheke?" },
    { it: "Aspettami alla fermata, arrivo tra cinque minuti.", de: "Warte an der Haltestelle, ich komme in fünf Minuten." },
    { it: "Devo fare la fila qui?", de: "Muss ich mich hier anstellen?" }
  ],

  checklistB1: [
    { it: "Penso che ci sia un malinteso.", de: "Ich glaube, hier liegt ein Missverständnis vor." },
    { it: "Le spiacerebbe ripetere il numero della prenotazione?", de: "Würde es Ihnen etwas ausmachen, die Buchungsnummer zu wiederholen?" },
    { it: "Se il volo è in ritardo, perderemo la coincidenza.", de: "Wenn der Flug Verspätung hat, verpassen wir den Anschluss." },
    { it: "C'è un ristorante che serva piatti senza glutine?", de: "Gibt es ein Restaurant, das glutenfreie Gerichte anbietet?" },
    { it: "Aspettando l'imbarco, ho letto un articolo interessante.", de: "Während ich aufs Boarding gewartet habe, habe ich einen interessanten Artikel gelesen." },
    { it: "Il pagamento viene accettato anche in contanti?", de: "Wird die Zahlung auch in bar akzeptiert?" },
    { it: "Vorrei presentare un reclamo per il bagaglio danneggiato.", de: "Ich möchte wegen des beschädigten Gepäcks eine Reklamation einreichen." },
    { it: "Sono alla ricerca di una posizione nel settore del turismo.", de: "Ich bin auf der Suche nach einer Position im Tourismussektor." },
    { it: "Allego il mio curriculum e le lettere di referenza.", de: "Im Anhang finden Sie meinen Lebenslauf und die Referenzschreiben." },
    { it: "Che ne pensa di quest'edizione del festival?", de: "Was halten Sie von dieser Ausgabe des Festivals?" },
    { it: "Purtroppo non sono d'accordo con il suo punto di vista.", de: "Leider bin ich mit Ihrem Standpunkt nicht einverstanden." },
    { it: "Nonostante il traffico, siamo arrivati in orario.", de: "Trotz des Verkehrs sind wir pünktlich angekommen." },
    { it: "Mi scusi, credo che ci sia un errore nel conto.", de: "Entschuldigung, ich glaube, in der Rechnung ist ein Fehler." },
    { it: "Sto per uscire: posso richiamarla tra mezz'ora?", de: "Ich gehe gerade los: Kann ich Sie in einer halben Stunde zurückrufen?" },
    { it: "Vale la pena visitare il quartiere a piedi?", de: "Lohnt es sich, das Viertel zu Fuß zu besichtigen?" }
  ]
};
