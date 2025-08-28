import { GoogleGenAI } from '@google/genai';
import { LostItem, LostItemReport } from '@/generated/prisma';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

type Props = {
  target: LostItemReport;
  items: LostItem[];
};

export async function fetchGeminiAnswer({ target, items }: Props) {
  const prompt = `
  You are an assistant that helps match lost items with a seeker's target item.  
  Both the seeker’s target item and the lost items are provided in the same JSON format:
  {
    id: string;
    title: string;
    colors: string[];
    brand: string;
    dateFound: string;
    specificLocation: string;
    size: string;
    material: string;
    condition: string;
    description: string;
    contents: string[];
    identifiableFeatures: string[];
  }

  Your task:
  - Compare the seeker's target item against the lost items list.
  - Determine which lost items are most similar based on fields like colors, brand, size, material, condition, description, contents, and identifiableFeatures.
  - Return the best matches as a JSON array of lost item IDs, ordered from the most similar to less similar.
  - Do not include reasoning, explanations, or any extra text.  
  - If there are no good matches, return only a valid JSON array of IDs, without any explanation, formatting, or code block. Do not wrap the output in \`\`\`json or triple backticks.

  Seeker’s target item:
  ${JSON.stringify(target)}

  Lost items data:
  ${JSON.stringify(items)}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    config: { responseMimeType: 'application/json' },
  });

  if (!response.text) {
    return [];
  }

  const ids: string[] = JSON.parse(response.text);
  console.log('Ai answers:', ids);

  return ids;
}
