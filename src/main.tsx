import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateEnv } from './lib/env';
import { AppErrorBoundary, ErrorScreen } from './components/system/AppErrorBoundary';

// Ensure we're getting the root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

if (!validateEnv()) {
  console.error('Missing required environment variables. Check .env.local.');
  root.render(
    <ErrorScreen
      title="Variaveis de ambiente ausentes"
      message="A aplicacao precisa do arquivo .env.local com VITE_API_URL configurada."
      hint="Exemplo:\nVITE_API_URL=http://localhost:4000\nVITE_FRONTEND_URL=http://localhost:8080\nVITE_EMAIL_VERIFICATION_REDIRECT_URL=http://localhost:8080/verificar-email"
    />
  );
} else {
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.ts')
        .then((registration) => {
          console.log('SW registered:', registration);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    });
  }

  root.render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}
