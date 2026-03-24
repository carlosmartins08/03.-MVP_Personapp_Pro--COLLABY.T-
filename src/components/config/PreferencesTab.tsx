
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { useToast } from '@/hooks/use-toast';

const PreferencesTab = () => {
  const { idioma, alterarIdioma } = useLocalizacao();
  const { toast } = useToast();

  const handleIdiomaChange = async (novoIdioma: 'pt' | 'en') => {
    try {
      await alterarIdioma(novoIdioma);
      toast({
        title: 'Idioma atualizado',
        description: 'Suas preferências de idioma foram atualizadas com sucesso.'
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o idioma.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Settings className="mr-2 text-lavanda" size={20} />
          Preferências do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Idioma</Label>
          <Select 
            value={idioma} 
            onValueChange={(value) => handleIdiomaChange(value as 'pt' | 'en')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesTab;
