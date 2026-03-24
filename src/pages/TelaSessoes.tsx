
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Search, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatusSessao } from '@/types';
import { api } from '@/lib/api';
import type { PacienteApi, SessaoApi } from '@/types/api';

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
    
    // Definir cor do indicador de status
    const getStatusColor = (status: StatusSessao) => {
      switch (status) {
        case 'agendada': return 'bg-azul-light text-azul';
        case 'confirmada': return 'bg-menta-light text-menta-dark';
        case 'realizada': return 'bg-lavanda-light text-lavanda-dark';
        case 'cancelada': 
        case 'faltou': 
          return 'bg-red-100 text-red-500';
      }
    };
    
    // Definir texto do status
    const getStatusText = (status: StatusSessao) => {
      switch (status) {
        case 'agendada': return 'Agendada';
        case 'confirmada': return 'Confirmada';
        case 'realizada': return 'Realizada';
        case 'cancelada': return 'Cancelada';
        case 'faltou': return 'Faltou';
        default: return 'Agendada';
      }
    };

    const status = (sessao.status ?? 'agendada') as StatusSessao;
    
    return (
      <Card 
        key={sessao.id} 
        className="persona-card hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => navigate(`/sessoes/${sessao.id}`)}
      >
        <div className="flex items-center p-3">
          <div className="flex-shrink-0 mr-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getStatusColor(status)}`}>
              {horaFormatada}
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="font-semibold">{paciente.nome}</h3>
            <div className="flex flex-col sm:flex-row sm:space-x-2 text-sm text-muted-foreground">
              <span>{dataFormatada}</span>
              <span className="hidden sm:inline">•</span>
              <span>{sessao.duracao} min</span>
              <span className="hidden sm:inline">•</span>
              <span>{getStatusText(status)}</span>
            </div>
          </div>
        </div>
      </Card>
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 persona-input"
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
