
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { 
  Home, Users, Calendar, ScrollText, 
  AlertCircle, Briefcase, Wallet, Settings, LogOut,
  BarChart2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/profissional/dashboard' },
  { icon: Users, label: 'Pacientes', path: '/profissional/pacientes' },
  { icon: BarChart2, label: 'Comportamento', path: '/profissional/comportamento' },
  { icon: Calendar, label: 'Agenda', path: '/profissional/agenda' },
  { icon: ScrollText, label: 'Sessões', path: '/profissional/sessoes' },
  { icon: AlertCircle, label: 'Alertas', path: '/profissional/alertas' },
  { icon: Briefcase, label: 'Serviços', path: '/profissional/servicos' },
  { icon: Wallet, label: 'Finanças', path: '/profissional/financeiro' },
  { icon: Settings, label: 'Configurações', path: '/profissional/configuracoes' },
];

const SidebarContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthContext();

  const handleLogout = async () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-2 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                "hover:bg-muted",
                location.pathname === item.path || 
                (item.path === '/profissional/comportamento' && location.pathname.startsWith('/profissional/comportamento/'))
                  ? "bg-muted text-foreground" 
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
};

export const LayoutProfissional = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen min-h-[100dvh]">
      {!isMobile ? (
        <aside className="w-64 border-r bg-background">
          <SidebarContent />
        </aside>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
      
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
