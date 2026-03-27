import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BookOpen, Plus } from 'lucide-react';
import { Button, Card, Skeleton } from '@/design-system/components';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthContext } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface DiarioEntry {
  id: string;
  texto: string;
  dataRegistro: string;
}

const TelaDiarioPaciente = () => {
  const { user } = useAuthContext();

  const { data: pacienteId } = useQuery({
    queryKey: ['paciente-id-diario', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;
      const paciente = await api.get<{ id: string }>(`/pacientes/user/${user.id}`);
      return paciente.id;
    },
  });

  const { data: registros, isLoading } = useQuery({
    queryKey: ['diario-registros', pacienteId],
    enabled: !!pacienteId,
    queryFn: async () => {
      if (!pacienteId) return [];
      const data = await api.get<DiarioEntry[]>(`/pacientes/${pacienteId}/diarios`, {
        query: { limit: 100 },
      });
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Meu Diario</h1>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4 pr-4">
          {isLoading ? (
            <>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </>
          ) : registros?.length ? (
            registros.map((registro) => (
              <Card key={registro.id}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(registro.dataRegistro), "dd 'de' MMMM 'as' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                      <p className="mt-2">{registro.texto}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4" />
              <p>Comece a registrar seus pensamentos e sentimentos</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TelaDiarioPaciente;

