import React, { useEffect, useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { AppHeader, Button, Card, Input } from "@/design-system/components"
import { cn } from "@/lib/utils"
import { anamnesisSchema, type AnamnesisFormValues } from "@/forms/anamnesisSchema"

const DRAFT_KEY = "personapp_anamnesis_draft"

const stepMeta = [
  { title: "Informacoes basicas", estimate: "2 min" },
  { title: "Historico de saude mental", estimate: "3 min" },
  { title: "Motivacoes", estimate: "2 min" },
  { title: "Disponibilidade", estimate: "2 min" },
]

const challengeOptions = [
  "Ansiedade",
  "Depressao",
  "Autoestima",
  "Relacionamentos",
  "Estresse",
  "Autoconhecimento",
  "Luto",
  "Traumas",
  "Sono",
  "Foco",
]

const daysOptions = [
  "Segunda",
  "Terca",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
]

const periodOptions = ["Manha", "Tarde", "Noite"]
const modalityOptions = ["Online", "Presencial", "Hibrido"]

const loadDraft = (): Partial<AnamnesisFormValues> => {
  if (typeof window === "undefined") return {}
  const raw = window.localStorage.getItem(DRAFT_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as Partial<AnamnesisFormValues>
  } catch {
    return {}
  }
}

const AnamnesisPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [submitted, setSubmitted] = useState(false)
  const saveTimeout = useRef<number | null>(null)

  const defaultValues = useMemo<AnamnesisFormValues>(() => {
    const draft = loadDraft()
    return {
      nome: draft.nome ?? "",
      dataNascimento: draft.dataNascimento ?? "",
      genero: draft.genero ?? "",
      estadoCivil: draft.estadoCivil ?? "",
      terapiaAnterior: draft.terapiaAnterior ?? "nao",
      medicacao: draft.medicacao ?? "nao",
      motivacao: draft.motivacao ?? "",
      desafios: draft.desafios ?? [],
      disponibilidadeDias: draft.disponibilidadeDias ?? [],
      disponibilidadePeriodo: draft.disponibilidadePeriodo ?? "",
      modalidade: draft.modalidade ?? "",
    }
  }, [])

  const form = useForm<AnamnesisFormValues>({
    resolver: zodResolver(anamnesisSchema),
    defaultValues,
    mode: "onTouched",
  })

  const {
    register,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = form
  const selectedChallenges = watch("desafios") ?? []
  const selectedDays = watch("disponibilidadeDias") ?? []
  const selectedPeriod = watch("disponibilidadePeriodo")
  const selectedModalidade = watch("modalidade")
  const terapiaAnterior = watch("terapiaAnterior")
  const medicacao = watch("medicacao")

  useEffect(() => {
    if (typeof window === "undefined") return
    const subscription = watch(() => {
      if (saveTimeout.current) {
        window.clearTimeout(saveTimeout.current)
      }
      setSaveStatus("saving")
      saveTimeout.current = window.setTimeout(() => {
        const values = getValues()
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
        setSaveStatus("saved")
      }, 1000)
    })

    return () => {
      subscription.unsubscribe()
      if (saveTimeout.current) {
        window.clearTimeout(saveTimeout.current)
      }
    }
  }, [watch, getValues])

  const stepFields: Record<number, Array<keyof AnamnesisFormValues>> = {
    1: ["nome", "dataNascimento", "genero", "estadoCivil"],
    2: ["terapiaAnterior", "medicacao"],
    3: ["motivacao", "desafios"],
    4: ["disponibilidadeDias", "disponibilidadePeriodo", "modalidade"],
  }

  const handleNext = async () => {
    const fields = stepFields[step]
    const valid = await trigger(fields)
    if (!valid) return

    if (step < 4) {
      setStep((prev) => prev + 1)
      return
    }

    // TODO: integrar com backend quando houver rota de anamnese.
    const values = getValues()
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
    setSubmitted(true)
  }

  const toggleMulti = (field: "desafios" | "disponibilidadeDias", value: string) => {
    const current = watch(field) ?? []
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    setValue(field, next, { shouldDirty: true, shouldValidate: true })
  }

  const progress = `${(step / 4) * 100}%`
  const currentStep = stepMeta[step - 1]

  if (submitted) {
    return (
      <>
        <AppHeader variant="minimal" />
        <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
          <Card variant="default" className="p-6">
            <h1 className="text-lg font-semibold text-gray-900">Anamnese enviada</h1>
            <p className="mt-2 text-sm text-gray-600">
              Suas respostas foram salvas. Seu psicologo tera acesso em breve.
            </p>
            <div className="mt-4">
              <Button onClick={() => navigate("/app/paciente/dashboard")}>Voltar</Button>
            </div>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader variant="minimal" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="h-1 w-full rounded-full bg-gray-100">
            <div
              className="h-1 rounded-full bg-ds-primary transition-all duration-300"
              style={{ width: progress }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
            <span>Passo {step} de 4</span>
            <span>~{currentStep.estimate}</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">{currentStep.title}</h1>
            <span className="text-xs font-medium text-gray-500">
              {saveStatus === "saving" ? "Salvando..." : "Auto-save ativo"}
            </span>
          </div>
        </div>

        <Card variant="default" className="p-5">
          {step === 1 && (
            <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="nome" className="text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <Input id="nome" placeholder="Seu nome" {...register("nome")} />
              {errors.nome && (
                <p className="text-xs text-ds-error">{errors.nome.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="dataNascimento" className="text-sm font-medium text-gray-700">
                  Data de nascimento
                </label>
                <Input
                  id="dataNascimento"
                  type="date"
                  {...register("dataNascimento")}
                />
                {errors.dataNascimento && (
                  <p className="text-xs text-ds-error">{errors.dataNascimento.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="genero" className="text-sm font-medium text-gray-700">
                  Genero
                </label>
                <select
                  id="genero"
                  {...register("genero")}
                  className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-ds-primary"
                >
                  <option value="">Selecione</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                  <option value="nao-binario">Nao-binario</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro-nao-dizer">Prefiro nao dizer</option>
                </select>
                {errors.genero && (
                  <p className="text-xs text-ds-error">{errors.genero.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="estadoCivil" className="text-sm font-medium text-gray-700">
                Estado civil
              </label>
              <select
                id="estadoCivil"
                {...register("estadoCivil")}
                className="h-12 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-ds-primary"
              >
                <option value="">Selecione</option>
                <option value="solteiro">Solteiro</option>
                <option value="casado">Casado</option>
                <option value="divorciado">Divorciado</option>
                <option value="viuvo">Viuvo</option>
                <option value="uniao-estavel">Uniao estavel</option>
                <option value="outro">Outro</option>
              </select>
              {errors.estadoCivil && (
                <p className="text-xs text-ds-error">{errors.estadoCivil.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Ja fez terapia?</p>
              <div className="flex gap-2">
                {(["sim", "nao"] as const).map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                      terapiaAnterior === option
                        ? "border-ds-primary bg-ds-primary text-white"
                        : "border-gray-200 text-gray-600"
                    )}
                  >
                    <input
                      type="radio"
                      value={option}
                      {...register("terapiaAnterior")}
                      className="sr-only"
                    />
                    {option === "sim" ? "Sim" : "Nao"}
                  </label>
                ))}
              </div>
              {errors.terapiaAnterior && (
                <p className="text-xs text-ds-error">{errors.terapiaAnterior.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Usa medicacao?</p>
              <div className="flex gap-2">
                {(["sim", "nao"] as const).map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium",
                      medicacao === option
                        ? "border-ds-primary bg-ds-primary text-white"
                        : "border-gray-200 text-gray-600"
                    )}
                  >
                    <input
                      type="radio"
                      value={option}
                      {...register("medicacao")}
                      className="sr-only"
                    />
                    {option === "sim" ? "Sim" : "Nao"}
                  </label>
                ))}
              </div>
              {errors.medicacao && (
                <p className="text-xs text-ds-error">{errors.medicacao.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="motivacao" className="text-sm font-medium text-gray-700">
                Conte um pouco sobre o que motivou voce a buscar terapia
              </label>
              <textarea
                id="motivacao"
                rows={5}
                {...register("motivacao")}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
              {errors.motivacao && (
                <p className="text-xs text-ds-error">{errors.motivacao.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Desafios principais</p>
              <div className="flex flex-wrap gap-2">
                {challengeOptions.map((option) => {
                  const isActive = selectedChallenges.includes(option)
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleMulti("desafios", option)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        isActive
                          ? "border-ds-primary bg-ds-primary text-white"
                          : "border-gray-200 text-gray-600"
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
              {errors.desafios && (
                <p className="text-xs text-ds-error">{errors.desafios.message}</p>
              )}
            </div>
          </div>
        )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Dias disponiveis</p>
              <div className="flex flex-wrap gap-2">
                {daysOptions.map((option) => {
                  const isActive = selectedDays.includes(option)
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleMulti("disponibilidadeDias", option)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        isActive
                          ? "border-ds-primary bg-ds-primary text-white"
                          : "border-gray-200 text-gray-600"
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
              {errors.disponibilidadeDias && (
                <p className="text-xs text-ds-error">{errors.disponibilidadeDias.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Periodo preferido</p>
              <div className="flex flex-wrap gap-2">
                {periodOptions.map((option) => {
                  const isActive = selectedPeriod === option
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setValue("disponibilidadePeriodo", option, { shouldValidate: true })}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        isActive
                          ? "border-ds-primary bg-ds-primary text-white"
                          : "border-gray-200 text-gray-600"
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
              {errors.disponibilidadePeriodo && (
                <p className="text-xs text-ds-error">{errors.disponibilidadePeriodo.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-700">Modalidade</p>
              <div className="flex flex-wrap gap-2">
                {modalityOptions.map((option) => {
                  const isActive = selectedModalidade === option
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setValue("modalidade", option, { shouldValidate: true })}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                        isActive
                          ? "border-ds-primary bg-ds-primary text-white"
                          : "border-gray-200 text-gray-600"
                      )}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
              {errors.modalidade && (
                <p className="text-xs text-ds-error">{errors.modalidade.message}</p>
              )}
            </div>
          </div>
          )}
        </Card>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            disabled={step === 1}
          >
            Anterior
          </Button>
          <Button onClick={handleNext}>{step === 4 ? "Concluir" : "Proximo"}</Button>
        </div>
      </div>
    </>
  )
}

export default AnamnesisPage
