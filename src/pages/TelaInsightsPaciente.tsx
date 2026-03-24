
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, CheckCircle2, Clock, DollarSign, Users, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, Pie, PieChart, Cell } from 'recharts';
import { api } from '@/lib/api';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { PacienteApi, SessaoApi } from '@/types/api';

const TelaInsightsPaciente = () => {
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
        <PageHeader
          title="Insights do paciente"
          subtitle="Preparando os dados..."
        />
        <p className="text-center py-10 text-muted-foreground">Carregando métricas...</p>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="container py-6">
        <PageHeader
          title="Paciente não encontrado"
          subtitle="O paciente que você está procurando não existe ou foi removido."
          rightContent={
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/pacientes')}
            >
              <ArrowLeft size={16} className="mr-1" /> Voltar
            </Button>
          }
        />
      </div>
    );
  }

  const sessoesPaciente = sessoes.filter(s => s.pacienteId === id);

  const sessoesRealizadas = sessoesPaciente.filter(s => s.status === 'realizada');
  const faltas = sessoesPaciente.filter(s => s.status === 'faltou');
  
  // Dados para o gráfico de frequência mensal
  const frequenciaMensal = sessoesRealizadas.reduce((acc, sessao) => {
    const mes = format(new Date(sessao.data), 'MMMM', { locale: ptBR });
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dadosFrequencia = Object.entries(frequenciaMensal).map(([mes, total]) => ({
    mes,
    total
  }));

  // Dados para o gráfico de pizza (realizadas vs faltas)
  const dadosPizza = [
    { name: 'Realizadas', value: sessoesRealizadas.length },
    { name: 'Faltas', value: faltas.length }
  ];
  
  const CORES_PIZZA = ['#88D8B0', '#F97316'];

  // Cálculo de intervalos
  const sessoesDatas = sessoesRealizadas
    .map(s => new Date(s.data))
    .sort((a, b) => a.getTime() - b.getTime());
    
  const ultimaSessao = sessoesDatas[sessoesDatas.length - 1];
  const intervalos = sessoesDatas.slice(1).map((data, i) => {
    return differenceInDays(data, sessoesDatas[i]);
  });
  
  const mediaIntervalos = intervalos.length > 0 
    ? Math.round(intervalos.reduce((a, b) => a + b, 0) / intervalos.length)
    : 0;
  
  const maiorIntervalo = Math.max(...intervalos, 0);

  // Cálculo financeiro
  const totalCobrado = sessoesPaciente.reduce((total, sessao) => total + (sessao.valor ?? 0), 0);
  const totalRecebido = sessoesPaciente
    .filter(s => s.statusPagamento === 'pago')
    .reduce((total, sessao) => total + (sessao.valor ?? 0), 0);
  const valorPendente = totalCobrado - totalRecebido;

  const ultimasCobrancas = [...sessoesPaciente]
    .sort((a, b) => {
      const aTime = a.data ? new Date(a.data).getTime() : 0;
      const bTime = b.data ? new Date(b.data).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 3);

  return (
    <div className="container pb-16">
      <PageHeader
        title={`Insights - ${paciente.nome}`}
        subtitle="Análise detalhada do histórico do paciente"
        rightContent={
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/pacientes/${id}`)}
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar ao Perfil
          </Button>
        }
      />
      
      <div className="grid gap-6 p-4">
        {/* Bloco de Sessões */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users size={18} className="mr-2 text-lavanda" />
              Histórico de Sessões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{sessoesRealizadas.length}</div>
                <div className="text-sm text-muted-foreground">Total de Sessões</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round(sessoesRealizadas.length / (Object.keys(frequenciaMensal).length || 1))}
                </div>
                <div className="text-sm text-muted-foreground">Média Mensal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{Object.keys(frequenciaMensal).length}</div>
                <div className="text-sm text-muted-foreground">Meses em Atendimento</div>
              </div>
            </div>
            
            <div className="h-[200px] w-full">
              <ChartContainer
                config={{
                  total: {
                    theme: {
                      light: "#9b87f5",
                      dark: "#9b87f5",
                    },
                  },
                }}
              >
                <AreaChart data={dadosFrequencia}>
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--color-total)"
                    fill="var(--color-total)"
                    fillOpacity={0.2}
                  />
                  <ChartTooltip />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bloco de Faltas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <X size={18} className="mr-2 text-destructive" />
              Análise de Faltas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{faltas.length}</div>
                <div className="text-sm text-muted-foreground">Total de Faltas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {((faltas.length / (sessoesRealizadas.length + faltas.length)) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Taxa de Faltas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {faltas.length > 0 ? Math.round(sessoesRealizadas.length / faltas.length) : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Sessões por Falta</div>
              </div>
            </div>

            <div className="h-[200px] w-full flex justify-center">
              <PieChart width={200} height={200}>
                <Pie
                  data={dadosPizza}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES_PIZZA[index]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </div>
          </CardContent>
        </Card>

        {/* Bloco Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <DollarSign size={18} className="mr-2 text-menta-dark" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(totalCobrado)}
                </div>
                <div className="text-sm text-muted-foreground">Total Cobrado</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-menta-dark">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(totalRecebido)}
                </div>
                <div className="text-sm text-muted-foreground">Total Recebido</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(valorPendente)}
                </div>
                <div className="text-sm text-muted-foreground">Valor Pendente</div>
              </div>
            </div>

            <div className="space-y-2">
              {ultimasCobrancas.map(cobranca => (
                <div key={cobranca.id} className="flex items-center justify-between p-2 rounded bg-muted/20">
                  <div>
                    <div className="font-medium">
                      {format(new Date(cobranca.data), "dd/MM/yyyy")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(cobranca.valor)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {cobranca.statusPagamento === 'pago' ? (
                      <CheckCircle2 size={16} className="text-menta-dark" />
                    ) : (
                      <Clock size={16} className="text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bloco de Intervalos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock size={18} className="mr-2 text-lavanda" />
              Intervalos de Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{mediaIntervalos}</div>
                <div className="text-sm text-muted-foreground">Média de Dias Entre Sessões</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{maiorIntervalo}</div>
                <div className="text-sm text-muted-foreground">Maior Intervalo (dias)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {ultimaSessao ? format(ultimaSessao, "dd/MM/yyyy") : '-'}
                </div>
                <div className="text-sm text-muted-foreground">Última Sessão</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelaInsightsPaciente;
