import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import CodeBlock from "@/components/CodeBlock";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { History as HistoryIcon, Search } from "lucide-react";
import { format } from "date-fns";

type Prompt = {
  id: string;
  output_type: string;
  use_case: string | null;
  subject: string;
  style: string | null;
  mood: string | null;
  json_output: Record<string, unknown>;
  explanation: string;
  created_at: string;
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<Prompt | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("prompts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPrompts(data as Prompt[]);
      });
  }, [user]);

  const filtered = prompts.filter(p => {
    const matchesSearch = p.subject.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || p.output_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-1">Prompt History</h1>
          <p className="text-sm text-muted-foreground mb-6">All your generated prompts in chronological order.</p>

          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search prompts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border">
              <div className="text-center">
                <HistoryIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">No prompts yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Generated prompts will appear here</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {filtered.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`w-full text-left rounded-lg border p-4 transition-all hover:border-primary/30 ${
                      selected?.id === p.id ? "border-primary bg-card" : "border-border/50 bg-card/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs capitalize">{p.output_type}</Badge>
                      <span className="text-xs text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")}</span>
                    </div>
                    <p className="text-sm font-medium truncate">{p.subject}</p>
                    {p.style && <span className="text-xs text-muted-foreground">{p.style}</span>}
                  </button>
                ))}
              </div>

              {selected && (
                <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold">{selected.subject}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="capitalize">{selected.output_type}</Badge>
                      {selected.style && <Badge variant="secondary">{selected.style}</Badge>}
                      {selected.mood && <Badge variant="secondary">{selected.mood}</Badge>}
                    </div>
                  </div>
                  <CodeBlock code={JSON.stringify(selected.json_output, null, 2)} />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Explanation</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.explanation}</p>
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
