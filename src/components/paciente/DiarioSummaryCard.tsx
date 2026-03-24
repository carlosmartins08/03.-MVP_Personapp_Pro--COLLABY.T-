
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Book } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    <Card className="border-none shadow-md rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 bg-gradient-to-r from-azul-light/40 to-azul-light/20">
        <CardTitle className="text-base font-medium flex items-center">
          <Book className="h-4 w-4 mr-2 text-muted-foreground" />
          {getTexto('ultimo_diario') || 'Último diário'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
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
              <Badge variant="outline" className="rounded-full bg-blue-50 border-blue-200 text-blue-700">
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
      </CardContent>
    </Card>
  );
};

export default DiarioSummaryCard;
