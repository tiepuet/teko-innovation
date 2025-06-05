import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  loading: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null, initialized: true });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ initialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      set({ user: data.user });
      return true;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user?.id,
            email,
            full_name: fullName,
            role: 'user',
          },
        ]);

      if (profileError) throw profileError;

      set({ user: data.user });
      return true;
    } catch (error) {
      console.error('Error registering:', error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      set({ loading: false });
    }
  },
}));

// Initialize auth state
useAuthStore.getState().initialize();