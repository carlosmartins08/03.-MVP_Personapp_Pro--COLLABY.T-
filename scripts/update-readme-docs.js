import { readFileSync, writeFileSync } from "node:fs";

const path = "README.md";
const text = readFileSync(path, "utf-8");
const start = text.indexOf("## Documenta");
const end = text.indexOf("## PWA e alertas");

if (start === -1 || end === -1) {
  throw new Error("Markers for the documentation section could not be found.");
}

const newBlock = `## DocumentaÇõÇœo

- \`docs/frontend.md\` – setup completo do frontend (envs, scripts, boas práticas).
- \`docs/backend-postgres.md\` – fluxo do backend PostgreSQL, incluindo Docker, Prisma e seeds.
- \`docs/DB_CONNECTION.md\` – passo a passo da conexão local com PostgreSQL e preparo do \`.env\`.
- \`docs/SEED_DATA.md\` – credenciais/dados criados pelo script \`backend/prisma/seed.ts\`.
- \`docs/QA_SUMMARY.md\` – resumo rápido dos scripts QA (\`qa:validate-env\`, \`qa:prep\`, \`qa:start\`, \`qa:checklist\`).
- \`docs/SETUP_SUMMARY.md\` – mapa com links rápidos para os dois guias acima e o \`docker-compose\`.
- \`docs/ROADMAP.md\` – visão futura sobre migração e prioridade de features.

`;

writeFileSync(path, text.slice(0, start) + newBlock + text.slice(end));
