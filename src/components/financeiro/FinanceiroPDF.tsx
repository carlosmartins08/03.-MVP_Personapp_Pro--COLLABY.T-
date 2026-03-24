
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  summary: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  chargeItem: {
    marginBottom: 10,
    padding: 10,
    borderBottom: '1 solid #eee',
  },
  text: {
    marginBottom: 5,
  },
});

interface FinanceiroPDFProps {
  financialData: any[];
  summary: {
    total_received: number;
    total_pending: number;
  };
  period: string;
}

const FinanceiroPDF = ({ financialData, summary, period }: FinanceiroPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Relatório Financeiro - {format(new Date(), 'MMMM/yyyy', { locale: ptBR })}
        </Text>
        <Text>Período: {period}</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.text}>Total Recebido: R$ {summary.total_received}</Text>
        <Text style={styles.text}>Total Pendente: R$ {summary.total_pending}</Text>
      </View>

      {financialData.map((charge, index) => (
        <View key={index} style={styles.chargeItem}>
          <Text style={styles.text}>Paciente: {charge.paciente}</Text>
          <Text style={styles.text}>Valor: R$ {charge.valor}</Text>
          <Text style={styles.text}>Status: {charge.status}</Text>
          <Text style={styles.text}>
            Data: {format(new Date(charge.data), 'dd/MM/yyyy', { locale: ptBR })}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default FinanceiroPDF;
