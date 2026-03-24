
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ClinicalAlertsProps {
  patientsWithFrequentAbsences: number;
  newPatientsThisMonth: number;
  patientsWithoutSessionFor30Days: number;
  isLoading: boolean;
}

const ClinicalAlerts: React.FC<ClinicalAlertsProps> = ({
  patientsWithFrequentAbsences,
  newPatientsThisMonth,
  patientsWithoutSessionFor30Days,
  isLoading
}) => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
          Alertas Clínicos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#FEF7CD] p-3 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              <div>
                <p className="font-medium">Pacientes com faltas frequentes</p>
                <p className="text-sm text-gray-600">3 ou mais faltas registradas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold">{patientsWithFrequentAbsences}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/pacientes')}
              >
                Ver
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-[#F2FCE2] p-3 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-500" />
              <div>
                <p className="font-medium">Novos pacientes este mês</p>
                <p className="text-sm text-gray-600">Pacientes recém cadastrados</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold">{newPatientsThisMonth}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/pacientes')}
              >
                Ver
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-[#F1F0FB] p-3 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-lavanda" />
              <div>
                <p className="font-medium">Sem sessão há mais de 30 dias</p>
                <p className="text-sm text-gray-600">Pacientes inativos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold">{patientsWithoutSessionFor30Days}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/pacientes')}
              >
                Ver
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalAlerts;
