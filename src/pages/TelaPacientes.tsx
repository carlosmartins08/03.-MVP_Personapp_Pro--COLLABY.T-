
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Search, Users } from 'lucide-react';
import { usePatientSearch } from '@/hooks/usePatientSearch';
import PatientStatusFilter from '@/components/patients/PatientStatusFilter';
import { api } from '@/lib/api';
import type { PacienteApi } from '@/types/api';

const TelaPacientes = () => {
  const navigate = useNavigate();
  const { data: pacientes = [], isLoading } = useQuery({
    queryKey: ['pacientes'],
    queryFn: () => api.get<PacienteApi[]>('/pacientes'),
  });

  const patients = pacientes ?? [];

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredPatients,
  } = usePatientSearch(patients);

  if (isLoading) {
    return (
      <div className="container pb-16">
        <PageHeader title="Pacientes" subtitle="Gerencie seus pacientes" />
        <p className="text-center py-10 text-muted-foreground">Carregando pacientes...</p>
      </div>
    );
  }

  return (
    <div className="container pb-16">
      <PageHeader
        title="Pacientes"
        subtitle="Gerencie seus pacientes"
        rightContent={
          <Button 
            onClick={() => navigate('/pacientes/cadastro')}
            className="persona-button"
            size="sm"
          >
            <Plus size={16} className="mr-1" /> Novo
          </Button>
        }
      />

      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar paciente por nome, e-mail ou telefone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 persona-input"
          />
        </div>

        <div className="py-2">
          <PatientStatusFilter 
            value={statusFilter}
            onValueChange={setStatusFilter}
          />
        </div>

        {filteredPatients.length > 0 ? (
          <div className="space-y-3">
            {filteredPatients.map((paciente) => (
              <Card 
                key={paciente.id} 
                className="persona-card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/pacientes/${paciente.id}`)}
              >
                <div className="flex items-center p-3">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={paciente.fotoPerfil}
                        alt={paciente.nome}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{paciente.nome}</h3>
                    <div className="flex flex-col sm:flex-row sm:space-x-2 text-sm text-muted-foreground">
                      <span>{paciente.email}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{paciente.telefone}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users size={48} />}
            title={
              searchTerm || statusFilter !== 'todos'
                ? "Nenhum paciente encontrado"
                : "Nenhum paciente cadastrado"
            }
            description={
              searchTerm || statusFilter !== 'todos'
                ? "Tente ajustar os filtros de busca."
                : "Cadastre seu primeiro paciente para começar."
            }
            actionLabel={!searchTerm && statusFilter === 'todos' ? "Cadastrar Paciente" : undefined}
            onAction={
              !searchTerm && statusFilter === 'todos' ? () => navigate("/pacientes/cadastro") : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default TelaPacientes;
