import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Check if there's a hash with access_token (OAuth callback)
        const hash = window.location.hash;
        if (hash && hash.includes("access_token")) {
          console.log("Detected OAuth callback, processing...");

          // Parse the hash parameters
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken) {
            // Set the session manually from the hash
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });

            if (error) {
              console.error("Error setting session:", error);
            } else if (data.session && mounted) {
              console.log("Session set successfully:", data.session.user.email);
              setUser(data.session.user);
              setLoading(false);

              // Clear the hash from URL
              window.history.replaceState({}, document.title, window.location.pathname);
              return;
            }
          }
        }

        // If no hash or failed to set from hash, check existing session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth error:", error);
        } else if (mounted) {
          console.log("Existing session:", session?.user?.email);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }

      // Clear hash after sign in
      if (event === "SIGNED_IN" && window.location.hash.includes("access_token")) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}
