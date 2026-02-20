import { spawn } from "node:child_process";

const mode = (process.argv[2] ?? "").trim();

if (!["prod", "gh"].includes(mode)) {
  console.error(`[build-runner] Unknown mode '${mode}'. Use 'prod' or 'gh'.`);
  process.exit(1);
}

const isGh = mode === "gh";
const env = { ...process.env };

if (isGh) {
  env.GITHUB_ACTIONS = "true";
  env.GITHUB_REPOSITORY =
    env.GITHUB_REPOSITORY?.trim() || "ilyascorpion39-svg/xtir-vnext";
} else {
  env.GITHUB_ACTIONS = "false";
  delete env.GITHUB_REPOSITORY;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      env,
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `[build-runner] Command failed: ${command} ${args.join(" ")} (code ${code ?? "null"})`,
        ),
      );
    });

    child.on("error", reject);
  });
}

async function main() {
  console.log(
    `[build-runner] Mode=${mode} GITHUB_ACTIONS=${env.GITHUB_ACTIONS} GITHUB_REPOSITORY=${env.GITHUB_REPOSITORY ?? ""}`,
  );
  await run("npm", ["run", "astro", "--", "build"]);
  await run("node", ["scripts/check-dist-base-links.mjs"]);
  await run("node", ["scripts/check-dist-canonical.mjs"]);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
