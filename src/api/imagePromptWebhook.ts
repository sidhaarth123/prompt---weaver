import { supabase } from "@/integrations/supabase/client";

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
 * Clean production helper to communicate with n8n image prompt workflow.
 */
export async function callImagePromptWebhook(message: string): Promise<WebhookResponse> {
    try {
        // 1. Get Supabase session safely
        const { data } = await supabase.auth.getSession();
        const session = data?.session;

        // 2. Extract access_token & validate
        const token = session?.access_token;
        if (!token) {
            return {
                success: false,
                error: { code: "UNAUTHORIZED", message: "Please login again to continue." }
            };
        }

        // 3. Read Webhook URL from Vite env with guard
        const url = import.meta.env.VITE_IMAGE_PROMPT_WEBHOOK_URL;
        if (!url) {
            console.error("VITE_IMAGE_PROMPT_WEBHOOK_URL is not defined in environment variables.");
            return {
                success: false,
                error: { code: "CONFIG_MISSING", message: "System configuration error. Please contact support." }
            };
        }


        // 4. Execute POST request
        const response = await fetch(url, {
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
                error: { code: "UNAUTHORIZED", message: "Session expired, please login again." }
            };
        }
        if (response.status === 402) {
            return {
                success: false,
                error: { code: "NO_CREDITS", message: "No credits remaining." }
            };
        }

        // 6. Parse JSON
        const resultData = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: {
                    code: "REQUEST_FAILED",
                    message: resultData?.message || "Request failed."
                }
            };
        }

        // Return the successful data payload wrapped in 'data'
        return {
            success: true,
            data: resultData
        };


    } catch (error: any) {
        console.error("Webhook Call Error:", error);
        return {
            success: false,
            error: {
                code: "NETWORK_ERROR",
                message: error.message || "Something went wrong. Please try again."
            }
        };
    }
}
