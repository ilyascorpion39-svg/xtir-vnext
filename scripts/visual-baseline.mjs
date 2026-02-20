import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const HOST = "127.0.0.1";
const PORT = 4323;
const BASE_URL = `http://${HOST}:${PORT}`;
const PAGES = ["/", "/products/", "/gallery/", "/contact/"];
const OUT_DIR = path.resolve(".artifacts", "visual-baseline");

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".ico") return "image/x-icon";
  if (ext === ".txt") return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

async function createStaticServer(rootDir) {
  const server = http.createServer(async (req, res) => {
    try {
      const reqUrl = new URL(req.url || "/", `http://${HOST}:${PORT}`);
      let routePath = decodeURIComponent(reqUrl.pathname);
      if (routePath.endsWith("/")) routePath += "index.html";
      let absPath = path.normalize(path.join(rootDir, routePath));

      if (!absPath.startsWith(rootDir)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
      }

      let data;
      try {
        data = await fs.readFile(absPath);
      } catch {
        absPath = path.join(rootDir, routePath, "index.html");
        data = await fs.readFile(absPath);
      }

      res.setHeader("Content-Type", contentType(absPath));
      res.statusCode = 200;
      res.end(data);
    } catch {
      res.statusCode = 404;
      res.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(PORT, HOST, resolve));
  return server;
}

function toSlug(route) {
  if (route === "/") return "home";
  return route.replaceAll("/", "-").replace(/^-+|-+$/g, "");
}

async function run() {
  if (!existsSync(path.resolve("dist", "index.html"))) {
    throw new Error("dist is missing. Run `npm run build` before visual baseline.");
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  const server = await createStaticServer(path.resolve("dist"));

  try {
    const browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    });

    for (const route of PAGES) {
      const slug = toSlug(route);
      const dPage = await desktop.newPage();
      await dPage.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
      await dPage.screenshot({
        path: path.join(OUT_DIR, `${slug}-desktop.png`),
        fullPage: true,
      });
      await dPage.close();

      const mPage = await mobile.newPage();
      await mPage.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
      await mPage.screenshot({
        path: path.join(OUT_DIR, `${slug}-mobile.png`),
        fullPage: true,
      });
      await mPage.close();
    }

    await desktop.close();
    await mobile.close();
    await browser.close();
    console.log(`[visual-baseline] Screenshots saved to ${OUT_DIR}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

run().catch((error) => {
  console.error(`[visual-baseline] ${error.message}`);
  process.exit(1);
});
