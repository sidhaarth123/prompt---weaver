import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold gradient-text">PromptForge AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</Link>
          {user ? (
            <>
              <Link to="/generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Generator</Link>
              <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">History</Link>
              <Link to="/library" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Library</Link>
              <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Log In</Button>
              <Button size="sm" onClick={() => navigate("/auth?tab=signup")} className="glow-sm">Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border/50 bg-background p-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/pricing" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link to="/docs" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Docs</Link>
            {user ? (
              <>
                <Link to="/generator" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Generator</Link>
                <Link to="/history" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>History</Link>
                <Link to="/library" className="text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>Library</Link>
                <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); setMobileOpen(false); }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => { navigate("/auth"); setMobileOpen(false); }}>Log In</Button>
                <Button size="sm" onClick={() => { navigate("/auth?tab=signup"); setMobileOpen(false); }}>Get Started</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
