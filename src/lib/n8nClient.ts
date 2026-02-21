/**
 * src/lib/n8nClient.ts
 *
 * Single, permanent wrapper for all n8n webhook calls.
 * - Stateless auth: Authorization: Bearer <Supabase access_token>
 * - 401 → refresh token → retry ONCE
 * - Precise error codes — never maps non-auth errors to "session expired"
 * - Never reads localStorage directly
 * - Never logs tokens
 */

import { supabase } from "@/integrations/supabase/client";

// ─── Production webhook URL ────────────────────────────────────────────────────
// Fallback hardcoded so it's never empty even if env var is missing
const WEBHOOK_URL =
    import.meta.env.VITE_N8N_WEBHOOK_PROD_URL ||
    "https://sidhaarthsharma.app.n8n.cloud/webhook/prompt-weaver/image/chat";

// ─── Error codes ───────────────────────────────────────────────────────────────
export type N8nErrorCode =
    | "NOT_LOGGED_IN"       // No session at all
    | "SESSION_EXPIRED"     // 401 after refresh attempt
    | "INSUFFICIENT_CREDITS"// 403 — no credits
    | "RATE_LIMITED"        // 429
    | "BAD_REQUEST"         // 400 — invalid input
    | "BAD_RESPONSE"        // Non-JSON or unexpected shape
    | "SERVER_ERROR"        // 500 or any other non-2xx
    | "NETWORK_ERROR";      // Fetch failed entirely

export class N8nError extends Error {
    readonly code: N8nErrorCode;
    readonly status: number;
    readonly requestId?: string;

    constructor(code: N8nErrorCode, message: string, status = 0, requestId?: string) {
        super(message);
        this.name = "N8nError";
        this.code = code;
        this.status = status;
        this.requestId = requestId;
    }
}

// ─── Response shape ────────────────────────────────────────────────────────────
export interface N8nSuccessResponse {
    success: true;
    requestId: string;
    // Multi-turn conversation tracking
    conversation_id?: string;
    // Multi-turn chat fields (all optional — n8n sends what's ready)
    ready?: boolean;
    questions?: string[];
    message?: string;
    prompt_package?: {
        prompt: string;
        negative_prompt?: string;
        [key: string]: any;
    };
    final?: any;
    // Credits
    remaining_credits?: number;
    // Raw output text (if n8n sends it as `output`)
    output?: string;
}

// ─── Internal helpers ──────────────────────────────────────────────────────────

function mapStatusToCode(status: number): N8nErrorCode {
    switch (status) {
        case 400: return "BAD_REQUEST";
        case 401: return "SESSION_EXPIRED";
        case 403: return "INSUFFICIENT_CREDITS";
        case 429: return "RATE_LIMITED";
        default: return "SERVER_ERROR";
    }
}

function mapStatusToMessage(status: number, serverMsg?: string): string {
    if (serverMsg) return serverMsg;
    switch (status) {
        case 400: return "Invalid request. Please check your input.";
        case 401: return "Your session expired. Please log in again.";
        case 403: return "You're out of credits. Please upgrade your plan.";
        case 429: return "Too many requests. Please wait a moment and try again.";
        default: return `Server error (${status}). Please try again later.`;
    }
}

async function doPost(url: string, payload: object, token: string): Promise<Response> {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
}

async function safeJson(res: Response): Promise<any> {
    try {
        return await res.json();
    } catch {
        return null;
    }
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Send a message to the n8n image-chat workflow.
 *
 * @param payload  Must include `message`. Additional fields are forwarded as-is.
 * @returns        N8nSuccessResponse on success
 * @throws         N8nError with a typed code on any failure
 */
export async function callN8nWorkflow(
    payload: { message: string;[key: string]: any }
): Promise<N8nSuccessResponse> {
    // ── 1. Get access token ───────────────────────────────────────────────────
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
        throw new N8nError("NOT_LOGGED_IN", "Please log in to continue.");
    }

    // ── 2. Primary request ────────────────────────────────────────────────────
    let response: Response;
    try {
        response = await doPost(WEBHOOK_URL, payload, token);
    } catch {
        throw new N8nError("NETWORK_ERROR", "Could not reach the server. Check your connection.");
    }

    // ── 3. 401 → refresh + retry ONCE ────────────────────────────────────────
    if (response.status === 401) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        const newToken = refreshData?.session?.access_token;

        if (refreshError || !newToken) {
            await supabase.auth.signOut();
            throw new N8nError("SESSION_EXPIRED", "Your session expired. Please log in again.", 401);
        }

        try {
            response = await doPost(WEBHOOK_URL, payload, newToken);
        } catch {
            throw new N8nError("NETWORK_ERROR", "Could not reach the server. Check your connection.");
        }

        if (response.status === 401) {
            // Still failing after fresh token → sign out
            await supabase.auth.signOut();
            throw new N8nError("SESSION_EXPIRED", "Your session expired. Please log in again.", 401);
        }
    }

    // ── 4. Parse JSON ─────────────────────────────────────────────────────────
    const body = await safeJson(response);

    // ── 5. Non-2xx error responses ────────────────────────────────────────────
    if (!response.ok) {
        const serverMsg = body?.error || body?.message;
        const requestId = body?.requestId;
        throw new N8nError(
            mapStatusToCode(response.status),
            mapStatusToMessage(response.status, serverMsg),
            response.status,
            requestId
        );
    }

    // ── 6. Guard against non-JSON success ────────────────────────────────────
    if (!body || typeof body !== "object") {
        throw new N8nError("BAD_RESPONSE", "The server returned an unexpected response format.", response.status);
    }

    // ── 7. Return normalised success payload ──────────────────────────────────
    const data = body.data ?? body;

    return {
        success: true,
        requestId: data.requestId ?? body.requestId ?? "",
        conversation_id: data.conversation_id ?? body.conversation_id,
        ready: data.ready,
        questions: data.questions,
        message: data.message,
        prompt_package: data.prompt_package,
        final: data.final,
        remaining_credits: data.remaining_credits ?? body.remaining_credits,
        output: data.output ?? body.output,
    };
}
