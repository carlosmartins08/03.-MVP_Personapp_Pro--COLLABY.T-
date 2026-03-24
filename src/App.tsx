
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LocalizacaoProvider } from "@/contexts/LocalizacaoContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { LayoutProfissional } from "@/components/layout/LayoutProfissional";
import { LayoutPaciente } from "@/components/layout/LayoutPaciente";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

// Pages
import Login from "@/pages/Login";
import RecuperarSenha from "@/pages/RecuperarSenha";
import RedefinirSenha from "@/pages/RedefinirSenha";
import VerificarEmail from "@/pages/VerificarEmail";
import NotFound from "@/pages/NotFound";
import DashboardPrincipalPsicologo from "@/pages/DashboardPrincipalPsicologo";
import DashboardProfissional from "@/components/profissional/DashboardProfissional";
import DashboardFinanceiro from "@/components/profissional/DashboardFinanceiro";
import TelaPacientes from "@/pages/TelaPacientes";
import TelaPerfilPaciente from "@/pages/TelaPerfilPaciente";
import TelaEvolucaoPaciente from "@/pages/TelaEvolucaoPaciente";
import TelaAgendaSemanal from "@/pages/TelaAgendaSemanal";
import TelaSessoes from "@/pages/TelaSessoes";
import TelaSessaoDetalhada from "@/pages/TelaSessaoDetalhada";
import TelaServicos from "@/pages/TelaServicos";
import TelaFinanceiro from "@/pages/TelaFinanceiro";
import TelaAlertasClinicos from "@/pages/TelaAlertasClinicos";
import TelaConfigConta from "@/pages/TelaConfigConta";
import TelaComportamentoPaciente from "@/pages/TelaComportamentoPaciente";

// Patient Pages
import TelaResumoPaciente from "@/pages/paciente/TelaResumoPaciente";
import TelaSessoesPaciente from "@/pages/paciente/TelaSessoesPaciente";
import TelaDiarioPaciente from "@/pages/paciente/TelaDiarioPaciente";
import TelaPagamentosPaciente from "@/pages/paciente/TelaPagamentosPaciente";
import TelaRecibosPaciente from "@/pages/paciente/TelaRecibosPaciente";
import TelaPerfilPacienteAutenticado from "@/pages/paciente/TelaPerfilPacienteAutenticado";
import DashboardPacienteMobile from "@/components/paciente/DashboardPacienteMobile";

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocalizacaoProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                <Route path="/redefinir-senha" element={<RedefinirSenha />} />
                <Route path="/verificar-email" element={<VerificarEmail />} />
                
                {/* Professional Routes */}
                <Route path="/profissional" element={
                  <RouteGuard requiredUserType="profissional">
                    <LayoutProfissional />
                  </RouteGuard>
                }>
                  <Route path="dashboard" element={<DashboardProfissional />} />
                  <Route path="dashboard-financeiro" element={<DashboardFinanceiro />} />
                  <Route path="dashboard-alternativo" element={<DashboardPrincipalPsicologo />} />
                  <Route path="pacientes" element={<TelaPacientes />} />
                  <Route path="paciente/:id" element={<TelaPerfilPaciente />} />
                  <Route path="paciente/:id/evolucao" element={<TelaEvolucaoPaciente />} />
                  <Route path="comportamento" element={<TelaComportamentoPaciente />} />
                  <Route path="comportamento/:id" element={<TelaComportamentoPaciente />} />
                  <Route path="agenda" element={<TelaAgendaSemanal />} />
                  <Route path="sessoes" element={<TelaSessoes />} />
                  <Route path="sessao/:id" element={<TelaSessaoDetalhada />} />
                  <Route path="servicos" element={<TelaServicos />} />
                  <Route path="financeiro" element={<TelaFinanceiro />} />
                  <Route path="alertas" element={<TelaAlertasClinicos />} />
                  <Route path="configuracoes" element={<TelaConfigConta />} />
                </Route>

                {/* Patient Routes */}
                <Route path="/paciente" element={
                  <RouteGuard requiredUserType="paciente">
                    <LayoutPaciente />
                  </RouteGuard>
                }>
                  <Route path="dashboard" element={<DashboardPacienteMobile />} />
                  <Route path="dashboard-desktop" element={<TelaResumoPaciente />} />
                  <Route path="sessoes" element={<TelaSessoesPaciente />} />
                  <Route path="diario" element={<TelaDiarioPaciente />} />
                  <Route path="pagamentos" element={<TelaPagamentosPaciente />} />
                  <Route path="recibos" element={<TelaRecibosPaciente />} />
                  <Route path="perfil" element={<TelaPerfilPacienteAutenticado />} />
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </BrowserRouter>
              <InstallPrompt />
            </TooltipProvider>
          </LocalizacaoProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
