
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, Home, DollarSign, Settings } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] rounded-t-xl z-50">
      <div className="flex justify-around items-center h-16">
        <NavItem 
          to="/" 
          icon={<Home size={24} />} 
          label="Início" 
          isActive={isActive('/')}
        />
        <NavItem 
          to="/agenda" 
          icon={<Calendar size={24} />} 
          label="Agenda" 
          isActive={isActive('/agenda')}
        />
        <NavItem 
          to="/pacientes" 
          icon={<Users size={24} />} 
          label="Pacientes" 
          isActive={isActive('/pacientes')}
        />
        <NavItem 
          to="/financeiro" 
          icon={<DollarSign size={24} />} 
          label="Financeiro" 
          isActive={isActive('/financeiro')}
        />
        <NavItem 
          to="/configuracoes" 
          icon={<Settings size={24} />} 
          label="Config." 
          isActive={isActive('/configuracoes')}
        />
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-colors ${
        isActive ? 'text-lavanda' : 'text-gray-500 hover:text-lavanda'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default BottomNav;
