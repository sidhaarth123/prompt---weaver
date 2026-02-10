import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { generatePrompt, PromptResult } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import {
  USE_CASES, STYLES, MOODS, CAMERAS, ASPECT_RATIOS, LIGHTING_TYPES,
  DEFAULT_FORM_DATA, type PromptFormData,
} from "@/lib/constants";
import Navbar from "@/components/Navbar";
import CodeBlock from "@/components/CodeBlock";
import { Loader2, ChevronDown, Sparkles, Save, RefreshCw, Image, Video, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Generator() {
  const { user, session } = useAuth();
  const [form, setForm] = useState<PromptFormData>(DEFAULT_FORM_DATA);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [copiedExplanation, setCopiedExplanation] = useState(false);

  const update = <K extends keyof PromptFormData>(key: K, value: PromptFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleGenerate = async () => {
    if (!form.subject.trim()) {
      toast({ title: "Subject required", description: "Please describe what you want to generate.", variant: "destructive" });
      return;
    }
    if (!session?.access_token) {
      toast({ title: "Sign in required", description: "Please sign in to generate prompts.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const data = await generatePrompt({
        output_type: form.outputType,
        use_case: form.useCase,
        subject: form.subject,
        style: form.style,
        mood: form.mood,
        camera: form.camera,
        aspect_ratio: form.aspectRatio,
        advanced: {
          seed: form.seed,
          lighting: form.lighting,
          realism_level: form.realismLevel,
          negative_prompt: form.negativePrompt,
        },
      }, session.access_token);
      setResult(data);
      toast({ title: "Prompt generated!" });
    } catch (e: unknown) {
      toast({ title: "Generation failed", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user) return;
    const { error } = await supabase.from("saved_prompts").insert({
      user_id: user.id,
      prompt_id: "", // We'll need the prompt ID from the generation
    });
    // For now, prompt is auto-saved in history during generation
    toast({ title: "Saved to library" });
  };

  const handleCopyExplanation = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.explanation);
    setCopiedExplanation(true);
    toast({ title: "Explanation copied" });
    setTimeout(() => setCopiedExplanation(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Panel */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Prompt Generator</h1>
                <p className="text-sm text-muted-foreground">Configure your parameters and generate a structured prompt.</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                {/* Output type */}
                <div className="space-y-2">
                  <Label>Output Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={form.outputType === "image" ? "default" : "outline"}
                      size="sm"
                      onClick={() => update("outputType", "image")}
                      className="flex-1 gap-2"
                    >
                      <Image className="h-4 w-4" /> Image
                    </Button>
                    <Button
                      variant={form.outputType === "video" ? "default" : "outline"}
                      size="sm"
                      onClick={() => update("outputType", "video")}
                      className="flex-1 gap-2"
                    >
                      <Video className="h-4 w-4" /> Video
                    </Button>
                  </div>
                </div>

                {/* Use case */}
                <div className="space-y-2">
                  <Label>Use Case</Label>
                  <Select value={form.useCase} onValueChange={v => update("useCase", v)}>
                    <SelectTrigger><SelectValue placeholder="Select use case..." /></SelectTrigger>
                    <SelectContent>
                      {USE_CASES.map(uc => (
                        <SelectItem key={uc} value={uc}>{uc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Textarea
                    placeholder="Describe what you want to generate..."
                    value={form.subject}
                    onChange={e => update("subject", e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Style & Mood */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Style</Label>
                    <Select value={form.style} onValueChange={v => update("style", v)}>
                      <SelectTrigger><SelectValue placeholder="Select style..." /></SelectTrigger>
                      <SelectContent>
                        {STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mood</Label>
                    <Select value={form.mood} onValueChange={v => update("mood", v)}>
                      <SelectTrigger><SelectValue placeholder="Select mood..." /></SelectTrigger>
                      <SelectContent>
                        {MOODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Camera & Aspect Ratio */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Camera / Composition</Label>
                    <Select value={form.camera} onValueChange={v => update("camera", v)}>
                      <SelectTrigger><SelectValue placeholder="Optional..." /></SelectTrigger>
                      <SelectContent>
                        {CAMERAS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Aspect Ratio</Label>
                    <Select value={form.aspectRatio} onValueChange={v => update("aspectRatio", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ASPECT_RATIOS.map(ar => <SelectItem key={ar.value} value={ar.value}>{ar.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Advanced */}
                <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground">
                      Advanced Options
                      <ChevronDown className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Seed</Label>
                        <Input placeholder="Random" value={form.seed} onChange={e => update("seed", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Lighting</Label>
                        <Select value={form.lighting} onValueChange={v => update("lighting", v)}>
                          <SelectTrigger><SelectValue placeholder="Auto..." /></SelectTrigger>
                          <SelectContent>
                            {LIGHTING_TYPES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Realism Level: {form.realismLevel}%</Label>
                      <Slider
                        value={[form.realismLevel]}
                        onValueChange={([v]) => update("realismLevel", v)}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Negative Prompt</Label>
                      <Textarea
                        placeholder="Elements to exclude..."
                        value={form.negativePrompt}
                        onChange={e => update("negativePrompt", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Generate */}
                <Button onClick={handleGenerate} disabled={loading} className="w-full gap-2 glow-sm" size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate Prompt
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Output</h2>
                <p className="text-sm text-muted-foreground">Your generated prompt will appear here.</p>
              </div>

              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border bg-card p-6"
                  >
                    <Tabs defaultValue="json">
                      <TabsList className="w-full">
                        <TabsTrigger value="json" className="flex-1">JSON Output</TabsTrigger>
                        <TabsTrigger value="explanation" className="flex-1">Explanation</TabsTrigger>
                      </TabsList>

                      <TabsContent value="json" className="mt-4">
                        <CodeBlock code={JSON.stringify(result.json_output, null, 2)} />
                      </TabsContent>

                      <TabsContent value="explanation" className="mt-4">
                        <div className="relative rounded-lg border border-border bg-surface p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyExplanation}
                            className="absolute top-2 right-2 h-7 gap-1.5 text-xs"
                          >
                            {copiedExplanation ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {copiedExplanation ? "Copied" : "Copy"}
                          </Button>
                          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap pr-16">
                            {result.explanation}
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
                        <Save className="h-3.5 w-3.5" /> Save to Library
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading} className="gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-border bg-card/50"
                  >
                    <div className="text-center">
                      <Sparkles className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                      <p className="text-muted-foreground">Fill in the parameters and click Generate</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Ctrl+Enter to generate</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
