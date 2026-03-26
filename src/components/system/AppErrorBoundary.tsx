import React from 'react';

type ErrorScreenProps = {
  title: string;
  message: string;
  hint?: string;
};

export const ErrorScreen = ({ title, message, hint }: ErrorScreenProps) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#F5F7FA',
      color: '#1A1A1A',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    }}
  >
    <div
      style={{
        maxWidth: '640px',
        width: '100%',
        background: '#FFFFFF',
        border: '1px solid #EAEDF2',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
      }}
    >
      <h1 style={{ fontSize: '20px', marginBottom: '12px' }}>{title}</h1>
      <p style={{ marginBottom: '12px', lineHeight: 1.5 }}>{message}</p>
      {hint && (
        <pre
          style={{
            background: '#F5F7FA',
            padding: '12px',
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '12px',
          }}
        >
          {hint}
        </pre>
      )}
    </div>
  </div>
);

type AppErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  AppErrorBoundaryState
> {
  public state: AppErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    console.error('App crashed:', error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          title="Algo deu errado"
          message="O app encontrou um erro inesperado. Verifique o console para detalhes."
          hint="Se o problema persistir, confirme o .env.local e reinicie o dev server."
        />
      );
    }

    return this.props.children;
  }
}
