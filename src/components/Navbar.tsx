// @ts-check
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Zap,
  Menu,
  X,
  Sparkles,
  LayoutTemplate,
  Image as ImageIcon,
  Video,
  CreditCard,
  ChevronDown,
  LogOut,
  User,
  AlertCircle
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/theme";

import { PLAN_CREDITS } from "@/config/pricing";

// DEFAULTS removed

function formatPlan(plan?: string | null) {
  const p = (plan || "free").toLowerCase();
  if (p === "pro") return "Pro";
  if (p === "starter") return "Starter";
  return "Free";
}

function badgeClasses(plan?: string | null) {
  const p = (plan || "free").toLowerCase();
  if (p === "pro") return "border-primary/50 bg-primary/10 text-primary ring-1 ring-primary/20";
  if (p === "starter") return "border-blue-500/30 bg-blue-500/10 text-blue-400";
  return "border-white/10 bg-white/5 text-muted-foreground";
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Plan + credits from new schema
  const [plan, setPlan] = useState<string>("free");
  const [creditsBalance, setCreditsBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const planLabel = useMemo(() => formatPlan(plan), [plan]);
  const pillClass = useMemo(() => badgeClasses(plan), [plan]);

  useEffect(() => {
    let alive = true;

    async function fetchUserData() {
      if (!user) {
        setPlan("free");
        setCreditsBalance(0);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch plan from entitlements table
        const { data: entitlement, error: entError } = await supabase
          .from("entitlements")
          .select("plan, status")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!alive) return;

        if (entError) {
          console.error("Failed to load entitlements:", entError.message);
        }

        // Fetch credits from credits table
        const { data: creditsData, error: credError } = await supabase
          .from("credits")
          .select("balance")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!alive) return;

        if (credError) {
          console.error("Failed to load credits:", credError.message);
        }

        // Set state with fallbacks
        setPlan(entitlement?.plan || "free");
        setCreditsBalance(creditsData?.balance || 0);

      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setPlan("free");
        setCreditsBalance(0);
      }

      setLoading(false);
    }

    fetchUserData();

    if (!user) return;

    // Subscribe to entitlements changes
    const entitlementsChannel = supabase
      .channel("entitlements-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "entitlements",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as any;
          setPlan(row?.plan || "free");
        }
      )
      .subscribe();

    // Subscribe to credits changes
    const creditsChannel = supabase
      .channel("credits-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "credits",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as any;
          setCreditsBalance(row?.balance || 0);
        }
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(entitlementsChannel);
      supabase.removeChannel(creditsChannel);
    };
  }, [user?.id]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-black/60 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto flex h-16 lg:h-20 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 border border-white/5 ring-1 ring-white/5">
            <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-primary fill-primary/20" />
          </div>
          <span className="relative text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Prompt Weaver
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {user ? (
            <Link
              to="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          ) : (
            <>
              <Link
                to="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                to="/plans"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </>
          )}
          <Link
            to="/docs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>

          {user ? (
            <>
              {/* Unified Plan & Credits Badge */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn(
                    "group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                    // Dynamic Border Colors
                    creditsBalance <= 0
                      ? "border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10"
                      : creditsBalance <= 3
                        ? "border-orange-500/30 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10"
                        : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                  )}>
                    {/* Icon based on state */}
                    {creditsBalance <= 0 ? (
                      <AlertCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Sparkles className={cn(
                        "h-3.5 w-3.5 transition-colors",
                        creditsBalance > 3 && "text-primary fill-primary/20"
                      )} />
                    )}

                    {/* Text Logic */}
                    <span className="flex items-center gap-1.5">
                      {loading ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        <>
                          <span className={cn(
                            "uppercase tracking-wider opacity-80",
                            plan === "pro" ? "text-primary font-bold" : "font-medium"
                          )}>{planLabel}</span>
                          <span className="w-px h-3 bg-current opacity-20 mx-0.5" />
                          <span>
                            {creditsBalance === 0 ? "0 credits · Upgrade" : `${creditsBalance} credits`}
                          </span>
                        </>
                      )}
                    </span>

                    <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 border-white/10 bg-black/90 backdrop-blur-xl" align="end">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Plan</span>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full border",
                        plan === "pro"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-white/10 bg-white/5 text-muted-foreground"
                      )}>
                        {planLabel}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">Credits</span>
                        <span className={cn(
                          "font-mono font-bold",
                          creditsBalance <= 3 ? "text-orange-400" : "text-foreground"
                        )}>
                          {creditsBalance}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            creditsBalance <= 3 ? "bg-orange-500" : "bg-primary"
                          )}
                          style={{
                            width: `${Math.min((creditsBalance / (PLAN_CREDITS[plan as keyof typeof PLAN_CREDITS] || 10)) * 100, 100)}%`
                          }}
                        />
                      </div>
                      {creditsBalance <= 3 && (
                        <p className="text-[10px] text-orange-400/80 font-medium">
                          {creditsBalance === 0 ? "Out of credits" : "Low on credits"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-2 bg-white/5 border-t border-white/5 grid grid-cols-2 gap-2">
                    <Link to="/pricing" className="col-span-2">
                      <Button size="sm" variant="default" className="w-full h-8 text-xs bg-primary hover:bg-primary/90 text-white border-0">
                        <Zap className="h-3 w-3 mr-1.5" />
                        Upgrade Plan
                      </Button>
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Generator Links */}
              <Link
                to="/image-generator"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <ImageIcon className="h-4 w-4" />
                Image
              </Link>
              <Link
                to="/video-generator"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Video className="h-4 w-4" />
                Video
              </Link>
              <Link
                to="/banner-generator"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <CreditCard className="h-4 w-4" />
                Banner
              </Link>
              <Link
                to="/website-generator"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <LayoutTemplate className="h-4 w-4" />
                Website
              </Link>

              {/* Library/History */}
              <Link
                to="/library"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Library
              </Link>
              <Link
                to="/app/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>

              {/* Sign Out */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-sm hover:text-foreground"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth?tab=login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-0 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {user ? (
              <Link
                to="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
            ) : (
              <>
                <Link
                  to="/about"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/plans"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Pricing
                </Link>
              </>
            )}
            <Link
              to="/docs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              Docs
            </Link>

            {user ? (
              <>
                {/* Plan & Credits (Mobile) */}
                <div className="flex items-center justify-between py-2 border-t border-white/10 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Plan</span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full border",
                        plan === "pro"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-white/10 bg-white/5 text-muted-foreground"
                      )}>
                        {planLabel}
                      </span>
                      {plan === "free" && (
                        <Link to="/pricing" className="text-[10px] text-primary hover:underline">
                          Upgrade
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Credits</span>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className={cn(
                        "h-3 w-3",
                        creditsBalance <= 3 ? "text-orange-400" : "text-primary"
                      )} />
                      <span className={cn(
                        "text-sm font-mono font-bold",
                        creditsBalance <= 3 ? "text-orange-400" : "text-foreground"
                      )}>
                        {creditsBalance}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/image-generator"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <ImageIcon className="h-4 w-4" />
                  Image Generator
                </Link>
                <Link
                  to="/video-generator"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <Video className="h-4 w-4" />
                  Video Generator
                </Link>
                <Link
                  to="/banner-generator"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <CreditCard className="h-4 w-4" />
                  Banner Generator
                </Link>
                <Link
                  to="/website-generator"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 flex items-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutTemplate className="h-4 w-4" />
                  Website Generator
                </Link>
                <Link
                  to="/library"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Library
                </Link>
                <Link
                  to="/app/about"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
                <Button
                  variant="ghost"
                  className="justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth?tab=login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?tab=signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-0 text-white shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
