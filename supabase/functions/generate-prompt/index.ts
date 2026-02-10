import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert AI prompt engineer. Given user parameters, generate TWO outputs:

1. A structured JSON prompt compatible with Google AI Studio for image/video generation
2. A human-readable explanation of the prompt

You MUST respond using the "generate_prompt" tool/function provided.

JSON Schema Rules:
- "prompt": The main descriptive prompt string, detailed and optimized for single-pass generation
- "negative_prompt": Elements to avoid (always include common quality issues like "blurry, low quality, distorted" plus any user-specified exclusions)
- "aspect_ratio": The requested aspect ratio
- "style_preset": The visual style
- "output_format": "png" for images, "mp4" for video
- "seed": Include only if user specified
- "guidance_scale": 7.5 by default, adjust based on realism level (higher = more literal)
- "num_inference_steps": 30 for standard, 50 for high realism
- Additional fields based on output type (e.g., "duration_seconds" for video, "fps" for video)

For the explanation, describe what each parameter does and why it was chosen. Be specific and educational.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Validate auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(
      authHeader.replace("Bearer ", "")
    );
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    // Check usage limits
    const today = new Date().toISOString().split("T")[0];
    const { data: usage } = await supabase
      .from("usage_tracking")
      .select("prompt_count")
      .eq("user_id", userId)
      .eq("usage_date", today)
      .maybeSingle();

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("user_id", userId)
      .maybeSingle();

    const plan = profile?.plan || "free";
    const currentCount = usage?.prompt_count || 0;

    if (plan === "free" && currentCount >= 5) {
      return new Response(
        JSON.stringify({ error: "Daily limit reached. Upgrade to Pro for unlimited prompts." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request
    const body = await req.json();
    const { output_type, use_case, subject, style, mood, camera, aspect_ratio, advanced } = body;

    const userMessage = [
      `Output Type: ${output_type}`,
      use_case ? `Use Case: ${use_case}` : "",
      `Subject: ${subject}`,
      style ? `Style: ${style}` : "",
      mood ? `Mood: ${mood}` : "",
      camera ? `Camera/Composition: ${camera}` : "",
      `Aspect Ratio: ${aspect_ratio || "16:9"}`,
      advanced?.lighting ? `Lighting: ${advanced.lighting}` : "",
      advanced?.realism_level !== undefined ? `Realism Level: ${advanced.realism_level}%` : "",
      advanced?.negative_prompt ? `Negative Prompt: ${advanced.negative_prompt}` : "",
      advanced?.seed ? `Seed: ${advanced.seed}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Call AI Gateway with tool calling for structured output
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_prompt",
              description: "Return the structured JSON prompt and human-readable explanation.",
              parameters: {
                type: "object",
                properties: {
                  json_output: {
                    type: "object",
                    description: "The Google AI Studio compatible JSON prompt",
                    properties: {
                      prompt: { type: "string" },
                      negative_prompt: { type: "string" },
                      aspect_ratio: { type: "string" },
                      style_preset: { type: "string" },
                      output_format: { type: "string" },
                      seed: { type: "number" },
                      guidance_scale: { type: "number" },
                      num_inference_steps: { type: "number" },
                    },
                    required: ["prompt", "negative_prompt", "aspect_ratio", "style_preset", "output_format"],
                  },
                  explanation: {
                    type: "string",
                    description: "Human-readable explanation of the prompt and parameter choices",
                  },
                },
                required: ["json_output", "explanation"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_prompt" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI service payment required." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error("AI generation failed");
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const parsed = JSON.parse(toolCall.function.arguments);
    const { json_output, explanation } = parsed;

    // Save prompt to history
    await supabase.from("prompts").insert({
      user_id: userId,
      output_type: output_type || "image",
      use_case,
      subject,
      style,
      mood,
      camera,
      aspect_ratio: aspect_ratio || "16:9",
      advanced_options: advanced || {},
      json_output,
      explanation,
    });

    // Update usage tracking
    if (usage) {
      await supabase
        .from("usage_tracking")
        .update({ prompt_count: currentCount + 1 })
        .eq("user_id", userId)
        .eq("usage_date", today);
    } else {
      await supabase.from("usage_tracking").insert({
        user_id: userId,
        usage_date: today,
        prompt_count: 1,
      });
    }

    return new Response(JSON.stringify({ json_output, explanation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-prompt error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
