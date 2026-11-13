/* ============================================================
   verbs-b1.js — 16 zusätzliche Verben für B1
   ------------------------------------------------------------
   Fokus: Meinung (sembrare, sostenere), Umwelt (ridurre,
   proteggere, inquinare, riciclare), Medien (pubblicare) und
   Diskussionsverben. Alle Formen handkuratiert.
   ============================================================ */
(function () {
  "use strict";
  const D = window.IT_DATA;
  if (!D || !Array.isArray(D.verbs)) throw new Error("D.verbs muss vor verbs-b1.js existieren.");

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

  const additions = [
    verb("sperare", "hoffen", ["spero","speri","spera","speriamo","sperano","sperate"], "sperato", "sperer", "avere", "Oft mit di + Infinitiv: spero di venire."),
    verb("dubitare", "zweifeln", ["dubito","dubiti","dubita","dubitiamo","dubitano","dubitate"], "dubitato", "dubiter", "avere", "Mit congiuntivo: dubito che sia vero."),
    verb("evitare", "vermeiden", ["evito","eviti","evita","evitiamo","evitano","evitate"], "evitato", "eviter"),
    verb("suggerire", "vorschlagen", ["suggerisco","suggerisci","suggerisce","suggeriamo","suggeriscono","suggerite"], "suggerito", "suggerir"),
    verb("permettere", "erlauben", ["permetto","permetti","permette","permettiamo","permettono","permettete"], "permesso", "permetter", "avere", "Partizip: permesso."),
    verb("vietare", "verbieten", ["vieto","vieti","vieta","vietiamo","vietano","vietate"], "vietato", "vieter"),
    verb("ridurre", "verringern / reduzieren", ["riduco","riduci","riduce","riduciamo","riducono","riducete"], "ridotto", "riducer", "avere", "Partizip: ridotto."),
    verb("aumentare", "steigen / erhöhen", ["aumento","aumenti","aumenta","aumentiamo","aumentano","aumentate"], "aumentato", "aumenter"),
    verb("proteggere", "schützen", ["proteggo","proteggi","protegge","proteggiamo","proteggono","proteggete"], "protetto", "protegger", "avere", "Partizip: protetto."),
    verb("inquinare", "verschmutzen", ["inquino","inquini","inquina","inquiniamo","inquinano","inquinate"], "inquinato", "inquiner"),
    verb("riciclare", "recyceln", ["riciclo","ricicli","ricicla","ricicliamo","riciclano","riciclate"], "riciclato", "ricicler"),
    verb("pubblicare", "veröffentlichen", ["pubblico","pubblichi","pubblica","pubblichiamo","pubblicano","pubblicate"], "pubblicato", "pubblicher"),
    verb("sembrare", "scheinen", ["sembro","sembri","sembra","sembriamo","sembrano","sembrate"], "sembrato", "sembrer"),
    verb("sostenere", "behaupten / unterstützen", ["sostengo","sostieni","sostiene","sosteniamo","sostengono","sostenete"], "sostenuto", "sostener", "avere", "Partizip: sostenuto."),
    verb("organizzare", "organisieren", ["organizzo","organizzi","organizza","organizziamo","organizzano","organizzate"], "organizzato", "organizzer"),
    verb("partecipare", "teilnehmen", ["partecipo","partecipi","partecipa","partecipiamo","partecipano","partecipate"], "partecipato", "parteciper")
  ];

  const existing = new Set(D.verbs.map((v) => v.inf));
  additions.forEach((v) => {
    if (existing.has(v.inf)) throw new Error(`Doppelter B1-Infinitiv: ${v.inf}`);
    D.verbs.push(v);
  });
})();
