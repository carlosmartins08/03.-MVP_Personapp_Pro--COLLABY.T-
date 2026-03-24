import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePacienteComportamento } from '@/hooks/usePacienteComportamento';
import { buildTemaAnaliseFromDiarios } from '@/utils/tema-analise';
import EngajamentoSessoes from '@/components/comportamento/EngajamentoSessoes';
import DiarioSentimentos from '@/components/comportamento/DiarioSentimentos';
import AvaliacoesSessoes from '@/components/comportamento/AvaliacoesSessoes';
import ScoreEmocional from '@/components/comportamento/ScoreEmocional';
import AlertasRecomendacoes from '@/components/comportamento/AlertasRecomendacoes';
import RankingTemasImpactoScore from '@/components/perfil/RankingTemasImpactoScore';
import TemaPredominanteAtual from '@/components/perfil/TemaPredominanteAtual';
import { api } from '@/lib/api';

const TelaComportamentoPaciente = () => {
  const navigate = useNavigate();
  const { id: pacienteIdFromUrl } = useParams<{ id: string }>();
  const [pacienteId, setPacienteId] = useState<string | null>(pacienteIdFromUrl || null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: pacientes, isLoading: isLoadingPacientes } = useQuery({
    queryKey: ['pacientes', searchTerm],
    queryFn: async () => {
      const data = await api.get<Array<{ id: string; nome: string }>>('/pacientes', {
        query: searchTerm ? { search: searchTerm } : undefined,
      });
      return data;
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erro ao buscar pacientes',
        description: 'Tente novamente em instantes.',
      });
    },
  });

  useEffect(() => {
    if (pacienteIdFromUrl && !pacienteId) {
      setPacienteId(pacienteIdFromUrl);
    }
  }, [pacienteIdFromUrl, pacienteId]);

  const { data: comportamento, isLoading: isLoadingComportamento } = usePacienteComportamento(pacienteId);

  const temas = useMemo(() => {
    if (!comportamento?.diarios) return [];
    return buildTemaAnaliseFromDiarios(comportamento.diarios);
  }, [comportamento]);

  const handleSelectPaciente = (id: string) => {
    setPacienteId(id);
    navigate(`/profissional/comportamento/${id}`, { replace: true });
  };

  const sessoes = comportamento?.sessoes ?? [];
  const diarios = comportamento?.diarios ?? [];
  const alertasClinicos = comportamento?.alertas ?? [];

  return (
    <div className="container pb-16">
      <PageHeader
        title="Comportamento do Paciente"
        subtitle="Analise detalhada do comportamento e progresso emocional"
        rightContent={
          pacienteId && (
            <Button variant="outline" onClick={() => navigate(`/profissional/paciente/${pacienteId}`)}>
              Ver perfil completo
            </Button>
          )
        }
      />

      <div className="px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={pacienteId || ''} onValueChange={handleSelectPaciente}>
              <SelectTrigger className="min-w-[200px]">
                <SelectValue placeholder="Selecionar paciente" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingPacientes ? (
                  <div className="p-2 text-center text-muted-foreground">Carregando...</div>
                ) : pacientes?.length ? (
                  pacientes.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nome}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-muted-foreground">Nenhum paciente encontrado</div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!pacienteId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <AlertTriangle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Selecione um paciente</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Selecione um paciente para visualizar seu comportamento e progresso emocional.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EngajamentoSessoes sessoes={sessoes} isLoading={isLoadingComportamento} />
            <DiarioSentimentos diarios={diarios} isLoading={isLoadingComportamento} />
            <AvaliacoesSessoes avaliacoes={comportamento?.avaliacoes ?? []} isLoading={isLoadingComportamento} />
            <ScoreEmocional sessoes={sessoes} isLoading={isLoadingComportamento} />

            <div className="lg:col-span-2">
              <AlertasRecomendacoes
                sessoes={sessoes}
                diarios={diarios}
                alertasClinicos={alertasClinicos}
                isLoading={isLoadingComportamento}
              />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <TemaPredominanteAtual temas={temas} isLoading={isLoadingComportamento} />
              <RankingTemasImpactoScore
                temas={temas}
                isLoading={isLoadingComportamento}
                onVerSessoes={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelaComportamentoPaciente;
