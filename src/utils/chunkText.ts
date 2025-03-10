import { TEXT_COLORS } from "@/constants";

export function chunkText(text: string, maxLength: number): string[] {
  if (!maxLength || maxLength > text.length) {
    maxLength = text.length;
  }

  const chunks = [];
  let i = 0;

  while (i < text.length) {
    const chunk = text.slice(i, i + Math.floor(Math.random() * maxLength) + 1);

    chunks.push(chunk);

    i += chunk.length;
  }

  return chunks;
}

export function chunkTextWithColors(
  text: string,
  maxLength: number
): { chunk: string; color: string }[] {
  const chunks = chunkText(text, maxLength);

  const chunksWithColors = chunks.map((chunk) => ({
    chunk,
    color: TEXT_COLORS[Math.floor(Math.random() * TEXT_COLORS.length)],
  }));

  return chunksWithColors;
}
