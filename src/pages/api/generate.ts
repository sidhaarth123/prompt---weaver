import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import {
    GenerateRequestSchema,
    buildPromptFromRequest,
    type GenerateRequest,
} from "@/lib/schemas/generateRequest";
import {
    GenerateResponseSchema,
    extractJsonFromText,
    type GenerateResponse,
} from "@/lib/schemas/generateResponse";

// Type definitions for API handler (compatible with Express/Vite serverless)
interface ApiRequest {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    body: any;
}

interface ApiResponse {
    status(code: number): ApiResponse;
    json(data: any): void;
}

// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-exp";
const GENERATION_TIMEOUT_MS = parseInt(process.env.GENERATION_TIMEOUT_MS || "40000", 10);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Server-side Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Build the system instruction for Gemini
 * This ensures the AI returns ONLY valid JSON matching our contract
 */
function buildSystemInstruction(type: string): string {
    return `You are an expert prompt engineer for ${type} generation.

Your task is to analyze user requirements and generate a detailed, professional prompt.

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown code blocks, no explanations, ONLY the JSON object.
2. Follow this EXACT schema:
{
  "jsonPrompt": {
    "prompt": "string (the detailed generation prompt)",
    "negativePrompt": "string (optional, things to avoid)",
    "model": "gemini-2.0-flash",
    "aspectRatio": "1:1" | "4:5" | "16:9" | "9:16" | "1.91:1" (ONLY if user specified),
    "stylePreset": "string (ONLY if user specified)",
    "quality": "string (ONLY if user specified)",
    "useCase": "string (ONLY if user specified)"
  },
  "humanReadable": "string (a clean, markdown-formatted description for the user)"
}

3. ONLY include fields that the user explicitly provided. Do NOT invent values.
4. If user specifies aspectRatio, YOU MUST include it EXACTLY as provided.
5. The "prompt" field should be detailed, creative, and optimized for AI image/video generation.
6. The "humanReadable" field should explain what you created in a friendly way.

Remember: Return ONLY the JSON object, nothing else.`;
}

/**
 * Call Gemini with timeout and error handling
 */
async function callGemini(
    systemInstruction: string,
    userContent: string,
    timeoutMs: number
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini request timeout")), timeoutMs)
    );

    const generatePromise = model.generateContent(userContent);

    const result = await Promise.race([generatePromise, timeoutPromise]);
    const response = await result.response;
    return response.text();
}

/**
 * Attempt to repair invalid JSON by asking Gemini
 */
async function repairJson(invalidJson: string, systemInstruction: string): Promise<any> {
    console.log("[generate] Attempting JSON repair...");

    const repairPrompt = `The following response was supposed to be valid JSON but is malformed. 
Please fix it and return ONLY the valid JSON object, no markdown, no explanations:

${invalidJson}`;

    const repairedText = await callGemini(systemInstruction, repairPrompt, 10000);
    return extractJsonFromText(repairedText);
}

/**
 * Main API handler
 */
export default async function handler(
    req: ApiRequest,
    res: ApiResponse
) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "method_not_allowed", message: "Only POST is allowed" });
    }

    const requestId = uuidv4();

    try {
        // 1. Verify authentication
        const authHeaderRaw = req.headers.authorization;
        const authHeader = Array.isArray(authHeaderRaw) ? authHeaderRaw[0] : authHeaderRaw;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "unauthorized", message: "Missing auth token" });
        }

        const token = authHeader.replace("Bearer ", "");
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error("[generate] Auth error:", authError);
            return res.status(401).json({ error: "unauthorized", message: "Invalid session" });
        }

        console.log(`[generate] Request ${requestId} from user ${user.id}`);

        // 2. Validate request body
        const validationResult = GenerateRequestSchema.safeParse(req.body);
        if (!validationResult.success) {
            console.error("[generate] Validation error:", validationResult.error);
            return res.status(400).json({
                error: "invalid_request",
                message: "Request validation failed",
                details: validationResult.error.errors,
            });
        }

        const request: GenerateRequest = validationResult.data;

        // 3. Build prompts for Gemini
        const systemInstruction = buildSystemInstruction(request.type);
        const userContent = buildPromptFromRequest(request);

        console.log(`[generate] Calling Gemini for ${request.type}...`);
        console.log(`[generate] User content:\n${userContent}`);

        // 4. Call Gemini
        let responseText: string;
        try {
            responseText = await callGemini(systemInstruction, userContent, GENERATION_TIMEOUT_MS);
        } catch (geminiError: any) {
            console.error("[generate] Gemini error:", geminiError);
            return res.status(503).json({
                error: "ai_service_error",
                message: geminiError.message || "Failed to call Gemini API",
            });
        }

        console.log(`[generate] Gemini raw response:\n${responseText.substring(0, 500)}...`);

        // 5. Parse and validate response
        let parsedData: any;
        try {
            parsedData = extractJsonFromText(responseText);
        } catch (parseError: any) {
            console.error("[generate] JSON parse error:", parseError);

            // Attempt repair
            try {
                parsedData = await repairJson(responseText, systemInstruction);
                console.log("[generate] JSON repair succeeded");
            } catch (repairError: any) {
                console.error("[generate] JSON repair failed:", repairError);
                return res.status(500).json({
                    error: "invalid_ai_response",
                    message: "AI returned invalid JSON and repair failed",
                    details: { parseError: parseError.message, repairError: repairError.message },
                });
            }
        }

        // 6. Validate against schema
        const responseValidation = GenerateResponseSchema.safeParse({
            requestId,
            status: "succeeded",
            result: parsedData,
        });

        if (!responseValidation.success) {
            console.error("[generate] Response validation error:", responseValidation.error);
            return res.status(500).json({
                error: "invalid_ai_response",
                message: "AI response does not match expected format",
                details: responseValidation.error.errors,
            });
        }

        const validatedResponse = responseValidation.data;

        console.log(`[generate] Success for ${requestId}`);

        // 7. Return response
        return res.status(200).json(validatedResponse);

    } catch (error: any) {
        console.error("[generate] Unexpected error:", error);

        const errorResponse: GenerateResponse = {
            requestId,
            status: "failed",
            error: {
                code: "internal_error",
                message: error.message || "An unexpected error occurred",
            },
        };

        return res.status(500).json(errorResponse);
    }
}
