
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import EmptyState from '@/components/ui/EmptyState';
import { Sessao } from '@/types/paciente';

interface SessaoSummaryCardProps {
  sessao: Sessao | null;
  isLoading: boolean;
  formatDate: (date: string) => string;
  formatTime: (date: string) => string;
}

const SessaoSummaryCard: React.FC<SessaoSummaryCardProps> = ({
  sessao,
  isLoading,
  formatDate,
  formatTime
}) => {
  const { getTexto } = useLocalizacao();
  
  const getStatusLabel = (status: string) => {
    const statusKey = `sessao_${status}`;
    return getTexto(statusKey) || status;
  };

  return (
    <Card className="border-none shadow-md rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2 bg-gradient-to-r from-lavanda-light/40 to-lavanda-light/20">
        <CardTitle className="text-base font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {getTexto('ultima_sessao') || 'Última sessão'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
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
            <Badge 
              variant="outline"
              className={`rounded-full ${
                sessao.status === 'realizada' 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : sessao.status === 'cancelada' || sessao.status === 'faltou'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}
            >
              {getStatusLabel(sessao.status)}
            </Badge>
          </div>
        ) : (
          <EmptyState
            icon={<Calendar className="h-8 w-8 text-muted-foreground opacity-70" />}
            title={getTexto('sem_sessoes_registradas') || 'Sem sessões registradas'}
            description={getTexto('incentivo_agendar_sessao') || 'Agende sua próxima sessão'}
            actionLabel={getTexto('ver_agenda') || 'Ver agenda'}
            onAction={() => window.location.href = '/paciente/sessoes'}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SessaoSummaryCard;
