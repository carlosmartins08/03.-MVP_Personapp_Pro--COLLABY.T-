import readline from "node:readline";
import process from "node:process";

const steps = [
  {
    title: "Environment",
    details:
      "Confirm `.env` + `.env.local` contain VITE_API_URL, DATABASE_URL, JWT_SECRET, SMTP_* and ENABLE_ANALYTICS_ROUTES.",
  },
  {
    title: "Backend readiness",
    details:
      "Run `npm run qa:validate-env` (or `npm run backend:bootstrap`) then ensure `npm run backend:dev` answers on http://localhost:4000/health.",
  },
  {
    title: "Frontend readiness",
    details:
      "Start `npm run dev` and verify the UI loads; the service worker/install prompt should register (check Application > Service Workers).",
  },
  {
    title: "Login flows",
    details:
      "Log in as the seeded professional and patient; check tokens saved by `auth-service.ts` and `/auth/me` returns profile data.",
  },
  {
    title: "Dashboards & analytics",
    details:
      "Explore professional and patient dashboards; ensure `/analytics/*` plus `/traducoes` provide charts/texts when ENABLE_ANALYTICS_ROUTES=true.",
  },
  {
    title: "Agenda & sessions",
    details:
      "Open TelaAgendaSemanal, review sessions (`/sessoes`) with status/pagamento data and confirm the grid matches the backend.",
  },
  {
    title: "Financeiro",
    details:
      "Visit financial screens; validate charges/recibos, payment status updates and `/financeiro` summaries.",
  },
  {
    title: "Alertas clínicos",
    details:
      "Use TelaAlertasClinicos to fetch alerts (`/alertas`), apply updates, and verify LocalizacaoContext consumes `/traducoes`.",
  },
  {
    title: "Service worker / PWA",
    details:
      "Check Application > Service Workers for registration; run `npm run build && npm run preview` to validate the production cache and InstallPrompt.",
  },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (message) =>
  new Promise((resolve) => {
    rl.question(`${message} (press Enter to continue, q to exit) `, (answer) => {
      if (answer === "q") {
        rl.close();
        process.exit(0);
      }
      resolve();
    });
  });

(async () => {
  console.log("QA Checklist\n============\n");

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(`${i + 1}. ${step.title}`);
    console.log(`   ${step.details}\n`);
    await prompt(`Step ${i + 1} done?`);
  }

  console.log("\nChecklist complete. Proceed to release.");
  rl.close();
})();
