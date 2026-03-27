## Problemas Visuais Encontrados

### Cores hardcoded (fora dos tokens)
- `src/components/icons/GoogleIcon.tsx:12` fill `#4285f4`
- `src/components/icons/GoogleIcon.tsx:13` fill `#34a853`
- `src/components/icons/GoogleIcon.tsx:14` fill `#fbbc05`
- `src/components/icons/GoogleIcon.tsx:15` fill `#ea4335`
- `src/components/home/AlertaFaltasFrequentes.tsx:34` class `bg-[#FEF7CD]`
- `src/components/comportamento/ScoreEmocional.tsx:121` stroke `#888`
- `src/components/comportamento/ScoreEmocional.tsx:125` stroke `#3b82f6`
- `src/components/alertas/AlertasPDF.tsx:18` borderBottomColor `#666`
- `src/components/alertas/AlertasPDF.tsx:27` color `#666`
- `src/components/alertas/AlertasPDF.tsx:41` borderColor `#666`
- `src/components/alertas/AlertasPDF.tsx:46` borderBottomColor `#666`
- `src/components/alertas/AlertasPDF.tsx:51` backgroundColor `#f0f0f0`
- `src/components/alertas/AlertasPDF.tsx:62` backgroundColor `#f9f9f9`
- `src/components/dashboard/ClinicalAlerts.tsx:32` class `bg-[#FEF7CD]`
- `src/components/dashboard/ClinicalAlerts.tsx:52` class `bg-[#F2FCE2]`
- `src/components/dashboard/ClinicalAlerts.tsx:72` class `bg-[#F1F0FB]`
- `src/components/dashboard/FinancialOverview.tsx:32` class `bg-[#F2FCE2]`
- `src/components/dashboard/FinancialOverview.tsx:38` class `bg-[#F1F0FB]`
- `src/components/dashboard/FinancialOverview.tsx:44` class `bg-[#F8F9FA]`
- `src/components/system/AppErrorBoundary.tsx:17` background `#F5F7FA`
- `src/components/system/AppErrorBoundary.tsx:18` color `#1A1A1A`
- `src/components/system/AppErrorBoundary.tsx:26` background `#FFFFFF`
- `src/components/system/AppErrorBoundary.tsx:27` border `#EAEDF2`
- `src/components/system/AppErrorBoundary.tsx:38` background `#F5F7FA`
- `src/components/financeiro/FinanceiroPDF.tsx:23` backgroundColor `#f8f8f8`
- `src/components/financeiro/FinanceiroPDF.tsx:28` borderBottom `#eee`
- `src/components/previsao-agenda/OcupacaoFuturaPanel.tsx:52` light `#9b87f5`
- `src/components/previsao-agenda/OcupacaoFuturaPanel.tsx:53` dark `#9b87f5`
- `src/components/previsao-agenda/OcupacaoFuturaPanel.tsx:64` fill `#9b87f5`
- `src/components/paciente/ScoreClinicoChart.tsx:88` stroke `#888`
- `src/components/prontuario/ProntuarioPDF.tsx:36` color `#666`
- `src/components/prontuario/ProntuarioPDF.tsx:41` borderLeft `#ccc`
- `src/components/prontuario/ProntuarioPDF.tsx:48` color `#666`
- `src/components/prontuario/ProntuarioPDF.tsx:53` color `#444`
- `src/components/evolucao/EvolucaoPDF.tsx:27` color `#666`
- `src/components/evolucao/EvolucaoPDF.tsx:33` backgroundColor `#f8f8f8`
- `src/components/evolucao/EvolucaoPDF.tsx:46` borderTopColor `#ccc`
- `src/components/dashboard/SessionsOverview.tsx:48` class `bg-[#F1F0FB]`
- `src/components/dashboard/SessionsOverview.tsx:52` class `bg-[#FEF7CD]`
- `src/components/dashboard/SessionsOverview.tsx:56` class `bg-[#F2FCE2]`

### Componentes shadcn ainda em uso nas telas
- `src/pages/DashboardPrincipalPsicologo.tsx`: Tabs, TabsContent, TabsList, TabsTrigger, PageHeader -> substituir por equivalentes do DS.
- `src/pages/RecuperarSenha.tsx`: Button, Input -> substituir por DS Button/Input.
- `src/pages/paciente/TelaSessoesPaciente.tsx`: PageHeader, Card, CardContent -> substituir por DS.
- `src/pages/TelaEvolucaoPaciente.tsx`: PageHeader, Card*, Avatar*, Badge, Progress, EmptyState -> substituir por DS.
- `src/pages/TelaCadastroPaciente.tsx`: Textarea, Select*, Label, PageHeader, toast -> substituir por DS.
- `src/pages/DashboardProfissional.tsx`: Skeleton -> substituir por DS.
- `src/pages/TelaPrevisaoAgendaClinica.tsx`: Tabs*, PageHeader -> substituir por DS.
- `src/pages/paciente/TelaDashboardPaciente.tsx`: PageHeader -> substituir por DS.
- `src/pages/TelaPerfilPaciente.tsx`: Tabs*, PageHeader, EmptyState -> substituir por DS.
- `src/pages/paciente/TelaResumoPaciente.tsx`: PageHeader -> substituir por DS.
- `src/pages/TelaInicialProfissional.tsx`: Card*, Button, PageHeader -> substituir por DS.
- `src/pages/TelaPerfilProfissional.tsx`: Button, Input, Card*, Label, Tabs*, PageHeader, toast, Switch -> substituir por DS.
- `src/pages/TelaInsightsPaciente.tsx`: Button, Card*, PageHeader, ChartContainer, ChartTooltip -> substituir por DS.

### Tipografia
- Roboto aplicada: NAO.
- Definicao encontrada em `src/index.css:97` e `tailwind.config.ts:93`, mas sem uso de classes de fonte em `src/pages/personapp`.

### Responsividade
- Classes responsivas em PersonApp: 2 ocorrencias.
- Uso de `absolute`/`overflow-hidden` em `src/pages/personapp/shared/ConsultationRoom.tsx:107-115`.
- Uso de `absolute` em `src/pages/personapp/patient/ProfessionalList.tsx:97`.
- Layouts tem padding mobile em `src/layouts/PatientAppLayout.tsx:17` e `src/layouts/ProfessionalAppLayout.tsx:17`.

### Telas PersonApp sem DS completo
- Sem AppHeader: `src/pages/personapp/professional/Schedule.tsx`
- Sem AppHeader: `src/pages/personapp/professional/PatientList.tsx`
- Sem AppHeader: `src/pages/personapp/patient/Schedule.tsx`
- Sem AppHeader: `src/pages/personapp/patient/Diary.tsx`
- Sem AppHeader: `src/pages/personapp/patient/Chat.tsx`
- Sem AppHeader: `src/pages/personapp/patient/Dashboard.tsx`
- Sem AppHeader: `src/pages/personapp/patient/Anamnesis.tsx`
- Sem AppHeader: `src/pages/personapp/patient/MoodCheckIn.tsx`
- Sem import de DS (Button/Card/Input): `src/pages/personapp/professional/Schedule.tsx`
- Sem import de DS (Button/Card/Input): `src/pages/personapp/professional/PatientList.tsx`
- Sem import de DS (Button/Card/Input): `src/pages/personapp/patient/Schedule.tsx`
- Sem import de DS (Button/Card/Input): `src/pages/personapp/patient/Diary.tsx`
- Sem import de DS (Button/Card/Input): `src/pages/personapp/patient/Chat.tsx`

### Layouts
- PatientAppLayout tem SOSButton: SIM (`src/layouts/PatientAppLayout.tsx`)
- ProfessionalAppLayout tem BottomNav: SIM (`src/layouts/ProfessionalAppLayout.tsx`)
- Ambos possuem Outlet do `react-router-dom`.

## Prioridade de correcao

CRITICO:
- Nenhum bloqueio visual grave identificado so pelos greps.

ALTO:
- Cores hardcoded em componentes principais de dashboard e PDFs (foge do DS).
- Telas em `src/pages` ainda usando shadcn (inconsistencia visual).
- Falta de AppHeader em 8 telas PersonApp.

MEDIO:
- Baixissima presenca de classes responsivas (apenas 2 ocorrencias).
- Uso recorrente de `absolute`/`overflow-hidden` em layouts criticos.

## Missoes recomendadas em ordem
1. Substituir cores hardcoded por tokens DS (comecar por `src/components/dashboard/*` e `src/components/system/AppErrorBoundary.tsx`).
2. Migrar telas de `src/pages/*` do shadcn para componentes do DS PersonApp.
3. Padronizar AppHeader e responsividade nas telas PersonApp sem DS (Schedule, PatientList, Chat, Diary, etc).
