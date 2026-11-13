/* ============================================================
   verbs-a1.js — 100 häufige Verben für A1 und Reisealltag
   ------------------------------------------------------------
   Jede Verbkarte enthält sechs Personen (io, tu, lui/lei, noi,
   loro, voi) in Presente, Passato prossimo und Futuro semplice.
   „voi" steht als letzte Person (Index 5), damit bestehende
   SRS-Keys stabil bleiben. Reflexive und unpersönliche Verben
   werden gesondert behandelt.
   ============================================================ */
(function () {
  "use strict";
  const D = window.IT_DATA;
  if (!D) throw new Error("IT_DATA muss vor verbs-a1.js geladen werden.");

  const AVERE = ["ho", "hai", "ha", "abbiamo", "hanno", "avete"];
  const ESSERE = ["sono", "sei", "è", "siamo", "sono", "siete"];
  const FUTURE_ENDINGS = ["ò", "ai", "à", "emo", "anno", "ete"];
  const REFLEXIVE = ["mi", "ti", "si", "ci", "si", "vi"];

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
    verb("essere", "sein", ["sono","sei","è","siamo","sono","siete"], "stato", "sar", "essere"),
    verb("avere", "haben", ["ho","hai","ha","abbiamo","hanno","avete"], "avuto", "avr"),
    verb("stare", "sein / sich befinden", ["sto","stai","sta","stiamo","stanno","state"], "stato", "star", "essere"),
    verb("andare", "gehen / fahren", ["vado","vai","va","andiamo","vanno","andate"], "andato", "andr", "essere"),
    verb("venire", "kommen", ["vengo","vieni","viene","veniamo","vengono","venite"], "venuto", "verr", "essere"),
    verb("fare", "machen / tun", ["faccio","fai","fa","facciamo","fanno","fate"], "fatto", "far"),
    verb("dare", "geben", ["do","dai","dà","diamo","danno","date"], "dato", "dar"),
    verb("dire", "sagen", ["dico","dici","dice","diciamo","dicono","dite"], "detto", "dir"),
    verb("sapere", "wissen", ["so","sai","sa","sappiamo","sanno","sapete"], "saputo", "sapr"),
    verb("volere", "wollen / möchten", ["voglio","vuoi","vuole","vogliamo","vogliono","volete"], "voluto", "vorr"),
    verb("potere", "können / dürfen", ["posso","puoi","può","possiamo","possono","potete"], "potuto", "potr"),
    verb("dovere", "müssen / sollen", ["devo","devi","deve","dobbiamo","devono","dovete"], "dovuto", "dovr"),
    verb("vedere", "sehen", ["vedo","vedi","vede","vediamo","vedono","vedete"], "visto", "vedr"),
    verb("parlare", "sprechen", ["parlo","parli","parla","parliamo","parlano","parlate"], "parlato", "parler"),
    verb("mangiare", "essen", ["mangio","mangi","mangia","mangiamo","mangiano","mangiate"], "mangiato", "manger"),
    verb("bere", "trinken", ["bevo","bevi","beve","beviamo","bevono","bevete"], "bevuto", "berr"),
    verb("comprare", "kaufen", ["compro","compri","compra","compriamo","comprano","comprate"], "comprato", "comprer"),
    verb("pagare", "bezahlen", ["pago","paghi","paga","paghiamo","pagano","pagate"], "pagato", "pagher"),
    verb("amare", "lieben / gernhaben", ["amo","ami","ama","amiamo","amano","amate"], "amato", "amer"),
    verb("arrivare", "ankommen", ["arrivo","arrivi","arriva","arriviamo","arrivano","arrivate"], "arrivato", "arriver", "essere"),
    verb("aiutare", "helfen", ["aiuto","aiuti","aiuta","aiutiamo","aiutano","aiutate"], "aiutato", "aiuter"),
    verb("restare", "bleiben", ["resto","resti","resta","restiamo","restano","restate"], "restato", "rester", "essere"),
    verb("aprire", "öffnen", ["apro","apri","apre","apriamo","aprono","aprite"], "aperto", "aprir"),
    verb("partire", "abfahren / abreisen", ["parto","parti","parte","partiamo","partono","partite"], "partito", "partir", "essere"),
    verb("abitare", "wohnen", ["abito","abiti","abita","abitiamo","abitano","abitate"], "abitato", "abiter"),
    verb("ascoltare", "zuhören / anhören", ["ascolto","ascolti","ascolta","ascoltiamo","ascoltano","ascoltate"], "ascoltato", "ascolter"),
    verb("aspettare", "warten", ["aspetto","aspetti","aspetta","aspettiamo","aspettano","aspettate"], "aspettato", "aspetter"),
    verb("ballare", "tanzen", ["ballo","balli","balla","balliamo","ballano","ballate"], "ballato", "baller"),
    verb("cambiare", "ändern / wechseln", ["cambio","cambi","cambia","cambiamo","cambiano","cambiate"], "cambiato", "cambier"),
    verb("cantare", "singen", ["canto","canti","canta","cantiamo","cantano","cantate"], "cantato", "canter"),
    verb("capire", "verstehen", ["capisco","capisci","capisce","capiamo","capiscono","capite"], "capito", "capir"),
    verb("cenare", "zu Abend essen", ["ceno","ceni","cena","ceniamo","cenano","cenate"], "cenato", "cener"),
    verb("cercare", "suchen", ["cerco","cerchi","cerca","cerchiamo","cercano","cercate"], "cercato", "cercher"),
    verb("chiamare", "rufen / anrufen", ["chiamo","chiami","chiama","chiamiamo","chiamano","chiamate"], "chiamato", "chiamer"),
    reflexive("chiamarsi", "heißen", ["chiamo","chiami","chiama","chiamiamo","chiamano","chiamate"], "chiamato", "chiamer"),
    verb("chiudere", "schließen", ["chiudo","chiudi","chiude","chiudiamo","chiudono","chiudete"], "chiuso", "chiuder"),
    verb("cominciare", "beginnen", ["comincio","cominci","comincia","cominciamo","cominciano","cominciate"], "cominciato", "comincer"),
    verb("costare", "kosten", ["costo","costi","costa","costiamo","costano","costate"], "costato", "coster", "essere", "Im Alltag wird costare meistens in der 3. Person verwendet: costa / costano."),
    verb("domandare", "fragen", ["domando","domandi","domanda","domandiamo","domandano","domandate"], "domandato", "domander"),
    verb("dormire", "schlafen", ["dormo","dormi","dorme","dormiamo","dormono","dormite"], "dormito", "dormir"),
    verb("entrare", "eintreten / hineingehen", ["entro","entri","entra","entriamo","entrano","entrate"], "entrato", "entrer", "essere"),
    verb("finire", "beenden / fertig machen", ["finisco","finisci","finisce","finiamo","finiscono","finite"], "finito", "finir", "avere", "Intransitiv steht oft essere: il film è finito."),
    verb("fumare", "rauchen", ["fumo","fumi","fuma","fumiamo","fumano","fumate"], "fumato", "fumer"),
    verb("giocare", "spielen", ["gioco","giochi","gioca","giochiamo","giocano","giocate"], "giocato", "giocher"),
    verb("guardare", "anschauen", ["guardo","guardi","guarda","guardiamo","guardano","guardate"], "guardato", "guarder"),
    verb("imparare", "lernen", ["imparo","impari","impara","impariamo","imparano","imparate"], "imparato", "imparer"),
    verb("incontrare", "treffen", ["incontro","incontri","incontra","incontriamo","incontrano","incontrate"], "incontrato", "incontrer"),
    verb("insegnare", "unterrichten", ["insegno","insegni","insegna","insegniamo","insegnano","insegnate"], "insegnato", "insegner"),
    verb("lavorare", "arbeiten", ["lavoro","lavori","lavora","lavoriamo","lavorano","lavorate"], "lavorato", "lavorer"),
    verb("leggere", "lesen", ["leggo","leggi","legge","leggiamo","leggono","leggete"], "letto", "legger"),
    verb("mettere", "stellen / legen / anziehen", ["metto","metti","mette","mettiamo","mettono","mettete"], "messo", "metter"),
    verb("morire", "sterben", ["muoio","muori","muore","moriamo","muoiono","morite"], "morto", "morir", "essere"),
    verb("nascere", "geboren werden", ["nasco","nasci","nasce","nasciamo","nascono","nascete"], "nato", "nascer", "essere"),
    verb("piacere", "gefallen", ["piaccio","piaci","piace","piacciamo","piacciono","piacete"], "piaciuto", "piacer", "essere", "Meist mit indirektem Pronomen: mi piace / mi piacciono."),
    {
      inf: "piovere", de: "regnen", impersonal: true,
      presente: [null, null, "piove", null, null, null],
      passato: [null, null, "è piovuto", null, null, null],
      futuro: [null, null, "pioverà", null, null, null],
      note: "Unpersönliches Verb: Im normalen Gebrauch steht es nur in der 3. Person Singular."
    },
    verb("portare", "bringen / tragen", ["porto","porti","porta","portiamo","portano","portate"], "portato", "porter"),
    verb("pranzare", "zu Mittag essen", ["pranzo","pranzi","pranza","pranziamo","pranzano","pranzate"], "pranzato", "pranzer"),
    verb("prendere", "nehmen", ["prendo","prendi","prende","prendiamo","prendono","prendete"], "preso", "prender"),
    verb("prenotare", "reservieren / buchen", ["prenoto","prenoti","prenota","prenotiamo","prenotano","prenotate"], "prenotato", "prenoter"),
    verb("pulire", "putzen / reinigen", ["pulisco","pulisci","pulisce","puliamo","puliscono","pulite"], "pulito", "pulir"),
    verb("ripetere", "wiederholen", ["ripeto","ripeti","ripete","ripetiamo","ripetono","ripetete"], "ripetuto", "ripeter"),
    verb("rispondere", "antworten", ["rispondo","rispondi","risponde","rispondiamo","rispondono","rispondete"], "risposto", "risponder"),
    verb("ritornare", "zurückkehren", ["ritorno","ritorni","ritorna","ritorniamo","ritornano","ritornate"], "ritornato", "ritorner", "essere"),
    verb("scrivere", "schreiben", ["scrivo","scrivi","scrive","scriviamo","scrivono","scrivete"], "scritto", "scriver"),
    verb("scusare", "entschuldigen", ["scuso","scusi","scusa","scusiamo","scusano","scusate"], "scusato", "scuser"),
    verb("significare", "bedeuten", ["significo","significhi","significa","significhiamo","significano","significate"], "significato", "significher"),
    verb("sposare", "heiraten", ["sposo","sposi","sposa","sposiamo","sposano","sposate"], "sposato", "sposer"),
    verb("studiare", "lernen / studieren", ["studio","studi","studia","studiamo","studiano","studiate"], "studiato", "studier"),
    verb("suonare", "spielen / klingeln", ["suono","suoni","suona","suoniamo","suonano","suonate"], "suonato", "suoner"),
    reflexive("svegliarsi", "aufwachen", ["sveglio","svegli","sveglia","svegliamo","svegliano","svegliate"], "svegliato", "sveglier"),
    verb("telefonare", "telefonieren", ["telefono","telefoni","telefona","telefoniamo","telefonano","telefonate"], "telefonato", "telefoner"),
    verb("tornare", "zurückkommen", ["torno","torni","torna","torniamo","tornano","tornate"], "tornato", "torner", "essere"),
    verb("trovare", "finden", ["trovo","trovi","trova","troviamo","trovano","trovate"], "trovato", "trover"),
    verb("uscire", "hinausgehen / ausgehen", ["esco","esci","esce","usciamo","escono","uscite"], "uscito", "uscir", "essere"),
    reflexive("vedersi", "sich sehen / sich treffen", ["vedo","vedi","vede","vediamo","vedono","vedete"], "visto", "vedr"),
    verb("viaggiare", "reisen", ["viaggio","viaggi","viaggia","viaggiamo","viaggiano","viaggiate"], "viaggiato", "viagger"),
    verb("visitare", "besuchen / besichtigen", ["visito","visiti","visita","visitiamo","visitano","visitate"], "visitato", "visiter"),
    verb("vivere", "leben", ["vivo","vivi","vive","viviamo","vivono","vivete"], "vissuto", "vivr"),
    verb("chiedere", "fragen / bitten", ["chiedo","chiedi","chiede","chiediamo","chiedono","chiedete"], "chiesto", "chieder"),
    verb("ordinare", "bestellen / ordnen", ["ordino","ordini","ordina","ordiniamo","ordinano","ordinate"], "ordinato", "ordiner"),
    /* Denken & Wissen */
    verb("conoscere", "kennen", ["conosco","conosci","conosce","conosciamo","conoscono","conoscete"], "conosciuto", "conoscer"),
    verb("ricordare", "sich erinnern / sich merken", ["ricordo","ricordi","ricorda","ricordiamo","ricordano","ricordate"], "ricordato", "ricorder"),
    verb("dimenticare", "vergessen", ["dimentico","dimentichi","dimentica","dimentichiamo","dimenticano","dimenticate"], "dimenticato", "dimenticher"),
    verb("pensare", "denken", ["penso","pensi","pensa","pensiamo","pensano","pensate"], "pensato", "penser"),
    verb("credere", "glauben", ["credo","credi","crede","crediamo","credono","credete"], "creduto", "creder"),
    verb("servire", "nützen / dienen", ["servo","servi","serve","serviamo","servono","servite"], "servito", "servir", "avere", "Für „brauchen“: mi serve un taxi = ich brauche ein Taxi."),
    /* Alltagsroutine (reflexiv) */
    reflexive("alzarsi", "aufstehen", ["alzo","alzi","alza","alziamo","alzano","alzate"], "alzato", "alzer"),
    reflexive("lavarsi", "sich waschen", ["lavo","lavi","lava","laviamo","lavano","lavate"], "lavato", "laver"),
    reflexive("addormentarsi", "einschlafen", ["addormento","addormenti","addormenta","addormentiamo","addormentano","addormentate"], "addormentato", "addormenter"),
    reflexive("sentirsi", "sich fühlen", ["sento","senti","sente","sentiamo","sentono","sentite"], "sentito", "sentir"),
    /* Ergänzung 2026-09: hohe Frequenz, teils bereits in Texten verwendet */
    {
      inf: "bisognare", de: "brauchen / man muss (unpersönlich)", impersonal: true,
      presente: [null, null, "bisogna", null, null, null],
      passato: [null, null, "è bisognato", null, null, null],
      futuro: [null, null, "bisognerà", null, null, null],
      note: "Unpersönlich: bisogna partire = „man muss gehen“. Für „ich brauche…“ sagt man ho bisogno di… oder mi serve…"
    },
    verb("perdere", "verlieren / verpassen", ["perdo","perdi","perde","perdiamo","perdono","perdete"], "perso", "perder"),
    verb("diventare", "werden", ["divento","diventi","diventa","diventiamo","diventano","diventate"], "diventato", "diventer", "essere"),
    verb("correre", "laufen / rennen", ["corro","corri","corre","corriamo","corrono","correte"], "corso", "correr"),
    verb("cadere", "fallen", ["cado","cadi","cade","cadiamo","cadono","cadete"], "caduto", "cadr", "essere"),
    verb("accompagnare", "begleiten", ["accompagno","accompagni","accompagna","accompagniamo","accompagnano","accompagnate"], "accompagnato", "accompagner"),
    verb("assaggiare", "kosten / probieren", ["assaggio","assaggi","assaggia","assaggiamo","assaggiano","assaggiate"], "assaggiato", "assagger"),
    verb("accendere", "anmachen / einschalten", ["accendo","accendi","accende","accendiamo","accendono","accendete"], "acceso", "accender"),
    verb("spegnere", "ausmachen / ausschalten", ["spengo","spegni","spegne","spegniamo","spengono","spegnete"], "spento", "spegner"),
    reflexive("sedersi", "sich hinsetzen", ["siedo","siedi","siede","sediamo","siedono","sedete"], "seduto", "seder")
  ];

  // Eindeutigkeit und Formen prüft tools/validate.js.
})();
