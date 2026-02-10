import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import CodeBlock from "@/components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

type SavedPrompt = {
  id: string;
  tags: string[];
  created_at: string;
  prompt: {
    id: string;
    subject: string;
    output_type: string;
    style: string | null;
    mood: string | null;
    json_output: Record<string, unknown>;
    explanation: string;
  };
};

export default function Library() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<SavedPrompt[]>([]);
  const [selected, setSelected] = useState<SavedPrompt | null>(null);

  const fetchSaved = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("saved_prompts")
      .select("id, tags, created_at, prompt:prompts(id, subject, output_type, style, mood, json_output, explanation)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setSaved(data as unknown as SavedPrompt[]);
  };

  useEffect(() => { fetchSaved(); }, [user]);

  const handleRemove = async (id: string) => {
    await supabase.from("saved_prompts").delete().eq("id", id);
    setSaved(prev => prev.filter(s => s.id !== id));
    if (selected?.id === id) setSelected(null);
    toast({ title: "Removed from library" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-1">Saved Prompts</h1>
          <p className="text-sm text-muted-foreground mb-6">Your bookmarked prompt collection.</p>

          {saved.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border">
              <div className="text-center">
                <Bookmark className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">No saved prompts</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Save prompts from the generator to see them here</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {saved.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`w-full text-left rounded-lg border p-4 transition-all hover:border-primary/30 ${
                      selected?.id === s.id ? "border-primary bg-card" : "border-border/50 bg-card/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs capitalize">{s.prompt.output_type}</Badge>
                      <span className="text-xs text-muted-foreground">{format(new Date(s.created_at), "MMM d, yyyy")}</span>
                    </div>
                    <p className="text-sm font-medium truncate">{s.prompt.subject}</p>
                    {s.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {s.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {selected && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{selected.prompt.subject}</h3>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">{selected.prompt.output_type}</Badge>
                        {selected.prompt.style && <Badge variant="secondary">{selected.prompt.style}</Badge>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemove(selected.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <CodeBlock code={JSON.stringify(selected.prompt.json_output, null, 2)} />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Explanation</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.prompt.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
