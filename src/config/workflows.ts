export interface WorkflowConfig {
    id: string;
    title: string;
    webhookUrl: string;
    creditCost: number;
    routePath: string;
}

export const workflows: Record<string, WorkflowConfig> = {
    image: {
        id: 'image',
        title: 'Image Prompt Assistant',
        webhookUrl: import.meta.env.VITE_IMAGE_PROMPT_WEBHOOK_URL || '',
        creditCost: 1,
        routePath: '/image-generator',
    },
    video: {
        id: 'video',
        title: 'Video Prompt Assistant',
        webhookUrl: import.meta.env.VITE_VIDEO_PROMPT_WEBHOOK_URL || '',
        creditCost: 1,
        routePath: '/video-generator',
    },
    banner: {
        id: 'banner',
        title: 'Banner Prompt Assistant',
        webhookUrl: import.meta.env.VITE_BANNER_PROMPT_WEBHOOK_URL || '',
        creditCost: 1,
        routePath: '/banner-generator',
    },
    website: {
        id: 'website',
        title: 'Website Prompt Assistant',
        webhookUrl: import.meta.env.VITE_WEBSITE_PROMPT_WEBHOOK_URL || '',
        creditCost: 1,
        routePath: '/website-generator',
    },
};

export type WorkflowType = keyof typeof workflows;
