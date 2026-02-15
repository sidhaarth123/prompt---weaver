import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Zap, Eye, EyeOff, Mail, RefreshCw, KeyRound, ArrowLeft } from "lucide-react";
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
    if (user) navigate("/generator", { replace: true });
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

  const handleGoogleLogin = async () => {
    try {
      setOauthLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${origin}/auth/callback` },
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

    navigate("/generator", { replace: true });
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
        className="w-full h-11 gap-3 bg-background/50 hover:bg-background border-white/10 hover:border-white/20 transition-all font-medium"
        onClick={handleGoogleLogin}
        disabled={oauthLoading || loading}
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white shrink-0">
          <img
            src="/google-logo.svg"
            alt="Google"
            width="18"
            height="18"
            className="object-contain"
          />
        </div>
        {oauthLoading ? "Connecting..." : "Continue with Google"}
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px w-full bg-white/10" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium px-2">OR</span>
        <div className="h-px w-full bg-white/10" />
      </div>
    </>
  );


  return (
    <div className="min-h-screen bg-background relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(263_70%_58%/0.15),transparent_70%)] pointer-events-none" />
      <Link to="/" className="absolute top-8 left-8 text-muted-foreground hover:text-foreground transition-colors hidden sm:flex items-center gap-2 text-sm font-medium z-10">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 mb-4 ring-1 ring-primary/20 shadow-lg shadow-primary/10">
            <Zap className="h-8 w-8 text-primary" />
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className={THEME.textGradient}>Welcome back</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue weaving prompts
          </p>
        </div>

        <div className={cn(THEME.glassCard, "px-6 py-8 sm:px-10")}>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-11 bg-background/50 p-1 mb-6 border border-white/5 rounded-lg">
              <TabsTrigger value="login" className="rounded-md data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-300">
                Log In
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-300">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-left-2 duration-300">
              <OAuthBlock />

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="bg-background/50 border-white/10 focus:border-primary/50 h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">Password</Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="bg-background/50 border-white/10 focus:border-primary/50 h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showLoginPassword ? "Hide password" : "Show password"}
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={cn("w-full h-11 font-semibold text-base shadow-lg shadow-primary/20", THEME.primaryGradient, THEME.hoverScale)}
                  disabled={loading || oauthLoading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Signing in...
                    </div>
                  ) : "Sign In"}
                </Button>

                {/* Optional: quick reset input */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-3">
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Quick password reset</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter email to reset"
                      className="h-9 text-xs bg-background/30 border-white/10"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-9 px-4 text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10"
                      onClick={handleForgotPassword}
                      disabled={loading || oauthLoading}
                    >
                      Send Link
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0 focus-visible:outline-none animate-in fade-in slide-in-from-right-2 duration-300">
              <OAuthBlock />

              {/* Post-signup screen */}
              {signupSubmittedEmail ? (
                <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Check your email</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We sent a confirmation link to <br />
                      <span className="font-medium text-foreground">{signupSubmittedEmail}</span>
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2 border-white/10 bg-white/5 hover:bg-white/10"
                      onClick={handleResend}
                      disabled={resendLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${resendLoading ? "animate-spin" : ""}`} />
                      {resendLoading ? "Resending..." : "Resend Email"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-xs"
                      onClick={() => {
                        setSignupSubmittedEmail(null);
                        setSignupEmail("");
                        setSignupPassword("");
                        setSignupConfirm("");
                      }}
                    >
                      Use different email
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="bg-background/50 border-white/10 focus:border-primary/50 h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        className="bg-background/50 border-white/10 focus:border-primary/50 h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showSignupPassword ? "Hide password" : "Show password"}
                      >
                        {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-xs font-medium uppercase tracking-wider text-muted-foreground ml-1">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm"
                        type={showSignupConfirm ? "text" : "password"}
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        required
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        className="bg-background/50 border-white/10 focus:border-primary/50 h-11 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupConfirm((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showSignupConfirm ? "Hide password" : "Show password"}
                      >
                        {showSignupConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>

                    {signupConfirm.length > 0 && signupPassword !== signupConfirm && (
                      <p className="text-xs text-destructive animate-in slide-in-from-top-1">Passwords do not match.</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className={cn("w-full h-11 font-semibold text-base shadow-lg shadow-primary/20", THEME.primaryGradient, THEME.hoverScale)}
                    disabled={loading || oauthLoading || !isSignupValid}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Creating Account...
                      </div>
                    ) : "Create Account"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground pt-2">
                    By joining, you agree to our{" "}
                    <Link to="/terms" className="underline underline-offset-4 hover:text-foreground transition-colors">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help? Visit our{" "}
          <Link to="/docs" className="underline underline-offset-4 hover:text-foreground transition-colors font-medium">
            Docs & Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
