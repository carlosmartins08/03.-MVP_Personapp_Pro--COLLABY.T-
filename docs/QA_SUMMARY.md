# QA Summary

This brief keeps the documented QA flow aligned with the scripts so you know the commands to run in order:

1. **Validate env files**  
   ```
   npm run qa:validate-env
   ```
   Confirms `.env.local` and `backend/.env` expose `VITE_API_URL=http://localhost:4000`, `DATABASE_URL`, `JWT_SECRET`, `SMTP_*` and `ENABLE_ANALYTICS_ROUTES=true`.

2. **Prepare the stack**  
   ```
   npm run qa:prep
   ```
   Wire up PostgreSQL + Prisma migrations + seeds (calls `npm run bootstrap` internally) and prints reminders to launch the servers.

3. **Start backend + frontend**  
   ```
   npm run qa:start
   ```
   Uses `concurrently` to execute `npm run backend:dev` and `npm run dev` together; no need for manual terminal juggling.

4. **Walk through the checklist**  
   ```
   npm run qa:checklist
   ```
   Prompts for each QA piece (login as `psicologo@personapp.dev` / `paciente@personapp.dev`, dashboards, agenda, financeiro, alertas multilíngues, analytics, service worker).

5. **Confidence steps**  
   - Re-run `npm --prefix backend run test` after touching `backend/src/routes/registerRoutes.ts` or the analytics flag to keep the registry guard green.  
   - If you recreate the database, tear down & rebuild:
     ```
     docker compose down
     npm run bootstrap
     ```
   - Check `docs/SEED_DATA.md` for the seeded emails/passwords and entities the frontend expects.

6. **References**  
   - `docs/DB_CONNECTION.md` – detailed env, Docker, migrations, reset instructions.  
   - `docs/QA_CHECKLIST.md` – functional validations for each screen/route.  
   - `docs/SEED_DATA.md` – credential + demo data reference.
