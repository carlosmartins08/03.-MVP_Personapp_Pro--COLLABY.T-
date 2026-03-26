# Migration Plan - PersonApp Entities

Fonte: backend/prisma/schema.prisma (lido integralmente).
Execucao: schema atualizado, porem `prisma migrate dev` falhou sem DATABASE_URL/DB ativa.

## 1) Vinculo (paciente <-> profissional)
Status: EXECUTADO (model Vinculo adicionado)
Dependencias: Paciente, Profissional

Proposta de tabela:
model Vinculo {
  id              String   @id @default(uuid())
  pacienteId      String   @map("paciente_id")
  profissionalId  String   @map("profissional_id")
  status          String   @default("ATIVO")
  motivo          String?
  iniciadoEm      DateTime @default(now()) @map("iniciado_em")
  encerradoEm     DateTime? @map("encerrado_em")
  criadoEm        DateTime @default(now()) @map("criado_em")
  atualizadoEm    DateTime @updatedAt @map("atualizado_em")

  paciente     Paciente     @relation(fields: [pacienteId], references: [id])
  profissional Profissional @relation(fields: [profissionalId], references: [id])

  @@map("vinculos")
  @@index([pacienteId])
  @@index([profissionalId])
}

Campos faltantes: nenhum (tabela criada).

## 2) Consulta (separado de Sessao?)
Status: PARCIAL / EQUIVALENTE
No schema atual existe apenas `Sessao` (tabela `sessoes`).
Campos atuais de Sessao:
- paciente_id, profissional_id, data, duracao, status, anotacoes, valor,
  status_pagamento, modalidade, pacote, score_clinico, reagendada_em, created_at.

Conclusao: Consulta == Sessao no schema atual. Nao existe entidade separada.
Atualizacao executada: campo daily_room_url adicionado em sessoes para integracao Daily.

## 3) Prontuario (imutavel, 5 anos, 6 secoes)
Status: NAO EXISTE
Dependencias: Paciente, Profissional

Proposta de tabela (flexivel via JSON):
model Prontuario {
  id             String   @id @default(uuid())
  pacienteId     String   @map("paciente_id")
  profissionalId String?  @map("profissional_id")
  secoes         Json     @map("secoes") // array com 6 itens {tipo, conteudo}
  criadoEm       DateTime @default(now()) @map("criado_em")
  bloqueadoEm    DateTime? @map("bloqueado_em") // imutavel apos definido
  expiraEm       DateTime @map("expira_em") // criadoEm + 5 anos

  paciente     Paciente     @relation(fields: [pacienteId], references: [id])
  profissional Profissional? @relation(fields: [profissionalId], references: [id])

  @@map("prontuarios")
  @@index([pacienteId])
  @@index([profissionalId])
}

Campos faltantes: todos (tabela nao existe).

## 4) DiarioEntrada com humor numerico (1-5)
Status: EXECUTADO (campo humor adicionado)
Tabela existente: `diario_sentimentos`
Campos atuais:
- texto, sentimento (String?), tags (Json), palavras_disfuncionais (Json), data_registro

Faltantes:
- nenhum (humor Int? adicionado)

Proposta de ajuste:
- Validacao 1..5 no backend (zod) e/ou constraint no DB.

## 5) Pagamento com gateway (Pagar.me)
Status: NAO EXISTE
Dependencias: Sessao, Paciente, Profissional

Proposta de tabela:
model Pagamento {
  id              String   @id @default(uuid())
  sessaoId        String?  @map("sessao_id")
  pacienteId      String   @map("paciente_id")
  profissionalId  String?  @map("profissional_id")
  valor           Decimal  @db.Decimal(10, 2)
  status          String   @default("pendente")
  gateway         String   @default("pagarme")
  gatewayId       String?  @map("gateway_id")
  metodo          String?  // cartao, pix, boleto
  moeda           String   @default("BRL")
  criadoEm        DateTime @default(now()) @map("criado_em")
  atualizadoEm    DateTime @updatedAt @map("atualizado_em")

  sessao        Sessao?        @relation(fields: [sessaoId], references: [id])
  paciente      Paciente       @relation(fields: [pacienteId], references: [id])
  profissional  Profissional?  @relation(fields: [profissionalId], references: [id])

  @@map("pagamentos")
  @@index([sessaoId])
  @@index([pacienteId])
  @@index([profissionalId])
}

Campos faltantes: todos (tabela nao existe).

## 6) Notificacao
Status: EXECUTADO (model Notificacao adicionado)
Dependencias: Usuario (ou Paciente/Profissional)

Proposta de tabela:
model Notificacao {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  titulo     String
  mensagem   String
  tipo       String   // alerta, sistema, agenda, etc
  lida       Boolean  @default(false)
  dataEnvio  DateTime @default(now()) @map("data_envio")
  payload    Json?

  usuario Usuario @relation(fields: [userId], references: [id])

  @@map("notificacoes")
  @@index([userId])
}

Campos faltantes: nenhum (tabela criada).

## Verificacao: Sessao vs Consulta
No schema atual so existe `Sessao`. Logo, Consulta e tratada como Sessao.
Se PersonApp exigir entidade separada, sera necessario criar `consulta` e
mapear/relacionar com `sessoes` ou migrar dados.
