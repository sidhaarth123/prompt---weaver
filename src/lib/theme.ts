

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Keep it simple and strictly use utility classes in components for better maintainability (and standard Tailwind practice)
// This file can act as a central registry for complex shared combinations if needed.

export const THEME = {
    // Layouts
    section: "py-24 sm:py-32 relative overflow-hidden",
    container: "container px-4 md:px-6 relative z-10",

    // Typography
    h1: "text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400",
    h2: "text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl",
    h3: "text-2xl font-bold tracking-tight",
    p: "text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed",

    // Components
    glassCard: "rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl",
    glassButton: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white h-10 px-4 py-2",

    // Effects
    gradientText: "bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70",
    glow: "absolute -inset-1 blur-2xl opacity-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full",
} as const;
