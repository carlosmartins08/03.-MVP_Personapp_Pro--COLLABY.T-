# Environment Setup Guide

Este projeto usa variáveis de ambiente tanto no frontend (Vite + API própria) quanto no backend Fastify/Prisma. Use este guia para configurar rapidamente os arquivos `.env`.

---

## Frontend (`.env.local`)

1. Copie o arquivo `.env.example` na raiz e renomeie para `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Preencha os valores reais:

   | Variável                              | Obrigatória | Descrição                                                 |
   | ------------------------------------- | ----------- | --------------------------------------------------------- |
   | `VITE_API_URL`                        | âœ…          | URL base da API Fastify (ex.: `http://localhost:4000`)    |
   | `VITE_USE_MOCKS`                      | opcional          | `true` para usar API mock local (frontend sem backend)    |
   | `VITE_DEFAULT_LANGUAGE`               | â›”ï¸          | `pt` ou `en` (padrão `pt`)                                |
   | `VITE_FRONTEND_URL`                   | â›”ï¸          | URL pública usada em e-mails/redirecionamentos            |
   | `VITE_EMAIL_VERIFICATION_REDIRECT_URL`| â›”ï¸          | Para onde levar o usuário após confirmar o e-mail         |

3. O arquivo `.env.local` é lido automaticamente pelo Vite. Ao rodar `npm run dev`/`build`, o app valida se `VITE_API_URL` está definido (veja `src/lib/env.ts`).
   | `VITE_USE_MOCKS`                      | opcional          | `true` para usar API mock local (frontend sem backend)    |

## Backend (`backend/.env`)

1. Entre em `backend/` e copie `.env.example` para `.env`.

   ```bash
   cd backend
   cp .env.example .env
   ```

2. Ajuste os campos:

   | Variável       | Descrição                                                                                    |
   | -------------- | -------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | URL MySQL (ex.: `mysql://user:password@localhost:3306/personaclinic`)              |
   | `PORT`         | Porta exposta pelo Fastify (padrão `4000`)                                                   |
   | `JWT_SECRET`   | Segredo usado para assinar/validar tokens de autenticação                                   |
   | `SMTP_*`       | Configurações de envio de e-mail (host, porta, usuário, senha, remetente)                    |

3. Após configurar o `.env`, execute `npm run prisma:generate` e `npm run prisma:migrate` para garantir que o schema está sincronizado com o banco escolhido.

---

## Lendo as variáveis em código

### Frontend

```ts
import { env } from '@/lib/env';

const apiUrl = env.API_URL;
```

### Backend

```ts
import { env } from '../env';

await fastify.listen({ port: env.port });
```

> Sempre que editar um `.env`, reinicie os processos (`npm run dev`, `npm run dev` do backend, etc.) para que as mudanças sejam carregadas.

