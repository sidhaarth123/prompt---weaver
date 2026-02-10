import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with AI prompt generation",
    features: [
      "5 prompts per day",
      "Image & video prompts",
      "JSON + explanation output",
      "Copy to clipboard",
      "Basic styles & moods",
    ],
    cta: "Get Started Free",
    href: "/auth?tab=signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$14",
    period: "/month",
    description: "Unlimited access for power users",
    features: [
      "Unlimited prompts",
      "All styles, moods & cameras",
      "Advanced controls (seed, lighting, realism)",
      "Prompt history & search",
      "Save to library with tags",
      "Custom presets & templates",
      "Priority generation speed",
    ],
    cta: "Upgrade to Pro",
    href: "/auth?tab=signup",
    highlighted: true,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
            <p className="mt-3 text-lg text-muted-foreground">Start free. Upgrade when you need more.</p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {tiers.map(tier => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-8 ${
                  tier.highlighted
                    ? "border-primary/50 bg-card glow-md"
                    : "border-border/50 bg-card"
                }`}
              >
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>

                <ul className="mt-8 space-y-3">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`mt-8 w-full ${tier.highlighted ? "glow-sm" : ""}`}
                  variant={tier.highlighted ? "default" : "outline"}
                >
                  <Link to={tier.href}>{tier.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
