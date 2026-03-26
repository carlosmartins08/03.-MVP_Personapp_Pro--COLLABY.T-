import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge, Card, Input } from '@/design-system/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Search, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusSessao } from '@/types';
import { api } from '@/lib/api';
import type { PacienteApi, SessaoApi } from '@/types/api';

type StatusBadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

type StatusInfo = {
  label: string;
  badgeVariant: StatusBadgeVariant;
  timeClassName: string;
};

const statusInfoMap: Record<StatusSessao, StatusInfo> = {
  agendada: {
    label: 'Agendada',
    badgeVariant: 'primary',
    timeClassName: 'bg-ds-primary-light text-ds-primary',
  },
  confirmada: {
    label: 'Confirmada',
    badgeVariant: 'success',
    timeClassName: 'bg-emerald-100 text-emerald-700',
  },
  realizada: {
    label: 'Realizada',
    badgeVariant: 'neutral',
    timeClassName: 'bg-gray-200 text-gray-700',
  },
  cancelada: {
    label: 'Cancelada',
    badgeVariant: 'error',
    timeClassName: 'bg-red-100 text-red-500',
  },
  faltou: {
    label: 'Faltou',
    badgeVariant: 'error',
    timeClassName: 'bg-red-100 text-red-500',
  },
};

const TelaSessoes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: pacientes = [], isLoading: isLoadingPacientes } = useQuery({
    queryKey: ['pacientes'],
    queryFn: () => api.get<PacienteApi[]>('/pacientes'),
  });

  const { data: sessoes = [], isLoading: isLoadingSessoes } = useQuery({
    queryKey: ['sessoes-status'],
    queryFn: () =>
      api.get<SessaoApi[]>('/sessoes', {
        query: { order: 'desc' },
      }),
  });

  const isLoading = isLoadingPacientes || isLoadingSessoes;

  if (isLoading) {
    return (
      <div className="container pb-16">
        <PageHeader
          title="Sessões"
          subtitle="Gerencie as sessões dos pacientes"
        />
        <p className="text-center py-10 text-muted-foreground">Carregando sessões...</p>
      </div>
    );
  }

  const getPaciente = (id: string) => pacientes.find((p) => p.id === id);

  const sessoesFuturas = sessoes.filter(
    (s) => s.status && ['agendada', 'confirmada'].includes(s.status),
  );
  const sessoesRealizadas = sessoes.filter((s) => s.status === 'realizada');
  const sessoesCanceladas = sessoes.filter(
    (s) => s.status && ['cancelada', 'faltou'].includes(s.status),
  );
  
  // Filtrar pelo termo de busca
  const filtrarSessoes = (lista: SessaoApi[]) => {
    if (!searchTerm) return lista;

    return lista.filter((sessao) => {
      const paciente = getPaciente(sessao.pacienteId ?? '');
      if (!paciente) return false;

      return paciente.nome.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };
  
  const sessoesFuturasFiltradas = filtrarSessoes(sessoesFuturas);
  const sessoesRealizadasFiltradas = filtrarSessoes(sessoesRealizadas);
  const sessoesCanceladasFiltradas = filtrarSessoes(sessoesCanceladas);
  
  // Renderizar card de sessão
  const renderSessaoCard = (sessao: SessaoApi) => {
    const paciente = getPaciente(sessao.pacienteId);
    if (!paciente) return null;
    
    const dataSessao = sessao.data ? new Date(sessao.data) : null;
    const dataFormatada = dataSessao ? format(dataSessao, "dd/MM/yyyy", { locale: ptBR }) : 'Sem data';
    const horaFormatada = dataSessao ? format(dataSessao, "HH:mm", { locale: ptBR }) : '--:--';
    
    // Definir texto do status
    const status = (sessao.status ?? 'agendada') as StatusSessao;
    const statusInfo = statusInfoMap[status];
    
    return (
      <Link key={sessao.id} to={`/sessoes/${sessao.id}`} className="block">
        <Card variant="default" className="hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold ${statusInfo.timeClassName}`}>
              {horaFormatada}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{paciente.nome}</h3>
                <Badge variant={statusInfo.badgeVariant} size="sm">
                  {statusInfo.label}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-2 text-sm text-muted-foreground">
                <span>{dataFormatada}</span>
                <span className="hidden sm:inline">â€¢</span>
                <span>{sessao.duracao} min</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <div className="container pb-16">
      <PageHeader
        title="Sessões"
        subtitle="Gerencie as sessões dos pacientes"
        rightContent={
          <Button 
            onClick={() => navigate('/sessoes/cadastro')}
            className="persona-button"
            size="sm"
          >
            <Plus size={16} className="mr-1" /> Nova
          </Button>
        }
      />

      <div className="p-4">
        <div className="mb-4 relative">
          <label htmlFor="busca-sessoes" className="sr-only">
            Buscar paciente
          </label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            id="busca-sessoes"
            type="search"
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="futuras" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="futuras">Futuras</TabsTrigger>
            <TabsTrigger value="realizadas">Realizadas</TabsTrigger>
            <TabsTrigger value="canceladas">Canceladas</TabsTrigger>
          </TabsList>
          
          {/* Aba de Sessões Futuras */}
          <TabsContent value="futuras" className="mt-0">
            {sessoesFuturasFiltradas.length > 0 ? (
              <div className="space-y-3">
                {sessoesFuturasFiltradas.map(renderSessaoCard)}
              </div>
            ) : (
              <EmptyState
                icon={<Calendar size={48} />}
                title={
                  searchTerm
                    ? "Nenhuma sessão encontrada"
                    : "Nenhuma sessão agendada"
                }
                description={
                  searchTerm
                    ? "Tente buscar com outros termos."
                    : "Agende sua primeira sessão para começar."
                }
                actionLabel={!searchTerm ? "Agendar Sessão" : undefined}
                onAction={
                  !searchTerm ? () => navigate("/sessoes/cadastro") : undefined
                }
              />
            )}
          </TabsContent>
          
          {/* Aba de Sessões Realizadas */}
          <TabsContent value="realizadas" className="mt-0">
            {sessoesRealizadasFiltradas.length > 0 ? (
              <div className="space-y-3">
                {sessoesRealizadasFiltradas.map(renderSessaoCard)}
              </div>
            ) : (
              <EmptyState
                icon={<Clock size={48} />}
                title="Nenhuma sessão realizada"
                description={
                  searchTerm
                    ? "Tente buscar com outros termos."
                    : "As sessões realizadas aparecerão aqui."
                }
              />
            )}
          </TabsContent>
          
          {/* Aba de Sessões Canceladas */}
          <TabsContent value="canceladas" className="mt-0">
            {sessoesCanceladasFiltradas.length > 0 ? (
              <div className="space-y-3">
                {sessoesCanceladasFiltradas.map(renderSessaoCard)}
              </div>
            ) : (
              <EmptyState
                icon={<Clock size={48} />}
                title="Nenhuma sessão cancelada"
                description="As sessões canceladas aparecerão aqui."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TelaSessoes;

