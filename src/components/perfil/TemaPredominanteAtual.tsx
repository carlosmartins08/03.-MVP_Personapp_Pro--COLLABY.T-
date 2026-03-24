import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TemaAnaliseDetalhada } from '@/types/analise-temas';

interface TemaPredominanteProps {
  temas: TemaAnaliseDetalhada[];
  isLoading: boolean;
}

export const TemaPredominanteAtual: React.FC<TemaPredominanteProps> = ({ temas, isLoading }) => {
  if (isLoading || !temas?.length) {
    return null;
  }

  const temaPredominante = temas[0];
  const datasOrdenadas = temaPredominante.datasOrdenadas.sort();
  const dataInicial = datasOrdenadas.length
    ? format(new Date(datasOrdenadas[0]), 'dd/MM', { locale: ptBR })
    : '';
  const dataFinal = datasOrdenadas.length
    ? format(new Date(datasOrdenadas[datasOrdenadas.length - 1]), 'dd/MM', { locale: ptBR })
    : '';
  const corTemaPredominante =
    temaPredominante.scoreMedio < 55
      ? 'bg-red-50 text-red-700 border-red-200'
      : temaPredominante.scoreMedio <= 70
      ? 'bg-orange-50 text-orange-700 border-orange-200'
      : 'bg-gray-50 text-gray-700 border-gray-200';

  return (
    <Card className={`p-4 mb-6 border-2 ${corTemaPredominante}`}>
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{temaPredominante.icone}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              Tema predominante no ultimo periodo: {temaPredominante.tema}
            </h3>
            {temaPredominante.sequenciaMaxima >= 3 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                Padrao recorrente
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Registrado em {temaPredominante.totalSessoes} entradas entre {dataInicial} e {dataFinal}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TemaPredominanteAtual;
