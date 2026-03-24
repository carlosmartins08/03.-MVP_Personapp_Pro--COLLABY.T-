
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Paciente, Sessao } from '@/types';

interface PatientComparisonProps {
  patients: Array<{
    patient: Paciente;
    sessions: Sessao[];
    color: string;
  }>;
}

const PatientComparison: React.FC<PatientComparisonProps> = ({ patients }) => {
  const calculateStats = (sessions: Sessao[]) => {
    const completed = sessions.filter(s => s.status === 'realizada');
    const absences = sessions.filter(s => s.status === 'faltou');
    const totalPaid = sessions.reduce((acc, s) => s.statusPagamento === 'pago' ? acc + s.valor : acc, 0);
    const totalPending = sessions.reduce((acc, s) => s.statusPagamento === 'pendente' ? acc + s.valor : acc, 0);
    
    const dates = completed
      .map(s => new Date(s.data))
      .sort((a, b) => a.getTime() - b.getTime());
    
    const intervals = dates.slice(1).map((date, i) => 
      Math.floor((date.getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24))
    );
    
    const avgInterval = intervals.length 
      ? intervals.reduce((a, b) => a + b, 0) / intervals.length 
      : 0;

    return {
      totalSessions: completed.length,
      totalAbsences: absences.length,
      adherenceRate: completed.length 
        ? (completed.length / (completed.length + absences.length) * 100).toFixed(1)
        : '0',
      totalPaid,
      totalPending,
      avgDaysBetweenSessions: Math.round(avgInterval),
      lastSession: dates[dates.length - 1] || null
    };
  };

  return (
    <div className="grid gap-6">
      {/* Sessões e Faltas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sessões e Faltas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patients.map(({ patient, sessions, color }) => {
              const stats = calculateStats(sessions);
              return (
                <div
                  key={patient.id}
                  className="space-y-4 p-4 rounded-lg"
                  style={{ backgroundColor: `${color}10` }}
                >
                  <h3 className="font-semibold text-lg">{patient.nome}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Sessões</span>
                      <span className="font-medium">{stats.totalSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Faltas</span>
                      <span className="font-medium">{stats.totalAbsences}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Adesão</span>
                      <span className="font-medium">{stats.adherenceRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patients.map(({ patient, sessions, color }) => {
              const stats = calculateStats(sessions);
              return (
                <div
                  key={patient.id}
                  className="space-y-4 p-4 rounded-lg"
                  style={{ backgroundColor: `${color}10` }}
                >
                  <h3 className="font-semibold text-lg">{patient.nome}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Pago</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(stats.totalPaid)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Pendente</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(stats.totalPending)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Frequência */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Intervalos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {patients.map(({ patient, sessions, color }) => {
              const stats = calculateStats(sessions);
              return (
                <div
                  key={patient.id}
                  className="space-y-4 p-4 rounded-lg"
                  style={{ backgroundColor: `${color}10` }}
                >
                  <h3 className="font-semibold text-lg">{patient.nome}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Média entre sessões</span>
                      <span className="font-medium">{stats.avgDaysBetweenSessions} dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Última sessão</span>
                      <span className="font-medium">
                        {stats.lastSession 
                          ? format(stats.lastSession, "dd/MM/yyyy", { locale: ptBR })
                          : "Sem sessões"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientComparison;
