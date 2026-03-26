import React, { useState } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';
import { useAuth, UserType } from '@/hooks/useAuth';
import { Button, Input } from '@/design-system/components';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AuthForm() {
  const { toast } = useToast();
  const { signUp, signIn, isLoading } = useAuth();
  const { idioma } = useLocalizacao();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<UserType>("paciente");
  const [verSenha, setVerSenha] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const mensagens = {
    pt: {
      emailLabel: "Email",
      senhaLabel: "Senha",
      tipoLabel: "Tipo de Usuario",
      paciente: "Paciente",
      profissional: "Profissional",
      criarConta: "Criar Conta",
      entrar: "Entrar",
      requisitos: "A senha deve ter pelo menos 8 caracteres, incluindo letras maiusculas, minusculas e numeros.",
      verificacaoInfo: "Apos o cadastro, voce recebera um email com instrucoes para verificar sua conta.",
      carregando: "Processando..."
    },
    en: {
      emailLabel: "Email",
      senhaLabel: "Password",
      tipoLabel: "User Type",
      paciente: "Patient",
      profissional: "Professional",
      criarConta: "Create Account",
      entrar: "Login",
      requisitos: "Password must be at least 8 characters long and include uppercase, lowercase letters, and numbers.",
      verificacaoInfo: "After registration, you will receive an email with instructions to verify your account.",
      carregando: "Processing..."
    },
  }[idioma || "pt"];

  const handleCadastro = () => {
    if (!senha.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
      toast({
        title: mensagens.senhaLabel,
        description: mensagens.requisitos,
        variant: "destructive",
      });
      return;
    }
    signUp({ email, senha, tipo: tipoUsuario });
  };

  return (
    <Tabs 
      defaultValue="login" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login">{mensagens.entrar}</TabsTrigger>
        <TabsTrigger value="signup">{mensagens.criarConta}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="login" className="mt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-sm font-medium">{mensagens.emailLabel}</label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="login-senha" className="text-sm font-medium">{mensagens.senhaLabel}</label>
            <div className="relative">
              <Input
                id="login-senha"
                type={verSenha ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={verSenha}
                className="absolute right-3 top-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded"
                onClick={() => setVerSenha(!verSenha)}
              >
                {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => signIn({ email, senha })}
            loading={isLoading}
            disabled={isLoading}
          >
            {mensagens.entrar}
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="signup" className="mt-4">
        <div className="space-y-4">
          <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700 text-xs">
              {mensagens.verificacaoInfo}
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-sm font-medium">{mensagens.emailLabel}</label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="signup-senha" className="text-sm font-medium">{mensagens.senhaLabel}</label>
            <div className="relative">
              <Input
                id="signup-senha"
                type={verSenha ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={verSenha}
                className="absolute right-3 top-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded"
                onClick={() => setVerSenha(!verSenha)}
              >
                {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <p className="text-xs text-gray-600 mt-1">{mensagens.requisitos}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="tipo-usuario" className="text-sm font-medium">{mensagens.tipoLabel}</label>
            <select
              id="tipo-usuario"
              className="w-full border rounded-md p-2 bg-white h-10 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value as UserType)}
            >
              <option value="paciente">{mensagens.paciente}</option>
              <option value="profissional">{mensagens.profissional}</option>
            </select>
          </div>
          
          <Button
            variant="primary"
            className="w-full"
            onClick={handleCadastro}
            loading={isLoading}
            disabled={isLoading}
          >
            {mensagens.criarConta}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

