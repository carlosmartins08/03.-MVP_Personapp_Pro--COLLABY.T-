import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { AlertaClinico } from '@/types/paciente';

interface AlertaSummaryCardProps {
  alerta: AlertaClinico | null;
  isLoading: boolean;
  formatDate: (date: string) => string;
}

const AlertaSummaryCard: React.FC<AlertaSummaryCardProps> = ({ alerta, isLoading, formatDate }) => {
  const { getTexto } = useLocalizacao();

  const getUrgencyLabel = (nivel: string) => {
    const nivelKey = `urgencia_${nivel}`;
    return getTexto(nivelKey) || nivel;
  };

  return (
    <Card className="border-none shadow-md rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 bg-gradient-to-r from-menta-light/40 to-menta-light/20">
        <CardTitle className="text-base font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
          {getTexto('ultimo_alerta') || 'Ultimo alerta'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : alerta ? (
          <div>
            <div className="text-sm font-medium mb-1">{alerta.tipoAlerta}</div>
            <div className="text-xs text-muted-foreground mb-2">{formatDate(alerta.dataCriacao)}</div>
            <div className="line-clamp-2 text-sm mb-2">{alerta.descricao}</div>
            <Badge
              variant="outline"
              className={`rounded-full ${
                alerta.nivelUrgencia === 'baixo'
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : alerta.nivelUrgencia === 'medio'
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {getTexto('nivel_urgencia') || 'Nivel de urgencia'}: {getUrgencyLabel(alerta.nivelUrgencia)}
            </Badge>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl text-green-800 text-sm">
            <div className="font-medium mb-1">{getTexto('sem_alertas') || 'Sem alertas clinicos'}</div>
            <div>{getTexto('tudo_bem') || 'Tudo parece estar bem!'}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertaSummaryCard;
