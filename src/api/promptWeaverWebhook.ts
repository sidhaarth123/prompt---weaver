import { supabase } from "@/integrations/supabase/client";
import { getValidSession, AuthRequiredError } from "@/lib/authUtils";
import { workflows, WorkflowType } from "@/config/workflows";

export interface WebhookClientResponse {
    success: boolean;
    ready?: boolean;
    questions?: string[];
    final?: any;
    prompt_package?: {
        prompt: string;
        negative_prompt?: string;
        [key: string]: any;
    };
    remaining_credits?: number;
    error?: string;
    message?: string;
    code?: string;
}

// ─── Internal fetch wrapper ────────────────────────────────────────────────────

async function doFetch(url: string, message: string, token: string): Promise<Response> {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
    });
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Calls an n8n workflow webhook with:
 *  - A valid Supabase access_token (auto-refreshed by the client)
 *  - One automatic retry after token refresh on HTTP 401
 *  - Typed error codes so the UI can respond correctly
 */
export async function callWorkflowWebhook(
    workflowType: WorkflowType,
    message: string,
    _isRetry = false
): Promise<WebhookClientResponse> {
    try {
        // 1. Config guard
        const config = workflows[workflowType];
        if (!config) {
            return { success: false, error: `Unknown workflow: ${workflowType}`, code: "CONFIG_ERROR" };
        }
        if (!config.webhookUrl) {
            return { success: false, error: `Webhook URL missing for "${config.title}".`, code: "CONFIG_MISSING" };
        }

        // 2. Obtain a valid session — this call lets Supabase auto-refresh the token
        let session;
        try {
            session = await getValidSession();
        } catch (e) {
            if (e instanceof AuthRequiredError) {
                return { success: false, error: "SESSION_EXPIRED", code: "UNAUTHORIZED" };
            }
            throw e;
        }

        // 3. Make the request
        let response = await doFetch(config.webhookUrl, message, session.access_token);

        // 4. On 401 — force a token refresh then retry ONCE
        if (response.status === 401 && !_isRetry) {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

            if (refreshError || !refreshData.session?.access_token) {
                // Refresh failed completely → force sign out
                await supabase.auth.signOut();
                return { success: false, error: "SESSION_EXPIRED", code: "UNAUTHORIZED" };
            }

            // Retry with the new token
            response = await doFetch(config.webhookUrl, message, refreshData.session.access_token);

            if (response.status === 401) {
                // Still failing after refresh → sign out and surface the error
                await supabase.auth.signOut();
                return { success: false, error: "SESSION_EXPIRED", code: "UNAUTHORIZED" };
            }
        }

        // 5. Other status codes
        if (response.status === 402) {
            return { success: false, error: "No credits remaining. Please upgrade.", code: "NO_CREDITS" };
        }

        // 6. Parse JSON
        let resultData: any;
        try {
            resultData = await response.json();
        } catch {
            return { success: false, error: "Invalid response from server.", code: "PARSE_ERROR" };
        }

        if (!response.ok) {
            return {
                success: false,
                error: resultData?.message || resultData?.error || "Request failed.",
                code: "REQUEST_FAILED",
            };
        }

        // 7. Normalise and return
        const data = resultData.data ?? resultData;

        return {
            success: true,
            ready: data.ready,
            questions: data.questions,
            final: data.final,
            prompt_package: data.prompt_package,
            remaining_credits: data.remaining_credits,
            message: data.message,
        };
    } catch (err: any) {
        // Network / unexpected errors — never bubble raw exceptions to the UI
        return {
            success: false,
            error: "NETWORK_ERROR",
            message: err?.message ?? "Failed to reach server.",
            code: "NETWORK_ERROR",
        };
    }
}
