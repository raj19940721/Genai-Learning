import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  console.log("🤖 Starting streaming...\n");

  const start = Date.now();

  const stream = await ai.models.generateContentStream({
    model: "gemini-3.6-flash",

    contents:
      "Explain photosynthesis in simple language for a Class 3 student.",
  });

  let firstChunkTime: number | null = null;
  let fullResponse = "";

  for await (const chunk of stream) {
    const text = chunk.text;

    if (!text) {
      continue;
    }

    if (firstChunkTime === null) {
      firstChunkTime = Date.now();

      console.log(
        `\n⚡ Time to first chunk: ${
          firstChunkTime - start
        } ms\n`
      );
    }

    process.stdout.write(text);

    fullResponse += text;
  }

  const totalTime = Date.now() - start;

  console.log("\n\n==============================");
  console.log("STREAM COMPLETE");
  console.log("==============================");

  console.log(
    `Total latency: ${totalTime} ms`
  );

  console.log(
    `First chunk latency: ${
      firstChunkTime
        ? firstChunkTime - start
        : "N/A"
    } ms`
  );
}

main().catch((error) => {
  console.error("❌ Streaming failed:");
  console.error(error);
});