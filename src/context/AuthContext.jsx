import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext(); // <- export it

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = { user, setUser, loading, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// Hook for consuming context
export function useAuth() {
  return useContext(AuthContext);
}
