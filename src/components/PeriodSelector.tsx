
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Support both the old and new API
export type PeriodOption = {
  value: number;
  label: string;
} | string;

interface PeriodSelectorProps {
  // Support for original API
  value?: PeriodOption;
  onValueChange?: (value: PeriodOption) => void;
  
  // Support for new API used in TelaPrevisaoAgendaClinica
  selectedOption?: PeriodOption;
  onOptionChange?: (value: PeriodOption) => void;
  
  // Optional array of period options
  options?: PeriodOption[];
}

// Default period options for backward compatibility
export const periodOptions: string[] = [
  "Este mês",
  "Últimos 30 dias",
  "Este ano"
];

export const PeriodSelector = ({ 
  value, 
  onValueChange,
  selectedOption,
  onOptionChange,
  options
}: PeriodSelectorProps) => {
  // Determine which API is being used
  const actualValue = selectedOption || value;
  const actualOnChange = onOptionChange || onValueChange;
  
  // Determine which options to use
  const actualOptions = options || periodOptions;
  
  // If we're using the new object-based options
  if (options && typeof actualOptions[0] === 'object') {
    return (
      <Select 
        value={typeof actualValue === 'object' ? actualValue.value.toString() : actualValue?.toString()}
        onValueChange={(newValue) => {
          if (!actualOnChange) return;
          
          const selectedOption = options.find(opt => 
            (typeof opt === 'object' ? opt.value.toString() : opt) === newValue
          );
          
          if (selectedOption) {
            actualOnChange(selectedOption);
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Selecione um período" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={typeof option === 'object' ? option.value.toString() : option}
              value={typeof option === 'object' ? option.value.toString() : option}
            >
              {typeof option === 'object' ? option.label : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  
  // Original implementation for string-based periods
  return (
    <ToggleGroup 
      type="single" 
      value={typeof actualValue === 'string' ? actualValue : (typeof actualValue === 'object' ? actualValue.label : undefined)}
      onValueChange={(val) => {
        if (val && actualOnChange) {
          actualOnChange(val);
        }
      }}
      className="justify-start border rounded-lg p-1 bg-background"
    >
      {actualOptions.map((period) => (
        <ToggleGroupItem 
          key={typeof period === 'string' ? period : period.label}
          value={typeof period === 'string' ? period : period.label}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <Calendar className="h-4 w-4 mr-2" />
          {typeof period === 'string' ? period : period.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
