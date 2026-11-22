# M3 — Dialog-Rollen-Modus (Rollenspiel in Viaggio-Dialogen)

Status: ready-for-agent

## Entscheidungen (22.11.2026; Fragen unbeantwortet → Empfohlen-Optionen, im Plan-Review bestätigt)

1. **Ablauf:** Partner-Zeilen spricht die App automatisch; Du-Zeile: italienisch versteckt, deutsch sichtbar → „🎙️ Aufnehmen & sagen" (MediaRecorder, mehrere Takes, eigener Take abspielbar) → „Lösung & anhören" (Aufdecken + Original-Audio) → Selbstbewertung „✓ Sauber" / „↻ Nochmal aufnehmen" → nächste Zeile.
2. **Persistenz:** Aufnahmen flüchtig (Blob nur als ObjectURL; nichts in MEMODB/Sync).
3. **Belohnung:** +15 XP pro beendetem Rollenspiel; je bewerteter Du-Zeile: `bumpSkill("sprechen")` + `markPractice(1)` + `bumpOutput("satze")`.
4. **Einstieg:** „🎭 Rollenspiel"-Button (btn-telha) im Dialog-Kopf neben Anhören/Stop; Lese-Ansicht bleibt, Zurück jederzeit.
5. **Mikro-Fallback:** ohne/abgelehntes Mikro komplett durchspielbar („sag den Satz einfach laut"); Aufnahme nie Pflicht.

## Umsetzung

- `startRoleplay(dl)` in app.js nach `speakSequence` — Muster aus `scene(dl)` (Story-Szene) + Recorder-Flow aus `viewMissione`; Recorder-Hygiene (`getTracks().stop()`, `stopActive()` bei Lösung/Zurück).
- styles.css: `.role-take` (Audio-Box), `.scene-card .listen-instr`-Abstand; sonst Wiederverwendung (`.scene-card/.grade-row/.btn-row/.flash-progress`).
- sw → ciaoit-v28; EXPOSE §10.3 + XP-Zeile aktualisiert.

## Verifikation

Node-Checks grün; Browser-E2E mikro-frei: Start über Button, Partner-Zeile → Weiter, Du-Zeile mit Fallback-Text bei Aufnahme-Versuch, Lösung → Bewertung, kompletter Durchlauf „Im Restaurant" → +15 XP, Sprechen +5, satze +5, todayCount +5, Endscreen + Nochmal/Zurück; 0 JS-Fehler. Commit/Push/FTP nur auf Go.
