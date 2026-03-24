import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PageHeader from '@/components/ui/PageHeader';
import ExportEvolucaoButton from '@/components/evolucao/ExportEvolucaoButton';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import EmptyState from '@/components/ui/EmptyState';
import {
  Activity,
  ClipboardList,
  CalendarClock,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import type { PacienteApi, SessaoApi } from '@/types/api';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const rankingDescriptions: Record<string, string> = {
  normal: 'Acompanhamento regular',
  faltas_frequentes: 'Frequência instável',
  inadimplente: 'Situação financeira pendente',
  intensivo: 'Programa intensivo',
};

const statusLabel: Record<string, string> = {
  agendada: 'Agendada',
  confirmada: 'Confirmada',
  realizada: 'Realizada',
  faltou: 'Faltou',
  cancelada: 'Cancelada',
};

const badgeVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  agendada: 'outline',
  confirmada: 'default',
  realizada: 'secondary',
  faltou: 'destructive',
  cancelada: 'destructive',
};

const formatSessionDate = (value?: string) => {
  if (!value) return 'Sem data';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Sem data';
  return format(parsed, 'dd/MM/yyyy', { locale: ptBR });
};

const formatSessionTime = (value?: string) => {
  if (!value) return '--:--';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '--:--';
  return format(parsed, 'HH:mm', { locale: ptBR });
};

const formatSessionLabel = (value?: string) => {
  if (!value) return 'Sem data';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Sem data';
  return format(parsed, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

const TelaEvolucaoPaciente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: paciente, isLoading: isPacienteLoading } = useQuery({
    queryKey: ['paciente', id],
    queryFn: () => (id ? api.get<PacienteApi>(`/pacientes/${id}`) : Promise.resolve(null)),
    enabled: Boolean(id),
  });

  const { data: sessoes = [], isLoading: isSessoesLoading } = useQuery({
    queryKey: ['sessoes', id],
    queryFn: () =>
      api.get<SessaoApi[]>('/sessoes', {
        query: { pacienteId: id, order: 'desc' },
      }),
    enabled: Boolean(id),
  });

  const isLoading = !id || isPacienteLoading || isSessoesLoading;

  if (isLoading) {
    return (
      <div className="container py-6">
        <PageHeader title="Evolução do Paciente" subtitle="Carregando dados..." />
        <p className="text-center py-10 text-muted-foreground">Carregando informações clínicas...</p>
      </div>
    );
  }

  if (!paciente) {
    return (
      <EmptyState
        title="Paciente não encontrado"
        description="Verifique se o link ainda é válido e retorne para a lista de pacientes."
        actionLabel="Voltar para pacientes"
        onAction={() => navigate('/pacientes')}
      />
    );
  }

  const sessoesPaciente = sessoes.filter(s => s.pacienteId === id);
  const sessoesRealizadas = sessoesPaciente.filter(s => s.status === 'realizada');
  const sessoesPendentes = sessoesPaciente.filter(s =>
    s.status ? ['agendada', 'confirmada'].includes(s.status) : false
  );
  const sessoesFaltas = sessoesPaciente.filter(s => s.status === 'faltou');
  const totalSessoes = sessoesPaciente.length;
  const attendanceRate = totalSessoes
    ? Math.round((sessoesRealizadas.length / totalSessoes) * 100)
    : 0;

  const sessoesRealizadasAsc = [...sessoesRealizadas].sort((a, b) => {
    const aTime = a.data ? new Date(a.data).getTime() : 0;
    const bTime = b.data ? new Date(b.data).getTime() : 0;
    return aTime - bTime;
  });
  const sessoesRealizadasDesc = [...sessoesRealizadasAsc].reverse();
  const historicoRecente = sessoesRealizadasDesc.slice(0, 4);
  const ultimaSessao = historicoRecente[0];

  const diasEntreSessoes: number[] = [];
  for (let i = 1; i < sessoesRealizadasAsc.length; i += 1) {
    const anterior = sessoesRealizadasAsc[i - 1].data
      ? new Date(sessoesRealizadasAsc[i - 1].data).getTime()
      : NaN;
    const atual = sessoesRealizadasAsc[i].data
      ? new Date(sessoesRealizadasAsc[i].data).getTime()
      : NaN;
    if (!Number.isNaN(anterior) && !Number.isNaN(atual)) {
      const diferenca = atual - anterior;
      diasEntreSessoes.push(diferenca / (1000 * 60 * 60 * 24));
    }
  }
  const intervaloMedioDias =
    diasEntreSessoes.length > 0
      ? Math.round(
          diasEntreSessoes.reduce((acc, valor) => acc + valor, 0) / diasEntreSessoes.length
        )
      : null;

  const proximasSessoes = [...sessoesPendentes].sort((a, b) => {
    const aTime = a.data ? new Date(a.data).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.data ? new Date(b.data).getTime() : Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });

  const financeiroPaciente = sessoesPaciente;
  const totalPago = financeiroPaciente
    .filter(entry => entry.statusPagamento === 'pago')
    .reduce((acc, entry) => acc + (entry.valor ?? 0), 0);
  const totalPendentes = financeiroPaciente
    .filter(entry => entry.statusPagamento === 'pendente')
    .reduce((acc, entry) => acc + (entry.valor ?? 0), 0);

  const ultimaSessaoFinanceira = financeiroPaciente
    .filter(entry => entry.statusPagamento === 'pago' && entry.data)
    .sort((a, b) => {
      const aTime = a.data ? new Date(a.data).getTime() : 0;
      const bTime = b.data ? new Date(b.data).getTime() : 0;
      return bTime - aTime;
    })[0];

  const rankingText =
    rankingDescriptions[paciente.statusRanqueado ?? 'normal'] ?? 'Acompanhamento ativo';

  const dataCadastro = paciente.criadoEm
    ? format(new Date(paciente.criadoEm), 'dd/MM/yyyy', { locale: ptBR })
    : 'Sem registro';

  return (
    <div className="container pb-16">
      <PageHeader
        title="Evolução do Paciente"
        subtitle={`Visão clínica detalhada de ${paciente.nome}`}
        rightContent={
          <ExportEvolucaoButton
            paciente={paciente}
            sessoes={sessoesPaciente}
            profissionalNome="Dr. Nome do Profissional"
          />
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={paciente.fotoPerfil} alt={paciente.nome} />
                <AvatarFallback>{paciente.nome[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Paciente
                </p>
                <h2 className="text-2xl font-semibold text-foreground">{paciente.nome}</h2>
                <p className="text-sm text-muted-foreground">
                  Desde {dataCadastro}
                </p>
              </div>
            </div>
            <Badge variant="outline">{rankingText}</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{paciente.telefone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{paciente.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                <span>
                  {format(new Date(paciente.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })} (
                  {paciente.genero})
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{paciente.endereco}</span>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Observações</p>
                <p className="text-sm text-foreground">
                  {paciente.observacoes || 'Nenhuma observação clínica registrada.'}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total de faltas</span>
                <span>{paciente.totalFaltas}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Status financeiro</span>
                <span>{totalPendentes > 0 ? 'Com pendências' : 'Em dia'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Última sessão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ultimaSessao ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Registrada em</p>
                    <p className="text-lg font-semibold">
                      {formatSessionLabel(ultimaSessao.data)}
                    </p>
                  </div>
                  <Badge variant={badgeVariants[ultimaSessao.status] ?? 'outline'}>
                    {statusLabel[ultimaSessao.status] ?? ultimaSessao.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Duração: {ultimaSessao.duracao} minutos • Valor:{' '}
                  {currencyFormatter.format(ultimaSessao.valor)}
                </div>
                {intervaloMedioDias !== null && (
                  <div className="text-sm text-muted-foreground">
                    Intervalo médio entre sessões: {intervaloMedioDias} dias
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Ainda não há sessões registradas para este paciente.
              </p>
            )}
            {ultimaSessaoFinanceira && (
              <p className="text-sm text-muted-foreground">
                Último pagamento confirmado em{' '}
                {format(new Date(ultimaSessaoFinanceira.dataPagamento!), 'dd/MM/yyyy', {
                  locale: ptBR,
                })}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Taxa de comparecimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">{attendanceRate}%</p>
                <p className="text-xs text-muted-foreground">
                  {sessoesRealizadas.length} concluídas • {sessoesPendentes.length} agendadas
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                {sessoesFaltas.length} faltas registradas
              </div>
            </div>
            <Progress value={attendanceRate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total recebido</span>
              <strong className="text-base text-foreground">
                {currencyFormatter.format(totalPago)}
              </strong>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Pendências</span>
              <span>{currencyFormatter.format(totalPendentes)}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {financeiroPaciente.length === 0
                ? 'Nenhum registro financeiro encontrado.'
                : `Última movimentação: ${
                    ultimaSessaoFinanceira
                      ? format(
                          new Date(ultimaSessaoFinanceira.dataPagamento!),
                          'dd/MM/yyyy',
                          { locale: ptBR }
                        )
                      : 'sem pagamento confirmado'
                  }`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Próxima sessão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {proximasSessoes.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {formatSessionLabel(proximasSessoes[0].data)}
                </p>
                <div className="text-sm text-muted-foreground">
                  {proximasSessoes[0].duracao} minutos • Valor:{' '}
                  {currencyFormatter.format(proximasSessoes[0].valor)}
                </div>
                <Badge variant={badgeVariants[proximasSessoes[0].status] ?? 'outline'}>
                  {statusLabel[proximasSessoes[0].status] ?? 'Agendada'}
                </Badge>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Sem sessões agendadas no momento.</p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <span>Último registro</span>
              <span>
                {sessoesRealizadas.length
                  ? format(new Date(sessoesRealizadasDesc[0].data), 'dd/MM/yyyy', { locale: ptBR })
                  : 'nenhuma sessão'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Próximas sessões</CardTitle>
              <p className="text-xs text-muted-foreground">
                {proximasSessoes.length} agendamento(s) planejado(s)
              </p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {proximasSessoes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem novos agendamentos.</p>
            ) : (
              proximasSessoes.map(sessao => (
                <div
                  key={sessao.id}
                  className="space-y-1 border-b border-muted/40 py-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {formatSessionDate(sessao.data)} • {formatSessionTime(sessao.data)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Duração {sessao.duracao} minutos
                      </p>
                    </div>
                    <Badge variant={badgeVariants[sessao.status] ?? 'outline'}>
                      {statusLabel[sessao.status] ?? sessao.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valor: {currencyFormatter.format(sessao.valor)}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Histórico recente</CardTitle>
              <p className="text-xs text-muted-foreground">
                {historicoRecente.length} sessão(ões) realizadas
              </p>
            </div>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {historicoRecente.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma sessão finalizada para mostrar o histórico.
              </p>
            ) : (
              historicoRecente.map(sessao => (
                <div
                  key={sessao.id}
                  className="space-y-1 border-b border-muted/40 py-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        {formatSessionDate(sessao.data)} • {formatSessionTime(sessao.data)}
                      </p>
                      <p className="text-xs text-muted-foreground">Score clínico não registrado</p>
                    </div>
                    <Badge variant={badgeVariants[sessao.status] ?? 'outline'}>
                      {statusLabel[sessao.status] ?? sessao.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valor: {currencyFormatter.format(sessao.valor)}
                  </div>
                  {sessao.anotacoes && (
                    <p className="text-sm text-muted-foreground">{sessao.anotacoes}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelaEvolucaoPaciente;
