# PersonApp — Onboarding do Agente

> Leia este arquivo PRIMEIRO em qualquer sessão nova.
> Ele resume todo o histórico de decisões e estado atual do projeto.

---

## O que é o PersonApp

Plataforma de telepsicologia brasileira.
Stack: React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui
       + TanStack Query + Fastify + Prisma + PostgreSQL

Repositório: carlosmartins08/03.-MVP_Personapp_Pro--COLLABY.T-

---

## Arquitetura — duas camadas de telas

IMPORTANTE: existem duas camadas de telas no projeto.

| Camada | Pasta | Rotas | Status |
|--------|-------|-------|--------|
| Antiga (Lovable) | src/pages/ | /dashboard, /pacientes, etc. | Legado — será arquivada |
| Nova (PersonApp) | src/pages/personapp/ | /app/paciente/*, /app/profissional/* | ATIVA — foco do desenvolvimento |

As telas em src/pages/personapp/ são o produto real.
As telas em src/pages/ são legado do gerador Lovable e serão arquivadas.

---

## Design System

Fonte única de verdade: docs/design-system.md
Manual do agente: src/design-system/DS_REFERENCE.md

Regras obrigatórias — NUNCA violar:
1. NUNCA usar hex hardcoded — sempre tokens de src/design-system/tokens.ts
2. NUNCA importar de @/components/ui nas telas personapp/
3. SEMPRE usar font-roboto nas telas personapp/
4. SEMPRE usar AppHeader no topo das telas personapp/
5. SOSButton NUNCA recebe disabled, NUNCA opacity < 1, cor SEMPRE #C0392B
6. Cores por abordagem: colors.approach[key] do tokens.ts

Importação correta dos componentes DS:
  import { Button, Input, Card, Avatar, Badge, Skeleton } from '@/design-system/components'
  import { AppHeader, BottomNav, MoodFace, SOSButton } from '@/design-system/components'
  import { ConsultDarkCard, ApproachCard } from '@/design-system/components'
  import { PageHeader, Tabs, Label, Textarea, EmptyState } from '@/design-system/components'

Componentes que PERMANECEM em shadcn (sem equivalente DS):
  dialog, select, toast/useToast, sheet, switch, progress,
  scroll-area, dropdown-menu, chart

---

## Estado atual do projeto

Build: ✅ passando (npm run build ~11s)
TypeScript: ✅ limpo (npx tsc --noEmit)
Backend: ✅ /health ok, JWT funcionando
Banco: PostgreSQL via Docker, seed ok

Credenciais de desenvolvimento:
  Psicólogo: psicologo@personapp.dev / Senha123!
  Paciente:  paciente@personapp.dev / Paciente123!

Docker:
  container: personapp-postgres-dev
  porta: 5432
  DATABASE_URL: postgresql://personapp:personapp-dev@localhost:5432/personaclinic

---

## O que já foi feito (não refazer)

### Design System
- [x] tokens.ts com cores, spacing, typography, ApproachKey
- [x] 14 componentes DS criados e coerentes
- [x] Tailwind configurado com classes ds-*
- [x] Roboto via Google Fonts
- [x] DS_REFERENCE.md atualizado

### Migração de telas
- [x] 121 imports shadcn removidos de src/pages/
- [x] 36 de 46 telas com zero imports shadcn
- [x] 10 telas com apenas shadcn permitido (dialog/select/toast/etc)

### Backend
- [x] Models Vinculo e Notificacao no Prisma
- [x] Rotas /profissionais e /vinculos criadas
- [x] Seed funcionando com dados reais

### Performance
- [x] vendor-pdf em lazy loading (3 componentes)
- [x] Bundle sem warnings de chunk size

---

## Pendências abertas (próximas missões)

### CRÍTICO
- [ ] Definir rota raiz: / deve apontar para telas PersonApp novas
- [ ] Arquivar telas Lovable em src/pages/_legacy/
- [ ] Corrigir chaves i18n cruas exibidas nas telas
      (ultimo_diario, bem_vindo_dashboard, etc.)

### ALTO
- [ ] Dashboard paciente: card hero sessão + check-in humor
- [ ] Dashboard profissional: sidebar responsiva (colapsa em mobile)
- [ ] Login: header mobile quando painel azul some
- [ ] 4 telas PersonApp incompletas: Schedule, PatientList, Chat, Diary

### MÉDIO
- [ ] Integração real Daily.co (stub em src/lib/daily-stub.ts)
- [ ] Responsividade: meta 30+ classes responsivas
- [ ] AppHeader nas 4 telas incompletas

### BAIXO
- [ ] Integração Pagar.me (chave configurada, SDK instalado)
- [ ] Prisma 5.22 → 7.6 (major upgrade)
- [ ] npm audit: 24 vulnerabilidades

---

## Arquivos importantes

| Arquivo | Para que serve |
|---------|---------------|
| src/design-system/tokens.ts | Todos os tokens de cor, spacing, typography |
| src/design-system/DS_REFERENCE.md | Manual visual completo para o agente |
| docs/design-system.md | Especificação DS v2.0 para humanos |
| docs/SAFETY_CRITICAL.md | Regras do SOSButton — ler antes de tocar nele |
| docs/ROUTES.md | Mapa completo de rotas |
| docs/INTEGRATIONS.md | Daily.co e Pagar.me |
| backend/MIGRATION_PLAN.md | Plano de migrations do banco |
| src/routes/appRoutes.tsx | Registro de rotas personapp/ |

---

## Fluxo de trabalho do agente

Antes de QUALQUER missão visual:
  cat src/design-system/DS_REFERENCE.md

Antes de QUALQUER missão de rota ou navegação:
  cat docs/ROUTES.md
  cat src/routes/appRoutes.tsx

Antes de QUALQUER missão de backend:
  cat backend/MIGRATION_PLAN.md
  cat backend/src/routes/

Antes de tocar no SOSButton:
  cat docs/SAFETY_CRITICAL.md

Após QUALQUER missão:
  npm run build
  npx tsc --noEmit

---

## Decisões de produto já tomadas

- Fonte: Roboto (não Inter, não system-ui)
- Cor primária: #3055A4 (não pode mudar)
- Grid base: 4px
- Estilo: flat, clean, acolhedor — sem gradientes decorativos
- SOSButton: #C0392B — imutável por design ético
- Layout mobile: max-w-lg mx-auto px-4, BottomNav fixa
- Layout profissional web: sidebar 220px colapsável
- Conteúdo: português brasileiro — sem chaves i18n expostas
- Automação: Make.com → WordPress (para blog TAG08, projeto paralelo)

---

> Última atualização: março 2026
> Sessão de origem: jornada completa de DS + migração + auditoria visual