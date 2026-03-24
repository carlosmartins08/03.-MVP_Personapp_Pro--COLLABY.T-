from pathlib import Path

path = Path("README.md")
text = path.read_text()
start = text.index("## Documenta")
end = text.index("## PWA e alertas")
new_block = (
    "## DocumentaÇõÇœo\n\n"
    "- `docs/frontend.md` – setup completo do frontend (envs, scripts, boas prÇ­ticas).\n"
    "- `docs/backend-postgres.md` – fluxo do backend PostgreSQL, incluindo Docker, Prisma e seeds.\n"
    "- `docs/DB_CONNECTION.md` – passo a passo da conexão local com PostgreSQL e preparo do `.env`.\n"
    "- `docs/SEED_DATA.md` – credenciais/dados criados pelo script `backend/prisma/seed.ts`.\n"
    "- `docs/QA_SUMMARY.md` – resumo rápido dos scripts QA (`qa:validate-env`, `qa:prep`, `qa:start`, `qa:checklist`).\n"
    "- `docs/SETUP_SUMMARY.md` – mapa com links rápidos para os dois guias acima e o `docker-compose`.\n"
    "- `docs/ROADMAP.md` – visão futura sobre migração e prioridade de features.\n\n"
)
path.write_text(text[:start] + new_block + text[end:])
