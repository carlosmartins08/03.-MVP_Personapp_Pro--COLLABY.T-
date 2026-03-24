import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: ReactNode;
  requiredUserType: 'profissional' | 'paciente';
}

export const RouteGuard = ({ children, requiredUserType }: RouteGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoadingUser } = useAuthContext();

  useEffect(() => {
    if (isLoadingUser) return;

    if (!user) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return;
    }

    if (user.tipo !== requiredUserType) {
      toast({
        title: 'Acesso não autorizado',
        description: 'Redirecionando para a área correta.',
        variant: 'destructive',
      });
      navigate(user.tipo === 'profissional' ? '/profissional/dashboard' : '/paciente/dashboard', {
        replace: true,
      });
    }
  }, [user, isLoadingUser, requiredUserType, navigate, location.pathname]);

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user || user.tipo !== requiredUserType) {
    return null;
  }

  return <>{children}</>;
};
