interface RagResult {
  content: string;
  similarity: number;
}

function hasGrounding(
  results: RagResult[],
  threshold: number = 0.7
): boolean {
  return results.some(
    (result) => result.similarity >= threshold
  );
}

const results: RagResult[] = [
  {
    content: "Plants need sunlight to make food.",
    similarity: 0.40,
  },
  {
    content: "Plants need water to grow.",
    similarity: 0.45,
  },
];

if (hasGrounding(results)) {
  console.log("✅ Sufficient context found.");
  console.log("The LLM can generate an answer.");
} else {
  console.log("⚠️ Not enough reliable context.");
  console.log("The application should avoid answering.");
}