
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const THEME = {
    // ============================================
    // GRADIENTS - Refined, professional
    // ============================================
    primaryGradient: "bg-gradient-to-br from-indigo-600 via-primary to-purple-600 text-white",
    secondaryGradient: "bg-gradient-to-br from-gray-800 to-gray-900",
    textGradient: "bg-clip-text text-transparent bg-gradient-to-r from-white via-white/95 to-white/90",
    subtleGradient: "bg-gradient-to-b from-white/[0.03] to-transparent",

    // ============================================
    // SURFACES - Restrained depth, professional
    // ============================================
    glassCard: "rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300",
    glassCardPremium: "rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
    glassPanel: "rounded-xl border border-white/[0.06] bg-black/20 backdrop-blur-md shadow-inner",

    // Feature cards - clean, professional
    featureCard: "rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.4)] hover:border-white/[0.12] transition-all duration-400",

    // Elevated surfaces - subtle depth
    elevatedCard: "rounded-xl border border-white/[0.09] bg-gradient-to-br from-white/[0.05] to-white/[0.01] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl",

    // ============================================
    // TYPOGRAPHY - Professional hierarchy
    // ============================================
    headingXL: "text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]",
    headingLG: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight",
    headingMD: "text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight",
    headingSM: "text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight",

    subheadingLG: "text-xl sm:text-2xl text-muted-foreground/80 leading-relaxed font-normal",
    subheadingMD: "text-lg sm:text-xl text-muted-foreground/75 leading-relaxed font-normal",

    bodyLG: "text-base sm:text-lg text-muted-foreground/80 leading-relaxed",
    bodyMD: "text-sm sm:text-base text-muted-foreground/75 leading-relaxed",

    // ============================================
    // BORDERS & DIVIDERS
    // ============================================
    divider: "h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent",
    dividerVertical: "w-px h-full bg-gradient-to-b from-transparent via-white/[0.08] to-transparent",
    borderSubtle: "border-white/[0.06]",
    borderMedium: "border-white/[0.08]",
    borderStrong: "border-white/[0.1]",

    // ============================================
    // ANIMATIONS - Smooth, restrained (60fps)
    // ============================================
    fadeIn: "animate-in fade-in slide-in-from-bottom-4 duration-600 ease-out",
    fadeInUp: "animate-in fade-in slide-in-from-bottom-6 duration-500 ease-out",
    scaleIn: "animate-in zoom-in-95 duration-400 ease-out",

    hoverLift: "hover:-translate-y-0.5 transition-all duration-300 ease-out",
    hoverLiftStrong: "hover:-translate-y-1 transition-all duration-300 ease-out",
    hoverScale: "hover:scale-[1.01] active:scale-[0.99] transition-transform duration-250",

    hoverGlow: "hover:shadow-[0_0_24px_-8px_rgba(99,102,241,0.25)] transition-shadow duration-300",

    // ============================================
    // SPACING - Professional, consistent
    // ============================================
    sectionPadding: "py-20 lg:py-28",
    sectionPaddingLG: "py-28 lg:py-36",
    sectionPaddingXL: "py-36 lg:py-44",

    container: "container mx-auto px-6 lg:px-12",
    containerNarrow: "container mx-auto px-6 lg:px-12 max-w-5xl",
    containerTight: "container mx-auto px-6 lg:px-12 max-w-4xl",

    // ============================================
    // AMBIENT EFFECTS - Minimal, controlled
    // ============================================
    glowSubtle: "absolute pointer-events-none rounded-full blur-[100px] opacity-[0.08]",
    glowMedium: "absolute pointer-events-none rounded-full blur-[120px] opacity-[0.12]",

    // ============================================
    // BUTTONS - Confident, clear
    // ============================================
    buttonPrimary: "h-12 px-8 text-base font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300",
    buttonSecondary: "h-12 px-8 text-base font-medium rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300",
    buttonLarge: "h-14 px-10 text-lg font-semibold rounded-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300",
} as const;
