# Generator Migration Guide

This guide shows exactly how to update your existing Image/Video/Website generators to use the new Gemini endpoint.

## Image Generator Migration

### File: `src/pages/ImageGenerator.tsx`

#### 1. Add imports at the top:
```typescript
import { generatePromptWithGemini } from "@/lib/api";
import type { GenerateRequest } from "@/lib/schemas/generateRequest";
```

#### 2. Update the handleGenerate function:

**BEFORE (Mock/n8n):**
```typescript
const handleGenerate = () => {
    if (!subject || !platform || !style) {
        toast({
            title: "Missing fields",
            description: "Please fill in Platform, Subject, and Style.",
            variant: "destructive",
        });
        return;
    }

    setLoading(true);

    setTimeout(() => {
        const data = {
            platform,
            aspectRatio,
            subject,
            style,
            background: background || "Abstract gradient",
            lighting: lighting || "Studio lighting",
            camera: camera || "Eye level",
            negative
        };

        setResult({
            text: MOCK_TEMPLATE(data),
            json: MOCK_JSON(data),
        });
        setLoading(false);
        toast({ title: "Image prompt generated!" });
    }, 1500);
};
```

**AFTER (Gemini):**
```typescript
const handleGenerate = async () => {
    if (!subject || !platform || !style) {
        toast({
            title: "Missing fields",
            description: "Please fill in Platform, Subject, and Style.",
            variant: "destructive",
        });
        return;
    }

    setLoading(true);

    try {
        // Build request - only include selected fields
        const request: GenerateRequest = {
            type: "image",
            userText: subject,
            platform: platform,
            // Only add optional fields if they have values
            ...(aspectRatio && { aspectRatio }),
            ...(style && { stylePreset: style }),
            ...(background && { background }),
            ...(lighting && { lighting }),
            ...(camera && { cameraAngle: camera }),
            ...(negative && { negativePrompt: negative }),
        };

        const response = await generatePromptWithGemini(request);

        if (response.status === "succeeded" && response.result) {
            const { jsonPrompt, humanReadable } = response.result;
            
            setResult({
                text: humanReadable,
                json: JSON.stringify(jsonPrompt, null, 2),
            });
            
            toast({ title: "Image prompt generated!" });
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
```

#### 3. Update result state type (optional but recommended):
```typescript
import type { GenerateResponse } from "@/lib/schemas/generateResponse";

// Change from:
const [result, setResult] = useState<{ text: string; json: string } | null>(null);

// To:
const [result, setResult] = useState<{
    text: string;
    json: string;
    raw?: GenerateResponse;
} | null>(null);

// Then store full response:
setResult({
    text: humanReadable,
    json: JSON.stringify(jsonPrompt, null, 2),
    raw: response, // Keep full response for debugging
});
```

---

## Video Generator Migration

### File: `src/pages/VideoGenerator.tsx`

#### Key Changes:
```typescript
import { generatePromptWithGemini } from "@/lib/api";
import type { GenerateRequest } from "@/lib/schemas/generateRequest";

const handleGenerate = async () => {
    // ... validation ...

    try {
        const request: GenerateRequest = {
            type: "video",
            userText: concept, // or description field
            
            // Video-specific fields
            ...(aspectRatio && { aspectRatio }),
            ...(duration && { duration }),
            ...(motion && { motion }),
            ...(transitions && { transitions }),
            ...(style && { stylePreset: style }),
            ...(tone && { intent: tone }),
        };

        const response = await generatePromptWithGemini(request);

        if (response.status === "succeeded" && response.result) {
            const { jsonPrompt, humanReadable } = response.result;
            
            // Update your UI with the result
            setResult({
                prompt: jsonPrompt.prompt,
                readable: humanReadable,
                full: jsonPrompt,
            });
        }
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};
```

---

## Website Generator Migration

### File: `src/pages/WebsiteGenerator.tsx`

#### Key Changes:
```typescript
import { generatePromptWithGemini } from "@/lib/api";
import type { GenerateRequest } from "@/lib/schemas/generateRequest";

const handleGenerate = async () => {
    // ... validation ...

    try {
        const request: GenerateRequest = {
            type: "website",
            userText: description,
            
            // Website-specific fields
            ...(industry && { industry }),
            ...(targetAudience && { targetAudience }),
            ...(colorScheme && { colorScheme }),
            ...(layout && { layout }),
            ...(purpose && { intent: purpose }),
        };

        const response = await generatePromptWithGemini(request);

        if (response.status === "succeeded" && response.result) {
            const { jsonPrompt, humanReadable } = response.result;
            
            // jsonPrompt contains the website blueprint
            // humanReadable contains user-friendly explanation
            
            setResult({
                blueprint: jsonPrompt,
                description: humanReadable,
            });
        }
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};
```

---

## Common Field Mapping

When converting from your UI fields to GenerateRequest fields:

| UI Field | Request Field | Type | Notes |
|----------|---------------|------|-------|
| `subject` | `userText` | string | Main input |
| `style` | `stylePreset` | string | Art/visual style |
| `platform` | `platform` | string | Target platform |
| `camera` | `cameraAngle` | string | Camera perspective |
| `negative` | `negativePrompt` | string | Things to avoid |
| `tone` | `intent` | string | Purpose/feeling |
| `purpose` | `intent` | string | Use case |

---

## Handling Different Result Formats

### If you're using tabs (Prompt/JSON):

```typescript
setResult({
    text: response.result.humanReadable, // For "Prompt" tab
    json: JSON.stringify(response.result.jsonPrompt, null, 2), // For "JSON" tab
});
```

### If you're displaying fields separately:

```typescript
const { jsonPrompt } = response.result;

setPrompt(jsonPrompt.prompt);
setAspectRatio(jsonPrompt.aspectRatio);
setStyle(jsonPrompt.stylePreset);
setNegative(jsonPrompt.negativePrompt);
```

---

## Error Handling Patterns

### Basic:
```typescript
try {
    const response = await generatePromptWithGemini(request);
    // ... handle success
} catch (error: any) {
    toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
    });
}
```

### Advanced (with retry):
```typescript
const MAX_RETRIES = 2;
let attempt = 0;

while (attempt < MAX_RETRIES) {
    try {
        const response = await generatePromptWithGemini(request);
        if (response.status === "succeeded") {
            // Success!
            break;
        } else if (response.error) {
            throw new Error(response.error.message);
        }
    } catch (error: any) {
        attempt++;
        if (attempt >= MAX_RETRIES) {
            toast({
                title: "Generation failed",
                description: `Failed after ${MAX_RETRIES} attempts: ${error.message}`,
                variant: "destructive",
            });
        } else {
            console.log(`Retry ${attempt}/${MAX_RETRIES}...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
```

---

## Testing Checklist

After migrating each generator:

- [ ] Form validation still works
- [ ] Loading states display correctly
- [ ] Empty fields are NOT sent to API (use conditional spreading)
- [ ] aspectRatio is preserved exactly as selected
- [ ] Generated prompt displays in UI
- [ ] JSON output is valid and formatted
- [ ] Error messages show when generation fails
- [ ] Clear button resets all fields
- [ ] Multiple generations work in sequence

---

## Gradual Migration Strategy

You can migrate gradually without breaking existing functionality:

### Option 1: Feature Flag
```typescript
const USE_GEMINI = true; // Toggle this

const handleGenerate = async () => {
    if (USE_GEMINI) {
        // New Gemini logic
    } else {
        // Old mock/n8n logic
    }
};
```

### Option 2: Fallback
```typescript
try {
    // Try Gemini first
    const response = await generatePromptWithGemini(request);
    // ...
} catch (geminiError) {
    console.warn("Gemini failed, falling back to n8n:", geminiError);
    // Fall back to old method
    const response = await generatePrompt({
        type: "image",
        inputs: {...}
    });
}
```

---

## Performance Optimization

### 1. Debounce rapid clicks:
```typescript
import { useCallback } from "react";
import debounce from "lodash/debounce"; // or implement your own

const debouncedGenerate = useCallback(
    debounce(async () => {
        await handleGenerate();
    }, 500),
    []
);
```

### 2. Cache results (optional):
```typescript
const [cache, setCache] = useState<Map<string, GenerateResponse>>(new Map());

const getCacheKey = (request: GenerateRequest) => {
    return JSON.stringify(request);
};

const handleGenerate = async () => {
    const key = getCacheKey(request);
    
    if (cache.has(key)) {
        console.log("Using cached result");
        setResult(cache.get(key)!.result);
        return;
    }
    
    const response = await generatePromptWithGemini(request);
    cache.set(key, response);
    // ...
};
```

---

## Rollback Plan

If you need to quickly rollback:

1. Keep old code in comments:
```typescript
// OLD CODE (pre-Gemini):
// const handleGenerate = () => { ... }

// NEW CODE (Gemini):
const handleGenerate = async () => { ... }
```

2. Or create a separate branch:
```bash
git checkout -b feature/gemini-integration
# Make changes
# Test thoroughly
# Merge when ready
```

---

## Next Steps

1. Start with **Image Generator** (simplest)
2. Test thoroughly with various inputs
3. Move to **Video Generator**
4. Finally update **Website Generator**
5. Remove old mock code
6. Update tests if you have them

---

**Questions?** Check `GEMINI_IMPLEMENTATION.md` for full documentation.
