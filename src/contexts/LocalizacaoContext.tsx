import React, { createContext, useState, useContext, useEffect } from 'react';
import { env } from '@/lib/env';
import { api } from '@/lib/api';
import { useAuthContext } from './AuthContext';

type Idioma = 'pt' | 'en';

interface TraducaoItem {
  chave: string;
  texto_pt: string;
  texto_en: string;
}

interface LocalizacaoContextType {
  idioma: Idioma;
  alterarIdioma: (novoIdioma: Idioma) => Promise<void>;
  getTexto: (chave: string) => string;
}

const LocalizacaoContext = createContext<LocalizacaoContextType>({
  idioma: env.DEFAULT_LANGUAGE || 'pt',
  alterarIdioma: async () => {},
  getTexto: () => '',
});

export const LocalizacaoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [idioma, setIdioma] = useState<Idioma>(env.DEFAULT_LANGUAGE || 'pt');
  const [traducoes, setTraducoes] = useState<Record<string, Record<Idioma, string>>>({});
  const { user, refreshUser } = useAuthContext();

  useEffect(() => {
    buscartraducoes();
  }, []);

  const buscartraducoes = async () => {
    try {
      const data = await api.get<TraducaoItem[]>('/traducoes', { auth: false });
      const traducoesMap = (data || []).reduce<Record<string, Record<Idioma, string>>>(
        (acc, traducao) => ({
          ...acc,
          [traducao.chave]: {
            pt: traducao.texto_pt,
            en: traducao.texto_en,
          },
        }),
        {}
      );
      setTraducoes(traducoesMap);
    } catch (error) {
      console.error('Erro ao buscar traduções:', error);
    }
  };

  const getTexto = (chave: string): string => {
    return traducoes[chave]?.[idioma] || chave;
  };

  const alterarIdioma = async (novoIdioma: Idioma) => {
    setIdioma(novoIdioma);
    if (!user) return;

    try {
      await api.patch(
        '/me/preferences',
        { idiomaPreferido: novoIdioma },
        { auth: true }
      );
      await refreshUser();
    } catch (error) {
      console.error('Erro ao atualizar idioma:', error);
    }
  };

  return (
    <LocalizacaoContext.Provider value={{ idioma, alterarIdioma, getTexto }}>
      {children}
    </LocalizacaoContext.Provider>
  );
};

export const useLocalizacao = () => useContext(LocalizacaoContext);
