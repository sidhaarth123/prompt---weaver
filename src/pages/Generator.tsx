import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { generatePrompt } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import {
  USE_CASES,
  STYLES,
  MOODS,
  CAMERAS,
  ASPECT_RATIOS,
  LIGHTING_TYPES,
  DEFAULT_FORM_DATA,
  type PromptFormData,
} from "@/lib/constants";
import Navbar from "@/components/Navbar";
import CodeBlock from "@/components/CodeBlock";
import {
  Loader2,
  ChevronDown,
  Sparkles,
  Save,
  RefreshCw,
  Copy,
  Check,
  Wand2,
  Settings2,
  Aperture,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeSelector, ICON_MAP } from "./GeneratorUI";

type PromptResult = {
  jsonPrompt: any;
  explanation: string;
  error?: string;
};

export default function Generator() {
  const { user } = useAuth();
  const [form, setForm] = useState<PromptFormData>(DEFAULT_FORM_DATA);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [copiedExplanation, setCopiedExplanation] = useState(false);

  const update = <K extends keyof PromptFormData>(key: K, value: PromptFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleGenerate = async () => {
    if (!form.subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please describe what you want to generate.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = (await generatePrompt({
        type: form.outputType,
        useCase: form.useCase,
        inputs: {
          subject: form.subject,
          style: form.style,
          mood: form.mood,
          camera: form.camera,
          aspectRatio: form.aspectRatio,
          seed: form.seed,
          lighting: form.lighting,
          realismLevel: form.realismLevel,
          negativePrompt: form.negativePrompt,
        },
      })) as PromptResult;

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult({
        jsonPrompt: data.jsonPrompt,
        explanation: data.explanation,
      });

      toast({ title: "Prompt generated!" });
    } catch (e: unknown) {
      toast({
        title: "Generation failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result?.jsonPrompt) {
      toast({
        title: "Nothing to save",
        description: "Generate a prompt first.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save prompts.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("saved_prompts")
      .insert([
        {
          user_id: user.id,
          json_prompt: result.jsonPrompt,
          explanation: result.explanation,
          use_case: form.useCase,
          output_type: form.outputType,
        },
      ]);

    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Saved to library" });
  };

  const handleCopyExplanation = async () => {
    if (!result?.explanation) return;
    await navigator.clipboard.writeText(result.explanation);
    setCopiedExplanation(true);
    toast({ title: "Explanation copied" });
    setTimeout(() => setCopiedExplanation(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="grid lg:grid-cols-[1fr,480px] gap-8 items-start">

          {/* LEFT COLUMN: Configuration */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Section */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                <span className="gradient-text">Prompt Engine</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Craft professional AI prompts with precision control.
              </p>
            </div>

            {/* Type Selector */}
            <section className="space-y-4">
              <Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider ml-1">
                Generation Mode
              </Label>
              <TypeSelector
                value={form.outputType}
                onChange={(v) => update("outputType", v)}
              />
            </section>

            {/* Core Parameters Card */}
            <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-sm ring-1 ring-white/5 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Core Parameters</h3>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label className="ml-1">Subject Description</Label>
                <div className="relative">
                  <Textarea
                    placeholder="Describe your subject, scene, and action in detail..."
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className="min-h-[120px] resize-y bg-background/50 border-white/10 focus:border-primary/50 transition-all text-base leading-relaxed p-4 rounded-xl"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground/50 pointer-events-none">
                    Markdown supported
                  </div>
                </div>
              </div>

              {/* Use Case & Style Grid */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="ml-1">Use Case</Label>
                  <Select value={form.useCase} onValueChange={(v) => update("useCase", v)}>
                    <SelectTrigger className="h-11 rounded-lg bg-background/50 border-white/10">
                      <SelectValue placeholder="Select purpose..." />
                    </SelectTrigger>
                    <SelectContent>
                      {USE_CASES.map((uc) => (
                        <SelectItem key={uc} value={uc}>
                          <span className="flex items-center gap-2">
                            {ICON_MAP[uc] || <Sparkles className="h-4 w-4" />}
                            {uc}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="ml-1">Art Style</Label>
                  <Select value={form.style} onValueChange={(v) => update("style", v)}>
                    <SelectTrigger className="h-11 rounded-lg bg-background/50 border-white/10">
                      <SelectValue placeholder="Select style..." />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map((s) => (
                        <SelectItem key={s} value={s}>
                          <span className="flex items-center gap-2">
                            {ICON_MAP[s] || <Sparkles className="h-4 w-4" />}
                            {s}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mood */}
              <div className="space-y-2">
                <Label className="ml-1">Atmosphere & Mood</Label>
                <Select value={form.mood} onValueChange={(v) => update("mood", v)}>
                  <SelectTrigger className="h-11 rounded-lg bg-background/50 border-white/10">
                    <SelectValue placeholder="Set the mood..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOODS.map((m) => (
                      <SelectItem key={m} value={m}>
                        <span className="flex items-center gap-2">
                          {ICON_MAP[m] || <Sparkles className="h-4 w-4" />}
                          {m}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technical Specs Card */}
            <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-xl p-6 shadow-sm ring-1 ring-white/5 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Aperture className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Composition & Camera</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="ml-1">Camera Angle</Label>
                  <Select value={form.camera} onValueChange={(v) => update("camera", v)}>
                    <SelectTrigger className="h-11 rounded-lg bg-background/50 border-white/10">
                      <SelectValue placeholder="Default" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAMERAS.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="ml-1">Aspect Ratio</Label>
                  <Select
                    value={form.aspectRatio}
                    onValueChange={(v) => update("aspectRatio", v)}
                  >
                    <SelectTrigger className="h-11 rounded-lg bg-background/50 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASPECT_RATIOS.map((ar) => (
                        <SelectItem key={ar.value} value={ar.value}>
                          <span className="flex items-center text-left">
                            <span className="font-medium mr-2 w-10">{ar.value}</span>
                            <span className="text-muted-foreground text-xs">{ar.label.split("(")[1].replace(")", "")}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Advanced & Generate */}
            <div className="space-y-6">
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 h-auto rounded-xl border border-dashed border-border/50 hover:bg-accent/5 hover:border-sidebar-ring/50 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4" />
                      Advanced Settings
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${advancedOpen ? "rotate-180" : ""
                        }`}
                    />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-6 pt-6 animate-in slide-in-from-top-2">
                  <div className="rounded-xl bg-card/30 p-5 space-y-6 border border-border/40">

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label>Seed</Label>
                        <Input
                          placeholder="Random (-1)"
                          value={form.seed}
                          onChange={(e) => update("seed", e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Lighting</Label>
                        <Select
                          value={form.lighting}
                          onValueChange={(v) => update("lighting", v)}
                        >
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Auto" />
                          </SelectTrigger>
                          <SelectContent>
                            {LIGHTING_TYPES.map((l) => (
                              <SelectItem key={l} value={l}>{l}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Stylization Strength / Realism</Label>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                          {form.realismLevel}%
                        </span>
                      </div>
                      <Slider
                        value={[form.realismLevel]}
                        onValueChange={([v]) => update("realismLevel", v)}
                        min={0}
                        max={100}
                        step={5}
                        className="py-2"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Negative Prompt</Label>
                      <Textarea
                        placeholder="Elements to avoid (e.g. blurry, low quality, distorted)..."
                        value={form.negativePrompt}
                        onChange={(e) => update("negativePrompt", e.target.value)}
                        rows={2}
                        className="bg-background/50 resize-none"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                size="lg"
                className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 bg-gradient-to-r from-primary via-purple-500 to-indigo-600 hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Weaving Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Prompt
                  </>
                )}
              </Button>
            </div>

          </div>

          {/* RIGHT COLUMN: Output (Sticky) */}
          <div className="lg:sticky lg:top-24 space-y-6 h-fit animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">Result</h2>
              {result && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" /> Generated
                </span>
              )}
            </div>

            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col"
                  >
                    <Tabs defaultValue="json" className="flex-1 flex flex-col">
                      <div className="border-b border-border bg-muted/30 p-2">
                        <TabsList className="w-full bg-background/50 border border-border/50">
                          <TabsTrigger value="json" className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                            JSON Output
                          </TabsTrigger>
                          <TabsTrigger value="explanation" className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                            Explanation
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <div className="flex-1 p-0 overflow-hidden relative group">
                        <TabsContent value="json" className="m-0 h-full max-h-[600px] overflow-auto">
                          <div className="p-4">
                            <CodeBlock code={JSON.stringify(result.jsonPrompt, null, 2)} />
                          </div>
                        </TabsContent>

                        <TabsContent value="explanation" className="m-0 h-full overflow-auto">
                          <div className="p-6 relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCopyExplanation}
                              className="absolute top-4 right-4 h-8 w-8 p-0 rounded-full bg-background/80 backdrop-blur border border-border/50 hover:bg-primary/10"
                            >
                              {copiedExplanation ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap pr-4">
                              {result.explanation}
                            </p>
                          </div>
                        </TabsContent>
                      </div>

                      <div className="p-4 border-t border-border bg-muted/10 grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={handleSave} className="w-full hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                          <Save className="mr-2 h-4 w-4" /> Save
                        </Button>
                        <Button variant="outline" onClick={handleGenerate} className="w-full">
                          <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                        </Button>
                      </div>
                    </Tabs>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/20 p-8 text-center min-h-[400px]"
                  >
                    <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-4 animate-pulse">
                      <Sparkles className="h-10 w-10 text-primary/40" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">Ready to Create</h3>
                    <p className="text-sm text-muted-foreground max-w-[200px] mt-2">
                      Configure your settings on the left and hit generate to see the magic happen.
                    </p>
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
