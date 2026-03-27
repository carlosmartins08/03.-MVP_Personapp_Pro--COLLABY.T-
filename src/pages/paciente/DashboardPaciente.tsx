import { AppHeader, Button, Card } from '@/design-system/components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useLocalizacao } from '@/contexts/LocalizacaoContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { PacienteApi, ResumoPacienteApi } from '@/types/api';

interface DashboardPacienteProps {
  allowLegacyHeader?: boolean;
}

export default function DashboardPaciente({ allowLegacyHeader = false }: DashboardPacienteProps) {
  const { idioma } = useLocalizacao();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [locale, setLocale] = useState(ptBR);

  useEffect(() => {
    setLocale(idioma === 'en' ? enUS : ptBR);
  }, [idioma]);

  const { data: paciente, isLoading: isPacienteLoading } = useQuery({
    queryKey: ['paciente-user', user?.id],
    queryFn: () =>
      user?.id ? api.get<PacienteApi>(`/pacientes/user/${user.id}`) : Promise.resolve(null),
    enabled: Boolean(user?.id),
  });

  const { data: resumo, isLoading: isResumoLoading } = useQuery({
    queryKey: ['paciente-resumo', paciente?.id],
    queryFn: () =>
      paciente?.id ? api.get<ResumoPacienteApi>(`/pacientes/${paciente.id}/resumo`) : Promise.resolve(null),
    enabled: Boolean(paciente?.id),
  });

  const isLoading = isPacienteLoading || isResumoLoading;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <p className="text-center text-muted-foreground">Carregando seu painel...</p>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="p-4 space-y-4 max-w-md mx-auto">
        <p className="text-center text-muted-foreground">
          Precisamos identificar sua conta para mostrar o painel.
        </p>
      </div>
    );
  }

  const ultimoDiario = resumo?.ultimoDiario;
  const ultimaSessao = resumo?.ultimaSessao;
  const ultimoAlerta = resumo?.ultimoAlerta;
  const proximaSessaoData = ultimaSessao?.data ? new Date(ultimaSessao.data) : null;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      {allowLegacyHeader ? (
        <h1 className="text-xl font-bold text-center">Bem-vindo, {paciente.nome}</h1>
      ) : (
        <AppHeader variant="patient" name={paciente.nome} />
      )}

      <Card variant="default" className="p-4">
        <h3 className="text-lg font-semibold">Último Diário</h3>
        <p className="text-sm text-muted-foreground">
          {ultimoDiario
            ? format(new Date(ultimoDiario.dataRegistro), 'PPP', { locale })
            : 'Nenhum registro recente'}
        </p>
        <p className="mt-2">{ultimoDiario?.texto ?? 'Abraçe o diário para contar como se sente.'}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Sentimento detectado:{' '}
          <strong>{ultimoDiario?.sentimento ?? 'Aguardando novas entradas'}</strong>
        </p>
      </Card>

      <Card variant="default" className="p-4">
        <h3 className="text-lg font-semibold">Próxima Sessão</h3>
        <p>
          {proximaSessaoData
            ? format(proximaSessaoData, 'PPPpp', { locale })
            : 'Nenhuma sessão agendada'}
          {' - '}
          <span className="capitalize">{ultimaSessao?.status ?? 'Sem status'}</span>
        </p>
        <Button className="mt-2 w-full" variant="secondary" onClick={() => navigate('/paciente/sessoes')}>
          Ver detalhes
        </Button>
      </Card>

      <Card variant="default" className="border-l-4 border-yellow-400 p-4">
        <h3 className="text-lg font-semibold">Alerta Clínico</h3>
        {ultimoAlerta ? (
          <>
            <p>
              Tipo: <strong>{ultimoAlerta.tipoAlerta}</strong>
            </p>
            <p>Descrição: {ultimoAlerta.descricao ?? 'Sem descrição'}</p>
            <p>
              Urgência: <strong>{ultimoAlerta.nivelUrgencia ?? 'Normal'}</strong>
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">Nenhum alerta ativo.</p>
        )}
      </Card>
    </div>
  );
}
