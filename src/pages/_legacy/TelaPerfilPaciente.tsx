import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/components';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  User, 
  Brain,
  Mail,
  Phone,
  CalendarClock,
  MapPin,
  FileEdit, Check, AlertTriangle, X, Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ProntuarioExportButton from '@/components/prontuario/ProntuarioExportButton';
import ListaMensagens from '@/components/mensagens/ListaMensagens';
import ExportAlertasButton from '@/components/alertas/ExportAlertasButton';
import InsightsTematicos from '@/components/perfil/insights/InsightsTematicos';
import type { PacienteApi, SessaoApi } from '@/types/api';

type StatusBadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

const statusLabels: Record<NonNullable<PacienteApi['statusRanqueado']>, string> = {
  normal: 'Normal',
  faltas_frequentes: 'Faltas frequentes',
  inadimplente: 'Inadimplente',
  intensivo: 'Intensivo',
};

const statusVariants: Record<NonNullable<PacienteApi['statusRanqueado']>, StatusBadgeVariant> = {
  normal: 'success',
  faltas_frequentes: 'warning',
  inadimplente: 'error',
  intensivo: 'primary',
};

const getInitials = (name?: string | null) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
};

const TelaPerfilPaciente = () => {
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
        query: {
          pacienteId: id,
          order: 'desc',
        },
      }),
    enabled: Boolean(id),
  });

  const isLoading = !id || isPacienteLoading || isSessoesLoading;

  const sessoesPaciente = useMemo(
    () => sessoes.filter((sessao) => (id ? sessao.pacienteId === id : false)),
    [sessoes, id],
  );
  const proxSessoes = sessoesPaciente.filter(
    (sessao) => sessao.status && ['agendada', 'confirmada'].includes(sessao.status),
  );
  const sessoesRealizadas = sessoesPaciente.filter((sessao) => sessao.status === 'realizada');

  const sessoesPorMes = useMemo(() => {
    const grouped: Record<string, SessaoApi[]> = {};
    sessoesPaciente.forEach((sessao) => {
      if (!sessao.data) {
        return;
      }
      const dataSessao = new Date(sessao.data);
      if (Number.isNaN(dataSessao.getTime())) {
        return;
      }
      const mesAno = format(dataSessao, 'MMMM yyyy', { locale: ptBR });
      if (!grouped[mesAno]) {
        grouped[mesAno] = [];
      }
      grouped[mesAno].push(sessao);
    });

    Object.values(grouped).forEach((list) => {
      list.sort((a, b) => {
        const aTime = a.data ? new Date(a.data).getTime() : 0;
        const bTime = b.data ? new Date(b.data).getTime() : 0;
        return bTime - aTime;
      });
    });

    return grouped;
  }, [sessoesPaciente]);

  if (isLoading) {
    return (
      <div className="container py-6">
        <PageHeader title="Paciente" subtitle="Carregando informações..." />
        <p className="text-center py-10 text-muted-foreground">Buscando dados do paciente...</p>
      </div>
    );
  }

  if (!paciente) {
    return (
      <EmptyState
        title="Paciente não encontrado"
        description="O paciente que você está procurando não existe ou foi removido."
        icon={<User size={48} />}
        action={
          <Button variant="secondary" size="sm" onClick={() => navigate('/pacientes')}>
            Voltar para Pacientes
          </Button>
        }
      />
    );
  }

  const dataNascimento = paciente.dataNascimento
    ? format(new Date(paciente.dataNascimento), 'dd/MM/yyyy')
    : 'Não informado';
  const dataCadastro = paciente.criadoEm
    ? format(new Date(paciente.criadoEm), 'dd/MM/yyyy')
    : 'Sem registro';

  const status = paciente.statusRanqueado ?? undefined;

  return (
    <div className="container pb-16">
      {/* Header */}
      <PageHeader
        title={paciente.nome}
        subtitle={`Paciente desde ${dataCadastro}`}
        action={
          <div className="flex gap-2">
            <ExportAlertasButton
              pacienteId={paciente.id}
              pacienteNome={paciente.nome}
              profissionalNome="Dr. Nome do Profissional"
            />
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate(`/pacientes/${id}/insights`)}
            >
              <Brain size={16} className="mr-1" /> Ver Insights
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate('/pacientes')}
            >
              <ArrowLeft size={16} className="mr-1" /> Voltar
            </Button>
          </div>
        }
      />
      
      {/* Patient Info Card */}
      <div className="p-4">
        <Card variant="default" className="mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar
              size="xl"
              imageUrl={paciente.fotoPerfil ?? undefined}
              initials={getInitials(paciente.nome)}
            />
            
            <div className="flex-grow text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <h2 className="text-xl font-bold">{paciente.nome}</h2>
                {status && (
                  <Badge variant={statusVariants[status]} size="sm">
                    {statusLabels[status]}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone size={16} className="mr-2" />
                  <span>{paciente.telefone}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail size={16} className="mr-2" />
                  <span>{paciente.email}</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarClock size={16} className="mr-2" />
                  <span>{dataNascimento} ({paciente.genero})</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin size={16} className="mr-2" />
                  <span>{paciente.endereco}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full overflow-x-auto flex gap-1 mb-4">
            <TabsTrigger value="info" className="flex-shrink-0 min-w-[120px]">Informações</TabsTrigger>
            <TabsTrigger value="sessoes" className="flex-shrink-0 min-w-[120px]">Sessões</TabsTrigger>
            <TabsTrigger value="prontuario" className="flex-shrink-0 min-w-[120px]">Prontuário</TabsTrigger>
            <TabsTrigger value="mensagens" className="flex-shrink-0 min-w-[120px]">Mensagens</TabsTrigger>
            <TabsTrigger value="insights" className="flex-shrink-0 min-w-[120px]">Insights</TabsTrigger>
          </TabsList>
          
          {/* Info Tab */}
          <TabsContent value="info" className="mt-0">
            <Card variant="default">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-3">
                <FileText size={18} className="text-lavanda" />
                <h3 className="text-lg font-semibold">Observações</h3>
              </div>
              <p className="text-sm">
                {paciente.observacoes || "Nenhuma observação registrada."}
              </p>
            </Card>
            
            <div className="mt-4 flex space-x-2">
              <Button 
                onClick={() => {}} 
                variant="primary"
                className="flex-1"
              >
                <FileEdit size={16} className="mr-2" />
                Editar Perfil
              </Button>
              <Button 
                onClick={() => navigate(`/sessoes/cadastro?pacienteId=${paciente.id}`)} 
                variant="secondary"
                className="flex-1"
              >
                <Calendar size={16} className="mr-2" />
                Nova Sessão
              </Button>
            </div>
          </TabsContent>
          
          {/* Sessions Tab */}
          <TabsContent value="sessoes" className="mt-0">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <Calendar size={18} className="mr-2 text-lavanda" />
              Próximas Sessões
            </h3>
            
            {proxSessoes.length > 0 ? (
              <div className="space-y-3 mb-6">
                {proxSessoes.map(sessao => {
                  const dataSessao = new Date(sessao.data);
                  const dataFormatada = format(dataSessao, "dd/MM/yyyy", { locale: ptBR });
                  const horaFormatada = format(dataSessao, "HH:mm", { locale: ptBR });
                  
                  return (
                    <Card key={sessao.id} variant="default">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-azul-light flex items-center justify-center text-azul font-bold">
                            {horaFormatada}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold">{dataFormatada}</h3>
                          <p className="text-sm text-muted-foreground">
                            {sessao.duracao} minutos - 
                            {sessao.status === 'agendada' ? ' Agendada' : ' Confirmada'}
                          </p>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => navigate(`/sessoes/${sessao.id}`)}
                        >
                          Ver
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card variant="default" className="text-center bg-muted/20 border-dashed mb-6">
                <p className="text-muted-foreground">Nenhuma sessão agendada</p>
              </Card>
            )}
            
            <Button 
              onClick={() => navigate(`/sessoes/cadastro?pacienteId=${paciente.id}`)} 
              variant="primary"
              className="w-full"
            >
              <Calendar size={16} className="mr-2" />
              Agendar Nova Sessão
            </Button>
          </TabsContent>
          
          {/* Medical Records Tab */}
          <TabsContent value="prontuario" className="mt-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold flex items-center">
                <FileText size={18} className="mr-2 text-lavanda" />
                Histórico Clínico
              </h3>
              <ProntuarioExportButton paciente={paciente} sessoes={sessoesPaciente} />
            </div>
            
            {Object.entries(sessoesPorMes).map(([mesAno, sessoes]) => (
              <div key={mesAno} className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-muted-foreground capitalize">
                  {mesAno}
                </h4>
                
                <div className="space-y-4">
                  {sessoes.map(sessao => {
                    const dataSessao = new Date(sessao.data);
                    const dataFormatada = format(dataSessao, "dd 'de' MMMM", { locale: ptBR });
                    const horaFormatada = format(dataSessao, "HH:mm", { locale: ptBR });
                    
                    let statusIcon;
                    let statusColor;
                    switch (sessao.status) {
                      case 'realizada':
                        statusIcon = <Check size={18} className="text-menta-dark" />;
                        statusColor = 'text-menta-dark';
                        break;
                      case 'faltou':
                        statusIcon = <AlertTriangle size={18} className="text-destructive" />;
                        statusColor = 'text-destructive';
                        break;
                      case 'cancelada':
                        statusIcon = <X size={18} className="text-muted-foreground" />;
                        statusColor = 'text-muted-foreground';
                        break;
                      default:
                        statusIcon = <Clock size={18} className="text-muted-foreground" />;
                        statusColor = 'text-muted-foreground';
                    }
                    
                    return (
                      <Card
                        key={sessao.id}
                        variant="default"
                        className="relative overflow-hidden border-l-4 p-0"
                        style={{ borderLeftColor: sessao.status === 'realizada' ? '#88D8B0' : 
                                               sessao.status === 'faltou' ? '#ea384c' : '#8E9196' }}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-medium">{dataFormatada}</span>
                              <span className="text-sm text-muted-foreground">às {horaFormatada}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {statusIcon}
                              <span className={`text-sm capitalize ${statusColor}`}>
                                {sessao.status}
                              </span>
                            </div>
                          </div>
                          
                          {sessao.valor > 0 && (
                            <div className="text-sm text-muted-foreground mb-3">
                              Valor: {new Intl.NumberFormat('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL' 
                              }).format(sessao.valor)}
                            </div>
                          )}
                          
                          <div className="text-sm prose prose-sm max-w-none">
                            {sessao.anotacoes ? (
                              <p className="whitespace-pre-wrap">{sessao.anotacoes}</p>
                            ) : (
                              <p className="text-muted-foreground italic">
                                Sem anotações clínicas registradas.
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {Object.keys(sessoesPorMes).length === 0 && (
              <Card variant="default" className="text-center bg-muted/20 border-dashed">
                <p className="text-muted-foreground">
                  Nenhuma sessão registrada no prontuário.
                </p>
              </Card>
            )}
          </TabsContent>
          
          {/* Messages Tab */}
          <TabsContent value="mensagens">
            <h3 className="text-md font-semibold mb-3 flex items-center">
              <Mail size={18} className="mr-2 text-lavanda" />
              Histórico de Mensagens
            </h3>
            <ListaMensagens pacienteId={paciente.id} />
          </TabsContent>
          
          {/* Insights Tab */}
          <TabsContent value="insights">
            <InsightsTematicos pacienteId={paciente.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TelaPerfilPaciente;

