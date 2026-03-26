import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-2">
      <aside className="hidden lg:flex flex-col justify-between bg-ds-primary text-white p-12">
        <div>
          <div className="text-3xl font-bold">PersonApp</div>
          <p className="mt-2 text-white/80">Saude mental com acompanhamento humano</p>
        </div>
        <p className="text-sm text-white/60">Gestao completa para profissionais de saude mental</p>
      </aside>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Bem-vindo</h1>
            <p className="text-sm text-gray-500">Entre ou crie sua conta</p>
          </div>
          <AuthForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
