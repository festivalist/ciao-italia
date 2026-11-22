# M2 — XP-Identität + Quick Wins

Status: ready-for-agent

## Entscheidungen (22.11.2026; Fragen unbeantwortet → Empfohlen-Optionen, im Plan-Review bestätigt)

1. **XP-Stufen:** 🧭 Turista (0) · 🎒 Viaggiatore (150) · 🤝 Amico del posto (500) · ☕ Quasi italiano (1.200) · 🏆 Italiano doc (2.500) — rein aus `ciaoit_xp` abgeleitet (`XP_RANKS`/`xpRank()`), kein neuer Storage.
2. **Sichtbarkeit:** Passaporto-Stufenkarte (streak-card-Muster) mit Fortschrittsbalken vor der Streak-Karte; Stufentitel zusätzlich in Home-`.xp-line` und Percorso-`.xp-chip`.
3. **Verbi-Tab:** Level-Chips (Alle · A1 · A2 · B1, Parole-Muster) + `.lv`-Badge je Listenzeile via `VERB_LEVEL`-Map (aus `conjLevel(idx)`); Detail zeigt Level + „regelmäßig/unregelmäßig" (`.lv.reg/.lv.irr`) via `conjIsRegular`.
4. **Reisedatum:** `setTrip()` als Body-Level-Overlay (`.conj-overlay/.conj-card` wiederverwendet) mit `input[type=date]`, Speichern/Abbrechen/Löschen — ersetzt das letzte blockierende `window.prompt` und repariert nebenbei die Freitext-Validierung.
5. **Ritual-Gate (Readiness):** `conjRitualUnlocked()` = mind. eine abgeschlossene Lektion; Guards in Boot-Tail, `updateConjBanner()`, `openConj()`.

## Umsetzung

app.js + styles.css (keine neuen Dateien); sw → ciaoit-v27; EXPOSE.md aktualisiert.

## Verifikation

Node-Checks grün; Browser-E2E: Gate (frisch = still, nach Lektion + Tag = Overlay), Stufenkarte/Titel, Verbi-Filter-Zählwerte (100/19/16) + Badges, Trip-Dialog-Fluss ohne `window.prompt`, 0 JS-Fehler. Commit/Push/FTP nur auf Go.
