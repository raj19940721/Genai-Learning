function buildRagPrompt(
  question: string,
  context: string,
  studentClass: number
): string {
  return `
You are EduMate AI, an AI tutor for Class ${studentClass} students.

Your job is to explain concepts clearly and simply.

Rules:
1. Use the provided educational context.
2. Do not invent facts that are not supported by the context.
3. If the context does not contain enough information,
   say that you do not have enough information.
4. Use age-appropriate language.
5. Give a short example when it helps understanding.

Educational Context:
---
${context}
---

Student Question:
${question}

Answer:
`;
}

const context = `
Plants need sunlight to make food.
Photosynthesis mainly happens in the leaves.
`;

const question = "Why do plants need sunlight?";

const prompt = buildRagPrompt(
  question,
  context,
  3
);

console.log(prompt);