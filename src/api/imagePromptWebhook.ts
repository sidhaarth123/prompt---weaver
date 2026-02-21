/**
 * src/api/imagePromptWebhook.ts
 *
 * Thin backward-compat adapter.
 * All real logic lives in promptWeaverWebhook.ts.
 * Any direct callers should migrate to callWorkflowWebhook("image", message).
 */

import { callWorkflowWebhook, WebhookClientResponse } from "@/api/promptWeaverWebhook";
import type { ApiResponse } from "@/lib/schemas/workflow";

export interface ImageAssistantData {
    ready?: boolean;
    questions?: string[];
    final?: any;
    prompt_package?: {
        prompt: string;
        negative_prompt: string;
    };
    remaining_credits?: number;
}

export type WebhookResponse = ApiResponse<ImageAssistantData>;

export async function callImagePromptWebhook(message: string): Promise<WebhookResponse> {
    const result: WebhookClientResponse = await callWorkflowWebhook("image", message);

    if (!result.success) {
        return {
            success: false,
            error: {
                code: result.code ?? "UNKNOWN_ERROR",
                message: result.error ?? result.message ?? "Something went wrong.",
            },
        };
    }

    return {
        success: true,
        data: {
            ready: result.ready,
            questions: result.questions,
            final: result.final,
            prompt_package: result.prompt_package as ImageAssistantData["prompt_package"],
            remaining_credits: result.remaining_credits,
        },
    };
}
