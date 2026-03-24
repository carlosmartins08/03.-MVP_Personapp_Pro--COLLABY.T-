import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays } from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Sessao } from '@/types/queries';

interface EngajamentoSessoesProps {
  sessoes: Sessao[];
  isLoading: boolean;
}

const EngajamentoSessoes = ({ sessoes, isLoading }: EngajamentoSessoesProps) => {
  const hoje = new Date();
  const seteDiasAtras = subDays(hoje, 7);
  const trintaDiasAtras = subDays(hoje, 30);

  const sessoesRealizadas = (sessoes || []).filter((sessao) => sessao.data);

  const sessoesUltimosSeteDias =
    sessoesRealizadas.filter((sessao) => {
      const dataSessao = parseISO(sessao.data as string);
      return dataSessao >= seteDiasAtras && dataSessao <= hoje;
    }).length || 0;

  const sessoesUltimosTrintaDias =
    sessoesRealizadas.filter((sessao) => {
      const dataSessao = parseISO(sessao.data as string);
      return dataSessao >= trintaDiasAtras && dataSessao <= hoje;
    }).length || 0;

  const proximaSessao = sessoesRealizadas
    .filter((sessao) => parseISO(sessao.data as string) > hoje)
    .sort((a, b) => (parseISO(a.data as string).getTime() - parseISO(b.data as string).getTime()))[0];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
          Engajamento nas Sessoes
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Sessoes nos ultimos 7 dias</div>
                <div className="text-2xl">{sessoesUltimosSeteDias}</div>
              </div>

              <div>
                <div className="text-sm font-medium">Sessoes nos ultimos 30 dias</div>
                <div className="text-2xl">{sessoesUltimosTrintaDias}</div>
              </div>
            </div>

            {proximaSessao ? (
              <div>
                <div className="text-sm font-medium">Proxima sessao agendada</div>
                <div className="text-xl">
                  {format(parseISO(proximaSessao.data as string), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
                <div className="text-muted-foreground text-sm">
                  {format(parseISO(proximaSessao.data as string), 'HH:mm', { locale: ptBR })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Nenhuma sessao agendada
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EngajamentoSessoes;
