import { useState, useEffect } from 'react'; // Import useState and useEffect
import { supabase } from '../main'; // Import the Supabase client
import { User } from '@supabase/supabase-js'; // Import Supabase User type

export function useAuth() {
  const [user, setUser] = useState<User | null>(null); // State to hold the authenticated user
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null); // Update user state based on session
        setIsLoading(false); // Set loading to false
      }
    );

    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Clean up the subscription on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return {
    user,
    isLoading,
    isAuthenticated: !!user, // Determine authentication status
  };
}
