import { spawnSync } from "node:child_process";

const runCommand = (command, args) => {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

runCommand("npm", ["run", "bootstrap"]);

console.log("\nBootstrap complete.");
console.log(">> Run `npm run backend:dev` in one terminal.");
console.log(">> Run `npm run dev` in another terminal.");
console.log(">> Inspect http://localhost:4000/health and http://localhost:8080.");
console.log(">> Use `docs/QA_CHECKLIST.md` to validate the flows.");
