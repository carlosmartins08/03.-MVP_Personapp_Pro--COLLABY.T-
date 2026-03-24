
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DangerZone = () => {
  const { toast } = useToast();

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
    );
    if (confirmed) {
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A exclusão de conta estará disponível em breve.",
      });
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-lg text-destructive flex items-center">
          <Trash2 className="mr-2" size={20} />
          Ações Perigosas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={handleDeleteAccount}
        >
          Excluir conta
        </Button>
      </CardContent>
    </Card>
  );
};

export default DangerZone;
