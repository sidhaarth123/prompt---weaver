export type PlanKey = "free" | "starter" | "pro" | "business";

export interface PricingTier {
    key: PlanKey;
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    highlighted: boolean;
    generations: number;
}

export const PLAN_CREDITS: Record<PlanKey, number> = {
    free: 10,
    starter: 300,
    pro: 1000,
    business: 3000,
};

export const PRICING_TIERS: PricingTier[] = [
    {
        key: "free",
        name: "Free",
        price: "$0",
        period: "/month",
        description: "Try Prompt Weaver risk-free",
        features: [
            "10 generations per month",
            "Image & video prompt formats",
            "JSON + explanation output",
            "Copy to clipboard",
            "Basic styles & moods",
            "Save up to 10 prompts",
        ],
        cta: "Start Free",
        highlighted: false,
        generations: 10,
    },
    {
        key: "starter",
        name: "Starter",
        price: "$12",
        period: "/month",
        description: "For creators & small teams",
        features: [
            "300 generations per month",
            "All styles, moods & cameras",
            "Advanced controls (seed, lighting)",
            "Prompt library & history",
            "Export-ready JSON for AI Studio",
            "Email support",
        ],
        cta: "Upgrade to Starter",
        highlighted: false,
        generations: 300,
    },
    {
        key: "pro",
        name: "Pro",
        price: "$24",
        period: "/month",
        description: "For professionals & agencies",
        features: [
            "1000 generations per month",
            "Priority generation speed",
            "Custom presets & templates",
            "Unlimited prompt library",
            "Version control & audit logs",
            "Advanced parameter control",
            "API access (coming soon)",
            "Priority support",
        ],
        cta: "Go Pro",
        highlighted: true,
        generations: 1000,
    },
    {
        key: "business",
        name: "Business",
        price: "$49",
        period: "/month",
        description: "For teams that scale",
        features: [
            "3000 generations per month",
            "Team collaboration",
            "Custom templates",
            "Dedicated support",
            "SSO & Invoice billing",
        ],
        cta: "Contact Sales",
        highlighted: false,
        generations: 3000,
    },
];
