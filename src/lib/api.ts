import { supabase } from "@/integrations/supabase/client";
import type { GenerateRequest } from "@/lib/schemas/generateRequest";
import type { GenerateResponse } from "@/lib/schemas/generateResponse";

/**
 * Secure workflow API client
 * Calls our server API which then communicates with n8n
 */

export interface GeneratePromptInput {
  type: "image" | "video" | "website";
  inputs: Record<string, any>;
}

export interface GeneratePromptResponse {
  requestId: string;
  status: "succeeded" | "failed" | "queued" | "running";
  result?: {
    jsonPrompt?: Record<string, any>;
    blueprint?: Record<string, any>;
    humanReadable?: string;
  };
  error?: {
    code: string;
    message: string;
  };
  cached?: boolean;
}

/**
 * Generate prompt via secure server workflow
 */
export async function generatePrompt(
  input: GeneratePromptInput
): Promise<GeneratePromptResponse> {
  // Get session token
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("Authentication required");
  }

  // Call our server API (NOT n8n directly)
  const response = await fetch("/api/workflows/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request failed with status ${response.status}`
    );
  }

  return data;
}

/**
 * Generate prompt using AI on the server
 * Calls /api/prompt-assistant which uses our prompt assistant service
 * Provides strict schema validation and guaranteed correct output
 */
export async function generatePromptWithAI(
  request: GenerateRequest
): Promise<GenerateResponse> {
  // Get session token
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("Authentication required");
  }

  // Call our AI-powered API endpoint
  const response = await fetch("/api/prompt-assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request failed with status ${response.status}`
    );
  }

  return data;
}

/**
 * Poll workflow status
 */
export async function getWorkflowStatus(requestId: string): Promise<GeneratePromptResponse> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`/api/workflows/status?requestId=${requestId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request failed with status ${response.status}`
    );
  }

  return data;
}

/**
 * Poll workflow until completion (with timeout)
 */
export async function pollWorkflowUntilComplete(
  requestId: string,
  maxWaitMs: number = 60000,
  pollIntervalMs: number = 2000
): Promise<GeneratePromptResponse> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const status = await getWorkflowStatus(requestId);

    if (status.status === "succeeded" || status.status === "failed") {
      return status;
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error("Workflow polling timeout");
}
