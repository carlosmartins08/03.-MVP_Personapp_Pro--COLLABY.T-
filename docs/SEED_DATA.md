# Seed data reference

This note covers the demo users and business data created by `backend/prisma/seed.ts`, so you know which credentials to use during the QA flows.

## Credentials

- **Professional**
  - Email: `psicologo@personapp.dev`
  - Password: `Senha123!`

- **Patient**
  - Email: `paciente@personapp.dev`
  - Password: `Paciente123!`

Both accounts are upserted with verified emails and stored via Argon2 hashes automatically whenever `npm run seed` runs.

## Entities created

- `Profissional`: `Dr. Marina Pessoa` (CRP `06/123456`, psicologia clínica).  
- `Paciente`: `Ana Costa`, tag `statusRanqueado="normal"`, `totalFaltas=1`, `telefone="+5511999999999"`.
- `Serviço`: `Psicoterapia Individual` (online, R$250 por sessão).  
- `Contrato`: `contrato-anacosta` com 12 sessões ativas.  
- `Sessões`:  
  - `sessao-1` (futura, online, pagamento pendente).  
  - `sessao-2` (realizada presencial, pagamento pago, anotação com práticas respiratórias).  
- `Recibo`: `recibo-sessao-2` associado à sessão presencial.  
- `Alerta clínico`: `alerta-anacosta-1` (nível moderado, status aberto).  
- `Diário de sentimentos`: `diario-anacosta-1` com texto e sentimento “calmo”.

## How to reuse

1. Always run `npm run bootstrap` (or `npm run backend:bootstrap`) after recreating the database so the seed re-applies.  
2. Use the seeded emails/passwords when exercising `TelaAlertasClinicos`, financeiro dashboards, agenda and other hooks.  
3. If you need additional patients/professionals, extend `backend/prisma/seed.ts` and rerun `npm run seed`.

This documentation lives under `docs/` so the QA flow and seed data stay in the same folder hierarchy as the other onboarding docs.
