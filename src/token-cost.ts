function estimateTokens(
  text: string
): number {
  // Rough estimation:
  // approximately 1 token for every 4 characters

  return Math.ceil(
    text.length / 4
  );
}

const systemPrompt = `
You are EduMate AI.
Explain concepts using simple language.
`;

const context = `
Plants need sunlight to make food.
Plants need water to grow.
Photosynthesis mainly happens in leaves.
`;

const question =
  "Why do plants need sunlight?";

const totalInput =
  systemPrompt +
  context +
  question;

const estimatedTokens =
  estimateTokens(totalInput);

console.log(
  "Estimated input tokens:",
  estimatedTokens
);

const largeContext =
  "Plants need sunlight to make food. ".repeat(100);

const optimizedContext =
  "Plants need sunlight to make food.";

console.log(
  "Large context:",
  estimateTokens(largeContext)
);

console.log(
  "Optimized context:",
  estimateTokens(optimizedContext)
);