/**
 * src/config/api.ts
 *
 * Single source of truth for all external API endpoint URLs.
 * All webhook clients import from here — never hardcode URLs elsewhere.
 */

// ─── n8n Production Webhook URLs ──────────────────────────────────────────────
// These are read from Vite env vars so they can be overridden per environment
// (local dev, staging, production) without code changes.
// The fallbacks ensure the constants are never undefined strings.

export const N8N_URLS = {
    image: import.meta.env.VITE_IMAGE_PROMPT_WEBHOOK_URL || "https://sidhaarthsharma.app.n8n.cloud/webhook/prompt-weaver/image/chat",
    video: import.meta.env.VITE_VIDEO_PROMPT_WEBHOOK_URL || "https://sidhaarthsharma.app.n8n.cloud/webhook/prompt-weaver/video/chat",
    banner: import.meta.env.VITE_BANNER_PROMPT_WEBHOOK_URL || "https://sidhaarthsharma.app.n8n.cloud/webhook/prompt-weaver/banner/chat",
    website: import.meta.env.VITE_WEBSITE_PROMPT_WEBHOOK_URL || "https://sidhaarthsharma.app.n8n.cloud/webhook/prompt-weaver/website/chat",
} as const;

export type WorkflowEndpoint = keyof typeof N8N_URLS;
