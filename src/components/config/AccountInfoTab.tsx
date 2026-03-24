
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';
import { usuarioMock } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const AccountInfoTab = () => {
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados serão enviados por e-mail quando prontos.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <UserCog className="mr-2 text-lavanda" size={20} />
          Informações da Conta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={usuarioMock.nome}
            disabled
            className="bg-muted"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            value={usuarioMock.email}
            disabled
            className="bg-muted"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="id">ID do Usuário</Label>
          <p className="text-sm text-muted-foreground">{usuarioMock.id}</p>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleExportData}
        >
          Exportar dados da conta
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountInfoTab;
