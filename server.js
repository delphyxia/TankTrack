/**
 * TankTrack's first Node.js entry point.
 *
 * It deliberately has no framework or dependencies yet, so you can see what
 * Node is doing: receiving an HTTP request and returning a file. In the next
 * milestone this is replaced with a TypeScript API connected to PostgreSQL.
 *
 * Run: node server.js
 * Then visit: http://localhost:3000
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const server = http.createServer((request, response) => {
  const urlPath = request.url === "/" ? "/index.html" : request.url.split("?")[0];
  const filePath = path.resolve(ROOT, `.${urlPath}`);

  // Never allow a URL to escape the project directory.
  const relativePath = path.relative(ROOT, filePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }
    response.writeHead(200, { "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(file);
  });
});

server.listen(PORT, () => console.log(`TankTrack is running at http://localhost:${PORT}`));
