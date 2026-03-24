
import React from 'react';
import { Edit, Trash2, Package, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Servico, TipoCobranca, Modalidade } from '@/types/servicos';

interface ServicosTableProps {
  servicos: Servico[];
  isLoading: boolean;
  onEdit: (servico: Servico) => void;
  onDelete: (id: string) => void;
  onContratar?: (servico: Servico) => void;
}

const formatTipoCobranca = (tipo: TipoCobranca) => {
  const map: Record<TipoCobranca, string> = {
    'avulso': 'Sessão avulsa',
    'pacote': 'Pacote',
    'mensal': 'Assinatura'
  };
  return map[tipo] || tipo;
};

const formatModalidade = (modalidade: Modalidade) => {
  const map: Record<Modalidade, string> = {
    'online': 'Online',
    'presencial': 'Presencial',
    'hibrido': 'Híbrido'
  };
  return map[modalidade] || modalidade;
};

export const ServicosTable = ({ servicos, isLoading, onEdit, onDelete, onContratar }: ServicosTableProps) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando serviços...
      </div>
    );
  }

  if (!servicos?.length) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Nenhum serviço cadastrado.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Tipo de Cobrança</TableHead>
          <TableHead>Modalidade</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {servicos.map((servico) => (
          <TableRow key={servico.id}>
            <TableCell className="font-medium">{servico.nome}</TableCell>
            <TableCell>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(servico.valor)}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {formatTipoCobranca(servico.tipo_cobranca)}
                {servico.qtd_sessoes && ` (${servico.qtd_sessoes} sessões)`}
              </Badge>
            </TableCell>
            <TableCell>{formatModalidade(servico.modalidade)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(servico)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(servico.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {onContratar && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onContratar(servico)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Contratar
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
