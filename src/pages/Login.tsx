import { AuthForm } from "@/components/auth/AuthForm"
import { DotGrid, LineAbstract, ShapeBlob } from "@/design-system/decorations"

const Login = () => {
  return (
    <div className="min-h-screen flex font-manrope">
      <aside className="hidden md:flex md:w-1/2 relative overflow-hidden bg-ds-primary flex-col justify-between p-10">
        <ShapeBlob
          color="currentColor"
          size={300}
          opacity={0.06}
          className="absolute -top-16 -right-16 pointer-events-none text-white"
        />
        <ShapeBlob
          color="currentColor"
          size={200}
          opacity={0.04}
          className="absolute -bottom-10 -left-10 pointer-events-none text-white"
        />
        <DotGrid
          color="currentColor"
          opacity={0.07}
          cols={8}
          rows={6}
          className="absolute bottom-10 right-10 pointer-events-none text-white"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-sora font-bold text-lg">P</span>
            </div>
            <span className="text-white font-sora font-semibold text-lg">PersonApp</span>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 font-manrope text-sm uppercase tracking-wider mb-4">
            Plataforma de telepsicologia
          </p>
          <h1 className="text-white font-sora font-bold text-4xl leading-tight">
            Saude mental com acompanhamento humano
          </h1>
          <p className="text-white/70 font-manrope text-base mt-4 leading-relaxed max-w-sm">
            Conectamos pacientes a profissionais de psicologia de forma segura,
            acolhedora e personalizada.
          </p>
        </div>

        <div className="relative z-10">
          <LineAbstract color="currentColor" opacity={0.2} className="mb-4 text-white" />
          <p className="text-white/40 font-manrope text-xs">
            Gestao completa para profissionais de saude mental
          </p>
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center bg-ds-surface-page p-6 md:p-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-ds-primary mx-auto mb-4 flex items-center justify-center shadow-ds-md">
              <span className="text-white font-sora font-bold text-xl">P</span>
            </div>
            <h1 className="text-2xl font-sora font-bold text-neutral-400">PersonApp</h1>
            <p className="text-sm font-manrope text-neutral-300 mt-1">
              Saude mental com acompanhamento humano
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 md:p-8 border border-neutral-100 shadow-ds-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-sora font-bold text-neutral-400">Bem-vindo</h2>
              <p className="text-sm font-manrope text-neutral-300 mt-1">Entre ou crie sua conta</p>
            </div>
            <AuthForm />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
