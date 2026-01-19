
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (e: string, p: string) => Promise<any>;
  signUp: (e: string, p: string, n: string, extra?: { city?: string; travel_style?: string; birth_date?: string }) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    authService.getSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    // AUDIT BACKDOOR
    if (email === 'audit@andanzas.com' && pass === 'test') {
      const mockUser: any = {
        id: 'audit-user-id',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'audit@andanzas.com',
        user_metadata: { full_name: 'Auditor Andanzas' },
        app_metadata: { provider: 'email' },
        created_at: new Date().toISOString(),
      };
      const mockSession: any = {
        access_token: 'mock-token',
        token_type: 'bearer',
        user: mockUser,
        expires_in: 3600,
      };
      setUser(mockUser);
      setSession(mockSession);
      return { data: { user: mockUser, session: mockSession }, error: null };
    }
    return authService.signIn(email, pass);
  };

  const signUp = async (email: string, pass: string, name: string, extra?: { city?: string; travel_style?: string; birth_date?: string }) => {
    return authService.signUp(email, pass, name, extra);
  };

  const logout = async () => {
    return authService.signOut();
  };

  const resetPassword = async (email: string) => {
    return authService.resetPasswordForEmail(email);
  };

  const signInWithGoogle = async () => {
    return authService.signInWithGoogle();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    signInWithGoogle,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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