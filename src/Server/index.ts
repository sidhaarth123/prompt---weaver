import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { z } from "zod";
// @ts-ignore
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { GenerateRequestSchema, GenerateRequest } from "../lib/schemas/generateRequest.js";
import { GenerateResponseSchema, extractJsonFromText } from "../lib/schemas/generateResponse.js";

dotenv.config();

const app = express();
const PORT = 8787;

// Valid models: gpt-4o-mini, gpt-4o, etc.
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("[server] ERROR: OPENAI_API_KEY is missing in .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json({ limit: "200kb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per minute
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

app.use("/api", limiter);

/**
 * Build System Instruction
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
    "model": "gpt-4o",
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
 * Call OpenAI API
 */
async function callOpenAI(systemInstruction: string, userContent: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userContent }
    ],
    model: OPENAI_MODEL,
    response_format: { type: "json_object" },
  });

  return completion.choices[0].message.content || "{}";
}

/**
 * Build User Content from Request
 */
function buildPromptFromRequest(data: GenerateRequest): string {
  let prompt = `Generate a ${data.type} prompt for: "${data.userText}"\n\n`;

  if (data.aspectRatio) prompt += `Aspect Ratio: ${data.aspectRatio}\n`;
  if (data.stylePreset) prompt += `Style: ${data.stylePreset}\n`;
  if (data.negativePrompt) prompt += `Negative Prompt: ${data.negativePrompt}\n`;

  if (data.extra) {
    prompt += `Extra Details:\n${JSON.stringify(data.extra, null, 2)}`;
  }

  return prompt;
}

app.post("/api/prompt-assistant", async (req: Request, res: Response) => {
  const requestId = uuidv4();
  console.log(`[server] Request ${requestId} received`);

  try {
    // 1. Validate Request
    const parseResult = GenerateRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      console.error(`[server] Validation failed:`, parseResult.error);
      res.status(400).json({
        requestId,
        status: "failed",
        error: {
          code: "validation_error",
          message: "Invalid request data",
          details: parseResult.error.errors
        }
      });
      return;
    }

    const requestData = parseResult.data;

    // 2. Build Prompts
    const systemInstruction = buildSystemInstruction(requestData.type);
    const userContent = buildPromptFromRequest(requestData);

    // 3. Call OpenAI
    let responseText: string;
    try {
      console.log(`[server] Calling OpenAI (${OPENAI_MODEL})...`);
      responseText = await callOpenAI(systemInstruction, userContent);
      console.log(`[server] OpenAI response received`);
    } catch (err: any) {
      console.error(`[server] OpenAI Error:`, err);
      res.status(500).json({
        requestId,
        status: "failed",
        error: {
          code: "ai_service_error",
          message: err.message || "Failed to communicate with AI service"
        }
      });
      return;
    }

    // 4. Parse & Validate Response
    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`[server] JSON Parse Error:`, parseError);
      console.error(`[server] Raw Output:`, responseText);

      res.status(500).json({
        requestId,
        status: "failed",
        error: {
          code: "parsing_error",
          message: "Failed to parse AI response"
        }
      });
      return;
    }

    // 5. Schema Validation for Response
    const responseData = {
      requestId,
      status: "succeeded",
      result: parsedData
    };

    const responseValidation = GenerateResponseSchema.safeParse(responseData);
    if (!responseValidation.success) {
      console.error(`[server] Response Schema Validation Failed:`, responseValidation.error);
      res.status(500).json({
        requestId,
        status: "failed",
        error: {
          code: "schema_validation_error",
          message: "AI response did not match expected schema",
          details: responseValidation.error.errors
        }
      });
      return;
    }

    // 6. Success
    console.log(`[server] Success ${requestId}`);
    res.json(responseValidation.data);

  } catch (err: any) {
    console.error(`[server] Unexpected Error:`, err);
    res.status(500).json({
      requestId,
      status: "failed",
      error: {
        code: "server_error",
        message: "An unexpected error occurred"
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`[server] Server running on http://localhost:${PORT}`);
  console.log(`[server] Model: ${OPENAI_MODEL}`);
});
