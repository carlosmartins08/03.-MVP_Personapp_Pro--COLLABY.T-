import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

// Auth Pages
import Login from "@/pages/Login";
import RecuperarSenha from "@/pages/RecuperarSenha";
import RedefinirSenha from "@/pages/RedefinirSenha";
import VerificarEmail from "@/pages/VerificarEmail";
import NotFound from "@/pages/NotFound";

// PersonApp Layouts
import PatientAppLayout from "@/layouts/PatientAppLayout";
import ProfessionalAppLayout from "@/layouts/ProfessionalAppLayout";

// PersonApp — Paciente
import PatientDashboard from "@/pages/personapp/patient/Dashboard";
import PatientMoodCheckIn from "@/pages/personapp/patient/MoodCheckIn";
import PatientAnamnesis from "@/pages/personapp/patient/Anamnesis";
import PatientProfessionalList from "@/pages/personapp/patient/ProfessionalList";
import PatientSchedule from "@/pages/personapp/patient/Schedule";
import PatientDiary from "@/pages/personapp/patient/Diary";
import PatientChat from "@/pages/personapp/patient/Chat";
import MeuPlano from "@/pages/personapp/patient/MeuPlano";
import PatientPagamentos from "@/pages/personapp/patient/Pagamentos";

// PersonApp — Profissional
import ProfessionalDashboard from "@/pages/personapp/professional/Dashboard";
import ProfessionalSchedule from "@/pages/personapp/professional/Schedule";
import ProfessionalPatientList from "@/pages/personapp/professional/PatientList";
import PlanoTratamento from "@/pages/personapp/professional/PlanoTratamento";
import ConsultationRoom from "@/pages/personapp/shared/ConsultationRoom";
import { Notificacoes } from "@/pages/personapp/shared/Notificacoes";

// Redirecionamento inteligente na raiz
const RootRedirect = () => {
  const { user, isLoadingUser } = useAuthContext();
  if (isLoadingUser) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.tipo === "profissional") return <Navigate to="/app/profissional/dashboard" replace />;
  return <Navigate to="/app/paciente/dashboard" replace />;
};

export const AppRoutes = () => (
  <Routes>
    {/* Públicas */}
    <Route path="/login" element={<Login />} />
    <Route path="/recuperar-senha" element={<RecuperarSenha />} />
    <Route path="/redefinir-senha" element={<RedefinirSenha />} />
    <Route path="/verificar-email" element={<VerificarEmail />} />

    {/* PersonApp — Paciente */}
    <Route path="/app/paciente" element={<PatientAppLayout />}>
      <Route path="dashboard" element={<PatientDashboard />} />
      <Route path="humor" element={<PatientMoodCheckIn />} />
      <Route path="anamnese" element={<PatientAnamnesis />} />
      <Route path="profissionais" element={<PatientProfessionalList />} />
      <Route path="agenda" element={<PatientSchedule />} />
      <Route path="consulta/:id" element={<ConsultationRoom />} />
      <Route path="meu-plano" element={<MeuPlano />} />
      <Route path="diario" element={<PatientDiary />} />
      <Route path="chat" element={<PatientChat />} />
      <Route path="pagamentos" element={<PatientPagamentos />} />
      <Route path="notificacoes" element={<Notificacoes />} />
    </Route>

    {/* PersonApp — Profissional */}
    <Route path="/app/profissional" element={<ProfessionalAppLayout />}>
      <Route path="dashboard" element={<ProfessionalDashboard />} />
      <Route path="agenda" element={<ProfessionalSchedule />} />
      <Route path="pacientes" element={<ProfessionalPatientList />} />
      <Route path="plano/:pacienteId" element={<PlanoTratamento />} />
      <Route path="sala/:id" element={<ConsultationRoom />} />
      <Route path="notificacoes" element={<Notificacoes />} />
    </Route>

    {/* Raiz inteligente */}
    <Route path="/" element={<RootRedirect />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
