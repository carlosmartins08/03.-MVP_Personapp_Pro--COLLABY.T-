
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, PlusCircle, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

import WeeklyCalendarGrid from '@/components/agenda/WeeklyCalendarGrid';
import { Button, PageHeader } from '@/design-system/components';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sessao } from '@/types';

const TelaAgendaSemanal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<Sessao[]>([]);
  const [filterOptions, setFilterOptions] = useState({
    showOnline: true,
    showPresencial: true,
    showConfirmed: true,
    showPending: true,
  });
  
  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get the first and last day of the week for the current date
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Start from Monday
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Sunday
      endOfWeek.setHours(23, 59, 59, 999);
      
      // Fetch sessions from the API
      const data = await api.get<Sessao[]>('/sessoes', {
        query: {
          from: startOfWeek.toISOString(),
          to: endOfWeek.toISOString(),
          order: 'asc',
        },
      });
      
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Erro ao buscar sessões',
        description: 'Não foi possível carregar as sessões. Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, toast]);
  
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);
  
  const filteredSessions = sessions.filter(session => {
    // Apply filters
    if (!filterOptions.showOnline && session.modalidade === 'online') return false;
    if (!filterOptions.showPresencial && session.modalidade === 'presencial') return false;
    if (!filterOptions.showConfirmed && session.status === 'confirmada') return false;
    if (!filterOptions.showPending && session.status === 'agendada') return false;
    
    return true;
  });
  
  const handleCreateSession = () => {
    navigate('/sessoes/cadastro');
  };
  
  const handleSessionClick = (sessionId: string) => {
    navigate(`/sessoes/${sessionId}`);
  };
  
  return (
    <div className="container pb-16">
      <PageHeader 
        title="Agenda Semanal"
        subtitle="Visualize e gerencie suas sessões da semana"
        action={
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white">
                <DropdownMenuCheckboxItem
                  checked={filterOptions.showOnline}
                  onCheckedChange={(checked) => setFilterOptions(prev => ({...prev, showOnline: checked}))}
                >
                  Sessões Online
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.showPresencial}
                  onCheckedChange={(checked) => setFilterOptions(prev => ({...prev, showPresencial: checked}))}
                >
                  Sessões Presenciais
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.showConfirmed}
                  onCheckedChange={(checked) => setFilterOptions(prev => ({...prev, showConfirmed: checked}))}
                >
                  Sessões Confirmadas
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterOptions.showPending}
                  onCheckedChange={(checked) => setFilterOptions(prev => ({...prev, showPending: checked}))}
                >
                  Aguardando Confirmação
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              onClick={handleCreateSession}
              className="persona-button"
              size="sm"
            >
              <PlusCircle size={16} className="mr-1" /> Nova Sessão
            </Button>
          </div>
        }
      />
      
      <div className="px-4 mt-4 space-y-6">
        <WeeklyCalendarGrid
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          sessions={filteredSessions}
          isLoading={isLoading}
          onSessionClick={handleSessionClick}
          onCreateSession={handleCreateSession}
        />
      </div>
    </div>
  );
};

export default TelaAgendaSemanal;
