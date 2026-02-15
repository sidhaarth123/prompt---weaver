
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Check,
    ChevronDown,
    Command,
    CreditCard,
    Image as ImageIcon,
    LayoutTemplate,
    Lightbulb,
    Maximize,
    MessageSquare,
    MonitorPlay,
    Music,
    Palette,
    Settings2,
    Sparkles,
    Type,
    Video,
    Wand2,
    Aperture,
    Camera,
    Sun,
    Moon
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

// --- Visual Mappings ---

export const ICON_MAP: Record<string, React.ReactNode> = {
    "Product photo": <CreditCard className="w-4 h-4" />,
    "Cinematic video": <MonitorPlay className="w-4 h-4" />,
    "Ad creative": <Lightbulb className="w-4 h-4" />,
    "Social media": <MessageSquare className="w-4 h-4" />,
    "Portrait": <ImageIcon className="w-4 h-4" />,
    "Landscape": <ImageIcon className="w-4 h-4" />,
    "Abstract art": <Palette className="w-4 h-4" />,
    "Architecture": <LayoutTemplate className="w-4 h-4" />,
    "Food photography": <Command className="w-4 h-4" />, // Placeholder
    "Fashion": <Wand2 className="w-4 h-4" />,

    // Styles
    "Photorealistic": <Camera className="w-4 h-4" />,
    "Cinematic": <MonitorPlay className="w-4 h-4" />,
    "Anime": <Sparkles className="w-4 h-4" />,
    "Watercolor": <Palette className="w-4 h-4" />,
    "3D Render": <BoxIcon className="w-4 h-4" />,
    "Oil painting": <Palette className="w-4 h-4" />,
    "Digital art": <MonitorPlay className="w-4 h-4" />,

    // Moods
    "Dramatic": <Moon className="w-4 h-4" />,
    "Serene": <Sun className="w-4 h-4" />,
    "Energetic": <ZapIcon className="w-4 h-4" />,
};

function BoxIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    );
}

function ZapIcon({ className }: { className?: string }) {
    return <Sparkles className={className} />;
}

// --- Components ---

interface SectionHeaderProps {
    title: string;
    description?: string;
    count?: string;
}

export function SectionHeader({ title, description, count }: SectionHeaderProps) {
    return (
        <div className="mb-6 space-y-1">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-white/90">{title}</h2>
                {count && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {count}
                    </span>
                )}
            </div>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    );
}

export function AnimatedCard({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={cn(
                "group relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

export function GradientLabel({ children }: { children: React.ReactNode }) {
    return (
        <Label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
            {children}
        </Label>
    );
}

interface OptionCardProps {
    selected: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    description?: string;
}

export function OptionCard({ selected, onClick, icon, label, description }: OptionCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "relative flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all hover:bg-muted/50 w-full",
                selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card/50 hover:border-primary/50"
            )}
        >
            <div className={cn(
                "rounded-lg p-2 transition-colors",
                selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
                {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
            </div>
            <div className="space-y-1">
                <span className={cn("text-sm font-medium leading-none", selected && "text-primary")}>
                    {label}
                </span>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
            {selected && (
                <div className="absolute right-4 top-4 text-primary">
                    <Check className="h-4 w-4" />
                </div>
            )}
        </button>
    );
}

export function TypeSelector({
    value,
    onChange
}: {
    value: "image" | "video";
    onChange: (v: "image" | "video") => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <OptionCard
                selected={value === "image"}
                onClick={() => onChange("image")}
                icon={<ImageIcon />}
                label="Image Generation"
                description="Static visuals, photos, and art"
            />
            <OptionCard
                selected={value === "video"}
                onClick={() => onChange("video")}
                icon={<Video />}
                label="Video Generation"
                description="Motion, cinematic shots, and clips"
            />
        </div>
    );
}
