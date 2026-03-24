import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Paciente, Sessao } from '@/types';

interface SessaoExtendida extends Sessao {
  scoreClinico?: number;
  temasClinicos?: string[];
  duracaoMinutos?: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    marginBottom: 5,
  },
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
});

interface EvolucaoPDFProps {
  paciente: Paciente;
  sessoes: SessaoExtendida[];
  periodo: {
    inicio: Date;
    fim: Date;
  };
  profissionalNome: string;
}

const EvolucaoPDF: React.FC<EvolucaoPDFProps> = ({ paciente, sessoes, periodo, profissionalNome }) => {
  const sessoesRealizadas = sessoes.filter((s) => s.status === 'realizada');
  const faltas = sessoes.filter((s) => s.status === 'faltou');
  const taxaComparecimento = sessoes.length ? (sessoesRealizadas.length / sessoes.length) * 100 : 0;

  const getStatusEngajamento = () => {
    if (taxaComparecimento >= 80) return 'Engajado';
    if (taxaComparecimento >= 60) return 'Regular';
    return 'Em risco';
  };

  const calcularTendencia = () => {
    if (sessoesRealizadas.length < 2) return 'Dados insuficientes para analise';

    const scores = sessoesRealizadas
      .map((s) => s.scoreClinico)
      .filter((score) => score !== null && score !== undefined) as number[];

    if (scores.length < 2) return 'Dados insuficientes para analise';

    const metade = Math.ceil(scores.length / 2);
    const primeirosScores = scores.slice(0, metade);
    const ultimosScores = scores.slice(metade);

    const mediaPrimeiros = primeirosScores.reduce((acc, val) => acc + val, 0) / primeirosScores.length;
    const mediaUltimos = ultimosScores.reduce((acc, val) => acc + val, 0) / ultimosScores.length;

    if (mediaUltimos > mediaPrimeiros + 1) return 'melhora';
    if (mediaUltimos < mediaPrimeiros - 1) return 'regressao';
    return 'estagnacao';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatorio de Evolucao</Text>
          <Text style={styles.subtitle}>Paciente: {paciente.nome}</Text>
          <Text style={styles.text}>ID: {paciente.id}</Text>
          <Text style={styles.text}>
            Periodo: {format(periodo.inicio, 'dd/MM/yyyy')} a {format(periodo.fim, 'dd/MM/yyyy')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo Geral</Text>
          <Text style={styles.text}>Status atual: {getStatusEngajamento()}</Text>
          <Text style={styles.text}>Total de sessoes: {sessoesRealizadas.length}</Text>
          <Text style={styles.text}>Total de faltas: {faltas.length}</Text>
          <Text style={styles.text}>Taxa de comparecimento: {taxaComparecimento.toFixed(1)}%</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evolucao do Score Clinico</Text>
          <Text style={styles.text}>Tendencia observada: {calcularTendencia()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temas Abordados</Text>
          {Object.entries(
            sessoesRealizadas
              .flatMap((s) => s.temasClinicos || [])
              .reduce((acc, tema) => {
                acc[tema] = (acc[tema] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
          )
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([tema, count], index) => (
              <Text key={index} style={styles.text}>
                {tema}: {count} registros
              </Text>
            ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ritmo e Frequencia</Text>
          <Text style={styles.text}>
            Media de duracao:{' '}
            {Math.round(
              sessoesRealizadas.reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0) /
                (sessoesRealizadas.length || 1)
            )}{' '}
            minutos
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.text}>
            Gerado em: {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
          <Text style={styles.text}>Profissional: {profissionalNome}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default EvolucaoPDF;
