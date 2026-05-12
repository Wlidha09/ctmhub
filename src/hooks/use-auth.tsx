"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserProfile, UserRole } from '@/app/lib/roles';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for initial demo
const MOCK_USER: UserProfile = {
  id: '1',
  email: 'john.doe@ctmhub.com',
  name: 'John Doe',
  role: 'Owner',
  department: 'Direction',
  dob: '1985-06-15',
  phone: '+216 22 333 444',
  officeDaysPerWeek: 3,
  avatarUrl: 'https://picsum.photos/seed/ctm-owner/100/100',
  onboardingCompleted: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate auth check
    const timer = setTimeout(() => {
      // In a real app, check localStorage or Firebase state
      const savedUser = localStorage.getItem('ctm_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname !== '/' && !pathname.startsWith('/auth')) {
      // Not logged in, redirect to login
      // router.push('/'); // Commented out for dev flexibility
    } else if (!loading && user && !user.onboardingCompleted && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [user, loading, pathname, router]);

  const login = () => {
    // Mock login with Google
    const newUser: UserProfile = {
      ...MOCK_USER,
      onboardingCompleted: false, // Force onboarding for new login
      role: 'Employee' // Default role for new users
    };
    setUser(newUser);
    localStorage.setItem('ctm_user', JSON.stringify(newUser));
    router.push('/onboarding');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ctm_user');
    router.push('/');
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data, onboardingCompleted: true };
    setUser(updatedUser);
    localStorage.setItem('ctm_user', JSON.stringify(updatedUser));
    router.push('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};