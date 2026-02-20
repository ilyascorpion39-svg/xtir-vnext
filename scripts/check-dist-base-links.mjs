import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const isGh = process.env.GITHUB_ACTIONS === "true";
const repo = (process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "").trim();
const computedBase = isGh && repo ? `/${repo}/` : "/";
const base = (process.env.BASE_URL_OVERRIDE ?? computedBase).trim();

if (base === "/") {
  console.log("[check:dist-base-links] BASE_URL is '/', check skipped.");
  process.exit(0);
}

if (!fs.existsSync(DIST_DIR)) {
  console.error("[check:dist-base-links] dist directory not found.");
  process.exit(1);
}

const ROUTES = [
  "about",
  "careers",
  "certificates",
  "contact",
  "docs",
  "faq",
  "gallery",
  "news",
  "partners",
  "privacy",
  "products",
  "support",
  "technologies",
  "terms",
  "warranty",
];

const badHrefRe = new RegExp(
  `href="/(?:${ROUTES.join("|")})(?:[/?#"]|$)`,
  "i",
);

function listHtmlFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtmlFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html"))
      out.push(full);
  }
  return out;
}

const htmlFiles = listHtmlFiles(DIST_DIR);
const violations = [];

for (const file of htmlFiles) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (badHrefRe.test(lines[i])) {
      violations.push({
        file: path.relative(process.cwd(), file),
        line: i + 1,
        snippet: lines[i].trim(),
      });
    }
  }
}

if (violations.length > 0) {
  console.error(
    `[check:dist-base-links] Found ${violations.length} root href(s) without BASE_URL '${base}'.`,
  );
  for (const v of violations.slice(0, 50)) {
    console.error(`- ${v.file}:${v.line} ${v.snippet}`);
  }
  process.exit(1);
}

console.log(
  `[check:dist-base-links] OK. No root hrefs matched protected routes for BASE_URL '${base}'.`,
);
