
import { useMemo, useState } from 'react';
import type { PacienteApi } from '@/types/api';

type StatusFilter = 'todos' | 'faltas_frequentes' | 'inadimplente' | 'intensivo';

export const usePatientSearch = (patients: PacienteApi[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        normalizedSearch === '' ||
        [patient.nome, patient.email, patient.telefone].some((field) =>
          field?.toLowerCase().includes(normalizedSearch),
        );

      if (!matchesSearch) return false;

      switch (statusFilter) {
        case 'faltas_frequentes':
          return patient.statusRanqueado === 'faltas_frequentes';
        case 'inadimplente':
          return patient.statusRanqueado === 'inadimplente';
        case 'intensivo':
          return patient.statusRanqueado === 'intensivo';
        default:
          return true;
      }
    });
  }, [patients, normalizedSearch, statusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredPatients
  };
};
