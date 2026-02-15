import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      // Supabase reads the URL hash and stores the session automatically
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/generator", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Signing you in...
    </div>
  );
}
