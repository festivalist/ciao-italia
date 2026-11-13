/* ============================================================
   vocabulary-a1.js — Ausbau auf 605 A1-Wortschatzkarten
   ------------------------------------------------------------
   Grundlage: A1-Liste des „Profilo della lingua italiana“
   (Università per Stranieri di Perugia), ergänzt um unmittelbar
   nützliche Reise- und Alltagswörter. Die 153 bestehenden Karten
   bleiben erhalten; diese Datei fügt genau 406 neue Karten hinzu
   (347 Grundausbau + 59 Ergänzung September 2026).
   ============================================================ */
(function () {
  "use strict";
  const D = window.IT_DATA;
  if (!D || !Array.isArray(D.categories)) throw new Error("IT_DATA muss vor vocabulary-a1.js geladen werden.");

  const makeItems = (rows) => rows.map(([it, de, key]) => key ? { it, de, key } : { it, de });
  const additions = [
    {
      id: "famiglia", title: "Familie & Beziehungen", icon: "👨‍👩‍👧",
      items: makeItems([
        ["madre", "Mutter"], ["padre", "Vater"], ["mamma", "Mama"], ["papà", "Papa"],
        ["figlio", "Sohn"], ["figlia", "Tochter"], ["fratello", "Bruder"], ["sorella", "Schwester"],
        ["marito", "Ehemann"], ["moglie", "Ehefrau"], ["nonno", "Großvater"], ["nonna", "Großmutter"],
        ["bambino", "Junge / Kind"], ["bambina", "Mädchen / Kind"], ["ragazzo", "Junge / junger Mann"],
        ["ragazza", "Mädchen / junge Frau"], ["signore", "Herr"], ["signora", "Frau / Dame"],
        ["compagno", "Partner / Mitschüler"], ["compagna", "Partnerin / Mitschülerin"],
        ["nome", "Vorname / Name"], ["cognome", "Nachname"], ["nazionalità", "Nationalität"],
        ["amore", "Liebe"], ["persona", "Person"],
        ["zio", "Onkel"], ["zia", "Tante"], ["cugino", "Cousin"], ["cugina", "Cousine"]
      ])
    },
    {
      id: "casa", title: "Haus & Gegenstände", icon: "🏠",
      items: makeItems([
        ["casa", "Haus / Zuhause"], ["appartamento", "Wohnung"], ["camera", "Zimmer"],
        ["cucina", "Küche"], ["soggiorno", "Wohnzimmer / Aufenthalt"], ["giardino", "Garten"],
        ["porta", "Tür"], ["finestra", "Fenster"], ["letto", "Bett"], ["tavolo", "Tisch"],
        ["sedia", "Stuhl"], ["doccia", "Dusche"], ["quadro", "Bild / Gemälde"], ["pianta", "Pflanze"],
        ["piano", "Stockwerk / Etage"], ["posto", "Platz"], ["bicchiere", "Glas"],
        ["bottiglia", "Flasche"], ["forchetta", "Gabel"], ["coltello", "Messer"],
        ["cucchiaio", "Löffel"], ["orologio", "Uhr"], ["televisione", "Fernseher / Fernsehen"],
        ["radio", "Radio"], ["computer", "Computer"],
        ["armadio", "Schrank"], ["divano", "Sofa"], ["specchio", "Spiegel"], ["asciugamano", "Handtuch"]
      ])
    },
    {
      id: "corpo", title: "Körper & Befinden", icon: "🫀",
      items: makeItems([
        ["testa", "Kopf"], ["viso", "Gesicht"], ["occhio", "Auge"], ["orecchio", "Ohr"],
        ["naso", "Nase"], ["bocca", "Mund"], ["dente", "Zahn"], ["gola", "Hals / Kehle"],
        ["braccio", "Arm"], ["mano", "Hand"], ["dito", "Finger"], ["schiena", "Rücken"],
        ["stomaco", "Magen"], ["gamba", "Bein"], ["ginocchio", "Knie"], ["piede", "Fuß"],
        ["fame", "Hunger"], ["sete", "Durst"], ["sonno", "Müdigkeit / Schlaf"], ["medicina", "Medizin"],
        ["avere bisogno di", "brauchen"], ["raffreddore", "Erkältung"], ["febbre", "Fieber"],
        ["mal di testa", "Kopfschmerzen"], ["mal di pancia", "Bauchschmerzen"],
        ["tosse", "Husten"], ["ricetta", "Rezept (ärztlich)"]
      ])
    },
    {
      id: "abbigliamento", title: "Kleidung & Aussehen", icon: "👕",
      items: makeItems([
        ["vestito", "Kleid / Anzug"], ["camicia", "Hemd / Bluse"], ["maglietta", "T-Shirt"],
        ["maglione", "Pullover"], ["giacca", "Jacke"], ["cappotto", "Mantel"],
        ["pantaloni", "Hose"], ["gonna", "Rock"], ["calza", "Socke / Strumpf"], ["scarpa", "Schuh"],
        ["occhiali", "Brille"], ["borsa", "Tasche"], ["ombrello", "Regenschirm"],
        ["capello", "Haar"], ["biondo", "blond"], ["castano", "braunhaarig / kastanienbraun"],
        ["magro", "schlank / dünn"], ["alto", "groß / hoch"], ["basso", "klein / niedrig"],
        ["taglia", "Kleidergröße"],
        ["cappello", "Hut"], ["sciarpa", "Schal"], ["guanto", "Handschuh"], ["vestiti", "Kleidung"]
      ])
    },
    {
      id: "scuola", title: "Schule & Sprache", icon: "📚",
      items: makeItems([
        ["scuola", "Schule"], ["università", "Universität"], ["classe", "Klasse"], ["corso", "Kurs"],
        ["lezione", "Unterrichtsstunde"], ["esercizio", "Übung"], ["domanda", "Frage"],
        ["risposta", "Antwort"], ["parola", "Wort"], ["lingua", "Sprache"], ["italiano", "Italienisch / Italiener"],
        ["tedesco", "Deutsch / Deutscher"], ["inglese", "Englisch / Engländer"], ["alfabeto", "Alphabet"],
        ["libro", "Buch"], ["quaderno", "Heft"], ["penna", "Kugelschreiber / Stift"], ["matita", "Bleistift"],
        ["lettera", "Brief / Buchstabe"], ["insegnante", "Lehrer/in"], ["professore", "Lehrer / Professor"],
        ["professoressa", "Lehrerin / Professorin"], ["studente", "Student / Schüler"],
        ["studentessa", "Studentin / Schülerin"], ["compito", "Aufgabe / Hausaufgabe"],
        ["dizionario", "Wörterbuch"]
      ])
    },
    {
      id: "lavoro", title: "Arbeit & Technik", icon: "💻",
      items: makeItems([
        ["lavoro", "Arbeit"], ["ufficio", "Büro"], ["fabbrica", "Fabrik"], ["industria", "Industrie"],
        ["capo", "Chef / Leiter"], ["impiegato", "Angestellter"], ["impiegata", "Angestellte"],
        ["appuntamento", "Termin / Verabredung"], ["documento", "Dokument / Ausweis"], ["indirizzo", "Adresse"],
        ["e-mail", "E-Mail"], ["telefono", "Telefon"], ["cellulare", "Handy"], ["internet", "Internet"],
        ["fax", "Fax"], ["giornale", "Zeitung"], ["fotografia", "Fotografie"],
        ["informazione", "Information / Auskunft"], ["orario", "Öffnungszeit / Fahrplan" ],
        ["firma", "Unterschrift"]
      ])
    },
    {
      id: "citta", title: "Stadt & öffentliche Orte", icon: "🏛️",
      items: makeItems([
        ["città", "Stadt"], ["centro", "Zentrum"], ["piazza", "Platz"], ["via", "Straße / Weg"],
        ["chiesa", "Kirche"], ["museo", "Museum"], ["teatro", "Theater"], ["cinema", "Kino"],
        ["parco", "Park"], ["banca", "Bank"], ["posta", "Post"], ["ambasciata", "Botschaft"],
        ["consolato", "Konsulat"], ["segreteria", "Sekretariat"], ["supermercato", "Supermarkt"],
        ["bar", "Café / Bar"], ["ristorante", "Restaurant"], ["pizzeria", "Pizzeria"],
        ["parcheggio", "Parkplatz"], ["biblioteca", "Bibliothek"],
        ["duomo", "Dom"], ["isola", "Insel"], ["fiume", "Fluss"], ["porto", "Hafen"],
        ["trattoria", "Gasthaus / einfaches Restaurant"]
      ])
    },
    {
      id: "natura", title: "Natur & Wetter", icon: "☀️",
      items: makeItems([
        ["sole", "Sonne"], ["pioggia", "Regen"], ["neve", "Schnee"], ["vento", "Wind"],
        ["nuvola", "Wolke"], ["cielo", "Himmel"], ["tempo", "Wetter / Zeit"], ["primavera", "Frühling"],
        ["estate", "Sommer"], ["autunno", "Herbst"], ["inverno", "Winter"], ["mare", "Meer"],
        ["lago", "See"], ["montagna", "Berg / Gebirge"], ["campagna", "Land / Landschaft"],
        ["albero", "Baum"], ["fiore", "Blume"], ["animale", "Tier"], ["cane", "Hund"], ["gatto", "Katze"],
        ["luce", "Licht"]
      ])
    },
    {
      id: "calendario", title: "Kalender & Tageszeiten", icon: "📅",
      items: makeItems([
        ["gennaio", "Januar"], ["febbraio", "Februar"], ["marzo", "März"], ["aprile", "April"],
        ["maggio", "Mai"], ["giugno", "Juni"], ["luglio", "Juli"], ["agosto", "August"],
        ["settembre", "September"], ["ottobre", "Oktober"], ["novembre", "November"], ["dicembre", "Dezember"],
        ["anno", "Jahr"], ["mese", "Monat"], ["mattina", "Morgen / Vormittag"], ["pomeriggio", "Nachmittag"],
        ["sera", "Abend"], ["notte", "Nacht"], ["mezzogiorno", "Mittag"], ["mezzanotte", "Mitternacht"],
        ["minuto", "Minute"], ["momento", "Moment"], ["data", "Datum"], ["Natale", "Weihnachten"], ["Pasqua", "Ostern"],
        ["fine settimana", "Wochenende"]
      ])
    },
    {
      id: "numeri_estesi", title: "Weitere Zahlen & Mengen", icon: "➕",
      items: makeItems([
        ["undici", "elf"], ["dodici", "zwölf"], ["tredici", "dreizehn"], ["quattordici", "vierzehn"],
        ["quindici", "fünfzehn"], ["sedici", "sechzehn"], ["diciassette", "siebzehn"],
        ["diciotto", "achtzehn"], ["diciannove", "neunzehn"], ["trenta", "dreißig"], ["quaranta", "vierzig"],
        ["cinquanta", "fünfzig"], ["sessanta", "sechzig"], ["settanta", "siebzig"], ["ottanta", "achtzig"],
        ["novanta", "neunzig"], ["primo", "erste/r/s"], ["secondo", "zweite/r/s"], ["terzo", "dritte/r/s"],
        ["quarto", "vierte/r/s / Viertel"], ["metà", "Hälfte"], ["doppio", "doppelt"],
        ["singolo", "einzeln / Einzel-"], ["numero", "Nummer / Zahl"], ["paio", "Paar"]
      ])
    },
    {
      id: "tempo_libero", title: "Freizeit & Kultur", icon: "🎭",
      items: makeItems([
        ["hobby", "Hobby"], ["arte", "Kunst"], ["musica", "Musik"], ["canzone", "Lied"],
        ["film", "Film"], ["sport", "Sport"], ["calcio", "Fußball"], ["gioco", "Spiel"],
        ["festa", "Fest / Feier"], ["compleanno", "Geburtstag"], ["augurio", "Glückwunsch / Wunsch"],
        ["bacio", "Kuss"], ["cin cin", "Prost!"],
        ["gita", "Ausflug"], ["mostra", "Ausstellung"]
      ])
    },
    {
      id: "parole_funzione", title: "Verbindungs- & Fragewörter", icon: "🔗",
      items: makeItems([
        ["e", "und"], ["o", "oder"], ["ma", "aber"], ["anche", "auch"], ["con", "mit"],
        ["senza", "ohne"], ["per", "für / um zu"], ["di", "von / aus"], ["a", "an / nach / zu"],
        ["in", "in / nach"], ["su", "auf / über"], ["che", "dass / der, die, das"], ["chi", "wer"],
        ["come", "wie"], ["quando", "wann / als"], ["perché", "warum / weil"], ["quale", "welche/r/s"],
        ["quanto", "wie viel"], ["più", "mehr"], ["meno", "weniger"], ["tanto", "viel / so sehr"],
        ["troppo", "zu viel / zu"], ["tutto", "alles / ganz"], ["nessuno", "niemand / kein"], ["niente", "nichts"],
        ["allora", "dann / also / nun"], ["certo", "natürlich / sicher"],
        ["va bene", "in Ordnung / okay"], ["peccato", "schade"]
      ])
    },
    {
      id: "articoli_pronomi", title: "Artikel & kleine Pronomen", icon: "🧩",
      items: makeItems([
        ["il", "der (m.)"], ["lo", "der (m., vor s+Konsonant/z)"], ["la", "die (w.)"],
        ["i", "die (m. Pl.)"], ["gli", "die (m. Pl., Sonderform) / ihm"], ["le", "die (w. Pl.) / ihr"],
        ["un / uno / una", "ein / eine"], ["nostro", "unser"], ["vostro", "euer / Ihr"], ["voi", "ihr / Sie (Plural)"],
        ["me", "mich / mir"], ["te", "dich / dir"], ["mi", "mir / mich"], ["ti", "dir / dich"],
        ["ci", "uns / dort"], ["si", "sich / man"], ["mio", "mein"], ["tuo", "dein"],
        ["questo", "dieser / dieses"], ["quello", "jener / das dort"],
        ["suo", "sein / ihr (Possessiv)"]
      ])
    },
    {
      id: "aggettivi_a1", title: "Weitere Eigenschaften", icon: "🎨",
      items: makeItems([
        ["giovane", "jung"], ["vecchio", "alt"], ["bravo", "gut / tüchtig"], ["facile", "einfach"],
        ["difficile", "schwierig"], ["falso", "falsch"], ["felice", "glücklich"], ["gentile", "freundlich"],
        ["importante", "wichtig"], ["intelligente", "intelligent"], ["interessante", "interessant"],
        ["lungo", "lang"], ["corto", "kurz"], ["largo", "breit / weit"], ["ricco", "reich"],
        ["simpatico", "sympathisch"], ["stanco", "müde"], ["straniero", "ausländisch / Ausländer"],
        ["stretto", "eng / schmal"], ["vero", "wahr / echt"], ["contento", "zufrieden / froh"],
        ["libero", "frei"], ["malato", "krank"], ["sporco", "schmutzig"],
        ["pulito", "sauber"], ["pronto", "bereit / fertig"], ["sicuro", "sicher"],
        ["pericoloso", "gefährlich"], ["noioso", "langweilig"], ["divertente", "lustig / unterhaltsam"]
      ])
    },
    {
      id: "avverbi_a1", title: "Zeit, Ort & Häufigkeit", icon: "↔️",
      items: makeItems([
        ["prima", "vorher / zuerst"], ["poi", "dann / danach"], ["già", "schon"], ["sempre", "immer"],
        ["mai", "nie / jemals"], ["presto", "früh / bald"], ["tardi", "spät"], ["spesso", "oft"],
        ["qua", "hier"], ["là", "dort"], ["sopra", "oben / über"], ["sotto", "unten / unter"],
        ["dentro", "drinnen / hinein"], ["fuori", "draußen / hinaus"], ["davanti", "vorne / vor"],
        ["dietro", "hinten / hinter"], ["avanti", "vorwärts / weiter"], ["indietro", "zurück"],
        ["giù", "unten / hinunter"], ["quasi", "fast"],
        ["subito", "sofort"], ["ancora", "noch / wieder"],
        ["insieme", "gemeinsam / zusammen"], ["lentamente", "langsam"]
      ])
    },
    {
      id: "cibo_a1", title: "Weitere Lebensmittel", icon: "🍕",
      items: makeItems([
        ["pasta", "Nudeln / Pasta"], ["riso", "Reis"], ["spaghetti", "Spaghetti"], ["pizza", "Pizza"],
        ["uovo", "Ei"], ["verdura", "Gemüse"], ["pomodoro", "Tomate"], ["olio", "Öl"],
        ["aceto", "Essig"], ["pepe", "Pfeffer"], ["zucchero", "Zucker"],
        ["insalata", "Salat"], ["patata", "Kartoffel"], ["aglio", "Knoblauch"],
        ["cipolla", "Zwiebel"], ["pollo", "Hähnchen"], ["limone", "Zitrone"],
        ["tovagliolo", "Serviette"], ["panino", "belegtes Brötchen"]
      ])
    },
    {
      id: "viaggio_a1", title: "Weitere Reisewörter", icon: "🧳",
      items: makeItems([
        ["passaporto", "Reisepass"], ["visto", "Visum"], ["zaino", "Rucksack"], ["check-in", "Check-in"],
        ["agenzia", "Agentur / Reisebüro"], ["vacanza", "Urlaub"], ["turista", "Tourist/in"],
        ["viaggio", "Reise"], ["moto", "Motorrad"], ["bicicletta", "Fahrrad"],
        ["partenza", "Abfahrt"], ["arrivo", "Ankunft"],
        ["binario", "Gleis / Bahnsteig"], ["biglietteria", "Fahrkartenschalter"]
      ])
    },
    {
      id: "colori", title: "Farben", icon: "🎨",
      items: makeItems([
        ["rosso", "rot"], ["blu", "blau"], ["verde", "grün"], ["giallo", "gelb"],
        ["nero", "schwarz"], ["bianco", "weiß"], ["grigio", "grau"], ["arancione", "orange"],
        ["rosa", "rosa"], ["viola", "lila / violett"], ["chiaro", "hell"], ["scuro", "dunkel"],
        ["azzurro", "hellblau"]
      ])
    },
    {
      id: "animali", title: "Tiere", icon: "🐴",
      items: makeItems([
        ["cavallo", "Pferd"], ["uccello", "Vogel"], ["mucca", "Kuh"], ["coniglio", "Kaninchen"],
        ["pecora", "Schaf"], ["capra", "Ziege"], ["anatra", "Ente"], ["ape", "Biene"],
        ["farfalla", "Schmetterling"], ["topo", "Maus"], ["orso", "Bär"], ["leone", "Löwe"],
        ["tigre", "Tiger"], ["elefante", "Elefant"]
      ])
    },
    {
      id: "paesi", title: "Länder & Städte", icon: "🌍",
      items: makeItems([
        ["l'Italia", "Italien"], ["la Germania", "Deutschland"], ["la Francia", "Frankreich"],
        ["la Spagna", "Spanien"], ["l'Inghilterra", "England"], ["l'Austria", "Österreich"],
        ["la Svizzera", "die Schweiz"], ["l'Europa", "Europa"],
        ["Roma", "Rom"], ["Venezia", "Venedig"], ["Firenze", "Florenz"], ["Napoli", "Neapel"]
      ])
    },
    {
      id: "uhrzeit", title: "Uhrzeit & Dauer", icon: "⏰",
      items: makeItems([
        ["che ora è?", "wie viel Uhr ist es?"], ["che ore sono?", "wie viel Uhr ist es? (Pluralform)"],
        ["è presto", "es ist früh"], ["è tardi", "es ist spät"],
        ["a mezzogiorno", "um Mittag"], ["a mezzanotte", "um Mitternacht"],
        ["mezz'ora", "eine halbe Stunde"], ["un quarto d'ora", "ein Viertelstündchen"],
        ["in ritardo", "verspätet / in Verspätung"]
      ])
    }
  ];

  const seen = new Set(D.categories.flatMap((category) => category.items.map((item) => item.it.trim().toLocaleLowerCase("it"))));
  let added = 0;
  additions.forEach((category) => {
    category.items.forEach((item) => {
      const normalized = item.it.trim().toLocaleLowerCase("it");
      if (seen.has(normalized)) throw new Error(`Doppelter A1-Wortschatzeintrag: ${item.it}`);
      seen.add(normalized);
      added++;
    });
    D.categories.push(category);
  });

  // Der Bestand darf wachsen — nur Dubletten bleiben verboten
  // (Konsistenz wird von tools/validate.js geprüft).
})();
