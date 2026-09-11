function chunkText(
  text: string,
  chunkSize: number = 100,
  overlap: number = 20
): string[] {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(
      start + chunkSize,
      text.length
    );

    chunks.push(text.slice(start, end));

    if (end === text.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}

const text = `
Plants need sunlight to make food.
They use a process called photosynthesis.
During photosynthesis, plants use sunlight,
water and carbon dioxide.
The process mainly happens in the leaves.
`;

const chunks = chunkText(text, 100, 20);

chunks.forEach((chunk, index) => {
  console.log(`\n--- Chunk ${index + 1} ---`);
  console.log(chunk);
});