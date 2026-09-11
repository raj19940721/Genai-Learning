const architecture = {
  frontend: "Next.js + TypeScript",

  backend: "Next.js API",

  llm: "Gemini",

  database: "Supabase PostgreSQL",

  vectorSearch: "pgvector",

  rag: true,

  agent: true,

  tools: [
    "searchKnowledge",
    "generateQuiz",
  ],

  memory: [
    "conversation",
    "long-term",
  ],

  multimodal: true,

  voice: true,

  streaming: true,

  guardrails: true,

  evaluation: true,

  observability: true,
};

console.log(
  JSON.stringify(
    architecture,
    null,
    2
  )
);