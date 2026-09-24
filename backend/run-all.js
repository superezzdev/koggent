import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES = [
  { name: "GATEWAY", dir: "gateway", color: "\x1b[36m" },
  { name: "AUTH   ", dir: path.join("services", "auth"), color: "\x1b[32m" },
  { name: "CHAT   ", dir: path.join("services", "chat"), color: "\x1b[34m" },
  { name: "AGENT  ", dir: path.join("services", "agent"), color: "\x1b[35m" },
  { name: "BILLING", dir: path.join("services", "billing"), color: "\x1b[33m" },
];

const RESET = "\x1b[0m";
const children = [];

console.log("\x1b[1m\x1b[35m🚀 Starting all Koggent backend services...\x1b[0m\n");

SERVICES.forEach(({ name, dir, color }) => {
  const serviceCwd = path.resolve(__dirname, dir);
  const child = spawn("node", ["index.js"], {
    cwd: serviceCwd,
    stdio: ["pipe", "pipe", "pipe"],
    env: process.env,
  });

  children.push({ child, name });

  const prefix = `${color}[${name}]${RESET} `;

  child.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line) console.log(`${prefix}${line}`);
    });
  });

  child.stderr.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line) console.error(`${prefix}\x1b[31m${line}${RESET}`);
    });
  });

  child.on("close", (code) => {
    if (code !== null && code !== 0) {
      console.log(`${prefix}\x1b[31mexited with code ${code}${RESET}`);
    }
  });
});

function cleanup() {
  console.log("\n\x1b[33mShutting down all backend services...\x1b[0m");
  children.forEach(({ child }) => {
    if (child && !child.killed) {
      child.kill("SIGTERM");
    }
  });
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);
