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

## Encoding
Todos os arquivos do projeto devem ser salvos em UTF-8.
O index.html deve ter <meta charset="UTF-8" /> como primeira tag do <head>.
Nunca usar @import de fontes em CSS — usar <link> no HTML.

## iOS / Safari
- Usar min-h-[100dvh] em vez de h-screen para evitar corte em Safari iOS
- nav inferior precisa de pb-[env(safe-area-inset-bottom,0px)]
- input type="date" tem suporte limitado no Safari — considerar datepicker custom

## Migracao para DS PersonApp
Telas migradas para usar src/design-system/components:
- [x] AuthForm / Login / Cadastro (Marco 4.1)
- [x] TelaPacientes (Marco 4.2)
- [x] TelaSessoes (Marco 4.2)
- [x] TelaPerfilPaciente (Marco 4.3)
- [x] TelaCadastroPaciente (Marco 4.3)
- [x] DashboardProfissional (componente /profissional/dashboard) (Marco 4.4)
- [x] DashboardProfissional (pagina) (Marco 4.4)
- [x] DashboardFinanceiro (componente /profissional/dashboard-financeiro) (Marco 4.4)
- [x] DashboardPrincipalPsicologo (Marco 4.4)
- [x] DashboardPaciente (pagina) (Marco 4.4)
- [x] DashboardPacienteMobile (componente /paciente/dashboard) (Marco 4.4)
- [x] TelaDashboardResumo (Marco 4.4)
- [x] TelaDashboardPaciente (Marco 4.4)
- [x] TelaAlertasClinicos (Marco 4.5)
- [x] TelaFinanceiro (Marco 4.5)
- [x] PersonApp ProfessionalList (/app/paciente/profissionais) (Marco 4.6)
- [x] PersonApp Anamnesis (/app/paciente/anamnese) (Marco 4.7)
- [x] PersonApp Professional Dashboard (/app/profissional/dashboard) (Marco 4.8)

Telas pendentes de migracao:
- Index
- RecuperarSenha
- RedefinirSenha
- VerificarEmail
- NotFound
- TelaAgendaSemanal
- TelaComparativoPacientes
- TelaComportamentoPaciente
- TelaConfigConta
- TelaEvolucaoPaciente
- TelaInicialProfissional
- TelaInsightsPaciente
- TelaPerfilProfissional
- TelaPrevisaoAgendaClinica
- TelaRecibos
- TelaServicos
- TelaSessaoDetalhada
- TelaResumoPaciente
- TelaSessoesPaciente
- TelaDiarioPaciente
- TelaPagamentosPaciente
- TelaRecibosPaciente
- TelaPerfilPacienteAutenticado

## Hooks PersonApp
Localizacao: src/hooks/personapp/
- usePatientDashboard: proxima sessao, humor hoje
- useMoodCheckIn: salvar entrada de humor
- useProfessionalDashboard: metricas, agenda, lista pacientes
