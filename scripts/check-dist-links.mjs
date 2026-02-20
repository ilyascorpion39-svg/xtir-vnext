import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const SKIP_DIRS = ["archives", "xtir-archive"];

if (!fs.existsSync(DIST_DIR)) {
  console.error("[check:dist-links] dist directory not found.");
  process.exit(1);
}

function listHtmlFiles(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listHtmlFiles(full));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      const rel = path.relative(DIST_DIR, full).replace(/\\/g, "/");
      if (
        SKIP_DIRS.some(
          (part) => rel.includes(`/${part}/`) || rel.startsWith(`${part}/`),
        )
      ) {
        continue;
      }
      out.push(full);
    }
  }
  return out;
}

function detectBasePrefix() {
  const indexPath = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(indexPath)) return "/";
  const html = fs.readFileSync(indexPath, "utf8");
  if (html.includes("/xtir-vnext/_astro/")) return "/xtir-vnext/";
  const m = html.match(/["'](\/[^"']+\/)_astro\//);
  return m?.[1] ?? "/";
}

function toRoutePath(file) {
  const rel = path.relative(DIST_DIR, file).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) {
    return `/${rel.slice(0, -"index.html".length)}`;
  }
  return `/${rel}`;
}

function shouldIgnore(url) {
  if (!url) return true;
  const v = url.trim();
  if (!v) return true;
  if (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("mailto:") ||
    v.startsWith("tel:") ||
    v.startsWith("javascript:") ||
    v.startsWith("data:") ||
    v.startsWith("//")
  ) {
    return true;
  }
  return false;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeTargetPath(targetPath, basePrefix) {
  if (basePrefix !== "/" && targetPath.startsWith(basePrefix)) {
    return `/${targetPath.slice(basePrefix.length)}`;
  }
  return targetPath;
}

function safeDecodePathname(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

function targetToDistPath(targetPath) {
  const normalized = targetPath.replace(/^\/+/, "");
  if (!normalized) return path.join(DIST_DIR, "index.html");

  if (path.extname(normalized)) {
    return path.join(DIST_DIR, normalized);
  }
  return path.join(DIST_DIR, normalized, "index.html");
}

const htmlFiles = listHtmlFiles(DIST_DIR);
const basePrefix = detectBasePrefix();
const missingTargets = [];
const missingAnchors = [];
const linkRe = /(href|src)=["']([^"']+)["']/gi;
const anchorCache = new Map();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const route = toRoutePath(file);
  const lines = html.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    linkRe.lastIndex = 0;
    let match;
    while ((match = linkRe.exec(line)) !== null) {
      const raw = match[2].trim();
      if (shouldIgnore(raw)) continue;

      let resolved;
      try {
        resolved = new URL(raw, `https://dist.local${route}`);
      } catch {
        continue;
      }

      let targetPath = safeDecodePathname(
        normalizeTargetPath(resolved.pathname || "/", basePrefix),
      );
      if (!targetPath.startsWith("/")) targetPath = `/${targetPath}`;

      if (
        targetPath.startsWith("/archives/") ||
        targetPath.startsWith("/xtir-archive/")
      ) {
        continue;
      }

      const targetFile = targetToDistPath(targetPath);
      if (!fs.existsSync(targetFile)) {
        missingTargets.push({
          source: path.relative(process.cwd(), file),
          line: i + 1,
          raw,
          resolved: targetPath,
        });
        continue;
      }

      const hash = (resolved.hash || "").replace(/^#/, "");
      if (!hash) continue;
      if (!targetFile.toLowerCase().endsWith(".html")) continue;

      const anchorId = decodeURIComponent(hash);
      let targetContent = anchorCache.get(targetFile);
      if (targetContent === undefined) {
        targetContent = fs.readFileSync(targetFile, "utf8");
        anchorCache.set(targetFile, targetContent);
      }

      const idRe = new RegExp(`\\bid=["']${escapeRegExp(anchorId)}["']`, "i");
      const nameRe = new RegExp(`\\bname=["']${escapeRegExp(anchorId)}["']`, "i");
      if (!idRe.test(targetContent) && !nameRe.test(targetContent)) {
        missingAnchors.push({
          source: path.relative(process.cwd(), file),
          line: i + 1,
          raw,
          target: path.relative(process.cwd(), targetFile),
          anchor: anchorId,
        });
      }
    }
  }
}

const totalIssues = missingTargets.length + missingAnchors.length;
if (totalIssues > 0) {
  console.error(
    `[check:dist-links] Found ${totalIssues} issue(s): ${missingTargets.length} broken link target(s), ${missingAnchors.length} missing anchor(s).`,
  );

  for (const item of missingTargets.slice(0, 40)) {
    console.error(
      `- ${item.source}:${item.line} target missing: '${item.raw}' -> '${item.resolved}'`,
    );
  }
  for (const item of missingAnchors.slice(0, 40)) {
    console.error(
      `- ${item.source}:${item.line} anchor missing: '${item.raw}' -> ${item.target}#${item.anchor}`,
    );
  }
  process.exit(1);
}

console.log(
  `[check:dist-links] OK. Scanned ${htmlFiles.length} HTML files (base '${basePrefix}') with no broken internal links/anchors.`,
);
