import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { TemaAnaliseDetalhada } from '@/types/analise-temas';

interface RankingImpactoScoreProps {
  temas: TemaAnaliseDetalhada[];
  isLoading: boolean;
  onVerSessoes?: (sessaoIds: string[]) => void;
}

const getTendenciaIcon = (tendencia: string) => {
  switch (tendencia) {
    case 'positiva':
      return '▲';
    case 'negativa':
      return '▼';
    default:
      return '■';
  }
};

const getNivelImpacto = (scoreMedio: number) => {
  if (scoreMedio < 55) {
    return {
      badge: 'Alto impacto negativo',
      style: 'bg-red-50 text-red-700 border-red-200',
    };
  }
  if (scoreMedio <= 70) {
    return {
      badge: 'Impacto moderado',
      style: 'bg-orange-50 text-orange-700 border-orange-200',
    };
  }
  return {
    badge: 'Baixo impacto',
    style: 'bg-gray-50 text-gray-700 border-gray-200',
  };
};

export const RankingImpactoScore: React.FC<RankingImpactoScoreProps> = ({
  temas,
  isLoading,
  onVerSessoes,
}) => {
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando analise de temas...</div>;
  }

  if (!temas?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nao ha dados suficientes para analise de impacto dos temas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ranking de Impacto no Score Clinico</h3>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Posicao</TableHead>
              <TableHead>Tema</TableHead>
              <TableHead className="text-right">Score Medio</TableHead>
              <TableHead className="text-right">Score Minimo</TableHead>
              <TableHead className="text-right">Variacao</TableHead>
              <TableHead className="text-center">Tendencia</TableHead>
              <TableHead className="text-right">Total Sessoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {temas.map((tema, index) => {
              const impacto = getNivelImpacto(tema.scoreMedio);
              const variacao = tema.scoreMaximo - tema.scoreMinimo;

              return (
                <TableRow key={tema.tema} className={impacto.style}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tema.icone}</span>
                          <span>{tema.tema}</span>
                          <Badge variant="secondary" className={impacto.style}>
                            {impacto.badge}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="p-4 space-y-2 max-w-sm">
                        <p className="font-semibold">{tema.tema}</p>
                        <p className="text-sm">
                          Score medio: {tema.scoreMedio.toFixed(1)}
                          <br />
                          Variacao: {variacao.toFixed(1)} pontos
                          <br />
                          {tema.sequenciaMaxima >= 3 && (
                            <>Padrao recorrente: {tema.sequenciaMaxima} sessoes consecutivas<br /></>
                          )}
                          Total de registros: {tema.totalSessoes}
                        </p>
                        {onVerSessoes && tema.sessoesIds.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => onVerSessoes(tema.sessoesIds)}
                          >
                            Ver sessoes relacionadas
                          </Button>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-right">{tema.scoreMedio.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{tema.scoreMinimo.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{variacao.toFixed(1)}</TableCell>
                  <TableCell className="text-center text-lg">
                    {getTendenciaIcon(tema.tendencia)}
                  </TableCell>
                  <TableCell className="text-right">{tema.totalSessoes}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RankingImpactoScore;
