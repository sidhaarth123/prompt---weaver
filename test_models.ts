
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API key found in env");
    process.exit(1);
}

console.log(`API Key loaded: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash:", result.response.text());
    } catch (error: any) {
        console.error("Error with gemini-1.5-flash:");
        console.error(JSON.stringify(error, null, 2));
        if (error.message) console.error("Message:", error.message);
    }
}

test();
