
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-menta-light px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-lavanda mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Página não encontrada</p>
        <p className="text-muted-foreground mb-8">
          A página "{location.pathname}" que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
          <Button 
            onClick={() => navigate('/')}
            className="persona-button flex items-center"
          >
            <Home size={16} className="mr-2" />
            Ir para a Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
