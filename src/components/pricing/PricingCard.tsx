import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/theme";
import { PricingTier } from "@/config/pricing";

interface PricingCardProps {
    tier: PricingTier;
    currentPlan: string;
    loadingPlan: string | null;
    onSelect: (key: string) => void;
    isLoggedIn: boolean;
}

export function PricingCard({ tier, currentPlan, loadingPlan, onSelect, isLoggedIn }: PricingCardProps) {
    const isCurrent = currentPlan === tier.key;
    const isLoading = loadingPlan === tier.key;

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-2xl p-8 h-full transition-all duration-300",
                tier.highlighted
                    ? "border border-primary/50 bg-primary/5 shadow-2xl shadow-primary/10 ring-1 ring-primary/20 scale-105 z-10"
                    : "border border-white/5 bg-card/40 backdrop-blur-xl hover:bg-card/60 hover:border-white/10"
            )}
        >
            {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-primary/30">
                    <Sparkles className="h-3 w-3 fill-current" /> Most Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className={cn("text-xl font-bold", tier.highlighted ? "text-primary" : "text-foreground")}>
                    {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                    <span className="text-muted-foreground text-sm font-medium">{tier.period}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed h-10">
                    {tier.description}
                </p>
            </div>

            <div className="flex-1">
                <div className="h-px w-full bg-border/50 mb-6" />
                <ul className="space-y-4">
                    {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground/90">
                            <div className={cn(
                                "mt-0.5 flex h-4 w-4 items-center justify-center rounded-full",
                                tier.highlighted ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
                            )}>
                                <Check className="h-2.5 w-2.5" />
                            </div>
                            <span className="leading-snug">{f}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8">
                <Button
                    className={cn(
                        "w-full h-12 font-semibold text-base transition-all duration-300",
                        tier.highlighted
                            ? cn("bg-gradient-to-r from-primary to-indigo-600", "shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]")
                            : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-foreground"
                    )}
                    variant={tier.highlighted ? "default" : "outline"}
                    disabled={!!loadingPlan || isCurrent}
                    onClick={() => onSelect(tier.key)}
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Zap className="h-4 w-4 animate-spin" /> Processing...
                        </span>
                    ) : isCurrent ? (
                        "Current Plan"
                    ) : (
                        tier.cta
                    )}
                </Button>

                {!isLoggedIn && (
                    <div className="mt-4 text-center">
                        <p className="text-xs text-muted-foreground">
                            {tier.highlighted ? "Start with a 7-day trial" : "No credit card required"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
