import { supabase } from "@/integrations/supabase/client";
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

/**
 * Robust fetcher with retry logic for authentication failures.
 */
async function executeRequest(url: string, message: string, token: string): Promise<Response> {
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message })
    });
}

/**
 * Unified webhook client for Prompt Weaver workflows.
 * Optimized for production safety, automatic session refresh, and consistent error handling.
 */
export async function callWorkflowWebhook(
    workflowType: WorkflowType,
    message: string,
    isRetry = false
): Promise<WebhookClientResponse> {
    try {
        // 1. Get workflow config
        const config = workflows[workflowType];
        if (!config) {
            return {
                success: false,
                error: `Unknown workflow type: ${workflowType}`,
                code: "CONFIG_ERROR"
            };
        }

        // 2. Validate Webhook URL presence
        if (!config.webhookUrl) {
            return {
                success: false,
                error: `Configuration error for ${config.title}.`,
                code: "CONFIG_MISSING"
            };
        }

        // 3. Get latest session token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
            return {
                success: false,
                error: "SESSION_EXPIRED",
                code: "UNAUTHORIZED"
            };
        }

        const token = session.access_token;

        // 4. Primary Request Execution
        let response = await executeRequest(config.webhookUrl, message, token);

        // 5. Handle Authentication Failure (Retry Logic)
        if (response.status === 401 && !isRetry) {
            // Attempt to refresh session once
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

            if (!refreshError && refreshData.session?.access_token) {
                // Retry with new token
                return await callWorkflowWebhook(workflowType, message, true);
            } else {
                return {
                    success: false,
                    error: "SESSION_EXPIRED",
                    code: "UNAUTHORIZED"
                };
            }
        }

        // 6. Handle other status codes
        if (response.status === 401) {
            return { success: false, error: "SESSION_EXPIRED", code: "UNAUTHORIZED" };
        }

        if (response.status === 402) {
            return { success: false, error: "No credits remaining. Please upgrade.", code: "NO_CREDITS" };
        }

        // 7. Parse JSON safely
        let resultData;
        try {
            resultData = await response.json();
        } catch (e) {
            return { success: false, error: "Invalid response from Assistant server.", code: "PARSE_ERROR" };
        }

        if (!response.ok) {
            return {
                success: false,
                error: resultData?.message || resultData?.error || "Request failed.",
                code: "REQUEST_FAILED"
            };
        }

        // 8. Map successful response
        const data = resultData.data || resultData;

        return {
            success: true,
            ready: data.ready,
            questions: data.questions,
            final: data.final,
            prompt_package: data.prompt_package,
            remaining_credits: data.remaining_credits,
            message: data.message
        };

    } catch (error: any) {
        return {
            success: false,
            error: "NETWORK_ERROR",
            message: error.message || "Failed to reach server",
            code: "NETWORK_ERROR"
        };
    }
}
