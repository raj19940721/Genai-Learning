import {
  GoogleGenAI,
} from "@google/genai";

import fs from "fs";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const imagePath =
    "images/plant.png";

  const imageBuffer =
    fs.readFileSync(imagePath);

  const base64Image =
    imageBuffer.toString("base64");

  const response =
    await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },

        {
          text: `
You are EduMate AI.

Look at this image and explain what
you see in simple language suitable
for a Class 3 student.

If the image contains a plant,
identify the visible plant parts.
          `,
        },
      ],
    });

  console.log("\n🤖 EduMate:");

  console.log(response.text);
}

main().catch((error) => {
  console.error(
    "❌ Multimodal request failed:"
  );

  console.error(error);
});