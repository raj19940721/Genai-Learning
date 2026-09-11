import fs from "fs";
import { PDFParse } from "pdf-parse";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function chunkText(
  text: string,
  chunkSize = 500,
  overlap = 50
): string[] {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === text.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
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
  // 1. Read PDF
  const buffer = fs.readFileSync("./assets/sample.pdf");

  // 2. Extract text
  const parser = new PDFParse({
    data: buffer,
  });

  const result = await parser.getText();

  await parser.destroy();

  console.log("PDF pages:", result.total);

  // 3. Chunk text
  const chunks = chunkText(result.text);

  console.log("Total chunks:", chunks.length);

  // 4. Create embeddings and store in Supabase
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    console.log(`Processing chunk ${i + 1}/${chunks.length}`);

    const embedding = await getEmbedding(chunk);

    const { error } = await supabase
      .from("educational_documents")
      .insert({
        content: chunk,
        metadata: {
          source: "sample.pdf",
          chunkIndex: i,
          subject: "Science",
          class: 3,
          topic: "Plants",
        },
        embedding,
      });

    if (error) {
      throw error;
    }
  }

  console.log("\n✅ PDF successfully ingested into vector database!");
}

main().catch((error) => {
  console.error("\n❌ PDF ingestion failed:");
  console.error(error);
});