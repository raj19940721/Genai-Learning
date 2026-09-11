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

// 1. Convert text into embedding
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

// 2. Search relevant documents
async function searchDocuments(query: string) {
  const queryEmbedding = await getEmbedding(query);

  const { data, error } = await supabase.rpc(
  "match_educational_documents",
  {
    query_embedding: queryEmbedding,
    match_threshold: 0.5,
    match_count: 3,
    filter_class: 3,
    filter_subject: "Science",
  }
);

  if (error) {
    throw error;
  }

  return data ?? [];
}

// 3. Send retrieved information to LLM
async function generateAnswer(
  question: string,
  documents: any[]
) {
  const context = documents
    .map((doc) => doc.content)
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    config: {
      systemInstruction: `
        You are EduMate AI, an AI tutor for Class 1 to 5 students.

        Explain concepts using simple, age-appropriate language.

        Answer using the provided educational context.
        If the context does not contain enough information,
        clearly say that you don't have enough information.
      `,
    },

    contents: `
      Educational Context:
      ${context}

      Student Question:
      ${question}

      Explain the answer in a simple way.
    `,
  });

  return response.text;
}

async function main() {
  const question = "Why do plants need sunlight?";

  console.log("Question:");
  console.log(question);

  // Retrieve
  const documents = await searchDocuments(question);

  console.log("\nRetrieved Documents:");

  for (const document of documents) {
    console.log("-", document.content);
    console.log("Similarity:", document.similarity);
  }

  // Generate
  const answer = await generateAnswer(
    question,
    documents
  );

  console.log("\nAI Tutor Answer:");
  console.log(answer);
}

main().catch((error) => {
  console.error("❌ RAG application failed:");
  console.error(error);
});