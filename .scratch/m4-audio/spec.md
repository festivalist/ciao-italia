# M4a — Audio-Upgrade: Neural-MP3s für Wörter + Dialogzeilen

Status: ready-for-agent

## Entscheidungen (Grilling, 22.11.2026 — per Antwort bestätigt)

1. **Umfang:** alle 832 `word_*` (A1+A2+B1) + 102 `dlg_*` ≈ 934 Dateien (~8–12 MB). Verbformen/Sätze/Storys bleiben it-IT-TTS-Fallback.
2. **Stimme:** it-IT-**ElsaNeural** via edge-tts (Microsoft-Edge-Neuralstimme, Python-Paket, keine API-Keys). Lokale SAPI fiel raus (keine italienische Stimme auf dem Rechner). Ehrlicher Hinweis: inoffizieller Microsoft-Endpunkt — Nutzung für die persönliche Lern-App.
3. **B2 (M4b):** bewusst separat — Multi-Session-Content-Lauf über `ciao-vocab-erweitern` mit eigenem Kickoff.

## Umsetzung

- `tools/generate-audio-mp3s.py` (neu): liest AUDIO-MANIFEST.csv (quoted-CSV), filtert `word_`/`dlg_`, resumable (vorhandene nicht-leere Dateien übersprungen), `--limit`/`--voice`, Nebenläufigkeit 4, 3 Wiederholungen je Datei.
- App unverändert (`speak()`/`speakWait()` versuchen bereits `audio/<key>.mp3` zuerst); nur sw → ciaoit-v29.
- Vorab geprüft: Testlauf `--limit 5` („ciao" 0,82 s, Wörter ~1,9 s, 5–11 KB je Datei, ffprobe-Dauern plausibel).

## Verifikation

Datei-Checks (Anzahl = Manifestmenge, Größe >1 KB, ffprobe-Stichproben), Browser-E2E (`loadedmetadata`/`duration>0` für word- und dlg-Key, App bootet fehlerfrei), Node-Checks grün. Deploy: Commit (~934 MP3s + Skript + sw.js), GitHub-Push, FTP-Upload von audio/*.mp3 + sw.js nach /ciao-italia, Live-Check per HEAD.
