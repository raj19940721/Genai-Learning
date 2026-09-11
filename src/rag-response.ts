interface RagSource {
  title: string;
  topic: string;
  source: string;
}

interface RagDocument {
  content: string;
  similarity: number;
  metadata: {
    source?: string;
    subject?: string;
    class?: number;
    topic?: string;
  };
}

interface RagResponse {
  answer: string;
  grounded: boolean;
  sources: RagSource[];
}

function createRagResponse(
  answer: string,
  documents: RagDocument[],
  groundingThreshold = 0.7
): RagResponse {
  const grounded = documents.some(
    (document) =>
      document.similarity >= groundingThreshold
  );

  const sources = documents.map((document) => ({
    title: `Class ${document.metadata.class ?? ""} ${document.metadata.subject ?? ""}`.trim(),
    topic: document.metadata.topic ?? "Unknown",
    source: document.metadata.source ?? "Unknown",
  }));

  return {
    answer,
    grounded,
    sources,
  };
}

const documents: RagDocument[] = [
  {
    content: "Plants need sunlight to make food.",
    similarity: 0.91,
    metadata: {
      source: "sample.pdf",
      subject: "Science",
      class: 3,
      topic: "Plants",
    },
  },
];

const result = createRagResponse(
  "Plants need sunlight because it gives them energy to make food.",
  documents
);

console.log(
  JSON.stringify(result, null, 2)
);