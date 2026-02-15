# System Architecture: Gemini Generation Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                           │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Image/Video/Website Generator UI                            │   │
│  │  - User fills form (subject, style, aspectRatio, etc.)       │   │
│  │  - Clicks "Generate"                                          │   │
│  └────────────────────────┬─────────────────────────────────────┘   │
│                           │                                          │
│                           ▼                                          │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Client API Function                                          │   │
│  │  src/lib/api.ts                                               │   │
│  │                                                               │   │
│  │  generatePromptWithGemini({                                   │   │
│  │    type: "image",                                             │   │
│  │    userText: "...",                                           │   │
│  │    aspectRatio: "16:9",  ← Only if selected                  │   │
│  │    stylePreset: "..."    ← Only if selected                  │   │
│  │  })                                                           │   │
│  └────────────────────────┬─────────────────────────────────────┘   │
│                           │                                          │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                            │ POST /api/generate
                            │ Authorization: Bearer <token>
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│                      SERVER (API Route)                              │
│  src/pages/api/generate.ts                                           │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ 1. Validate Auth (Supabase session)                            │ │
│  └──┬─────────────────────────────────────────────────────────────┘ │
│     │                                                                │
│  ┌──▼─────────────────────────────────────────────────────────────┐ │
│  │ 2. Validate Request (Zod schema)                                │ │
│  │    - Check required fields                                      │ │
│  │    - Validate field types                                       │ │
│  │    - Filter to only selected fields                             │ │
│  └──┬─────────────────────────────────────────────────────────────┘ │
│     │                                                                │
│  ┌──▼─────────────────────────────────────────────────────────────┐ │
│  │ 3. Build Gemini Prompt                                          │ │
│  │    System: "You are an expert prompt engineer..."              │ │
│  │    User: "Type: image, aspectRatio: 16:9, ..."                 │ │
│  └──┬─────────────────────────────────────────────────────────────┘ │
│     │                                                                │
│     │                                                                │
│     │ Call Gemini API                                               │
│     │ (GEMINI_API_KEY from env)                                     │
│     │                                                                │
│  ┌──▼─────────────────────────────────────────────────────────────┐ │
│  │         Google Gemini API                                       │ │
│  │         gemini-2.0-flash-exp                                    │ │
│  │                                                                 │ │
│  │  Generates:                                                     │ │
│  │  {                                                              │ │
│  │    "jsonPrompt": {                                              │ │
│  │      "prompt": "Detailed AI prompt",                            │ │
│  │      "aspectRatio": "16:9",                                     │ │
│  │      "stylePreset": "Cinematic"                                 │ │
│  │    },                                                           │ │
│  │    "humanReadable": "..."                                       │ │
│  │  }                                                              │ │
│  └──┬─────────────────────────────────────────────────────────────┘ │
│     │                                                                │
│  ┌──▼─────────────────────────────────────────────────────────────┐ │
│  │ 4. Parse & Validate Response                                    │ │
│  │    - Extract JSON from text                                     │ │
│  │    - Validate with Zod schema                                   │ │
│  │    - Auto-repair if malformed                                   │ │
│  └──┬─────────────────────────────────────────────────────────────┘ │
│     │                                                                │
│  ┌──▼─────────────────────────────────────────────────────────────┐ │
│  │ 5. Return Response                                              │ │
│  │    {                                                            │ │
│  │      requestId: "uuid",                                         │ │
│  │      status: "succeeded",                                       │ │
│  │      result: { jsonPrompt, humanReadable }                      │ │
│  │    }                                                            │ │
│  └────────────────────────┬───────────────────────────────────────┘ │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                            │ JSON Response
                            │
┌───────────────────────────▼──────────────────────────────────────────┐
│                          CLIENT (Browser)                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Handle Response                                                │ │
│  │  - Display generated prompt                                     │ │
│  │  - Show human-readable text                                     │ │
│  │  - Preserve aspectRatio exactly as selected                     │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Flow Example

### Input (from UI):
```javascript
{
  type: "image",
  userText: "A sunset over mountains",
  aspectRatio: "16:9",
  stylePreset: "Cinematic"
}
```

### Processing (server-side):
1. **Auth check** → Validate Supabase session
2. **Schema validation** → Ensure all fields valid
3. **Prompt building** → Convert to Gemini format
4. **Gemini call** → Ask AI to generate
5. **Response parsing** → Extract and validate JSON
6. **Auto-repair** → Fix if malformed (optional)

### Output (to UI):
```javascript
{
  requestId: "a1b2c3d4-...",
  status: "succeeded",
  result: {
    jsonPrompt: {
      prompt: "A breathtaking cinematic view of a sunset...",
      model: "gemini-2.0-flash",
      aspectRatio: "16:9",  // ← Preserved exactly
      stylePreset: "Cinematic"  // ← Preserved exactly
    },
    humanReadable: "I've created a cinematic prompt..."
  }
}
```

## Key Validation Points

```
┌─────────────────────────────────────────────────────────┐
│  CLIENT                                                 │
│  ✓ Form validation (required fields)                   │
│  ✓ Only send selected fields                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  SERVER                                                 │
│  ✓ Supabase auth (valid session)                       │
│  ✓ Zod request schema (field types, ranges)            │
│  ✓ Only include provided fields in prompt              │
│  ✓ Zod response schema (output structure)              │
│  ✓ Auto JSON repair if needed                          │
└─────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌──────────────────────────────────────────────────────────┐
│  ENVIRONMENT VARIABLES (Server-only)                     │
│  • GEMINI_API_KEY      ← Never exposed to client        │
│  • SUPABASE_SERVICE_KEY ← Never exposed to client       │
└──────────────────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  API ROUTE (Server-side)                                 │
│  • Session authentication required                       │
│  • Input sanitization via Zod                            │
│  • Output validation via Zod                             │
└──────────────────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  CLIENT (Browser)                                        │
│  • Only receives validated response                      │
│  • No direct access to API keys                          │
│  • No direct DB writes                                   │
└──────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌────────────────────────────────────────────────────────┐
│  Request arrives                                       │
└───┬────────────────────────────────────────────────────┘
    │
    ▼
┌────────────────────────┐  Invalid  ┌─────────────────┐
│  Auth valid?           │──────────▶│  401 Error      │
└────┬───────────────────┘           └─────────────────┘
     │ Valid
     ▼
┌────────────────────────┐  Invalid  ┌─────────────────┐
│  Request schema valid? │──────────▶│  400 Error      │
└────┬───────────────────┘           │  + Zod details  │
     │ Valid                          └─────────────────┘
     ▼
┌────────────────────────┐  Fail     ┌─────────────────┐
│  Gemini API call       │──────────▶│  503 Error      │
└────┬───────────────────┘           │  Service down   │
     │ Success                        └─────────────────┘
     ▼
┌────────────────────────┐  Invalid  ┌─────────────────┐
│  JSON parsing          │──────────▶│  Try repair     │
└────┬───────────────────┘           └────┬────────────┘
     │ Valid                               │
     │                              Failed │
     │                                     ▼
     │                          ┌─────────────────┐
     │                          │  500 Error      │
     │                          │  Invalid JSON   │
     │                          └─────────────────┘
     ▼
┌────────────────────────┐  Invalid  ┌─────────────────┐
│  Response schema valid?│──────────▶│  500 Error      │
└────┬───────────────────┘           │  Wrong format   │
     │ Valid                          └─────────────────┘
     ▼
┌────────────────────────────────────────────────────────┐
│  200 Success - Return validated response               │
└────────────────────────────────────────────────────────┘
```

## File Structure

```
prompt-weaver/
│
├── src/
│   ├── lib/
│   │   ├── schemas/
│   │   │   ├── generateRequest.ts    ← Request validation
│   │   │   └── generateResponse.ts   ← Response validation
│   │   │
│   │   └── api.ts                    ← Client functions
│   │
│   ├── pages/
│   │   ├── api/
│   │   │   └── generate.ts           ← API endpoint
│   │   │
│   │   ├── ImageGenerator.tsx        ← UI (to be updated)
│   │   ├── VideoGenerator.tsx        ← UI (to be updated)
│   │   └── WebsiteGenerator.tsx      ← UI (to be updated)
│   │
│   └── examples/
│       └── GeminiIntegrationExample.tsx  ← Examples
│
├── .env                               ← API keys (SERVER ONLY)
│
└── Documentation/
    ├── IMPLEMENTATION_SUMMARY.md     ← This overview
    ├── GEMINI_IMPLEMENTATION.md      ← Full technical docs
    ├── QUICKSTART.md                 ← Setup guide
    └── MIGRATION_GUIDE.md            ← How to update UIs
```

## Performance Characteristics

```
Request → Validation → Gemini → Parsing → Response
  ~5ms      ~10ms      2-5s      ~5ms      ~5ms

Total: 2-5 seconds typical
Timeout: 40 seconds max
```

## Scaling Considerations

```
┌────────────────────────────────────────────────────────┐
│  Current: Single Gemini endpoint                       │
│  • Simple                                              │
│  • Direct calls                                        │
│  • No queue                                            │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  Future: Queue-based (optional)                        │
│  • Add to queue                                        │
│  • Background worker processes                         │
│  • Webhook on completion                               │
│  • Supports retry & priority                           │
└────────────────────────────────────────────────────────┘
```
