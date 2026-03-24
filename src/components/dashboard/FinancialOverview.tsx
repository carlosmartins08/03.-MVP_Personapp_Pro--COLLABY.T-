
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FinancialOverviewProps {
  totalReceived: number;
  totalPending: number;
  averageSessionValue: number;
  isLoading: boolean;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  totalReceived,
  totalPending,
  averageSessionValue,
  isLoading
}) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-menta" />
          Visão Geral Financeira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="bg-[#F2FCE2] p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Recebido</p>
            <p className="text-2xl font-bold text-gray-800">
              R$ {totalReceived.toFixed(2)}
            </p>
          </div>
          <div className="bg-[#F1F0FB] p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Pendente</p>
            <p className="text-2xl font-bold text-gray-800">
              R$ {totalPending.toFixed(2)}
            </p>
          </div>
          <div className="bg-[#F8F9FA] p-3 rounded-lg">
            <p className="text-sm text-gray-600">Média/Sessão</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-gray-800">
                R$ {averageSessionValue.toFixed(2)}
              </p>
              <TrendingUp className="ml-2 h-4 w-4 text-menta" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => navigate('/financeiro')}
          className="w-full flex items-center justify-center persona-button"
        >
          Ver detalhado
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinancialOverview;
