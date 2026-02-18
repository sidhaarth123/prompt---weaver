import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { THEME, cn } from "@/lib/theme";

export default function RefundPolicy() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />
            <main className="pt-32 pb-20 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className={cn(THEME.container, "max-w-3xl prose prose-invert")}>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Refund Policy</h1>
                    <p className="text-muted-foreground text-lg mb-8">Last updated: February 2026</p>

                    <div className="space-y-8 text-muted-foreground leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">1. Satisfaction Guarantee</h2>
                            <p>
                                We stand behind our product. If you are not completely satisfied with Prompt Weaver, we offer a 14-day money-back guarantee for all initial subscription purchases.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">2. Eligibility</h2>
                            <p>
                                To be eligible for a refund, you must submit your request within 14 days of your initial purchase. This applies to both monthly and annual plans. Use of the service beyond reasonable trial limits (e.g., generating over 100 prompts) may disqualify you from a full refund at our discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">3. How to Request a Refund</h2>
                            <p>
                                To request a refund, please email us at <a href="mailto:support@promptweaver.com" className="text-primary hover:underline">support@promptweaver.com</a> with your account email address and a brief explanation of why the product didn't meet your needs. We use this feedback to improve.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">4. Processing Time</h2>
                            <p>
                                Refunds are processed within 5-10 business days. The funds will be returned to your original payment method.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-foreground mb-3">5. AppSumo Customers</h2>
                            <p>
                                If you purchased Prompt Weaver via AppSumo, please refer to AppSumo's specific refund policy (typically 60 days) and request the refund directly through your AppSumo account dashboard.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
