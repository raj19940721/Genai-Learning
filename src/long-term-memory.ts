import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function saveMemory(
  studentId: string,
  memoryType: string,
  key: string,
  value: string
) {
  const { data, error } = await supabase
    .from("student_memory")
    .insert({
      student_id: studentId,
      memory_type: memoryType,
      memory_key: key,
      memory_value: value,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function getMemories(
  studentId: string
) {
  const { data, error } = await supabase
    .from("student_memory")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}

async function main() {
  const studentId = "student_123";

  await saveMemory(
    studentId,
    "preference",
    "favorite_subject",
    "Science"
  );

  await saveMemory(
    studentId,
    "learning",
    "current_topic",
    "Plants"
  );

  const memories = await getMemories(
    studentId
  );

  console.log("\n🧠 Student Memories:\n");

  console.log(
    JSON.stringify(memories, null, 2)
  );
}

main().catch((error) => {
  console.error(
    "❌ Memory operation failed:"
  );

  console.error(error);
});