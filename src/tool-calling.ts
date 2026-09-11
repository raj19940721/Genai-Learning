import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function calculate(
  operation: string,
  a: number,
  b: number
): number {
  switch (operation) {
    case "add":
      return a + b;

    case "subtract":
      return a - b;

    case "multiply":
      return a * b;

    case "divide":
      if (b === 0) {
        throw new Error("Cannot divide by zero");
      }

      return a / b;

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: "What is 25 multiplied by 40?",

    config: {
      tools: [
        {
          functionDeclarations: [
            {
              name: "calculate",
              description:
                "Performs basic mathematical calculations.",

              parameters: {
                type: Type.OBJECT,

                properties: {
                  operation: {
                    type: Type.STRING,
                    description:
                      "The operation: add, subtract, multiply or divide",
                  },

                  a: {
                    type: Type.NUMBER,
                    description: "First number",
                  },

                  b: {
                    type: Type.NUMBER,
                    description: "Second number",
                  },
                },

                required: ["operation", "a", "b"],
              },
            },
          ],
        },
      ],
    },
  });

const functionCalls = response.functionCalls;

if (!functionCalls || functionCalls.length === 0) {
  console.log("Gemini did not request a tool.");
  console.log(response.text);
  return;
}
console.log('Gemini response requesting tool calls:');
for (const call of functionCalls) {
  if (call.name === "calculate") {
    const args = call.args as {
      operation: string;
      a: number;
      b: number;
    };

    const result = calculate(
      args.operation,
      args.a,
      args.b
    );

    console.log("Tool:", call.name);
    console.log("Arguments:", args);
    console.log("Tool Result:", result);
  }
}

  
}

main().catch((error) => {
  console.error("❌ Tool calling failed:");
  console.error(error);
});