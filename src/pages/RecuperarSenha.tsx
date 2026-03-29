import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button, Input } from "@/design-system/components"
import { useAuth } from "@/hooks/useAuth"

const RecuperarSenha = () => {
  const [email, setEmail] = useState("")
  const { requestPasswordReset, isLoading } = useAuth()
  const navigate = useNavigate()

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault()
    await requestPasswordReset(email)
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-ds-surface-page p-4 flex items-center justify-center font-manrope">
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl p-8 border border-neutral-100 shadow-ds-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-ds-primary mx-auto mb-4 flex items-center justify-center shadow-ds-md">
            <span className="text-white font-sora font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-sora font-bold text-neutral-400">Recuperar senha</h1>
          <p className="text-sm font-manrope text-neutral-300 mt-1">
            Informe seu e-mail e enviaremos um token para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handlePasswordRecovery} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="recuperar-email"
              className="text-xs font-manrope font-semibold uppercase tracking-wider text-neutral-300 block"
            >
              Email
            </label>
            <Input
              id="recuperar-email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-manrope"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full font-manrope font-semibold rounded-2xl h-12 transition-all duration-200 hover:shadow-ds-md active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar token de redefinicao"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm font-manrope text-ds-primary hover:underline transition-colors"
          >
            Voltar para Login
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RecuperarSenha
