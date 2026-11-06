import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { UserProfile } from '../../types';
import { APP_CONFIG } from '../../constants';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  sendOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  completeProfile: (username: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load existing session on startup
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = await SecureStore.getItemAsync(APP_CONFIG.STORAGE_KEYS.USER_PROFILE);

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn('Failed to load credentials from secure store', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const sendOtp = async (phone: string): Promise<{ success: boolean; error?: string }> => {
    // Basic phone validation
    if (!phone || phone.length < 8) {
      return { success: false, error: 'Please enter a valid phone number.' };
    }

    // In development mock mode
    if (APP_CONFIG.MOCK_AUTH.ENABLED) {
      return { success: true };
    }

    // Production API call would dispatch here
    return { success: true };
  };

  const verifyOtp = async (phone: string, otp: string): Promise<{ success: boolean; isNewUser?: boolean; error?: string }> => {
    if (otp !== APP_CONFIG.MOCK_AUTH.OTP && !otp) {
      return { success: false, error: 'Invalid verification code.' };
    }

    const mockProfile: UserProfile = {
      ...APP_CONFIG.MOCK_AUTH.MOCK_USER,
      phoneNumber: phone,
    };

    try {
      await SecureStore.setItemAsync(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, 'mock_jwt_session_token_' + Date.now());
      await SecureStore.setItemAsync(APP_CONFIG.STORAGE_KEYS.USER_PROFILE, JSON.stringify(mockProfile));
      setUser(mockProfile);
      setIsAuthenticated(true);
      return { success: true, isNewUser: false };
    } catch (e: any) {
      return { success: false, error: e.message || 'Session storage error' };
    }
  };

  const completeProfile = async (username: string, displayName: string): Promise<{ success: boolean; error?: string }> => {
    if (!username || !displayName) {
      return { success: false, error: 'Username and display name are required.' };
    }

    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        username,
        displayName,
      };
      await SecureStore.setItemAsync(APP_CONFIG.STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    return { success: true };
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(APP_CONFIG.STORAGE_KEYS.USER_PROFILE);
      setUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error('Error during logout', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        sendOtp,
        verifyOtp,
        completeProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
