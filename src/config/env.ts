const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  defaultLang: import.meta.env.VITE_DEFAULT_LANGUAGE ?? 'pt',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL as string,
  dailyApiKey: import.meta.env.VITE_DAILY_API_KEY ?? '',
};

if (!env.apiUrl) throw new Error('VITE_API_URL não definido');

export default env;
