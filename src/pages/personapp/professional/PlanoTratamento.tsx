import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import {
  AppHeader,
  Badge,
  Button,
  Card,
  Input,
  Label,
  Skeleton,
  Textarea,
} from "@/design-system/components";
import {
  useAtualizarPlano,
  useCriarPlano,
  usePlanoPaciente,
  type PlanoTratamentoInput,
} from "@/hooks/usePlanoTratamento";
import { api } from "@/lib/api";

type AnamneseResumo = {
  abordagensRecomendadas?: string[];
};

const abordagemLabels: Record<string, string> = {
  psicanalise: "Psicanalise",
  behaviorismo: "Behaviorismo",
  humanismo: "Humanismo",
  cognitivismo: "Cognitivismo",
  psicPositiva: "Psicologia Positiva",
  neuropsicologia: "Neuropsicologia",
  sistemica: "Sistemica",
  transpessoal: "Transpessoal",
};

const labelAbordagem = (key: string) => abordagemLabels[key] ?? key;

const emptyForm: Omit<PlanoTratamentoInput, "pacienteId"> = {
  objetivos: "",
  abordagem: "",
  frequencia: "",
  duracaoPrevista: "",
  tecnicas: "",
  indicadores: "",
  observacoes: "",
};

const PlanoTratamentoPage = () => {
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const { data: plano, isLoading: isLoadingPlano } = usePlanoPaciente(pacienteId);
  const { data: anamnese } = useQuery<AnamneseResumo | null>({
    queryKey: ["anamnese", "paciente", pacienteId],
    queryFn: async () => {
      if (!pacienteId) return null;
      return api.get<AnamneseResumo | null>("/anamnese", {
        query: { pacienteId },
      });
    },
    enabled: Boolean(pacienteId),
  });

  const criarPlano = useCriarPlano();
  const atualizarPlano = useAtualizarPlano();
  const [modoEdicao, setModoEdicao] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (plano) {
      setModoEdicao(false);
      setForm({
        objetivos: plano.objetivos ?? "",
        abordagem: plano.abordagem ?? "",
        frequencia: plano.frequencia ?? "",
        duracaoPrevista: plano.duracaoPrevista ?? "",
        tecnicas: plano.tecnicas ?? "",
        indicadores: plano.indicadores ?? "",
        observacoes: plano.observacoes ?? "",
      });
      return;
    }

    setModoEdicao(true);
    setForm(emptyForm);
  }, [plano, pacienteId]);

  const isSaving = criarPlano.isPending || atualizarPlano.isPending;
  const canSave =
    form.objetivos.trim().length > 0
    && form.abordagem.trim().length > 0
    && form.frequencia.trim().length > 0
    && Boolean(pacienteId);

  const abordagensRecomendadas = useMemo(
    () => anamnese?.abordagensRecomendadas ?? [],
    [anamnese?.abordagensRecomendadas]
  );

  const handleSalvar = async () => {
    if (!pacienteId || !canSave) return;

    const payload = {
      objetivos: form.objetivos.trim(),
      abordagem: form.abordagem.trim(),
      frequencia: form.frequencia.trim(),
      duracaoPrevista: form.duracaoPrevista?.trim() || undefined,
      tecnicas: form.tecnicas?.trim() || undefined,
      indicadores: form.indicadores?.trim() || undefined,
      observacoes: form.observacoes?.trim() || undefined,
    };

    if (plano) {
      await atualizarPlano.mutateAsync({
        id: plano.id,
        ...payload,
      });
    } else {
      await criarPlano.mutateAsync({
        pacienteId,
        ...payload,
      });
    }

    setModoEdicao(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-32 font-manrope">
      <AppHeader
        variant="professional"
        title="Plano de Tratamento"
        action={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 rounded-2xl font-manrope font-semibold transition-all duration-200"
            onClick={() => navigate("/app/profissional/pacientes")}
          >
            Voltar
          </Button>
        }
      />

      {isLoadingPlano ? (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      ) : (
        <>
          {abordagensRecomendadas.length > 0 && (
            <div className="bg-ds-accent-lavender border border-ds-primary/15 rounded-3xl p-4 mt-4 shadow-ds-card">
              <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-ds-primary mb-2">
                Abordagens da anamnese
              </p>
              <div className="flex gap-2 flex-wrap">
                {abordagensRecomendadas.map((abordagem) => (
                  <Badge key={abordagem} variant="info" size="sm">
                    {labelAbordagem(abordagem)}
                  </Badge>
                ))}
              </div>
              <p className="text-xs font-manrope text-neutral-300 mt-2">Use como referencia para o plano.</p>
            </div>
          )}

          {!modoEdicao && plano && (
            <div className="mt-4 space-y-3">
              <Card className="rounded-3xl p-5 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                      Plano ativo
                    </p>
                    <p className="mt-1 text-base font-sora font-semibold text-neutral-500">
                      {plano.abordagem}
                    </p>
                    <p className="text-xs font-manrope text-neutral-300 mt-1">
                      {plano.frequencia}
                      {plano.duracaoPrevista ? ` Â· ${plano.duracaoPrevista}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-2xl font-manrope font-semibold transition-all duration-200"
                    onClick={() => setModoEdicao(true)}
                  >
                    Editar
                  </Button>
                </div>
              </Card>

              <Card className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
                <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                  Objetivos terapeuticos
                </p>
                <p className="text-sm font-manrope text-neutral-400 leading-relaxed whitespace-pre-wrap">{plano.objetivos}</p>
              </Card>

              {plano.tecnicas && (
                <Card className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
                  <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    Tecnicas planejadas
                  </p>
                  <p className="text-sm font-manrope text-neutral-400 leading-relaxed whitespace-pre-wrap">{plano.tecnicas}</p>
                </Card>
              )}

              {plano.indicadores && (
                <Card className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
                  <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    Indicadores de progresso
                  </p>
                  <p className="text-sm font-manrope text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {plano.indicadores}
                  </p>
                </Card>
              )}

              {plano.observacoes && (
                <Card className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card transition-all duration-200 hover:shadow-ds-md">
                  <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                    Observacoes
                  </p>
                  <p className="text-sm font-manrope text-neutral-400 leading-relaxed whitespace-pre-wrap">
                    {plano.observacoes}
                  </p>
                </Card>
              )}
            </div>
          )}

          {modoEdicao && (
            <div className="mt-4 pb-24">
              <Card className="rounded-3xl p-4 border border-neutral-100 shadow-ds-card">
                <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mb-3">
                  Objetivos terapeuticos
                </p>
                <Label htmlFor="objetivos" className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                  O que voce espera alcancar com este paciente?
                </Label>
                <Textarea
                  id="objetivos"
                  rows={4}
                  className="mt-2 font-manrope"
                  placeholder="Descreva as metas principais do tratamento..."
                  value={form.objetivos}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, objetivos: event.target.value }))
                  }
                />

                <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mt-5 mb-3">
                  Abordagem e metodo
                </p>
                <Label htmlFor="abordagem" className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                  Abordagem terapeutica escolhida e justificativa
                </Label>
                <Textarea
                  id="abordagem"
                  rows={3}
                  className="mt-2 font-manrope"
                  placeholder="Ex: Terapia Cognitivo-Comportamental com sessoes semanais..."
                  value={form.abordagem}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, abordagem: event.target.value }))
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <Label htmlFor="frequencia" className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">Frequencia</Label>
                    <Input
                      id="frequencia"
                      className="mt-2 font-manrope"
                      placeholder="Ex: Semanal"
                      value={form.frequencia}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, frequencia: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="duracaoPrevista" className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">Duracao prevista</Label>
                    <Input
                      id="duracaoPrevista"
                      className="mt-2 font-manrope"
                      placeholder="Ex: 3 meses"
                      value={form.duracaoPrevista}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, duracaoPrevista: event.target.value }))
                      }
                    />
                  </div>
                </div>

                <p className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 mt-5 mb-3">
                  Tecnicas e indicadores
                </p>
                <Label htmlFor="tecnicas" className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                  Tecnicas e intervencoes planejadas
                </Label>
                <Textarea
                  id="tecnicas"
                  rows={3}
                  className="mt-2 font-manrope"
                  placeholder="Ex: Reestruturacao cognitiva, registro de pensamentos..."
                  value={form.tecnicas}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, tecnicas: event.target.value }))
                  }
                />

                <Label htmlFor="indicadores" className="mt-4 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                  Como medir o progresso?
                </Label>
                <Textarea
                  id="indicadores"
                  rows={2}
                  className="mt-2 font-manrope"
                  placeholder="Ex: Reducao de episodios ansiosos, melhora no sono..."
                  value={form.indicadores}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, indicadores: event.target.value }))
                  }
                />

                <Label htmlFor="observacoes" className="mt-4 block text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300">
                  Observacoes adicionais
                </Label>
                <Textarea
                  id="observacoes"
                  rows={2}
                  className="mt-2 font-manrope"
                  value={form.observacoes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, observacoes: event.target.value }))
                  }
                />
              </Card>
            </div>
          )}
        </>
      )}

      {modoEdicao && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="primary"
              className="w-full rounded-2xl font-manrope font-semibold transition-all duration-200 shadow-ds-sm hover:shadow-ds-md"
              onClick={handleSalvar}
              disabled={!canSave || isSaving}
            >
              {isSaving ? "Salvando..." : plano ? "Atualizar plano" : "Criar plano"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanoTratamentoPage;

