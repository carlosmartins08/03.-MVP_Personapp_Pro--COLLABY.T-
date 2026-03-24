
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useServicosAlertas } from '@/hooks/useServicosAlertas';
import { AlertCircle } from 'lucide-react';

export const AlertaServicosBadge = () => {
  const { data: alertas } = useServicosAlertas();
  
  const totalAlertas = alertas?.length || 0;
  
  if (!totalAlertas) return null;
  
  return (
    <Badge variant="destructive" className="ml-2 items-center">
      <AlertCircle className="h-3 w-3 mr-1" />
      {totalAlertas}
    </Badge>
  );
};
