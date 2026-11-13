/* ============================================================
   verbs-a2.js — 24 zusätzliche Verben für A2
   ------------------------------------------------------------
   Ergänzt die A1-Verben (push auf D.verbs, da verbs-a1.js
   den Bestand ersetzt). Alle Formen handkuratiert; validate.js
   prüft je sechs Formen (inkl. voi) in Presente, Passato
   prossimo und Futuro semplice.
   ============================================================ */
(function () {
  "use strict";
  const D = window.IT_DATA;
  if (!D || !Array.isArray(D.verbs)) throw new Error("D.verbs muss vor verbs-a2.js existieren.");

  function verb(inf, de, presente, participle, futureStem, auxiliary = "avere", note = "") {
    return { inf, de, presente, passato: compound(participle, auxiliary), futuro: future(futureStem), note };
  }
  function compound(participle, auxiliary) {
    const AVERE = ["ho", "hai", "ha", "abbiamo", "hanno", "avete"];
    const ESSERE = ["sono", "sei", "è", "siamo", "sono", "siete"];
    const aux = auxiliary === "essere" ? ESSERE : AVERE;
    return aux.map((form, person) => auxiliary === "essere" ? `${form} ${agreed(participle, person)}` : `${form} ${participle}`);
  }
  function agreed(participle, person) {
    if (!participle.endsWith("o")) return participle;
    const stem = participle.slice(0, -1);
    return person < 3 ? `${participle}/a` : `${stem}i/e`;
  }
  function future(stem) {
    return ["ò", "ai", "à", "emo", "anno", "ete"].map((ending) => `${stem}${ending}`);
  }
  function reflexive(inf, de, basePresent, participle, futureStem, note = "") {
    const P = ["mi", "ti", "si", "ci", "si", "vi"];
    const ESSERE = ["sono", "sei", "è", "siamo", "sono", "siete"];
    return {
      inf, de,
      presente: basePresent.map((form, i) => `${P[i]} ${form}`),
      passato: ESSERE.map((form, i) => `${P[i]} ${form} ${agreed(participle, i)}`),
      futuro: future(futureStem).map((form, i) => `${P[i]} ${form}`),
      note
    };
  }

  const additions = [
    /* Meinung, Kommunikation, Alltag (piacere, prenotare, rispondere,
       ripetere und costare stehen bereits in verbs-a1.js) */
    verb("provare", "versuchen / anprobieren", ["provo","provi","prova","proviamo","provano","provate"], "provato", "prover"),
    verb("inviare", "senden / schicken", ["invio","invii","invia","inviamo","inviano","inviate"], "inviato", "invier"),
    verb("raccontare", "erzählen", ["racconto","racconti","racconta","raccontiamo","raccontano","raccontate"], "raccontato", "racconter"),
    verb("spiegare", "erklären", ["spiego","spieghi","spiega","spieghiamo","spiegano","spiegate"], "spiegato", "spiegher"),
    verb("consigliare", "empfehlen", ["consiglio","consigli","consiglia","consigliamo","consigliano","consigliate"], "consigliato", "consiglier"),
    verb("succedere", "geschehen / passieren", ["succedo","succedi","succede","succediamo","succedono","succedete"], "successo", "succeder", "essere"),
    verb("scegliere", "auswählen", ["scelgo","scegli","sceglie","scegliamo","scelgono","scegliete"], "scelto", "sceglier", "avere", "Partizip: scelto."),
    verb("salire", "steigen / einsteigen", ["salgo","sali","sale","saliamo","salgono","salite"], "salito", "salir", "essere"),
    verb("scendere", "steigen / aussteigen", ["scendo","scendi","scende","scendiamo","scendono","scendete"], "sceso", "scender", "essere"),
    verb("lasciare", "lassen / verlassen", ["lascio","lasci","lascia","lasciamo","lasciano","lasciate"], "lasciato", "lascier"),
    verb("mancare", "fehlen (mi manchi)", ["manco","manchi","manca","manciamo","mancano","mancate"], "mancato", "mancer", "avere", "Steht oft mit indirektem Pronomen: mi manchi = du fehlst mir."),
    verb("raggiungere", "erreichen", ["raggiungo","raggiungi","raggiunge","raggiungiamo","raggiungono","raggiungete"], "raggiunto", "raggiunger", "avere", "Partizip: raggiunto."),
    verb("regalare", "schenken", ["regalo","regali","regala","regaliamo","regalano","regalate"], "regalato", "regaler"),
    verb("indossare", "tragen (Kleidung)", ["indosso","indossi","indossa","indossiamo","indossano","indossate"], "indossato", "indosser"),
    verb("guidare", "fahren / lenken", ["guido","guidi","guida","guidiamo","guidano","guidate"], "guidato", "guider"),
    verb("guarire", "gesunden / heilen", ["guarisco","guarisci","guarisce","guariamo","guariscono","guarite"], "guarito", "guarir"),
    verb("noleggiare", "mieten", ["noleggio","noleggi","noleggia","noleggiamo","noleggiano","noleggiate"], "noleggiato", "nolegger"),
    /* Reflexiv */
    reflexive("accomodarsi", "Platz nehmen", ["accomodo","accomodi","accomoda","accomodiamo","accomodano","accomodate"], "accomodato", "accomoder"),
    reflexive("fermarsi", "anhalten / sich aufhalten", ["fermo","fermi","ferma","fermiamo","fermano","fermate"], "fermato", "fermer")
  ];

  const existing = new Set(D.verbs.map((v) => v.inf));
  additions.forEach((v) => {
    if (existing.has(v.inf)) throw new Error(`Doppelter A2-Infinitiv: ${v.inf}`);
    D.verbs.push(v);
  });
})();
