import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Zap, Eye, EyeOff, Mail, RefreshCw, Star } from "lucide-react";
import { cn } from "@/lib/theme";

function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (m.includes("user already registered")) return "This email is already registered. Try logging in.";
  if (m.includes("email not confirmed")) return "Please verify your email first (check your inbox).";
  if (m.includes("password should be at least")) return message;
  return message;
}

/* ─── Reusable styled input ─── */
function Field({
  id, label, type, value, onChange, placeholder, rightSlot, autoComplete,
}: {
  id: string; label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  rightSlot?: React.ReactNode; autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-semibold text-white/80">{label}</label>
        {rightSlot}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className={cn(
          "w-full h-12 px-4 rounded-xl text-sm text-white placeholder:text-white/20",
          "border border-white/[0.09] focus:border-indigo-500/70 focus:outline-none",
          "bg-[#14141f] transition-all duration-200",
          "focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
        )}
      />
    </div>
  );
}

export default function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab as any);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [signupSubmittedEmail, setSignupSubmittedEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => { setActiveTab(defaultTab as any); }, [defaultTab]);

  const origin = useMemo(() => window.location.origin, []);

  const isSignupValid = useMemo(() => {
    const emailOk = signupEmail.trim().length > 3 && signupEmail.includes("@");
    const pwdOk = signupPassword.length >= 8;
    const match = signupPassword === signupConfirm && signupConfirm.length > 0;
    return emailOk && pwdOk && match;
  }, [signupEmail, signupPassword, signupConfirm]);

  const handleGoogleLogin = async () => {
    try {
      setOauthLoading(true);
      await supabase.auth.signOut({ scope: "local" });
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("sb-") || key.includes("supabase")) localStorage.removeItem(key);
      });
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: { prompt: "select_account", access_type: "offline", include_granted_scopes: "true", max_age: "0" },
        },
      });
      if (error) toast({ title: "Google sign-in failed", description: friendlyError(error.message), variant: "destructive" });
    } finally {
      setOauthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail.trim(), password: loginPassword });
    setLoading(false);
    if (error) { toast({ title: "Login failed", description: friendlyError(error.message), variant: "destructive" }); return; }
    navigate("/image-generator", { replace: true });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword.length < 8) { toast({ title: "Weak password", description: "Password must be at least 8 characters.", variant: "destructive" }); return; }
    if (signupPassword !== signupConfirm) { toast({ title: "Passwords do not match", description: "Please confirm your password correctly.", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email: signupEmail.trim(), password: signupPassword, options: { emailRedirectTo: `${origin}/auth/callback` } });
    setLoading(false);
    if (error) { toast({ title: "Signup failed", description: friendlyError(error.message), variant: "destructive" }); return; }
    setSignupSubmittedEmail(signupEmail.trim());
    toast({ title: "Check your email", description: "We sent a confirmation link." });
  };

  const handleResend = async () => {
    if (!signupSubmittedEmail) return;
    setResendLoading(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: signupSubmittedEmail });
    setResendLoading(false);
    if (error) { toast({ title: "Resend failed", description: friendlyError(error.message), variant: "destructive" }); return; }
    toast({ title: "Email resent", description: "Check your inbox (and spam folder)." });
  };

  const handleForgotPassword = async () => {
    const email = loginEmail.trim();
    if (!email) { toast({ title: "Email required", description: "Enter your email first.", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback` });
    setLoading(false);
    if (error) { toast({ title: "Reset failed", description: friendlyError(error.message), variant: "destructive" }); return; }
    toast({ title: "Reset link sent", description: "Check your email for the password reset link." });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a12" }}>

      {/* ════════════════════════════════════════════════
          LEFT PANEL — Brand + Social Proof
      ════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex flex-col w-[48%] relative overflow-hidden p-14"
        style={{
          background: "linear-gradient(145deg, #1e1557 0%, #2d1f8a 30%, #3b2abf 58%, #271a82 80%, #160f55 100%)"
        }}
      >
        {/* ── Multiple layered glow blobs ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-120px", right: "-120px",
            width: "520px", height: "520px",
            background: "radial-gradient(circle, rgba(100,120,255,0.45) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "60px", left: "-80px",
            width: "420px", height: "420px",
            background: "radial-gradient(circle, rgba(80,60,220,0.35) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: "600px", height: "400px",
            background: "radial-gradient(ellipse, rgba(110,90,255,0.15) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Star-grid subtle overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />

        {/* ── Logo ── */}
        <Link to="/" className="relative z-10 inline-flex items-center gap-2.5 mb-16 w-fit group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(120,130,255,0.3), rgba(100,80,240,0.2))", boxShadow: "0 0 20px rgba(120,130,255,0.3)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <Zap className="h-4.5 w-4.5 text-white" style={{ width: "18px", height: "18px" }} />
          </div>
          <span className="text-[17px] font-bold text-white tracking-tight drop-shadow-lg">Prompt Weaver</span>
        </Link>

        {/* ── Headline ── */}
        <div className="relative z-10 flex-1">
          <h1 className="text-[42px] font-extrabold text-white leading-[1.15] mb-5 drop-shadow-2xl">
            Turn Ideas into
            <br />
            <span className="text-white">Production-Ready</span>
            <br />
            <span className="text-white">Assets</span>
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed max-w-xs">
            Join thousands of world-class creators and teams building the future with Prompt Weaver.
          </p>
        </div>

        {/* ── Testimonial Card ── */}
        <div className="relative z-10 mt-8">
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-4 h-4" style={{ fill: "#FBBF24", color: "#FBBF24" }} />
              ))}
            </div>
            <p className="text-[14px] text-white/80 italic leading-relaxed mb-5">
              "The structured JSON output has completely transformed our AI workflow. It's not just a prompt generator, it's an engineering tool."
            </p>
            {/* Avatar row */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 14px rgba(99,60,220,0.5)" }}
              >
                JD
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white leading-none mb-0.5">John Doe</p>
                <p className="text-[11px] text-white/40">Lead AI Engineer @ TechCorp</p>
              </div>
            </div>
          </div>
          {/* Trusted By section intentionally removed per user request */}
        </div>
      </div>


      {/* ════════════════════════════════════════════════
          RIGHT PANEL — Auth Form
      ════════════════════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 relative"
        style={{ background: "#0e0e1a" }}
      >
        {/* Subtle top-right glow on right panel */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 0, right: 0,
            width: "300px", height: "300px",
            background: "radial-gradient(circle, rgba(80,80,200,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="w-full max-w-[420px] relative z-10">

          {/* ── Tab Switcher ── */}
          <div
            className="flex rounded-xl p-1 mb-9"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
          >
            {(["login", "signup"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 h-10 rounded-lg text-[13px] font-semibold transition-all duration-200"
                style={
                  activeTab === tab
                    ? { background: "rgba(255,255,255,0.10)", color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }
                    : { color: "rgba(255,255,255,0.35)" }
                }
              >
                {tab === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* ── Heading ── */}
          <div className="mb-7">
            <h2 className="text-[26px] font-bold text-white mb-1.5">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-[13px] text-white/35">
              {activeTab === "login" ? "Enter your details to access your workspace." : "Start your 14-day free trial today."}
            </p>
          </div>

          {/* ── Already logged in banner ── */}
          {user && (
            <div className="mb-5 p-4 rounded-xl" style={{ background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.25)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[11px] font-bold text-white">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-none">Already logged in</p>
                  <p className="text-[10px] text-white/40">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/image-generator")}
                className="w-full h-9 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #4f46e5, #6d28d9)" }}
              >
                Continue to Workspace
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center"><span className="px-3 text-[10px] text-white/25 uppercase tracking-widest" style={{ background: "#0e0e1a" }}>or switch account</span></div>
              </div>
            </div>
          )}

          {/* ── Google Button ── */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={oauthLoading || loading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 mb-2"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
              <img src="/google-logo.svg" alt="Google" width={13} height={13} className="object-contain" />
            </div>
            {oauthLoading ? "Connecting…" : "Continue with Google"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full text-center text-[11px] text-white/30 hover:text-white/60 transition-colors mb-5"
          >
            Use a different Google account
          </button>

          {/* ── OR divider ── */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-[11px] font-medium text-white/25 uppercase tracking-widest">OR</span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* ═══════════════════════
              LOGIN FORM
          ═══════════════════════ */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field
                id="login-email" label="Email" type="email"
                value={loginEmail} onChange={setLoginEmail}
                placeholder="Email" autoComplete="email"
              />
              <Field
                id="login-password" label="Password"
                type={showLoginPassword ? "text" : "password"}
                value={loginPassword} onChange={setLoginPassword}
                placeholder="Password" autoComplete="current-password"
                rightSlot={
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                }
              />

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading || oauthLoading}
                className="w-full h-12 rounded-xl text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-40 mt-2"
                style={{
                  background: "linear-gradient(90deg, #3b82f6 0%, #6d28d9 100%)",
                  boxShadow: "0 4px 20px rgba(99,60,220,0.40), 0 1px 0 rgba(255,255,255,0.06) inset",
                }}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : "Sign In"}
              </button>
            </form>
          )}

          {/* ═══════════════════════
              SIGNUP FORM
          ═══════════════════════ */}
          {activeTab === "signup" && (
            <>
              {signupSubmittedEmail ? (
                <div className="text-center space-y-4 py-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
                  >
                    <Mail className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Check your email</h3>
                  <p className="text-sm text-white/40">
                    Verification link sent to{" "}
                    <span className="text-white font-medium">{signupSubmittedEmail}</span>
                  </p>
                  <button
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="w-full h-11 rounded-xl text-[13px] font-semibold text-white/80 border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    {resendLoading ? "Sending…" : "Resend Email"}
                  </button>
                  <button onClick={() => setSignupSubmittedEmail(null)} className="text-sm text-white/30 hover:text-white/60 transition-colors">
                    Use different email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <Field
                    id="signup-email" label="Email" type="email"
                    value={signupEmail} onChange={setSignupEmail}
                    placeholder="name@work-email.com" autoComplete="email"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="signup-password" className="text-[13px] font-semibold text-white/80">Password</label>
                      <input
                        id="signup-password" type="password" required
                        value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                        placeholder="8+ chars" autoComplete="new-password"
                        className="w-full h-12 px-4 rounded-xl text-sm text-white placeholder:text-white/20 border border-white/[0.09] focus:border-indigo-500/70 focus:outline-none bg-[#14141f] transition-all focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="signup-confirm" className="text-[13px] font-semibold text-white/80">Confirm</label>
                      <input
                        id="signup-confirm" type="password" required
                        value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)}
                        placeholder="Repeat" autoComplete="new-password"
                        className="w-full h-12 px-4 rounded-xl text-sm text-white placeholder:text-white/20 border border-white/[0.09] focus:border-indigo-500/70 focus:outline-none bg-[#14141f] transition-all focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                      />
                    </div>
                  </div>

                  {signupPassword && signupConfirm && signupPassword !== signupConfirm && (
                    <p className="text-xs text-red-400">Passwords do not match</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || oauthLoading || !isSignupValid}
                    className="w-full h-12 rounded-xl text-[14px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-40 mt-2"
                    style={{
                      background: "linear-gradient(90deg, #3b82f6 0%, #6d28d9 100%)",
                      boxShadow: "0 4px 20px rgba(99,60,220,0.40), 0 1px 0 rgba(255,255,255,0.06) inset",
                    }}
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : "Create Account"}
                  </button>

                  <p className="text-[11px] text-center text-white/25">
                    By joining, you agree to our{" "}
                    <Link to="/terms" className="underline hover:text-white/60 transition-colors">Terms</Link>{" "}and{" "}
                    <Link to="/privacy" className="underline hover:text-white/60 transition-colors">Privacy Policy</Link>.
                  </p>
                </form>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <p className="absolute bottom-6 text-[11px] text-white/20">© 2024 Prompt Weaver Inc.</p>
      </div>
    </div>
  );
}
