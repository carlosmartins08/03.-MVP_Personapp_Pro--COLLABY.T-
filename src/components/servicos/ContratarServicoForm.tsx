
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Servico } from '@/types/servicos';
import { Paciente } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const formSchema = z.object({
  paciente_id: z.string().min(1, { message: 'Selecione um paciente' }),
  servico_id: z.string().min(1, { message: 'Selecione um serviço' }),
  data_inicio: z.date({ required_error: 'Selecione a data de início' }),
  qtd_total_sessoes: z.coerce.number().min(1, { message: 'Mínimo de 1 sessão' }),
});

type ContratarServicoFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isSubmitting?: boolean;
  servicos?: Servico[];
  pacienteId?: string;
};

export function ContratarServicoForm({ onSubmit, isSubmitting, servicos: propServicos, pacienteId }: ContratarServicoFormProps) {
  const { data: servicos } = useQuery({
    queryKey: ['servicos'],
    enabled: !propServicos,
    queryFn: async () => {
      const data = await api.get<Servico[]>('/servicos');
      return data;
    },
  });

  const { data: pacientes } = useQuery({
    queryKey: ['pacientes'],
    enabled: !pacienteId,
    queryFn: async () => {
      const data = await api.get<Paciente[]>('/pacientes');
      return data;
    },
  });

  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const servicosData = propServicos || servicos || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paciente_id: pacienteId || '',
      servico_id: '',
      data_inicio: new Date(),
      qtd_total_sessoes: 1,
    },
  });

  useEffect(() => {
    const servicoId = form.watch('servico_id');
    if (servicoId) {
      const servico = servicosData.find(s => s.id === servicoId);
      if (servico) {
        setSelectedServico(servico);
        
        // Set the qtd_total_sessoes if it's a package with defined number of sessions
        if (servico.tipo_cobranca === 'pacote' && servico.qtd_sessoes) {
          form.setValue('qtd_total_sessoes', servico.qtd_sessoes);
        }
      }
    }
  }, [form.watch('servico_id'), servicosData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!pacienteId && (
          <FormField
            control={form.control}
            name="paciente_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pacientes?.map((paciente) => (
                      <SelectItem key={paciente.id} value={paciente.id}>
                        {paciente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="servico_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {servicosData.map((servico) => (
                    <SelectItem key={servico.id} value={servico.id}>
                      {servico.nome} - {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(servico.valor)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_inicio"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de início</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qtd_total_sessoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total de sessões</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  {...field} 
                  disabled={selectedServico?.tipo_cobranca === 'pacote' && !!selectedServico?.qtd_sessoes}
                />
              </FormControl>
              {selectedServico?.tipo_cobranca === 'pacote' && selectedServico?.qtd_sessoes && (
                <p className="text-xs text-muted-foreground">
                  Quantidade fixa para este pacote de serviços
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Contratar serviço'}
        </Button>
      </form>
    </Form>
  );
}
