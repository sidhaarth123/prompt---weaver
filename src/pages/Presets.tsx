import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Preset = {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  output_type: string;
  use_case: string | null;
  style: string | null;
  mood: string | null;
  camera: string | null;
  aspect_ratio: string | null;
};

export default function Presets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("presets")
      .select("*")
      .order("is_system", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPresets(data as Preset[]);
      });
  }, [user]);

  const handleDelete = async (id: string) => {
    await supabase.from("presets").delete().eq("id", id);
    setPresets(prev => prev.filter(p => p.id !== id));
    toast({ title: "Preset deleted" });
  };

  const handleApply = (preset: Preset) => {
    // Navigate to generator with preset params as URL state
    navigate("/generator", { state: { preset } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Presets & Templates</h1>
              <p className="text-sm text-muted-foreground">Start from proven templates or your own saved combos.</p>
            </div>
          </div>

          {presets.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-border">
              <div className="text-center">
                <Layers className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">No presets yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Presets will appear here as you save them</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {presets.map(p => (
                <div key={p.id} className="rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                    </div>
                    {p.is_system ? (
                      <Badge className="text-xs">System</Badge>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge variant="outline" className="text-xs capitalize">{p.output_type}</Badge>
                    {p.style && <Badge variant="secondary" className="text-xs">{p.style}</Badge>}
                    {p.mood && <Badge variant="secondary" className="text-xs">{p.mood}</Badge>}
                    {p.use_case && <Badge variant="secondary" className="text-xs">{p.use_case}</Badge>}
                  </div>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleApply(p)}>
                    Apply Preset
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
