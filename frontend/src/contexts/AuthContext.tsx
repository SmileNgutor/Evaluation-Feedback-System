import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      console.log('Fetching user profile...');
      const response = await authService.getProfile();
      console.log('Profile response:', response);
      if (response.success && response.data) {
        setUser(response.data);
        console.log('User set:', response.data);
      } else {
        setUser(null);
        console.log('No user data in response');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
