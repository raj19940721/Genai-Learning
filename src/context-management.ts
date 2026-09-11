interface Document {
  content: string;
  similarity: number;
}

function selectRelevantContext(
  documents: Document[],
  maxDocuments: number = 3
): string {
  const selected = documents
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxDocuments);

  return selected
    .map((doc) => doc.content)
    .join("\n\n");
}

const documents: Document[] = [
  {
    content: "Plants need sunlight to make food.",
    similarity: 0.91,
  },
  {
    content: "Plants need water to grow.",
    similarity: 0.82,
  },
  {
    content: "Roots absorb water from soil.",
    similarity: 0.65,
  },
  {
    content: "Some plants have colorful flowers.",
    similarity: 0.41,
  },
];

const context = selectRelevantContext(
  documents,
  2
);

console.log("Selected Context:\n");
console.log(context);