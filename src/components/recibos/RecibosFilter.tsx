
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { ReciboFilters } from '@/types/recibos';

interface RecibosFilterProps {
  filters: ReciboFilters;
  onFilterChange: (filters: ReciboFilters) => void;
}

export const RecibosFilter = ({ filters, onFilterChange }: RecibosFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Buscar por paciente..."
        value={filters.paciente}
        onChange={(e) => onFilterChange({ ...filters, paciente: e.target.value })}
        className="w-full sm:w-64"
      />
      
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !filters.dataInicio && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dataInicio ? (
                format(filters.dataInicio, "PPP", { locale: ptBR })
              ) : (
                <span>Data inicial</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dataInicio}
              onSelect={(date) => onFilterChange({ ...filters, dataInicio: date })}
              initialFocus
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !filters.dataFim && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dataFim ? (
                format(filters.dataFim, "PPP", { locale: ptBR })
              ) : (
                <span>Data final</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dataFim}
              onSelect={(date) => onFilterChange({ ...filters, dataFim: date })}
              initialFocus
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Select
        value={filters.status}
        onValueChange={(status) => onFilterChange({ ...filters, status })}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="enviado">Enviados</SelectItem>
          <SelectItem value="pendente">Pendentes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
