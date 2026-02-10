import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold gradient-text">PromptForge AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Turn your ideas into AI Studio–ready prompts in seconds.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <div className="flex flex-col gap-2">
              <Link to="/generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Generator</Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Account</h4>
            <div className="flex flex-col gap-2">
              <Link to="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Prompt History</Link>
              <Link to="/library" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Saved Prompts</Link>
              <Link to="/presets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Presets</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PromptForge AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
