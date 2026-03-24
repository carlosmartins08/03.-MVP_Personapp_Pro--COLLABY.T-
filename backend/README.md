# Backend (Fastify + Prisma + MySQL)

Este diretório contém o backend opcional que substitui gradualmente as dependências do Supabase. Ele fornece rotas REST para autenticação, pacientes, sessões, financeiro, alertas e recibos.

## Pré-requisitos

- Node.js 18.18+ ou 20.x
- Banco MySQL acessível (local ou hospedado)

## Scripts principais

| Script                | Descrição                                                |
| --------------------- | -------------------------------------------------------- |
| `npm install`         | Instala dependências                                    |
| `npm run dev`         | Inicia Fastify com `tsx watch` (modo desenvolvimento)   |
| `npm run build`       | Transpila para `dist/` usando `tsc`                     |
| `npm start`           | Sobe o build em produção                                |
| `npm run prisma:generate` | Gera o cliente Prisma                                |
| `npm run prisma:migrate` | Aplica/cria migrações com base no schema atual       |
| `npm run lint`        | Executa ESLint                                          |

> Substitua `npm` por `pnpm`/`yarn` caso prefira outro gerenciador.

## Como configurar rapidamente

1. **Variáveis**  
   Copie `.env.example` para `.env` e ajuste:
   - `DATABASE_URL` → string de conexão MySQL
   - `PORT` → porta desejada (padrão `4000`)
   - `JWT_SECRET` → segredo seguro para tokens
   - `SMTP_HOST/PORT/USER/PASS/FROM` → credenciais do servidor SMTP usado para enviar tokens de verificação e recuperação

2. **Dependências e Prisma**  
   ```
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   ```

3. **Subir o servidor**  
   ```
   npm run dev
   ```
   Acesse `http://localhost:4000/health` para garantir que está ativo.

## Observações

- Todas as rotas estão em `src/routes/`. Use esse diretório como referência ao integrar com o frontend.
- As validações de env estão em `src/env.ts`. O servidor não sobe se `DATABASE_URL` ou `JWT_SECRET` estiverem faltando.
- Antes de publicar, rode `npm run build` + `npm start` para confirmar que o bundle transpila corretamente.

## Endpoints em destaque

- `GET /analytics/dashboard` agora consolida sessões de pacientes reais, entregando contagens por semana (últimos 4 períodos) e indicadores usados no dashboard.
- `GET /analytics/agenda` e `GET /analytics/ocupacao` aceitam `periodo` (dias) e retornam apenas compromissos futuros, já com dados do paciente/profissional.
- `GET /financeiro/resumo` expõe totais recebidos/pendentes e a lista de transações (sessões) do período filtrado, permitindo alimentar telas financeiras sem depender de mocks.

## E-mails transacionais

Os fluxos de cadastro/recuperação usam `nodemailer`. Para desenvolvimento, utilize ferramentas como [Mailpit](https://github.com/axllent/mailpit) ou [MailHog](https://github.com/mailhog/MailHog) ouvindo em `localhost:1025` e configure os campos `SMTP_*` do `.env`. Em produção informe o SMTP oficial (Resend, SendGrid etc.) para garantir entrega real.
