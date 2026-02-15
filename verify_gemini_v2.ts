/// <reference lib="dom" />

async function testGenerate() {
    console.log("Sending generation request to trigger model discovery...");
    try {
        const response = await fetch('http://localhost:8787/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'image',
                userText: 'A futuristic city with neon lights',
                aspectRatio: '16:9',
                stylePreset: 'Cinematic'
            })
        });

        console.log("Response Status:", response.status);

        const data = await response.json() as any;

        if (response.status === 429) {
            console.warn("⚠️ Rate limit exceeded (429). This is expected for free tier keys.");
            console.warn("The API key is VALID and working, but you need to wait a moment.");
            return;
        }

        if (data.status === 'succeeded') {
            console.log("SUCCESS! Model used:", data.result?.jsonPrompt?.model || "unknown");
            console.log("Prompt:", data.result?.humanReadable);
        } else {
            console.log("FAILED:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testGenerate();
