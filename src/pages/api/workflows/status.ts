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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;


// Server-side Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Validate Supabase session
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
            return res.status(401).json({ error: "Unauthorized", message: "Invalid session" });
        }

        // Get requestId from query
        const { requestId } = req.query;

        if (!requestId || typeof requestId !== "string") {
            return res.status(400).json({
                error: "Bad request",
                message: "requestId query parameter is required",
            });
        }

        // Fetch workflow run
        const { data: workflowRun, error: fetchError } = await supabase
            .from("workflow_runs")
            .select("*")
            .eq("request_id", requestId)
            .eq("user_id", user.id) // Security: only return user's own runs
            .maybeSingle();

        if (fetchError) {
            console.error("[workflow/status] Database error:", fetchError);
            return res.status(500).json({
                error: "Database error",
                message: "Failed to fetch workflow status",
            });
        }

        if (!workflowRun) {
            return res.status(404).json({
                error: "Not found",
                message: "Workflow run not found",
            });
        }

        // Return status
        return res.status(200).json({
            requestId: workflowRun.request_id,
            status: workflowRun.status,
            type: workflowRun.type,
            result: workflowRun.output_json,
            error: workflowRun.error_code
                ? {
                    code: workflowRun.error_code,
                    message: workflowRun.error_message,
                }
                : null,
            createdAt: workflowRun.created_at,
            updatedAt: workflowRun.updated_at,
        });
    } catch (error: any) {
        console.error("[workflow/status] Unexpected error:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message || "Unknown error occurred",
        });
    }
}
