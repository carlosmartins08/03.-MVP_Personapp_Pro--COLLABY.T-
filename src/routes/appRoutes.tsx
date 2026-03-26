import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { LayoutProfissional } from "@/components/layout/LayoutProfissional";
import { LayoutPaciente } from "@/components/layout/LayoutPaciente";

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
import PatientAppLayout from "@/layouts/PatientAppLayout";
import ProfessionalAppLayout from "@/layouts/ProfessionalAppLayout";

// Patient Pages
import TelaResumoPaciente from "@/pages/paciente/TelaResumoPaciente";
import TelaSessoesPaciente from "@/pages/paciente/TelaSessoesPaciente";
import TelaDiarioPaciente from "@/pages/paciente/TelaDiarioPaciente";
import TelaPagamentosPaciente from "@/pages/paciente/TelaPagamentosPaciente";
import TelaRecibosPaciente from "@/pages/paciente/TelaRecibosPaciente";
import TelaPerfilPacienteAutenticado from "@/pages/paciente/TelaPerfilPacienteAutenticado";
import DashboardPacienteMobile from "@/components/paciente/DashboardPacienteMobile";
import PatientDashboard from "@/pages/personapp/patient/Dashboard";
import PatientMoodCheckIn from "@/pages/personapp/patient/MoodCheckIn";
import PatientAnamnesis from "@/pages/personapp/patient/Anamnesis";
import PatientProfessionalList from "@/pages/personapp/patient/ProfessionalList";
import PatientSchedule from "@/pages/personapp/patient/Schedule";
import PatientDiary from "@/pages/personapp/patient/Diary";
import PatientChat from "@/pages/personapp/patient/Chat";
import ProfessionalDashboard from "@/pages/personapp/professional/Dashboard";
import ProfessionalSchedule from "@/pages/personapp/professional/Schedule";
import ProfessionalPatientList from "@/pages/personapp/professional/PatientList";
import ConsultationRoom from "@/pages/personapp/shared/ConsultationRoom";

export const appRouteElements = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/recuperar-senha" element={<RecuperarSenha />} />
    <Route path="/redefinir-senha" element={<RedefinirSenha />} />
    <Route path="/verificar-email" element={<VerificarEmail />} />

    {/* Professional Routes */}
    <Route
      path="/profissional"
      element={
        <RouteGuard requiredUserType="profissional">
          <LayoutProfissional />
        </RouteGuard>
      }
    >
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
    <Route
      path="/paciente"
      element={
        <RouteGuard requiredUserType="paciente">
          <LayoutPaciente />
        </RouteGuard>
      }
    >
      <Route path="dashboard" element={<DashboardPacienteMobile />} />
      <Route path="dashboard-desktop" element={<TelaResumoPaciente />} />
      <Route path="sessoes" element={<TelaSessoesPaciente />} />
      <Route path="diario" element={<TelaDiarioPaciente />} />
      <Route path="pagamentos" element={<TelaPagamentosPaciente />} />
      <Route path="recibos" element={<TelaRecibosPaciente />} />
      <Route path="perfil" element={<TelaPerfilPacienteAutenticado />} />
    </Route>

    {/* PersonApp Routes - Patient */}
    <Route
      path="/app/paciente"
      element={
        <RouteGuard requiredUserType="paciente">
          <PatientAppLayout />
        </RouteGuard>
      }
    >
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="humor" element={<PatientMoodCheckIn />} />
      <Route path="anamnese" element={<PatientAnamnesis />} />
      <Route path="profissionais" element={<PatientProfessionalList />} />
      <Route path="agenda" element={<PatientSchedule />} />
      <Route path="diario" element={<PatientDiary />} />
      <Route path="chat" element={<PatientChat />} />
    </Route>

    {/* PersonApp Routes - Professional */}
    <Route
      path="/app/profissional"
      element={
        <RouteGuard requiredUserType="profissional">
          <ProfessionalAppLayout />
        </RouteGuard>
      }
    >
      <Route path="dashboard" element={<ProfessionalDashboard />} />
      <Route path="agenda" element={<ProfessionalSchedule />} />
      <Route path="pacientes" element={<ProfessionalPatientList />} />
      <Route path="sala/:id" element={<ConsultationRoom />} />
    </Route>

    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<NotFound />} />
  </>
);

export const AppRoutes = () => <Routes>{appRouteElements}</Routes>;
