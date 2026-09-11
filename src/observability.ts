function logInfo(
  message: string,
  data?: unknown
) {
  console.log(
    `[INFO] ${new Date().toISOString()} - ${message}`,
    data ?? ""
  );
}

function logError(
  message: string,
  error?: unknown
) {
  console.error(
    `[ERROR] ${new Date().toISOString()} - ${message}`,
    error ?? ""
  );
}

function logMetric(
  name: string,
  value: number
) {
  console.log(
    `[METRIC] ${name}: ${value}`
  );
}

logInfo("EduMate request started");

logInfo("RAG search started", {
  query: "Why do plants need sunlight?",
});

logMetric(
  "retrieved_documents",
  5
);

logMetric(
  "llm_latency_ms",
  1250
);

logInfo("EduMate request completed");

const start = Date.now();

// your Gemini call

const latency =
  Date.now() - start;

console.log(
  `LLM latency: ${latency} ms`
);