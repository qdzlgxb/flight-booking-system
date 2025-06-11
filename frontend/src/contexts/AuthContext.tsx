import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中是否有用户信息
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response: AuthResponse = await authAPI.login(data);
      
      // 存储token和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.id,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        role: response.role
      }));
      
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        role: response.role
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authAPI.register(data);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 