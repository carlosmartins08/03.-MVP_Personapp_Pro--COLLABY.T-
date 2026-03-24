
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DEFAULT_LANGUAGE?: 'pt' | 'en';
  readonly VITE_FRONTEND_URL?: string;
  readonly VITE_EMAIL_VERIFICATION_REDIRECT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
