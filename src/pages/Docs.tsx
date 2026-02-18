import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";

const exampleJson = `{
  "prompt": "A serene Japanese garden with cherry blossoms...",
  "negative_prompt": "blurry, low quality, distorted",
  "aspect_ratio": "16:9",
  "style_preset": "photorealistic",
  "seed": 42,
  "guidance_scale": 7.5,
  "output_format": "png"
}`;

export default function Docs() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold">Documentation</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Learn how to use your generated prompts in Google AI Studio.
          </p>

          <div className="mt-12 space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Generate Your Prompt</h2>
              <p className="text-muted-foreground leading-relaxed">
                Open the <a href="/generator" className="text-primary underline">Prompt Generator</a>, fill in your desired parameters (subject, style, mood, etc.), and click <strong>Generate Prompt</strong>. You'll receive a validated JSON output and a human-readable explanation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Copy the JSON</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Click the <strong>Copy</strong> button on the JSON output panel. The prompt is schema-validated and ready to paste directly into Google AI Studio.
              </p>
              <CodeBlock code={exampleJson} />
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Use in Google AI Studio</h2>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground leading-relaxed">
                <li>Open <strong>Google AI Studio</strong> (aistudio.google.com)</li>
                <li>Select <strong>Create new prompt</strong></li>
                <li>Choose your model (Imagen, etc.)</li>
                <li>Paste the <code className="rounded bg-secondary px-1.5 py-0.5 text-sm">prompt</code> field as your main instruction</li>
                <li>Configure aspect ratio and other settings to match the JSON values</li>
                <li>Click <strong>Generate</strong></li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Tips for Best Results</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                <li>Use the <strong>negative prompt</strong> to exclude unwanted elements</li>
                <li>Adjust the <strong>realism level</strong> slider for more creative vs photorealistic output</li>
                <li>Save successful prompts to your <strong>Library</strong> for reuse</li>
                <li>Create <strong>Presets</strong> for your most common workflows</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
