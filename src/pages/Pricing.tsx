import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { THEME, cn } from "@/lib/theme";
import { motion } from "framer-motion";

type PlanKey = "free" | "starter" | "pro";

const PLAN_CREDITS: Record<PlanKey, number> = {
  free: 10,
  starter: 500,
  pro: 2000,
};

const tiers: Array<{
  key: PlanKey;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}> = [
    {
      key: "free",
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Try Prompt Weaver risk-free",
      features: [
        "10 generations per month",
        "Image & video prompt formats",
        "JSON + explanation output",
        "Copy to clipboard",
        "Basic styles & moods",
        "Save up to 10 prompts",
      ],
      cta: "Start Free",
      highlighted: false,
    },
    {
      key: "starter",
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "For creators & small teams",
      features: [
        "500 generations per month",
        "All styles, moods & cameras",
        "Advanced controls (seed, lighting)",
        "Prompt library & history",
        "Export-ready JSON for AI Studio",
        "Email support",
      ],
      cta: "Choose Starter",
      highlighted: false,
    },
    {
      key: "pro",
      name: "Pro",
      price: "$50",
      period: "/month",
      description: "For professionals & agencies",
      features: [
        "2000 generations per month",
        "Priority generation speed",
        "Custom presets & templates",
        "Unlimited prompt library",
        "Version control & audit logs",
        "Advanced parameter control",
        "API access (coming soon)",
        "Priority support",
      ],
      cta: "Go Pro",
      highlighted: true,
    },
  ];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("free");

  // Fetch current plan from entitlements table
  useEffect(() => {
    if (!user) {
      setCurrentPlan("free");
      return;
    }

    async function fetchPlan() {
      try {
        const { data: entitlement } = await supabase
          .from("entitlements")
          .select("plan, status")
          .eq("user_id", user!.id)
          .maybeSingle();

        setCurrentPlan(entitlement?.plan || "free");
      } catch (error) {
        console.error("Error fetching plan:", error);
        setCurrentPlan("free");
      }
    }

    fetchPlan();
  }, [user]);

  const applyPlan = async (plan: PlanKey) => {
    if (!user) {
      navigate("/auth?tab=signup");
      return;
    }

    setLoadingPlan(plan);

    // For Pro/Starter plans, show coming soon message
    // In production: redirect to Lemon Squeezy checkout
    if (plan === "pro" || plan === "starter") {
      toast({
        title: "Stripe Integration Coming Soon",
        description: "Payment processing will be available shortly. Select Free plan to get started now.",
      });
      setLoadingPlan(null);
      return;
    }

    // For free plan, call ensure-user endpoint
    try {
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        const response = await fetch('/api/ensure-user', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.data.session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentPlan(data.plan);

          toast({
            title: "Welcome to Prompt Weaver!",
            description: `You're on the ${data.plan.toUpperCase()} plan with ${data.balance} credits.`,
          });

          navigate("/image-generator");
        } else {
          throw new Error("Failed to initialize account");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to activate plan",
        variant: "destructive",
      });
    }

    setLoadingPlan(null);
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />

      <main className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className={THEME.container}>
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 backdrop-blur-md">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Flexible Plans
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Simple, transparent <span className={THEME.textGradient}>pricing</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Start free and scale as you grow. No hidden fees. Upgrade or cancel anytime.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 relative items-start">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={cn(
                  "relative flex flex-col rounded-2xl p-8 h-full transition-all duration-300",
                  tier.highlighted
                    ? "border border-primary/50 bg-primary/5 shadow-2xl shadow-primary/10 ring-1 ring-primary/20 scale-105 z-10"
                    : "border border-white/5 bg-card/40 backdrop-blur-xl hover:bg-card/60 hover:border-white/10"
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-primary/30">
                    <Sparkles className="h-3 w-3 fill-current" /> Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={cn("text-xl font-bold", tier.highlighted ? "text-primary" : "text-foreground")}>
                    {tier.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                    <span className="text-muted-foreground text-sm font-medium">{tier.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed h-10">
                    {tier.description}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="h-px w-full bg-border/50 mb-6" />
                  <ul className="space-y-4">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground/90">
                        <div className={cn(
                          "mt-0.5 flex h-4 w-4 items-center justify-center rounded-full",
                          tier.highlighted ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
                        )}>
                          <Check className="h-2.5 w-2.5" />
                        </div>
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    className={cn(
                      "w-full h-12 font-semibold text-base transition-all duration-300",
                      tier.highlighted
                        ? cn(THEME.primaryGradient, "shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]")
                        : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-foreground"
                    )}
                    variant={tier.highlighted ? "default" : "outline"}
                    disabled={!!loadingPlan || currentPlan === tier.key}
                    onClick={() => applyPlan(tier.key)}
                  >
                    {loadingPlan === tier.key ? (
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4 animate-spin" /> Processing...
                      </span>
                    ) : currentPlan === tier.key ? (
                      "Current Plan"
                    ) : (
                      tier.cta
                    )}
                  </Button>

                  {!user && (
                    <div className="mt-4 text-center">
                      <p className="text-xs text-muted-foreground">
                        {tier.highlighted ? "Start with a 7-day trial" : "No credit card required"}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Payment Integration Notice */}
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground/80">
                Stripe payment integration launching soon. Select Free plan to get started with credits today.
              </span>
            </div>
          </div>

          <div className="mt-20 border-t border-white/5 pt-10">
            <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
              <div>
                <h4 className="font-semibold mb-1">Secure Payments</h4>
                <p className="text-sm text-muted-foreground">Processed securely via Stripe.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Cancel Anytime</h4>
                <p className="text-sm text-muted-foreground">No long-term contracts or hidden fees.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Upgrade Instantly</h4>
                <p className="text-sm text-muted-foreground">Access pro features the moment you upgrade.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
