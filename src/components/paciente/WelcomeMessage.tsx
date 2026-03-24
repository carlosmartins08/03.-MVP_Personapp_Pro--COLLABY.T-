import { useQuery } from '@tanstack/react-query';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Search } from 'lucide-react';

const WelcomeMessage = () => {
  const { getTexto, idioma } = useLocalizacao();
  const { user } = useAuthContext();

  const { data: paciente, isLoading } = useQuery({
    queryKey: ['paciente-welcome', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;
      const data = await api.get<{ nome: string }>(`/pacientes/user/${user.id}`);
      return data;
    },
  });

  const fallbackMessage = idioma === 'en' ? 'Hello, welcome!' : 'Ola, bem-vindo(a)!';

  const welcomeKey = idioma === 'en' ? 'welcome_message' : 'mensagem_boas_vindas';
  let welcomeMessage = getTexto(welcomeKey) || fallbackMessage;

  if (paciente?.nome) {
    welcomeMessage = welcomeMessage.replace('{nome}', paciente.nome);
  } else {
    welcomeMessage = fallbackMessage;
  }

  const timeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (idioma === 'en') {
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    } else {
      if (hour < 12) return 'Bom dia';
      if (hour < 18) return 'Boa tarde';
      return 'Boa noite';
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        {isLoading ? (
          <Skeleton className="h-8 w-3/4" aria-label={getTexto('carregando') || 'Carregando...'} />
        ) : (
          <h1 className="text-2xl font-bold">
            {timeBasedGreeting()},{' '}
            <span className="text-lavanda">{paciente?.nome ? paciente.nome : getTexto('paciente') || 'paciente'}</span>!
          </h1>
        )}

        <div className="flex gap-2">
          <button
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            aria-label={getTexto('ajuda') || 'Ajuda'}
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center p-4 pl-5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm text-muted-foreground">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <p className="text-sm">{getTexto('o_que_procura') || 'O que voce procura hoje?'}</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
