import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Check if we have a session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (sessionData.session) {
          // Successful login
          navigate("/image-generator", { replace: true });
        } else {
          // No session found immediately, listen for auth state change
          // This handles cases where the session might be established slightly after load
          const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session) {
              navigate("/image-generator", { replace: true });
            } else if (event === "SIGNED_OUT") {
              // If we get here and are signed out, potentially redirect to login or show error
              // But typically OAuth redirect should result in SIGNED_IN
            }
          });

          // Fallback: If after a timeout we still don't have a session, redirect to auth
          setTimeout(() => {
            supabase.auth.getSession().then(({ data }) => {
              if (!data.session) {
                setError("Authentication failed or timed out.");
                // Optional: navigate("/auth");
              }
            });
          }, 5000);

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Failed to complete sign in.");
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-destructive mb-4">{error}</p>
        <button onClick={() => navigate("/auth")} className="text-primary hover:underline">
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}
