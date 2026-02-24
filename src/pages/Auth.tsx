import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check if this is an OAuth callback (has access_token in hash)
        const hash = window.location.hash;
        if (hash && hash.includes("access_token")) {
          console.log("Processing OAuth callback...");

          // Parse tokens from hash
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken) {
            // Set the session
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });

            if (error) {
              console.error("Error setting session:", error);
              setError("Failed to sign in. Please try again.");
            } else if (data.session) {
              console.log("Signed in successfully:", data.session.user.email);
              // Clear hash and redirect to home
              window.history.replaceState({}, document.title, "/auth");
              navigate("/", { replace: true });
              return;
            }
          }
        }

        // Check if already logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Already logged in:", session.user.email);
          navigate("/", { replace: true });
          return;
        }
      } catch (err) {
        console.error("Auth error:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) {
      console.error("OAuth error:", error);
      setError("Failed to start sign in. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xs"
      >
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold tracking-tight text-foreground mb-1">
            trackie<span className="text-muted-foreground font-normal">chan</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Track your subscriptions, effortlessly.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4">
            <p className="text-xs text-destructive text-center">{error}</p>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 h-9 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          By continuing, you agree to our Terms of Service.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
