import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>

          <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>By accessing or using PromptForge AI, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
              <p>PromptForge AI is an AI-powered prompt generator that creates structured JSON prompts for Google AI Studio. We do not generate images or videos — we generate prompts that you use in third-party tools.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
              <p>You are responsible for maintaining the security of your account credentials. You must provide accurate information during registration. One person per account — no shared accounts.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Usage Limits</h2>
              <p>Free tier users are limited to 5 prompt generations per day. Pro subscribers have unlimited access. We reserve the right to enforce rate limits to ensure service quality.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
              <p>You retain ownership of the prompts you generate. PromptForge AI retains rights to the underlying technology, algorithms, and user interface.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
              <p>PromptForge AI is provided "as is" without warranties. We are not liable for any damages arising from your use of the service or the prompts generated.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
              <p>For questions about these terms, contact us at legal@promptforge.ai.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
