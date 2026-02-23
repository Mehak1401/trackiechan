import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for OAuth callback hash in URL
    const handleAuthCallback = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        // Supabase client will automatically handle the hash
        // We just need to wait a moment for it to process
        await new Promise((resolve) => setTimeout(resolve, 100));
        // Clear the hash from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleAuthCallback();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}
