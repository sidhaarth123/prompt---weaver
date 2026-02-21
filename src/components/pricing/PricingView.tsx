import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Check, ChevronDown } from "lucide-react";

/* ─── Plan data ─────────────────────────────────────── */
const PLANS = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "/month",
        desc: "Try Prompt Weaver risk-free",
        popular: false,
        features: [
            "10 generations per month",
            "Image & video prompt formats",
            "JSON + explanation output",
            "Copy to clipboard",
            "Basic styles & moods",
            "Save up to 10 prompts",
        ],
        cta: "Current Plan",
        ctaVariant: "ghost" as const,
        href: null,
    },
    {
        id: "starter",
        name: "Starter",
        price: "$12",
        period: "/month",
        desc: "For creators & small teams",
        popular: false,
        features: [
            "300 generations per month",
            "All styles, moods & cameras",
            "Advanced controls (seed, lighting)",
            "Prompt library & history",
            "Export-ready JSON for AI Studio",
            "Email support",
        ],
        cta: "Upgrade to Starter",
        ctaVariant: "ghost" as const,
        href: "/checkout?plan=starter",
    },
    {
        id: "pro",
        name: "Pro",
        price: "$24",
        period: "/month",
        desc: "For professionals & agencies",
        popular: true,
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
        ctaVariant: "filled" as const,
        href: "/checkout?plan=pro",
    },
    {
        id: "business",
        name: "Business",
        price: "$49",
        period: "/month",
        desc: "For teams that scale",
        popular: false,
        features: [
            "3000 generations per month",
            "Team collaboration",
            "Custom templates",
            "Dedicated support",
            "SSO & Invoice billing",
        ],
        cta: "Contact Sales",
        ctaVariant: "ghost" as const,
        href: "/checkout?plan=business",
    },
];

/* ─── FAQ data ──────────────────────────────────────── */
const FAQS = [
    { q: "What are credits?", a: "Credits are the currency used to generate prompts. Each generation consumes 1 credit. Credits reset monthly based on your plan." },
    { q: "Can I upgrade or downgrade anytime?", a: "Yes! You can change your plan at any time. Upgrades take effect immediately; downgrades apply at the start of the next billing cycle." },
    { q: "How do the different generators work?", a: "Each generator is specialised for a content type — image, video, content writing, coding. They all use AI to craft platform-optimised prompts." },
    { q: "Can I use prompts commercially?", a: "Absolutely. All prompts generated on any paid plan are yours to use commercially without restriction." },
    { q: "What happens to unused credits?", a: "Unused credits expire at the end of each billing cycle. We recommend choosing a plan that matches your expected monthly usage." },
    { q: "How does the plan billing work?", a: "All plans are billed monthly. We accept major credit cards and PayPal. You'll receive a receipt via email after each payment." },
];

/* ─── FAQ accordion item ────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            onClick={() => setOpen(o => !o)}
            style={{
                borderRadius: 10, cursor: "pointer",
                border: "1px solid rgba(99,102,241,0.3)",
                background: "rgba(10,10,30,0.7)",
                backdropFilter: "blur(10px)",
                overflow: "hidden", transition: "border .15s",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{q}</span>
                <ChevronDown style={{
                    width: 18, height: 18, color: "rgba(255,255,255,0.4)", flexShrink: 0,
                    transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s",
                }} />
            </div>
            {open && (
                <div style={{ padding: "0 18px 14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: "12px 0 0", lineHeight: 1.65 }}>{a}</p>
                </div>
            )}
        </div>
    );
}

/* ─── Main component ─────────────────────────────────── */
export default function PricingView() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #060618 0%, #090924 50%, #060618 100%)",
            display: "flex", flexDirection: "column",
            position: "relative", overflow: "hidden",
        }}>
            {/* Ambient glow blobs */}
            <div style={{ position: "fixed", top: "10%", left: "20%", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(79,70,229,0.2) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", top: "20%", right: "10%", width: 500, height: 500, background: "radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "10%", left: "30%", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(109,40,217,0.12) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
            {/* Stars */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.35,
                backgroundImage: "radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 70% 10%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 45% 65%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 80% 55%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 5% 85%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 92% 80%, rgba(255,255,255,0.4) 0%, transparent 100%)",
            }} />

            <Navbar />

            {/* ── Page content ── */}
            <div style={{ flex: 1, position: "relative", zIndex: 1, padding: "48px 32px 60px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>

                {/* Heading */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <h1 style={{ fontSize: 40, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
                        Start free and scale as you grow.
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                        No hidden fees. Upgrade or cancel anytime.
                    </p>
                </div>

                {/* ── Pricing cards ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 64 }}>
                    {PLANS.map(plan => (
                        <div
                            key={plan.id}
                            style={{
                                borderRadius: 16, padding: "24px 20px",
                                border: plan.popular
                                    ? "1.5px solid rgba(139,92,246,0.8)"
                                    : "1px solid rgba(99,102,241,0.3)",
                                background: plan.popular
                                    ? "rgba(10,8,35,0.9)"
                                    : "rgba(10,10,28,0.8)",
                                backdropFilter: "blur(16px)",
                                boxShadow: plan.popular
                                    ? "0 0 40px rgba(109,40,217,0.25), 0 0 80px rgba(109,40,217,0.1), inset 0 1px 0 rgba(255,255,255,0.06)"
                                    : "0 0 20px rgba(79,70,229,0.08), inset 0 1px 0 rgba(255,255,255,0.03)",
                                position: "relative",
                                display: "flex", flexDirection: "column",
                            }}
                        >
                            {/* Most Popular badge */}
                            {plan.popular && (
                                <div style={{
                                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                                    padding: "4px 16px", borderRadius: 999,
                                    background: "linear-gradient(90deg, #7c3aed, #6366f1)",
                                    fontSize: 12, fontWeight: 700, color: "#fff",
                                    border: "1px solid rgba(139,92,246,0.6)",
                                    boxShadow: "0 0 20px rgba(109,40,217,0.5)",
                                    whiteSpace: "nowrap",
                                }}>Most Popular</div>
                            )}

                            {/* Plan name + price */}
                            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
                                <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{plan.name}</span>
                                <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                                    {plan.price}
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>{plan.period}</span>
                                </span>
                            </div>
                            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "0 0 20px" }}>{plan.desc}</p>

                            {/* Features */}
                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                                {plan.features.map(f => (
                                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                                        <Check style={{ width: 14, height: 14, color: "#6366f1", flexShrink: 0, marginTop: 2 }} />
                                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.4 }}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA button */}
                            {plan.href ? (
                                <Link to={plan.href} style={{ textDecoration: "none" }}>
                                    <button style={{
                                        width: "100%", height: 42, borderRadius: 10,
                                        border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.15)",
                                        cursor: "pointer", fontSize: 14, fontWeight: 700,
                                        color: "#fff",
                                        background: plan.popular
                                            ? "linear-gradient(90deg, #7c3aed, #6366f1)"
                                            : "rgba(255,255,255,0.06)",
                                        boxShadow: plan.popular ? "0 4px 20px rgba(99,60,220,0.4)" : "none",
                                        transition: "opacity .15s",
                                    }}>
                                        {plan.cta}
                                    </button>
                                </Link>
                            ) : (
                                <button style={{
                                    width: "100%", height: 42, borderRadius: 10,
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    cursor: "default", fontSize: 14, fontWeight: 700,
                                    color: "rgba(255,255,255,0.6)",
                                    background: "rgba(255,255,255,0.04)",
                                }}>
                                    {plan.cta}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── FAQ section ── */}
                <div>
                    <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 32px", letterSpacing: "-0.3px" }}>
                        Frequently Asked Questions
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                        {FAQS.map(faq => (
                            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
