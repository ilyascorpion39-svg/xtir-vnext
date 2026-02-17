param()

$ErrorActionPreference = "Stop"

# 1) generator
New-Item -ItemType Directory -Force "scripts" | Out-Null
New-Item -ItemType Directory -Force "public" | Out-Null

@'
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync("public", { recursive: true });

const sha = execSync("git rev-parse --short HEAD").toString().trim();
const ts = new Date().toISOString().replace("T"," ").replace("Z","");
const stamp = `XTIR_BUILD:${sha} | ${ts}`;

writeFileSync("public/xtir-build.txt", stamp, "utf8");
console.log(stamp);
