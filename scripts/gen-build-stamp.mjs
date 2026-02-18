import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

function safeSha() {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    const gh = process.env.GITHUB_SHA;
    if (gh && gh.length >= 7) return gh.slice(0, 7);
    return "unknown";
  }
}

mkdirSync("public", { recursive: true });

const sha = safeSha();
const ts = new Date().toISOString().replace("T", " ").replace("Z", "");
const stamp = `XTIR_BUILD:${sha} | ${ts}`;

writeFileSync("public/xtir-build.txt", stamp, "utf8");
console.log(stamp);
