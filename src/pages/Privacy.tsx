import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-3xl px-4 prose prose-invert">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>

          <div className="mt-8 space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p>We collect information you provide directly: email address, account preferences, and generated prompt data. We also collect usage data including prompt generation frequency and feature usage patterns.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p>Your information is used to provide and improve the PromptForge AI service, manage your account and subscription, enforce usage limits, and communicate important service updates.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Data Storage & Security</h2>
              <p>All data is stored securely using industry-standard encryption. Your prompts and personal information are protected by row-level security policies ensuring only you can access your data.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Data Sharing</h2>
              <p>We do not sell your personal information. We may share data with service providers (payment processing, hosting) necessary to deliver the service, always under strict data protection agreements.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us. You can export your prompt history and delete your account through the account settings.</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
              <p>For privacy-related inquiries, please contact us at privacy@promptforge.ai.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
