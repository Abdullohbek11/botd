import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  checkIsAdmin: () => boolean;
}

const ADMIN_ID = "5812191024";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkAdmin = () => {
      const tg = window.Telegram.WebApp;
      const userId = tg.initDataUnsafe?.user?.id?.toString();
      setIsAdmin(userId === ADMIN_ID);
    };

    checkAdmin();
  }, []);

  const checkIsAdmin = () => {
    const tg = window.Telegram.WebApp;
    const userId = tg.initDataUnsafe?.user?.id?.toString();
    return userId === ADMIN_ID;
  };

  return (
    <AdminContext.Provider value={{ isAdmin, checkIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
} 