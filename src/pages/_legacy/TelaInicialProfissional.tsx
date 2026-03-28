import React, { useEffect, useState } from 'react';
import { Button, Card, PageHeader } from '@/design-system/components';
import { Calendar, DollarSign, Clock, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useTodaysSessions } from '@/hooks/useTodaysSessions';
import { useFrequentAbsences } from '@/hooks/useFrequentAbsences';
import { usuarioMock, pacientesMock } from '@/data/mockData';
import AlertaFaltasFrequentes from '@/components/home/AlertaFaltasFrequentes';
import { AlertasServicosCard } from '@/components/servicos/AlertasServicosCard';

const TelaInicialProfissional = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchTodaysSessions, isLoading: isLoadingSessions } = useTodaysSessions();
  const { fetchFrequentAbsences, isLoading: isLoadingAbsences } = useFrequentAbsences();
  const [todaysSessions, setTodaysSessions] = useState([]);
  const [frequentAbsences, setFrequentAbsences] = useState([]);
  const dataHoje = new Date();
  const dataFormatada = format(dataHoje, "EEEE, d 'de' MMMM", { locale: ptBR });

  useEffect(() => {
    const loadTodaysSessions = async () => {
      try {
        const sessions = await fetchTodaysSessions();
        setTodaysSessions(sessions);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar sessões",
          description: "Não foi possível carregar as sessões do dia."
        });
      }
    };

    const loadFrequentAbsences = async () => {
      try {
        const absences = await fetchFrequentAbsences();
        setFrequentAbsences(absences);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar faltas",
          description: "Não foi possível carregar os pacientes com faltas frequentes."
        });
      }
    };

    loadTodaysSessions();
    loadFrequentAbsences();
  }, [fetchTodaysSessions, fetchFrequentAbsences, toast]);

  const sessoesAgendadas = todaysSessions.filter(s => ['agendada', 'confirmada'].includes(s.status)).length;
  const valorTotalHoje = 0; // This will be calculated once we have the session values

  return (
    <div className="container pb-16">
      <PageHeader 
        title={`Olá, ${usuarioMock.nome.split(' ')[0]}!`}
        subtitle={`${dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)}`}
      />
      
      <div className="px-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-lavanda-light border-none">
            <div className="pb-2 pt-4">
              <h3 className="text-sm font-medium text-gray-600 flex items-center">
                <Calendar size={16} className="mr-1" />
                Sessões Hoje
              </h3>
            </div>
            <div>
              <p className="text-2xl font-bold">{sessoesAgendadas}</p>
            </div>
          </Card>
          
          <Card className="bg-menta-light border-none">
            <div className="pb-2 pt-4">
              <h3 className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign size={16} className="mr-1" />
                Valor Total
              </h3>
            </div>
            <div>
              <p className="text-2xl font-bold">R$ {valorTotalHoje}</p>
            </div>
          </Card>
        </div>
        
        <AlertasServicosCard />
        
        <AlertaFaltasFrequentes />
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Clock size={20} className="mr-2 text-lavanda" />
            Próximas Sessões
          </h2>
          
          {isLoadingSessions ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Carregando sessões...</p>
            </Card>
          ) : todaysSessions.length > 0 ? (
            <div className="space-y-3">
              {todaysSessions.map(sessao => (
                <Card key={sessao.id} className="persona-card">
                  <div className="flex items-center p-3">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-12 h-12 rounded-full bg-azul-light flex items-center justify-center text-azul font-bold">
                        {sessao.horario}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{sessao.pacienteNome}</h3>
                      <p className="text-sm text-muted-foreground">
                        {sessao.status === 'agendada' ? 'Agendada' : 
                          sessao.status === 'confirmada' ? 'Confirmada' : 
                          sessao.status === 'realizada' ? 'Realizada' : 
                          sessao.status === 'cancelada' ? 'Cancelada' : 'Faltou'}
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
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center bg-muted/20 border-dashed">
              <AlertCircle className="mx-auto mb-2 text-muted-foreground" size={24} />
              <p className="text-muted-foreground">Nenhuma sessão agendada para hoje</p>
            </Card>
          )}
          
          <div className="mt-4">
            <Button 
              className="w-full persona-button"
              onClick={() => navigate('/sessoes')}
            >
              Ver Todas as Sessões
            </Button>
          </div>
        </div>
        
        <div className="">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Users size={20} className="mr-2 text-lavanda" />
            Pacientes Recentes
          </h2>
          
          <div className="space-y-3">
            {pacientesMock.slice(0, 3).map(paciente => (
              <Card key={paciente.id} className="persona-card">
                <div className="flex items-center p-3">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={paciente.fotoPerfil} 
                        alt={paciente.nome} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{paciente.nome}</h3>
                    <p className="text-sm text-muted-foreground">{paciente.telefone}</p>
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => navigate(`/pacientes/${paciente.id}`)}
                  >
                    Ver
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-4">
            <Button 
              className="w-full persona-button"
              onClick={() => navigate('/pacientes')}
            >
              Ver Todos os Pacientes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelaInicialProfissional;


