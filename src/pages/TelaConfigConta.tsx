
import React from 'react';
import { PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components';
import AccountInfoTab from '@/components/config/AccountInfoTab';
import SecurityTab from '@/components/config/SecurityTab';
import PreferencesTab from '@/components/config/PreferencesTab';
import DangerZone from '@/components/config/DangerZone';

const TelaConfigConta = () => {
  return (
    <div className="container pb-16">
      <PageHeader 
        title="Configurações da Conta"
        subtitle="Gerencie suas preferências e informações"
      />
      
      <div className="p-4">
        <Tabs defaultValue="conta" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="conta">Conta</TabsTrigger>
            <TabsTrigger value="seguranca">Segurança</TabsTrigger>
            <TabsTrigger value="preferencias">Preferências</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conta">
            <AccountInfoTab />
          </TabsContent>
          
          <TabsContent value="seguranca">
            <SecurityTab />
          </TabsContent>
          
          <TabsContent value="preferencias">
            <PreferencesTab />
            <div className="mt-6">
              <DangerZone />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TelaConfigConta;
