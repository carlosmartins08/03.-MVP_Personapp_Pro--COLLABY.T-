-- CreateTable
CREATE TABLE "anamneses" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "motivo_consulta" TEXT,
    "expectativas" TEXT,
    "historico_saude_mental" TEXT,
    "experiencias_traumaticas" TEXT,
    "sintomas_atuais" TEXT,
    "rotina_diaria" TEXT,
    "habitos_sono" TEXT,
    "dieta_exercicio" TEXT,
    "uso_substancias" TEXT,
    "dinamica_familiar" TEXT,
    "apoio_social" TEXT,
    "indicadores_risco" TEXT,
    "consentimento" BOOLEAN NOT NULL DEFAULT false,
    "abordagens_recomendadas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "respostas_psicanalise" JSONB,
    "respostas_behaviorismo" JSONB,
    "respostas_humanismo" JSONB,
    "respostas_cognitivismo" JSONB,
    "respostas_psic_positiva" JSONB,
    "respostas_neuropsicologia" JSONB,
    "respostas_sistemica" JSONB,
    "respostas_transpessoal" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anamneses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anamneses_paciente_id_key" ON "anamneses"("paciente_id");

-- CreateIndex
CREATE INDEX "anamneses_paciente_id_idx" ON "anamneses"("paciente_id");

-- AddForeignKey
ALTER TABLE "anamneses" ADD CONSTRAINT "anamneses_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
