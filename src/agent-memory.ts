interface AgentState {
  studentName: string;
  studentClass: number;
  subject: string;
  topic: string;
  questionsAsked: number;
}

const state: AgentState = {
  studentName: "Rahul",
  studentClass: 3,
  subject: "Science",
  topic: "Plants",
  questionsAsked: 0,
};

function askQuestion() {
  state.questionsAsked++;

  console.log(
    `Question ${state.questionsAsked} about ${state.topic}`
  );
}

console.log("Student:", state.studentName);
console.log("Class:", state.studentClass);
console.log("Subject:", state.subject);
console.log("Topic:", state.topic);

askQuestion();
askQuestion();

console.log(
  "Questions asked:",
  state.questionsAsked
);