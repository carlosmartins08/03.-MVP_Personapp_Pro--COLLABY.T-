import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/services/auth-service';

export type UserType = 'paciente' | 'profissional';

interface SignUpParams {
  email: string;
  senha: string;
  tipo: UserType;
}

interface SignInParams {
  email: string;
  senha: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const { idioma } = useLocalizacao();
  const { setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (err instanceof Error && err.message) return err.message;
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object' && 'message' in err) {
      const message = (err as { message?: unknown }).message;
      if (typeof message === 'string') return message;
    }
    return fallback;
  };

  const mensagens = {
    pt: {
      erroCadastro: 'Erro ao criar conta',
      sucesso: 'Conta criada com sucesso!',
      erroGenerico: 'Algo deu errado. Tente novamente.',
      verificacaoEmail: 'Verifique seu email para confirmar o cadastro',
      erroToken: 'Erro ao gerar token de verificação',
      erroLogin: 'Erro ao fazer login',
      tokenInvalido: 'Token inválido ou expirado',
      emailVerificado: 'Email verificado com sucesso',
      emailReset: 'Confira sua caixa de entrada para redefinir a senha.',
      senhaAtualizada: 'Senha atualizada',
    },
    en: {
      erroCadastro: 'Error creating account',
      sucesso: 'Account created successfully!',
      erroGenerico: 'Something went wrong. Please try again.',
      verificacaoEmail: 'Check your email to confirm your registration',
      erroToken: 'Error generating verification token',
      erroLogin: 'Login failed',
      tokenInvalido: 'Invalid or expired token',
      emailVerificado: 'Email verified successfully',
      emailReset: 'Check your inbox to reset your password.',
      senhaAtualizada: 'Password updated',
    },
  }[idioma || 'pt'];

  const signUp = async ({ email, senha, tipo }: SignUpParams) => {
    try {
      setIsLoading(true);
      await authService.signUp({ email, senha, tipo });
      toast({
        title: mensagens.sucesso,
        description: mensagens.verificacaoEmail,
      });
      navigate('/login');
    } catch (err: unknown) {
      toast({
        title: mensagens.erroCadastro,
        description: getErrorMessage(err, mensagens.erroGenerico),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verificarEmail = async (token: string) => {
    try {
      await authService.verifyEmail(token);
      toast({
        title: mensagens.emailVerificado,
      });
      return true;
    } catch (err) {
      console.error('Erro ao validar token', err);
      toast({
        title: mensagens.tokenInvalido,
        variant: 'destructive',
      });
      return false;
    }
  };

  const signIn = async ({ email, senha }: SignInParams) => {
    try {
      setIsLoading(true);
      const user = await authService.login({ email, senha });
      setUser(user);

      toast({
        title: 'Login realizado',
        description: 'Bem-vindo de volta!',
      });

      if (user.tipo === 'paciente') {
        navigate('/app/paciente/dashboard');
      } else {
        navigate('/app/profissional/dashboard');
      }
    } catch (err: unknown) {
      toast({
        title: mensagens.erroLogin,
        description: getErrorMessage(err, 'Verifique suas credenciais.'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      await authService.requestPasswordReset(email);
      toast({
        title: 'E-mail enviado',
        description: mensagens.emailReset,
      });
    } catch (err: unknown) {
      toast({
        title: mensagens.erroGenerico,
        description: getErrorMessage(err, mensagens.erroGenerico),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, senha: string) => {
    try {
      setIsLoading(true);
      await authService.resetPassword(token, senha);
      toast({
        title: mensagens.senhaAtualizada,
        description: 'Faça login com sua nova senha.',
      });
      navigate('/login');
    } catch (err: unknown) {
      toast({
        title: mensagens.erroGenerico,
        description: getErrorMessage(err, mensagens.erroGenerico),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    verificarEmail,
    requestPasswordReset,
    resetPassword,
    isLoading,
  };
};
