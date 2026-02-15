/**
 * EXAMPLE: How to use the new Gemini-based /api/generate endpoint
 * 
 * This file demonstrates how to integrate the new server-side Gemini generation
 * into your existing generators (Image/Video/Website).
 * 
 * KEY CHANGES FROM OLD APPROACH:
 * 1. Use generatePromptWithGemini() instead of generatePrompt()
 * 2. Pass only selected fields - don't include empty/undefined values
 * 3. Response is strictly typed and guaranteed valid
 * 4. aspectRatio and other fields are preserved exactly as provided
 */

import { generatePromptWithGemini } from "@/lib/api";
import type { GenerateRequest } from "@/lib/schemas/generateRequest";
import type { GenerateResponse } from "@/lib/schemas/generateResponse";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function ExampleImageGeneratorIntegration() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GenerateResponse | null>(null);

    // Form state (example for image generator)
    const [subject, setSubject] = useState("");
    const [platform, setPlatform] = useState("");
    const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:5" | "16:9" | "9:16" | undefined>("1:1");
    const [style, setStyle] = useState("");
    const [lighting, setLighting] = useState("");
    const [background, setBackground] = useState("");
    const [negativePrompt, setNegativePrompt] = useState("");

    const handleGenerate = async () => {
        if (!subject || !platform || !style) {
            toast({
                title: "Missing required fields",
                description: "Please fill in Subject, Platform, and Style.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            // Build request - ONLY include fields that have values
            const request: GenerateRequest = {
                type: "image",
                userText: `Generate an image prompt for: ${subject}`,
                // Only add optional fields if they have values
                ...(aspectRatio && { aspectRatio }),
                ...(style && { stylePreset: style }),
                ...(platform && { platform }),
                ...(lighting && { lighting }),
                ...(background && { background }),
                ...(negativePrompt && { negativePrompt }),
            };

            // Call the new Gemini endpoint
            const response = await generatePromptWithGemini(request);

            if (response.status === "succeeded" && response.result) {
                setResult(response);

                // Access the validated response
                const { jsonPrompt, humanReadable } = response.result;

                console.log("Generated prompt:", jsonPrompt.prompt);
                console.log("Aspect ratio:", jsonPrompt.aspectRatio); // This will be EXACTLY what you sent
                console.log("Human readable:", humanReadable);

                toast({
                    title: "Success!",
                    description: "Prompt generated successfully",
                });
            } else {
                throw new Error(response.error?.message || "Generation failed");
            }
        } catch (error: any) {
            console.error("Generation error:", error);
            toast({
                title: "Generation failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Your UI here */}
            <button onClick={handleGenerate} disabled={loading}>
                {loading ? "Generating..." : "Generate with Gemini"}
            </button>

            {result && result.result && (
                <div>
                    <h3>Generated Prompt:</h3>
                    <pre>{JSON.stringify(result.result.jsonPrompt, null, 2)}</pre>

                    <h3>Human Readable:</h3>
                    <p>{result.result.humanReadable}</p>
                </div>
            )}
        </div>
    );
}

/**
 * EXAMPLE 2: Video Generator
 */
export function ExampleVideoGeneratorIntegration() {
    const handleGenerate = async (formData: any) => {
        const request: GenerateRequest = {
            type: "video",
            userText: formData.description,
            ...(formData.aspectRatio && { aspectRatio: formData.aspectRatio }),
            ...(formData.duration && { duration: formData.duration }),
            ...(formData.motion && { motion: formData.motion }),
            ...(formData.style && { stylePreset: formData.style }),
        };

        const response = await generatePromptWithGemini(request);
        return response;
    };

    return <div>Video generator integration example</div>;
}

/**
 * EXAMPLE 3: Website Generator
 */
export function ExampleWebsiteGeneratorIntegration() {
    const handleGenerate = async (formData: any) => {
        const request: GenerateRequest = {
            type: "website",
            userText: formData.description,
            ...(formData.industry && { industry: formData.industry }),
            ...(formData.targetAudience && { targetAudience: formData.targetAudience }),
            ...(formData.colorScheme && { colorScheme: formData.colorScheme }),
            ...(formData.layout && { layout: formData.layout }),
        };

        const response = await generatePromptWithGemini(request);
        return response;
    };

    return <div>Website generator integration example</div>;
}

/**
 * MIGRATION NOTES:
 * 
 * 1. OLD WAY (n8n workflow):
 *    const response = await generatePrompt({
 *      type: "image",
 *      inputs: { ...everything }
 *    });
 * 
 * 2. NEW WAY (Gemini server-side):
 *    const response = await generatePromptWithGemini({
 *      type: "image",
 *      userText: "...",
 *      aspectRatio: "16:9", // Only if selected
 *      stylePreset: "Cinematic", // Only if selected
 *    });
 * 
 * 3. RESPONSE FORMAT (guaranteed):
 *    {
 *      requestId: "uuid",
 *      status: "succeeded" | "failed",
 *      result: {
 *        jsonPrompt: {
 *          prompt: "detailed prompt",
 *          negativePrompt: "...",
 *          model: "gemini-2.0-flash",
 *          aspectRatio: "16:9", // EXACTLY as you sent it
 *          stylePreset: "Cinematic" // ONLY if you sent it
 *        },
 *        humanReadable: "Friendly description"
 *      }
 *    }
 * 
 * 4. ERROR HANDLING:
 *    - All errors throw with descriptive messages
 *    - Use try/catch to handle
 *    - If status === "failed", check response.error
 */
