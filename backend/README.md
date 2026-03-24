# Backend (Fastify + Prisma + PostgreSQL)

Este diretório contém o backend opcional que expõe rotas REST para autenticação, pacientes, sessões, financeiro, alertas e recibos, agora totalmente baseado em PostgreSQL sem Supabase.

## Pré-requisitos

- Node.js 18.18+ ou 20.x
- Banco PostgreSQL acessível (local ou hospedado)

## Scripts principais

| Script                | Descrição                                                |
| --------------------- | -------------------------------------------------------- |
| `npm install`         | Instala dependências                                     |
| `npm run dev`         | Inicia Fastify com `tsx watch` (modo desenvolvimento)    |
| `npm run build`       | Transpila para `dist/` usando `tsc`                      |
| `npm start`           | Sobe o build em produção                                 |
| `npm run prisma:generate` | Gera o cliente Prisma                               |
| `npm run prisma:migrate` | Aplica/cria migrações com base no schema atual        |
| `npm run lint`        | Executa ESLint                                           |

> Substitua `npm` por `pnpm`/`yarn` caso prefira outro gerenciador.

## Como configurar rapidamente

1. **Variáveis**  
   Copie `.env.example` para `.env` e ajuste:
   - `DATABASE_URL` – string de conexão PostgreSQL (ex.: `postgresql://user:password@localhost:5432/personaclinic`)
   - `PORT` – porta desejada (padrão `4000`)
   - `JWT_SECRET` – segredo seguro para tokens
   - `SMTP_HOST/PORT/USER/PASS/FROM` – credenciais do servidor SMTP usado para enviar tokens de verificação e recuperação

2. **Dependências e Prisma**  
   ```
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

- `prisma:migrate` cria as tabelas no Postgres.  
- `npm run seed` populará os demos (usuários, paciente, sessões, alertas, recibos) após o migrate para testar fluxos como login, agenda e financeiro.
   O Prisma criará as tabelas no PostgreSQL com base no schema atual. Se preferir, configure `DATABASE_URL` para apontar para outro schema e rode `npx prisma migrate dev --name init` para gerar um novo histórico.

3. **Subir o servidor**  
   ```
   npm run dev
   ```
   Acesse `http://localhost:4000/health` para garantir que está ativo.

## Observações

- Todas as rotas estão em `src/routes/`. Use esse diretório como referência ao integrar com o frontend.
- As validações de ambiente estão em `src/env.ts`. O servidor não sobe se `DATABASE_URL` ou `JWT_SECRET` estiverem faltando.
- O registro central em `src/routes/registerRoutes.ts` aceita `filter`/`overrides` para ativar middleware específico; defina `ENABLE_ANALYTICS_ROUTES=true` para controlar o roteamento de analytics quando necessário.
- Antes de publicar, rode `npm run build` + `npm start` para confirmar que o bundle transpila corretamente.
- Execute `npm test` sempre que modificar filtros para garantir que `registerRoutes` respeita `filter`/`overrides`.

## Endpoints em destaque

- `GET /analytics/dashboard` consolida sessões de pacientes reais, entregando contagens por semana (últimos 4 períodos) e indicadores usados no dashboard.
- `GET /analytics/agenda` e `GET /analytics/ocupacao` aceitam `periodo` (dias) e retornam apenas compromissos futuros, já com dados do paciente/profissional.
- `GET /financeiro/resumo` expõe totais recebidos/pendentes e a lista de transações (sessões) do período filtrado, permitindo alimentar telas financeiras sem depender de mocks.

## E-mails transacionais

Os fluxos de cadastro/recuperação usam `nodemailer`. Para desenvolvimento, utilize ferramentas como [Mailpit](https://github.com/axllent/mailpit) ou [MailHog](https://github.com/mailhog/MailHog) ouvindo em `localhost:1025` e configure os campos `SMTP_*` do `.env`. Em produção informe o SMTP oficial (Resend, SendGrid etc.) para garantir entrega real.
