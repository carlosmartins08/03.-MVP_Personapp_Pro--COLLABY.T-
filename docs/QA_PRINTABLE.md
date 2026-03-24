# QA Printable Checklist

Use this page as a quick-reference or print-out when validating the stack.

1. [ ] **Environment** – `.env.local` and `backend/.env` contain `VITE_API_URL=http://localhost:4000`, `DATABASE_URL=postgresql://personapp:personapp-dev@localhost:5432/personaclinic`, `JWT_SECRET`, `SMTP_HOST/PORT/USER/PASS/FROM`, `ENABLE_ANALYTICS_ROUTES=true`.
2. [ ] **Bootstrap** – Run `npm run qa:prep` (or `npm run bootstrap`), confirm `docker compose logs -f postgres` shows ready.
3. [ ] **Servers** – Launch `npm run qa:start` (or `npm run backend:dev` + `npm run dev` in separate shells); check `http://localhost:4000/health` and `http://localhost:8080`.
4. [ ] **Login** – Sign in as `psicologo@personapp.dev`/`Senha123!` and `paciente@personapp.dev`/`Paciente123!`; ensure `/auth/me` returns both profiles.
5. [ ] **Dashboards & analytics** – Browse professional and patient dashboards; `ENABLE_ANALYTICS_ROUTES=true` should unlock `/analytics/*` with data coming through `LocalizacaoContext`.
6. [ ] **Agenda** – Validate the weekly agenda (`TelaAgendaSemanal`) uses `/sessoes` for status, payments, and notes.
7. [ ] **Financeiro** – Check charges/recibos, payments, and `/financeiro/resumo` totals.
8. [ ] **Alertas clínicos** – Ensure `/alertas` CRUD works and translations from `/traducoes` appear in `LocalizacaoContext`.
9. [ ] **Service Worker / PWA** – Inspect `Application > Service Workers`, exercise `InstallPrompt`, and run `npm run build && npm run preview` to confirm the cache.
10. [ ] **Guardrails** – After touching routes/analytics rerun `npm --prefix backend run test`; after resetting the database rerun `docker compose down && npm run bootstrap`.

Print or keep this checklist open while working through QA to mark completed steps and capture any follow-up actions.
