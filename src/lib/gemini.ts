import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "./gemni-data.json"

const geminiKey = import.meta.env.VITE_GEMINI_KEY;

export const genAI = new GoogleGenerativeAI(geminiKey);

export async function generateT(prompt: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Generated text: ", text);
    return text
}

export async function generateFrom(data: string): Promise<string> {
    console.log("generating....");
    return await generateT(config.prompt + data);
}