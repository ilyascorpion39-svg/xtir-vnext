import http from "node:http";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const HOST = "127.0.0.1";
const PORT = 4323;
const BASE_URL = `http://${HOST}:${PORT}`;
const ROUTES = ["/", "/products/", "/gallery/", "/contact/"];

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

async function run() {
  const distRoot = path.resolve("dist");
  if (!existsSync(path.join(distRoot, "index.html"))) {
    throw new Error("dist is missing. Run `npm run build` before smoke tests.");
  }
  const server = await createStaticServer(distRoot);

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    for (const route of ROUTES) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });

      const title = await page.title();
      if (!title.includes("XTIR")) {
        throw new Error(`Route ${route} has unexpected title: ${title}`);
      }

      const h1Count = await page.locator("h1").count();
      if (h1Count < 1) {
        throw new Error(`Route ${route} has no H1`);
      }

      const canonical = page.locator('link[rel="canonical"]');
      const canonicalHref = await canonical.getAttribute("href");
      if (!canonicalHref?.startsWith("https://x-tir.ru")) {
        throw new Error(`Route ${route} has invalid canonical: ${canonicalHref}`);
      }
    }

    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    const stripeContainer = page.locator('header div[aria-hidden="true"]');
    if ((await stripeContainer.count()) !== 1) {
      throw new Error("Header tricolor container is missing");
    }

    const stripeSegments = page.locator('header div[aria-hidden="true"] > span');
    const segmentCount = await stripeSegments.count();
    if (segmentCount === 3) {
      // Legacy implementation: 3 explicit stripe segments
    } else if (segmentCount === 1) {
      // Current implementation: one span with tricolor gradient
      const gradient = await stripeSegments.first().evaluate((el) =>
        globalThis.getComputedStyle(el).backgroundImage,
      );
      const hasGradient = gradient.includes("linear-gradient");
      const hasBlue = gradient.includes("121, 152, 220");
      const hasRed = gradient.includes("170, 84, 94");
      if (!(hasGradient && hasBlue && hasRed)) {
        throw new Error(`Header tricolor gradient check failed: ${gradient}`);
      }
    } else {
      throw new Error(
        `Header tricolor check failed. Expected 1 or 3 stripe spans, got ${segmentCount}`,
      );
    }

    const skipLinkCount = await page.locator('a[href="#main-content"]').count();
    if (skipLinkCount !== 1) {
      throw new Error("Skip link is missing");
    }

    await context.close();
    await browser.close();
    console.log("[smoke] Playwright smoke checks passed.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

run().catch((error) => {
  console.error(`[smoke] ${error.message}`);
  process.exit(1);
});
