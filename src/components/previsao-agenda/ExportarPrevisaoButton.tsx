
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface ExportarPrevisaoButtonProps {
  period: number;
}

export const ExportarPrevisaoButton: React.FC<ExportarPrevisaoButtonProps> = ({ period }) => {
  const handleExportClick = () => {
    console.log(`Exporting forecast for ${period} days`);
    // Implementation for exporting forecast data
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExportClick}>
      <FileText className="h-4 w-4 mr-2" />
      Exportar
    </Button>
  );
};
