interface TestCase {
  question: string;
  context: string;
  expected: string;
}

const testCases: TestCase[] = [
  {
    question:
      "Why do plants need sunlight?",

    context:
      "Plants need sunlight to make food.",

    expected:
      "Plants need sunlight to make food.",
  },

  {
    question:
      "What do plants need to grow?",

    context:
      "Plants need water and sunlight to grow.",

    expected:
      "Plants need water and sunlight to grow.",
  },
];

function evaluateAnswer(
  answer: string,
  expected: string
): boolean {
  return answer
    .toLowerCase()
    .includes(expected.toLowerCase());
}

const results = testCases.map(
  (testCase) => {
    const simulatedAnswer =
      testCase.expected;

    return {
      question: testCase.question,
      passed: evaluateAnswer(
        simulatedAnswer,
        testCase.expected
      ),
    };
  }
);

console.log(
  JSON.stringify(results, null, 2)
);