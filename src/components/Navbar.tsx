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
  AlertCircle,
  Megaphone,
  PenLine,
  Code2
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
    <nav className="fixed top-0 left-0 right-0 z-[60] h-[80px] border-b border-white/[0.05] bg-[#0b0c14]/80 backdrop-blur-xl transition-all duration-300">
      <div className="w-full h-full flex items-center justify-between px-8">

        {/* ── LOGO SECTION ── */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#06b6d4] flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="absolute inset-0 bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[14px] font-black tracking-[0.15em] text-white uppercase group-hover:text-white/80 transition-colors">
            Prompt Weaver
          </span>
        </Link>

        {/* ── DESKTOP NAVIGATION ── */}
        <div className="hidden xl:flex items-center justify-center gap-10 flex-1 px-10">
          {(user
            ? [
              { label: "IMAGE", path: "/image-generator" },
              { label: "VIDEO", path: "/video-generator" },
              { label: "BANNER", path: "/banner-generator" },
              { label: "WEBSITE", path: "/website-generator" },
              { label: "AD", path: "/ad" },
              { label: "CONTENT", path: "/content-writing-generator" },
              { label: "CODING", path: "/coding-assistant" },
              { label: "LIBRARY", path: "/library" },
              { label: "PRICING", path: "/pricing" },
              { label: "ABOUT", path: "/about" },
            ]
            : [
              { label: "HOME", path: "/" },
              { label: "ABOUT", path: "/about" },
              { label: "JSON PROMPTS", path: "/about#json" },
              { label: "IMAGE", path: "/about#image" },
              { label: "VIDEO", path: "/about#video" },
              { label: "PRICING", path: "/pricing" },
            ]
          ).map((link) => {
            const isActive = location.pathname === link.path || (link.path.includes("#") && location.pathname === "/about");
            return (
              <Link
                key={link.label}
                to={link.path}
                className={cn(
                  "relative h-[80px] flex items-center group overflow-hidden",
                  isActive ? "text-white font-bold" : "text-white/40 hover:text-white/70"
                )}
              >
                <span className="text-[10px] font-black tracking-[0.2em] transition-colors">
                  {link.label}
                </span>
                {/* Active Indicator Line */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-[2px] bg-[#2dd4bf] transition-transform duration-300",
                  isActive ? "translate-y-0" : "translate-y-[2px]"
                )} />
              </Link>
            );
          })}
        </div>

        {/* ── AUTH / PROFILE SECTION ── */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Credits Pill (Matches image) */}
              <div className="flex items-center gap-3 h-10 px-4 rounded-full bg-[#0d0f17] border border-[#14b8a6]/20 shadow-[0_0_15px_rgba(20,184,166,0.05)]">
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-bold text-[#14b8a6]/50 tracking-wider">CREDITS</span>
                  <div className="w-8 h-[2px] bg-gradient-to-r from-[#818cf8] to-[#2dd4bf] rounded-full mt-0.5" />
                </div>
                <span className="text-sm font-black text-white">{creditsBalance}</span>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-[#1a1c25] border border-white/5 flex items-center justify-center hover:bg-[#252833] transition-colors">
                    <User className="h-4 w-4 text-white/60" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 bg-[#0d0f17] border-white/5 shadow-2xl" align="end">
                  <div className="p-3 border-b border-white/5 mb-2">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Authenticated as</p>
                    <p className="text-xs text-white truncate font-medium">{user.email}</p>
                  </div>
                  <Link to="/library" className="w-full">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-white/50 hover:text-white hover:bg-white/5">
                      <Sparkles className="h-3 w-3 mr-2" /> My Library
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="w-full justify-start text-xs text-red-400/60 hover:text-red-400 hover:bg-red-400/5 mt-1"
                  >
                    <LogOut className="h-3 w-3 mr-2" /> Sign Out
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/auth?tab=login">
                <Button variant="ghost" className="text-[11px] font-black tracking-[0.15em] text-white/50 hover:text-white uppercase transition-colors">
                  Login
                </Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button className="h-10 px-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[11px] font-black tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] uppercase">
                  Launch App
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <button
            className="xl:hidden p-2 text-white/50 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="xl:hidden absolute top-20 left-0 right-0 bg-[#0b0c14] border-b border-white/5 p-6 space-y-4 shadow-2xl">
          {[
            { label: "PRICING", path: "/pricing" },
            { label: "IMAGE", path: "/image-generator" },
            { label: "VIDEO", path: "/video-generator" },
            { label: "BANNER", path: "/banner-generator" },
            { label: "WEBSITE", path: "/website-generator" },
            { label: "AD", path: "/ad" },
            { label: "CONTENT", path: "/content-writing-generator" },
            { label: "CODING", path: "/coding-assistant" },
            { label: "LIBRARY", path: "/library" },
            { label: "ABOUT", path: "/about" },
          ].map(link => (
            <Link
              key={link.label}
              to={link.path}
              className="block text-[10px] font-black tracking-[0.2em] text-white/40 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <Link to="/auth?tab=login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full text-xs font-black tracking-widest text-white/50">LOGIN</Button>
              </Link>
              <Link to="/auth?tab=signup" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-white text-black text-xs font-black tracking-widest">GET STARTED</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
