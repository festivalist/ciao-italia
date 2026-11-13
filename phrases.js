/* ============================================================
   phrases.js — Häufige Redewendungen (Modi di dire)
   ------------------------------------------------------------
   Eigenständiger Bestand NEBEN dem Vokabular (window.IT_PHRASES,
   bewusst kein Merge in IT_DATA): Redewendungen haben kein Level
   und keine Story-covers-Pflicht, sondern ein eigenes Training
   (Sapere → Modi di dire; auch als Allenamento-Modus).
   SRS-/Audio-Keys: phr_<kat>_<slug(wendung)> — muss zu app.js,
   tools/generate-audio-manifest.js und tools/validate.js passen.
   Kuration: keine Wendung, die schon als Vokabel existiert.
   ============================================================ */
(function () {
  "use strict";

  const makeItems = (rows) => rows.map(([it, de, hint]) => hint ? { it, de, hint } : { it, de });

  window.IT_PHRASES = [
    {
      id: "tempo", title: "Zeit & Dringlichkeit", icon: "⏱️",
      items: makeItems([
        ["fra poco", "bald / in Kürze", "fra und tra sind austauschbar"],
        ["al più presto", "so schnell wie möglich"],
        ["quanto prima", "möglichst bald"],
        ["più tardi", "später"],
        ["in anticipo", "zu früh / im Voraus"],
        ["tra un'ora", "in einer Stunde"],
        ["in questo momento", "gerade / im Moment"],
        ["di rado", "selten", "auch: raramente"],
        ["da tempo", "schon lange / längst"],
        ["per tempo", "rechtzeitig / früh genug"],
        ["all'ultimo momento", "im letzten Moment"],
        ["un attimo", "einen Moment / kurz"],
        ["d'ora in poi", "von jetzt an"],
        ["fra due giorni", "in / über zwei Tagen"]
      ])
    },
    {
      id: "discorso", title: "Gespräch & Reaktion", icon: "💬",
      items: makeItems([
        ["fra l'altro", "unter anderem", "wörtlich: „unter anderem (Dingen)“"],
        ["cioè", "das heißt / also"],
        ["insomma", "nun ja / insgesamt"],
        ["comunque", "jedenfalls / trotzdem"],
        ["in effetti", "tatsächlich"],
        ["a proposito", "übrigens / apropos"],
        ["per così dire", "sozusagen"],
        ["in altre parole", "mit anderen Worten"],
        ["come si dice…?", "wie sagt man…?"],
        ["come mai?", "wieso / warum (überrascht)?"],
        ["figurati", "nichts zu danken / kein Problem (informell)"],
        ["hai ragione", "du hast recht"],
        ["ecco perché", "genau deshalb"],
        ["in conclusione", "zusammenfassend / abschließend"]
      ])
    },
    {
      id: "quantita", title: "Menge & Grad", icon: "📏",
      items: makeItems([
        ["un po'", "ein bisschen", "Kurzform von „un poco“"],
        ["un paio di", "ein paar / ein Paar"],
        ["un sacco di", "massig / haufenweise (umgangssprachlich)"],
        ["abbastanza", "ziemlich / genug"],
        ["parecchio", "ziemlich viel"],
        ["almeno", "zumindest / mindestens"],
        ["circa", "etwa / rund"],
        ["la maggior parte di", "der größte Teil von"],
        ["per lo più", "meistens"],
        ["la metà di", "die Hälfte von"],
        ["a metà", "zur Hälfte / auf halbem Weg"],
        ["di più", "mehr"],
        ["di meno", "weniger"],
        ["per niente", "überhaupt nicht"]
      ])
    },
    {
      id: "luogo", title: "Ort & Bewegung", icon: "📍",
      items: makeItems([
        ["vicino a", "nahe bei"],
        ["lontano da", "weit weg von"],
        ["davanti a", "vor"],
        ["di fronte a", "gegenüber (von)"],
        ["dietro a", "hinter"],
        ["accanto a", "neben"],
        ["in mezzo a", "mitten in / zwischen"],
        ["all'angolo", "an der Ecke"],
        ["in fondo a", "am Ende von / ganz hinten"],
        ["all'ingresso", "am Eingang"],
        ["al piano terra", "im Erdgeschoss"],
        ["al piano di sopra", "eine Etage höher / oben"],
        ["a due passi", "zwei Schritte entfernt (ganz nah)"],
        ["dappertutto", "überall"]
      ])
    },
    {
      id: "intenzione", title: "Absicht & Art", icon: "🎯",
      items: makeItems([
        ["per caso", "zufällig / durch Zufall"],
        ["apposta", "absichtlich / extra"],
        ["di corsa", "in Eile / im Laufschritt"],
        ["con calma", "in Ruhe / ganz gelassen"],
        ["volentieri", "gern / mit Vergnügen"],
        ["di nuovo", "wieder / nochmal"],
        ["in fretta", "eilig / schnell"],
        ["con piacere", "gern (als Antwort)"],
        ["per conto mio", "meinetwegen / was mich angeht"],
        ["a modo mio", "auf meine Art"],
        ["senza fretta", "ohne Eile"],
        ["in genere", "in der Regel / im Allgemeinen"],
        ["per sicurezza", "zur Sicherheit"],
        ["per lavoro", "wegen der Arbeit / geschäftlich"]
      ])
    },
    {
      id: "espressioni", title: "Feste Wendungen", icon: "✨",
      items: makeItems([
        ["non vedo l'ora", "ich kann es kaum erwarten", "wörtlich: „ich sehe die Stunde nicht“"],
        ["ci penso io", "das übernehme ich / ich kümmere mich"],
        ["macché", "keineswegs! / ach was!", "informell, nachdrücklich"],
        ["ci vuole tempo", "das dauert (seine Zeit)"],
        ["che ne so", "was weiß ich / keine Ahnung", "umgangssprachlich"],
        ["non c'è problema", "kein Problem / kein Thema"],
        ["per me è uguale", "mir ist es egal"],
        ["ci sto", "ich bin dabei", "informell"],
        ["piano piano", "langsam, ganz ruhig", "Verdopplung = nach und nach"],
        ["stai tranquillo", "sei unbesorgt / keine Sorge"],
        ["chissà", "wer weiß"],
        ["tanto meglio", "umso besser"],
        ["per carità", "um Himmels willen / bloß nicht", "auch höflich-dankend"],
        ["mi raccomando", "sei bitte sorgfältig / höchst wichtig!", "typisch italienische Ermahnung"]
      ])
    }
  ];
})();
