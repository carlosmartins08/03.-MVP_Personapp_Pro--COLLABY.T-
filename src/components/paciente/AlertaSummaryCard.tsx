import React from 'react';
import { Card, Badge } from '@/design-system/components';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { AlertaClinico } from '@/types/paciente';

type StatusBadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

interface AlertaSummaryCardProps {
  alerta: AlertaClinico | null;
  isLoading: boolean;
  formatDate: (date: string) => string;
}

const urgencyVariants: Record<string, StatusBadgeVariant> = {
  baixo: 'success',
  medio: 'warning',
  alto: 'error',
};

const AlertaSummaryCard: React.FC<AlertaSummaryCardProps> = ({ alerta, isLoading, formatDate }) => {
  const { getTexto } = useLocalizacao();

  const getUrgencyLabel = (nivel: string) => {
    const nivelKey = `urgencia_${nivel}`;
    return getTexto(nivelKey) || nivel;
  };

  const urgencyVariant = alerta?.nivelUrgencia ? urgencyVariants[alerta.nivelUrgencia] ?? 'neutral' : 'neutral';

  return (
    <Card variant="default" className="border-none shadow-md rounded-3xl overflow-hidden p-0">
      <div className="pb-2 px-4 pt-4 bg-gradient-to-r from-menta-light/40 to-menta-light/20">
        <h3 className="text-base font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
          {getTexto('ultimo_alerta') || 'Ultimo alerta'}
        </h3>
      </div>
      <div className="pt-4 px-4 pb-4">
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
            <Badge variant={urgencyVariant} size="sm">
              {getTexto('nivel_urgencia') || 'Nivel de urgencia'}: {getUrgencyLabel(alerta.nivelUrgencia)}
            </Badge>
          </div>
        ) : (
          <div className="p-4 bg-green-50 rounded-xl text-green-800 text-sm">
            <div className="font-medium mb-1">{getTexto('sem_alertas') || 'Sem alertas clinicos'}</div>
            <div>{getTexto('tudo_bem') || 'Tudo parece estar bem!'}</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AlertaSummaryCard;
