# PersonaClinic - Roteiro Pós-Migração

O backend Fastify + Prisma já roda exclusivamente sobre PostgreSQL (veja `backend/README.md`). O objetivo agora é consolidar esse stack, garantir que os dashboards clínicos, agenda e financeiro consomem corretamente as rotas atuais e preparar o terreno para observabilidade, docs e PWA estáveis.

## Stack atual
- **Backend:** Fastify + TypeScript + plugins customizados (`auth`, `prisma`, `mailer`); `backend/src/routes` cobre auth, pacientes, sessões, financeiro, alertas, recibos e traduções.
- **Banco:** PostgreSQL (local via `docker compose up -d postgres` ou serviço externo) com Prisma, migrações (`npm run prisma:migrate`) e seed (`npm run seed`) para popular usuários/pacientes/sessões.
- **Autenticação:** JWT (`backend/src/plugins/auth.ts`), tokens de reset/verify regenerados a cada solicitação e bastidores de contexto para rotas públicas e privadas.
- **Infra:** Dino `docs/backend-postgres.md` e `docs/frontend.md` descrevem os scripts principais (`npm run dev`, `npm run build`, `backend/npm run dev`), variáveis obrigatórias (`VITE_API_URL`, `DATABASE_URL`, `JWT_SECRET`, `SMTP_*`) e os contratos usados pelos hooks React Query.

## Modelo de dados (referência)
O schema em `backend/prisma/schema.prisma` materializa uma estrutura consolidada de pacientes, profissionais, sessões, alertas clínicos, diário de sentimentos, traduções e tokens. O trecho abaixo resume as tabelas principais:

```sql
create table usuarios (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  senha_hash text not null,
  tipo text check (tipo in ('profissional','paciente')) not null,
  idioma_preferido text default 'pt',
  email_verificado boolean default false,
  criado_em timestamptz default now()
);

create table profissionais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references usuarios(id) on delete cascade,
  nome text not null,
  crp text,
  especialidade text,
  criado_em timestamptz default now()
);

create table pacientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references usuarios(id) on delete set null,
  nome text not null,
  email text,
  telefone text,
  data_nascimento date,
  genero text,
  cpf text,
  endereco text,
  observacoes text,
  status_ranqueado text check (status_ranqueado in ('normal','faltas_frequentes','inadimplente','intensivo')) default 'normal',
  total_faltas int default 0,
  foto_perfil text,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

create table servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  modalidade text,
  tipo_cobranca text,
  valor numeric(10,2),
  created_at timestamptz default now()
);

create table servicos_contratados (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references pacientes(id) on delete cascade,
  servico_id uuid references servicos(id) on delete cascade,
  data_inicio date not null,
  qtd_total_sessoes int,
  qtd_sessoes_realizadas int default 0,
  status text check (status in ('ativo','encerrado','suspenso')) default 'ativo',
  created_at timestamptz default now()
);

create table sessoes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references pacientes(id) on delete cascade,
  profissional_id uuid references profissionais(id) on delete set null,
  data timestamptz,
  duracao int,
  status text check (status in ('agendada','confirmada','realizada','cancelada','faltou')),
  anotacoes text,
  valor numeric(10,2),
  status_pagamento text check (status_pagamento in ('pendente','pago','cancelado')) default 'pendente',
  modalidade text,
  pacote text,
  score_clinico int,
  reagendada_em timestamptz,
  created_at timestamptz default now()
);

create table recibos (
  id uuid primary key default gen_random_uuid(),
  sessao_id uuid references sessoes(id) on delete cascade,
  paciente_id uuid references pacientes(id) on delete cascade,
  enviado boolean default false,
  data_sessao timestamptz,
  created_at timestamptz default now()
);

create table alertas_clinicos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references pacientes(id) on delete cascade,
  tipo_alerta text not null,
  descricao text,
  nivel_urgencia text,
  status text,
  termos_relacionados text[],
  data_criacao timestamptz default now()
);

create table diario_sentimentos (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references pacientes(id) on delete cascade,
  texto text not null,
  sentimento text,
  tags text[],
  palavras_disfuncionais text[],
  data_registro timestamptz default now()
);

create table traducoes (
  chave text primary key,
  texto_pt text not null,
  texto_en text not null
);

create table email_verification_tokens (
  user_id uuid references usuarios(id) on delete cascade,
  token text primary key,
  expires_at timestamptz not null
);

create table password_reset_tokens (
  user_id uuid references usuarios(id) on delete cascade,
  token text primary key,
  expires_at timestamptz not null
);
```

## API atual
- **Auth:** `POST /auth/signup`, `POST /auth/login`, `/auth/me`, `/auth/refresh`, `/auth/request-reset`, `/auth/reset` e `/auth/verify-email` com tokens atômicos e e-mails via nodemailer.
- **Pacientes:** `GET /pacientes`, `GET /pacientes/:id`, `POST/PUT/DELETE` alimentam as telas de lista, perfil e agenda.
- **Sessões:** `GET /sessoes?pacienteId&status`, `POST /sessoes`, `PATCH /sessoes/:id` (status/pagamento/reagendamento) mantêm agenda, histórico e cobranças sincronizadas.
- **Agenda inteligente:** `GET /analytics/agenda?periodo=30`, `GET /analytics/ocupacao?periodo=30`, `GET /analytics/risco-faltas` e `GET /analytics/dashboard` servem os gráficos do painel profissional/paciente.
- **Financeiro:** `GET /financeiro/resumo`, `POST /financeiro/charges/:id/pay`, `POST /financeiro/charges/:id/send` para pagamentos e recibos do paciente ou profissional.
- **Serviços e contratos:** `GET/POST/PUT/DELETE /servicos`, `GET /servicos-contratados`, `POST /servicos-contratados`, `PATCH /servicos-contratados/:id/status` etc.
- **Alertas e traduções:** `GET /alertas`, `POST /alertas`, `PATCH /alertas/:id` e `GET /traducoes`, exclusivos para alimentar o LocalizacaoContext e o gráfico de alertas clínicos.

## Próximas prioridades
1. **Confiança e QA:** validar manualmente login, dashboards profissional/paciente, agenda, financeiro e preferências multilíngues com o backend local, garantir que os fluxos de alertas/clínicos sejam alimentados pelas rotas `analytics` atuais e cobrir `backend/src/tests/registerRoutes.test.ts`.
2. **Infraestrutura e automações:** automatizar `docker compose up -d postgres`, `npm run prisma:migrate && npm run seed`, `backend/npm run dev` e `npm run dev` (podemos documentar esse combo em scripts ou um `npm run bootstrap` depois), além de manter o `browserslist` atualizado e CI com lint/test/build.
3. **Experiência e PWA:** fortalecer o service worker, garantir fallback offline limpinho e continuar aprimorando o `AuthProvider`/hooks (`useRecibos`, `useAgendaInteligente`, `useServicosContratados`) para que o front reflita fielmente o backend Fastify.
4. **Documentação e onboarding:** manter `docs/frontend.md`, `docs/backend-postgres.md` e `docs/SETUP_SUMMARY.md` sincronizados, deixando claro que `VITE_API_URL` aponta para `http://localhost:4000` em dev e que o backend usa PostgreSQL + JWT.

## Decisões pendentes
- Escolher o SMTP definitivo (Resend/SendGrid, Mailgun etc.) para produção e alinhar domínios/assinatura das mensagens.
- Mapear hosting/infra final (Railway, Fly, Render, Render, etc.) e automatizar o deploy com variáveis seguras.
- Monitorar e incrementar observabilidade (logs estruturados, métricas no backend e Sentry/LogRocket no front) antes de habilitar o app em produção.
