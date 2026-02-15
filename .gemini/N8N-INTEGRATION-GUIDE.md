# n8n Workflow Integration Guide
## Production-Grade Setup for Prompt Weaver

**Date:** 2026-02-14  
**Purpose:** Configure n8n workflow to work with new secure integration

---

## 🎯 WORKFLOW REQUIREMENTS

### 1. **Webhook Trigger Node**

**Configuration:**
- **HTTP Method:** POST
- **Path:** `/webhook/promptweaver/generate` (or your custom path)
- **Response Mode:** "Respond to Webhook"
- **Response Code:** 200

**Important:** Note the complete webhook URL (e.g., `https://your-n8n.app.n8n.cloud/webhook/promptweaver/generate`)

---

### 2. **Validate Signature Node (First Step)**

**Node Type:** Function or Code Node

**Purpose:** Verify HMAC signature for security

**Code:**
```javascript
const crypto = require('crypto');

// Get signature from header
const signature = $input.headers['x-pw-signature'];
const requestId = $input.headers['x-pw-request-id'];
const secret = $env.N8N_WEBHOOK_SECRET; // Set in n8n environment variables

// Calculate expected signature
const payload = JSON.stringify($input.body);
const expected = crypto.createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

// Verify
if (signature !== expected) {
  throw new Error('Invalid signature');
}

// Pass through the validated data
return {
  requestId,
  ...$ input.body
};
```

**Alternative:** If signature verification is complex in n8n, skip this node. The server already validates before calling n8n. Add IP allowlist in n8n settings instead.

---

### 3. **Validate Payload Node**

**Node Type:** Function Node

**Purpose:** Ensure required fields exist

**Code:**
```javascript
const data = $input.item.json;

// Required fields
const required = ['type', 'requestId', 'userId', 'timestamp', 'inputs'];

for (const field of required) {
  if (!data[field]) {
    throw new Error(`Missing required field: ${field}`);
  }
}

// Validate type enum
if (!['image', 'video', 'website'].includes(data.type)) {
  throw new Error(`Invalid type: ${data.type}`);
}

return data;
```

---

### 4. **Route by Type Node**

**Node Type:** Switch/IF Node

**Purpose:** Route to different processing logic based on `type` field

**Conditions:**
- If `type === "image"` → Image Processing Branch
- If `type === "video"` → Video Processing Branch
- If `type === "website"` → Website Blueprint Branch

---

### 5. **Processing Nodes (Per Type)**

**Image Processing Branch:**
```javascript
// Extract inputs
const inputs = $input.item.json.inputs;

// Your image prompt generation logic here
// Example:
const {
  subject,
  style,
  mood,
  camera,
  lighting,
  // ... other fields
} = inputs;

// Generate JSON prompt
const jsonPrompt = {
  prompt: `A ${style} ${mood} photo of ${subject} with ${lighting} lighting, shot with ${camera}`,
  // ... more fields
};

// Generate human-readable explanation
const humanReadable = `This generates a ${style} image ...`;

return {
  requestId: $input.item.json.requestId,
  status: 'succeeded',
  result: {
    jsonPrompt,
    humanReadable
  }
};
```

**Video Processing Branch:** Similar structure with video-specific logic

**Website Blueprint Branch:** Similar structure with website-specific logic

---

### 6. **Error Handling Node**

**Node Type:** Error Trigger Node

**Purpose:** Catch any errors and return proper format

**Code:**
```javascript
const error = $input.item.json.error;

return {
  requestId: $input.item.json.requestId || 'unknown',
  status: 'failed',
  error: {
    code: error.code || 'processing_error',
    message: error.message || 'Workflow execution failed'
  }
};
```

---

### 7. **Respond to Webhook Node**

**Node Type:** Respond to Webhook

**Configuration:**
- **Response Code:** 200
- **Response Body:** "Using 'First Incoming Item'"

**Important:** This node MUST return the exact schema:
```json
{
  "requestId": "uuid",
  "status": "succeeded" | "failed",
  "result": {
    "jsonPrompt": {},
    "humanReadable": "string"
  },
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

---

## 🔐 SECURITY CONFIGURATION

### Environment Variables in n8n:
```
N8N_WEBHOOK_SECRET=your_secure_random_string_here
```

**Generate secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### IP Allowlist (Recommended):
If your n8n instance supports it, add your production server IP to allowlist.

---

## 🧪 TESTING THE WORKFLOW

### Test Payload (manually trigger in n8n):
```json
{
  "type": "image",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2026-02-14T12:30:00.000Z",
  "inputs": {
    "subject": "sunset over mountains",
    "style": "cinematic",
    "mood": "serene",
    "camera": "Canon EOS R5",
    "lighting": "golden hour"
  }
}
```

### Expected Response:
```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "succeeded",
  "result": {
    "jsonPrompt": {
      "prompt": "A cinematic serene photo of sunset over mountains..."
    },
    "humanReadable": "This prompt generates a cinematic image..."
  }
}
```

---

## 📊 WORKFLOW DIAGRAM

```
[Webhook Trigger]
       ↓
[Validate Signature] (optional)
       ↓
[Validate Payload]
       ↓
[Switch by Type]
     ↙   ↓   ↘
[Image] [Video] [Website]
     ↘   ↓   ↙
[Error Handler]
       ↓
[Respond to Webhook]
```

---

## 🐛 TROUBLESHOOTING

### Common Issues:

**1. "Invalid signature" error:**
- Check N8N_WEBHOOK_SECRET matches between server and n8n
- Ensure server is sending X-PW-Signature header
- Verify payload is stringified correctly

**2. "Missing required field" error:**
- Check client is passing all required inputs
- Verify schema validation in /api/workflows/run

**3. "Timeout" error:**
- Reduce processing time in n8n nodes
- Increase timeout in server (REQUEST_TIMEOUT constant)
- Consider async mode for long-running workflows

**4. n8n returns HTML instead of JSON:**
- Check "Respond to Webhook" node is configured correctly
- Ensure workflow path matches exactly
- Verify workflow is active (not paused)

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Webhook trigger configured with correct path
- [ ] Environment variable N8N_WEBHOOK_SECRET set
- [ ] IP allowlist configured (if available)
- [ ] All processing branches handle errors
- [ ] Response format matches schema exactly
- [ ] Workflow activated (not in draft mode)
- [ ] Test execution passes with sample payload
- [ ] Response time < 25 seconds (for sync mode)

---

## 📝 ENVIRONMENT VARIABLES

### Required in Production Server:
```env
N8N_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/promptweaver/generate
N8N_WEBHOOK_SECRET=your_secure_random_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Required in n8n:
```env
N8N_WEBHOOK_SECRET=same_as_server_secret
```

---

## 🎉 SUCCESS CRITERIA

When properly configured:
1. ✅ Server calls n8n successfully
2. ✅ n8n validates signature (or IP allowlist works)
3. ✅ Processing completes in < 25 seconds
4. ✅ Response matches expected schema
5. ✅ Errors are caught and returned properly
6. ✅ Multiple generator types work seamlessly

---

**Status:** Ready for integration with `/api/workflows/run` endpoint
