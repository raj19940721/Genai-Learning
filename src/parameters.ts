import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const prompt = `Give me 5 names for a new biryani restaurant.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    config: {
      temperature: 0.2,
    },

    contents: prompt,
  });

  console.log(response.text);
}

main();