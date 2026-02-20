import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const MUST_NOT_INCLUDE = ["github.io", "/xtir-vnext/"];
const SKIP_DIRS = ["archives", "xtir-archive"];

if (!fs.existsSync(DIST_DIR)) {
  console.error("[check:dist-canonical] dist directory not found.");
  process.exit(1);
}

function listHtmlFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtmlFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

const htmlFiles = listHtmlFiles(DIST_DIR);
const issues = [];
const canonicalRe = /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i;

for (const file of htmlFiles) {
  const rel = path.relative(DIST_DIR, file).replace(/\\/g, "/");
  if (SKIP_DIRS.some((part) => rel.includes(`/${part}/`) || rel.startsWith(`${part}/`))) {
    continue;
  }

  const content = fs.readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);
  const lineIdx = lines.findIndex((line) => canonicalRe.test(line));

  if (lineIdx === -1) {
    issues.push({
      file: path.relative(process.cwd(), file),
      line: 1,
      reason: "canonical tag is missing",
      snippet: "",
    });
    continue;
  }

  const line = lines[lineIdx];
  const href = line.match(canonicalRe)?.[1] ?? "";
  const badMatch = MUST_NOT_INCLUDE.find((token) => href.includes(token));
  if (badMatch) {
    issues.push({
      file: path.relative(process.cwd(), file),
      line: lineIdx + 1,
      reason: `canonical contains forbidden token '${badMatch}'`,
      snippet: line.trim(),
    });
  }
}

if (issues.length > 0) {
  console.error(`[check:dist-canonical] Found ${issues.length} canonical issue(s).`);
  for (const issue of issues.slice(0, 50)) {
    console.error(`- ${issue.file}:${issue.line} ${issue.reason}`);
    if (issue.snippet) console.error(`  ${issue.snippet}`);
  }
  process.exit(1);
}

console.log("[check:dist-canonical] OK. Canonicals do not contain github.io or /xtir-vnext/.");
