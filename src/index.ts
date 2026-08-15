import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import readlineSync from "readline-sync";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const question = readlineSync.question("Ask me anything: ");

  const tokenInfo = await ai.models.countTokens({
    model: "gemini-3.6-flash",
    contents: question,
  });

  console.log(`\nInput tokens: ${tokenInfo.totalTokens}`);

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    config: {
      systemInstruction: `
You are a Senior GenAI Interviewer.

Explain concepts in simple language.
Give practical examples.
Provide TypeScript code when useful.
Give one relevant follow-up question.
`,
    },

    contents: question,
  });

  console.log("\nAI Response:\n");
  console.log(response.text);
}

main();
