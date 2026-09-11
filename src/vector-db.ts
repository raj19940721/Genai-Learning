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

async function addDocument(
  content: string,
  metadata: Record<string, unknown>
) {
  const embedding = await getEmbedding(content);

  const { data, error } = await supabase
    .from("educational_documents")
    .insert({
      content,
      metadata,
      embedding,
    })
    .select();

  if (error) {
    throw error;
  }

  return data;
}

async function main() {
  const documents = [
    {
      content: "Plants need sunlight to make food.",
      metadata: {
        class: 3,
        subject: "Science",
        topic: "Plants",
      },
    },
    {
      content: "Plants need water to grow and stay healthy.",
      metadata: {
        class: 3,
        subject: "Science",
        topic: "Plants",
      },
    },
    {
      content: "The Earth moves around the Sun.",
      metadata: {
        class: 4,
        subject: "Science",
        topic: "Earth",
      },
    },
  ];

  for (const document of documents) {
    const result = await addDocument(
      document.content,
      document.metadata
    );

    console.log("Inserted:", result);
  }
}

main().catch((error) => {
  console.error("❌ Application failed:");
  console.error(error);
});