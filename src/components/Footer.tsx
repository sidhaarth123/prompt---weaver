import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-lg mt-auto">
      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-1.5 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">Prompt Weaver</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
              Turn your ideas into production-ready prompts in seconds. Built for scale, designed for creators.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: [
                { label: "Generator", to: "/image-generator" },
                { label: "Pricing", to: "/pricing" },
                { label: "Documentation", to: "/docs" }
              ]
            },
            {
              title: "Account",
              links: [
                { label: "Prompt History", to: "/history" },
                { label: "Saved Prompts", to: "/library" },
                { label: "Presets", to: "/presets" }
              ]
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
                { label: "Refund Policy", to: "/refund-policy" },
                { label: "Contact Support", to: "/contact" }
              ]
            }
          ].map((column) => (
            <div key={column.title}>
              <h4 className="mb-6 text-sm font-semibold tracking-wider text-white uppercase opacity-80">{column.title}</h4>
              <div className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-white transition-colors hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground/60">
          <p>© {new Date().getFullYear()} Prompt Weaver. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {/* Socials placeholder */}
            <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
            <span className="hover:text-white cursor-pointer transition-colors">Discord</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
