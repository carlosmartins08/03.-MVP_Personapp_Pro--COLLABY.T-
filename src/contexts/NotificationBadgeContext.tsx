import { createContext, useContext, type ReactNode } from 'react';

type NotificationBadgeContextValue = {
  notificationCount: number;
  onNotificationPress: () => void;
};

const NotificationBadgeContext = createContext<NotificationBadgeContextValue | null>(null);

export const NotificationBadgeProvider = ({
  value,
  children,
}: {
  value: NotificationBadgeContextValue;
  children: ReactNode;
}) => {
  return (
    <NotificationBadgeContext.Provider value={value}>
      {children}
    </NotificationBadgeContext.Provider>
  );
};

export const useNotificationBadge = () => {
  return useContext(NotificationBadgeContext);
};
