import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Book, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { DiarioSentimento } from '@/types/queries';

interface DiarioSentimentosProps {
  diarios: DiarioSentimento[];
  isLoading: boolean;
}

const PALAVRAS_DISFUNCIONAIS = [
  'nunca',
  'sempre',
  'impossivel',
  'insuportavel',
  'horrivel',
  'terrivel',
  'catastr',
  'desastre',
  'fracasso',
  'inutil',
  'incapaz',
  'odiar',
  'detesto',
  'intoleravel',
  'absolutamente',
];

const getSentimentColor = (sentimento: string) => {
  const sentimentoLower = sentimento.toLowerCase();
  if (sentimentoLower.includes('alegr') || sentimentoLower.includes('feliz')) {
    return 'bg-green-100 text-green-800';
  } else if (sentimentoLower.includes('trist') || sentimentoLower.includes('desanim')) {
    return 'bg-blue-100 text-blue-800';
  } else if (sentimentoLower.includes('raiv') || sentimentoLower.includes('irrita')) {
    return 'bg-red-100 text-red-800';
  } else if (sentimentoLower.includes('ansie') || sentimentoLower.includes('nervos')) {
    return 'bg-yellow-100 text-yellow-800';
  } else if (sentimentoLower.includes('med') || sentimentoLower.includes('inseguran')) {
    return 'bg-purple-100 text-purple-800';
  } else {
    return 'bg-gray-100 text-gray-800';
  }
};

const DiarioSentimentos = ({ diarios, isLoading }: DiarioSentimentosProps) => {
  const ultimaEntrada = diarios && diarios.length > 0 ? diarios[0] : null;

  const tagsCount: Record<string, number> = {};
  diarios?.forEach((entry) => {
    entry.tags?.forEach((tag) => {
      tagsCount[tag] = (tagsCount[tag] || 0) + 1;
    });
  });

  const tagsMaisFrequentes = Object.entries(tagsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag);

  const entradasComPalavrasDisfuncionais =
    diarios?.filter((entry) => {
      const texto = entry.texto.toLowerCase();
      return PALAVRAS_DISFUNCIONAIS.some((palavra) => texto.includes(palavra));
    }).length || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <Book className="h-4 w-4 mr-2 text-muted-foreground" />
          Diario de Sentimentos
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
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm">
                <div className="font-medium">Total de entradas</div>
                <div className="text-2xl">{diarios?.length || 0}</div>
              </div>

              {entradasComPalavrasDisfuncionais > 0 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center bg-amber-50 text-amber-800 px-2 py-1 rounded-md">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">
                          {entradasComPalavrasDisfuncionais} entradas com palavras disfuncionais
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        Detectamos palavras que podem indicar padroes de pensamento disfuncionais.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {ultimaEntrada ? (
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">Ultima entrada</div>
                <div className="text-xs text-muted-foreground mb-1">
                  {format(parseISO(ultimaEntrada.dataRegistro), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <Badge className={getSentimentColor(ultimaEntrada.sentimento ?? '')}>
                    {ultimaEntrada.sentimento}
                  </Badge>
                  {ultimaEntrada.palavrasDisfuncionais && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Palavras disfuncionais
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            Palavras detectadas: {ultimaEntrada.palavrasDisfuncionais.join(', ')}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="bg-muted p-2 rounded-md text-sm max-h-[80px] overflow-y-auto">
                  {ultimaEntrada.texto}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground mb-4">
                Nenhuma entrada no diario
              </div>
            )}

            <div>
              <div className="text-sm font-medium mb-2">Temas frequentes</div>
              {tagsMaisFrequentes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {tagsMaisFrequentes.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag} ({tagsCount[tag]})
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-sm text-muted-foreground">
                  Nenhum tema registrado
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DiarioSentimentos;
