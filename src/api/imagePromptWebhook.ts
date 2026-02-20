/**
 * imagePromptWebhook.ts
 *
 * @deprecated Use callWorkflowWebhook('image', message) from
 *   @/api/promptWeaverWebhook instead. This file is kept only for
 *   backward-compatibility with any callers that haven't been migrated yet.
 *   It delegates directly to the unified webhook client so there is no
 *   duplicated auth/fetch logic.
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

/**
 * Calls the production image-prompt n8n webhook.
 * Auth, 401 retry, and error normalisation are handled in the shared client.
 */
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
