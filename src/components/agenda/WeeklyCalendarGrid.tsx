import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Laptop, 
  Building, 
  Clock, 
  Package, 
  AlertCircle,
  Plus 
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sessao } from '@/types';

interface WeeklyCalendarGridProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  sessions: Sessao[];
  isLoading?: boolean;
  onSessionClick?: (sessionId: string) => void;
  onCreateSession?: (date: Date) => void;
}

const TIME_SLOTS = Array.from({ length: 25 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const WeeklyCalendarGrid = ({ 
  currentDate, 
  onDateChange, 
  sessions, 
  isLoading,
  onSessionClick,
  onCreateSession
}: WeeklyCalendarGridProps) => {
  const navigate = useNavigate();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const [selectedSession, setSelectedSession] = React.useState<Sessao | null>(null);
  const [sessionDetailsOpen, setSessionDetailsOpen] = React.useState(false);
  
  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    onDateChange(newDate);
  };

  const handleTodayClick = () => {
    onDateChange(new Date());
  };

  const getSessionsForDateAndTime = (date: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotStart = new Date(date);
    slotStart.setHours(hours, minutes, 0, 0);
    
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotStart.getMinutes() + 30);
    
    return sessions.filter(session => {
      const sessionDate = parseISO(session.data);
      
      return isSameDay(sessionDate, date) && 
             sessionDate.getHours() === hours && 
             sessionDate.getMinutes() >= minutes && 
             sessionDate.getMinutes() < minutes + 30;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'agendada':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'faltou':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'cancelada':
        return 'bg-gray-100 text-gray-600 border-gray-300';
      default:
        return 'bg-menta-light text-menta-dark border-menta';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmada': return 'Confirmada';
      case 'agendada': return 'Aguardando';
      case 'faltou': return 'Faltou';
      case 'cancelada': return 'Cancelada';
      case 'realizada': return 'Realizada';
      default: return status;
    }
  };

  const handleCreateSessionAtTime = (date: Date, timeSlot: string) => {
    if (onCreateSession) {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const sessionDate = new Date(date);
      sessionDate.setHours(hours, minutes, 0, 0);
      onCreateSession(sessionDate);
    } else {
      navigate('/sessoes/cadastro');
    }
  };

  const handleSessionCardClick = (session: Sessao) => {
    setSelectedSession(session);
    setSessionDetailsOpen(true);
    if (onSessionClick) {
      onSessionClick(session.id);
    }
  };

  const isPastTimeSlot = (date: Date, timeSlot: string) => {
    const now = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    
    return slotDate < now;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full overflow-hidden rounded-lg border bg-white space-y-4 p-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array(7).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="h-10 w-full mb-2" />
              {Array(8).fill(0).map((_, j) => (
                <Skeleton key={j} className="h-20 w-full mb-2" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-lg border bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-lavanda" />
          <h2 className="font-semibold">
            {format(weekStart, "d 'de' MMMM", { locale: ptBR })} - 
            {format(addDays(weekStart, 6), "d 'de' MMMM, yyyy", { locale: ptBR })}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleTodayClick}
          >
            Hoje
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePreviousWeek}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNextWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="hidden md:flex w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-20 py-2 px-1 text-center">Horário</TableHead>
              {weekDays.map(day => (
                <TableHead key={day.toISOString()} className="py-2 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">
                      {format(day, 'EEEE', { locale: ptBR })}
                    </span>
                    <span className={cn(
                      "text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center",
                      isSameDay(day, new Date()) && "bg-lavanda text-white"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {TIME_SLOTS.map(timeSlot => (
              <TableRow key={timeSlot} className="h-20 border-b">
                <TableCell className="w-20 text-sm text-center text-gray-500 border-r bg-gray-50 p-1">
                  {timeSlot}
                </TableCell>
                {weekDays.map(day => {
                  const sessionsAtTime = getSessionsForDateAndTime(day, timeSlot);
                  const isPast = isPastTimeSlot(day, timeSlot);
                  
                  return (
                    <TableCell 
                      key={`${day.toISOString()}-${timeSlot}`} 
                      className={cn(
                        "border-r p-1 relative",
                        isPast && "bg-gray-50/50"
                      )}
                    >
                      {sessionsAtTime.length > 0 ? (
                        sessionsAtTime.map(session => (
                          <TooltipProvider key={session.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => handleSessionCardClick(session)}
                                  className={cn(
                                    "w-full p-2 rounded-md text-left text-sm transition-shadow",
                                    "hover:shadow-md cursor-pointer border",
                                    getStatusColor(session.status)
                                  )}
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="font-medium truncate">
                                      {format(parseISO(session.data), 'HH:mm')}
                                    </span>
                                    <div className="flex gap-1">
                                      {session.modalidade === 'online' ? (
                                        <Laptop className="h-4 w-4" />
                                      ) : (
                                        <Building className="h-4 w-4" />
                                      )}
                                      <Clock className="h-4 w-4" />
                                    </div>
                                  </div>
                                  <div className="truncate">
                                    {session.pacienteId}
                                  </div>
                                  <div className="flex justify-between text-xs mt-1">
                                    <span>{session.duracao} min</span>
                                    <span className="px-1.5 rounded-full bg-white/60">
                                      {getStatusText(session.status)}
                                    </span>
                                  </div>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="p-1">
                                  <p className="font-bold">Paciente: {session.pacienteId}</p>
                                  <p>Duração: {session.duracao} minutos</p>
                                  <p>Status: {getStatusText(session.status)}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))
                      ) : (
                        !isPast && (
                          <button
                            onClick={() => handleCreateSessionAtTime(day, timeSlot)}
                            className="w-full h-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        )
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden flex flex-col w-full h-full overflow-hidden">
        <div className="flex p-2 gap-2 justify-between border-b">
          {weekDays.map(day => (
            <Button
              key={day.toISOString()}
              variant="ghost"
              className={cn(
                "flex-1 flex flex-col items-center py-1 px-0",
                isSameDay(day, currentDate) && "bg-lavanda/10"
              )}
              onClick={() => onDateChange(day)}
            >
              <span className="text-xs">
                {format(day, 'EEE', { locale: ptBR })}
              </span>
              <span className={cn(
                "text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center",
                isSameDay(day, new Date()) && "bg-lavanda text-white"
              )}>
                {format(day, 'd')}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {TIME_SLOTS.map(timeSlot => {
            const sessionsAtTime = getSessionsForDateAndTime(currentDate, timeSlot);
            const isPast = isPastTimeSlot(currentDate, timeSlot);
            
            return (
              <div 
                key={timeSlot}
                className={cn(
                  "flex border-b",
                  isPast && "bg-gray-50/50"
                )}
              >
                <div className="w-16 py-2 text-xs text-center text-gray-500 border-r bg-gray-50">
                  {timeSlot}
                </div>
                <div className="flex-1 p-1">
                  {sessionsAtTime.length > 0 ? (
                    sessionsAtTime.map(session => (
                      <button
                        key={session.id}
                        onClick={() => handleSessionCardClick(session)}
                        className={cn(
                          "w-full p-2 rounded-md text-left text-sm mb-1",
                          "hover:shadow-md cursor-pointer border",
                          getStatusColor(session.status)
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium">
                            {format(parseISO(session.data), 'HH:mm')}
                          </span>
                          <div className="flex gap-1">
                            {session.modalidade === 'online' ? (
                              <Laptop className="h-4 w-4" />
                            ) : (
                              <Building className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                        <div className="truncate">{session.pacienteId}</div>
                        <div className="text-xs">{session.duracao} min</div>
                      </button>
                    ))
                  ) : (
                    !isPast && (
                      <button
                        onClick={() => handleCreateSessionAtTime(currentDate, timeSlot)}
                        className="w-full h-16 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedSession && (
        <Dialog open={sessionDetailsOpen} onOpenChange={setSessionDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detalhes da Sessão</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Data e Hora</p>
                  <p className="text-sm">
                    {format(parseISO(selectedSession.data), "dd/MM/yyyy 'às' HH:mm", { 
                      locale: ptBR 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Duração</p>
                  <p className="text-sm">{selectedSession.duracao} minutos</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Modalidade</p>
                  <p className="text-sm flex items-center gap-1">
                    {selectedSession.modalidade === 'online' ? (
                      <>
                        <Laptop className="h-4 w-4" />
                        <span>Online</span>
                      </>
                    ) : (
                      <>
                        <Building className="h-4 w-4" />
                        <span>Presencial</span>
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Status</p>
                  <p className={cn(
                    "text-sm px-2 py-0.5 rounded-full inline-flex items-center gap-1",
                    selectedSession.status === 'confirmada' ? "bg-green-100 text-green-800" :
                    selectedSession.status === 'agendada' ? "bg-blue-100 text-blue-800" :
                    selectedSession.status === 'faltou' ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-600"
                  )}>
                    {getStatusText(selectedSession.status)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Paciente</p>
                <p className="text-sm">{selectedSession.pacienteId}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  onClick={() => navigate(`/sessoes/${selectedSession.id}`)}
                  className="flex-1"
                >
                  Ver Detalhes Completos
                </Button>
                
                {selectedSession.status === 'agendada' && (
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    Confirmar Sessão
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WeeklyCalendarGrid;
