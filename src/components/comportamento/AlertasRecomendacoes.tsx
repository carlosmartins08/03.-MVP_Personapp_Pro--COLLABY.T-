import { differenceInDays, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  RefreshCw,
  CalendarX,
  TrendingDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Sessao, DiarioSentimento, AlertaClinico } from '@/types/queries';

interface AlertasRecomendacoesProps {
  sessoes: Sessao[];
  diarios: DiarioSentimento[];
  alertasClinicos: AlertaClinico[];
  isLoading: boolean;
}

interface Alerta {
  tipo: string;
  titulo: string;
  descricao: string;
  nivel: 'baixo' | 'medio' | 'alto';
  icone: React.ReactNode;
}

const AlertasRecomendacoes = ({
  sessoes,
  diarios,
  alertasClinicos,
  isLoading,
}: AlertasRecomendacoesProps) => {
  const alertasDetectados: Alerta[] = [];
  const hoje = new Date();

  if (sessoes && sessoes.length > 0) {
    const ultimaSessao = sessoes
      .filter((s) => s.status === 'realizada' && s.data)
      .sort((a, b) => parseISO(b.data as string).getTime() - parseISO(a.data as string).getTime())[0];

    if (ultimaSessao?.data) {
      const diasDesdeUltimaSessao = differenceInDays(hoje, parseISO(ultimaSessao.data));
      if (diasDesdeUltimaSessao > 30) {
        alertasDetectados.push({
          tipo: 'baixa_frequencia',
          titulo: 'Baixa frequencia de sessoes',
          descricao: `O paciente nao realiza sessoes ha ${diasDesdeUltimaSessao} dias.`,
          nivel: diasDesdeUltimaSessao > 60 ? 'alto' : 'medio',
          icone: <CalendarX className="h-4 w-4" />,
        });
      }
    }

    const sessoesRealizadas = sessoes
      .filter((s) => s.status === 'realizada' && s.scoreClinico !== null && s.data)
      .sort((a, b) => parseISO(a.data as string).getTime() - parseISO(b.data as string).getTime());

    if (sessoesRealizadas.length >= 3) {
      const ultimos = sessoesRealizadas.slice(-3);
      const mediaAnterior = ultimos[0].scoreClinico ?? 0;
      const mediaRecente = ultimos[2].scoreClinico ?? 0;

      if (mediaAnterior - mediaRecente >= 3) {
        alertasDetectados.push({
          tipo: 'queda_score',
          titulo: 'Queda no score emocional',
          descricao: `Queda significativa de ${mediaAnterior} para ${mediaRecente}.`,
          nivel: 'alto',
          icone: <TrendingDown className="h-4 w-4" />,
        });
      }
    }

    const reagendamentosRecentes = sessoes.filter(
      (s) => s.reagendadaEm && differenceInDays(hoje, parseISO(s.reagendadaEm)) <= 30
    ).length;

    if (reagendamentosRecentes >= 2) {
      alertasDetectados.push({
        tipo: 'reagendamentos',
        titulo: 'Multiplos reagendamentos',
        descricao: `O paciente reagendou ${reagendamentosRecentes} vezes nos ultimos 30 dias.`,
        nivel: reagendamentosRecentes >= 3 ? 'medio' : 'baixo',
        icone: <RefreshCw className="h-4 w-4" />,
      });
    }
  }

  if (diarios && diarios.length > 0) {
    const recentes = diarios.filter((d) => differenceInDays(hoje, parseISO(d.dataRegistro)) <= 15);
    const entradasComPalavrasDisfuncionais = recentes.filter((entrada) => {
      const texto = entrada.texto.toLowerCase();
      return (
        entrada.palavrasDisfuncionais?.length ||
        ['nunca', 'sempre', 'impossivel', 'insuportavel', 'terrivel'].some((palavra) =>
          texto.includes(palavra)
        )
      );
    }).length;

    if (entradasComPalavrasDisfuncionais >= 2) {
      alertasDetectados.push({
        tipo: 'palavras_disfuncionais',
        titulo: 'Palavras disfuncionais detectadas',
        descricao: `Detectamos termos sensiveis em ${entradasComPalavrasDisfuncionais} entradas recentes do diario.`,
        nivel: 'medio',
        icone: <FileText className="h-4 w-4" />,
      });
    }
  }

  alertasClinicos?.forEach((alerta) => {
    if (!alerta.dataCriacao) return;
    if (differenceInDays(hoje, parseISO(alerta.dataCriacao)) <= 30) {
      alertasDetectados.push({
        tipo: 'clinico',
        titulo: `Alerta clinico: ${alerta.tipoAlerta}`,
        descricao: alerta.descricao || 'Alerta registrado recentemente.',
        nivel: (alerta.nivelUrgencia as 'baixo' | 'medio' | 'alto') ?? 'baixo',
        icone: <AlertTriangle className="h-4 w-4" />,
      });
    }
  });

  const getNivelColor = (nivel: 'baixo' | 'medio' | 'alto') => {
    switch (nivel) {
      case 'alto':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medio':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
          Alertas e Recomendacoes
        </CardTitle>
      </CardHeader>

      <CardContent>
        {alertasDetectados.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {alertasDetectados.map((alerta, index) => (
              <AccordionItem key={`${alerta.tipo}-${index}`} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <div className={`mr-2 p-1 rounded-full ${getNivelColor(alerta.nivel)}`}>
                      {alerta.icone}
                    </div>
                    <span>{alerta.titulo}</span>
                    <Badge variant="outline" className={`ml-2 ${getNivelColor(alerta.nivel)}`}>
                      {alerta.nivel === 'alto' ? 'Alto' : alerta.nivel === 'medio' ? 'Medio' : 'Baixo'}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-2 py-1">
                    <p className="text-sm">{alerta.descricao}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <div className="bg-green-100 text-green-800 rounded-full p-3 mb-3">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-1">Nenhum alerta detectado</h3>
            <p className="text-muted-foreground max-w-md">
              O paciente nao apresenta sinais de alerta no momento. Continue o acompanhamento regular.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertasRecomendacoes;
