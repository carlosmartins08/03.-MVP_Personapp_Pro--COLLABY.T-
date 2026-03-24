import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AlertaClinico } from '@/types/queries';
import { api } from '@/lib/api';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#666',
    minHeight: 25,
    paddingVertical: 5,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    fontSize: 10,
    paddingHorizontal: 5,
    flex: 1,
  },
  observacoes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
});

interface AlertasPDFProps {
  pacienteId?: string;
  pacienteNome?: string;
  profissionalNome: string;
  dateRange: { from: Date; to: Date };
  observacoes: string;
}

const AlertasPDF: React.FC<AlertasPDFProps> = ({
  pacienteId,
  pacienteNome,
  profissionalNome,
  dateRange,
  observacoes,
}) => {
  const { data: alertas = [] } = useQuery({
    queryKey: ['alertas-clinicos', pacienteId, dateRange],
    queryFn: async () => {
      const data = await api.get<AlertaClinico[]>('/alertas', {
        query: {
          pacienteId: pacienteId || undefined,
          from: dateRange.from.toISOString(),
          to: dateRange.to.toISOString(),
        },
      });
      return data;
    },
  });

  const totalAlertas = alertas.length;
  const alertasRevisados = alertas.filter(a => a.status === 'visto').length;
  const alertasPendentes = alertas.filter(a => a.status === 'novo').length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Alertas Clínicos</Text>
          <Text style={styles.subtitle}>
            Paciente: {pacienteNome || 'Todos os pacientes'}
          </Text>
          <Text style={styles.subtitle}>
            Período: {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} a{' '}
            {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
          </Text>
          <Text style={styles.subtitle}>
            Profissional: {profissionalNome}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <Text>Total de alertas: {totalAlertas}</Text>
          <Text>Alertas revisados: {alertasRevisados}</Text>
          <Text>Alertas pendentes: {alertasPendentes}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhamento dos Alertas</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Data</Text>
              <Text style={styles.tableCell}>Tipo</Text>
              <Text style={styles.tableCell}>Termos</Text>
              <Text style={styles.tableCell}>Status</Text>
            </View>
            {alertas.map((alerta, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {format(new Date(alerta.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}
                </Text>
                <Text style={styles.tableCell}>
                  {alerta.tipo_alerta_principal === 'sentimento' ? 'Emocional' : 'Disfuncional'}
                </Text>
                <Text style={styles.tableCell}>
                  {alerta.termos_relacionados.join(', ')}
                </Text>
                <Text style={styles.tableCell}>
                  {alerta.status}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {observacoes && (
          <View style={styles.observacoes}>
            <Text style={styles.sectionTitle}>Observações do Profissional</Text>
            <Text>{observacoes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default AlertasPDF;
