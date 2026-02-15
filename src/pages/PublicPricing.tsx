import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { THEME, cn } from "@/lib/theme";

export default function PublicPricing() {
    return (
        <div className="min-h-screen bg-black font-sans selection:bg-primary/20">
            <Navbar />

            <main className="pt-32 pb-24 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                            Simple, transparent pricing
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Start for free, scale as you grow.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-start">

                        {/* Free */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 flex flex-col h-full hover:border-white/10 transition-colors">
                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">$0</span>
                                    <span className="text-muted-foreground text-sm">/month</span>
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground">Try Prompt Weaver risk-free</p>
                            </div>

                            <div className="flex-1 mb-8">
                                <ul className="space-y-4">
                                    {[
                                        "10 generations per month",
                                        "Image & video prompt formats",
                                        "JSON + explanation output",
                                        "Copy to clipboard",
                                        "Basic styles & moods",
                                        "Save up to 10 prompts"
                                    ].map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/80">
                                            <div className="mt-0.5 rounded-full bg-white/10 p-0.5">
                                                <Check className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link to="/auth?tab=signup" className="mt-auto">
                                <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white h-12 rounded-xl">
                                    Get Started
                                </Button>
                            </Link>
                        </div>

                        {/* Starter */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 flex flex-col h-full hover:border-white/10 transition-colors">
                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">$12</span>
                                    <span className="text-muted-foreground text-sm">/month</span>
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground">For creators & small teams</p>
                            </div>

                            <div className="flex-1 mb-8">
                                <ul className="space-y-4">
                                    {[
                                        "300 generations per month",
                                        "All styles, moods & cameras",
                                        "Advanced controls (seed, lighting)",
                                        "Prompt library & history",
                                        "Export-ready JSON for AI Studio",
                                        "Email support"
                                    ].map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/80">
                                            <div className="mt-0.5 rounded-full bg-white/10 p-0.5">
                                                <Check className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link to="/auth?tab=signup" className="mt-auto">
                                <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white h-12 rounded-xl">
                                    Upgrade to Starter
                                </Button>
                            </Link>
                        </div>

                        {/* Pro (Highlighted) */}
                        <div className="rounded-2xl border border-indigo-500/50 bg-indigo-500/[0.03] p-8 flex flex-col h-full relative z-10 scale-[1.02] shadow-2xl shadow-indigo-500/10">
                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">$24</span>
                                    <span className="text-muted-foreground text-sm">/month</span>
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground">For professionals & agencies</p>
                            </div>

                            <div className="flex-1 mb-8">
                                <ul className="space-y-4">
                                    {[
                                        "1000 generations per month",
                                        "Priority generation speed",
                                        "Custom presets & templates",
                                        "Unlimited prompt library",
                                        "Version control & audit logs",
                                        "Advanced parameter control",
                                        "API access (coming soon)",
                                        "Priority support"
                                    ].map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/80">
                                            <div className="mt-0.5 rounded-full bg-indigo-500/20 p-0.5">
                                                <Check className="h-3 w-3 text-indigo-400" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link to="/auth?tab=signup" className="mt-auto">
                                <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white h-12 rounded-xl border-0 shadow-lg shadow-indigo-500/25">
                                    Go Pro
                                </Button>
                            </Link>
                        </div>

                        {/* Business */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 flex flex-col h-full hover:border-white/10 transition-colors">
                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">$49</span>
                                    <span className="text-muted-foreground text-sm">/month</span>
                                </div>
                                <p className="mt-4 text-sm text-muted-foreground">For teams that scale</p>
                            </div>

                            <div className="flex-1 mb-8">
                                <ul className="space-y-4">
                                    {[
                                        "3000 generations per month",
                                        "Team collaboration",
                                        "Custom templates",
                                        "Dedicated support",
                                        "SSO & Invoice billing"
                                    ].map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/80">
                                            <div className="mt-0.5 rounded-full bg-white/10 p-0.5">
                                                <Check className="h-3 w-3 text-muted-foreground" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link to="mailto:sales@promptweaver.com" className="mt-auto">
                                <Button variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white h-12 rounded-xl">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
