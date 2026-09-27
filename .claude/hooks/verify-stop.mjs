import { spawnSync } from "node:child_process";

console.log("\n[Stop Hook] Running post-task verification (lint & build)...");

// 1. Run linter
const lintResult = spawnSync("npm", ["run", "lint"], { stdio: "inherit", shell: true });
if (lintResult.status !== 0) {
  console.error("[Stop Hook] Linting failed. Please check the errors above.");
}

// 2. Run build
const buildResult = spawnSync("npm", ["run", "build"], { stdio: "inherit", shell: true });
if (buildResult.status !== 0) {
  console.error("[Stop Hook] Build failed. Please check the errors above.");
} else {
  console.log("[Stop Hook] Build and lint verification completed successfully!");
}
