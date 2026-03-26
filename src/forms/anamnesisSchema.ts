import { z } from "zod"

export const anamnesisSchema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  dataNascimento: z.string().min(1, "Informe sua data de nascimento"),
  genero: z.string().min(1, "Selecione o genero"),
  estadoCivil: z.string().min(1, "Selecione o estado civil"),
  terapiaAnterior: z.enum(["sim", "nao"], {
    required_error: "Informe se ja fez terapia",
  }),
  medicacao: z.enum(["sim", "nao"], {
    required_error: "Informe se usa medicacao",
  }),
  motivacao: z.string().max(1000, "Limite de 1000 caracteres").optional(),
  desafios: z.array(z.string()).default([]),
  disponibilidadeDias: z.array(z.string()).min(1, "Selecione ao menos um dia"),
  disponibilidadePeriodo: z.string().min(1, "Selecione um periodo"),
  modalidade: z.string().min(1, "Selecione a modalidade"),
})

export type AnamnesisFormValues = z.infer<typeof anamnesisSchema>
