import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Profile = {
  plan: "free" | "starter" | "pro" | string;
  balance: number;
  status: string;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch entitlements (plan, status)
        const { data: entitlement, error: entError } = await supabase
          .from("entitlements")
          .select("plan, status")
          .eq("user_id", user.id)
          .maybeSingle();

        // Fetch credits (balance)
        const { data: creditsData, error: credError } = await supabase
          .from("credits")
          .select("balance")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!alive) return;

        if (entError) {
          console.error("Entitlements error:", entError);
        }

        if (credError) {
          console.error("Credits error:", credError);
        }

        // Combine data
        setProfile({
          plan: entitlement?.plan || "free",
          status: entitlement?.status || "active",
          balance: creditsData?.balance || 0,
        });

      } catch (error) {
        console.error("Profile load error:", error);
        setProfile(null);
      }

      setLoading(false);
    }

    load();

    if (!user) return;

    // Realtime updates for entitlements
    const entitlementsChannel = supabase
      .channel("entitlements-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "entitlements", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const row = payload.new as any;
          setProfile(prev => prev ? { ...prev, plan: row.plan, status: row.status } : null);
        }
      )
      .subscribe();

    // Realtime updates for credits
    const creditsChannel = supabase
      .channel("credits-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "credits", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const row = payload.new as any;
          setProfile(prev => prev ? { ...prev, balance: row.balance } : null);
        }
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(entitlementsChannel);
      supabase.removeChannel(creditsChannel);
    };
  }, [user?.id]);

  return { profile, loading };
}
