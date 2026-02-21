import { N8N_URLS } from "@/config/api";

export interface WorkflowConfig {
    id: string;
    title: string;
    webhookUrl: string;
    creditCost: number;
    routePath: string;
}

/**
 * All webhook URLs come from src/config/api.ts which has hardcoded
 * production fallbacks — so this config is NEVER empty in production.
 */
export const workflows: Record<string, WorkflowConfig> = {
    image: {
        id: "image",
        title: "Image Prompt Assistant",
        webhookUrl: N8N_URLS.image,
        creditCost: 1,
        routePath: "/image-generator",
    },
    video: {
        id: "video",
        title: "Video Prompt Assistant",
        webhookUrl: N8N_URLS.video,
        creditCost: 1,
        routePath: "/video-generator",
    },
    banner: {
        id: "banner",
        title: "Banner Prompt Assistant",
        webhookUrl: N8N_URLS.banner,
        creditCost: 1,
        routePath: "/banner-generator",
    },
    website: {
        id: "website",
        title: "Website Prompt Assistant",
        webhookUrl: N8N_URLS.website,
        creditCost: 1,
        routePath: "/website-generator",
    },
};

export type WorkflowType = keyof typeof workflows;
