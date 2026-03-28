import { AuthForm } from '@/components/auth/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-neutral-50 font-roboto md:grid md:grid-cols-2">
      {/* Painel lateral — desktop */}
      <aside className="hidden md:flex flex-col justify-between bg-ds-primary text-white p-12">
        <div>
          <div className="text-3xl font-bold tracking-tight">PersonApp</div>
          <p className="mt-2 text-white/80 text-base">Saúde mental com acompanhamento humano</p>
        </div>
        <p className="text-sm text-white/60">Cuidar de você é o nosso propósito.</p>
      </aside>

      {/* Formulário */}
      <main className="flex flex-col items-center justify-center w-full p-6 md:p-8 min-h-screen md:min-h-0">
        {/* Header mobile — sempre visível */}
        <div className="md:hidden text-center mb-8">
          <div className="w-14 h-14 bg-ds-primary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-500">PersonApp</h1>
          <p className="text-sm text-neutral-300 mt-1">Saúde mental com acompanhamento humano</p>
        </div>

        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-neutral-500">Bem-vindo</h2>
            <p className="text-sm text-neutral-300 mt-1">Entre ou crie sua conta</p>
          </div>
          <AuthForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
