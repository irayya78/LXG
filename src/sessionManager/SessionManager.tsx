// src/session/SessionManager.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserSessionDetails } from '../apiHelper/userApi';

interface SessionManagerContextType {
  user: UserSessionDetails | null;
  setUserSession: (user: UserSessionDetails) => void;
  clearUserSession: () => void;
}

const SessionManagerContext = createContext<SessionManagerContextType | undefined>(undefined);

export const SessionManagerProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSessionDetails | null>(null);

  const setUserDetails = (userDetails: UserSessionDetails) => setUser(userDetails);
  const clearUserDetails = () => setUser(null);

  return (
    <SessionManagerContext.Provider value={{ user, setUserSession: setUserDetails, clearUserSession: clearUserDetails }}>
      {children}
    </SessionManagerContext.Provider>
  );
};

export const useSessionManager = (): SessionManagerContextType => {
  const context = useContext(SessionManagerContext);
  if (!context) {
    throw new Error('useSessionManager must be used within a SessionManagerProvider');
  }
  return context;
};
