
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type VerificationStatus = 'loading' | 'success' | 'error' | 'invalid';

export function EmailVerification() {
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { idioma } = useLocalizacao();
  const { verificarEmail } = useAuth();

  const mensagens = {
    pt: {
      verificando: "Verificando seu email...",
      sucesso: "Email verificado com sucesso!",
      tokenInvalido: "Token inválido ou expirado",
      irParaDashboard: "Ir para o Dashboard",
      tentarNovamente: "Tentar novamente",
      voltar: "Voltar para login",
      erro: "Ocorreu um erro",
    },
    en: {
      verificando: "Verifying your email...",
      sucesso: "Email verified successfully!",
      tokenInvalido: "Invalid or expired token",
      irParaDashboard: "Go to Dashboard",
      tentarNovamente: "Try again",
      voltar: "Back to login",
      erro: "An error occurred",
    }
  }[idioma || 'pt'];

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (!token) {
      setStatus('invalid');
      toast({
        title: mensagens.erro,
        description: mensagens.tokenInvalido,
        variant: "destructive"
      });
      return;
    }

    const processarVerificacao = async () => {
      try {
        const resultado = await verificarEmail(token);
        
        if (resultado) {
          setStatus('success');
          toast({
            title: mensagens.sucesso,
            variant: "default"
          });
        } else {
          setStatus('invalid');
          toast({
            title: mensagens.erro,
            description: mensagens.tokenInvalido,
            variant: "destructive"
          });
        }
      } catch (erro) {
        console.error("Erro na verificação:", erro);
        setStatus('error');
        toast({
          title: mensagens.erro,
          variant: "destructive"
        });
      }
    };
    
    processarVerificacao();
  }, [location.search, mensagens.erro, mensagens.sucesso, mensagens.tokenInvalido, toast, verificarEmail]);

  const handleRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      {status === 'loading' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{mensagens.verificando}</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="text-center space-y-4">
          <div className="bg-green-100 text-green-700 p-3 rounded-full inline-block">
            <CheckCircle size={32} />
          </div>
          <Alert variant="default" className="bg-green-50 border-green-200">
            <AlertTitle className="text-green-700">{mensagens.sucesso}</AlertTitle>
            <AlertDescription className="text-green-600">
              {mensagens.irParaDashboard}
            </AlertDescription>
          </Alert>
          <Button onClick={handleRedirect} className="mt-4">
            {mensagens.voltar}
          </Button>
        </div>
      )}
      
      {(status === 'error' || status === 'invalid') && (
        <div className="text-center space-y-4">
          <div className="bg-red-100 text-red-700 p-3 rounded-full inline-block">
            <AlertTriangle size={32} />
          </div>
          <Alert variant="destructive">
            <AlertTitle>{mensagens.erro}</AlertTitle>
            <AlertDescription>
              {status === 'invalid' ? mensagens.tokenInvalido : mensagens.erro}
            </AlertDescription>
          </Alert>
          <Button onClick={handleRedirect} variant="outline">
            {mensagens.voltar}
          </Button>
        </div>
      )}
    </div>
  );
}
