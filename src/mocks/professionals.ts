export type ProfessionalMock = {
  id: string
  userId?: string | null
  nome: string
  crp?: string | null
  especialidade?: string | null
  criadoEm: string
}

export const professionalsMock: ProfessionalMock[] = [
  {
    id: "prof-1",
    userId: null,
    nome: "Ana Costa",
    crp: "CRP 06/12345",
    especialidade: "psicanalise, humanismo",
    criadoEm: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "prof-2",
    userId: null,
    nome: "Bruno Almeida",
    crp: "CRP 05/54321",
    especialidade: "cognitivismo, behaviorismo",
    criadoEm: "2025-02-18T14:30:00.000Z",
  },
  {
    id: "prof-3",
    userId: null,
    nome: "Carla Ribeiro",
    crp: "CRP 04/99110",
    especialidade: "psicologia positiva, transpessoal",
    criadoEm: "2024-11-05T09:15:00.000Z",
  },
  {
    id: "prof-4",
    userId: null,
    nome: "Diego Santos",
    crp: "CRP 08/77123",
    especialidade: "neuropsicologia, sistemica",
    criadoEm: "2024-09-22T16:45:00.000Z",
  },
  {
    id: "prof-5",
    userId: null,
    nome: "Elisa Mello",
    crp: "CRP 03/88765",
    especialidade: "humanismo, cognitivismo",
    criadoEm: "2025-03-01T12:00:00.000Z",
  },
]
