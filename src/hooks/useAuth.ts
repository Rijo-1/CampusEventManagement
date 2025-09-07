import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, UserProfile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('Auth: Initializing auth state');
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Auth: Initial session check', { session, error });
        
        if (error) {
          console.error('Auth: Error getting session:', error);
          setLoading(false);
          return;
        }
        
        setUser(session?.user ?? null);
        if (session?.user) {
          console.log('Auth: User found, fetching profile');
          await fetchProfile(session.user.id);
        } else {
          console.log('Auth: No user session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth: Error during initialization', error);
        setLoading(false);
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth: Auth state changed', { event, session });
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('Auth: User signed in, fetching profile');
          setLoading(true);
          try {
            await fetchProfile(session.user.id);
          } catch (error) {
            console.error('Auth: Error in auth state change handler:', error);
            setLoading(false);
          }
        } else {
          console.log('Auth: User signed out, resetting profile');
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('Auth: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Auth: Fetching profile for user', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          college:colleges(*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Auth: No profile found for user, creating default profile');
          // Create a default profile if not found
          return await createDefaultProfile(userId);
        }
        console.error('Auth: Error fetching profile:', error);
        return null;
      }
      
      console.log('Auth: Profile found', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Auth: Error in fetchProfile:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProfile = async (userId: string) => {
    try {
      console.log('Auth: Creating default profile for user', userId);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Auth: Error getting user for profile creation:', userError);
        return null;
      }
      
      const defaultProfile = {
        id: userId,
        email: user.email,
        name: user.email?.split('@')[0] || 'User',
        role: 'student',
        points: 0,
        college_id: null,
        department: '',
        year: '',
      };
      
      console.log('Auth: Inserting default profile', defaultProfile);
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(defaultProfile)
        .select()
        .single();
        
      if (error) {
        console.error('Auth: Error inserting default profile:', error);
        return null;
      }
      
      console.log('Auth: Default profile created', data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Auth: Unexpected error in createDefaultProfile:', error);
      return null;
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Auth: Sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    name: string;
    college_id: string;
    department: string;
    year: string;
  }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            role: 'student'
          }
        }
      });

      if (error) throw error;
      
      // Create profile in user_profiles table
      if (data.user) {
        const profileData = {
          id: data.user.id,
          email,
          ...userData,
          points: 0,
          role: 'student'
        };
        
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert(profileData);
          
        if (profileError) throw profileError;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Auth: Sign up error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    refreshProfile: () => user && fetchProfile(user.id)
  };
}