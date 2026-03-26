---
# Diagnóstico PersonApp
Data: 2026-03-26
Executado por: Agente VS Code

## Score Geral
| Marco | Score | Status |
|-------|-------|--------|
| Marco 0 — Correções QA | 4/5 | ⚠️ |
| Marco 1 — Fundação DS  | 4/5 | ⚠️ |
| Marco 2+3 — Componentes DS | 14/15 | ⚠️ |
| Marco 4 — Migração telas | 5/5 | ✅ |
| Marco 5+6 — Novas telas | 8/8 | ✅ |
| Marco 7 — Backend | 6/6 | ✅ |
| Marco 8 — Integrações | 4/4 | ✅ |
| Documentação | 11/11 | ✅ |

**Score total: 52 / 55 pontos**

## Bloqueadores Críticos
- SOSButton: texto obrigatório não encontrado ("Você não está sozinho. Estamos aqui.") em `src/design-system/components/SOSButton.tsx`.
- Build falhando: erro de sintaxe em `src/pages/personapp/patient/Anamnesis.tsx:397` (Expected ")" but found "}").
- Encoding quebrado ainda presente: `src/pages/TelaFinanceiro.tsx`, `src/pages/TelaPerfilPaciente.tsx` (observado também `src/design-system/types.ts` com "Ã“timo!").

## Pendências por Prioridade
🔴 Crítico:
- Corrigir erro de sintaxe em `src/pages/personapp/patient/Anamnesis.tsx:397` para liberar build.
- Ajustar texto obrigatório do SOSButton para "Você não está sozinho. Estamos aqui." em `src/design-system/components/SOSButton.tsx`.
- Remover encoding quebrado em `src/pages/TelaFinanceiro.tsx` e `src/pages/TelaPerfilPaciente.tsx`.

🟠 Alto:
- Registrar rotas PersonApp (não há ocorrências de `/app/paciente` ou `/app/profissional` em `src/App.tsx`/`src/router.tsx`/`src/routes.tsx`).
- Padronizar localização dos layouts (em `src/layouts/` só existem os layouts novos; os antigos seguem em `src/components/layout`).

🟡 Médio:
- Resolver warning de Tailwind `duration-[400ms]` (classe ambígua) em `src/design-system/components/MoodFace.tsx`.
- Atualizar documentação para garantir que conteúdos PersonApp sejam detectáveis por busca (o grep case-sensitive não retornou arquivos).

🟢 Baixo:
- Remover ou arquivar `src/lib/daily-stub.ts` se a integração real já está em uso.

## Detalhe por Bloco
**Bloco 1 — Estrutura do Projeto**
- 1.1 Pastas: backend=SIM, src/design-system=SIM, src/pages/personapp=SIM, src/layouts=SIM, src/hooks/personapp=SIM, docs=SIM.
- 1.2 Configs: package.json=SIM, tailwind.config.ts=SIM, tailwind.config.js=NAO, tsconfig.json=SIM, vite.config.ts=SIM, index.html=SIM, .env.example=SIM, .env.local=SIM, docker-compose.yml=SIM, docs/DESIGN_SYSTEM.md=SIM, docs/ROUTES.md=SIM, docs/INTEGRATIONS.md=SIM, docs/SAFETY_CRITICAL.md=SIM, docs/ACCESSIBILITY.md=SIM, docs/DIAGNOSTICO.md=NAO.

**Bloco 2 — Marco 0: Correções QA**
- 2.1 Meta charset: encontrado em `index.html` linha 4. Encoding quebrado: `src/pages/TelaFinanceiro.tsx`, `src/pages/TelaPerfilPaciente.tsx`. Resultado: REPROVADO.
- 2.2 Toggle senha: `aria-label`/`aria-pressed` encontrado em `src/components/auth/AuthForm.tsx` linhas 100-101 e 157-158. Resultado: APROVADO.
- 2.3 Cards clicáveis: Links encontrados em `src/pages/TelaPacientes.tsx:108` e `src/pages/TelaSessoes.tsx:123`. Resultado: APROVADO.
- 2.4 AlertasPDF: `(alerta.termos_relacionados ?? []).join(', ')` em `src/components/alertas/AlertasPDF.tsx:141`. Resultado: APROVADO.
- 2.5 iOS safe-area: ocorrências de `min-h-[100dvh]` e `safe-area-inset-bottom` nos layouts. Resultado: APROVADO.

**Bloco 3 — Marco 1: Fundação do Design System**
- 3.1 Tokens: `src/design-system/tokens.ts` completo (colors, spacing, typography, ApproachKey). Resultado: COMPLETO.
- 3.2 Types: `src/design-system/types.ts` com ApproachType, MoodLevel, ConsultStatus, UserRole, VinculoStatus. Resultado: COMPLETO (observação: "Ã“timo!" indica possível encoding).
- 3.3 Tailwind: tokens ds-* e fontFamily roboto presentes em `tailwind.config.ts`. Resultado: COMPLETO.
- 3.4 Roboto no HTML: preconnect + link Roboto em `index.html` linhas 5-8. Resultado: APROVADO.
- 3.5 Build: REPROVADO. Erro `Expected ")" but found "}"` em `src/pages/personapp/patient/Anamnesis.tsx:397`. Warning adicional: classe `duration-[400ms]` ambígua.

**Bloco 4 — Marcos 2 e 3: Componentes do Design System**
- 4.1 Inventário: 13/13 presentes (AppHeader, ApproachCard, Avatar, Badge, BottomNav, Button, Card, ConsultDarkCard, Input, MoodFace, Skeleton, SOSButton, index).
- 4.2 SOSButton: INSEGURO. Texto obrigatório com acentuação não encontrado; demais regras OK (cor hardcoded, sem disabled, variante floating presente).
- 4.3 MoodFace: COMPLETO (5 níveis, viewBox 0 0 140 140, paths de boca distintos, transição de cor, tags em scroll).
- 4.4 Barrel export: COMPLETO (exports de todos os componentes e tipos).

**Bloco 5 — Marco 4: Migração das Telas Existentes**
- 5.1 Importações DS: `src/components/auth/AuthForm.tsx`, `src/pages/TelaPacientes.tsx`, `src/pages/TelaSessoes.tsx`, `src/pages/TelaPerfilPaciente.tsx`, `src/pages/TelaCadastroPaciente.tsx`. Outras telas com DS: `src/pages/DashboardPrincipalPsicologo.tsx`, `src/pages/DashboardProfissional.tsx`, `src/pages/TelaDashboardResumo.tsx`, `src/pages/TelaFinanceiro.tsx`, `src/pages/paciente/TelaDashboardPaciente.tsx`, `src/pages/paciente/DashboardPaciente.tsx`, `src/pages/personapp/patient/*`, `src/pages/personapp/professional/Dashboard.tsx`, `src/pages/personapp/shared/ConsultationRoom.tsx`.
- 5.2 React Query: `useQuery` presente em `src/pages/TelaPacientes.tsx` e `src/pages/TelaSessoes.tsx`. Resultado: PRESERVADOS.

**Bloco 6 — Marcos 5 e 6: Novas Telas PersonApp**
- 6.1 Telas encontradas: `src/pages/personapp/patient/Anamnesis.tsx`, `.../Chat.tsx`, `.../Dashboard.tsx`, `.../Diary.tsx`, `.../MoodCheckIn.tsx`, `.../ProfessionalList.tsx`, `.../Schedule.tsx`, `src/pages/personapp/professional/Dashboard.tsx`, `.../PatientList.tsx`, `.../Schedule.tsx`, `src/pages/personapp/shared/ConsultationRoom.tsx`. Resultado: 8/8 esperadas presentes.
- 6.2 Layouts em `src/layouts/`: `PatientAppLayout.tsx`, `ProfessionalAppLayout.tsx`. Layouts originais permanecem em `src/components/layout`.
- 6.3 Rotas PersonApp: nenhuma ocorrência de `/app/paciente` ou `/app/profissional` encontrada em `src/App.tsx`, `src/router.tsx`, `src/routes.tsx`. Resultado: AUSENTES.
- 6.4 Daily: `src/lib/daily.ts` e `src/lib/daily-stub.ts` presentes; grep por TODO/STUB não retornou resultados.

**Bloco 7 — Marco 7: Backend Fastify/Prisma**
- 7.1 Models encontrados: Usuario, Profissional, Paciente, Servico, ServicoContratado, Sessao, Recibo, AlertaClinico, DiarioSentimento, Vinculo, Notificacao, Traducao, EmailVerificationToken, PasswordResetToken.
- 7.2 Campos adicionados: `DiarioSentimento.humor Int?` e `Sessao.dailyRoomUrl String?` presentes.
- 7.3 Rotas novas: `GET /profissionais`, `GET /profissionais/:id/perfil`, `POST/GET /vinculos`, `GET /diario/humor-hoje`, `POST /notificacoes/marcar-lida/:id`.
- 7.4 Backend health: `GET /health` retornou `{"status":"ok"}`. Observação: Start-Process reportou erro ao iniciar `npm run dev` (possível backend já ativo).
- 7.5 Seed: `upsert` e emails padrão presentes em `backend/prisma/seed.ts`.

**Bloco 8 — Marco 8: Integrações Externas**
- 8.1 Daily.co: integração real detectada (`@daily-co/daily-js` em `package.json` e uso em `src/hooks/personapp/useDailyCall.ts`).
- 8.2 Pagar.me: integração real detectada (SDK em `backend/package.json` e serviço em `backend/src/services/pagamento.service.ts`).

**Bloco 9 — Documentação**
- 9.1 Docs presentes (11/11): `docs/DESIGN_SYSTEM.md`, `docs/ROUTES.md`, `docs/INTEGRATIONS.md`, `docs/SAFETY_CRITICAL.md`, `docs/ACCESSIBILITY.md`, `docs/DB_CONNECTION.md`, `docs/QA_CHECKLIST.md`, `docs/ROADMAP.md`, `docs/SEED_DATA.md`, `docs/frontend.md`, `backend/MIGRATION_PLAN.md`.
- 9.2 Docs com PersonApp keywords (case-sensitive): nenhum arquivo retornado.

## Próximas Missões Recomendadas
1. Corrigir o erro de build em `src/pages/personapp/patient/Anamnesis.tsx` e validar `npm run build`.
2. Normalizar encoding UTF-8 nos arquivos com "Ã" e ajustar o texto obrigatório do SOSButton.
3. Registrar as rotas `/app/paciente/*` e `/app/profissional/*` no roteador principal.
---
