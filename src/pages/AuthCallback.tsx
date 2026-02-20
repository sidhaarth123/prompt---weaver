import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let authSubscription: any = null;

    const handleCallback = async () => {
      try {
        // 1. Give Supabase client a moment to process the URL fragment/code
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (sessionData.session) {
          // Success!
          navigate("/image-generator", { replace: true });
          return;
        }

        // 2. If no session yet, listen for the SIGNED_IN event
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session) {
            navigate("/image-generator", { replace: true });
          }
        });
        authSubscription = data.subscription;

        // 3. Fallback timeout: If no session after 4 seconds, redirect back to login
        const timer = setTimeout(async () => {
          const { data: finalCheck } = await supabase.auth.getSession();
          if (!finalCheck.session) {
            toast({
              title: "Authentication failed",
              description: "We couldn't establish a session. Please try logging in again.",
              variant: "destructive",
            });
            navigate("/auth", { replace: true });
          }
        }, 4000);

        return () => clearTimeout(timer);

      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Failed to complete sign in.");
        setTimeout(() => navigate("/auth", { replace: true }), 3000);
      }
    };

    handleCallback();

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <div className="text-red-500 text-2xl">!</div>
        </div>
        <p className="text-destructive font-medium mb-4">{error}</p>
        <p className="text-muted-foreground text-sm mb-6">Redirecting you back to login...</p>
        <button
          onClick={() => navigate("/auth")}
          className="text-primary hover:underline font-medium"
        >
          Click here if you aren't redirected
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-muted-foreground bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-primary/20" />
          <div className="absolute top-0 left-0 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <div className="space-y-2 text-center">
          <p className="text-white font-medium animate-pulse">Establishing secure session...</p>
          <p className="text-xs tracking-widest uppercase opacity-50">Authenticating with Google</p>
        </div>
      </div>
    </div>
  );
}
