
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/ui/PageHeader';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

const TelaCadastroPaciente = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    genero: '',
    cpf: '',
    endereco: '',
    observacoes: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulando o cadastro
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Paciente cadastrado!',
        description: 'O paciente foi cadastrado com sucesso.',
      });
      navigate('/pacientes');
    }, 1500);
  };

  return (
    <div className="container pb-16">
      <PageHeader
        title="Cadastrar Paciente"
        subtitle="Adicione um novo paciente ao sistema"
        rightContent={
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/pacientes')}
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Button>
        }
      />
      
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo*</Label>
                  <Input
                    id="nome"
                    name="nome"
                    placeholder="Nome completo do paciente"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="persona-input"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="persona-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone*</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      className="persona-input"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataNascimento">Data de Nascimento*</Label>
                    <Input
                      id="dataNascimento"
                      name="dataNascimento"
                      type="date"
                      value={formData.dataNascimento}
                      onChange={handleChange}
                      required
                      className="persona-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="genero">Gênero*</Label>
                    <Select
                      value={formData.genero}
                      onValueChange={(value) => handleSelectChange('genero', value)}
                    >
                      <SelectTrigger id="genero" className="persona-input">
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                        <SelectItem value="Não-binário">Não-binário</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                        <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF*</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                    className="persona-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço completo*</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    placeholder="Rua, número, bairro, cidade, estado, CEP"
                    value={formData.endereco}
                    onChange={handleChange}
                    required
                    className="persona-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações iniciais</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Informações relevantes sobre o paciente, como encaminhamentos, condições prévias, etc."
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={4}
                  className="persona-input"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="submit" 
              className="flex-1 persona-button"
              disabled={isLoading}
            >
              <Save size={16} className="mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Paciente'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/pacientes')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TelaCadastroPaciente;
