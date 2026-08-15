import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const history = [
    {
      role: "user",
      parts: [{ text: "What is RAG?" }],
    },
    {
      role: "model",
      parts: [
        {
          text: "RAG stands for Retrieval-Augmented Generation. It retrieves relevant information and provides it to an LLM to generate a grounded response.",
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: [
      ...history,

      {
        role: "user",
        parts: [
          {
            text: "What are its disadvantages?",
          },
        ],
      },
    ],
  });

  console.log(response.text);
}

main();