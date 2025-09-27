import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signin: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  signout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('pridally_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signin = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication - in real app, this would call your API
    if (email && password) {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        joinedDate: new Date().toISOString(),
      };
      setUser(userData);
      localStorage.setItem('pridally_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate registration
    if (email && password && name) {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        joinedDate: new Date().toISOString(),
      };
      setUser(userData);
      localStorage.setItem('pridally_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem('pridally_user');
    localStorage.removeItem('pridally_daily_data');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    signin,
    signup,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};