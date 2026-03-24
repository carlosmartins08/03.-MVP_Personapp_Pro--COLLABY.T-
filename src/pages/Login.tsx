
import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-menta-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lavanda-dark mb-2">PersonaClinic</h1>
          <p className="text-muted-foreground">Gestão completa para profissionais de saúde mental</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
