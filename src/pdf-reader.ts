import fs from "fs";
import { PDFParse } from "pdf-parse";

async function main() {
  const pdfPath = "./assets/sample.pdf";

  const buffer = fs.readFileSync(pdfPath);

  const parser = new PDFParse({
    data: buffer,
  });

  const result = await parser.getText();

  console.log("Number of pages:", result.total);

  console.log("\nExtracted text:\n");
  console.log(result.text);

  await parser.destroy();
}

main().catch((error) => {
  console.error("PDF processing failed:", error);
});