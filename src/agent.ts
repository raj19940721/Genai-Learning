import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ========================================
// TOOL 1: Search Educational Knowledge
// ========================================

function searchKnowledge(query: string): string {
  console.log("\n🔎 Searching knowledge...");

  if (query.toLowerCase().includes("plant")) {
    return `
Plants need sunlight to make food.
Plants need water to grow.
Photosynthesis mainly happens in leaves.
Plants use sunlight, water and carbon dioxide
during photosynthesis.
`;
  }

  return "No relevant educational information found.";
}

// ========================================
// TOOL 2: Generate Quiz
// ========================================

function generateQuiz(topic: string): string {
  console.log("\n📝 Generating quiz...");

  if (topic.toLowerCase().includes("plant")) {
    return `
1. Why do plants need sunlight?
2. What do plants need to grow?
3. Where does photosynthesis mainly happen?
`;
  }

  return "Quiz topic not supported.";
}

// ========================================
// Gemini Tool Definitions
// ========================================

const tools = [
  {
    functionDeclarations: [
      {
        name: "searchKnowledge",

        description:
          "Search educational knowledge for information about a topic.",

        parameters: {
          type: Type.OBJECT,

          properties: {
            query: {
              type: Type.STRING,
              description:
                "The educational topic to search for.",
            },
          },

          required: ["query"],
        },
      },

      {
        name: "generateQuiz",

        description:
          "Generate a short educational quiz about a topic.",

        parameters: {
          type: Type.OBJECT,

          properties: {
            topic: {
              type: Type.STRING,
              description:
                "The topic for the quiz.",
            },
          },

          required: ["topic"],
        },
      },
    ],
  },
];

// ========================================
// Retry Helper
// ========================================

async function generateWithRetry(
  request: any,
  retries = 3
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await ai.models.generateContent(request);
    } catch (error: any) {
      const status = error?.status;

      // Retry only temporary service errors
      if (status !== 503 || attempt === retries) {
        throw error;
      }

      const waitTime = attempt * 2000;

      console.log(
        `\n⚠️ Gemini temporarily unavailable.`
      );

      console.log(
        `Retrying in ${waitTime / 1000} seconds...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, waitTime)
      );
    }
  }

  throw new Error(
    "Gemini request failed after retries."
  );
}

// ========================================
// Main Agent
// ========================================

async function main() {
  const userMessage =
    "Find information about plants and create a quiz about plants.";

  console.log("\n👦 User:");
  console.log(userMessage);

  // ========================================
  // STEP 1: Ask Gemini
  // ========================================

  console.log("\n🤖 Asking Gemini...");

  const response = await generateWithRetry({
    model: "gemini-3.6-flash",

    contents: userMessage,

    config: {
      tools,
    },
  });

  // ========================================
  // STEP 2: Check Tool Calls
  // ========================================

  const functionCalls = response.functionCalls;

  if (
    !functionCalls ||
    functionCalls.length === 0
  ) {
    console.log("\n🤖 Gemini Answer:");
    console.log(response.text);
    return;
  }

  console.log("\n🛠️ Gemini requested tools:");

  console.log(
    JSON.stringify(functionCalls, null, 2)
  );

  // ========================================
  // STEP 3: Execute Tools
  // ========================================

  const toolResults: any[] = [];

  for (const call of functionCalls) {
    console.log(
      `\n⚙️ Executing tool: ${call.name}`
    );

    console.log("Arguments:", call.args);

    let result: string;

    try {
      if (call.name === "searchKnowledge") {
        const query = String(
          call.args?.query ?? ""
        );

        result = searchKnowledge(query);
      } else if (
        call.name === "generateQuiz"
      ) {
        const topic = String(
          call.args?.topic ?? ""
        );

        result = generateQuiz(topic);
      } else {
        result = `Unknown tool: ${call.name}`;
      }
    } catch (error) {
      result = `Tool execution failed: ${String(
        error
      )}`;
    }

    console.log("\n📦 Tool Result:");
    console.log(result);

    toolResults.push({
      functionResponse: {
        name: call.name,

        response: {
          result,
        },
      },
    });
  }

  // ========================================
  // STEP 4: Send Tool Results Back to Gemini
  // ========================================

  console.log(
    "\n🔄 Sending tool results back to Gemini..."
  );

  const finalResponse =
    await generateWithRetry({
      model: "gemini-3.6-flash",

      contents: [
        {
          role: "user",

          parts: [
            {
              text: userMessage,
            },
          ],
        },

        {
          role: "model",

          parts:
            response.candidates?.[0]?.content
              ?.parts ?? [],
        },

        {
          role: "user",

          parts: toolResults.map(
            (tool) => ({
              functionResponse:
                tool.functionResponse,
            })
          ),
        },
      ],

      config: {
        tools,
      },
    });

  // ========================================
  // STEP 5: Final Answer
  // ========================================

  console.log(
    "\n========================================"
  );

  console.log("🎯 FINAL ANSWER");

  console.log(
    "========================================\n"
  );

  console.log(finalResponse.text);
}

// ========================================
// Error Handling
// ========================================

main().catch((error: any) => {
  console.error(
    "\n❌ Agent failed:"
  );

  console.error(error);

  if (error?.status === 503) {
    console.error(
      "\n💡 Gemini is temporarily unavailable."
    );

    console.error(
      "Please wait a little and run the command again."
    );
  }
});