# PersonaApp Pro

PersonaApp Pro é um painel para psicólogos e pacientes construído com Vite, React, TypeScript, Tailwind e um backend Fastify + Prisma conectado ao PostgreSQL. Este README dá uma visão geral rápida; os detalhes de frontend/back-end estão em `docs/frontend.md`, `docs/backend-postgres.md` e o resumo `docs/SETUP_SUMMARY.md`.

## Quickstart

```bash
# 1. Frontend setup
cp .env.example .env.local
npm install

# 1.1 Ajuste as URLs do frontend
# VITE_API_URL=http://localhost:4000
# VITE_FRONTEND_URL=http://localhost:8080
# VITE_EMAIL_VERIFICATION_REDIRECT_URL=http://localhost:8080/verificar-email

# 2. Bootstrap backend (Postgres, Prisma migrations/seeds)
npm run bootstrap

# 3. In one terminal, run the backend dev server
npm run backend:dev

# 4. In another terminal, run the frontend dev server
npm run dev
```

Abra o frontend em `http://localhost:8080` e o backend em `http://localhost:4000/health`.
Se o `.env.local` estiver ausente ou incompleto, o app mostra uma tela de erro com instruções.
Por segurança, o dev server do Vite fica restrito a `localhost`.

## Variáveis de ambiente

### Frontend

| Variável                              | Obrigatória | Descrição                                         |
| ------------------------------------- | ----------- | ------------------------------------------------- |
| `VITE_DEFAULT_LANGUAGE`               | Não         | `pt` ou `en` (padrão `pt`)                         |
| `VITE_FRONTEND_URL`                   | Não         | URL pública do app (ex.: `http://localhost:8080`) |
| `VITE_EMAIL_VERIFICATION_REDIRECT_URL`| Não         | URL usada após confirmação de e-mail              |
| `VITE_API_URL`                        | Sim         | URL do backend Fastify (ex.: `http://localhost:4000`) |

### Backend

O backend usa PostgreSQL (via `docker-compose.yml` ou instalação local). A string padrão é `postgresql://personapp:personapp-dev@localhost:5432/personaclinic`. Configure também `PORT`, `JWT_SECRET` e as credenciais `SMTP_*` conforme explicado em `backend/README.md`.

## Backend (Fastify + Prisma + PostgreSQL)

O backend expõe rotas de auth, pacientes, sessões, financeiro, alertas, recibos e traduções (veja `backend/src/routes`). Ele usa JWT para autenticação (`backend/src/plugins/auth.ts`) e Prisma com seed (`backend/prisma/seed.ts`). Em produção, rode `npm run build` + `npm start` após `prisma:migrate`.

## DocumentaÇõÇœo

- `docs/frontend.md` – setup completo do frontend (envs, scripts, boas práticas).
- `docs/backend-postgres.md` – fluxo do backend PostgreSQL, incluindo Docker, Prisma e seeds.
- `docs/DB_CONNECTION.md` – passo a passo da conexão local com PostgreSQL e preparo do `.env`.
- `docs/SEED_DATA.md` – credenciais/dados criados pelo script `backend/prisma/seed.ts`.
- `docs/QA_SUMMARY.md` – resumo rápido dos scripts QA (`qa:validate-env`, `qa:prep`, `qa:start`, `qa:checklist`).
- `docs/SETUP_SUMMARY.md` – mapa com links rápidos para os dois guias acima e o `docker-compose`.
- `docs/ROADMAP.md` – visão futura sobre migração e prioridade de features.
- `docs/design-system.md` – tokens, tipografia e componentes do Design System da PersonApp.

## PWA e alertas

- `public/service-worker.ts` junto com `src/components/pwa/InstallPrompt.tsx`/`usePWA` entregam o fallback offline e o prompt “Add to Home Screen”; durante o desenvolvimento rode `npm run dev` e veja o cache em `Application > Service Workers`; para testar o build execute `npm run build` seguido de `npm run preview`.
- Alertas e dashboards consomem `/alertas`, `/analytics/*` e `/traducoes`. Mantenha `ENABLE_ANALYTICS_ROUTES=true` no `.env` e `VITE_API_URL=http://localhost:4000` para o `LocalizacaoContext`, os hooks de alertas/analytics e o painel clínico receberem dados reais durante a validação dos fluxos com o Fastify.

## Manual QA rápido

- Configure `.env` + `.env.local`: defina `VITE_API_URL=http://localhost:4000`, `DATABASE_URL=postgresql://personapp:personapp-dev@localhost:5432/personaclinic`, `JWT_SECRET`, `SMTP_*` e `ENABLE_ANALYTICS_ROUTES=true`.
- Rode os servidores em paralelo (`npm run bootstrap`, depois `npm run backend:dev` em uma aba e `npm run dev` na outra) e use as contas seedadas para confirmar login de paciente e profissional.
- Navegue pelos fluxos principais: dashboards profissional/paciente, agenda semanal, financeiro (charges/recibos), alertas clínicos multilíngues e cartões do `LocalizacaoContext`.
- Use o DevTools > Application para inspecionar o service worker/cache e o `InstallPrompt` ou execute `npm run build && npm run preview` para validar o bundle final.
- Ao alterar rotas (`registerRoutes`) ou o flag `ENABLE_ANALYTICS_ROUTES`, reexecute `npm --prefix backend run test` para garantir que filtros/overrides/comum options continuam funcionando.

## Fluxo QA e scripts úteis

- Consulte `docs/QA_CHECKLIST.md` para a sequência completa após o bootstrap (mesmos fluxos mencionados acima).
- `docs/DB_CONNECTION.md` mostra como levantar o Postgres, preparar `.env`/`.env.local` e manter o Prisma/migrations/seed alinhados com a URL `postgresql://personapp:personapp-dev@localhost:5432/personaclinic`.
- Os scripts do `package.json` (`npm run db:up`/`db:down`/`db:logs`, `npm run backend:bootstrap`, `npm run bootstrap`, `npm run backend:dev`, `npm run backend:test`) automatizam o banco, Prisma e os testes antes de rodar o frontend (`npm run dev`).

- Use `npm run qa:validate-env` para verificar `.env.local` + `backend/.env`, `npm run qa:prep` para executar o bootstrap completo, `npm run qa:start` para abrir backend + frontend (concurrently) e `npm run qa:checklist` para caminhar pelo QA interativo.

## Docker

Use `npm run db:up` (ou `npm run bootstrap` para subir o Postgres + preparar o Prisma/seed) antes de rodar os servidores. Pare com `npm run db:down` e acompanhe logs com `npm run db:logs`.
