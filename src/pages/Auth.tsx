import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Zap, Eye, EyeOff, Mail, RefreshCw, KeyRound, ArrowLeft, Check, Star } from "lucide-react";
import { THEME, cn } from "@/lib/theme";
import { motion } from "framer-motion";

function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (m.includes("user already registered")) return "This email is already registered. Try logging in.";
  if (m.includes("email not confirmed")) return "Please verify your email first (check your inbox).";
  if (m.includes("password should be at least")) return message;
  return message;
}

export default function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  // Login form (separate state)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup form (separate state)
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState("");

  // UX states
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab as any);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  // Post-signup state
  const [signupSubmittedEmail, setSignupSubmittedEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/image-generator", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    setActiveTab(defaultTab as any);
  }, [defaultTab]);

  const origin = useMemo(() => window.location.origin, []);

  const isSignupValid = useMemo(() => {
    const emailOk = signupEmail.trim().length > 3 && signupEmail.includes("@");
    const pwdOk = signupPassword.length >= 8;
    const match = signupPassword === signupConfirm && signupConfirm.length > 0;
    return emailOk && pwdOk && match;
  }, [signupEmail, signupPassword, signupConfirm]);

  const handleGoogleLogin = async (switchAccount = false) => {
    try {
      setOauthLoading(true);

      if (switchAccount) {
        await supabase.auth.signOut();
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            prompt: "select_account",
            access_type: "offline",
            include_granted_scopes: "true",
          },
        },
      });
      if (error) {
        toast({
          title: "Google sign-in failed",
          description: friendlyError(error.message),
          variant: "destructive",
        });
      }
    } finally {
      setOauthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Login failed",
        description: friendlyError(error.message),
        variant: "destructive",
      });
      return;
    }

    navigate("/image-generator", { replace: true });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupPassword.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword !== signupConfirm) {
      toast({
        title: "Passwords do not match",
        description: "Please confirm your password correctly.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: signupPassword,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Signup failed",
        description: friendlyError(error.message),
        variant: "destructive",
      });
      return;
    }

    setSignupSubmittedEmail(signupEmail.trim());
    toast({
      title: "Check your email",
      description: "We sent a confirmation link. Verify your email to activate your account.",
    });
  };

  const handleResend = async () => {
    if (!signupSubmittedEmail) return;
    setResendLoading(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: signupSubmittedEmail,
    });

    setResendLoading(false);

    if (error) {
      toast({
        title: "Resend failed",
        description: friendlyError(error.message),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email resent",
      description: "Check your inbox (and spam folder).",
    });
  };

  const handleForgotPassword = async () => {
    const email = (forgotEmail || loginEmail).trim();
    if (!email) {
      toast({
        title: "Email required",
        description: "Enter your email to reset your password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback`,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Reset failed",
        description: friendlyError(error.message),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reset link sent",
      description: "Check your email for the password reset link.",
    });
  };


  const OAuthBlock = () => (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 gap-3 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 transition-all font-medium text-white"
        onClick={() => handleGoogleLogin()}
        disabled={oauthLoading || loading}
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white shrink-0">
          <img
            src="/google-logo.svg"
            alt="Google"
            width="14"
            height="14"
            className="object-contain"
          />
        </div>
        {oauthLoading ? "Connecting..." : "Continue with Google"}
      </Button>

      <button
        type="button"
        onClick={() => handleGoogleLogin(true)}
        className="mt-2 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors w-full text-center"
      >
        Use a different Google account
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px w-full bg-white/10" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium px-2">OR</span>
        <div className="h-px w-full bg-white/10" />
      </div>
    </>
  );


  return (
    <div className="min-h-screen bg-background flex">
      {/* LEFT PANEL - BRANDING (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-black border-r border-white/5 relative overflow-hidden p-12">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="p-2 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
              <Zap className="h-6 w-6 text-indigo-400 group-hover:text-indigo-300" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Prompt Weaver</span>
          </Link>

          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            Turn Ideas into <br />
            <span className="text-indigo-400">Production-Ready Assets</span>
          </h1>
          <p className="text-lg text-white/50 max-w-md leading-relaxed">
            Join thousands of world-class creators and teams building the future with Prompt Weaver.
          </p>
        </div>

        {/* Testimonial / Social Proof */}
        <div className="relative z-10 space-y-8">
          <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md">
            <div className="flex gap-1 text-amber-400 mb-4">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-white/80 italic mb-4">"The structured JSON output has completely transformed our AI workflow. It's not just a prompt generator, it's an engineering tool."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                JD
              </div>
              <div>
                <div className="font-semibold text-white text-sm">John Doe</div>
                <div className="text-xs text-white/40">Lead AI Engineer @ TechCorp</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-white/30 font-medium tracking-widest uppercase">
            <span>Trusted By</span>
            <div className="h-px flex-1 bg-white/10" />
            <span>Netflix</span>
            <span>Spotify</span>
            <span>Linear</span>
          </div>
        </div>
      </div>


      {/* RIGHT PANEL - FORM */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 relative">
        <Link to="/" className="absolute top-8 right-8 text-sm text-muted-foreground hover:text-white transition-colors lg:hidden">
          Back to Home
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeTab === "login" ? "Enter your details to access your workspace." : "Start your 14-day free trial today."}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-black border border-white/10 rounded-lg p-1 mb-8">
              <TabsTrigger value="login" className="rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all font-medium">Log In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all font-medium">Sign Up</TabsTrigger>
            </TabsList>

            <div className="relative min-h-[400px]">
              <TabsContent value="login" className="absolute inset-0 mt-0 data-[state=inactive]:hidden animate-in fade-in slide-in-from-left-4 duration-300">
                <OAuthBlock />
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="bg-black/40 border-white/10 focus:border-indigo-500 h-11"
                      placeholder="name@work-email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <button type="button" onClick={handleForgotPassword} className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        className="bg-black/40 border-white/10 focus:border-indigo-500 h-11 pr-10"
                        placeholder="Enter your password"
                      />
                      <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg" disabled={loading || oauthLoading}>
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="absolute inset-0 mt-0 data-[state=inactive]:hidden animate-in fade-in slide-in-from-right-4 duration-300">
                <OAuthBlock />
                {signupSubmittedEmail ? (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                      <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Check your email</h3>
                    <p className="text-muted-foreground">We sent a verification link to <span className="text-white">{signupSubmittedEmail}</span></p>
                    <Button onClick={handleResend} disabled={resendLoading} variant="outline" className="w-full border-white/10 hover:bg-white/5">
                      {resendLoading ? "Sending..." : "Resend Email"}
                    </Button>
                    <Button onClick={() => setSignupSubmittedEmail(null)} variant="ghost" className="text-sm">Use different email</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        required
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        className="bg-black/40 border-white/10 focus:border-indigo-500 h-11"
                        placeholder="name@work-email.com"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          required
                          value={signupPassword}
                          onChange={e => setSignupPassword(e.target.value)}
                          className="bg-black/40 border-white/10 focus:border-indigo-500 h-11"
                          placeholder="8+ chars"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm">Confirm</Label>
                        <Input
                          id="signup-confirm"
                          type="password"
                          required
                          value={signupConfirm}
                          onChange={e => setSignupConfirm(e.target.value)}
                          className="bg-black/40 border-white/10 focus:border-indigo-500 h-11"
                          placeholder="Repeat"
                        />
                      </div>
                    </div>
                    {signupPassword && signupConfirm && signupPassword !== signupConfirm && (
                      <p className="text-xs text-red-400">Passwords do not match</p>
                    )}
                    <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg" disabled={loading || oauthLoading || !isSignupValid}>
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Create Account"}
                    </Button>
                    <div className="text-xs text-center text-muted-foreground">
                      By joining, you agree to our <Link to="/terms" className="underline hover:text-white">Terms</Link> and <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link>.
                    </div>
                  </form>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-xs text-white/20">© 2024 Prompt Weaver Inc.</p>
        </div>
      </div>
    </div>
  );
}
