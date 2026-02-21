import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Check, LayoutDashboard, Download } from "lucide-react";
import { useAuth } from "@/lib/auth";

/* ─── Plan data ──────────────────────────────────────── */
const PLAN_DETAILS: Record<string, { label: string; credits: string; amount: string }> = {
    starter: { label: "Starter Plan", credits: "300", amount: "$12.00" },
    pro: { label: "Pro Plan", credits: "1,000", amount: "$24.00" },
    business: { label: "Business Plan", credits: "3,000", amount: "$49.00" },
};

/* ─── Random transaction ID ─────────────────────────── */
function genTxId(plan: string) {
    const num = Math.floor(10000 + Math.random() * 89999);
    return `#PW-${num}-${plan.slice(0, 3).toUpperCase()}`;
}

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const planId = searchParams.get("plan") ?? "pro";
    const billing = searchParams.get("billing") ?? "monthly";
    const plan = PLAN_DETAILS[planId] ?? PLAN_DETAILS.pro;
    const { user } = useAuth();
    const [txId] = useState(() => genTxId(planId));

    /* Get first name from user metadata or email */
    const firstName = (() => {
        const meta = (user as any)?.user_metadata;
        if (meta?.full_name) return meta.full_name.split(" ")[0];
        if (meta?.name) return meta.name.split(" ")[0];
        if (user?.email) return user.email.split("@")[0];
        return "Alex";
    })();

    /* Entrance animation state */
    const [visible, setVisible] = useState(false);
    useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

    const handleDownload = () => {
        const content = [
            "PROMPT WEAVER — INVOICE",
            "========================",
            `Plan:         ${plan.label}`,
            `Billing:      ${billing === "annual" ? "Annual" : "Monthly"}`,
            `Transaction:  ${txId}`,
            `Amount:       ${plan.amount}`,
            `Date:         ${new Date().toLocaleDateString()}`,
            "",
            "Thank you for your purchase!",
        ].join("\n");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement("a"), { href: url, download: `invoice-${txId.slice(1)}.txt` });
        a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(180deg, #0a0b1e 0%, #0d0f26 60%, #080916 100%)",
            display: "flex", flexDirection: "column",
            position: "relative", overflow: "hidden",
        }}>
            {/* Ambient glows */}
            <div style={{ position: "fixed", top: "10%", left: "10%", width: 600, height: 600, background: "radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", top: "30%", right: "15%", width: 400, height: 400, background: "radial-gradient(ellipse, rgba(79,70,229,0.1) 0%, transparent 70%)", filter: "blur(70px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "5%", left: "30%", width: 500, height: 300, background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

            {/* Decorative dots */}
            <div style={{ position: "fixed", top: "38%", left: "22%", width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", opacity: 0.6, zIndex: 0 }} />
            <div style={{ position: "fixed", top: "55%", right: "30%", width: 5, height: 5, borderRadius: "50%", background: "#6366f1", opacity: 0.5, zIndex: 0 }} />
            <div style={{ position: "fixed", top: "65%", left: "36%", width: 4, height: 4, borderRadius: "50%", background: "#818cf8", opacity: 0.5, zIndex: 0 }} />

            <Navbar />

            {/* Center content */}
            <div style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", padding: "40px 24px 60px",
                position: "relative", zIndex: 1,
                opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity .5s ease, transform .5s ease",
            }}>

                {/* ── Success icon ── */}
                <div style={{ position: "relative", marginBottom: 32 }}>
                    {/* Outer dark ring */}
                    <div style={{
                        width: 96, height: 96, borderRadius: "50%",
                        background: "rgba(8,10,32,0.9)",
                        border: "3px solid rgba(34,197,94,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 0 40px rgba(34,197,94,0.15)",
                    }}>
                        {/* Inner green circle */}
                        <div style={{
                            width: 68, height: 68, borderRadius: "50%",
                            background: "linear-gradient(135deg, #16a34a, #22c55e)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 0 24px rgba(34,197,94,0.5)",
                        }}>
                            <Check style={{ width: 32, height: 32, color: "#fff", strokeWidth: 3 }} />
                        </div>
                    </div>
                </div>

                {/* ── Heading ── */}
                <h1 style={{ fontSize: 34, fontWeight: 800, color: "#fff", margin: "0 0 14px", textAlign: "center" }}>
                    Welcome to {plan.label.replace(" Plan", "")},{" "}
                    <span style={{ color: "#818cf8" }}>{firstName}</span>!
                </h1>
                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 40px", textAlign: "center", maxWidth: 440, lineHeight: 1.6 }}>
                    Your account has been successfully upgraded and {plan.credits} credits have been added to your balance.
                </p>

                {/* ── Subscription Details card ── */}
                <div style={{
                    width: "100%", maxWidth: 380,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(13,14,34,0.9)",
                    backdropFilter: "blur(16px)",
                    overflow: "hidden",
                    marginBottom: 32,
                }}>
                    {/* Card header */}
                    <div style={{ padding: "14px 24px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>
                            Subscription Details
                        </p>
                    </div>

                    {/* Rows */}
                    <div style={{ padding: "8px 0" }}>
                        {/* Plan Type */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px" }}>
                            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Plan Type</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
                                {plan.label}
                            </span>
                        </div>

                        {/* Billing Cycle */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px" }}>
                            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Billing Cycle</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                                {billing === "annual" ? "Annual" : "Monthly"}
                            </span>
                        </div>

                        {/* Transaction ID */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px" }}>
                            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Transaction ID</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", fontFamily: "monospace" }}>{txId}</span>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "4px 24px" }} />

                        {/* Total Amount */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px" }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Total Amount</span>
                            <span style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{plan.amount}</span>
                        </div>
                    </div>
                </div>

                {/* ── Action buttons ── */}
                <div style={{ display: "flex", gap: 14, width: "100%", maxWidth: 380, marginBottom: 32 }}>
                    {/* Go to Dashboard */}
                    <Link to="/image-generator" style={{ flex: 1, textDecoration: "none" }}>
                        <button style={{
                            width: "100%", height: 56, borderRadius: 12, border: "none",
                            cursor: "pointer", fontSize: 15, fontWeight: 700, color: "#fff",
                            background: "linear-gradient(135deg, #4f46e5, #6366f1, #818cf8)",
                            boxShadow: "0 4px 24px rgba(79,70,229,0.45)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            transition: "opacity .15s",
                        }}>
                            <LayoutDashboard style={{ width: 18, height: 18 }} />
                            Go to Dashboard
                        </button>
                    </Link>

                    {/* Download Invoice */}
                    <button
                        onClick={handleDownload}
                        style={{
                            flex: 1, height: 56, borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.12)",
                            cursor: "pointer", fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.8)",
                            background: "rgba(255,255,255,0.05)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            backdropFilter: "blur(8px)",
                            transition: "background .15s",
                        }}
                    >
                        <Download style={{ width: 18, height: 18 }} />
                        Download Invoice
                    </button>
                </div>

                {/* Support link */}
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: "0 0 20px", textAlign: "center" }}>
                    Having trouble?{" "}
                    <Link to="/contact" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}>
                        Contact our support team
                    </Link>
                </p>

                {/* Secured by Stripe */}
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.2)", letterSpacing: "0.18em", textTransform: "uppercase", margin: 0, textAlign: "center" }}>
                    Transaction Secured by Stripe
                </p>

            </div>
        </div>
    );
}
