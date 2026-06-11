import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

export interface User {
  id: string;
  email: string;
  plan: 'FREE' | 'STARTER' | 'PRO';
  tokens: number;
  subscriptionStatus: string | null;
  subscriptionId: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const res = await authAPI.me();
    setUser(res.data.user);
  };

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      try {
        await fetchUser();
      } catch {
        await AsyncStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    await AsyncStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (email: string, password: string) => {
    const res = await authAPI.register(email, password);
    await AsyncStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
