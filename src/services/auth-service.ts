import { api } from '@/lib/api';
import { clearAccessToken, saveAccessToken } from '@/lib/auth-storage';

export type AuthUser = {
  id: string;
  email: string;
  tipo: 'paciente' | 'profissional';
  emailVerificado?: boolean;
};

type SignUpPayload = {
  email: string;
  senha: string;
  tipo: 'paciente' | 'profissional';
};

type LoginPayload = {
  email: string;
  senha: string;
};

export const authService = {
  async signUp(payload: SignUpPayload) {
    await api.post('/auth/signup', payload, { auth: false });
  },

  async verifyEmail(token: string) {
    await api.post('/auth/verify-email', { token }, { auth: false });
  },

  async requestPasswordReset(email: string) {
    await api.post('/auth/request-reset', { email }, { auth: false });
  },

  async resetPassword(token: string, senha: string) {
    await api.post('/auth/reset', { token, senha }, { auth: false });
  },

  async login(payload: LoginPayload) {
    const data = await api.post<{ accessToken: string; user: AuthUser }>(
      '/auth/login',
      payload,
      { auth: false }
    );

    saveAccessToken(data.accessToken);
    return data.user;
  },

  async getCurrentUser() {
    return api.get<AuthUser>('/me');
  },

  logout() {
    clearAccessToken();
  },
};
