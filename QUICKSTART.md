# Quick Start: Gemini Generation Setup

## Step 1: Get Your API Keys

### Gemini API Key:
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### Supabase Service Role Key:
1. Go to your Supabase Dashboard
2. Navigate to Settings → API
3. Find "Service Role Key" (secret)
4. Copy the key

## Step 2: Update .env File

Replace the placeholder values in `.env`:

```bash
# Replace these with your actual keys:
SUPABASE_SERVICE_ROLE_KEY="YOUR_ACTUAL_SERVICE_ROLE_KEY"
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
```

## Step 3: Test the Endpoint

### Option A: Using curl (manual test)
```bash
# 1. Start the dev server
npm run dev

# 2. Get a session token from your browser:
#    - Open DevTools → Application → Local Storage
#    - Find your Supabase session token

# 3. Test the endpoint:
curl -X POST http://localhost:8080/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN_HERE" \
  -d '{
    "type": "image",
    "userText": "A peaceful mountain landscape at sunset",
    "aspectRatio": "16:9",
    "stylePreset": "Cinematic"
  }'
```

### Option B: Using the UI (recommended)
1. Update one of your generators (e.g., ImageGenerator.tsx)
2. Replace the generation logic with:

```typescript
import { generatePromptWithGemini } from "@/lib/api";
import type { GenerateRequest } from "@/lib/schemas/generateRequest";

const handleGenerate = async () => {
  try {
    const request: GenerateRequest = {
      type: "image",
      userText: subject,
      ...(aspectRatio && { aspectRatio }),
      ...(style && { stylePreset: style }),
      ...(platform && { platform }),
    };

    const response = await generatePromptWithGemini(request);
    
    if (response.status === "succeeded" && response.result) {
      console.log("Generated:", response.result.jsonPrompt);
      // Update UI with result
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

## Step 4: Verify It Works

### Expected Success Response:
```json
{
  "requestId": "uuid-here",
  "status": "succeeded",
  "result": {
    "jsonPrompt": {
      "prompt": "A detailed AI-generated prompt...",
      "negativePrompt": "...",
      "model": "gemini-2.0-flash",
      "aspectRatio": "16:9",
      "stylePreset": "Cinematic"
    },
    "humanReadable": "A friendly explanation..."
  }
}
```

### Check Logs:
Look for these in your terminal:
- `[generate] Request <uuid> from user <user-id>`
- `[generate] Calling Gemini for image...`
- `[generate] Success for <uuid>`

## Step 5: Integrate into All Generators

See `src/examples/GeminiIntegrationExample.tsx` for complete examples.

### Key Points:
1. **Only pass selected fields** - use conditional spreading
2. **Map UI field names** - e.g., `style` → `stylePreset`
3. **Handle the response** - use `result.jsonPrompt` and `result.humanReadable`
4. **Error handling** - wrap in try/catch

## Common Issues

### "GEMINI_API_KEY is not defined"
- Make sure you added it to `.env`
- Restart your dev server after updating `.env`

### "Invalid session" error
- Check that your Supabase auth is working
- Verify SUPABASE_SERVICE_ROLE_KEY is correct

### "AI returned invalid JSON"
- This should auto-repair, but check logs
- Verify your Gemini API key is valid
- Check if you hit rate limits

### Response doesn't include my aspectRatio
- Make sure you're passing it in the request
- Check it's one of the valid values: "1:1" | "4:5" | "16:9" | "9:16" | "1.91:1"
- Verify it's not empty/undefined

## Performance Notes

- Average response time: 2-5 seconds
- Timeout: 40 seconds (configurable)
- Auto-retry on JSON parse errors
- Concurrent requests: Limited by Gemini API quota

## Debugging

Enable detailed logging by checking your terminal for:
```
[generate] Request <id> from user <user-id>
[generate] User content:
Type: image
User Input: ...
Aspect Ratio: 16:9
...
[generate] Calling Gemini for image...
[generate] Gemini raw response:
{...}
[generate] Success for <id>
```

## Next Steps

1. ✅ Test with a simple request
2. ✅ Verify aspectRatio is preserved
3. ✅ Update Image Generator
4. ✅ Update Video Generator
5. ✅ Update Website Generator
6. ✅ Add error toast notifications
7. ✅ Remove old n8n calls (optional)

## Need Help?

Check `GEMINI_IMPLEMENTATION.md` for full documentation.
