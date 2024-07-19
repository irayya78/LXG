// src/session/SessionManager.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LoginModel, UserSessionDetails } from '../types/types';
interface SessionManagerContextType {
  user: UserSessionDetails | null;
  setUserSession: (user: UserSessionDetails) => void;
  clearUserSession: () => void;
  loginInfo: LoginModel | null;
  setLoginInfo: (info: LoginModel | null) => void;
 
}
export const isSessionExpired = () => {
  return localStorage.getItem('sessionExpired') === 'true';
};

const SessionManagerContext = createContext<SessionManagerContextType | undefined>(undefined);

export const SessionManagerProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserSessionDetails | null>(() => {
    // Retrieve user details from local storage on component mount
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loginInfo, setLoginInfo] = useState<LoginModel | null>(() => {
    const storedLoginInfo = localStorage.getItem('loginInfo');
    return storedLoginInfo ? JSON.parse(storedLoginInfo) : null;
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
   //userLogin Pre
  const setLoginDetails = (loginDetails: LoginModel | null) => {
    setLoginInfo(loginDetails);
    if (loginDetails) {
      localStorage.setItem('loginInfo', JSON.stringify(loginDetails));
    } else {
      localStorage.removeItem('loginInfo');
    }
  };

  return (
    <SessionManagerContext.Provider value={{ user, setUserSession: setUserDetails, clearUserSession: clearUserDetails ,loginInfo,setLoginInfo:setLoginDetails}}>
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
