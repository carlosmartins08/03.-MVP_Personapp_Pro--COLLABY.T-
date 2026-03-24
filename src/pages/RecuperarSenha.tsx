import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const { requestPasswordReset, isLoading } = useAuth();
  const navigate = useNavigate();

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestPasswordReset(email);
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-menta-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lavanda-dark mb-2">PersonaClinic</h1>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h1 className="text-xl font-semibold text-center text-violet-800">
            Recuperar senha
          </h1>
          <p className="text-sm text-center text-gray-500 mt-1">
            Informe seu e-mail e enviaremos um token para redefinir sua senha.
          </p>

          <form onSubmit={handlePasswordRecovery} className="mt-4 space-y-4">
            <Input
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar token de redefinição'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-violet-600"
            >
              Voltar para Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
