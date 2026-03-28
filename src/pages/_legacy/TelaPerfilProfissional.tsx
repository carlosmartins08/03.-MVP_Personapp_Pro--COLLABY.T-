
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Input,
  Label,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/components';
import { toast } from '@/components/ui/use-toast';
import { Save, LogOut, User, CreditCard, Bell, Sliders, Lock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { usuarioMock } from '@/data/mockData';

const TelaPerfilProfissional = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: usuarioMock.nome,
    email: usuarioMock.email,
    telefone: usuarioMock.telefone,
    especialidade: usuarioMock.especialidade,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulando a atualização
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    }, 1500);
  };
  
  const handleLogout = () => {
    toast({
      title: 'Desconectado',
      description: 'Você foi desconectado com sucesso.',
    });
    navigate('/login');
  };

  return (
    <div className="container pb-16">
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações e preferências"
      />
      
      <div className="p-4">
        <Card className="mb-6 persona-card">
          <div className="flex flex-col sm:flex-row p-4 items-center sm:items-start">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6">
              <img
                src={usuarioMock.fotoPerfil}
                alt={usuarioMock.nome}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow text-center sm:text-left">
              <h2 className="text-xl font-bold mb-2">{usuarioMock.nome}</h2>
              <p className="text-muted-foreground mb-4">{usuarioMock.especialidade}</p>
              
              <Button size="sm" variant="secondary">
                Alterar foto
              </Button>
            </div>
          </div>
        </Card>
        
        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="conta">Conta</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>
          
          {/* Aba de Perfil */}
          <TabsContent value="perfil" className="mt-0">
            <form onSubmit={handleSubmit}>
              <Card>
                <div>
                  <h3 className="text-lg flex items-center">
                    <User size={18} className="mr-2 text-lavanda" />
                    Informações Pessoais
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="persona-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="especialidade">Especialidade</Label>
                    <Input
                      id="especialidade"
                      name="especialidade"
                      value={formData.especialidade}
                      onChange={handleChange}
                      className="persona-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="persona-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="persona-input"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full persona-button"
                    disabled={isLoading}
                  >
                    <Save size={16} className="mr-2" />
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </Card>
            </form>
          </TabsContent>
          
          {/* Aba de Conta */}
          <TabsContent value="conta" className="mt-0 space-y-4">
            <Card>
              <div>
                <h3 className="text-lg flex items-center">
                  <Lock size={18} className="mr-2 text-lavanda" />
                  Segurança
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senha-atual">Senha atual</Label>
                  <Input
                    id="senha-atual"
                    type="password"
                    placeholder="••••••••"
                    className="persona-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nova-senha">Nova senha</Label>
                  <Input
                    id="nova-senha"
                    type="password"
                    placeholder="••••••••"
                    className="persona-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
                  <Input
                    id="confirmar-senha"
                    type="password"
                    placeholder="••••••••"
                    className="persona-input"
                  />
                </div>
                
                <Button className="w-full persona-button">
                  Alterar Senha
                </Button>
              </div>
            </Card>
            
            <Card>
              <div>
                <h3 className="text-lg flex items-center">
                  <Bell size={18} className="mr-2 text-lavanda" />
                  Notificações
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Novas sessões</h3>
                    <p className="text-sm text-muted-foreground">Receba notificações quando novas sessões forem marcadas</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Lembretes de sessão</h3>
                    <p className="text-sm text-muted-foreground">Receba lembretes antes das sessões</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Pagamentos recebidos</h3>
                    <p className="text-sm text-muted-foreground">Receba notificações sobre novos pagamentos</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>
          
          {/* Aba Financeiro */}
          <TabsContent value="financeiro" className="mt-0 space-y-4">
            <Card>
              <div>
                <h3 className="text-lg flex items-center">
                  <CreditCard size={18} className="mr-2 text-lavanda" />
                  Método de Recebimento
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="banco">Banco</Label>
                  <Input
                    id="banco"
                    placeholder="Nome do banco"
                    className="persona-input"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="agencia">Agência</Label>
                    <Input
                      id="agencia"
                      placeholder="0000"
                      className="persona-input"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="conta">Conta</Label>
                    <Input
                      id="conta"
                      placeholder="00000-0"
                      className="persona-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pix">Chave PIX</Label>
                  <Input
                    id="pix"
                    placeholder="CPF, e-mail, telefone ou chave aleatória"
                    className="persona-input"
                  />
                </div>
                
                <Button className="w-full persona-button">
                  Salvar Informações Bancárias
                </Button>
              </div>
            </Card>
            
            <Card>
              <div>
                <h3 className="text-lg flex items-center">
                  <Sliders size={18} className="mr-2 text-lavanda" />
                  Configurações Financeiras
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="valor-padrao">Valor padrão da sessão (R$)</Label>
                  <Input
                    id="valor-padrao"
                    type="number"
                    placeholder="150"
                    className="persona-input"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Cobrar automaticamente</h3>
                    <p className="text-sm text-muted-foreground">Gerar cobranças automáticas após as sessões</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enviar lembretes de pagamento</h3>
                    <p className="text-sm text-muted-foreground">Enviar lembretes para pagamentos pendentes</p>
                  </div>
                  <Switch />
                </div>
                
                <Button className="w-full persona-button">
                  Salvar Configurações
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Sair da Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TelaPerfilProfissional;

