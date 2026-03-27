
import React from 'react';
import { PageHeader } from '@/design-system/components';

const TelaPerfilPacienteAutenticado = () => {
  return (
    <div className="container pb-16">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais"
      />
      
      <div className="space-y-6 px-4">
        {/* Placeholder for future components */}
        <div className="text-muted-foreground text-center py-8">
          Configurações do perfil serão implementadas em breve
        </div>
      </div>
    </div>
  );
};

export default TelaPerfilPacienteAutenticado;
