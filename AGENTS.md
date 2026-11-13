# Ciao Italia — Agent-Anweisungen

Italienisch-Lernapp (PWA, Vanilla JS, Deutsch als Basissprache). Deploy via FTP.

## Agent skills

### Issue tracker

Issues leben als lokale Markdown-Dateien unter `.scratch/<feature>/` (eine Datei pro Ticket, Spec in `spec.md`). See `docs/agents/issue-tracker.md`.

### Triage labels

Standard-Vokabular mit fünf Rollen: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` im Repo-Root (werden lazily vom `/domain-modeling`-Skill angelegt). See `docs/agents/domain.md`.
