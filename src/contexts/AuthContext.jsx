import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check active sessions
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (mounted) {
            setUser(session?.user ?? null);
          }
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const value = {
    signUp: async (email, password) => {
      if (!email || !password) {
        throw new Error('Tafadhali jaza barua pepe na neno siri.');
      }
      if (password.length < 6) {
        throw new Error('Neno siri linapaswa kuwa na herufi 6 au zaidi.');
      }
      
      // Email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        throw new Error('Tafadhali weka barua pepe sahihi.');
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message === 'User already registered' ? 
          'Barua pepe imeshasajiliwa.' : error.message);
      }

      return { data, error };
    },
    completeSignUp: async (userId) => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      // Update phone verification status
      const { error } = await supabase
        .from('profiles')
        .update({ phone_verified: true })
        .eq('id', userId);

      return { error };
    },
    signIn: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}