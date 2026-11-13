/* ============================================================
   vocabulary-b1.js — B1-Wortschatz
   ------------------------------------------------------------
   Themen für die B1-Stufe: Meinung & Diskussion, Medien,
   Umwelt, Reisen im Detail, Arbeitswelt, Stadtleben, Küche,
   Denken & Gefühlswelt. Kategorien tragen level:"B1".
   ============================================================ */
(function () {
  "use strict";
  const D = window.IT_DATA;
  if (!D || !Array.isArray(D.categories)) throw new Error("IT_DATA muss vor vocabulary-b1.js geladen werden.");

  const makeItems = (rows) => rows.map(([it, de, key]) => key ? { it, de, key } : { it, de });
  const additions = [
    {
      id: "opinioni", level: "B1", title: "Meinung & Diskussion", icon: "💭",
      items: makeItems([
        ["l'opinione", "die Meinung"], ["secondo me", "meiner Meinung nach"], ["a mio parere", "meines Erachtens"],
        ["d'accordo", "einverstanden / einig"], ["il punto di vista", "der Standpunkt"], ["probabilmente", "wahrscheinlich"],
        ["sicuramente", "sicher(lich)"], ["magari", "vielleicht / wäre schön"], ["invece", "stattdessen"],
        ["forse", "vielleicht"], ["davvero", "wirklich"], ["purtroppo", "leider"]
      ])
    },
    {
      id: "media", level: "B1", title: "Medien & Nachrichten", icon: "📰",
      items: makeItems([
        ["la notizia", "die Nachricht / Meldung"], ["il notiziario", "die Nachrichtensendung"],
        ["l'articolo", "der Artikel"], ["la rivista", "die Zeitschrift"], ["il giornalista", "der Journalist"],
        ["il telegiornale", "die Tagesschau / Nachrichten"], ["la stampa", "die Presse"],
        ["la puntata", "die Folge"], ["il podcast", "der Podcast"], ["l'edizione", "die Ausgabe"],
        ["il titolo", "der Titel / die Schlagzeile"], ["il commento", "der Kommentar"]
      ])
    },
    {
      id: "ambiente", level: "B1", title: "Umwelt & Klima", icon: "🌍",
      items: makeItems([
        ["l'ambiente", "die Umwelt"], ["l'inquinamento", "die Umweltverschmutzung"], ["la spazzatura", "der Müll"],
        ["il riciclo", "das Recycling"], ["l'energia", "die Energie"], ["il riscaldamento", "die Heizung"],
        ["la bolletta", "die Rechnung (Strom etc.)"], ["il risparmio", "die Einsparung / das Sparen"],
        ["sostenibile", "nachhaltig"], ["il cambiamento", "die Veränderung"], ["il clima", "das Klima"],
        ["la protezione", "der Schutz"]
      ])
    },
    {
      id: "viaggi2", level: "B1", title: "Flug & Fernreisen", icon: "✈️",
      items: makeItems([
        ["il volo", "der Flug"], ["l'imbarco", "das Boarding"], ["lo scalo", "der Zwischenstopp"],
        ["la classe", "die Klasse"], ["il bagaglio a mano", "das Handgepäck"], ["la dogana", "der Zoll"],
        ["la frontiera", "die Grenze"], ["la destinazione", "das Reiseziel"], ["l'itinerario", "die Reiseroute"],
        ["la conferma", "die Bestätigung"]
      ])
    },
    {
      id: "lavoro3", level: "B1", title: "Karriere & Projekte", icon: "📊",
      items: makeItems([
        ["la posizione", "die Position / Stelle"], ["il ruolo", "die Rolle"], ["le competenze", "die Kompetenzen"],
        ["la formazione", "die Ausbildung / Weiterbildung"], ["la laurea", "das (Hochschul-)Diplom"],
        ["il stage", "das Praktikum"], ["la carriera", "die Karriere"], ["il successo", "der Erfolg"],
        ["la sfida", "die Herausforderung"], ["il progetto", "das Projekt"], ["il cliente", "der Kunde"],
        ["la riunione", "die Besprechung"]
      ])
    },
    {
      id: "citta3", level: "B1", title: "Stadtleben", icon: "🚦",
      items: makeItems([
        ["il traffico", "der Verkehr"], ["il semaforo", "die Ampel"], ["l'incrocio", "die Kreuzung"],
        ["la zona pedonale", "die Fußgängerzone"], ["la metropolitana", "die U-Bahn"],
        ["il centro storico", "die Altstadt"], ["il monumento", "das Denkmal"], ["la folla", "die Menschenmenge"],
        ["la serata", "der Abend (Veranstaltung)"], ["il quartiere", "das Viertel"], ["la periferia", "der Stadtrand"]
      ])
    },
    {
      id: "cucina2", level: "B1", title: "Küche & Rezepte", icon: "🍳",
      items: makeItems([
        ["l'ingrediente", "die Zutat"], ["il piatto", "der Teller / das Gericht"], ["la cottura", "das Garen / die Garzeit"],
        ["il forno", "der Backofen"], ["la padella", "die Pfanne"], ["il grammo", "das Gramm"],
        ["il litro", "der Liter"], ["la scatola", "die Dose / Schachtel"], ["il barattolo", "das Glas (Einmachglas)"],
        ["il sapore", "der Geschmack"], ["piccante", "scharf / würzig"], ["fresco", "frisch"]
      ])
    },
    {
      id: "mente", level: "B1", title: "Denken & Gefühlswelt", icon: "💡",
      items: makeItems([
        ["il dubbio", "der Zweifel"], ["la certezza", "die Gewissheit"], ["la speranza", "die Hoffnung"],
        ["il desiderio", "der Wunsch"], ["il problema", "das Problem"], ["la soluzione", "die Lösung"],
        ["l'ipotesi", "die Vermutung / Hypothese"], ["la possibilità", "die Möglichkeit"],
        ["anche se", "auch wenn"], ["nonostante", "trotz / obwohl"], ["nel caso", "im Fall (dass)"], ["tuttavia", "jedoch / dennoch"]
      ])
    }
  ];

  const seen = new Set(D.categories.flatMap((category) => category.items.map((item) => item.it.trim().toLocaleLowerCase("it"))));
  let added = 0;
  additions.forEach((category) => {
    category.items.forEach((item) => {
      const normalized = item.it.trim().toLocaleLowerCase("it");
      if (seen.has(normalized)) throw new Error(`Doppelter B1-Wortschatzeintrag: ${item.it}`);
      seen.add(normalized);
      added++;
    });
    D.categories.push(category);
  });
})();
