import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateWithFallback(prompt: string) {
  try {
    console.log("Trying primary model...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.log("Primary model failed.");
    console.log("Trying fallback model...");

    const fallbackResponse = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return fallbackResponse.text;
  }
}

async function main() {
  try {
    const result = await generateWithFallback(
      "Explain RAG in simple words."
    );

    console.log("\nAI Response:\n");
    console.log(result);

  } catch (error) {
    console.error("All models failed:", error);
  }
}

main();