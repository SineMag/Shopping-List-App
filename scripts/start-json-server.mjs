import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const port = process.env.PORT || "3001";
const seedFile = path.resolve(process.env.JSON_SERVER_SEED_FILE || "src/data/render-db.json");
const dbFile = path.resolve(process.env.JSON_SERVER_DB_FILE || "src/data/render-db.json");

const dbDir = path.dirname(dbFile);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

if (!existsSync(dbFile)) {
  copyFileSync(seedFile, dbFile);
}

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const child = spawn(
  npxCommand,
  ["json-server", "--watch", dbFile, "--host", "0.0.0.0", "--port", String(port)],
  {
    stdio: "inherit",
    env: process.env,
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start json-server", error);
  process.exit(1);
});
