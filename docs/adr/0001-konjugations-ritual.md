# ADR 0001: Congiuga del giorno — Queue zur Laufzeit ableiten, Anzeige-Folge voi vor loro

Datum: 2026-11-22 · Status: angenommen

## Kontext

Das tägliche Konjugations-Ritual braucht eine feste, „leicht → schwer" sortierte Rotationsfolge über alle 135 Verben. Die Verb-Daten tragen **kein Level-, kein Irregular- und kein Klassenfeld**; Level ist nur implizit über die Array-Position (0–99 A1, 100–118 A2, 119–134 B1). Außerdem halten die Daten die Personen in der Reihenfolge `io, tu, lui/lei, noi, loro, voi` (voi = Index 5) — bewusst, damit bestehende SRS-/Audio-Keys (`verb_<slug>_<tense>_<i>`) stabil bleiben.

## Entscheidung

1. **Keine Content-Änderung für die Rotation.** Die Warteschlange wird zur Laufzeit aus dem existing Datenstand abgeleitet (`buildConjQueue`): Konjugationsklasse aus der Infinitiv-Endung (Reflexiv-`-si` gestrippt), Regularität durch Vergleich der Presente-Formen mit generierten Standard-Endungen — inklusive h-Einschub bei -care/-gare (paghi), -iare-Kontraktion (mangi, nicht mangii) und dem -isc-Typ (finisco). Abweichler gelten als „unregelmäßig" und kommen im Level zuletzt (essere/avere zuerst).
2. **Anzeige-Folge ≠ Daten-Folge.** Das Overlay fragt in der didaktischen Folge io → tu → lui/lei → noi → **voi → loro** ab, via Mapping `[0,1,2,3,5,4]`. Die Daten-Reihenfolge (loro=4, voi=5) bleibt unangetastet; alle Keys (Audio, SRS) bleiben stabil.
3. Die Ableitung liegt als reiner, markierter Code-Block in `app.js` (`conj-queue:start/end`) und wird von `tools/check-conj-queue.js` in Node **mit exakt demselben Code** getestet.

## Konsequenzen

- Verbs-Dateien müssen weder Level- noch Irregular-Felder bekommen; neue Verben sortieren sich automatisch richtig ein (A2/B1 per Array-Position).
- Inhaltlich randständige Verben (z. B. inviare mit „invii") landen im Unregelmäßig-Bucket — akzeptiert: sie werden spät geübt, was der „leicht → schwer"-Reihenfolge entspricht.
- Der Marker-Block in `app.js` darf keine DOM-/Storage-Abhängigkeiten bekommen, sonst bricht der Node-Test.
