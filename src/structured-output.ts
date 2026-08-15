import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const resumeText = `
Name: Raj
Experience: 7 years
Skills: React, Next.js, TypeScript, JavaScript
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: `
Extract the candidate information from this resume.

Resume:
${resumeText}
`,

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,

          properties: {
            name: {
              type: Type.STRING,
            },

            experience: {
              type: Type.NUMBER,
            },

            skills: {
              type: Type.ARRAY,

              items: {
                type: Type.STRING,
              },
            },
          },

          required: ["name", "experience", "skills"],
        },
      },
    });

    if (!response.text) {
      throw new Error("AI returned an empty response");
    }

    const candidate = JSON.parse(response.text);

    console.log("Candidate:", candidate);

  } catch (error) {
    console.error("GenAI request failed:", error);
  }
}

main();