

# PromptForge AI — Full MVP Implementation Plan

## Overview
A premium, dark-themed SaaS application that converts user intent into Google AI Studio–compatible JSON prompts for image and video generation, with a human-readable explanation. Built with React + Vite, Supabase backend (Lovable Cloud), Stripe billing, and Lovable AI Gateway (Gemini) for prompt generation.

---

## 1. Design System & Theme
- **Dark, futuristic aesthetic**: deep charcoal background (`#0a0a0f`), soft neon purple/blue accent gradients
- **Typography**: Inter font family, clean and developer-friendly
- **Components**: Shadcn/UI customized to match the premium dark theme
- **Subtle animations**: hover glows, gradient transitions — no excessive motion
- **Fully responsive, mobile-first layout**

---

## 2. Public Pages

### Landing Page
- Hero section with clear value prop: "Turn your ideas into AI Studio–ready prompts in seconds"
- Live demo preview showing the input → JSON output flow
- Feature highlights (structured output, prompt history, presets)
- Social proof section (placeholder-ready)
- CTA buttons: "Try Prompt Generator" and "View Pricing"

### Pricing Page
- Two-tier layout: **Free** (5 prompts/day) and **Pro** ($14/mo — unlimited prompts, advanced controls, prompt history)
- Feature comparison table
- Stripe checkout integration for Pro tier

### Login / Signup
- Supabase Auth with email/password + Google OAuth
- Clean modal or dedicated page with the dark theme

### Documentation Page
- Static guide: "How to use your prompts in Google AI Studio"
- Step-by-step instructions with screenshots/illustrations
- Code block examples

### Privacy Policy & Terms of Service
- Standard legal pages with proper formatting

---

## 3. Prompt Generator (Core Feature)

### Input Panel (Left Side)
- **Output type toggle**: Image / Video
- **Use case dropdown**: Product photo, cinematic video, ad creative, social media, portrait, landscape, abstract art, etc.
- **Subject** input (text field)
- **Style** selector (dropdown + custom): Photorealistic, cinematic, anime, watercolor, 3D render, etc.
- **Mood** selector: Dramatic, serene, energetic, mysterious, etc.
- **Camera/Composition** (optional): Close-up, wide angle, bird's eye, etc.
- **Resolution/Aspect ratio**: 1:1, 16:9, 9:16, 4:3, custom
- **Advanced options** (collapsible): Seed, lighting type, realism level slider, negative prompt

### Output Panel (Right Side)
- **Tabs**: JSON Output | Explanation
- **JSON tab**: Syntax-highlighted code block with copy button, validated against Google AI Studio schema
- **Explanation tab**: Human-readable breakdown of what the prompt does and why each parameter was chosen
- **Action buttons**: Copy JSON, Copy Explanation, Save to Library, Regenerate with Variations

### AI Engine (Backend)
- Supabase edge function calling Lovable AI Gateway (Gemini)
- System prompt engineered to output both structured JSON and explanation simultaneously
- Zod validation layer to enforce the Google AI Studio JSON schema before returning to client
- Error handling for malformed output with automatic retry

---

## 4. Authenticated Pages

### Prompt History
- Chronological list of all generated prompts
- Search and filter by type (image/video), use case, date
- Click to view full prompt details, re-edit, or regenerate

### Saved Prompts (Library)
- User-curated collection of bookmarked prompts
- Organize with tags/labels
- Quick copy and re-use

### Presets & Templates
- Pre-built prompt templates for common use cases (product photography, social media ads, cinematic scenes)
- Users can save their own parameter combinations as custom presets
- One-click apply preset to generator

### Account Settings
- Profile management (name, email)
- Password change
- Connected OAuth accounts

### Billing & Subscription
- Current plan display (Free / Pro)
- Usage stats (prompts generated today / this month)
- Upgrade/downgrade via Stripe Customer Portal
- Invoice history

---

## 5. Backend Architecture

### Database (Supabase)
- **profiles** table: user profile data linked to auth.users
- **prompts** table: generated prompts with JSON output, explanation, parameters, timestamps
- **saved_prompts** table: user bookmarks referencing prompts
- **presets** table: user-created and system presets
- **usage_tracking** table: daily prompt count per user for enforcing free tier limits
- RLS policies on all tables ensuring users only access their own data

### Edge Functions
- `generate-prompt`: Takes user parameters → calls Lovable AI → validates JSON → returns structured output
- `check-usage`: Validates user hasn't exceeded their plan's daily limit before generation

### Auth
- Supabase Auth with email + Google OAuth
- Protected routes for authenticated pages
- Auth guards on edge functions

### Stripe Integration
- Two products: Free tier (default) and Pro tier ($14/mo subscription)
- Webhook handling for subscription status changes
- Usage limit enforcement based on subscription status

---

## 6. Key UX Details
- Prompt generation target: under 3 seconds with streaming feedback
- Loading state with animated progress indicator during generation
- Toast notifications for copy actions, save confirmations, errors
- Empty states for history/library when no prompts exist yet
- Keyboard shortcuts for power users (Ctrl+Enter to generate)

