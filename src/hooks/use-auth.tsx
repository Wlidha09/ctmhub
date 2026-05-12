
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserProfile, UserRole } from '@/app/lib/roles';
import { useAuth as useFirebaseAuth, useFirestore } from '@/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  const auth = useFirebaseAuth();
  const db = useFirestore();

  useEffect(() => {
    if (!auth || !db) return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch profile from Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const profile = userSnap.data() as UserProfile;
          setUser(profile);
        } else {
          // Create a temporary profile for onboarding
          const initialProfile: UserProfile = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            role: 'Employee',
            department: 'IT',
            dob: '',
            phone: '',
            officeDaysPerWeek: 3,
            avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
            onboardingCompleted: false,
          };
          setUser(initialProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/' && !pathname.startsWith('/auth')) {
        // Rediriger vers l'accueil si non connecté
        router.push('/');
      } else if (user && !user.onboardingCompleted && pathname !== '/onboarding') {
        // Forcer l'onboarding si incomplet
        router.push('/onboarding');
      }
    }
  }, [user, loading, pathname, router]);

  const login = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    if (!user || !db) return;
    const updatedUser = { ...user, ...data, onboardingCompleted: true };
    
    // Save to Firestore
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, updatedUser);
    
    setUser(updatedUser);
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
