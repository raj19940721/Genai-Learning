import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const texts = [
    "React developer with Next.js experience",
    "Frontend engineer working with React",
    "Best chicken biryani recipe",
  ];

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: texts,
  });

  response.embeddings?.forEach((embedding, index) => {
    console.log(`\nText ${index + 1}:`);
    console.log(texts[index]);

    console.log("Vector length:", embedding.values?.length);
    console.log("First 10 values:", embedding.values?.slice(0, 10));
  });
}

main();