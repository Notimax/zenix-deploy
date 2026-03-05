const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function safeLocalPath(urlPathname) {
  const decoded = decodeURIComponent(urlPathname);
  const cleaned = decoded.replace(/^\/+/, "");
  const fullPath = path.resolve(ROOT, cleaned);
  if (!fullPath.startsWith(path.resolve(ROOT))) {
    return null;
  }
  return fullPath;
}

function send404(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
}

function resolveCacheControl(filePath, ext) {
  const baseName = path.basename(filePath).toLowerCase();
  const noCacheFiles = new Set([
    "index.html",
    "zenix.js",
    "zenix.css",
    "sw.js",
    "manifest.webmanifest",
  ]);

  if (noCacheFiles.has(baseName) || ext === ".html" || ext === ".webmanifest") {
    return "no-cache";
  }

  return "public, max-age=31536000, immutable";
}

function streamFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      send404(res);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const cacheControl = resolveCacheControl(filePath, ext);
    const range = req.headers.range;

    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) {
        res.writeHead(416);
        res.end();
        return;
      }

      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Number(match[2]) : stats.size - 1;
      if (
        Number.isNaN(start) ||
        Number.isNaN(end) ||
        start < 0 ||
        end < start ||
        end >= stats.size
      ) {
        res.writeHead(416);
        res.end();
        return;
      }

      res.writeHead(206, {
        "Content-Type": contentType,
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Cache-Control": cacheControl,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size,
      "Accept-Ranges": "bytes",
      "Cache-Control": cacheControl,
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const requestUrl = new URL(req.url, `http://${host}`);
  let pathname = requestUrl.pathname;

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const filePath = safeLocalPath(pathname);
  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      streamFile(req, res, filePath);
      return;
    }

    const hasExtension = path.extname(pathname) !== "";
    const acceptsHtml = (req.headers.accept || "").includes("text/html");
    if (!hasExtension || acceptsHtml) {
      streamFile(req, res, path.join(ROOT, "index.html"));
      return;
    }

    send404(res);
  });
});

server.listen(PORT, () => {
  console.log(`Zenix Stream: http://localhost:${PORT}`);
});
