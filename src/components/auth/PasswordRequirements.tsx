
import { cn } from "@/lib/utils";

interface PasswordValidation {
  tamanho: boolean;
  minuscula: boolean;
  maiuscula: boolean;
  numero: boolean;
}

interface PasswordRequirementsProps {
  validacoes: PasswordValidation;
}

export function PasswordRequirements({ validacoes }: PasswordRequirementsProps) {
  const requirementClass = (met: boolean) => 
    cn("flex items-center gap-2", met ? "text-green-600" : "text-red-600");

  return (
    <div className="mt-2 text-sm space-y-1">
      <div className={requirementClass(validacoes.tamanho)}>
        <span>{validacoes.tamanho ? '✓' : '✗'}</span>
        <span>Pelo menos 15 caracteres</span>
      </div>
      <div className={requirementClass(validacoes.minuscula)}>
        <span>{validacoes.minuscula ? '✓' : '✗'}</span>
        <span>Uma letra minúscula</span>
      </div>
      <div className={requirementClass(validacoes.maiuscula)}>
        <span>{validacoes.maiuscula ? '✓' : '✗'}</span>
        <span>Uma letra maiúscula</span>
      </div>
      <div className={requirementClass(validacoes.numero)}>
        <span>{validacoes.numero ? '✓' : '✗'}</span>
        <span>Um número</span>
      </div>
    </div>
  );
}
