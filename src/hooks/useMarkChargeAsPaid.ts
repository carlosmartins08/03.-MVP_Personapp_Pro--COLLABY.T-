
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

export const useMarkChargeAsPaid = () => {
  const [isLoading, setIsLoading] = useState(false);

  const markAsPaid = async (chargeId: string) => {
    try {
      setIsLoading(true);
      
      const data = await api.post(`/sessoes/${chargeId}/pagar`);

      toast({
        title: "Sucesso!",
        description: "Pagamento registrado com sucesso",
      });

      return data;
    } catch (error) {
      console.error('Error marking charge as paid:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível registrar o pagamento. Tente novamente.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { markAsPaid, isLoading };
};
