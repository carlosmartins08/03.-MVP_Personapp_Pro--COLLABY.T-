import { existsSync, readFileSync } from "node:fs";

const parseEnv = (filePath) => {
  if (!existsSync(filePath)) return {};

  const env = {};
  for (const line of readFileSync(filePath, "utf-8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    env[key] = value;
  }

  return env;
};

const rootEnv = parseEnv(".env.local");
const backendEnv = parseEnv("backend/.env");

const missingRoot = [];
const missingBackend = [];

const requiredRoot = ["VITE_API_URL"];
const requiredBackend = [
  "DATABASE_URL",
  "JWT_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "ENABLE_ANALYTICS_ROUTES",
];

for (const key of requiredRoot) {
  if (!rootEnv[key]) {
    missingRoot.push(key);
  }
}

for (const key of requiredBackend) {
  if (!backendEnv[key]) {
    missingBackend.push(key);
  }
}

if (missingRoot.length || missingBackend.length) {
  if (missingRoot.length) {
    console.error("Missing root env vars (.env.local):", missingRoot.join(", "));
  }
  if (missingBackend.length) {
    console.error("Missing backend env vars (backend/.env):", missingBackend.join(", "));
  }
  process.exit(1);
}

console.log("Environment files look good.");
