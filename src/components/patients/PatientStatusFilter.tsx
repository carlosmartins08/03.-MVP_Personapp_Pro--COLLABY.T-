
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type StatusFilter = 'todos' | 'faltas_frequentes' | 'inadimplente' | 'intensivo';

interface PatientStatusFilterProps {
  value: StatusFilter;
  onValueChange: (value: StatusFilter) => void;
}

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'faltas_frequentes', label: 'Faltas Frequentes' },
  { value: 'inadimplente', label: 'Inadimplente' },
  { value: 'intensivo', label: 'Em Acompanhamento Intensivo' },
] as const;

const PatientStatusFilter: React.FC<PatientStatusFilterProps> = ({ value, onValueChange }) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(value) => value && onValueChange(value as StatusFilter)}
      className="flex flex-wrap gap-2 justify-start"
    >
      {STATUS_OPTIONS.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary rounded-full whitespace-nowrap"
          aria-label={`Filtrar por ${option.label}`}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default PatientStatusFilter;
