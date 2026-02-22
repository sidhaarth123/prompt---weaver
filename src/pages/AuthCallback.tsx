import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  User,
  Box,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AuthStatus = "loading" | "success" | "error";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Give Supabase a moment to process the URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session) {
          // If session exists, we consider it a success
          setStatus("success");
        } else {
          // If no session after process, check if it's an error scenario
          // (Supabase might put error in URL params)
          const params = new URLSearchParams(window.location.search);
          if (params.get("error")) {
            setStatus("error");
            setErrorMessage(params.get("error_description") || "Authentication failed");
          } else {
            // Wait a bit more for background processing
            const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
              if (event === "SIGNED_IN" && session) {
                setStatus("success");
              }
            });

            // Timeout after 5s
            const timer = setTimeout(() => {
              if (status === "loading") {
                setStatus("error");
                setErrorMessage("Authentication timed out. Please try again.");
              }
            }, 5000);
            return () => clearTimeout(timer);
          }
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setStatus("error");
        setErrorMessage(err.message || "An unexpected error occurred during verification.");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#05060b] text-white flex flex-col font-sans selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {status === "loading" && <LoadingState key="loading" />}
        {status === "success" && <SuccessState key="success" />}
        {status === "error" && <ErrorState key="error" message={errorMessage} />}
      </AnimatePresence>
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-50">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <Box className="w-5 h-5 text-black" />
        </div>
        <span className="text-[13px] font-black tracking-[0.2em] text-white uppercase">
          PROMPT WEAVER
        </span>
      </Link>
      <div className="flex items-center gap-6 text-[12px] font-medium text-white/40">
        <Link to="/contact" className="hover:text-white transition-colors">Support</Link>
        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-400">
          PW
        </div>
      </div>
    </header>
  );
}

function Footer({ copyright }: { copyright: string }) {
  return (
    <footer className="mt-auto pb-12 text-center z-10">
      <div className="flex justify-center gap-8 text-[11px] font-bold text-white/20 uppercase tracking-[0.2em] mb-6">
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link to="/security" className="hover:text-white transition-colors">Security</Link>
      </div>
      <p className="text-[10px] font-bold text-white/10 tracking-[0.3em] uppercase">
        {copyright}
      </p>
    </footer>
  );
}

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
            <div className="w-2 h-1 bg-white/20 rounded" />
          </div>
          <span className="text-[12px] font-bold tracking-[0.3em] text-white uppercase">PROMPT WEAVER</span>
        </div>

        <div className="relative w-80 p-12 rounded-[32px] bg-[#0d0f17] border border-white/5 shadow-2xl flex flex-col items-center">
          <div className="relative w-24 h-24 mb-10">
            {/* Smooth gradient spinner */}
            <div className="absolute inset-0 rounded-full border-[3px] border-white/5" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#2563eb] border-r-[#7c3aed] animate-spin" />
            <div className="absolute inset-2 rounded-full bg-[#0d0f17]" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-3">Verifying your account...</h1>
          <p className="text-[14px] text-white/40 mb-10">This will only take a moment.</p>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-8" />

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase italic">SECURE HANDSHAKE</span>
          </div>
        </div>
      </div>
      <Footer copyright="© 2024 PROMPT WEAVER CORE SYSTEMS" />
    </motion.div>
  );
}

function SuccessState() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20">
        <div className="w-full max-w-sm p-12 rounded-[40px] bg-[#0d0f17]/80 backdrop-blur-3xl border border-white/5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-blue-500/10 blur-3xl rounded-full" />

          <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg relative z-10">
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-4 text-white">
            Email Successfully <br /> Verified
          </h1>
          <p className="text-[15px] text-white/40 leading-relaxed mb-10">
            Welcome to Prompt Weaver. <br /> Your account is now activated.
          </p>

          <Button
            onClick={() => navigate("/image-generator")}
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-tight rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 group transition-all"
          >
            Continue to Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Link to="/" className="mt-8 text-[13px] font-medium text-white/30 hover:text-white transition-colors">
            Go to Home
          </Link>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Node: Auth-Server-US-East</span>
        </div>
      </div>

      <Footer copyright="© 2024 PROMPT WEAVER AI PLATFORMS" />
    </motion.div>
  );
}

function ErrorState({ message }: { message: string | null }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col"
    >
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20">
        <div className="w-full max-w-[420px] p-12 rounded-[32px] bg-[#0d0f17] border border-white/5 shadow-3xl text-center relative">
          <div className="w-16 h-16 rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center mx-auto mb-10">
            <AlertCircle className="w-8 h-8 text-red-500/70" />
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-6 text-white">
            Verification failed or expired
          </h1>
          <p className="text-[15px] text-white/40 leading-relaxed mb-10 font-medium">
            {message || "The security link you followed is no longer valid. This can happen if the link has already been used or if it has expired for your protection."}
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/auth")}
              className="w-full h-14 bg-gradient-to-r from-[#8b0e2f] via-[#5c138b] to-[#4e138b] text-white font-bold tracking-tight rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 transition-transform active:scale-95"
            >
              <Mail className="w-4 h-4 opacity-70" />
              Resend Verification Email
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="w-full h-14 bg-white/5 border-white/5 text-white/70 hover:text-white hover:bg-white/10 font-bold tracking-tight rounded-xl transition-all"
            >
              Back to Sign In
            </Button>
          </div>

          <p className="mt-12 text-[13px] text-white/30">
            Still having issues? <Link to="/contact" className="text-blue-500 hover:underline">Contact our support team</Link>
          </p>
        </div>
      </div>

      <Footer copyright="© 2024 Prompt Weaver. Crafted for creators." />
    </motion.div>
  );
}
