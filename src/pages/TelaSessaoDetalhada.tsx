
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, EmptyState, Input, PageHeader, Textarea } from '@/design-system/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle, Clock, Calendar, DollarSign, FileText, User, XCircle } from 'lucide-react';
import { sessoesMock, pacientesMock } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sessao, StatusSessao, StatusPagamento } from '@/types';
import { toast } from '@/components/ui/use-toast';

const TelaSessaoDetalhada = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Encontrar a sessão com o ID especificado
  const sessaoOriginal = sessoesMock.find(s => s.id === id);
  
  // State para controlar os dados da sessão (para edição)
  const [sessao, setSessao] = useState<Sessao | null>(sessaoOriginal ?? null);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSessao(sessaoOriginal ?? null);
  }, [sessaoOriginal]);

  if (!sessaoOriginal) {
    return (
      <EmptyState
        title="Sessão não encontrada"
        description="A sessão que você está procurando não existe ou foi removida."
        icon={<Calendar size={48} />}
        action={
          <Button variant="secondary" size="sm" onClick={() => navigate('/sessoes')}>
            Voltar para Sessões
          </Button>
        }
      />
    );
  }
  
  // Encontrar o paciente desta sessão
  const paciente = pacientesMock.find(p => p.id === sessao.pacienteId);
  
  if (!paciente) {
    return (
      <EmptyState
        title="Paciente não encontrado"
        description="O paciente desta sessão não existe ou foi removido."
        icon={<User size={48} />}
        action={
          <Button variant="secondary" size="sm" onClick={() => navigate('/sessoes')}>
            Voltar para Sessões
          </Button>
        }
      />
    );
  }
  
  // Formatação de data e hora
  const dataSessao = new Date(sessao.data);
  const dataFormatada = format(dataSessao, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const horaFormatada = format(dataSessao, "HH:mm", { locale: ptBR });
  
  // Função para salvar alterações
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Em uma aplicação real, aqui enviaríamos os dados para uma API
      // Simulação de chamada de API com timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Se o status for "realizada" e o valor for maior que zero, 
      // acionar o endpoint "GerarCobrancaAoFinalizarSessao"
      if (sessao.status === 'realizada' && sessao.valor > 0) {
        // Simulação de chamada ao endpoint
        console.log("Gerando cobrança para a sessão", sessao.id);
        // Em uma aplicação real, faríamos uma chamada para o endpoint
        // await gerarCobrancaAoFinalizarSessao(sessao.id);
      }
      
      toast({
        title: "Sessão registrada com sucesso",
        description: "As alterações na sessão foram salvas.",
      });
      
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar sessão",
        description: "Tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Mudar status da sessão
  const handleStatusChange = (status: StatusSessao) => {
    setSessao({...sessao, status});
  };
  
  // Mudar status do pagamento
  const handlePaymentStatusChange = (statusPagamento: StatusPagamento) => {
    setSessao({...sessao, statusPagamento});
  };
  
  // Obter cor com base no status
  const getStatusColor = (status: StatusSessao) => {
    switch (status) {
      case 'agendada': return 'bg-azul-light text-azul';
      case 'confirmada': return 'bg-menta-light text-menta-dark';
      case 'realizada': return 'bg-lavanda-light text-lavanda-dark';
      case 'cancelada': 
      case 'faltou': 
        return 'bg-red-100 text-red-500';
    }
  };
  
  // Obter texto do status
  const getStatusText = (status: StatusSessao) => {
    switch (status) {
      case 'agendada': return 'Agendada';
      case 'confirmada': return 'Confirmada';
      case 'realizada': return 'Realizada';
      case 'cancelada': return 'Cancelada';
      case 'faltou': return 'Faltou';
    }
  };
  
  // Obter texto do status de pagamento
  const getPaymentStatusText = (status: StatusPagamento) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'pago': return 'Pago';
      case 'cancelado': return 'Cancelado';
    }
  };
  
  return (
    <div className="container pb-16">
      <PageHeader
        title="Detalhes da Sessão"
        subtitle={`${dataFormatada} às ${horaFormatada}`}
        action={
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/sessoes')}
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Button>
        }
      />
      
      <div className="p-4">
        {/* Card com dados do paciente */}
        <Card className="mb-6 persona-card">
          <div className="flex items-center p-4">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={paciente.fotoPerfil}
                  alt={paciente.nome}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-grow">
              <h2 className="font-semibold">{paciente.nome}</h2>
              <div className="text-sm text-muted-foreground flex flex-wrap">
                <span className="mr-2">{paciente.telefone}</span>
                <span>{paciente.email}</span>
              </div>
            </div>
            
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate(`/pacientes/${paciente.id}`)}
            >
              Ver Perfil
            </Button>
          </div>
        </Card>
        
        {/* Card com detalhes da sessão */}
        <Card className="mb-6">
          <div>
            <h3 className="text-lg flex items-center">
              <Calendar size={18} className="mr-2 text-lavanda" />
              Informações da Sessão
            </h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Data</label>
                <div className="bg-muted/30 p-2 rounded text-sm">
                  {dataFormatada}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Horário</label>
                <div className="bg-muted/30 p-2 rounded text-sm">
                  {horaFormatada}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Duração</label>
                <div className="bg-muted/30 p-2 rounded text-sm">
                  {sessao.duracao} minutos
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Valor</label>
                {editMode ? (
                  <Input
                    type="number"
                    value={sessao.valor}
                    onChange={(e) => setSessao({...sessao, valor: Number(e.target.value)})}
                    className="persona-input"
                  />
                ) : (
                  <div className="bg-muted/30 p-2 rounded text-sm">
                    R$ {sessao.valor}
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium">Status</label>
                {editMode ? (
                  <Select 
                    value={sessao.status}
                    onValueChange={(value) => handleStatusChange(value as StatusSessao)}
                  >
                    <SelectTrigger className="persona-input">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendada">Agendada</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="realizada">Realizada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                      <SelectItem value="faltou">Faltou</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`p-2 rounded text-sm ${getStatusColor(sessao.status)} bg-opacity-20`}>
                    {getStatusText(sessao.status)}
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium">Pagamento</label>
                {editMode ? (
                  <Select 
                    value={sessao.statusPagamento}
                    onValueChange={(value) => handlePaymentStatusChange(value as StatusPagamento)}
                  >
                    <SelectTrigger className="persona-input">
                      <SelectValue placeholder="Status do pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`p-2 rounded text-sm ${
                    sessao.statusPagamento === 'pago' 
                      ? 'bg-menta-light text-menta-dark' 
                      : sessao.statusPagamento === 'pendente'
                        ? 'bg-azul-light text-azul-dark'
                        : 'bg-red-100 text-red-500'
                  }`}>
                    {getPaymentStatusText(sessao.statusPagamento)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Card com anotações */}
        <Card className="mb-6">
          <div>
            <h3 className="text-lg flex items-center">
              <FileText size={18} className="mr-2 text-lavanda" />
              Anotações Clínicas
            </h3>
          </div>
          <div>
            {editMode ? (
              <Textarea
                value={sessao.anotacoes || ''}
                onChange={(e) => setSessao({...sessao, anotacoes: e.target.value})}
                placeholder="Adicione suas anotações sobre a sessão aqui..."
                rows={6}
                className="persona-input"
              />
            ) : (
              <div className="bg-muted/30 p-3 rounded text-sm min-h-[100px]">
                {sessao.anotacoes || "Nenhuma anotação registrada."}
              </div>
            )}
          </div>
        </Card>
        
        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3">
          {editMode ? (
            <>
              <Button 
                onClick={handleSave} 
                className="flex-1 bg-lavanda hover:bg-lavanda/90 text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <Clock size={16} className="animate-spin mr-2" />
                    Salvando...
                  </span>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Salvar Sessão
                  </>
                )}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setSessao({...sessaoOriginal});
                  setEditMode(false);
                }}
                className="flex-1"
                disabled={isSaving}
              >
                <XCircle size={16} className="mr-2" />
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => setEditMode(true)} 
                className="flex-1 bg-lavanda hover:bg-lavanda/90 text-white"
              >
                <FileText size={16} className="mr-2" />
                Editar Sessão
              </Button>
              {sessao.statusPagamento === 'pendente' && (
                <Button 
                  variant="secondary" 
                  onClick={() => handlePaymentStatusChange('pago')}
                  className="flex-1"
                >
                  <DollarSign size={16} className="mr-2" />
                  Marcar como Pago
                </Button>
              )}
              {sessao.status === 'agendada' && (
                <Button 
                  variant="secondary" 
                  onClick={() => handleStatusChange('confirmada')}
                  className="flex-1"
                >
                  <Clock size={16} className="mr-2" />
                  Confirmar Sessão
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelaSessaoDetalhada;


