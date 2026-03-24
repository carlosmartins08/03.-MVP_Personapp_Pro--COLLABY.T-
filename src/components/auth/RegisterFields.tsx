
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserType } from '@/hooks/useAuth';

interface RegisterFieldsProps {
  nome: string;
  setNome: (value: string) => void;
  especialidade: string;
  setEspecialidade: (value: string) => void;
  tipoUsuario: UserType;
  setTipoUsuario: (value: UserType) => void;
}

export const RegisterFields = ({
  nome,
  setNome,
  especialidade,
  setEspecialidade,
  tipoUsuario,
  setTipoUsuario,
}: RegisterFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="nome">Nome completo</Label>
        <Input 
          id="nome"
          type="text" 
          placeholder="Seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="persona-input"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="especialidade">Especialidade</Label>
        <Input 
          id="especialidade"
          type="text" 
          placeholder="Psicologia, Psiquiatria, etc."
          value={especialidade}
          onChange={(e) => setEspecialidade(e.target.value)}
          required
          className="persona-input"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipoUsuario">Tipo de Usuário</Label>
        <select
          id="tipoUsuario"
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value as UserType)}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-base"
        >
          <option value="paciente">Paciente</option>
          <option value="profissional">Profissional</option>
        </select>
      </div>
    </>
  );
};
