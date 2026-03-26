# Database Connection Guide

This guide walks the developer through the missing pieces of the database connection so the backend + frontend stack can run 100% locally while you validate the manual QA flow described in `docs/QA_CHECKLIST.md`.

## 1. Postgres container (docker-compose)

1. Confirm Docker is running on your machine.
2. Use the repository root `docker-compose.yml`:

```bash
docker compose up -d postgres
```

3. Validate health:

```bash
docker compose logs -f postgres
```

4. The service exposes:

| Variable           | Value |
|--------------------|-----------------------------|
| POSTGRES_DB        | `personaclinic` |
| POSTGRES_USER      | `personapp` |
| POSTGRES_PASSWORD  | `personapp-dev` |
| Port               | `5432` |


## 2. Environment files

- At the root, copy `.env.example` ➜ `.env.local` for the frontend and fill:
  - `VITE_API_URL=http://localhost:4000`
  - `VITE_DEFAULT_LANGUAGE=pt`
  - `VITE_FRONTEND_URL=http://localhost:8080`
  - `VITE_EMAIL_VERIFICATION_REDIRECT_URL=http://localhost:8080/confirm`

- In `backend/`, copy `.env.example` ➜ `.env` and set:
  - `DATABASE_URL=postgresql://personapp:personapp-dev@localhost:5432/personaclinic`
  - `PORT=4000`
  - `JWT_SECRET` (secure secret)
  - `JWT_REFRESH_SECRET` (secure refresh secret)
  - `SMTP_HOST=localhost`, `SMTP_PORT=1025`, `SMTP_USER=`, `SMTP_PASS=`, `SMTP_FROM=no-reply@personaclinic.local`
  - `ENABLE_ANALYTICS_ROUTES=true`
  - `DAILY_API_KEY=`
  - `PAGAR_ME_API_KEY=`
  - `SENDGRID_API_KEY=`
  - `FCM_SERVER_KEY=`

Always keep these env vars synchronized so the frontend/ backend talk to the same DB + API host.

## 3. Prisma & migrations

1. From repo root:

```bash
npm install                 # installs root deps
npm --prefix backend install # ensures backend deps match
npm run bootstrap           # runs db:up, installs, prisma:generate/migrate & seed
```

2. If you change `backend/prisma/schema.prisma`, regenerate/migrate manually:

```bash
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate
npm --prefix backend run seed
```

3. You can inspect the live database with any Postgres client (psql, TablePlus, DBeaver) using the same `DATABASE_URL`.

## 4. Backend dev server

- Run `npm run backend:dev` to start Fastify (watch mode). The server applies the `registerRoutes` filter that skips analytics when `ENABLE_ANALYTICS_ROUTES` is `false`; keep it `true` during QA.
- Verify `http://localhost:4000/health` responds before hitting the frontend.

## 5. Frontend dev server

- In another terminal run `npm run dev` so Vite picks up React + Tailwind.
- The frontend uses `VITE_API_URL` to build requests (see `src/lib/api.ts`).

## 6. Verify manual flow

Once backend + frontend are running:

1. Use seeded accounts (check `backend/prisma/seed.ts`) to log in as professional and patient.
2. Hit `TelaAgendaSemanal`, `TelaFinanceiro`, `TelaAlertasClinicos`, `DashboardProfissional`, `DashboardPaciente`.
3. Confirm `/alertas`, `/analytics/*`, `/recibos`, `/financeiro/resumo`, `/sessoes`, `/traducoes` return live data.
4. Open DevTools > Application > Service Workers for install prompt and cache validation (`public/service-worker.ts`).

## 7. Resetting the database

- Stop the servers; run:

```bash
docker compose down
docker compose up -d postgres
npm run bootstrap
```

This recreates the Postgres container, migrations, and seed data.

## 8. Useful commands recap

| Command | Purpose |
|---------|---------|
| `npm run db:up` | Ensures Postgres is running |
| `npm run db:down` | Stops Postgres container |
| `npm run db:logs` | Streams Postgres logs |
| `npm run backend:bootstrap` | Installs backend deps + prisma migration/seed |
| `npm run backend:test` | Runs the route registry guard |
| `npm run backend:dev` | Starts Fastify watch mode |
| `npm run dev` | Starts Vite |

## References

- `backend/prisma/seed.ts` – seeded credentials/pacientes/alertas.
- `backend/src/routes/registerRoutes.ts` – where analytics is gated.
- `docs/QA_CHECKLIST.md` – manual QA flow after the bootstrap and connection steps.
