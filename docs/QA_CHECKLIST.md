# QA Checklist

This guide captures the quick manual validation needed after the bootstrap flow and before considering the MVP stable.

## Environment

- Copy `.env.example` to `.env` inside `backend/` and `.env.local` at the root.
- Ensure the values align:
  - `VITE_API_URL=http://localhost:4000`
  - `DATABASE_URL=postgresql://personapp:personapp-dev@localhost:5432/personaclinic`
  - `JWT_SECRET` set to something secure
  - `SMTP_HOST/PORT/USER/PASS/FROM` configured for Mailpit/MailHog or your SMTP test server
  - `ENABLE_ANALYTICS_ROUTES=true` to expose `analytics` endpoints

## Bootstrap

1. Run `npm install` once at the root (and inside `backend/` if dependencies change).
2. Execute `npm run bootstrap` to spin up Postgres (`db:up`), install backend deps, generate Prisma client, run migrations and seed demo data.
3. Confirm the database is healthy (`npm run db:logs` or `docker compose logs -f postgres`).

## Runtime

1. Run `npm run qa:start` to start Fastify + Vite via `concurrently` (or, if you prefer, open two terminals and run `npm run backend:dev` + `npm run dev`).
2. Open `http://localhost:4000/health` to ensure the API responds.
3. Visit `http://localhost:8080` and perform the functional checks below.

## Functional checklist

- **Authentication:** log in with seeded professional and patient accounts (use credentials from the backend seed data) and confirm tokens are persisted via `auth-service.ts`.
- **Dashboards:** validate both professional and patient dashboards for cards, translations coming from `/traducoes`, and analytics widgets driven by `/analytics/*`.
- **Agenda:** check the weekly agenda screen (`TelaAgendaSemanal`) for sessions, ability to view details, and that payments/status/data come from `/sessoes`.
- **Finance:** open the financial pages, review charges/recibos, mark payments, and ensure totals use data from `/financeiro`.
- **Alerts:** visit the alert panel (`TelaAlertasClinicos`) and confirm `/alertas` data loads, updates work, and the `LocalizacaoContext` uses `/traducoes` for labels.
- **Service worker / PWA:** open DevTools > Application > Service Workers to verify the worker is registered; trigger `InstallPrompt` via `src/components/pwa/InstallPrompt.tsx` or run `npm run build && npm run preview` to test the production cache.

## Guardrails

- After touching `backend/src/routes/registerRoutes.ts` filter/override logic or adding new plugins, re-run `npm --prefix backend run test`.
- If you change schema or environment values, rerun `npm run backend:bootstrap` (or the individual Prisma commands) so migrations and seeds stay in sync.

## References

- `README.md` – quickstart and environment summary.
- `docs/backend-postgres.md` – backend routes, scripts and analytics flag.
- `docs/frontend.md` – frontend env vars and hooks.
- `docs/ROADMAP.md` – migration priorities and pending decisions.
