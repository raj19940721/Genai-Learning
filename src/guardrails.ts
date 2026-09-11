function validateInput(
  input: string
): boolean {
  if (!input.trim()) {
    return false;
  }

  if (input.length > 1000) {
    return false;
  }

  return true;
}

function validateTool(
  toolName: string
): boolean {
  const allowedTools = [
    "searchKnowledge",
    "generateQuiz",
  ];

  return allowedTools.includes(toolName);
}

function validateOutput(
  output: string
): boolean {
  return output.trim().length > 0;
}

console.log(
  "Input:",
  validateInput("Why do plants need sunlight?")
);

console.log(
  "Tool:",
  validateTool("searchKnowledge")
);

console.log(
  "Tool:",
  validateTool("deleteUser")
);

console.log(
  "Output:",
  validateOutput(
    "Plants need sunlight to make food."
  )
);