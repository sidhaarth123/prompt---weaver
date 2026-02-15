import fetch from 'node-fetch';

async function testGenerate() {
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

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

testGenerate();
