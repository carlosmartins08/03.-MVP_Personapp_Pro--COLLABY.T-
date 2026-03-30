import { useEffect, useMemo, useState } from "react"
import { Check, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { AppHeader, Button, Card, Label, Textarea } from "@/design-system/components"
import { DotGrid } from "@/design-system/decorations"
import { colors, type ApproachKey } from "@/design-system/tokens"
import { ApiError, api } from "@/lib/api"

type Etapa = 1 | 2 | 3 | 4
type AnamneseStatus = "pendente" | "parte1" | "triagem" | "parte2" | "concluida"

type Parte1State = {
  motivoConsulta: string
  expectativas: string
  historicoSaudeMental: string
  experienciasTraumaticas: string
  sintomasAtuais: string
  rotinaDiaria: string
  habitosSono: string
  dietaExercicio: string
  usoSubstancias: string
  dinamicaFamiliar: string
  apoioSocial: string
  indicadoresRisco: string
  consentimento: boolean
}

type AnamneseResponse = Partial<Parte1State> & {
  abordagensRecomendadas?: string[] | null
  respostasPsicanalise?: Record<string, string> | null
  respostasBehaviorismo?: Record<string, string> | null
  respostasHumanismo?: Record<string, string> | null
  respostasCognitivismo?: Record<string, string> | null
  respostasPsicPositiva?: Record<string, string> | null
  respostasNeuropsicologia?: Record<string, string> | null
  respostasSistemica?: Record<string, string> | null
  respostasTranspessoal?: Record<string, string> | null
  status?: AnamneseStatus
}

type AnamneseSavePayload = Partial<Parte1State> & {
  abordagensRecomendadas?: ApproachKey[]
  respostasPsicanalise?: Record<string, string>
  respostasBehaviorismo?: Record<string, string>
  respostasHumanismo?: Record<string, string>
  respostasCognitivismo?: Record<string, string>
  respostasPsicPositiva?: Record<string, string>
  respostasNeuropsicologia?: Record<string, string>
  respostasSistemica?: Record<string, string>
  respostasTranspessoal?: Record<string, string>
  status?: AnamneseStatus
}

type AbordagemDef = {
  key: ApproachKey
  label: string
  desc: string
}

const parte1Inicial: Parte1State = {
  motivoConsulta: "",
  expectativas: "",
  historicoSaudeMental: "",
  experienciasTraumaticas: "",
  sintomasAtuais: "",
  rotinaDiaria: "",
  habitosSono: "",
  dietaExercicio: "",
  usoSubstancias: "",
  dinamicaFamiliar: "",
  apoioSocial: "",
  indicadoresRisco: "",
  consentimento: false,
}

const abordagemDefs: AbordagemDef[] = [
  {
    key: "psicanalise",
    label: "Psicanalise",
    desc: "Experiencias passadas e padroes inconscientes",
  },
  {
    key: "behaviorismo",
    label: "Behaviorismo",
    desc: "Comportamentos e respostas ao ambiente",
  },
  {
    key: "humanismo",
    label: "Humanismo",
    desc: "Crescimento pessoal e autoconhecimento",
  },
  {
    key: "cognitivismo",
    label: "Cognitivismo",
    desc: "Pensamentos, crencas e padroes mentais",
  },
  {
    key: "psicPositiva",
    label: "Psicologia Positiva",
    desc: "Bem-estar, forcas e qualidade de vida",
  },
  {
    key: "neuropsicologia",
    label: "Neuropsicologia",
    desc: "Saude cerebral e funcoes cognitivas",
  },
  {
    key: "sistemica",
    label: "Sistemica",
    desc: "Dinamicas familiares e relacionamentos",
  },
  {
    key: "transpessoal",
    label: "Transpessoal",
    desc: "Espiritualidade, proposito e sentido de vida",
  },
]

const perguntasParte2: Record<ApproachKey, Array<{ key: string; label: string; placeholder: string }>> = {
  psicanalise: [
    {
      key: "historia_infancia",
      label: "Quais memorias da infancia ainda impactam sua vida atual?",
      placeholder: "Descreva situacoes que voce percebe como marcantes...",
    },
    {
      key: "padroes_repeticao",
      label: "Existe algum padrao que voce sente que se repete?",
      placeholder: "Relacionamentos, escolhas ou sentimentos recorrentes...",
    },
    {
      key: "sonhos_inconsciente",
      label: "Voce percebe sonhos ou pensamentos recorrentes?",
      placeholder: "Compartilhe o que for relevante para voce...",
    },
  ],
  behaviorismo: [
    {
      key: "gatilhos",
      label: "Quais situacoes costumam disparar suas reacoes mais intensas?",
      placeholder: "Contextos, horarios, pessoas ou ambientes...",
    },
    {
      key: "resposta_habito",
      label: "Como voce costuma reagir nessas situacoes?",
      placeholder: "Comportamentos automaticos e consequencias...",
    },
    {
      key: "meta_comportamental",
      label: "Que comportamento voce gostaria de construir?",
      placeholder: "Defina uma mudanca pratica e observavel...",
    },
  ],
  humanismo: [
    {
      key: "autoconhecimento",
      label: "O que voce deseja compreender melhor sobre si?",
      placeholder: "Valores, identidade, escolhas e sentimentos...",
    },
    {
      key: "potencial",
      label: "Onde voce sente que tem potencial para crescer?",
      placeholder: "Areas da vida que merecem mais atencao...",
    },
    {
      key: "bloqueios",
      label: "O que mais impede esse crescimento hoje?",
      placeholder: "Medos, conflitos internos ou fatores externos...",
    },
  ],
  cognitivismo: [
    {
      key: "pensamentos_automaticos",
      label: "Quais pensamentos aparecem quando voce se sente mal?",
      placeholder: "Frases internas comuns em momentos de estresse...",
    },
    {
      key: "crencas_limitantes",
      label: "Quais crencas voce acha que te limitam?",
      placeholder: "Exemplos: 'nao sou capaz', 'nada vai mudar'...",
    },
    {
      key: "reframing",
      label: "Como voce gostaria de pensar de forma mais funcional?",
      placeholder: "Escreva uma alternativa mais equilibrada...",
    },
  ],
  psicPositiva: [
    {
      key: "forcas",
      label: "Quais forcas pessoais voce reconhece em si?",
      placeholder: "Exemplos: resiliencia, criatividade, empatia...",
    },
    {
      key: "gratidao",
      label: "O que tem sido fonte de gratidao recentemente?",
      placeholder: "Pessoas, situacoes ou pequenas conquistas...",
    },
    {
      key: "bem_estar",
      label: "O que mais aumenta seu senso de bem-estar?",
      placeholder: "Atividades, rotina ou conexoes importantes...",
    },
  ],
  neuropsicologia: [
    {
      key: "memoria_atencao",
      label: "Como anda sua memoria e concentracao no dia a dia?",
      placeholder: "Exemplos concretos de dificuldade ou melhora...",
    },
    {
      key: "funcao_executiva",
      label: "Voce percebe dificuldade em planejar e organizar tarefas?",
      placeholder: "Comente sobre trabalho, estudos e rotina...",
    },
    {
      key: "fatores_neuro",
      label: "Ha fatores de saude que impactam sua cognicao?",
      placeholder: "Sono, medicacao, condicoes medicas ou estresse...",
    },
  ],
  sistemica: [
    {
      key: "dinamica_familiar",
      label: "Como voce descreve as dinamicas da sua familia?",
      placeholder: "Padroes de comunicacao, papeis e conflitos...",
    },
    {
      key: "relacoes_chave",
      label: "Quais relacoes mais influenciam seu bem-estar hoje?",
      placeholder: "Familia, parceiros, amizades e trabalho...",
    },
    {
      key: "rede_apoio",
      label: "Como esta sua rede de apoio atualmente?",
      placeholder: "Quem voce procura quando precisa de ajuda...",
    },
  ],
  transpessoal: [
    {
      key: "proposito",
      label: "Como voce enxerga seu proposito neste momento da vida?",
      placeholder: "Reflexoes sobre sentido e direcao...",
    },
    {
      key: "espiritualidade",
      label: "A espiritualidade tem papel no seu cuidado emocional?",
      placeholder: "Pode compartilhar no nivel que fizer sentido...",
    },
    {
      key: "praticas_significativas",
      label: "Quais praticas trazem conexao e paz para voce?",
      placeholder: "Meditacao, natureza, fe, arte, respiracao...",
    },
  ],
}

const respostaFieldByApproach: Record<
  ApproachKey,
  keyof Pick<
    AnamneseSavePayload,
    | "respostasPsicanalise"
    | "respostasBehaviorismo"
    | "respostasHumanismo"
    | "respostasCognitivismo"
    | "respostasPsicPositiva"
    | "respostasNeuropsicologia"
    | "respostasSistemica"
    | "respostasTranspessoal"
  >
> = {
  psicanalise: "respostasPsicanalise",
  behaviorismo: "respostasBehaviorismo",
  humanismo: "respostasHumanismo",
  cognitivismo: "respostasCognitivismo",
  psicPositiva: "respostasPsicPositiva",
  neuropsicologia: "respostasNeuropsicologia",
  sistemica: "respostasSistemica",
  transpessoal: "respostasTranspessoal",
}

const isApproachKey = (value: string): value is ApproachKey =>
  Object.prototype.hasOwnProperty.call(colors.approach, value)

const normalizeAbordagens = (values?: string[] | null): ApproachKey[] => {
  if (!values?.length) return []
  return values.filter(isApproachKey).slice(0, 2)
}

const toMensagemErro = (error: unknown) => {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return "Nao foi possivel concluir esta etapa agora."
}

const calcularTriagem = (p1: Parte1State): ApproachKey[] => {
  const texto = [
    p1.motivoConsulta,
    p1.expectativas,
    p1.historicoSaudeMental,
    p1.experienciasTraumaticas,
    p1.sintomasAtuais,
    p1.rotinaDiaria,
    p1.habitosSono,
    p1.dietaExercicio,
    p1.usoSubstancias,
    p1.dinamicaFamiliar,
    p1.apoioSocial,
    p1.indicadoresRisco,
  ]
    .join(" ")
    .toLowerCase()

  const abordagens: ApproachKey[] = []

  if (/famil|relacionament|social|dinamic|conflito/i.test(texto)) abordagens.push("sistemica")
  if (/pensament|crenca|ideia|raciocin|cognitiv/i.test(texto)) abordagens.push("cognitivismo")
  if (/cresciment|autoconhec|realiz|potencial|quem eu sou/i.test(texto)) abordagens.push("humanismo")
  if (/bem-estar|bem estar|felicidad|positiv|forca|gratidao/i.test(texto))
    abordagens.push("psicPositiva")
  if (/memoria|concentrac|cerebr|neurolog|cognic/i.test(texto)) abordagens.push("neuropsicologia")
  if (/infancia|passado|inconscient|sonho|repeticao/i.test(texto)) abordagens.push("psicanalise")
  if (/espiritual|proposito|sentido|transcend|sagrado/i.test(texto))
    abordagens.push("transpessoal")
  if (/comportament|habito|conduta|estimul|resposta/i.test(texto)) abordagens.push("behaviorismo")

  if (!abordagens.length) abordagens.push("humanismo")

  return Array.from(new Set(abordagens)).slice(0, 2)
}

const montarParte2Inicial = (data: AnamneseResponse): Record<string, string> => {
  const respostaPorCampo: Partial<Record<ApproachKey, Record<string, string> | null | undefined>> = {
    psicanalise: data.respostasPsicanalise,
    behaviorismo: data.respostasBehaviorismo,
    humanismo: data.respostasHumanismo,
    cognitivismo: data.respostasCognitivismo,
    psicPositiva: data.respostasPsicPositiva,
    neuropsicologia: data.respostasNeuropsicologia,
    sistemica: data.respostasSistemica,
    transpessoal: data.respostasTranspessoal,
  }

  const flat: Record<string, string> = {}

  for (const [abordagem, respostas] of Object.entries(respostaPorCampo)) {
    if (!respostas || typeof respostas !== "object") continue
    Object.entries(respostas).forEach(([pergunta, valor]) => {
      flat[`${abordagem}.${pergunta}`] = String(valor ?? "")
    })
  }

  return flat
}

const possuiRespostasParte2 = (data: AnamneseResponse) =>
  Boolean(
    data.respostasPsicanalise ||
      data.respostasBehaviorismo ||
      data.respostasHumanismo ||
      data.respostasCognitivismo ||
      data.respostasPsicPositiva ||
      data.respostasNeuropsicologia ||
      data.respostasSistemica ||
      data.respostasTranspessoal
  )

const AnamnesisPage = () => {
  const navigate = useNavigate()

  const [etapa, setEtapa] = useState<Etapa>(1)
  const [parte1, setParte1] = useState<Parte1State>(parte1Inicial)
  const [abordagensSelecionadas, setAbordagensSelecionadas] = useState<ApproachKey[]>([])
  const [parte2, setParte2] = useState<Record<string, string>>({})

  const [isLoadingInicial, setIsLoadingInicial] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const carregarAnamnese = async () => {
      setIsLoadingInicial(true)
      setErrorMessage(null)

      try {
        const data = await api.get<AnamneseResponse | null>("/anamnese")
        if (!isMounted || !data) return

        setParte1({
          motivoConsulta: data.motivoConsulta ?? "",
          expectativas: data.expectativas ?? "",
          historicoSaudeMental: data.historicoSaudeMental ?? "",
          experienciasTraumaticas: data.experienciasTraumaticas ?? "",
          sintomasAtuais: data.sintomasAtuais ?? "",
          rotinaDiaria: data.rotinaDiaria ?? "",
          habitosSono: data.habitosSono ?? "",
          dietaExercicio: data.dietaExercicio ?? "",
          usoSubstancias: data.usoSubstancias ?? "",
          dinamicaFamiliar: data.dinamicaFamiliar ?? "",
          apoioSocial: data.apoioSocial ?? "",
          indicadoresRisco: data.indicadoresRisco ?? "",
          consentimento: Boolean(data.consentimento),
        })

        const recomendadas = normalizeAbordagens(data.abordagensRecomendadas)
        setAbordagensSelecionadas(recomendadas)
        setParte2(montarParte2Inicial(data))

        if (data.status === "concluida") {
          setEtapa(4)
          return
        }

        if (data.status === "parte2" || possuiRespostasParte2(data)) {
          setEtapa(3)
          return
        }

        if (data.status === "triagem" || data.status === "parte1" || recomendadas.length > 0) {
          setEtapa(2)
        }
      } catch (error) {
        if (!isMounted) return
        setErrorMessage(toMensagemErro(error))
      } finally {
        if (isMounted) setIsLoadingInicial(false)
      }
    }

    void carregarAnamnese()

    return () => {
      isMounted = false
    }
  }, [])

  const progresso = useMemo(() => {
    const base = etapa > 3 ? 3 : etapa
    return `${(base / 3) * 100}%`
  }, [etapa])

  const subtitulo = etapa === 4 ? "Concluida" : `Etapa ${etapa} de 3`

  const podeContinuarParte1 = Boolean(parte1.motivoConsulta.trim()) && parte1.consentimento
  const podeContinuarTriagem = abordagensSelecionadas.length > 0

  const toggleAbordagem = (abordagem: ApproachKey) => {
    setAbordagensSelecionadas((atual) => {
      if (atual.includes(abordagem)) {
        return atual.filter((item) => item !== abordagem)
      }
      if (atual.length >= 2) {
        return atual
      }
      return [...atual, abordagem]
    })
  }

  const atualizarParte2 = (abordagem: ApproachKey, pergunta: string, valor: string) => {
    setParte2((atual) => ({
      ...atual,
      [`${abordagem}.${pergunta}`]: valor,
    }))
  }

  const recuperarParte2 = (abordagem: ApproachKey, pergunta: string) =>
    parte2[`${abordagem}.${pergunta}`] ?? ""

  const salvarParte1 = async () => {
    if (!podeContinuarParte1) return

    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      await api.post("/anamnese", {
        ...parte1,
        status: "parte1",
      } satisfies AnamneseSavePayload)

      const recomendadas = calcularTriagem(parte1)
      setAbordagensSelecionadas(recomendadas)

      await api.patch("/anamnese/triagem", {
        abordagensRecomendadas: recomendadas,
      })

      setSuccessMessage("Parte 1 salva com sucesso.")
      setEtapa(2)
    } catch (error) {
      setErrorMessage(toMensagemErro(error))
    } finally {
      setIsSaving(false)
    }
  }

  const salvarTriagem = async () => {
    if (!podeContinuarTriagem) return

    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      await api.patch("/anamnese/triagem", {
        abordagensRecomendadas: abordagensSelecionadas,
      })
      setSuccessMessage("Triagem salva. Continue para a etapa 3.")
      setEtapa(3)
    } catch (error) {
      setErrorMessage(toMensagemErro(error))
    } finally {
      setIsSaving(false)
    }
  }

  const concluirAnamnese = async () => {
    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const payload: AnamneseSavePayload = {
        abordagensRecomendadas: abordagensSelecionadas,
        status: "concluida",
      }

      abordagensSelecionadas.forEach((abordagem) => {
        const respostas = perguntasParte2[abordagem].reduce<Record<string, string>>((acc, pergunta) => {
          const valor = recuperarParte2(abordagem, pergunta.key).trim()
          if (valor) {
            acc[pergunta.key] = valor
          }
          return acc
        }, {})

        if (!Object.keys(respostas).length) return
        const field = respostaFieldByApproach[abordagem]
        payload[field] = respostas
      })

      await api.post("/anamnese", payload)
      setSuccessMessage("Anamnese concluída e enviada.")
      setEtapa(4)
    } catch (error) {
      setErrorMessage(toMensagemErro(error))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingInicial) {
    return (
      <div className="min-h-screen bg-white font-manrope">
        <div className="px-4 pb-28 lg:max-w-2xl lg:mx-auto lg:px-8">
          <AppHeader variant="patient" title="Anamnese" />
          <Card variant="default" className="mt-4 rounded-3xl border border-neutral-100 p-5 shadow-ds-card">
            <p className="text-sm font-manrope text-neutral-400">Carregando anamnese...</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-manrope">
      <div className="px-4 pb-28 lg:max-w-2xl lg:mx-auto lg:px-8">
      <AppHeader variant="patient" title="Anamnese">
        <p className="text-xs font-manrope font-semibold uppercase tracking-widest text-white/80">
          {subtitulo}
        </p>
      </AppHeader>

      <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-ds-primary transition-all duration-300"
          style={{ width: progresso }}
        />
      </div>

      {errorMessage && (
        <Card variant="default" className="mt-4 rounded-3xl border border-ds-error bg-ds-error/10 p-4 shadow-ds-card">
          <p className="text-sm font-manrope text-ds-error">{errorMessage}</p>
        </Card>
      )}
      {successMessage && (
        <p className="mt-3 text-sm font-manrope font-semibold text-ds-success">{successMessage}</p>
      )}

      {etapa === 1 && (
        <div className="pb-8">
          <p className="mt-6 mb-3 text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
            Por que voce busca apoio?
          </p>
          <Card variant="default" className="rounded-3xl border border-neutral-100 p-4 shadow-ds-card">
            <Label className="mb-2 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Descreva o principal motivo que te traz aqui
            </Label>
            <Textarea
              rows={4}
              placeholder="Em suas proprias palavras..."
              className="font-manrope leading-relaxed"
              value={parte1.motivoConsulta}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  motivoConsulta: event.target.value,
                }))
              }
            />

            <Label className="mb-2 mt-4 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              O que voce espera alcancar com o acompanhamento?
            </Label>
            <Textarea
              rows={3}
              placeholder="Suas expectativas..."
              className="font-manrope leading-relaxed"
              value={parte1.expectativas}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  expectativas: event.target.value,
                }))
              }
            />
          </Card>

          <p className="mt-6 mb-3 text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
            Saude mental e historico
          </p>
          <Card variant="default" className="rounded-3xl border border-neutral-100 p-4 shadow-ds-card">
            <Label className="mb-2 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Historico de saude mental (pessoal e familiar)
            </Label>
            <Textarea
              rows={3}
              className="font-manrope leading-relaxed"
              value={parte1.historicoSaudeMental}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  historicoSaudeMental: event.target.value,
                }))
              }
            />

            <Label className="mb-2 mt-4 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Experiencias dificeis ou traumaticas
            </Label>
            <Textarea
              rows={3}
              placeholder="Pode descrever brevemente, no seu ritmo..."
              className="font-manrope leading-relaxed"
              value={parte1.experienciasTraumaticas}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  experienciasTraumaticas: event.target.value,
                }))
              }
            />

            <Label className="mb-2 mt-4 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Como voce se sente atualmente?
            </Label>
            <Textarea
              rows={3}
              placeholder="Sintomas, emocoes recorrentes..."
              className="font-manrope leading-relaxed"
              value={parte1.sintomasAtuais}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  sintomasAtuais: event.target.value,
                }))
              }
            />
          </Card>

          <p className="mt-6 mb-3 text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
            Estilo de vida
          </p>
          <Card variant="default" className="rounded-3xl border border-neutral-100 p-4 shadow-ds-card">
            <Label className="mb-2 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Sua rotina diaria
            </Label>
            <Textarea
              rows={2}
              className="font-manrope leading-relaxed"
              value={parte1.rotinaDiaria}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  rotinaDiaria: event.target.value,
                }))
              }
            />

            <Label className="mb-2 mt-4 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Como e seu sono?
            </Label>
            <Textarea
              rows={2}
              className="font-manrope leading-relaxed"
              value={parte1.habitosSono}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  habitosSono: event.target.value,
                }))
              }
            />

            <Label className="mb-2 mt-4 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Alimentacao e atividade fisica
            </Label>
            <Textarea
              rows={2}
              className="font-manrope leading-relaxed"
              value={parte1.dietaExercicio}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  dietaExercicio: event.target.value,
                }))
              }
            />

            <Label className="mb-2 mt-4 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Uso de substancias (alcool, tabaco, outras)
            </Label>
            <Textarea
              rows={2}
              placeholder="Pode ser honesto: essas informacoes sao confidenciais."
              className="font-manrope leading-relaxed"
              value={parte1.usoSubstancias}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  usoSubstancias: event.target.value,
                }))
              }
            />
          </Card>

          <p className="mt-6 mb-3 text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
            Relacionamentos
          </p>
          <Card variant="default" className="rounded-3xl border border-neutral-100 p-4 shadow-ds-card">
            <Label className="mb-2 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Como sao seus relacionamentos familiares e sociais?
            </Label>
            <Textarea
              rows={3}
              className="font-manrope leading-relaxed"
              value={parte1.dinamicaFamiliar}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  dinamicaFamiliar: event.target.value,
                }))
              }
            />

            <Label className="mb-2 mt-4 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Voce tem apoio de pessoas proximas?
            </Label>
            <Textarea
              rows={2}
              className="font-manrope leading-relaxed"
              value={parte1.apoioSocial}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  apoioSocial: event.target.value,
                }))
              }
            />
          </Card>

          <p className="mt-6 mb-3 text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
            Seguranca e consentimento
          </p>
          <Card variant="default" className="rounded-3xl border border-neutral-100 p-4 shadow-ds-card">
            <Label className="mb-2 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
              Existe algo que representa risco a sua seguranca?
            </Label>
            <Textarea
              rows={2}
              placeholder="Pensamentos, situacoes... compartilhe se quiser"
              className="font-manrope leading-relaxed"
              value={parte1.indicadoresRisco}
              onChange={(event) =>
                setParte1((prev) => ({
                  ...prev,
                  indicadoresRisco: event.target.value,
                }))
              }
            />

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={parte1.consentimento}
                onChange={(event) =>
                  setParte1((prev) => ({
                    ...prev,
                    consentimento: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 accent-ds-primary"
              />
              <span className="text-sm font-manrope leading-relaxed text-neutral-400">
                Entendo que minhas informacoes sao confidenciais e serao usadas apenas para meu
                acompanhamento clinico.
              </span>
            </label>
          </Card>
        </div>
      )}

      {etapa === 2 && (
        <div className="pb-8">
          <div className="relative mt-4 overflow-hidden rounded-3xl bg-ds-surface-dark p-5 text-white shadow-ds-lg">
            <DotGrid
              color="#ffffff"
              opacity={0.06}
              cols={7}
              rows={3}
              className="pointer-events-none absolute right-3 top-3"
            />
            <p className="relative z-10 text-xs font-manrope font-semibold uppercase tracking-wider opacity-60">
              Com base nas suas respostas
            </p>
            <p className="relative z-10 mt-2 text-xl font-sora font-bold">
              Identificamos {abordagensSelecionadas.length} area
              {abordagensSelecionadas.length > 1 ? "s" : ""} de foco
            </p>
            <p className="relative z-10 mt-1 text-sm font-manrope opacity-75">
              Voce pode ajustar antes de continuar
            </p>
          </div>

          <div className="mt-4">
            {abordagemDefs.map((abordagem) => {
              const selecionada = abordagensSelecionadas.includes(abordagem.key)
              const cores = colors.approach[abordagem.key]

              return (
                <button
                  key={abordagem.key}
                  type="button"
                  onClick={() => toggleAbordagem(abordagem.key)}
                  style={
                    selecionada
                      ? {
                          backgroundColor: cores.bg,
                          borderColor: cores.accent,
                        }
                      : undefined
                  }
                  className="mb-2 w-full rounded-3xl border-2 border-neutral-100 bg-white p-4 text-left shadow-ds-card transition-all duration-200 hover:shadow-ds-md"
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="font-sora font-semibold text-neutral-400"
                      style={selecionada ? { color: cores.text } : undefined}
                    >
                      {abordagem.label}
                    </p>
                    {selecionada && (
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full"
                        style={{ backgroundColor: cores.accent }}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-manrope text-neutral-300 leading-relaxed">
                    {abordagem.desc}
                  </p>
                </button>
              )
            })}
            <p className="mt-2 text-xs font-manrope text-neutral-300">
              Selecione no maximo 2 abordagens.
            </p>
          </div>
        </div>
      )}

      {etapa === 3 && (
        <div className="pb-8">
          <p className="mt-4 text-sm font-manrope leading-relaxed text-neutral-400">
            Responda as perguntas da sua triagem. Quanto mais contexto, melhor para o plano
            terapêutico.
          </p>

          {abordagensSelecionadas.map((abordagem) => {
            const config = abordagemDefs.find((item) => item.key === abordagem)
            const cores = colors.approach[abordagem]

            return (
              <Card
                key={abordagem}
                variant="default"
                className="mt-4 rounded-3xl border p-4 shadow-ds-card transition-all duration-200 hover:shadow-ds-md"
                style={{ borderColor: cores.accent, backgroundColor: cores.bg }}
              >
                <p className="text-base font-sora font-semibold" style={{ color: cores.text }}>
                  {config?.label ?? abordagem}
                </p>
                <p
                  className="mt-1 text-xs font-manrope leading-relaxed"
                  style={{ color: cores.text, opacity: 0.85 }}
                >
                  {config?.desc}
                </p>

                {perguntasParte2[abordagem].map((pergunta) => (
                  <div key={pergunta.key} className="mt-4">
                    <Label className="mb-2 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                      {pergunta.label}
                    </Label>
                    <Textarea
                      rows={3}
                      placeholder={pergunta.placeholder}
                      className="font-manrope leading-relaxed"
                      value={recuperarParte2(abordagem, pergunta.key)}
                      onChange={(event) =>
                        atualizarParte2(abordagem, pergunta.key, event.target.value)
                      }
                    />
                  </div>
                ))}
              </Card>
            )
          })}
        </div>
      )}

      {etapa === 4 && (
        <Card variant="default" className="mt-6 rounded-3xl border border-neutral-100 p-6 shadow-ds-card">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ds-accent-mint">
            <CheckCircle2 className="h-8 w-8 text-ds-success" />
          </div>
          <p className="text-xl font-sora font-bold text-neutral-500">Anamnese concluída</p>
          <p className="mt-2 text-sm font-manrope leading-relaxed text-neutral-400">
            Obrigado por responder. Seu psicólogo já pode acessar suas informações para preparar o
            acompanhamento.
          </p>
          <Button
            className="mt-5 h-12 w-full rounded-2xl font-manrope font-semibold transition-all duration-200 shadow-ds-sm hover:shadow-ds-md"
            onClick={() => navigate("/app/paciente/dashboard")}
          >
            Voltar ao dashboard
          </Button>
        </Card>
      )}

      {etapa !== 4 && (
        <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom,0px))] left-0 right-0 z-20 border-t border-neutral-100 bg-white py-4">
          <div className="mx-auto w-full px-4 lg:max-w-2xl lg:px-8">
            {etapa === 1 && (
              <Button
                variant="primary"
                className="h-12 w-full rounded-2xl font-manrope font-semibold transition-all duration-200 shadow-ds-sm hover:shadow-ds-md"
                disabled={!podeContinuarParte1}
                loading={isSaving}
                onClick={salvarParte1}
              >
                Continuar
              </Button>
            )}
            {etapa === 2 && (
              <Button
                variant="primary"
                className="h-12 w-full rounded-2xl font-manrope font-semibold transition-all duration-200 shadow-ds-sm hover:shadow-ds-md"
                disabled={!podeContinuarTriagem}
                loading={isSaving}
                onClick={salvarTriagem}
              >
                Continuar para perguntas
              </Button>
            )}
            {etapa === 3 && (
              <Button
                variant="primary"
                className="h-12 w-full rounded-2xl font-manrope font-semibold transition-all duration-200 shadow-ds-sm hover:shadow-ds-md"
                loading={isSaving}
                onClick={concluirAnamnese}
              >
                Concluir anamnese
              </Button>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default AnamnesisPage

