
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  hideNav?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ hideNav = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-16 animate-fade-in">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default AppLayout;
