import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminId: string | null;
  setAdminId: (value: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  setIsAdmin: () => {},
  adminId: null,
  setAdminId: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(true); // Debug uchun true qilib qo'ydik
  const [adminId, setAdminId] = useState<string | null>(null);

  // Telegram Mini App dan admin ID ni olish
  useEffect(() => {
    console.log('Telegram WebApp:', window.Telegram?.WebApp);
    console.log('isAdmin:', isAdmin);
    
    if (window.Telegram?.WebApp) {
      const initData = window.Telegram.WebApp.initData;
      console.log('InitData:', initData);
      
      if (initData) {
        try {
          const initDataObj = Object.fromEntries(new URLSearchParams(initData));
          console.log('InitDataObj:', initDataObj);
          
          if (initDataObj.user) {
            const user = JSON.parse(initDataObj.user);
            console.log('User:', user);
            
            // Admin ID ni tekshirish (buni o'zingizning admin ID ingizga almashtiring)
            const adminIds = ["5418681798"]; // Admin ID larni massiv sifatida saqlash
            console.log('Checking admin ID:', user.id, 'against:', adminIds);
            
            if (adminIds.includes(user.id.toString())) {
              console.log('Admin access granted');
              setIsAdmin(true);
              setAdminId(user.id.toString());
            }
          }
        } catch (error) {
          console.error('Error parsing Telegram initData:', error);
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, setIsAdmin, adminId, setAdminId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 