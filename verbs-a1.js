/* ============================================================
   verbs-a1.js — 80 häufige Verben für A1 und Reisealltag
   ------------------------------------------------------------
   Jede Verbkarte enthält fünf Personen in Presente, Passato
   prossimo und Futuro semplice. Reflexive und unpersönliche
   Verben werden gesondert behandelt.
   ============================================================ */
(function () {
  "use strict";
  const D = window.IT_DATA;
  if (!D) throw new Error("IT_DATA muss vor verbs-a1.js geladen werden.");

  const AVERE = ["ho", "hai", "ha", "abbiamo", "hanno"];
  const ESSERE = ["sono", "sei", "è", "siamo", "sono"];
  const FUTURE_ENDINGS = ["ò", "ai", "à", "emo", "anno"];
  const REFLEXIVE = ["mi", "ti", "si", "ci", "si"];

  function agreed(participle, person) {
    if (!participle.endsWith("o")) return participle;
    const stem = participle.slice(0, -1);
    return person < 3 ? `${participle}/a` : `${stem}i/e`;
  }

  function compound(participle, auxiliary) {
    const aux = auxiliary === "essere" ? ESSERE : AVERE;
    return aux.map((form, person) => `${form} ${auxiliary === "essere" ? agreed(participle, person) : participle}`);
  }

  function future(stem) {
    return FUTURE_ENDINGS.map((ending) => `${stem}${ending}`);
  }

  function verb(inf, de, presente, participle, futureStem, auxiliary = "avere", note = "") {
    return { inf, de, presente, passato: compound(participle, auxiliary), futuro: future(futureStem), note };
  }

  function reflexive(inf, de, basePresent, participle, futureStem, note = "") {
    return {
      inf, de,
      presente: basePresent.map((form, person) => `${REFLEXIVE[person]} ${form}`),
      passato: ESSERE.map((form, person) => `${REFLEXIVE[person]} ${form} ${agreed(participle, person)}`),
      futuro: future(futureStem).map((form, person) => `${REFLEXIVE[person]} ${form}`),
      note
    };
  }

  D.verbs = [
    verb("essere", "sein", ["sono","sei","è","siamo","sono"], "stato", "sar", "essere"),
    verb("avere", "haben", ["ho","hai","ha","abbiamo","hanno"], "avuto", "avr"),
    verb("stare", "sein / sich befinden", ["sto","stai","sta","stiamo","stanno"], "stato", "star", "essere"),
    verb("andare", "gehen / fahren", ["vado","vai","va","andiamo","vanno"], "andato", "andr", "essere"),
    verb("venire", "kommen", ["vengo","vieni","viene","veniamo","vengono"], "venuto", "verr", "essere"),
    verb("fare", "machen / tun", ["faccio","fai","fa","facciamo","fanno"], "fatto", "far"),
    verb("dare", "geben", ["do","dai","dà","diamo","danno"], "dato", "dar"),
    verb("dire", "sagen", ["dico","dici","dice","diciamo","dicono"], "detto", "dir"),
    verb("sapere", "wissen", ["so","sai","sa","sappiamo","sanno"], "saputo", "sapr"),
    verb("volere", "wollen / möchten", ["voglio","vuoi","vuole","vogliamo","vogliono"], "voluto", "vorr"),
    verb("potere", "können / dürfen", ["posso","puoi","può","possiamo","possono"], "potuto", "potr"),
    verb("dovere", "müssen / sollen", ["devo","devi","deve","dobbiamo","devono"], "dovuto", "dovr"),
    verb("vedere", "sehen", ["vedo","vedi","vede","vediamo","vedono"], "visto", "vedr"),
    verb("parlare", "sprechen", ["parlo","parli","parla","parliamo","parlano"], "parlato", "parler"),
    verb("mangiare", "essen", ["mangio","mangi","mangia","mangiamo","mangiano"], "mangiato", "manger"),
    verb("bere", "trinken", ["bevo","bevi","beve","beviamo","bevono"], "bevuto", "berr"),
    verb("comprare", "kaufen", ["compro","compri","compra","compriamo","comprano"], "comprato", "comprer"),
    verb("pagare", "bezahlen", ["pago","paghi","paga","paghiamo","pagano"], "pagato", "pagher"),
    verb("amare", "lieben / gernhaben", ["amo","ami","ama","amiamo","amano"], "amato", "amer"),
    verb("arrivare", "ankommen", ["arrivo","arrivi","arriva","arriviamo","arrivano"], "arrivato", "arriver", "essere"),
    verb("aiutare", "helfen", ["aiuto","aiuti","aiuta","aiutiamo","aiutano"], "aiutato", "aiuter"),
    verb("restare", "bleiben", ["resto","resti","resta","restiamo","restano"], "restato", "rester", "essere"),
    verb("aprire", "öffnen", ["apro","apri","apre","apriamo","aprono"], "aperto", "aprir"),
    verb("partire", "abfahren / abreisen", ["parto","parti","parte","partiamo","partono"], "partito", "partir", "essere"),
    verb("abitare", "wohnen", ["abito","abiti","abita","abitiamo","abitano"], "abitato", "abiter"),
    verb("ascoltare", "zuhören / anhören", ["ascolto","ascolti","ascolta","ascoltiamo","ascoltano"], "ascoltato", "ascolter"),
    verb("aspettare", "warten", ["aspetto","aspetti","aspetta","aspettiamo","aspettano"], "aspettato", "aspetter"),
    verb("ballare", "tanzen", ["ballo","balli","balla","balliamo","ballano"], "ballato", "baller"),
    verb("cambiare", "ändern / wechseln", ["cambio","cambi","cambia","cambiamo","cambiano"], "cambiato", "cambier"),
    verb("cantare", "singen", ["canto","canti","canta","cantiamo","cantano"], "cantato", "canter"),
    verb("capire", "verstehen", ["capisco","capisci","capisce","capiamo","capiscono"], "capito", "capir"),
    verb("cenare", "zu Abend essen", ["ceno","ceni","cena","ceniamo","cenano"], "cenato", "cener"),
    verb("cercare", "suchen", ["cerco","cerchi","cerca","cerchiamo","cercano"], "cercato", "cercher"),
    verb("chiamare", "rufen / anrufen", ["chiamo","chiami","chiama","chiamiamo","chiamano"], "chiamato", "chiamer"),
    reflexive("chiamarsi", "heißen", ["chiamo","chiami","chiama","chiamiamo","chiamano"], "chiamato", "chiamer"),
    verb("chiudere", "schließen", ["chiudo","chiudi","chiude","chiudiamo","chiudono"], "chiuso", "chiuder"),
    verb("cominciare", "beginnen", ["comincio","cominci","comincia","cominciamo","cominciano"], "cominciato", "comincer"),
    verb("costare", "kosten", ["costo","costi","costa","costiamo","costano"], "costato", "coster", "essere", "Im Alltag wird costare meistens in der 3. Person verwendet: costa / costano."),
    verb("domandare", "fragen", ["domando","domandi","domanda","domandiamo","domandano"], "domandato", "domander"),
    verb("dormire", "schlafen", ["dormo","dormi","dorme","dormiamo","dormono"], "dormito", "dormir"),
    verb("entrare", "eintreten / hineingehen", ["entro","entri","entra","entriamo","entrano"], "entrato", "entrer", "essere"),
    verb("finire", "beenden / fertig machen", ["finisco","finisci","finisce","finiamo","finiscono"], "finito", "finir", "avere", "Intransitiv steht oft essere: il film è finito."),
    verb("fumare", "rauchen", ["fumo","fumi","fuma","fumiamo","fumano"], "fumato", "fumer"),
    verb("giocare", "spielen", ["gioco","giochi","gioca","giochiamo","giocano"], "giocato", "giocher"),
    verb("guardare", "anschauen", ["guardo","guardi","guarda","guardiamo","guardano"], "guardato", "guarder"),
    verb("imparare", "lernen", ["imparo","impari","impara","impariamo","imparano"], "imparato", "imparer"),
    verb("incontrare", "treffen", ["incontro","incontri","incontra","incontriamo","incontrano"], "incontrato", "incontrer"),
    verb("insegnare", "unterrichten", ["insegno","insegni","insegna","insegniamo","insegnano"], "insegnato", "insegner"),
    verb("lavorare", "arbeiten", ["lavoro","lavori","lavora","lavoriamo","lavorano"], "lavorato", "lavorer"),
    verb("leggere", "lesen", ["leggo","leggi","legge","leggiamo","leggono"], "letto", "legger"),
    verb("mettere", "stellen / legen / anziehen", ["metto","metti","mette","mettiamo","mettono"], "messo", "metter"),
    verb("morire", "sterben", ["muoio","muori","muore","moriamo","muoiono"], "morto", "morir", "essere"),
    verb("nascere", "geboren werden", ["nasco","nasci","nasce","nasciamo","nascono"], "nato", "nascer", "essere"),
    verb("piacere", "gefallen", ["piaccio","piaci","piace","piacciamo","piacciono"], "piaciuto", "piacer", "essere", "Meist mit indirektem Pronomen: mi piace / mi piacciono."),
    {
      inf: "piovere", de: "regnen", impersonal: true,
      presente: [null, null, "piove", null, null],
      passato: [null, null, "è piovuto", null, null],
      futuro: [null, null, "pioverà", null, null],
      note: "Unpersönliches Verb: Im normalen Gebrauch steht es nur in der 3. Person Singular."
    },
    verb("portare", "bringen / tragen", ["porto","porti","porta","portiamo","portano"], "portato", "porter"),
    verb("pranzare", "zu Mittag essen", ["pranzo","pranzi","pranza","pranziamo","pranzano"], "pranzato", "pranzer"),
    verb("prendere", "nehmen", ["prendo","prendi","prende","prendiamo","prendono"], "preso", "prender"),
    verb("prenotare", "reservieren / buchen", ["prenoto","prenoti","prenota","prenotiamo","prenotano"], "prenotato", "prenoter"),
    verb("pulire", "putzen / reinigen", ["pulisco","pulisci","pulisce","puliamo","puliscono"], "pulito", "pulir"),
    verb("ripetere", "wiederholen", ["ripeto","ripeti","ripete","ripetiamo","ripetono"], "ripetuto", "ripeter"),
    verb("rispondere", "antworten", ["rispondo","rispondi","risponde","rispondiamo","rispondono"], "risposto", "risponder"),
    verb("ritornare", "zurückkehren", ["ritorno","ritorni","ritorna","ritorniamo","ritornano"], "ritornato", "ritorner", "essere"),
    verb("scrivere", "schreiben", ["scrivo","scrivi","scrive","scriviamo","scrivono"], "scritto", "scriver"),
    verb("scusare", "entschuldigen", ["scuso","scusi","scusa","scusiamo","scusano"], "scusato", "scuser"),
    verb("significare", "bedeuten", ["significo","significhi","significa","significhiamo","significano"], "significato", "significher"),
    verb("sposare", "heiraten", ["sposo","sposi","sposa","sposiamo","sposano"], "sposato", "sposer"),
    verb("studiare", "lernen / studieren", ["studio","studi","studia","studiamo","studiano"], "studiato", "studier"),
    verb("suonare", "spielen / klingeln", ["suono","suoni","suona","suoniamo","suonano"], "suonato", "suoner"),
    reflexive("svegliarsi", "aufwachen", ["sveglio","svegli","sveglia","svegliamo","svegliano"], "svegliato", "sveglier"),
    verb("telefonare", "telefonieren", ["telefono","telefoni","telefona","telefoniamo","telefonano"], "telefonato", "telefoner"),
    verb("tornare", "zurückkommen", ["torno","torni","torna","torniamo","tornano"], "tornato", "torner", "essere"),
    verb("trovare", "finden", ["trovo","trovi","trova","troviamo","trovano"], "trovato", "trover"),
    verb("uscire", "hinausgehen / ausgehen", ["esco","esci","esce","usciamo","escono"], "uscito", "uscir", "essere"),
    reflexive("vedersi", "sich sehen / sich treffen", ["vedo","vedi","vede","vediamo","vedono"], "visto", "vedr"),
    verb("viaggiare", "reisen", ["viaggio","viaggi","viaggia","viaggiamo","viaggiano"], "viaggiato", "viagger"),
    verb("visitare", "besuchen / besichtigen", ["visito","visiti","visita","visitiamo","visitano"], "visitato", "visiter"),
    verb("vivere", "leben", ["vivo","vivi","vive","viviamo","vivono"], "vissuto", "vivr"),
    verb("chiedere", "fragen / bitten", ["chiedo","chiedi","chiede","chiediamo","chiedono"], "chiesto", "chieder"),
    verb("ordinare", "bestellen / ordnen", ["ordino","ordini","ordina","ordiniamo","ordinano"], "ordinato", "ordiner")
  ];

  if (D.verbs.length !== 80) throw new Error(`Erwartet: 80 Verben; erzeugt: ${D.verbs.length}.`);
})();
