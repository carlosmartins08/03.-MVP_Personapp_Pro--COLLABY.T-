import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export const useMarkChargeAsPaid = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeChargeId, setActiveChargeId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const markAsPaid = async (chargeId: string) => {
    try {
      setIsLoading(true);
      setActiveChargeId(chargeId);

      const data = await api.post(`/financeiro/charges/${chargeId}/pay`);

      toast({
        title: "Sucesso!",
        description: "Pagamento processado com sucesso",
      });

      await queryClient.invalidateQueries({ queryKey: ['financeiro-resumo'] });

      return data;
    } catch (error) {
      console.error('Error marking charge as paid:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nao foi possivel processar o pagamento. Tente novamente.",
      });
      throw error;
    } finally {
      setIsLoading(false);
      setActiveChargeId(null);
    }
  };

  return { markAsPaid, isLoading, activeChargeId };
};
