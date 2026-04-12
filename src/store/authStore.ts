import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      set({ user: data.user });
    }

    return { error };
  },

  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (data.user) {
      set({ user: data.user });
    }

    return { error };
  },

  signOut: async () => {
    try {
      // Check if there's an active session before attempting logout
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No active session, just clear local state
        set({ user: null });
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      
      // If session doesn't exist, that's fine - user is effectively logged out
      if (error && error.message?.includes('session_not_found')) {
        // Session already invalid, just clear local state
        set({ user: null });
        return;
      }
      
      // For other errors, log them but still clear local state
      if (error) {
        console.warn('Logout error:', error);
      }
      
      set({ user: null });
    } catch (error) {
      // Fallback: clear local state even if logout fails
      console.warn('Logout failed:', error);
      set({ user: null });
    }
  },

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange((event, session) => {
      set({ user: session?.user ?? null });
    });
  },
}));