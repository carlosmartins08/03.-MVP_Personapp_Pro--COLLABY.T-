
import React from 'react';
import { EmailVerification } from '@/components/auth/EmailVerification';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';

const VerificarEmail = () => {
  const { idioma } = useLocalizacao();
  
  const mensagens = {
    pt: {
      titulo: "Verificação de E-mail",
      descricao: "Estamos verificando seu email para ativar sua conta.",
    },
    en: {
      titulo: "Email Verification",
      descricao: "We are verifying your email to activate your account.",
    }
  }[idioma || 'pt'];

  return (
    <div className="flex items-center justify-center min-h-screen bg-menta-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lavanda-dark mb-2">PersonaClinic</h1>
          <p className="text-muted-foreground">{mensagens.descricao}</p>
        </div>
        <EmailVerification />
      </div>
    </div>
  );
};

export default VerificarEmail;
