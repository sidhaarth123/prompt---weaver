import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { THEME, cn } from "@/lib/theme";
import { motion } from "framer-motion";

import { PRICING_TIERS, PlanKey } from "@/config/pricing";
import { PricingCard } from "./PricingCard";

export default function PricingView() {
    // Cache Buster Log
    console.log("Rendering PricingView (v3) - Single Source of Truth");

    const { user } = useAuth();
    const navigate = useNavigate();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [currentPlan, setCurrentPlan] = useState<string>("");

    useEffect(() => {
        if (!user) {
            setCurrentPlan("");
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

    const handlePlanSelect = async (key: string) => {
        const plan = key as PlanKey;

        if (!user) {
            navigate("/auth?tab=signup");
            return;
        }

        setLoadingPlan(plan);

        if (plan === "business") {
            window.location.href = "mailto:sales@promptweaver.com?subject=Enterprise Inquiry";
            setLoadingPlan(null);
            return;
        }

        if (plan === "pro" || plan === "starter") {
            toast({
                title: "Stripe Integration Coming Soon",
                description: "Payment processing will be available shortly. Select Free plan to get started now.",
            });
            setLoadingPlan(null);
            return;
        }

        // Free plan activation logic
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
                        title: "Plan Activated",
                        description: `You are now on the ${data.plan.toUpperCase()} plan.`,
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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className={THEME.container}>
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 backdrop-blur-md">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Flexible Plans
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Simple, transparent <span className={THEME.gradientText}>pricing</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
                            Start free and scale as you grow. No hidden fees. Upgrade or cancel anytime.
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4 items-start">
                        {PRICING_TIERS.map((tier, index) => (
                            <motion.div
                                key={tier.key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="h-full"
                            >
                                <PricingCard
                                    tier={tier}
                                    currentPlan={currentPlan}
                                    loadingPlan={loadingPlan}
                                    onSelect={handlePlanSelect}
                                    isLoggedIn={!!user}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 backdrop-blur-sm">
                            <Zap className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground/80">
                                Stripe payment integration launching soon. Select Free plan to get started with credits today.
                            </span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
