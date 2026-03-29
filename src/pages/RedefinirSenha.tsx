import React, { useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { toast } from "@/components/ui/use-toast"
import { Button, Input, Label } from "@/design-system/components"
import { useAuth } from "@/hooks/useAuth"

const RedefinirSenha = () => {
  const location = useLocation()
  const queryToken = useMemo(
    () => new URLSearchParams(location.search).get("token") || "",
    [location.search]
  )
  const [token, setToken] = useState(queryToken)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { resetPassword, isLoading } = useAuth()
  const navigate = useNavigate()

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast({
        title: "Token obrigatorio",
        description: "Informe o token recebido por e-mail.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas nao coincidem",
        description: "Verifique se digitou a nova senha corretamente.",
        variant: "destructive",
      })
      return
    }

    await resetPassword(token, newPassword)
  }

  return (
    <div className="min-h-screen bg-ds-surface-page p-4 flex items-center justify-center font-manrope">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl p-8 border border-neutral-100 shadow-ds-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-ds-primary mx-auto mb-4 flex items-center justify-center shadow-ds-md">
            <span className="text-white font-sora font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-sora font-bold text-neutral-400">Redefinir senha</h1>
          <p className="text-sm font-manrope text-neutral-300 mt-1">
            Informe o token recebido e defina sua nova senha.
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="token"
              className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300"
            >
              Token
            </Label>
            <Input
              id="token"
              type="text"
              placeholder="Cole o token enviado por e-mail"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-manrope"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="nova-senha"
              className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300"
            >
              Nova senha
            </Label>
            <Input
              id="nova-senha"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="font-manrope"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="confirmar-senha"
              className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300"
            >
              Confirmar nova senha
            </Label>
            <Input
              id="confirmar-senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="font-manrope"
              required
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full font-manrope font-semibold rounded-2xl h-12 transition-all duration-200 hover:shadow-ds-md active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? "Redefinindo..." : "Redefinir senha"}
          </Button>

          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-sm font-manrope text-ds-primary hover:underline transition-colors"
          >
            Voltar para Login
          </Button>
        </form>
      </div>
    </div>
  )
}

export default RedefinirSenha
