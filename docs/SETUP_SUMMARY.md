# Common Setup Summary

This page summarises the main steps documented in the root README, in docs/frontend.md, docs/backend-postgres.md and in backend/README.md, focusing on the combined frontend + backend Postgres flow.

## 1. Frontend (PersonaApp Pro)

- **Stack:** Vite + React + TypeScript + Tailwind integrated with the Fastify + Prisma backend.
- **Env vars:** copy .env.example to .env.local and configure the mandatory VITE_API_URL, along with VITE_DEFAULT_LANGUAGE, VITE_FRONTEND_URL and VITE_EMAIL_VERIFICATION_REDIRECT_URL so the UI, emails and localization hooks stay consistent with the API.
- **Scripts:** 
pm run dev, 
pm run build, 
pm run preview and 
pm run lint cover development, production bundles and linting.
- **Best practices:** run 
pm run build before releasing, keep VITE_API_URL pointing at the Fastify server, and use docs/frontend.md for the full environment and PWA guidance.

## 2. Backend (Fastify + Prisma + PostgreSQL)

- **Stack:** Fastify + Prisma connecting to PostgreSQL plus nodemailer for transactional emails.
- **Env vars:** DATABASE_URL (Postgres), PORT (default 4000), JWT_SECRET, SMTP_HOST/PORT/USER/PASS/FROM, and the feature flag ENABLE_ANALYTICS_ROUTES=true to expose the analytics endpoints.
- **DB setup:** 
pm run prisma:generate, 
pm run prisma:migrate and 
pm run seed establish the schema and demo data.
- **Running:** 
pm run dev for watch mode, 
pm run build + 
pm run start for production, and 
pm run backend:test for the egisterRoutes guard.
- **Endpoints:** uth, pacientes, sessoes, inanceiro, lertas, ecibos, servicos*, 	raducoes and the optional nalytics routes; these feed the frontend hooks documented in docs/backend-postgres.md.

## 3. Fluxo recomendado

1. **Variáveis:** align .env.local (frontend) with .env (backend), ensuring the Postgres URL, JWT_SECRET, SMTP_*, VITE_API_URL and localization hints match the targets.
2. **Instalação e bootstrap:** run 
pm install at the root and then 
pm run bootstrap to bring up Postgres (db:up), regenerate the Prisma client, apply migrations and seed the data; rerun 
pm run backend:bootstrap whenever you need a fresh schema or demo set.
3. **Prisma manual:** after editing ackend/prisma/schema.prisma, run 
pm --prefix backend run prisma:generate, 
pm --prefix backend run prisma:migrate and 
pm --prefix backend run seed to keep your schema in sync.
4. **Dev:** start 
pm run backend:dev (Fastify) and 
pm run dev (Vite) in parallel so you can validate login, agenda, financeiro and alerts against the live API (http://localhost:4000/health).
5. **Checks:** 
pm run build (frontend), 
pm run backend:test (route registry) and 
pm run lint before any release.
6. **Docker Postgres:** 
pm run db:up, 
pm run db:down and 
pm run db:logs keep the local Postgres container manageable without touching your migrations.

## 4. Recursos críticos

- **PWA:** public/service-worker.ts plus src/components/pwa/InstallPrompt.tsx and usePWA enable offline caching and the install prompt; test it via 
pm run dev (watch the Service Workers panel) or 
pm run build && npm run preview to confirm the final asset manifest.
- **Alertas e analytics:** /alertas, /analytics/* and /traducoes feed the alert dashboards and LocalizacaoContext; keep ENABLE_ANALYTICS_ROUTES=true so those endpoints return real graphs and translations while validating the PWA offline behavior.

## 5. Manual QA

- Align .env.local with .env, making sure they contain VITE_API_URL=http://localhost:4000, DATABASE_URL=postgresql://personapp:personapp-dev@localhost:5432/personaclinic, JWT_SECRET, SMTP_* and ENABLE_ANALYTICS_ROUTES=true.
- After 
pm run bootstrap, run 
pm run backend:dev and 
pm run dev in separate shells and validate login (patient/professional), dashboards, agenda, financeiro, alertas multilíngues, and translations driven by /alertas, /analytics/* and /traducoes.
- Inspect Application > Service Workers to verify the service worker/install prompt, and repeat the flow via 
pm run build && npm run preview to confirm the production bundle’s cache.
- Rerun 
pm --prefix backend run test whenever you adjust egisterRoutes, analytics flags or overrides to ensure the registry stays guarded.

## 6. Referências rápidas

- README.md (root) – overview of frontend + backend Postgres, Quickstart and service explanations.
- docs/frontend.md – in-depth frontend env vars, scripts, PWA tips and hooks.
- docs/backend-postgres.md – backend setup, migrations, scripts, env vars and route overview.
- ackend/README.md – Fastify/Prisma guided steps, SMTP notes and Prisma CLI helpers.
- docs/ROADMAP.md – migration roadmap, priorities and pending decisions.

Keeping these documents synchronized ensures any new developer can reproduce the Postgres + Fastify stack and validate the React PWA flows quickly.
