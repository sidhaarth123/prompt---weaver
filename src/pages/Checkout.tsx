import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Check, ArrowRight, Shield, Lock, Calendar, CreditCard, User as UserIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/* ─── Plan catalog ──────────────────────────────────── */
const PLAN_CATALOG = {
    starter: {
        name: "Starter Plan",
        monthly: 12,
        annualMo: 9.6,
        desc: "For creators & small teams",
        features: [
            "300 generations per month",
            "All styles, moods & cameras",
            "Advanced controls (seed, lighting)",
            "Prompt library & history",
            "Export-ready JSON for AI Studio",
            "Email support",
        ],
    },
    pro: {
        name: "Pro Plan",
        monthly: 24,
        annualMo: 19.2,
        desc: "For professionals & agencies",
        features: [
            "1,000 generations per month",
            "Priority generation speed",
            "Custom presets & templates",
            "Unlimited prompt library",
            "API access (coming soon)",
            "Priority support",
        ],
    },
    business: {
        name: "Business Plan",
        monthly: 49,
        annualMo: 39.2,
        desc: "For teams that scale",
        features: [
            "3,000 generations per month",
            "Team collaboration",
            "Custom templates",
            "Dedicated support",
            "SSO & Invoice billing",
        ],
    },
} as const;

type PlanKey = keyof typeof PLAN_CATALOG;

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const planId = (searchParams.get("plan") ?? "pro") as PlanKey;
    const plan = PLAN_CATALOG[planId] ?? PLAN_CATALOG.pro;

    const [annualBilling, setAnnualBilling] = useState(true);
    const [name, setName] = useState("");
    const [cardNum, setCardNum] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);

    const price = annualBilling ? plan.annualMo : plan.monthly;
    const subtotal = price.toFixed(2);
    const total = price.toFixed(2);

    /* Format helpers */
    const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const formatExpiry = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreed) { toast({ title: "Please accept the terms to continue.", variant: "destructive" }); return; }
        if (!name.trim()) { toast({ title: "Please enter your cardholder name.", variant: "destructive" }); return; }
        setLoading(true);
        setTimeout(() => {
            const billing = annualBilling ? "annual" : "monthly";
            navigate(`/payment-success?plan=${planId}&billing=${billing}`);
        }, 2000);
    };

    /* Shared input wrapper */
    const InputWrap = ({ children }: { children: React.ReactNode }) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#1a1a2e", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", padding: "0 16px", height: 52 }}>
            {children}
        </div>
    );

    const inputSt: React.CSSProperties = {
        flex: 1, background: "transparent", border: "none", outline: "none",
        fontSize: 14, color: "rgba(255,255,255,0.75)", fontFamily: "inherit",
    };

    /* Toggle switch */
    const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
        <button type="button" onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: on ? "linear-gradient(90deg,#7c3aed,#6366f1)" : "rgba(255,255,255,0.15)", position: "relative", transition: "background .25s", flexShrink: 0 }}>
            <span style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
        </button>
    );

    return (
        <div style={{ minHeight: "100vh", background: "#0a0a14", display: "flex", flexDirection: "column" }}>
            <Navbar />

            <div style={{ flex: 1, padding: "48px 48px 60px", maxWidth: 980, margin: "0 auto", width: "100%" }}>

                {/* Page heading */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 34, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                        Upgrade to {plan.name.replace(" Plan", "")}
                    </h1>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                        Join thousands of creators weaving the future of AI prompts.
                    </p>
                </div>

                {/* Two-column layout */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 28, alignItems: "start" }}>

                    {/* ── LEFT — Plan Summary ── */}
                    <div>
                        <div style={{ borderRadius: 16, background: "#111120", border: "1px solid rgba(255,255,255,0.08)", padding: "24px", position: "relative" }}>

                            {/* CURRENT CHOICE badge */}
                            <div style={{ position: "absolute", top: 20, right: 20, padding: "4px 12px", borderRadius: 999, background: "rgba(109,40,217,0.25)", border: "1px solid rgba(139,92,246,0.5)", fontSize: 10, fontWeight: 800, color: "#c4b5fd", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                Current Choice
                            </div>

                            {/* Plan name */}
                            <p style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>{plan.name}</p>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                                <span style={{ fontSize: 40, fontWeight: 800, color: "#fff" }}>${Math.round(price)}</span>
                                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>/month</span>
                            </div>

                            {/* Annual billing toggle */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 10, background: "#18182a", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 2px" }}>Annual Billing</p>
                                    <p style={{ fontSize: 12, color: "#4ade80", margin: 0 }}>Save 20% yearly</p>
                                </div>
                                <Toggle on={annualBilling} onToggle={() => setAnnualBilling(o => !o)} />
                            </div>

                            {/* What's included */}
                            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 14px" }}>What's Included:</p>
                            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 12 }}>
                                {plan.features.map(f => (
                                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Check style={{ width: 11, height: 11, color: "#fff", strokeWidth: 3 }} />
                                        </div>
                                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Pricing breakdown */}
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Subtotal</span>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>${subtotal}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Tax</span>
                                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>$0.00</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Total</span>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: "#818cf8" }}>${total}</span>
                                </div>
                            </div>
                        </div>

                        {/* 30-day guarantee */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
                            <Shield style={{ width: 15, height: 15, color: "rgba(255,255,255,0.4)" }} />
                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>30-day money-back guarantee</span>
                        </div>
                    </div>

                    {/* ── RIGHT — Payment Details ── */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ borderRadius: 16, background: "#111120", border: "1px solid rgba(255,255,255,0.08)", padding: "28px" }}>

                            {/* Header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                                <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>Payment Details</p>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {["VISA", "MC"].map(t => (
                                        <div key={t} style={{ width: 40, height: 26, borderRadius: 5, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>{t}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Cardholder Name */}
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 8 }}>Cardholder Name</label>
                                <InputWrap>
                                    <UserIcon style={{ width: 16, height: 16, color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                                    <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={inputSt} />
                                </InputWrap>
                            </div>

                            {/* Card Number */}
                            <div style={{ marginBottom: 18 }}>
                                <label style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 8 }}>Card Number</label>
                                <InputWrap>
                                    <CreditCard style={{ width: 16, height: 16, color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                                    <input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19} style={{ ...inputSt, letterSpacing: "0.08em" }} />
                                </InputWrap>
                            </div>

                            {/* Expiry + CVV */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
                                <div>
                                    <label style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 8 }}>Expiry Date</label>
                                    <InputWrap>
                                        <Calendar style={{ width: 15, height: 15, color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                                        <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} style={inputSt} />
                                    </InputWrap>
                                </div>
                                <div>
                                    <label style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 8 }}>CVV</label>
                                    <InputWrap>
                                        <Lock style={{ width: 15, height: 15, color: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                                        <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" maxLength={4} type="password" style={inputSt} />
                                    </InputWrap>
                                </div>
                            </div>

                            {/* Terms agreement */}
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
                                <button type="button" onClick={() => setAgreed(o => !o)} style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1, border: agreed ? "none" : "2px solid rgba(255,255,255,0.2)", background: agreed ? "#6366f1" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {agreed && <Check style={{ width: 10, height: 10, color: "#fff", strokeWidth: 3 }} />}
                                </button>
                                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6 }}>
                                    By completing this purchase, you agree to our{" "}
                                    <Link to="/terms" style={{ color: "#818cf8", textDecoration: "none" }}>Terms of Service</Link>{" "}and{" "}
                                    <Link to="/privacy" style={{ color: "#818cf8", textDecoration: "none" }}>Privacy Policy</Link>.
                                    {" "}Your subscription will renew automatically.
                                </p>
                            </div>

                            {/* Complete Purchase button */}
                            <button type="submit" disabled={loading} style={{ width: "100%", height: 54, borderRadius: 12, border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#fff", background: "linear-gradient(90deg, #7c3aed, #6366f1, #818cf8)", boxShadow: "0 4px 30px rgba(99,60,220,0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: loading ? 0.7 : 1, transition: "opacity .2s", marginBottom: 18 }}>
                                {loading ? "Processing…" : <><span>Complete Purchase</span> <ArrowRight style={{ width: 18, height: 18 }} /></>}
                            </button>

                            {/* Secure label */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                                <Lock style={{ width: 13, height: 13, color: "#4ade80" }} />
                                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Secure 256-bit Encrypted Checkout</span>
                            </div>
                        </div>

                        {/* Payment logos */}
                        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
                            {["VISA", "MC", "AMEX"].map(t => (
                                <div key={t} style={{ width: 48, height: 30, borderRadius: 6, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>{t}</div>
                            ))}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
