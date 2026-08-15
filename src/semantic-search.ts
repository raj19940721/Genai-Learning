import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function cosineSimilarity(
  vectorA: number[],
  vectorB: number[]
): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same dimensions");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];

    magnitudeA += vectorA[i] * vectorA[i];

    magnitudeB += vectorB[i] * vectorB[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    throw new Error("Cannot compare zero vectors");
  }

  return (
    dotProduct /
    (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
  );
}

async function getEmbedding(text: string) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
  });

  const vector = response.embeddings?.[0]?.values;

  if (!vector) {
    throw new Error("Embedding was not returned");
  }

  return vector;
}

async function main() {
  const query = "React developer with Next.js experience";

  const documents = [
    "Senior Frontend Engineer using React and Next.js",
    "Frontend developer working with TypeScript and React",
    "Python Data Engineer using Spark and Airflow",
  ];

  const queryVector = await getEmbedding(query);

  for (const document of documents) {
    const documentVector = await getEmbedding(document);

    const similarity = cosineSimilarity(
      queryVector,
      documentVector
    );

    console.log("\nDocument:", document);
    console.log("Similarity:", similarity);
  }
}

main();