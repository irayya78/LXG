// src/session/SessionManager.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserSessionDetails } from '../types/types';
interface SessionManagerContextType {
  user: UserSessionDetails | null;
  setUserSession: (user: UserSessionDetails) => void;
  clearUserSession: () => void;
}

const SessionManagerContext = createContext<SessionManagerContextType | undefined>(undefined);

export const SessionManagerProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSessionDetails | null>(() => {
    // Retrieve user details from local storage on component mount
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setUserDetails = (userDetails: UserSessionDetails) => {
    setUser(userDetails);
    // Save user details to local storage
    localStorage.setItem('user', JSON.stringify(userDetails));
  };

  const clearUserDetails = () => {
    setUser(null);
    // Clear user details from local storage
    localStorage.removeItem('user');
  };

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
