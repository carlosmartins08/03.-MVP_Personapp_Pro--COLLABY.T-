import React from 'react';
import { Card, Badge } from '@/design-system/components';
import { Skeleton } from '@/components/ui/skeleton';
import { Book } from 'lucide-react';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import EmptyState from '@/components/ui/EmptyState';
import { DiarioSentimento } from '@/types/paciente';

interface DiarioSummaryCardProps {
  diario: DiarioSentimento | null;
  isLoading: boolean;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}

const DiarioSummaryCard: React.FC<DiarioSummaryCardProps> = ({
  diario,
  isLoading,
  formatDate,
  formatTime
}) => {
  const { getTexto } = useLocalizacao();

  return (
    <Card variant="default" className="border-none shadow-md rounded-3xl overflow-hidden p-0">
      <div className="pb-2 px-4 pt-4 bg-gradient-to-r from-azul-light/40 to-azul-light/20">
        <h3 className="text-base font-medium flex items-center">
          <Book className="h-4 w-4 mr-2 text-muted-foreground" />
          {getTexto('ultimo_diario') || 'Último diário'}
        </h3>
      </div>
      <div className="pt-4 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : diario ? (
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              {formatDate(diario.dataRegistro)} - {formatTime(diario.dataRegistro)}
            </div>
            <div className="text-sm line-clamp-3 mb-2">
              {diario.texto}
            </div>
            {diario.sentimento && (
              <Badge variant="primary" size="sm">
                {diario.sentimento}
              </Badge>
            )}
          </div>
        ) : (
          <EmptyState
            icon={<Book className="h-8 w-8 text-muted-foreground opacity-70" />}
            title={getTexto('sem_registros_diario') || 'Sem registros no diário'}
            description={getTexto('incentivo_registrar_diario') || 'Registre como está se sentindo'}
            actionLabel={getTexto('registrar_agora') || 'Registrar agora'}
            onAction={() => window.location.href = '/paciente/diario'}
          />
        )}
      </div>
    </Card>
  );
};

export default DiarioSummaryCard;
