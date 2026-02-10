const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-prompt`;

export type PromptResult = {
  json_output: Record<string, unknown>;
  explanation: string;
};

export async function generatePrompt(
  params: Record<string, unknown>,
  token: string
): Promise<PromptResult> {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (resp.status === 429) {
    throw new Error("Rate limit exceeded. Please try again in a moment.");
  }
  if (resp.status === 402) {
    throw new Error("Usage limit reached. Please upgrade to Pro for unlimited prompts.");
  }
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || "Failed to generate prompt");
  }

  return resp.json();
}
