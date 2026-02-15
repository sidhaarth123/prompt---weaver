/// <reference lib="dom" />

async function testGenerate() {
    console.log("Sending generation request to OpenAI...");
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

        if (response.status === 429) {
            console.warn("⚠️ Rate limit exceeded (429). Check your usage/billing.");
            return;
        }

        const data: any = await response.json();

        if (data.status === 'succeeded') {
            console.log("SUCCESS!");
            // Try to access model if it was part of the prompt response, otherwise just success
            const model = data.result?.jsonPrompt?.model || "default";
            console.log(`Model in response: ${model}`);
            console.log("Prompt:", data.result?.humanReadable);
        } else {
            console.log("FAILED:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Fetch failed (Server might not be running):", e);
    }
}

testGenerate();
