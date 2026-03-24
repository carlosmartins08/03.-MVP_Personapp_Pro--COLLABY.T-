
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { AlertasClinicosLista } from '@/components/alertas/AlertasClinicosLista';
import ExportAlertasButton from '@/components/alertas/ExportAlertasButton';

const TelaAlertasClinicos = () => {
  return (
    <div className="container pb-16">
      <PageHeader
        title="Alertas Clínicos"
        subtitle="Acompanhe indicadores importantes dos seus pacientes"
        rightContent={
          <ExportAlertasButton 
            profissionalNome="Dr. Profissional"
            isFromCentral={true}
          />
        }
      />
      
      <div className="space-y-6 px-4">
        <AlertasClinicosLista />
      </div>
    </div>
  );
};

export default TelaAlertasClinicos;
