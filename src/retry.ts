import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: any) {
  return (
    error?.status === 429 ||
    error?.status === 500 ||
    error?.status === 503
  );
}

async function generateWithRetry(
  prompt: string,
  maxRetries = 3
) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      return response.text;

    } catch (error: any) {
      console.log(`Attempt ${attempt + 1} failed.`);

      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, attempt);

      console.log(`Retrying in ${delay} ms...`);

      await sleep(delay);
    }
  }
}

async function main() {
  try {
    const result = await generateWithRetry(
      "Explain RAG in simple words."
    );

    console.log("\nAI Response:\n");
    console.log(result);

  } catch (error: any) {
    console.error("\nFinal request failed:", error);
  }
}

main();