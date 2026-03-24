
import React from 'react';
import { Download, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReciboTableProps {
  recibos: any[];
  isLoading: boolean;
  onSend: (reciboId: string) => void;
  onDelete: (reciboId: string) => void;
}

export const RecibosTable = ({ recibos, isLoading, onSend, onDelete }: ReciboTableProps) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando recibos...
      </div>
    );
  }

  if (!recibos?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum recibo encontrado.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Paciente</TableHead>
          <TableHead>Data da Sessão</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Forma</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recibos.map((recibo) => (
          <TableRow key={recibo.id}>
            <TableCell>{recibo.paciente?.nome}</TableCell>
            <TableCell>
              {format(new Date(recibo.data_sessao), 'dd/MM/yyyy', { locale: ptBR })}
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(recibo.valor)}
            </TableCell>
            <TableCell>{recibo.forma_pagamento}</TableCell>
            <TableCell>
              {recibo.enviado ? (
                <span className="text-green-600">✓ Enviado</span>
              ) : (
                <span className="text-muted-foreground">Pendente</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {recibo.pdf_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(recibo.pdf_url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSend(recibo.id)}
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(recibo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
