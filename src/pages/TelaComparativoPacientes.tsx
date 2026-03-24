
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { pacientesMock, sessoesMock } from '@/data/mockData';
import PatientComparison from '@/components/patients/PatientComparison';

const COLORS = ['#9b87f5', '#88D8B0', '#F97316'];

const TelaComparativoPacientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const filteredPatients = searchTerm
    ? pacientesMock.filter(p => 
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedPatients.includes(p.id)
      )
    : [];

  const handleSelectPatient = (patientId: string) => {
    if (selectedPatients.length < 3) {
      setSelectedPatients([...selectedPatients, patientId]);
      setSearchTerm('');
    }
  };

  const handleRemovePatient = (patientId: string) => {
    setSelectedPatients(selectedPatients.filter(id => id !== patientId));
    setShowResults(false);
  };

  const handleCompare = () => {
    if (selectedPatients.length > 0) {
      setShowResults(true);
    }
  };

  const selectedPatientsData = selectedPatients.map((id, index) => ({
    patient: pacientesMock.find(p => p.id === id)!,
    sessions: sessoesMock.filter(s => s.pacienteId === id),
    color: COLORS[index]
  }));

  return (
    <div className="container pb-16">
      <PageHeader
        title="Comparar Pacientes"
        subtitle="Compare dados entre até 3 pacientes"
      />

      <div className="p-4 space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Digite o nome do paciente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={selectedPatients.length >= 3}
              />
            </div>

            {searchTerm && (
              <div className="bg-background border rounded-md divide-y">
                {filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    className="p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleSelectPatient(patient.id)}
                  >
                    {patient.nome}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {selectedPatients.map((patientId, index) => {
                const patient = pacientesMock.find(p => p.id === patientId);
                if (!patient) return null;
                
                return (
                  <Badge
                    key={patient.id}
                    variant="secondary"
                    style={{ backgroundColor: `${COLORS[index]}20` }}
                    className="py-2"
                  >
                    {patient.nome}
                    <X
                      size={14}
                      className="ml-2 cursor-pointer"
                      onClick={() => handleRemovePatient(patient.id)}
                    />
                  </Badge>
                );
              })}
            </div>

            <Button
              onClick={handleCompare}
              disabled={selectedPatients.length === 0}
              className="w-full"
            >
              Comparar {selectedPatients.length} paciente{selectedPatients.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </Card>

        {showResults && selectedPatientsData.length > 0 && (
          <PatientComparison patients={selectedPatientsData} />
        )}
      </div>
    </div>
  );
};

export default TelaComparativoPacientes;
