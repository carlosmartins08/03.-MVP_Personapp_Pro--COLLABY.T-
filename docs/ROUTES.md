# Rotas da Aplicacao
## Rotas originais (PersonaClinic)
- /login
- /recuperar-senha
- /redefinir-senha
- /verificar-email
- /profissional/dashboard
- /profissional/dashboard-financeiro
- /profissional/dashboard-alternativo
- /profissional/pacientes
- /profissional/paciente/:id
- /profissional/paciente/:id/evolucao
- /profissional/comportamento
- /profissional/comportamento/:id
- /profissional/agenda
- /profissional/sessoes
- /profissional/sessao/:id
- /profissional/servicos
- /profissional/financeiro
- /profissional/alertas
- /profissional/configuracoes
- /paciente/dashboard
- /paciente/dashboard-desktop
- /paciente/sessoes
- /paciente/diario
- /paciente/pagamentos
- /paciente/recibos
- /paciente/perfil
- / (redirect para /login)
- * (NotFound)

## Rotas PersonApp (novas)
/app/paciente/* -> PatientAppLayout (BottomNav + SOSButton)
/app/profissional/* -> ProfessionalAppLayout (BottomNav)

- /app/paciente/dashboard
- /app/paciente/humor
- /app/paciente/anamnese
- /app/paciente/profissionais
- /app/paciente/agenda
- /app/paciente/diario
- /app/paciente/chat
- /app/profissional/dashboard
- /app/profissional/agenda
- /app/profissional/pacientes
- /app/profissional/sala/:id
