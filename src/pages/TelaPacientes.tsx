import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge, Card, Input, Avatar } from '@/design-system/components';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Search, Users } from 'lucide-react';
import { usePatientSearch } from '@/hooks/usePatientSearch';
import PatientStatusFilter from '@/components/patients/PatientStatusFilter';
import { api } from '@/lib/api';
import type { PacienteApi } from '@/types/api';

type StatusBadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

const statusLabels: Record<NonNullable<PacienteApi['statusRanqueado']>, string> = {
  normal: 'Normal',
  faltas_frequentes: 'Faltas frequentes',
  inadimplente: 'Inadimplente',
  intensivo: 'Intensivo',
};

const statusVariants: Record<NonNullable<PacienteApi['statusRanqueado']>, StatusBadgeVariant> = {
  normal: 'success',
  faltas_frequentes: 'warning',
  inadimplente: 'error',
  intensivo: 'primary',
};

const getInitials = (name?: string | null) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
};

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
          <label htmlFor="busca-pacientes" className="sr-only">
            Buscar paciente
          </label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            id="busca-pacientes"
            type="search"
            placeholder="Buscar paciente por nome, e-mail ou telefone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
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
            {filteredPatients.map((paciente) => {
              const status = paciente.statusRanqueado ?? undefined;
              return (
                <Link key={paciente.id} to={`/pacientes/${paciente.id}`} className="block">
                  <Card variant="default" className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Avatar
                          size="lg"
                          imageUrl={paciente.fotoPerfil ?? undefined}
                          initials={getInitials(paciente.nome)}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold">{paciente.nome}</h3>
                          {status && (
                            <Badge variant={statusVariants[status]} size="sm">
                              {statusLabels[status]}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:space-x-2 text-sm text-muted-foreground">
                          <span>{paciente.email}</span>
                          <span className="hidden sm:inline">â€¢</span>
                          <span>{paciente.telefone}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
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

