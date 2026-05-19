import { serve } from "srvx/node";
import { existsSync, statSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const CLIENT_DIR = join(__dirname, "dist", "client");

const ssrModule = await import("./dist/server/server.js");
const ssrServer = ssrModule.default ?? ssrModule.server;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function tryStatic(pathname) {
  if (pathname === "/" || pathname.startsWith("/api/")) return null;
  if (pathname.includes("..")) return null;
  const filePath = join(CLIENT_DIR, pathname);
  if (!filePath.startsWith(CLIENT_DIR)) return null;
  try {
    const stat = statSync(filePath);
    if (!stat.isFile()) return null;
    const ext = extname(filePath).toLowerCase();
    const body = readFileSync(filePath);
    const headers = {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Content-Length": String(body.length),
    };
    if (pathname.startsWith("/assets/")) {
      headers["Cache-Control"] = "public, max-age=31536000, immutable";
    }
    return new Response(body, { headers });
  } catch {
    return null;
  }
}

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "127.0.0.1";

serve({
  port,
  hostname,
  fetch: async (request) => {
    const url = new URL(request.url);
    const staticResponse = tryStatic(url.pathname);
    if (staticResponse) return staticResponse;
    return ssrServer.fetch(request);
  },
});

console.log(`[drukwerkadviseur] listening on http://${hostname}:${port}`);
