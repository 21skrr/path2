import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, company?: string) => Promise<boolean>;
  logout: () => void;
  upgradeToPremium: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database (stored in localStorage)
const MOCK_ADMIN: User = {
  id: 1,
  name: 'Admin HR',
  email: 'admin@hrplatform.ma',
  role: 'ADMIN',
  membershipStatus: 'PREMIUM',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('hr_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('hr_user');
      }
    }
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('hr_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('hr_user');
    }
  };

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Check for admin
    if (email.toLowerCase() === 'admin@hrplatform.ma') {
      persistUser(MOCK_ADMIN);
      return true;
    }

    // Check registered users in localStorage
    const usersRaw = localStorage.getItem('hr_registered_users');
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
      persistUser(found);
      return true;
    }

    // Any email works for demo — create a free user
    const newUser: User = {
      id: Date.now(),
      name: email.split('@')[0],
      email,
      role: 'MEMBER',
      membershipStatus: 'FREE',
    };
    persistUser(newUser);
    return true;
  };

  const register = async (name: string, email: string, _password: string, _company?: string): Promise<boolean> => {
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      role: 'MEMBER',
      membershipStatus: 'FREE',
    };

    // Store in registered users
    const usersRaw = localStorage.getItem('hr_registered_users');
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
    users.push(newUser);
    localStorage.setItem('hr_registered_users', JSON.stringify(users));

    persistUser(newUser);
    return true;
  };

  const logout = () => {
    persistUser(null);
  };

  const upgradeToPremium = () => {
    if (user) {
      const updated = { ...user, membershipStatus: 'PREMIUM' as const };
      persistUser(updated);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isPremium: user?.membershipStatus === 'PREMIUM',
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    upgradeToPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
