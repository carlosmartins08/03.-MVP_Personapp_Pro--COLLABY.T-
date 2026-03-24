import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AvaliacaoSessao } from '@/types/queries';

interface AvaliacoesSessoesProps {
  avaliacoes: AvaliacaoSessao[];
  isLoading: boolean;
}

const AvaliacoesSessoes = ({ avaliacoes, isLoading }: AvaliacoesSessoesProps) => {
  const dataOrdenada = (avaliacoes || []).sort((a, b) => {
    if (!a.dataAvaliacao || !b.dataAvaliacao) return 0;
    return parseISO(b.dataAvaliacao).getTime() - parseISO(a.dataAvaliacao).getTime();
  });

  const mediaNota =
    dataOrdenada && dataOrdenada.length > 0
      ? dataOrdenada.reduce((acc, curr) => acc + curr.nota, 0) / dataOrdenada.length
      : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Star className="h-4 w-4 mr-2 text-muted-foreground" />
          Avaliacoes das Sessoes
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="text-sm text-muted-foreground">Media de avaliacoes</div>
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-2">{mediaNota.toFixed(1)}</span>
                <div className="flex">{renderStars(mediaNota)}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {avaliacoes?.length || 0} avaliacoes
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Comentarios recentes</div>
              <div className="space-y-3 max-h-[140px] overflow-y-auto">
                {dataOrdenada && dataOrdenada.length > 0 ? (
                  dataOrdenada
                    .filter((avaliacao) => avaliacao.comentario)
                    .slice(0, 5)
                    .map((avaliacao) => (
                      <div key={avaliacao.id} className="border-b pb-2 last:border-0">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex">{renderStars(avaliacao.nota)}</div>
                          <div className="text-xs text-muted-foreground">
                            {avaliacao.dataAvaliacao &&
                              format(parseISO(avaliacao.dataAvaliacao), 'dd/MM/yyyy', {
                                locale: ptBR,
                              })}
                          </div>
                        </div>
                        <div className="text-sm">{avaliacao.comentario}</div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    Nenhum comentario disponivel
                  </div>
                )}

                {avaliacoes && avaliacoes.filter((a) => a.comentario).length > 5 && (
                  <div className="text-center text-xs text-muted-foreground pt-1">
                    Mostrando 5 de {avaliacoes.filter((a) => a.comentario).length} comentarios
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AvaliacoesSessoes;
