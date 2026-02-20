type NextApiRequest = {
    method: string;
    headers: Record<string, string | string[] | undefined>;
    body: any;
    query: Record<string, string | string[] | undefined>;
};

type NextApiResponse = {
    status: (code: number) => NextApiResponse;
    json: (body: any) => void;
};

import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import {
    WorkflowRequestSchema,
    WorkflowResponseSchema,
    type WorkflowRequest,
    type WorkflowResponse,
} from "@/lib/schemas/workflow";
import {
    generateHMACSignature,
    retryWithBackoff,
    createTimeoutPromise,
} from "@/lib/workflow-utils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;
const n8nWebhookUrl = import.meta.env.VITE_IMAGE_PROMPT_WEBHOOK_URL!;
const n8nWebhookSecret = import.meta.env.VITE_N8N_WEBHOOK_SECRET!;



// Server-side Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // 1. Validate Supabase session
        const authHeader = req.headers.authorization as string;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized", message: "Missing auth token" });
        }

        const token = authHeader.replace("Bearer ", "");
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error("[workflow/run] Auth error:", authError);
            return res.status(401).json({ error: "Unauthorized", message: "Invalid session" });
        }

        // 2. Parse and validate request body
        const requestId = uuidv4();
        const timestamp = new Date().toISOString();

        const payload: WorkflowRequest = {
            ...req.body,
            requestId,
            userId: user.id,
            timestamp,
        };

        const validationResult = WorkflowRequestSchema.safeParse(payload);
        if (!validationResult.success) {
            console.error("[workflow/run] Validation error:", validationResult.error);
            return res.status(400).json({
                error: "Invalid request",
                message: "Payload validation failed",
                details: validationResult.error.errors,
            });
        }

        const validatedPayload = validationResult.data;

        console.log(`[workflow/run] Request ${requestId} from user ${user.id}, type: ${validatedPayload.type}`);

        // 3. Check idempotency - has this exact request already been processed?
        const { data: existingRun } = await supabase
            .from("workflow_runs")
            .select("*")
            .eq("request_id", requestId)
            .maybeSingle();

        if (existingRun) {
            console.log(`[workflow/run] Returning cached result for ${requestId}`);
            return res.status(200).json({
                requestId: existingRun.request_id,
                status: existingRun.status,
                result: existingRun.output_json,
                cached: true,
            });
        }

        // 4. Create workflow_run record with status "queued"
        const { error: insertError } = await supabase.from("workflow_runs").insert({
            request_id: requestId,
            user_id: user.id,
            type: validatedPayload.type,
            status: "queued",
            input_json: validatedPayload.inputs,
        });

        if (insertError) {
            console.error("[workflow/run] Failed to insert workflow_run:", insertError);
            return res.status(500).json({
                error: "Database error",
                message: "Failed to create workflow run",
            });
        }

        // 5. Update status to "running"
        await supabase
            .from("workflow_runs")
            .update({ status: "running", updated_at: new Date().toISOString() })
            .eq("request_id", requestId);

        // 6. Call n8n webhook with HMAC signature and timeout
        console.log(`[workflow/run] Calling n8n for ${requestId}...`);

        const payloadString = JSON.stringify(validatedPayload);
        const signature = generateHMACSignature(payloadString, n8nWebhookSecret);

        try {
            const n8nResponse = await retryWithBackoff(
                async () => {
                    const fetchPromise = fetch(n8nWebhookUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-PW-Signature": signature,
                            "X-PW-Request-Id": requestId,
                        },
                        body: payloadString,
                    });

                    const timeoutPromise = createTimeoutPromise(
                        REQUEST_TIMEOUT,
                        `n8n request timeout after ${REQUEST_TIMEOUT}ms`
                    );

                    return await Promise.race([fetchPromise, timeoutPromise]);
                },
                MAX_RETRIES,
                1000
            );

            if (!n8nResponse.ok) {
                const errorText = await n8nResponse.text();
                console.error(`[workflow/run] n8n error ${n8nResponse.status}:`, errorText);

                // Update workflow_run with failure
                await supabase
                    .from("workflow_runs")
                    .update({
                        status: "failed",
                        error_code: `n8n_${n8nResponse.status}`,
                        error_message: errorText.slice(0, 500),
                        updated_at: new Date().toISOString(),
                    })
                    .eq("request_id", requestId);

                return res.status(n8nResponse.status).json({
                    error: "Workflow execution failed",
                    message: `n8n returned ${n8nResponse.status}`,
                    requestId,
                });
            }

            // 7. Parse and validate n8n response
            const responseData = await n8nResponse.json();
            const responseValidation = WorkflowResponseSchema.safeParse(responseData);

            if (!responseValidation.success) {
                console.error("[workflow/run] Invalid n8n response:", responseValidation.error);

                await supabase
                    .from("workflow_runs")
                    .update({
                        status: "failed",
                        error_code: "invalid_response",
                        error_message: "n8n returned invalid response format",
                        updated_at: new Date().toISOString(),
                    })
                    .eq("request_id", requestId);

                return res.status(500).json({
                    error: "Invalid workflow response",
                    message: "n8n response validation failed",
                    requestId,
                });
            }

            const validatedResponse = responseValidation.data;

            // 8. Update workflow_run with result
            await supabase
                .from("workflow_runs")
                .update({
                    status: validatedResponse.status,
                    output_json: validatedResponse.result || null,
                    error_code: validatedResponse.error?.code || null,
                    error_message: validatedResponse.error?.message || null,
                    updated_at: new Date().toISOString(),
                })
                .eq("request_id", requestId);

            console.log(`[workflow/run] Success for ${requestId}, status: ${validatedResponse.status}`);

            // 9. Return response to client
            return res.status(200).json(validatedResponse);
        } catch (fetchError: any) {
            console.error("[workflow/run] n8n fetch error:", fetchError);

            // Update workflow_run with failure
            await supabase
                .from("workflow_runs")
                .update({
                    status: "failed",
                    error_code: fetchError.code || "network_error",
                    error_message: fetchError.message?.slice(0, 500) || "Failed to reach n8n",
                    updated_at: new Date().toISOString(),
                })
                .eq("request_id", requestId);

            return res.status(503).json({
                error: "Service unavailable",
                message: "Could not connect to workflow service",
                requestId,
            });
        }
    } catch (error: any) {
        console.error("[workflow/run] Unexpected error:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message || "Unknown error occurred",
        });
    }
}
