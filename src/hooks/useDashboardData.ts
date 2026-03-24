
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface DashboardSummaryData {
  // Sessions data
  totalSessions: number;
  totalAbsences: number;
  todaySessions: number;
  weeklySessionsData: Array<{
    name: string;
    total: number;
  }>;
  
  // Financial data
  totalReceived: number;
  totalPending: number;
  averageSessionValue: number;
  
  // Clinical alerts
  patientsWithFrequentAbsences: number;
  newPatientsThisMonth: number;
  patientsWithoutSessionFor30Days: number;
  
  isLoading: boolean;
  error: Error | null;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardSummaryData>({
    totalSessions: 0,
    totalAbsences: 0,
    todaySessions: 0,
    weeklySessionsData: [],
    totalReceived: 0,
    totalPending: 0,
    averageSessionValue: 0,
    patientsWithFrequentAbsences: 0,
    newPatientsThisMonth: 0,
    patientsWithoutSessionFor30Days: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardData = await api.get<Omit<DashboardSummaryData, 'isLoading' | 'error'>>(
          '/analytics/dashboard'
        );

        setData(prev => ({
          ...prev,
          ...dashboardData,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));
      }
    };

    fetchDashboardData();
  }, []);

  return data;
};
