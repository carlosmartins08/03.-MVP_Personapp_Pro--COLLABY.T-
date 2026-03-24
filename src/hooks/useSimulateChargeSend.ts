
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

export const useSimulateChargeSend = () => {
  const [isLoading, setIsLoading] = useState(false);

  const simulateSend = async (chargeId: string) => {
    try {
      setIsLoading(true);
      
      const data = await api.post(`/financeiro/charges/${chargeId}/send`);

      toast({
        title: "Sucesso!",
        description: "Cobrança enviada via WhatsApp",
      });

      return data;
    } catch (error) {
      console.error('Error simulating charge send:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a cobrança. Tente novamente.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { simulateSend, isLoading };
};
