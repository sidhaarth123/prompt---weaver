import { getValidSession, AuthRequiredError } from "@/lib/authUtils";
import type { GenerateRequest } from "@/lib/schemas/generateRequest";
import type { GenerateResponse } from "@/lib/schemas/generateResponse";
import type { ApiResponse } from "@/lib/schemas/workflow";

// ─── Shared Types ──────────────────────────────────────────────────────────────

export interface GeneratePromptInput {
  type: "image" | "video" | "website";
  inputs: Record<string, any>;
}

export interface WorkflowData {
  requestId: string;
  status: "succeeded" | "failed" | "queued" | "running";
  jsonPrompt?: Record<string, any>;
  blueprint?: Record<string, any>;
  humanReadable?: string;
  cached?: boolean;
  type?: "image" | "video" | "website";
}

export type GeneratePromptResponse = ApiResponse<WorkflowData>;

// ─── Internal helpers ──────────────────────────────────────────────────────────

/** Gets a fresh auth header. Throws AuthRequiredError if session is missing. */
async function authHeaders(): Promise<Record<string, string>> {
  const session = await getValidSession();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

// ─── API functions ─────────────────────────────────────────────────────────────

/**
 * Generate prompt via secure server workflow.
 */
export async function generatePrompt(
  input: GeneratePromptInput
): Promise<GeneratePromptResponse> {
  const headers = await authHeaders();

  const response = await fetch("/api/workflows/run", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });

  const data: GeneratePromptResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Generate prompt using AI on the server.
 */
export async function generatePromptWithAI(
  request: GenerateRequest
): Promise<GenerateResponse> {
  const headers = await authHeaders();

  const response = await fetch("/api/prompt-assistant", {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  const data: GenerateResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Poll workflow status.
 */
export async function getWorkflowStatus(requestId: string): Promise<GeneratePromptResponse> {
  const headers = await authHeaders();

  const response = await fetch(`/api/workflows/status?requestId=${requestId}`, {
    method: "GET",
    headers,
  });

  const data: GeneratePromptResponse = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Poll workflow until completion (with timeout).
 */
export async function pollWorkflowUntilComplete(
  requestId: string,
  maxWaitMs = 60_000,
  pollIntervalMs = 2_000
): Promise<GeneratePromptResponse> {
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const status = await getWorkflowStatus(requestId);

    if (status.data?.status === "succeeded" || status.data?.status === "failed") {
      return status;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error("Workflow polling timeout");
}
