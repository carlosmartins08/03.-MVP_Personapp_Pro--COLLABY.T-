
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Paciente, Sessao } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProntuarioPDFProps {
  paciente: Paciente;
  sessoes: Sessao[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  info: {
    marginBottom: 5,
  },
  monthGroup: {
    marginTop: 20,
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  session: {
    marginBottom: 15,
    paddingLeft: 15,
    borderLeft: '1pt solid #ccc',
  },
  sessionDate: {
    fontSize: 14,
    marginBottom: 5,
  },
  sessionStatus: {
    color: '#666',
    marginBottom: 5,
  },
  notes: {
    marginTop: 5,
    color: '#444',
    fontSize: 11,
  },
});

const ProntuarioPDF = ({ paciente, sessoes }: ProntuarioPDFProps) => {
  // Agrupar sessões por mês
  const sessoesPorMes = sessoes.reduce<{ [key: string]: Sessao[] }>((acc, sessao) => {
    const mesAno = format(new Date(sessao.data), 'MMMM yyyy', { locale: ptBR });
    if (!acc[mesAno]) acc[mesAno] = [];
    acc[mesAno].push(sessao);
    return acc;
  }, {});

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Prontuário do Paciente</Text>
          <Text style={styles.info}>Nome: {paciente.nome}</Text>
          <Text style={styles.info}>
            Data de Nascimento: {format(new Date(paciente.dataNascimento), 'dd/MM/yyyy')}
          </Text>
        </View>

        {Object.entries(sessoesPorMes).map(([mesAno, sessoesDoMes]) => (
          <View key={mesAno} style={styles.monthGroup}>
            <Text style={styles.monthTitle}>{mesAno}</Text>
            
            {sessoesDoMes.map((sessao) => (
              <View key={sessao.id} style={styles.session}>
                <Text style={styles.sessionDate}>
                  {format(new Date(sessao.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </Text>
                <Text style={styles.sessionStatus}>
                  Status: {sessao.status.charAt(0).toUpperCase() + sessao.status.slice(1)}
                  {sessao.valor > 0 && ` - Valor: R$ ${sessao.valor.toFixed(2)}`}
                </Text>
                <Text style={styles.notes}>
                  {sessao.anotacoes || "Sem anotações clínicas registradas."}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default ProntuarioPDF;
