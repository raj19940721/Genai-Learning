import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import fs from "fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const imagePath = "./assets/job-description.jpeg";

  const imageData = fs.readFileSync(imagePath);

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData.toString("base64"),
        },
      },

      {
        text: `
Analyze this job description image.

Extract:
1. Job title
2. Required technical skills
3. Experience required
4. Important responsibilities

Return the result in simple language.
`,
      },
    ],
  });

  console.log(response.text);
}

main();