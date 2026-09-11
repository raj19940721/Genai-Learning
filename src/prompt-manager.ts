import fs from "fs";
import path from "path";

function loadPrompt(
  promptName: string
): string {
  const promptPath = path.join(
    process.cwd(),
    "prompts",
    promptName
  );

  return fs.readFileSync(
    promptPath,
    "utf-8"
  );
}

function buildPrompt(
  template: string,
  context: string,
  question: string
): string {
  return template
    .replace("{{context}}", context)
    .replace("{{question}}", question);
}

const template = loadPrompt(
  "rag-v2.txt"
);

const prompt = buildPrompt(
  template,
  "Plants need sunlight to make food.",
  "Why do plants need sunlight?"
);

console.log(prompt);