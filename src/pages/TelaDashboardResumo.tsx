
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import SessionsOverview from '@/components/dashboard/SessionsOverview';
import FinancialOverview from '@/components/dashboard/FinancialOverview';
import ClinicalAlerts from '@/components/dashboard/ClinicalAlerts';
import AlertaFaltasFrequentes from '@/components/home/AlertaFaltasFrequentes';
import { useDashboardData } from '@/hooks/useDashboardData';

const TelaDashboardResumo = () => {
  const dashboardData = useDashboardData();
  
  return (
    <div className="container pb-16">
      <PageHeader 
        title="Dashboard"
        subtitle="Visão geral da sua prática clínica"
      />
      
      <div className="px-4 space-y-6">
        <SessionsOverview 
          totalSessions={dashboardData.totalSessions}
          totalAbsences={dashboardData.totalAbsences}
          todaySessions={dashboardData.todaySessions}
          weeklyData={dashboardData.weeklySessionsData}
          isLoading={dashboardData.isLoading}
        />
        
        <FinancialOverview 
          totalReceived={dashboardData.totalReceived}
          totalPending={dashboardData.totalPending}
          averageSessionValue={dashboardData.averageSessionValue}
          isLoading={dashboardData.isLoading}
        />
        
        <ClinicalAlerts 
          patientsWithFrequentAbsences={dashboardData.patientsWithFrequentAbsences}
          newPatientsThisMonth={dashboardData.newPatientsThisMonth}
          patientsWithoutSessionFor30Days={dashboardData.patientsWithoutSessionFor30Days}
          isLoading={dashboardData.isLoading}
        />
        
        <AlertaFaltasFrequentes />
      </div>
    </div>
  );
};

export default TelaDashboardResumo;
