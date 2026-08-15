import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Simple application memory
const memory = {
  name: "Raj",
  role: "Frontend Engineer",
  experience: 7,
  skills: ["React", "Next.js", "TypeScript"],
};

async function main() {
  const userQuestion = "Suggest a GenAI project for me.";

  try {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    config: {
      systemInstruction: `
        You are a career-focused GenAI assistant.
        Use the user's profile information when
        providing recommendations.
      `,
    },

    contents: `
      User profile:
      ${JSON.stringify(memory)}

      User question:
      ${userQuestion}
    `,
  });

  console.log(response.text);

} catch (error: any) {
  console.error("GenAI request failed.");

  if (error.status === 503) {
    console.log("Gemini is temporarily busy. Please try again.");
  } else {
    console.error(error);
  }
}

}

main();