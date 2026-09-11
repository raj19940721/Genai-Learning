import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import wav from "wav";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const text =
    "Plants need sunlight to make food through photosynthesis.";

  console.log("🔊 Generating speech...");

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",

    contents: [
      {
        parts: [
          {
            text,
          },
        ],
      },
    ],

    config: {
      responseModalities: ["AUDIO"],

      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: "Kore",
          },
        },
      },
    },
  });

  const audioData =
    response.candidates?.[0]?.content?.parts?.[0]
      ?.inlineData?.data;

  if (!audioData) {
    throw new Error(
      "No audio data returned from Gemini."
    );
  }

  const pcmData = Buffer.from(
    audioData,
    "base64"
  );

  const outputFile = "answer.wav";

  const writer = new wav.FileWriter(
    outputFile,
    {
      channels: 1,
      sampleRate: 24000,
      bitDepth: 16,
    }
  );

  writer.write(pcmData);

  writer.end();

  console.log(
    `✅ Speech generated successfully: ${outputFile}`
  );
}

main().catch((error) => {
  console.error(
    "❌ Text-to-speech failed:"
  );

  console.error(error);
});