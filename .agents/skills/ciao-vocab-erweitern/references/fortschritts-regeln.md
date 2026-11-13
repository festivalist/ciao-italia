# Fortschritts-Regeln: SRS-Keys, IDs und was sie zerstören kann

Der Nutzer-Fortschritt liegt in `ciaoit_srs` (Leitner-Boxen je Key),
`ciaoit_stories`, `ciaoit_missions`, `ciaoit_xp`, `ciaoit_streak` (localStorage,
per `SYNC_KEYS` auch server-seitig). **„Aktueller Fortschritt geht nicht
verloren" ist eine harte Nutzeranforderung** — jede Erweiterung wird mit einem
Seed-und-Reload-Test bewiesen, nicht behauptet.

## Key-Schema (muss zu AUDIO-MANIFEST passen)

| Präfix | Inhalt | Verankerung | Risiko |
|--------|--------|-------------|--------|
| `word_<cat>_<slug>` | Wortschatz | ID-basiert | Kategorie-IDs/Wörter nicht umbenennen |
| `verb_<inf>_<tense>_<i>` | Verbformen | ID-basiert | Infinitive nicht umbenennen |
| `sent_/neg_/q_<svo>_<…>` | generierte Mustersätze | `S.svo[].id` | IDs stabil |
| `chk_<i>` | **A1-Reisecheckliste** | **INDEX-basiert!** | Reihenfolge ändern = Fortschritt verrutscht |
| `chkA2_<i>` / `chkB1_<i>` | A2/B1-Checklisten | indexbasiert, eigenes Präfix | nur hinten anhängen |
| `dlg_<dialogId>_<i>` | Dialogzeilen | ID-basiert | Dialog-IDs stabil |
| `ore_<epId>_<i>` | Orecchie-Zeilen | ID-basiert | Episoden-IDs stabil |
| `story_<id>_<slug>` / `story_<id>_sent_<i>` | Story-Wörter/-Sätze | ID-basiert | Story-IDs stabil |
| `mis_<id>`, `chap_<from>`, `decon_<i>` | Missionen/Kapitel/Dekonstruktion | ID/Index | stabil halten |

## Goldene Regeln

1. **`S.checklist` (A1) ist indexverankert.** Nie umsortieren, nie vorne
   einfügen, keine Sätze entfernen. Wenn überhaupt, nur hinten anhängen —
   und dann zählt der Missionstext („30 Sätze") mit anpassen.
2. **Neue Level bekommen eigene Arrays + eigene Präfixe.** Niemals neue Sätze in
   `S.checklist` mischen, damit A2/B1-Fortschritt nicht A1-Keys überschreibt.
3. **IDs sind heilig.** Dialog-, Episoden-, Story-, Missions-IDs nachträglich
   umbenennen = stiller Fortschrittsverlust (alter Key verwaist, neuer startet
   bei Box 1).
4. **Key-Mapping an drei Stellen synchron halten:** `app.js` (Key-Bau),
   `tools/generate-audio-manifest.js` (Audio-Keys), `tools/validate.js`
   (Konsistenz-Checks). Nach Änderungen an einer Stelle die anderen beiden prüfen.
5. **Legacy-`ciaoit_check` (Häkchen-Ära) gehört ausschließlich zur A1-Liste**
   (Migration in `viewChecklist`, nur für Level A1 ausgeführt).
6. **Nie auf Verdacht ändern:** Vor jeder Änderung an datentragenden Arrays
   prüfen, ob dadurch bestehende Keys beeinflusst werden (Tabelle oben).

## E2E-Nachweis (Pflichtteil jeder Erweiterung)

Ablauf mit Browser-Steuerung (IAB), nach jedem SW/Content-Bump:

1. **SW resetten** (sonst testet man alten Cache): `navigator.serviceWorker
   .getRegistrations()` → unregister, `caches.keys()` → delete, dann reload.
2. **Alt-Fortschritt seeden** — typisches Beispiel (vor dem Reload):

```js
localStorage.clear();
localStorage.setItem("ciaoit_srs", JSON.stringify({
  chk_3:  { box: 5, due: Date.now() - 86400000 },
  chk_7:  { box: 4, due: Date.now() + 4 * 86400000 },
  chk_11: { box: 4, due: Date.now() + 4 * 86400000 },
  "dlg_ristorante_0": { box: 4, due: Date.now() + 4 * 86400000 },
  "ore_primo-giorno_0": { box: 3, due: Date.now() + 2 * 86400000 }
}));
localStorage.setItem("ciaoit_check", JSON.stringify({ 0: true, 1: true })); // Legacy
```

3. **Erwartung ausrechnen und notieren** (hier: A1-Checkliste 5/30 „sitzen
   sicher" = 3 Seeds + 2 Legacy-Migrationen; ripe = Box ≥ 4).
4. **Klickpfade der geänderten Features** durchspielen (Filter, Dialog, Checkliste
   inkl. Bewerten, Episode inkl. Übersetzungs-Tap).
5. **Reload** und exakt dieselben Counts erneut messen. Weicht etwas ab: Bug
   finden und fixen, bevor irgendetwas als fertig gilt.
