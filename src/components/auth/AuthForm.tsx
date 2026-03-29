import React, { useState } from "react"
import { Eye, EyeOff, Info } from "lucide-react"
import { Link } from "react-router-dom"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useLocalizacao } from "@/contexts/LocalizacaoContext"
import { Button, Input } from "@/design-system/components"
import { useAuth, UserType } from "@/hooks/useAuth"

export function AuthForm() {
  const { toast } = useToast()
  const { signUp, signIn, isLoading } = useAuth()
  const { idioma } = useLocalizacao()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState<UserType>("paciente")
  const [verSenha, setVerSenha] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  const mensagens = {
    pt: {
      emailLabel: "Email",
      senhaLabel: "Senha",
      tipoLabel: "Tipo de Usuario",
      paciente: "Paciente",
      profissional: "Profissional",
      criarConta: "Criar Conta",
      entrar: "Entrar",
      requisitos:
        "A senha deve ter pelo menos 8 caracteres, incluindo letras maiusculas, minusculas e numeros.",
      verificacaoInfo:
        "Apos o cadastro, voce recebera um email com instrucoes para verificar sua conta.",
      carregando: "Processando...",
      recuperarSenha: "Esqueceu a senha?",
      redefinirComToken: "Ja tem token? Redefinir senha",
    },
    en: {
      emailLabel: "Email",
      senhaLabel: "Password",
      tipoLabel: "User Type",
      paciente: "Patient",
      profissional: "Professional",
      criarConta: "Create Account",
      entrar: "Login",
      requisitos:
        "Password must be at least 8 characters long and include uppercase, lowercase letters, and numbers.",
      verificacaoInfo:
        "After registration, you will receive an email with instructions to verify your account.",
      carregando: "Processing...",
      recuperarSenha: "Forgot password?",
      redefinirComToken: "Have a token? Reset password",
    },
  }[idioma || "pt"]

  const handleCadastro = () => {
    if (!senha.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)) {
      toast({
        title: mensagens.senhaLabel,
        description: mensagens.requisitos,
        variant: "destructive",
      })
      return
    }
    signUp({ email, senha, tipo: tipoUsuario })
  }

  return (
    <Tabs
      defaultValue="login"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="w-full bg-neutral-100 rounded-2xl p-1 mb-6 h-auto grid grid-cols-2">
        <TabsTrigger
          value="login"
          className="flex-1 rounded-xl py-2.5 text-sm font-manrope font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-neutral-400 data-[state=active]:shadow-ds-sm text-neutral-300"
        >
          {mensagens.entrar}
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className="flex-1 rounded-xl py-2.5 text-sm font-manrope font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:text-neutral-400 data-[state=active]:shadow-ds-sm text-neutral-300"
        >
          {mensagens.criarConta}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 block"
            >
              {mensagens.emailLabel}
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-manrope"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="login-senha"
              className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 block"
            >
              {mensagens.senhaLabel}
            </label>
            <div className="relative">
              <Input
                id="login-senha"
                type={verSenha ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="font-manrope pr-11"
                required
              />
              <button
                type="button"
                aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={verSenha}
                className="absolute right-3 top-3 text-neutral-300 hover:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ds-primary/40 rounded transition-colors"
                onClick={() => setVerSenha(!verSenha)}
              >
                {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full font-manrope font-semibold rounded-2xl h-12 transition-all duration-200 hover:shadow-ds-md active:scale-[0.98]"
            onClick={() => signIn({ email, senha })}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? mensagens.carregando : mensagens.entrar}
          </Button>

          <div className="text-center">
            <Link
              to="/recuperar-senha"
              className="text-sm font-manrope text-ds-primary hover:underline transition-colors"
            >
              {mensagens.recuperarSenha}
            </Link>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="signup" className="mt-4">
        <div className="space-y-4">
          <Alert variant="default" className="bg-ds-accent-sky border-ds-primary/20 mb-4">
            <Info className="h-4 w-4 text-ds-primary" />
            <AlertDescription className="text-ds-primary text-xs font-manrope">
              {mensagens.verificacaoInfo}
            </AlertDescription>
          </Alert>

          <div className="space-y-1.5">
            <label
              htmlFor="signup-email"
              className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 block"
            >
              {mensagens.emailLabel}
            </label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-manrope"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="signup-senha"
              className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 block"
            >
              {mensagens.senhaLabel}
            </label>
            <div className="relative">
              <Input
                id="signup-senha"
                type={verSenha ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="font-manrope pr-11"
                required
              />
              <button
                type="button"
                aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={verSenha}
                className="absolute right-3 top-3 text-neutral-300 hover:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ds-primary/40 rounded transition-colors"
                onClick={() => setVerSenha(!verSenha)}
              >
                {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <p className="text-xs font-manrope text-neutral-300 mt-1">{mensagens.requisitos}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="tipo-usuario"
              className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 block"
            >
              {mensagens.tipoLabel}
            </label>
            <select
              id="tipo-usuario"
              className="w-full border border-neutral-200 rounded-xl p-2.5 bg-white h-12 text-base font-manrope text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-primary/30"
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value as UserType)}
            >
              <option value="paciente">{mensagens.paciente}</option>
              <option value="profissional">{mensagens.profissional}</option>
            </select>
          </div>

          <Button
            variant="primary"
            className="w-full font-manrope font-semibold rounded-2xl h-12 transition-all duration-200 hover:shadow-ds-md active:scale-[0.98]"
            onClick={handleCadastro}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? mensagens.carregando : mensagens.criarConta}
          </Button>

          <div className="text-center">
            <Link
              to="/redefinir-senha"
              className="text-sm font-manrope text-ds-primary hover:underline transition-colors"
            >
              {mensagens.redefinirComToken}
            </Link>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
