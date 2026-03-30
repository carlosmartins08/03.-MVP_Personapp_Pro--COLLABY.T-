# PersonApp — Onboarding do Agente

> Leia este arquivo PRIMEIRO em qualquer sessão nova.
> Última atualização: 2026-03-28

---

## O que é o PersonApp
Plataforma de telepsicologia brasileira.
Stack: React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui
       + TanStack Query + Fastify + Prisma + PostgreSQL

---

## Arquitetura
- Telas ativas: src/pages/personapp/ → /app/paciente/* e /app/profissional/*
- Telas legado: src/pages/_legacy/ (arquivadas, sem rotas ativas)
- Layouts: src/layouts/PatientAppLayout.tsx e ProfessionalAppLayout.tsx
- Rotas: src/routes/appRoutes.tsx

---

## Design System
- Fonte única: docs/design-system.md
- Manual do agente: src/design-system/DS_REFERENCE.md
- Tokens: src/design-system/tokens.ts
- Componentes: src/design-system/components/index.ts

Regras obrigatórias:
1. NUNCA hex hardcoded — sempre tokens de tokens.ts
2. NUNCA importar de @/components/ui nas telas personapp/
3. SEMPRE font-roboto nas telas personapp/
4. SEMPRE AppHeader no topo das telas personapp/
5. SOSButton NUNCA disabled, NUNCA opacity < 1, cor SEMPRE #C0392B
6. Cores por abordagem: colors.approach[key]

Shadcn permitido (sem equivalente DS):
dialog, select, toast, sheet, switch, progress,
scroll-area, dropdown-menu, chart

---

## Estado atual — Build
- npm run build: ✅ ~5s
- npx tsc --noEmit: ✅ limpo
- backend npx tsc --noEmit: ✅ limpo
- Banco: PostgreSQL Docker, schema up to date
- Zero mocks em src/pages/personapp/

Credenciais dev:
  psicologo@personapp.dev / Senha123!
  paciente@personapp.dev  / Paciente123!

Docker:
  container: personapp-postgres-dev
  DATABASE_URL: postgresql://personapp:personapp-dev@localhost:5432/personaclinic

---

## RFs — Status completo

| RF    | Nome                          | Status        |
|-------|-------------------------------|---------------|
| RF014 | Anamnese                      | ✅ CONCLUÍDO  |
| RF016 | Vínculo profissional-paciente | ✅ CONCLUÍDO  |
| RF018 | Sala de consulta              | ✅ CONCLUÍDO  |
| RF019 | Confirmação de participação   | ✅ CONCLUÍDO  |
| RF023 | Plano de tratamento           | ✅ CONCLUÍDO  |
| RF024 | Pagamento (boleto Pagar.me)   | ✅ CONCLUÍDO  |
| RF025 | Agendamento                   | ✅ CONCLUÍDO  |
| RF027 | Notificações                  | ✅ CONCLUÍDO  |
| Chat  | Mensagens em tempo real       | ✅ CONCLUÍDO  |
| RF020 | Gera??o de documentos PDF | ? SIM | ? SIM | ? CONCLU?DO |

---

## Telas PersonApp — inventário completo

| Tela                          | Dados reais | Observação                        |
|-------------------------------|-------------|-----------------------------------|
| patient/Anamnesis             | ✅          | Fluxo 4 etapas + triagem 8 abord. |
| patient/Chat                  | ✅          | API real + polling 5s             |
| patient/Dashboard             | ✅          | Card hero + check-in + vínculo    |
| patient/Diary                 | ✅          |                                   |
| patient/MeuPlano              | ✅          | Plano do profissional somente leitura |
| patient/MoodCheckIn           | ✅          |                                   |
| patient/Pagamentos            | ✅          | Boleto via Pagar.me               |
| patient/ProfessionalList      | ✅          | Cria vínculo                      |
| patient/Schedule              | ✅          | Confirmar presença + entrar       |
| professional/Dashboard        | ✅          |                                   |
| professional/PatientList      | ✅          | Lista vínculos + link plano       |
| professional/PlanoTratamento  | ✅          | Cria e edita plano por paciente   |
| professional/Schedule         | ✅          | Inicia sessão confirmada          |
| shared/ConsultationRoom       | ✅          | Daily.co real (com fallback)      |
| shared/Notificacoes           | ✅          | Badge + polling 30s               |

---

## Fluxo clínico completo

Cadastro → Anamnese → Vínculo → Agendamento
    → Confirmação → Sala Daily.co → Chat
    → Plano de Tratamento → Pagamento → Notificações

---

## Pendências abertas

### 🟡 Funcional
- [x] RF020 ? PDF fluxo PersonApp conclu?do
- [ ] UX pagamentos — erros, boleto expirado, reprocessamento
- [ ] Webhook Pagar.me para conciliação automática

### 🟢 Técnico
- [x] npm audit ? 0 cr?ticas/altas (2 moderadas esbuild/vite ? sem a??o)
- [x] browserslist ? atualizado
- [ ] Prisma 5.22 → 7.6 (major upgrade)

### 🎨 Visual (próxima grande entrega)
- [x] DS v3 — Fase 1 + Fase 2 concluídas (15/15 telas)
      Plano completo em: docs/DS_V3_PLAN.md
      Fase 1: tokens + tipografia (Sora + Manrope) + componentes
      Fase 2: aplicar nas telas (piloto: patient/Dashboard)

---

## Integrações — chaves necessárias em produção

| Serviço   | Variável          | Arquivo           | Status        |
|-----------|-------------------|-------------------|---------------|
| Daily.co  | DAILY_API_KEY     | backend/.env      | 🟡 stub/fallback |
| Pagar.me  | PAGAR_ME_API_KEY  | backend/.env      | 🟡 configurado   |

---

## Arquivos importantes

| Arquivo                              | Para que serve                    |
|--------------------------------------|-----------------------------------|
| src/design-system/tokens.ts          | Tokens de cor, spacing, typography |
| src/design-system/DS_REFERENCE.md    | Manual visual para o agente       |
| docs/design-system.md                | Especificação DS v2.0             |
| docs/DS_V3_PLAN.md                   | Plano de evolução visual v3       |
| docs/SAFETY_CRITICAL.md              | Regras SOSButton                  |
| docs/ROUTES.md                       | Mapa de rotas                     |
| docs/INTEGRATIONS.md                 | Daily.co e Pagar.me               |
| backend/src/routes/registerRoutes.ts | Registry de todas as rotas        |
| backend/prisma/schema.prisma         | Schema completo do banco          |

---

## Fluxo de trabalho do agente

Antes de QUALQUER missão:
  cat ONBOARDING.md

Antes de missão visual:
  cat src/design-system/DS_REFERENCE.md

Antes de missão de rota:
  cat src/routes/appRoutes.tsx

Antes de missão de backend:
  cat backend/src/routes/registerRoutes.ts
  grep "^model " backend/prisma/schema.prisma

Antes de tocar no SOSButton:
  cat docs/SAFETY_CRITICAL.md

Após QUALQUER missão:
  npm run build
  npx tsc --noEmit

---

## Decisões de produto imutáveis
- Fonte: Roboto (DS v2) → Sora + Manrope (DS v3 quando iniciado)
- Cor primária: #3055A4
- Grid base: 4px
- Estilo: flat, clean, acolhedor — sem gradientes decorativos
- SOSButton: #C0392B — imutável por decisão ética
- Layout mobile: max-w-lg mx-auto px-4, BottomNav fixa
- Layout profissional web: sidebar colapsável em mobile
- Conteúdo: português brasileiro
- Método de pagamento atual: boleto (sem cartão ou PIX nesta fase)

