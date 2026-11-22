#!/usr/bin/env python3
# ============================================================
# generate-audio-mp3s.py — erzeugt echte MP3-Sprachdateien
# für die wertvollsten AUDIO-MANIFEST-Schlüssel (word_* + dlg_*)
# mit einer Microsoft-Edge-Neuralstimme (edge-tts, keine API-Keys).
#
#   python tools/generate-audio-mp3s.py [--limit N] [--voice NAME]
#
# - Liest AUDIO-MANIFEST.csv (Header: key,text,bereich; quoted CSV).
# - Resumable: vorhandene, nicht-leere audio/<key>.mp3 werden
#   übersprungen — der Lauf kann jederzeit abgebrochen und
#   fortgesetzt werden.
# - Hinweis: edge-tts nutzt den (inoffiziellen) Edge-Lesemodus-
#   Endpunkt von Microsoft; Nutzung für die persönliche Lern-App.
# ============================================================
import argparse
import asyncio
import csv
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "AUDIO-MANIFEST.csv"
AUDIO_DIR = ROOT / "audio"
PREFIXES = ("word_", "dlg_")
CONCURRENCY = 4
RETRIES = 3
DEFAULT_VOICE = "it-IT-ElsaNeural"


def load_entries():
    entries = []
    with MANIFEST.open("r", encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            key = (row.get("key") or "").strip()
            text = (row.get("text") or "").strip()
            if key and text and key.startswith(PREFIXES):
                entries.append((key, text))
    return entries


async def generate_one(key, text, voice, sem, stats):
    out = AUDIO_DIR / f"{key}.mp3"
    if out.exists() and out.stat().st_size > 0:
        stats["skipped"] += 1
        return
    async with sem:
        for attempt in range(1, RETRIES + 1):
            try:
                await edge_tts.Communicate(text, voice).save(str(out))
                if out.exists() and out.stat().st_size > 0:
                    stats["done"] += 1
                    return
                out.unlink(missing_ok=True)
            except Exception as e:  # Netz/Endpunkt-Toleranz mit Rückzug
                if attempt == RETRIES:
                    stats["failed"].append((key, f"{type(e).__name__}: {e}"))
                    out.unlink(missing_ok=True)
                    return
                await asyncio.sleep(1.5 * attempt)


async def main():
    ap = argparse.ArgumentParser(description="Erzeuge Neural-MP3s aus AUDIO-MANIFEST.csv")
    ap.add_argument("--limit", type=int, default=0, help="nur die ersten N Einträge (Testlauf)")
    ap.add_argument("--voice", default=DEFAULT_VOICE, help=f"Edge-Stimme (Default {DEFAULT_VOICE})")
    args = ap.parse_args()

    AUDIO_DIR.mkdir(exist_ok=True)
    entries = load_entries()
    if args.limit:
        entries = entries[: args.limit]
    print(f"{len(entries)} Einträge (Stimme: {args.voice}) — Vorhandene werden übersprungen.")

    sem = asyncio.Semaphore(CONCURRENCY)
    stats = {"done": 0, "skipped": 0, "failed": []}
    await asyncio.gather(*(generate_one(k, t, args.voice, sem, stats) for k, t in entries))

    print(f"Erzeugt: {stats['done']} · Übersprungen: {stats['skipped']} · Fehlgeschlagen: {len(stats['failed'])}")
    for key, err in stats["failed"]:
        print(f"  FEHLER {key}: {err}", file=sys.stderr)
    sys.exit(1 if stats["failed"] else 0)


if __name__ == "__main__":
    asyncio.run(main())
