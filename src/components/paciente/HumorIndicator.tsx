import React from 'react';
import { Card } from '@/design-system/components';
import { Skeleton } from '@/components/ui/skeleton';
import { Smile, Frown, ArrowRight } from 'lucide-react';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { DiarioSentimento } from '@/types/paciente';

interface HumorIndicatorProps {
  diarios: DiarioSentimento[] | null;
  isLoading: boolean;
}

const HumorIndicator: React.FC<HumorIndicatorProps> = ({ diarios, isLoading }) => {
  const { getTexto } = useLocalizacao();
  
  // Análise de humor para os diários da semana
  const calcularHumorMedio = () => {
    if (!diarios || diarios.length === 0) return null;
    
    // Mapeamento simples de palavras-chave para pontuação de humor (1-5)
    const palavrasPontuacao: Record<string, number> = {
      'feliz': 5, 'alegre': 5, 'contente': 4.5, 'satisfeito': 4, 'animado': 4.5,
      'calmo': 3.5, 'tranquilo': 3.5, 'normal': 3, 'neutro': 3,
      'triste': 1.5, 'deprimido': 1, 'desanimado': 2, 'cansado': 2.5,
      'ansioso': 2, 'preocupado': 2, 'estressado': 1.5, 'irritado': 1.5,
      'raiva': 1, 'frustrado': 1.5, 'angry': 1,
      'happy': 5, 'content': 4, 'joyful': 5, 'excited': 4.5,
      'calm': 3.5, 'relaxed': 3.5, 'neutral': 3
    };
    
    let pontuacaoTotal = 0;
    let entradasPontuadas = 0;
    
    diarios.forEach(diario => {
      if (diario.sentimento) {
        const sentimentoLower = diario.sentimento.toLowerCase();
        for (const [palavra, pontuacao] of Object.entries(palavrasPontuacao)) {
          if (sentimentoLower.includes(palavra)) {
            pontuacaoTotal += pontuacao;
            entradasPontuadas++;
            break;
          }
        }
      }
    });
    
    if (entradasPontuadas === 0) return null;
    return pontuacaoTotal / entradasPontuadas;
  };
  
  const humorMedio = calcularHumorMedio();
  
  const getHumorIcon = () => {
    if (humorMedio === null) return null;
    
    if (humorMedio >= 3.5) {
      return <Smile className="h-6 w-6 text-green-500" aria-label={getTexto('humor_positivo') || 'Humor positivo'} />;
    } else if (humorMedio <= 2.5) {
      return <Frown className="h-6 w-6 text-red-500" aria-label={getTexto('humor_negativo') || 'Humor negativo'} />;
    } else {
      return <div className="h-6 w-6 flex items-center justify-center text-yellow-500" aria-label={getTexto('humor_neutro') || 'Humor neutro'}>😐</div>;
    }
  };
  
  const getHumorDescricao = () => {
    if (humorMedio === null) return getTexto('sem_dados_humor') || 'Sem dados de humor';
    
    if (humorMedio >= 3.5) {
      return getTexto('humor_positivo') || 'Humor positivo';
    } else if (humorMedio <= 2.5) {
      return getTexto('humor_negativo') || 'Humor mais baixo';
    } else {
      return getTexto('humor_neutro') || 'Humor neutro';
    }
  };

  return (
    <Card variant="default" className="overflow-hidden border-none shadow-lg rounded-3xl bg-gradient-to-br from-white to-menta-light p-0">
      <div className="pb-2 px-4 pt-4">
        <h3 className="text-base font-medium flex items-center">
          <Smile className="h-4 w-4 mr-2 text-muted-foreground" />
          {getTexto('humor_medio_semana') || 'Humor médio da semana'}
        </h3>
      </div>
      <div className="px-4 pb-4">
        {isLoading ? (
          <Skeleton className="h-[200px] w-full rounded-2xl" />
        ) : diarios && diarios.length > 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center">
            <div className="mb-4 p-3 bg-white rounded-full shadow-md">
              {getHumorIcon()}
            </div>
            
            <h3 className="text-lg font-bold mb-2">{getHumorDescricao()}</h3>
            
            <p className="text-sm text-center text-muted-foreground mb-4">
              {getTexto('baseado_em') || 'Baseado em'} {diarios.length} {getTexto('registros_diario') || 'registros do diário'}
            </p>
            
            <div className="w-full max-w-xs bg-white/50 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-300 to-green-500 h-3 rounded-full transition-all duration-500 ease-in-out"
                style={{ 
                  width: humorMedio !== null ? `${Math.min(100, humorMedio * 20)}%` : '0%'
                }}
                role="progressbar"
                aria-valuenow={humorMedio !== null ? Math.round(humorMedio * 20) : 0}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
            
            <div className="flex justify-between w-full max-w-xs mt-2 text-xs text-muted-foreground">
              <span>{getTexto('negativo') || 'Negativo'}</span>
              <span>{getTexto('neutro') || 'Neutro'}</span>
              <span>{getTexto('positivo') || 'Positivo'}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <Smile className="h-12 w-12 text-muted-foreground opacity-30 mb-2" />
            <p className="text-muted-foreground mb-2">
              {getTexto('sem_registros_diario_semana') || 'Sem registros na última semana'}
            </p>
            <button 
              className="mt-2 inline-flex items-center px-4 py-2 rounded-full bg-lavanda text-white font-medium text-sm hover:bg-lavanda-dark transition-colors"
              onClick={() => window.location.href = '/paciente/diario'}
            >
              {getTexto('registre_sentimentos') || 'Registrar sentimentos'}
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default HumorIndicator;
