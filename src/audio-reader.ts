import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const audioFile = await ai.files.upload({
    file: "audio/question.mp3",
    config: {
      mimeType: "audio/mpeg",
    },
  });

  console.log("Audio uploaded:", audioFile.name);

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: [
      {
        text: `
You are EduMate AI.

Listen to this audio and understand
the student's question.

Return the question as text.
        `,
      },

      {
        fileData: {
          fileUri: audioFile.uri,
          mimeType: audioFile.mimeType,
        },
      },
    ],
  });

  console.log("\n🎤 Student said:");

  console.log(response.text);
}

main().catch((error) => {
  console.error("❌ Audio processing failed:");
  console.error(error);
});