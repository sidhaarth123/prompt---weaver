import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Using the model version requested by user. If 'gemini-2.5-flash' fails, try 'gemini-1.5-flash'.
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        success: true,
        data: {
            message: "Prompt Assistant Server running",
            timestamp: new Date().toISOString()
        }
    });
});

function normalizeFill(fill) {
    const norm = { ...fill };

    // Normalize aspect ratio
    const ar = (norm.aspect_ratio || "")
        .toLowerCase()
        .replace(/\s+/g, "");

    if (ar.includes("1:1") || ar === "1x1" || ar === "square") {
        norm.aspect_ratio = "1:1";
    } else if (ar.includes("4:5") || ar === "4x5" || ar.includes("portrait")) {
        norm.aspect_ratio = "4:5";
    } else if (ar.includes("16:9") || ar === "16x9" || ar.includes("landscape")) {
        norm.aspect_ratio = "16:9";
    } else if (ar.includes("9:16") || ar === "9x16" || ar.includes("vertical") || ar.includes("story")) {
        norm.aspect_ratio = "9:16";
    } else {
        norm.aspect_ratio = norm.aspect_ratio || "1:1";
    }

    // Trim text fields
    [
        "platform",
        "subject_description",
        "art_style",
        "background_scene",
        "lighting",
        "camera_angle",
        "negative_prompt"
    ].forEach((key) => {
        if (typeof norm[key] === "string") {
            norm[key] = norm[key].trim();
        }
    });

    return norm;
}

app.post('/api/prompt-assistant', async (req, res) => {
    try {
        const { message, form_state } = req.body;

        if (!GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            return res.status(500).json({
                success: false,
                error: { code: "server_config_error", message: "Server configuration error provided key is missing" }
            });
        }

        const systemPrompt = `
You are Prompt-Weaver Image Prompt Assistant.

Return STRICT JSON ONLY. No markdown, no extra text.

You MUST fill ALL fields in "fill" with non-empty values.
If the user did not specify a field, infer a best default that matches the user intent.

Allowed values (must choose one from each list):

platform: ["Midjourney","DALL-E 3","Stable Diffusion"]

aspect_ratio: ["1:1","4:5","16:9","9:16"]

art_style (choose ONE): 
["Cinematic","Photorealistic","3D Render","Anime","Cyberpunk","Minimal","Product Photography","Studio Portrait","Illustration","Watercolor","Oil Painting","Isometric","Concept Art"]

lighting (choose ONE):
["Soft Studio","Cinematic","Neon","Golden Hour","Moody","High Key","Low Key","Rim Light","Volumetric","Natural"]

camera_angle (choose ONE):
["Eye Level","Low Angle","High Angle","Top Down","Close Up","Wide Shot","Three-Quarter","Overhead","Dutch Angle"]

JSON SCHEMA (must match exactly):
{
  "fill": {
    "platform": "",
    "aspect_ratio": "",
    "subject_description": "",
    "art_style": "",
    "background_scene": "",
    "lighting": "",
    "camera_angle": "",
    "negative_prompt": ""
  },
  "output": {
    "prompt": "",
    "negative_prompt": "",
    "params": {
      "aspect_ratio": "",
      "art_style": "",
      "lighting": "",
      "camera_angle": ""
    }
  }
}

Rules:
- Preserve any non-empty value already present in form_state (do not override it).
- If a form_state field is empty, fill it with the best allowed value.
- output.prompt must include: subject + art style + background + lighting + camera angle.
- output.params must repeat aspect_ratio, art_style, lighting, camera_angle.
- negative_prompt must be a comma-separated list.
- Return valid JSON only.
`;

        const userMessage = `
    Context:
    User Message: "${message}"
    Current Form State: ${JSON.stringify(form_state)}

    Task: Update the form state based on the user message and generate the final prompt.
    `;

        const payload = {
            contents: [{
                parts: [{
                    text: systemPrompt + "\n\n" + userMessage
                }]
            }],
            generationConfig: {
                temperature: 0.3
            }
        };

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", response.status, errorText);
            throw new Error(`Gemini API request failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract text from Gemini response structure
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error("Empty response from Gemini");
        }

        // Clean up response if it contains markdown code blocks
        responseText = responseText.replace(/```json\n?|```/g, "").trim();

        let parsedJson;
        try {
            parsedJson = JSON.parse(responseText);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            // Fallback: Try to find JSON object in text if parsing failed directly
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    parsedJson = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                    throw new Error("Failed to parse JSON response from Gemini");
                }
            } else {
                throw new Error("Failed to parse JSON response from Gemini");
            }
        }

        // Normalize fill object
        parsedJson.fill = normalizeFill(parsedJson.fill || {});

        // Keep output.params synced with normalized values
        if (parsedJson.output && parsedJson.output.params) {
            parsedJson.output.params.aspect_ratio = parsedJson.fill.aspect_ratio;
            parsedJson.output.params.art_style = parsedJson.fill.art_style;
            parsedJson.output.params.lighting = parsedJson.fill.lighting;
            parsedJson.output.params.camera_angle = parsedJson.fill.camera_angle;
        }

        res.json({
            success: true,
            data: parsedJson
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "api_error",
                message: error instanceof Error ? error.message : "Internal server error"
            }
        });
    }
});


function normalizeVideoFill(fill) {
    const norm = { ...fill };

    // Normalize aspect ratio
    const ar = (norm.aspect_ratio || "")
        .toLowerCase()
        .replace(/\s+/g, "");

    if (ar.includes("9:16") || ar === "9x16" || ar.includes("story") || ar.includes("tiktok") || ar.includes("reels")) {
        norm.aspect_ratio = "9:16";
    } else if (ar.includes("16:9") || ar === "16x9" || ar.includes("landscape") || ar.includes("youtube")) {
        norm.aspect_ratio = "16:9";
    } else if (ar.includes("1:1") || ar === "1x1" || ar === "square") {
        norm.aspect_ratio = "1:1";
    } else if (ar.includes("4:5") || ar === "4x5" || ar.includes("portrait")) {
        norm.aspect_ratio = "4:5";
    } else {
        norm.aspect_ratio = norm.aspect_ratio || "9:16";
    }

    // Normalize Duration
    let dur = parseInt(norm.duration);
    if (isNaN(dur)) dur = 15;
    if (dur < 5) dur = 5;
    if (dur > 60) dur = 60;
    norm.duration = dur;

    // Normalize Booleans
    norm.voiceover = !!norm.voiceover;
    norm.music_sfx = !!norm.music_sfx;

    // Trim text fields
    [
        "platform",
        "video_style",
        "template",
        "hook",
        "scene_beats",
        "visual_details",
        "characters_props",
        "on_screen_text",
        "negative_constraints"
    ].forEach((key) => {
        if (typeof norm[key] === "string") {
            norm[key] = norm[key].trim();
        }
    });

    return norm;
}

app.post('/api/video-prompt-assistant', async (req, res) => {
    try {
        const { message, form_state } = req.body;

        if (!GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            return res.status(500).json({
                success: false,
                error: { code: "server_config_error", message: "Server configuration error provided key is missing" }
            });
        }

        const systemPrompt = `
You are Prompt-Weaver Video Prompt Assistant.

Return STRICT JSON ONLY. No markdown, no extra text.

You MUST fill ALL fields in "fill" with non-empty values.
If the user did not specify a field, infer a best default video concept.

Allowed values:
aspect_ratio: ["9:16","16:9","1:1","4:5"]
duration: number between 5 and 60.

JSON SCHEMA (must match exactly):
{
  "fill": {
    "platform": "",
    "video_style": "",
    "aspect_ratio": "",
    "duration": 15,
    "template": "",
    "hook": "",
    "scene_beats": "",
    "visual_details": "",
    "characters_props": "",
    "on_screen_text": "",
    "voiceover": false,
    "music_sfx": false,
    "negative_constraints": ""
  },
  "output": {
    "prompt": "",
    "json_spec": {
      "platform": "",
      "video_style": "",
      "aspect_ratio": "",
      "duration": 15,
      "template": "",
      "hook": "",
      "scene_beats": "",
      "visual_details": "",
      "characters_props": "",
      "on_screen_text": "",
      "voiceover": false,
      "music_sfx": false,
      "negative_constraints": ""
    }
  }
}

Rules:
- Preserve non-empty form_state values (do not override).
- If form_state field is empty, infer best value.
- output.prompt must be a final, high-quality video generation prompt that includes platform, style, duration, aspect ratio, hook, scene beats, visuals, characters/props, on-screen text, audio choices, and constraints.
- output.json_spec must mirror final values exactly.
- Return valid JSON only (no markdown).
`;

        const userMessage = `
    Context:
    User Message: "${message}"
    Current Form State: ${JSON.stringify(form_state)}

    Task: Update the video form state based on the user message and generate the final video prompt.
    `;

        const payload = {
            contents: [{
                parts: [{
                    text: systemPrompt + "\n\n" + userMessage
                }]
            }],
            generationConfig: {
                temperature: 0.3
            }
        };

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", response.status, errorText);
            throw new Error(`Gemini API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error("Empty response from Gemini");
        }

        responseText = responseText.replace(/```json\n?|```/g, "").trim();

        let parsedJson;
        try {
            parsedJson = JSON.parse(responseText);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    parsedJson = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                    throw new Error("Failed to parse JSON response from Gemini");
                }
            } else {
                throw new Error("Failed to parse JSON response from Gemini");
            }
        }

        // Normalize Video Fill
        parsedJson.fill = normalizeVideoFill(parsedJson.fill || {});

        // Sync output.json_spec with normalized fill
        if (parsedJson.output) {
            parsedJson.output.json_spec = { ...parsedJson.fill };
        }

        res.json({
            success: true,
            data: parsedJson
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({
            success: false,
            error: {
                code: "api_error",
                message: error instanceof Error ? error.message : "Internal server error"
            }
        });
    }
});


function normalizeWebsiteFill(fill) {
    const norm = { ...fill };

    // Standard defaults
    if (!norm.project_name) norm.project_name = "My Website Project";

    // Normalize Sections Array
    let sections = norm.structure_sections;
    if (typeof sections === "string") {
        // Try to parse if it looks like JSON array, or split by comma
        if (sections.trim().startsWith("[")) {
            try { sections = JSON.parse(sections); }
            catch (e) { sections = sections.split(",").map(s => s.trim()); }
        } else {
            sections = sections.split(",").map(s => s.trim());
        }
    }
    if (!Array.isArray(sections)) sections = [];

    // Filter to non-empty strings and deduplicate
    sections = [...new Set(sections.filter(s => typeof s === "string" && s.trim().length > 0))];

    // Default if empty
    if (sections.length === 0) {
        sections = ["Hero Section", "Features Grid", "Call to Action (CTA)", "Footer"];
    }

    norm.structure_sections = sections;

    // Trim text fields
    [
        "project_name",
        "website_type",
        "tech_stack",
        "visual_style",
        "target_audience",
        "primary_goal"
    ].forEach((key) => {
        if (typeof norm[key] === "string") {
            norm[key] = norm[key].trim();
        }
    });

    return norm;
}

app.post('/api/website-prompt-assistant', async (req, res) => {
    try {
        const { message, form_state } = req.body;

        if (!GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing");
            return res.status(500).json({
                success: false,
                error: { code: "server_config_error", message: "Server configuration error provided key is missing" }
            });
        }

        const systemPrompt = `
You are Prompt-Weaver E-commerce Architect Assistant.

Return STRICT JSON ONLY. No markdown.

You MUST fill the "ecom" object in "fill" with non-empty values based on the user's request.
Infer best professional defaults if user input is missing.

Allowed Values Guidance:
business_model: ["Single Product Brand", "Multi-Product Store", "Dropshipping", "Print on Demand", "Subscription Based", "Digital Product"]
price_range: ["Budget", "Mid-Range", "Premium", "Luxury"]
brand_personality: ["Minimal & Clean", "Bold & Energetic", "Luxury & Premium", "Playful", "Corporate", "Futuristic"]
ecommerce_platform: ["Shopify", "WooCommerce", "Custom (Next.js)", "Webflow", "Framer", "Headless Commerce"]
tech_stack: ["Prompt Weaver (React + shadcn)", "Bolt.new", "Cursor (AI Editor)", "v0 (Vercel)", "Next.js (App Router)", "React + Vite"]
payment_integrations: ["Stripe", "Razorpay", "PayPal", "Apple Pay", "Google Pay", "COD"]
conversion_goal: ["Direct Purchase", "Add to Cart", "Email Capture", "Pre-Launch Waitlist"]
traffic_source: ["Meta Ads", "TikTok Ads", "Google Ads", "Organic SEO", "Influencer Marketing"]
funnel_type: ["Single Page Funnel", "Multi-Step Funnel", "Traditional Store", "High-Converting Landing Page"]
psychology_style: ["Scarcity Focused", "Social Proof Heavy", "Storytelling Driven", "Data & Statistics", "Premium Brand Authority"]
urgency_strategy: ["Limited Stock", "Limited Time Offer", "Flash Sale", "New Launch", "Evergreen"]
upsell_strategy: ["Cart Upsell", "Post-Purchase Upsell", "Bundle Discount", "Subscription Offer", "None"]
trust_elements: ["Money Back Guarantee", "Secure Payment Icons", "Customer Testimonials", "Influencer Reviews", "Certifications"]

structure_sections: [
    "Hero Section", "Product Showcase Grid", "Featured Product Section", "Features Grid", 
    "Trust Badges", "Pricing Table", "Comparison Table", "Bundle Offers Section", 
    "Frequently Bought Together", "Customer Reviews Slider", "Instagram Feed", 
    "Shipping & Returns Info", "Guarantee Section", "FAQ Accordion", "Contact Form", 
    "Newsletter Signup", "Footer", "Sticky Add-to-Cart Bar", "Countdown Timer", "Team / About", "Blog Feed"
]

JSON SCHEMA (Match Exactly):
{
  "fill": {
    "ecom": {
      "brand_name": "",
      "product_type": "",
      "business_model": "",
      "target_market": "",
      "price_range": "",
      "usp": "",
      "competitors": "",
      "brand_personality": "",
      "ecommerce_platform": "",
      "tech_stack": "",
      "visual_style": "",
      "payment_integrations": [],
      "currency": "",
      "shipping_regions": "",
      "conversion_goal": "",
      "traffic_source": "",
      "funnel_type": "",
      "structure_sections": [],
      "psychology_style": "",
      "urgency_strategy": "",
      "upsell_strategy": "",
      "trust_elements": []
    }
  },
  "output": {
    "prompt": "Detailed expert prompt...",
    "json_spec": {}
  }
}

Rules:
- output.prompt must be a very detailed, expert-level system prompt for an LLM that is about to build this store.
- output.json_spec must mirror the "fill.ecom" values exactly.
- Return valid JSON only.
`;

        const userMessage = `
    Context:
    User Message: "${message}"
    Current Form State: ${JSON.stringify(form_state)}

    Task: Update the ecom form state based on the user message and generate the final blueprint prompt.
    `;

        const payload = {
            contents: [{
                parts: [{
                    text: systemPrompt + "\n\n" + userMessage
                }]
            }],
            generationConfig: {
                temperature: 0.3
            }
        };

        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", response.status, errorText);
            throw new Error(`Gemini API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            throw new Error("Empty response from Gemini");
        }

        responseText = responseText.replace(/```json\n?|```/g, "").trim();

        let parsedJson;
        try {
            parsedJson = JSON.parse(responseText);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    parsedJson = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                    throw new Error("Failed to parse JSON response from Gemini");
                }
            } else {
                throw new Error("Failed to parse JSON response from Gemini");
            }
        }

        // Pass through without strict normalization for now to allow flexibility
        // or add specific ecom normalization here if needed.

        // Sync output.json_spec if missing
        if (parsedJson.output && !parsedJson.output.json_spec && parsedJson.fill && parsedJson.fill.ecom) {
            parsedJson.output.json_spec = { ...parsedJson.fill.ecom };
        }

        res.json({
            ok: true,
            data: parsedJson
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({
            ok: false,
            error: error instanceof Error ? error.message : "Internal server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Prompt Assistant Server running on http://localhost:${PORT}`);
});
