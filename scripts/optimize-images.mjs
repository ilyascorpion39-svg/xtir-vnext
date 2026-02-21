import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const ROOTS = [
  { dir: "public/products-img", maxWidth: 1600, quality: 82 },
  { dir: "public/images", maxWidth: 1400, quality: 82 },
  { dir: "public/xtir-archive/Партнеры", maxWidth: 1600, quality: 80 },
  { dir: "public/xtir-archive/XTIR_ASSETS_PACK/01_photos", maxWidth: 2000, quality: 80 },
];

const EXT_RE = /\.(png|jpe?g)$/i;

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const out = [];
  if (!(await exists(dir))) return out;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (ent.isFile() && EXT_RE.test(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

function runMagick(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("magick", args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`magick exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

async function optimizeFile(file, { maxWidth, quality }) {
  const out = file.replace(EXT_RE, ".webp");
  const outExists = await exists(out);
  const [srcStat, outStat] = await Promise.all([
    fs.stat(file),
    outExists ? fs.stat(out) : Promise.resolve(null),
  ]);

  if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
    return { file, out, skipped: true };
  }

  await runMagick([
    file,
    "-strip",
    "-resize",
    `${maxWidth}x${maxWidth}>`,
    "-quality",
    String(quality),
    out,
  ]);

  return { file, out, skipped: false };
}

async function main() {
  const results = [];

  for (const root of ROOTS) {
    const absRoot = path.resolve(root.dir);
    const files = await walk(absRoot);
    for (const file of files) {
      const res = await optimizeFile(file, root);
      results.push(res);
    }
  }

  const optimized = results.filter((r) => !r.skipped);
  const skipped = results.filter((r) => r.skipped);

  // eslint-disable-next-line no-console
  console.log(
    `[optimize-images] done. optimized=${optimized.length} skipped=${skipped.length}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
