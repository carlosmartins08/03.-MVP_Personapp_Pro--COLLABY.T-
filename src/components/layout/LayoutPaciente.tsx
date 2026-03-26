
import { useNavigate } from 'react-router-dom';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  CalendarCheck, 
  BookOpen, 
  CreditCard, 
  User,
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

const menuItems = [
  { icon: Home, label: 'Resumo', path: '/paciente/dashboard' },
  { icon: CalendarCheck, label: 'Sessões', path: '/paciente/sessoes' },
  { icon: BookOpen, label: 'Diário', path: '/paciente/diario' },
  { icon: CreditCard, label: 'Pagamentos', path: '/paciente/pagamentos' },
  { icon: User, label: 'Perfil', path: '/paciente/perfil' },
];

export const LayoutPaciente = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthContext();

  const handleLogout = async () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh] bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 container py-4 pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
        <Outlet />
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-1 min-w-[64px]",
                "text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
