import Tesseract from "tesseract.js";

/** OCR images only. PDFs are skipped (tesseract.js is unreliable on raw PDF bytes). */
export async function runOcr(buffer: Buffer, mimeType: string): Promise<string> {
  if (!mimeType.startsWith("image/")) {
    return "";
  }

  // Keep uploads responsive — give up after 20s
  const timeoutMs = 20_000;

  try {
    const result = await Promise.race([
      Tesseract.recognize(buffer, "eng", { logger: () => {} }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("OCR timed out")), timeoutMs)
      ),
    ]);
    return result.data.text.trim();
  } catch (err) {
    console.warn("OCR skipped:", err instanceof Error ? err.message : err);
    return "";
  }
}
