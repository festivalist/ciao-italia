/* Minimaler statischer Server für lokale Tests — inklusive
   Emulation des sync.php-Endpunkts (identische Hash-Logik):
   node tools/serve.js [Port]  (Standard: 8080) */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const port = Number(process.argv[2]) || 8080;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".csv": "text/csv; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function syncHash(code) { return crypto.createHash("sha256").update("ciaoit:" + code).digest("hex"); }
function fail(res, msg, code) {
  res.writeHead(code || 400, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: msg }));
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const query = new URL(req.url, "http://x").searchParams;

  if (urlPath.endsWith("/sync.php")) {
    const dataDir = path.join(root, "sync-data");
    const code = req.headers["x-sync-code"] || "";
    if (String(code).length < 6) return fail(res, "Sync-Code fehlt oder zu kurz (mindestens 6 Zeichen).", 401);
    const authFile = path.join(dataDir, "auth.json");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(authFile)) fs.writeFileSync(authFile, JSON.stringify({ hash: crypto.createHash("sha256").update(code).digest("hex") }));
    else {
      const auth = JSON.parse(fs.readFileSync(authFile, "utf8"));
      if (auth.hash !== crypto.createHash("sha256").update(code).digest("hex")) return fail(res, "Sync-Code falsch.", 401);
    }
    const file = path.join(dataDir, syncHash(code) + ".json");
    const action = query.get("action");
    if (action === "load") {
      if (!fs.existsSync(file)) return fail(res, "Noch keine Daten auf dem Server.", 404);
      const blob = JSON.parse(fs.readFileSync(file, "utf8"));
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ ok: true, blob }));
    }
    if (action === "save" && req.method === "POST") {
      let body = "";
      req.on("data", c => body += c);
      req.on("end", () => {
        if (body.length > 6291456) return fail(res, "Daten zu groß (Limit 6 MB).", 413);
        try {
          const j = JSON.parse(body);
          if (!j || !j.savedAt) throw 0;
          fs.writeFileSync(file, body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true, savedAt: j.savedAt }));
        } catch { fail(res, "Ungültige Daten."); }
      });
      return;
    }
    return fail(res, "Unbekannte Aktion.");
  }

  const file = path.join(root, urlPath === "/" ? "index.html" : urlPath);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("nicht gefunden"); }
    res.writeHead(200, { "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  });
}).listen(port, () => console.log(`Ciao Italia läuft auf http://localhost:${port}`));
