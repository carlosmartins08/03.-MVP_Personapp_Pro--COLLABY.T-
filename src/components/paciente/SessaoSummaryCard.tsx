import React from 'react';
import { Card, Badge } from '@/design-system/components';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { Sessao } from '@/types/paciente';

type StatusBadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

interface SessaoSummaryCardProps {
  sessao: Sessao | null;
  isLoading: boolean;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}

const statusVariants: Record<string, StatusBadgeVariant> = {
  realizada: 'success',
  cancelada: 'error',
  faltou: 'error',
  agendada: 'primary',
  confirmada: 'primary',
};

const SessaoSummaryCard: React.FC<SessaoSummaryCardProps> = ({
  sessao,
  isLoading,
  formatDate,
  formatTime
}) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'realizada':
        return 'Realizada';
      case 'agendada':
        return 'Agendada';
      case 'cancelada':
        return 'Cancelada';
      case 'confirmada':
        return 'Confirmada';
      case 'faltou':
        return 'Faltou';
      default:
        return status;
    }
  };

  const statusVariant = sessao?.status ? statusVariants[sessao.status] ?? 'neutral' : 'neutral';

  return (
    <Card variant="default" className="border-none shadow-md rounded-3xl overflow-hidden p-0">
      <div className="pb-2 px-4 pt-4 bg-gradient-to-r from-lavanda-light/40 to-lavanda-light/20">
        <h3 className="text-base font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          Última sessão
        </h3>
      </div>
      <div className="pt-4 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : sessao ? (
          <div>
            <div className="text-2xl font-medium mb-1">
              {formatDate(sessao.data)}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {formatTime(sessao.data)}
            </div>
            <Badge variant={statusVariant} size="sm">
              {getStatusLabel(sessao.status)}
            </Badge>
          </div>
        ) : (
          <EmptyState
            icon={<Calendar className="h-8 w-8 text-muted-foreground opacity-70" />}
            title="Sem sessões registradas"
            description="Agende sua próxima sessão"
            actionLabel="Ver agenda"
            onAction={() => window.location.href = '/paciente/sessoes'}
          />
        )}
      </div>
    </Card>
  );
};

export default SessaoSummaryCard;
