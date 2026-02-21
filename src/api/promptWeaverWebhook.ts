/**
 * src/api/promptWeaverWebhook.ts
 *
 * Thin adapter that maps N8nClient responses to the shape
 * that usePromptWeaverChat and PremiumChatbot already expect.
 *
 * All auth/retry/error logic lives in src/lib/n8nClient.ts.
 */

import { callN8nWorkflow, N8nError } from "@/lib/n8nClient";
import { WorkflowType } from "@/config/workflows";
import { N8N_URLS } from "@/config/api";

// ─── Response shape (unchanged — UI depends on this) ──────────────────────────
export type ErrorCode =
    | "UNAUTHORIZED"
    | "INSUFFICIENT_CREDITS"
    | "RATE_LIMITED"
    | "BAD_REQUEST"
    | "SERVER_ERROR"
    | "NETWORK_ERROR"
    | "CONFIG_MISSING"
    | "PARSE_ERROR";

export interface WebhookClientResponse {
    success: boolean;
    code?: ErrorCode | string;
    error?: string;
    message?: string;
    ready?: boolean;
    questions?: string[];
    final?: any;
    prompt_package?: {
        prompt: string;
        negative_prompt?: string;
        [key: string]: any;
    };
    remaining_credits?: number;
    output?: string;
    requestId?: string;
    // Multi-turn conversation tracking
    conversation_id?: string;
}

// ─── Map N8nError codes → legacy UI codes ─────────────────────────────────────
function mapN8nCode(code: string): ErrorCode {
    switch (code) {
        case "NOT_LOGGED_IN":
        case "SESSION_EXPIRED": return "UNAUTHORIZED";
        case "INSUFFICIENT_CREDITS": return "INSUFFICIENT_CREDITS";
        case "RATE_LIMITED": return "RATE_LIMITED";
        case "BAD_REQUEST": return "BAD_REQUEST";
        case "BAD_RESPONSE":
        case "PARSE_ERROR": return "PARSE_ERROR";
        case "NETWORK_ERROR": return "NETWORK_ERROR";
        default: return "SERVER_ERROR";
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function callWorkflowWebhook(
    workflowType: WorkflowType,
    message: string,
    conversationId?: string  // forwarded on every subsequent turn
): Promise<WebhookClientResponse> {
    // Guard: ensure URL is configured
    const url = N8N_URLS[workflowType as keyof typeof N8N_URLS];
    if (!url) {
        return {
            success: false,
            code: "CONFIG_MISSING",
            error: `No webhook URL configured for workflow "${workflowType}".`,
        };
    }

    try {
        const payload: { message: string; conversation_id?: string } = { message };
        if (conversationId) payload.conversation_id = conversationId;
        const result = await callN8nWorkflow(payload);

        return {
            success: true,
            requestId: result.requestId,
            conversation_id: result.conversation_id,
            ready: result.ready,
            questions: result.questions,
            message: result.message,
            prompt_package: result.prompt_package,
            final: result.final,
            remaining_credits: result.remaining_credits,
            output: result.output,
        };
    } catch (err) {
        if (err instanceof N8nError) {
            return {
                success: false,
                code: mapN8nCode(err.code),
                error: err.message,
                requestId: err.requestId,
            };
        }

        // Unexpected JS error — surface as server error
        return {
            success: false,
            code: "SERVER_ERROR",
            error: "An unexpected error occurred. Please try again.",
        };
    }
}
