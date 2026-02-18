import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { THEME, cn } from "@/lib/theme";
import { Mail, MessageSquare, Twitter } from "lucide-react";

export default function Contact() {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />
            <main className="pt-32 pb-20 relative overflow-hidden">
                {/* Background Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className={cn(THEME.container, "max-w-4xl")}>
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Get in <span className={THEME.gradientText}>Touch</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            We're here to help. Reach out with questions, feedback, or enterprise inquiries.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className={cn(THEME.glassCard, "p-8 text-center space-y-4 hover:border-primary/20 transition-colors")}>
                            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Email Support</h3>
                            <p className="text-sm text-muted-foreground">For general inquiries and support.</p>
                            <a href="mailto:support@promptweaver.com" className="text-primary hover:underline block mt-2">
                                support@promptweaver.com
                            </a>
                        </div>

                        <div className={cn(THEME.glassCard, "p-8 text-center space-y-4 hover:border-primary/20 transition-colors")}>
                            <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Twitter className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Twitter / X</h3>
                            <p className="text-sm text-muted-foreground">Follow us for updates and tips.</p>
                            <a href="https://twitter.com/promptweaver" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline block mt-2">
                                @promptweaver
                            </a>
                        </div>

                        <div className={cn(THEME.glassCard, "p-8 text-center space-y-4 hover:border-primary/20 transition-colors")}>
                            <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold">Community</h3>
                            <p className="text-sm text-muted-foreground">Join our Discord server.</p>
                            <a href="#" className="text-green-400 hover:underline block mt-2">
                                Join Discord
                            </a>
                        </div>
                    </div>

                    <div className="mt-16 p-8 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
                        <h3 className="text-xl font-semibold mb-2">Enterprise Support</h3>
                        <p className="text-muted-foreground mb-6">Need a custom plan or dedicated support for your team?</p>
                        <a
                            href="mailto:sales@promptweaver.com"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
