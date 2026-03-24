# Frontend Reference

Este documento descreve o setup do painel PersonaApp Pro, responsável pelo front-end construído com Vite, React e Tailwind — agora consumindo exclusivamente o backend Fastify + Prisma via `VITE_API_URL`.

## Requisitos

- Node.js 18.18+ ou 20.x (use [nvm-windows](https://github.com/coreybutler/nvm-windows) no Windows)
- npm 9+ (instalado com o Node)
- Um backend Fastify/PostgreSQL ativo (localmente via `docker compose up -d postgres` ou serviço remoto) e `VITE_API_URL` apontando para ele

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e configure:

| Variável                              | Obrigatória | Descrição                                         |
| ------------------------------------- | ----------- | ------------------------------------------------- |
| `VITE_DEFAULT_LANGUAGE`               | Não         | `pt` ou `en` (padrão `pt`)                         |
| `VITE_FRONTEND_URL`                   | Não         | URL pública do app (usado em e-mails/link sharing) |
| `VITE_EMAIL_VERIFICATION_REDIRECT_URL`| Não         | URL para redirecionar após confirmação de e-mail   |
| `VITE_API_URL`                        | Sim         | URL do backend Fastify (ex.: `http://localhost:4000`) |

> O app valida `VITE_API_URL` no boot (`src/main.tsx`). Sem ele o Vite interrompe a execução.

## Comandos principais

| Script          | Propósito                         |
| --------------- | --------------------------------- |
| `npm run dev`   | Rodar o Vite com hot reload        |
| `npm run build` | Gerar o bundle de produção em `dist/` |
| `npm run preview`| Testar o build local               |
| `npm run lint`  | Executar ESLint em todo o código   |

## Boas práticas

1. Rode `npm run build` regularmente antes de publicar para garantir que a aplicação compila.
2. Use o `VITE_API_URL` apontando para o backend Fastify (`http://localhost:4000` localmente) enquanto testa as rotas.
3. A autenticação usa `src/services/auth-service.ts` + `src/lib/api.ts`, então garanta que o backend esteja ativo antes de testar login, dashboards, agenda e financeiro.
4. O `InstallPrompt`/PWA (`src/components/pwa/InstallPrompt.tsx` + `usePWA`) já está preparado para dispositivos móveis.
