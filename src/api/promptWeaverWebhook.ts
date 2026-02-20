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
 * Unified webhook client for Prompt Weaver workflows.
 * Optimized for production safety and consistent response structure.
 */
export async function callWorkflowWebhook(
    workflowType: WorkflowType,
    message: string
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
            console.error(`Webhook URL for ${workflowType} is missing.`);
            return {
                success: false,
                error: `Assistant configuration missing for ${config.title}. Please check environment variables.`,
                code: "CONFIG_MISSING"
            };
        }

        // 3. Get Supabase session safely
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            return {
                success: false,
                error: "Authentication error. Please login again.",
                code: "UNAUTHORIZED"
            };
        }

        const token = sessionData?.session?.access_token;
        if (!token) {
            return {
                success: false,
                error: "Please login to use the Assistant.",
                code: "UNAUTHORIZED"
            };
        }

        // 4. Execute POST request
        const response = await fetch(config.webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ message })
        });

        // 5. Handle Status Codes 
        if (response.status === 401) {
            return {
                success: false,
                error: "Session expired, please login again.",
                code: "UNAUTHORIZED"
            };
        }
        if (response.status === 402) {
            return {
                success: false,
                error: "No credits remaining. Please upgrade your plan.",
                code: "NO_CREDITS"
            };
        }

        // 6. Parse JSON safely
        let resultData;
        try {
            resultData = await response.json();
        } catch (e) {
            return {
                success: false,
                error: "Invalid response from Assistant server.",
                code: "PARSE_ERROR"
            };
        }

        if (!response.ok) {
            return {
                success: false,
                error: resultData?.message || resultData?.error || "Request failed.",
                code: "REQUEST_FAILED"
            };
        }

        // 7. Map successful response
        // We expect the n8n workflow to return the fields directly or wrapped in data
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
        console.error(`Webhook Call Error (${workflowType}):`, error);
        return {
            success: false,
            error: error.message || "Something went wrong. Please try again.",
            code: "NETWORK_ERROR"
        };
    }
}
