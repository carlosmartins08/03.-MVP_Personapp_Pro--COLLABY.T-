import { useState } from "react";
import { Search } from "lucide-react";
import { AppHeader, Avatar, Badge, Card } from "@/design-system/components";
import { useProfessionalDashboard } from "@/hooks/personapp/useProfessionalDashboard";

function iniciais(nome: string) {
  return nome.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

const PatientListPage = () => {
  const [busca, setBusca] = useState("");
  const { recentPatients, isLoadingPatients } = useProfessionalDashboard();

  const pacientesFiltrados = recentPatients.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto font-roboto pb-24">
      <AppHeader variant="professional" title="Pacientes" name="Rafael" />

      <div className="px-4 mt-4">
        {/* Busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-200" />
          <input
            type="search"
            placeholder="Buscar paciente..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-2xl border border-neutral-100 bg-white text-sm text-neutral-500 placeholder:text-neutral-200 focus:outline-none focus:border-ds-primary"
          />
        </div>

        {isLoadingPatients ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-neutral-300">
              {busca ? "Nenhum paciente encontrado." : "Nenhum paciente vinculado ainda."}
            </p>
          </div>
        ) : (
          <Card className="divide-y divide-neutral-100">
            {pacientesFiltrados.map(paciente => (
              <div key={paciente.id} className="flex items-center gap-3 p-4">
                <Avatar
                  fallback={iniciais(paciente.nome)}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-500 truncate">{paciente.nome}</p>
                  <p className="text-xs text-neutral-300 truncate">{paciente.sessionLabel}</p>
                </div>
                <Badge variant={paciente.status.variant} size="sm">
                  {paciente.status.label}
                </Badge>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientListPage;
