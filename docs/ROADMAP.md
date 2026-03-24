# PersonaClinic – Migração sem Supabase

Objetivo: remover dependência do Supabase e entregar backend próprio com MySQL gerenciado, mantendo as features atuais (auth, pacientes, sessões, financeiro, alertas, traduções, PWA).

## Stack proposta
- Backend: Fastify + TypeScript + Prisma (MySQL). Alternativa: NestJS se preferir DI mais estruturada.
- Banco: MySQL gerenciado (PlanetScale/RDS). Prisma para migrações e tipos.
- Auth: Fastify JWT com refresh tokens, senhas com argon2, e-mails de verificação/recuperação via provider (Resend/SendGrid). Alternativa plugável: Auth0/Clerk se preferir 3rd party.
- Infra: CI para lint/test/build, Dockerfile para backend, ambientes dev/stage/prod com variáveis seguras.

## Modelo de dados (DDL inicial)
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

## API substituta (mapa rápido)
- Auth: `POST /auth/signup`, `POST /auth/login`, `POST /auth/verify-email`, `POST /auth/request-reset`, `POST /auth/reset`, `POST /auth/refresh`, `POST /auth/logout`.
- Usuário: `GET /me`.
- Pacientes: `GET /pacientes`, `GET /pacientes/:id`, `POST/PUT/DELETE`.
- Sessões: `GET /sessoes?pacienteId&status`, `POST /sessoes`, `PATCH /sessoes/:id` (status/pagamento/reagendamento).
- Agenda inteligente/ocupação: substituir funções `ObterAgendaInteligente`/`ObterOcupacaoFutura` por `GET /analytics/agenda?periodo=30` e `GET /analytics/ocupacao?periodo=30`.
- Dashboard: `GET /analytics/dashboard` (retorna totais de sessões, ausências, recebidos/pendentes, alertas recentes).
- Financeiro: `GET /financeiro/resumo?period=...`, `POST /financeiro/charges/:id/pay`, `POST /financeiro/charges/:id/send`.
- Serviços: `GET /servicos`, `POST/PUT/DELETE /servicos/:id`.
- Serviços contratados: `GET /servicos-contratados?pacienteId`, `POST /servicos-contratados`, `POST /servicos-contratados/:id/incrementar`, `PATCH /servicos-contratados/:id/status`.
- Recibos: `GET /recibos?paciente=...`, `POST /recibos`, `POST /recibos/:id/send`, `DELETE /recibos/:id`.
- Alertas clínicos: `GET /alertas`, `POST /alertas`, `PATCH /alertas/:id`.
- Traduções: `GET /traducoes` (cacheável).

## Plano de execução (curto → médio prazo)
1) Backend bootstrap
   - Criar projeto Fastify + Prisma + Postgres; configurar Docker/Neon; criar migrações Prisma com o DDL acima.
   - Implementar auth (signup/login/refresh/reset/verify) + mailer.
   - Publicar OpenAPI para front e testes.
2) Camada API no frontend
   - Adicionar client HTTP (fetch/axios) + zod para validar respostas.
   - Criar hooks React Query para auth, pacientes, sessões, financeiro, alertas (um por endpoint).
   - Substituir `supabase`/`createSafeQuery`/`functions.invoke` pelos novos hooks em telas: login/signup/reset, dashboards, pacientes, financeiro, agenda.
3) Limpeza de mocks e rotas
   - Remover `mockData` e alinhar rotas com o layout `/profissional/*` (ex.: `/profissional/pacientes`).
   - Corrigir encoding/textos e placeholders de senha.
4) PWA/infra
   - Gerar service worker compilado (JS) e ajustar registro.
   - Configurar CI (lint/test/build) e variáveis de ambiente seguras (sem fallbacks hardcoded).
5) Qualidade
   - Testes unitários dos hooks e utils; e2e mínimo (login, criar sessão, marcar pagamento).
   - Observabilidade: logs estruturados + captura de erros no front (Sentry) e backend.

## Decisões pendentes
- Provider de e-mail (Resend/SendGrid) e domínio de envio.
- Se preferir auth 3rd party (Auth0/Clerk), ajustar fluxo de e-mail e mapeamento de tipos de usuário.
- Infra de deploy (Railway/Fly/Render) e domínio.
