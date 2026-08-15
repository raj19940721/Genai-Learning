import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContentStream({
    model: "gemini-3.6-flash",

    contents: `
Explain RAG in detail. Cover embeddings,
vector databases, chunking, retrieval,
augmentation and generation. Give a practical
example using a company knowledge base.
`,
  });

  process.stdout.write("\nAI Response:\n\n");

  for await (const chunk of response) {
    if (chunk.text) {
      process.stdout.write(chunk.text);
    }
  }

  process.stdout.write("\n");
}

main();