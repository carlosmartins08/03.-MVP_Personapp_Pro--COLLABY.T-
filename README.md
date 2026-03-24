# PersonaApp Pro

Painel web para psicólogos e pacientes, construído com Vite, React, TypeScript, Tailwind e Supabase. Este guia explica como rodar o frontend, configurar variáveis de ambiente e subir o backend opcional usando Fastify + Prisma.

---

## Rodar o Frontend

Pré‑requisitos:

- Node.js 18.18+ ou 20.x (recomendado instalar via [nvm-windows](https://github.com/coreybutler/nvm-windows))
- npm 9+ (instalado junto com o Node)

Passos (executar na raiz do projeto):

```bash
cp .env.example .env.local   # ajuste os valores antes de iniciar
npm install                 # instala dependências do frontend
npm run dev                 # inicia o Vite em http://localhost:8080
```

> **Dica:** o servidor fica acessível em `http://localhost:8080` (configurado em `vite.config.ts`). Pressione `Ctrl + C` para encerrar.

### Comandos úteis

| Comando          | Descrição                                               |
| ---------------- | ------------------------------------------------------- |
| `npm run dev`    | Ambiente local com hot reload                           |
| `npm run build`  | Build de produção (gera saída em `dist/`)               |
| `npm run preview`| Sobe o build localmente para checar antes de publicar   |
| `npm run lint`   | Executa ESLint                                          |

O `npm run build` agora usa o plugin oficial `@vitejs/plugin-react`, evitando erros do SWC em ambientes Windows.

---

## Variáveis de Ambiente

### Frontend

Crie um arquivo `.env.local` (Git ignora automaticamente) com base no `.env.example`:

| Variável                              | Obrigatória | Descrição                                                |
| ------------------------------------- | ----------- | -------------------------------------------------------- |
| `VITE_SUPABASE_URL`                   | ✅          | URL do seu projeto no Supabase                           |
| `VITE_SUPABASE_ANON_KEY`              | ✅          | Chave anon pública do Supabase                           |
| `VITE_DEFAULT_LANGUAGE`               | ⛔️          | `pt` ou `en` (padrão `pt`)                               |
| `VITE_FRONTEND_URL`                   | ⛔️          | URL pública onde o app roda (usado em e-mails/links)     |
| `VITE_EMAIL_VERIFICATION_REDIRECT_URL`| ⛔️          | URL para onde o usuário vai após confirmar o e-mail      |

> O app valida `SUPABASE_URL` e `SUPABASE_ANON_KEY` logo no boot (`src/main.tsx`). Se estiverem faltando, o Vite exibirá um erro claro.

### Backend (opcional)

No diretório `backend/` há outro `.env.example`. Duplique para `.env` e preencha:

| Variável        | Descrição                                                                 |
| --------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`  | URL de conexão MySQL (ex.: `mysql://user:pass@localhost:3306/db`)|
| `PORT`          | Porta do servidor Fastify (padrão `4000`)                                 |
| `JWT_SECRET`    | Segredo para assinar tokens                                               |

---

## Backend opcional (Fastify + Prisma)

O frontend ainda usa Supabase para persistência, mas já existe um backend Fastify/Prisma pronto para testes e migração gradual.

Passos básicos:

```bash
cd backend
cp .env.example .env             # ajuste DATABASE_URL / JWT_SECRET
npm install                      # ou pnpm/yarn, se preferir
npm run prisma:generate          # gera o client Prisma
npm run prisma:migrate           # cria o schema no banco configurado
npm run dev                      # sobe em http://localhost:4000 (rota /health)
```

### Rotas disponíveis

- `GET /health` – verificação rápida
- Demais rotas REST estão em `backend/src/routes/` (auth, pacientes, sessões, financeiro, etc.).

### Integração com o Frontend

No momento o frontend conversa diretamente com o Supabase. Para migrar para o backend:

1. Exponha endpoints equivalentes no Fastify (já existem stubs principais).
2. Crie hooks/services no frontend consumindo o backend (ex.: via `fetch` ou `react-query`).
3. Garanta que as mesmas variáveis (URLs, tokens) estejam configuradas no `.env.local`.

---

## Fluxo sugerido para novos ambientes

1. **Configurar variáveis** – copie `.env.example` para `.env.local` e `.env` e ajuste.
2. **Instalar dependências** – `npm install` na raiz (frontend) e em `backend/` se necessário.
3. **Validar build** – rode `npm run build` para garantir que o código compila limpo.
4. **Subir serviços** – `npm run dev` para o frontend e `npm run dev` em `backend/` caso precise da API.
5. **Rodar checks** – `npm run lint` e `npm run prisma:migrate` sempre que alterar schema.

Com isso você consegue “ver a aplicação” rapidamente e ter clareza sobre quais variáveis e serviços precisam estar ativos.
