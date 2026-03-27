-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('profissional', 'paciente');

-- CreateEnum
CREATE TYPE "StatusRanqueado" AS ENUM ('normal', 'faltas_frequentes', 'inadimplente', 'intensivo');

-- CreateEnum
CREATE TYPE "StatusSessao" AS ENUM ('agendada', 'confirmada', 'realizada', 'cancelada', 'faltou');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('pendente', 'pago', 'cancelado');

-- CreateEnum
CREATE TYPE "StatusServicoContratado" AS ENUM ('ativo', 'encerrado', 'suspenso');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,
    "idioma_preferido" TEXT NOT NULL DEFAULT 'pt',
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissionais" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "nome" TEXT NOT NULL,
    "crp" TEXT,
    "especialidade" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "genero" TEXT,
    "cpf" TEXT,
    "endereco" TEXT,
    "observacoes" TEXT,
    "status_ranqueado" "StatusRanqueado" NOT NULL DEFAULT 'normal',
    "total_faltas" INTEGER NOT NULL DEFAULT 0,
    "foto_perfil" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "modalidade" TEXT,
    "tipo_cobranca" TEXT,
    "valor" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos_contratados" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "servico_id" TEXT NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "qtd_total_sessoes" INTEGER,
    "qtd_sessoes_realizadas" INTEGER NOT NULL DEFAULT 0,
    "status" "StatusServicoContratado" NOT NULL DEFAULT 'ativo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicos_contratados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT,
    "profissional_id" TEXT,
    "data" TIMESTAMP(3),
    "duracao" INTEGER,
    "status" "StatusSessao",
    "anotacoes" TEXT,
    "valor" DECIMAL(10,2),
    "status_pagamento" "StatusPagamento" DEFAULT 'pendente',
    "modalidade" TEXT,
    "pacote" TEXT,
    "score_clinico" INTEGER,
    "reagendada_em" TIMESTAMP(3),
    "daily_room_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recibos" (
    "id" TEXT NOT NULL,
    "sessao_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "data_sessao" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recibos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas_clinicos" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "tipo_alerta" TEXT NOT NULL,
    "descricao" TEXT,
    "nivel_urgencia" TEXT,
    "status" TEXT,
    "termos_relacionados" JSONB,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alertas_clinicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diario_sentimentos" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "sentimento" TEXT,
    "humor" INTEGER,
    "tags" JSONB,
    "palavras_disfuncionais" JSONB,
    "data_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diario_sentimentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vinculos" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vinculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "corpo" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "traducoes" (
    "chave" TEXT NOT NULL,
    "texto_pt" TEXT NOT NULL,
    "texto_en" TEXT NOT NULL,

    CONSTRAINT "traducoes_pkey" PRIMARY KEY ("chave")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "profissionais_user_id_idx" ON "profissionais"("user_id");

-- CreateIndex
CREATE INDEX "pacientes_user_id_idx" ON "pacientes"("user_id");

-- CreateIndex
CREATE INDEX "servicos_contratados_paciente_id_idx" ON "servicos_contratados"("paciente_id");

-- CreateIndex
CREATE INDEX "servicos_contratados_servico_id_idx" ON "servicos_contratados"("servico_id");

-- CreateIndex
CREATE INDEX "sessoes_paciente_id_idx" ON "sessoes"("paciente_id");

-- CreateIndex
CREATE INDEX "sessoes_profissional_id_idx" ON "sessoes"("profissional_id");

-- CreateIndex
CREATE INDEX "recibos_sessao_id_idx" ON "recibos"("sessao_id");

-- CreateIndex
CREATE INDEX "recibos_paciente_id_idx" ON "recibos"("paciente_id");

-- CreateIndex
CREATE INDEX "alertas_clinicos_paciente_id_idx" ON "alertas_clinicos"("paciente_id");

-- CreateIndex
CREATE INDEX "diario_sentimentos_paciente_id_idx" ON "diario_sentimentos"("paciente_id");

-- CreateIndex
CREATE INDEX "vinculos_paciente_id_idx" ON "vinculos"("paciente_id");

-- CreateIndex
CREATE INDEX "vinculos_profissional_id_idx" ON "vinculos"("profissional_id");

-- CreateIndex
CREATE INDEX "notificacoes_usuario_id_idx" ON "notificacoes"("usuario_id");

-- CreateIndex
CREATE INDEX "email_verification_tokens_user_id_idx" ON "email_verification_tokens"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos_contratados" ADD CONSTRAINT "servicos_contratados_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos_contratados" ADD CONSTRAINT "servicos_contratados_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibos" ADD CONSTRAINT "recibos_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "sessoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibos" ADD CONSTRAINT "recibos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_clinicos" ADD CONSTRAINT "alertas_clinicos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diario_sentimentos" ADD CONSTRAINT "diario_sentimentos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculos" ADD CONSTRAINT "vinculos_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vinculos" ADD CONSTRAINT "vinculos_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
