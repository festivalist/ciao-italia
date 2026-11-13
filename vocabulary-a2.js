/* ============================================================
   vocabulary-a2.js — A2-Wortschatz
   ------------------------------------------------------------
   Ergänzt den A1-Bestand um A2-Themen: Emotionen, Gesundheit,
   Wetter, Verkehrsdetails, Post & Bank, Ausgehen, Wohnen,
   Arbeitswelt, Kommunikation, Erzählen, Kleidungs-Details.
   Jede Kategorie trägt level:"A2" — validate.js erzwingt, dass
   nur Stories desselben Levels die Kategorie abdecken.
   ============================================================ */
(function () {
  "use strict";
  const D = window.IT_DATA;
  if (!D || !Array.isArray(D.categories)) throw new Error("IT_DATA muss vor vocabulary-a2.js geladen werden.");

  const makeItems = (rows) => rows.map(([it, de, key]) => key ? { it, de, key } : { it, de });
  const additions = [
    {
      id: "emozioni", level: "A2", title: "Emotionen & Charakter", icon: "😠",
      items: makeItems([
        ["arrabbiato", "verärgert / wütend"], ["triste", "traurig"], ["nervoso", "nervös"],
        ["tranquillo", "ruhig / gelassen"], ["preoccupato", "besorgt"], ["sorpreso", "überrascht"],
        ["innamorato", "verliebt"], ["timido", "schüchtern"], ["generoso", "großzügig"],
        ["pigro", "faul"], ["curioso", "neugierig"], ["forte", "stark"],
        ["debole", "schwach"], ["serio", "ernst / seriös"], ["disponibile", "verfügbar / hilfsbereit"],
        ["pazzo", "verrückt"]
      ])
    },
    {
      id: "salute2", level: "A2", title: "Gesundheit & Arzt", icon: "🌡️",
      items: makeItems([
        ["la febbre", "das Fieber"], ["la tosse", "der Husten"], ["il raffreddore", "die Erkältung"],
        ["l'influenza", "die Grippe"], ["la ricetta", "das Rezept"], ["il pronto soccorso", "die Notaufnahme"],
        ["l'ambulanza", "der Krankenwagen"], ["il farmacista", "der Apotheker"],
        ["la pillola", "die Pille / Tablette"], ["sano", "gesund"], ["ferito", "verletzt"],
        ["la visita", "die (ärztliche) Untersuchung"], ["la salute", "die Gesundheit"], ["la tisana", "der Kräutertee"]
      ])
    },
    {
      id: "tempo2", level: "A2", title: "Wetter vertieft", icon: "⛈️",
      items: makeItems([
        ["la temperatura", "die Temperatur"], ["la nebbia", "der Nebel"], ["il tuono", "der Donner"],
        ["il fulmine", "der Blitz"], ["l'arcobaleno", "der Regenbogen"], ["il ghiaccio", "das Eis"],
        ["mite", "mild"], ["afoso", "schwül"], ["umido", "feucht / schwül"],
        ["secco", "trocken"], ["il grado", "das Grad"], ["la previsione", "die Wettervorhersage"]
      ])
    },
    {
      id: "trasporti2", level: "A2", title: "Unterwegs: Details", icon: "🛤️",
      items: makeItems([
        ["il ritardo", "die Verspätung"], ["il binario", "das Gleis"], ["la coincidenza", "der Anschluss"],
        ["il cambio", "das Umsteigen / Wechseln"], ["diretto", "direkt / durchgehend"],
        ["in orario", "pünktlich"], ["il controllore", "der Schaffner"], ["la multa", "das Bußgeld / der Strafzettel"],
        ["il controllo", "die Kontrolle"], ["il trasporto", "das Verkehrsmittel / der Transport"],
        ["il passeggero", "der Passagier"], ["la funivia", "die Seilbahn"]
      ])
    },
    {
      id: "servizi", level: "A2", title: "Post & Bank", icon: "📮",
      items: makeItems([
        ["il francobollo", "die Briefmarke"], ["la busta", "der Briefumschlag"], ["il pacco", "das Paket"],
        ["il modulo", "das Formular"], ["la fila", "die Schlange"], ["il bancomat", "der Geldautomat"],
        ["il prelievo", "die Abhebung"], ["il bonifico", "die Überweisung"], ["i contanti", "das Bargeld"],
        ["lo sportello", "der Schalter"], ["la carta d'identità", "der Personalausweis"], ["la firma", "die Unterschrift"]
      ])
    },
    {
      id: "uscire", level: "A2", title: "Ausgehen & Menü", icon: "🍽️",
      items: makeItems([
        ["il coperto", "das Gedeck / Covercharge"], ["il cameriere", "der Kellner"], ["la cameriera", "die Kellnerin"],
        ["l'antipasto", "die Vorspeise"], ["il primo", "der erste Gang (Pasta/Reis)"],
        ["il secondo", "der zweite Gang (Fleisch/Fisch)"], ["il contorno", "die Beilage"],
        ["la specialità", "die Spezialität"], ["al dente", "al dente"], ["ben cotto", "durchgebraten / wohlgekocht"],
        ["la porzione", "die Portion"], ["il vino della casa", "der Hauswein"]
      ])
    },
    {
      id: "abitare", level: "A2", title: "Wohnen & Nachbarschaft", icon: "🔑",
      items: makeItems([
        ["l'affitto", "die Miete"], ["il contratto", "der Vertrag"], ["la cauzione", "die Kaution"],
        ["ammobiliato", "möbliert"], ["il monolocale", "das Einzimmerapartment"], ["il vicino", "der Nachbar"],
        ["il citofono", "die Gegensprechanlage"], ["il portone", "das Haustor"], ["la zona", "das Viertel / die Zone"],
        ["il rumore", "der Lärm / das Geräusch"], ["silenzioso", "leise / ruhig"], ["la spesa", "der Einkauf / die Ausgabe"]
      ])
    },
    {
      id: "lavoro2", level: "A2", title: "Bewerbung & Arbeitswelt", icon: "📑",
      items: makeItems([
        ["lo stipendio", "das Gehalt"], ["il turno", "die Schicht / der Turnus"], ["il curriculum", "der Lebenslauf"],
        ["il colloquio", "das Vorstellungsgespräch"], ["l'esperienza", "die Erfahrung"], ["la ditta", "die Firma"],
        ["il datore di lavoro", "der Arbeitgeber"], ["la feria", "der Urlaubstag"], ["lo sciopero", "der Streik"],
        ["la tesi", "die Abschlussarbeit / These"], ["l'azienda", "der Betrieb"], ["la paga", "der Lohn"]
      ])
    },
    {
      id: "comunicare", level: "A2", title: "Telefon & Nachrichten", icon: "📱",
      items: makeItems([
        ["il messaggio", "die Nachricht"], ["la chiamata", "der Anruf"], ["la suoneria", "der Klingelton"],
        ["la segreteria", "der Anrufbeantworter"], ["l'impegno", "die Verpflichtung / der Termin"],
        ["la linea", "die Leitung"], ["il segnale", "das Signal"], ["occupato", "besetzt / belegt"],
        ["la rete", "das Netz"], ["il codice", "der Code"], ["la videochiamata", "der Videoanruf"], ["la chat", "der Chat"]
      ])
    },
    {
      id: "racconto", level: "A2", title: "Erzählen & Erinnerung", icon: "📖",
      items: makeItems([
        ["il ricordo", "die Erinnerung"], ["l'infanzia", "die Kindheit"], ["una volta", "einmal / früher"],
        ["di solito", "gewöhnlich"], ["ogni tanto", "ab und zu"], ["all'epoca", "damals"],
        ["il passato", "die Vergangenheit"], ["l'abitudine", "die Gewohnheit"], ["il futuro", "die Zukunft"],
        ["la storia", "die Geschichte / Geschichte (Fach)"]
      ])
    },
    {
      id: "abiti2", level: "A2", title: "Kleidung im Detail", icon: "🧣",
      items: makeItems([
        ["comodo", "bequem"], ["elegante", "elegant"], ["sportivo", "sportlich"],
        ["di lana", "aus Wolle"], ["di cotone", "aus Baumwolle"], ["la cintura", "der Gürtel"],
        ["i guanti", "die Handschuhe"], ["la sciarpa", "der Schal"], ["il bottone", "der Knopf"], ["la tasca", "die Tasche (Kleidung)"]
      ])
    }
  ];

  const seen = new Set(D.categories.flatMap((category) => category.items.map((item) => item.it.trim().toLocaleLowerCase("it"))));
  let added = 0;
  additions.forEach((category) => {
    category.items.forEach((item) => {
      const normalized = item.it.trim().toLocaleLowerCase("it");
      if (seen.has(normalized)) throw new Error(`Doppelter A2-Wortschatzeintrag: ${item.it}`);
      seen.add(normalized);
      added++;
    });
    D.categories.push(category);
  });
  // Nur Dubletten sind verboten; Konsistenz prüft tools/validate.js.
})();
