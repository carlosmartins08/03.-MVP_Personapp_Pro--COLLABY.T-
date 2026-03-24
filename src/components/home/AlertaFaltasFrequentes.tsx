
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useFrequentAbsences } from '@/hooks/useFrequentAbsences';

const AlertaFaltasFrequentes = () => {
  const navigate = useNavigate();
  const { fetchFrequentAbsences, isLoading } = useFrequentAbsences();
  const [pacientes, setPacientes] = React.useState<Array<{
    id: string;
    nome: string;
    totalFaltas: number;
  }>>([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFrequentAbsences();
        setPacientes(data);
      } catch (error) {
        console.error('Erro ao carregar pacientes com faltas frequentes:', error);
      }
    };

    loadData();
  }, [fetchFrequentAbsences]);

  if (isLoading || pacientes.length === 0) return null;

  return (
    <Card className="bg-[#FEF7CD] border-none mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center text-gray-800">
          <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
          Atenção: pacientes com faltas frequentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pacientes.map(paciente => (
            <div
              key={paciente.id}
              className="flex items-center justify-between bg-white/80 p-3 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-800">{paciente.nome}</h3>
                <p className="text-sm text-gray-600">
                  {paciente.totalFaltas} faltas registradas
                </p>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate(`/pacientes/${paciente.id}`)}
              >
                Ver Perfil
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertaFaltasFrequentes;
