import { LostItem, LostItemReport } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
import { GoogleGenAI } from '@google/genai';
import { MatchingResult } from '@/types/type';

// Convert distance to user-friendly similarity percentage
const getSimilarityPercentage = (distance: number): number => {
  return Math.round((1 - distance) * 100);
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const prismaWithAccelerate = prisma.$extends(withAccelerate());

async function generateEmbedding(text: string) {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: [text],
  });
  return response.embeddings?.[0]?.values;
}

export async function saveLostItemEmbedding(item: LostItem) {
  const text = [
    item.title,
    item.description ?? '',
    item.brand ?? '',
    item.colors.join(', '),
    item.identifiableFeatures.join(', '),
    item.contents?.join(', ') ?? '',
    `${item.size} ${item.material} ${item.condition}`,
  ].join(' ');

  const embedding = await generateEmbedding(text);

  await prismaWithAccelerate.$queryRaw`
    UPDATE lost_items
    SET embedding = ${embedding}::vector
    WHERE id = ${item.id}
  `;
}

export async function saveLostItemReportEmbedding(report: LostItemReport) {
  const text = [
    report.title,
    report.description ?? '',
    report.brand ?? '',
    report.colors.join(', '),
    report.identifiableFeatures.join(', '),
    report.contents?.join(', ') ?? '',
    `${report.size} ${report.material} ${report.condition}`,
  ].join(' ');

  const embedding = await generateEmbedding(text);

  await prismaWithAccelerate.$queryRaw`
    UPDATE lost_item_reports
    SET embedding = ${embedding}::vector
    WHERE id = ${report.id}
  `;
}

export async function findSimilarLostItems(
  reportId: string,
): Promise<MatchingResult[]> {
  if (!reportId) return [];

  const rawMatches = await prismaWithAccelerate.$queryRaw`
    SELECT li.id,
           li.title,
           li.brand,
           c.name as "categoryName",
           li."thumbnailUrl",
           li."specificLocation",
           li."dateFound",
           (li.embedding <-> lir.embedding) AS distance
    FROM lost_items li
    JOIN categories c ON li."categoryId" = c.id
    JOIN lost_item_reports lir ON lir.id = ${reportId}::text
    WHERE li."organizationId" = lir."organizationId"
        AND li."categoryId" = lir."categoryId"
        AND li.status = 'STORED'
    ORDER BY distance ASC
    LIMIT 5;
    `;

  // Transform raw results to include similarity information
  const matches: MatchingResult[] = (rawMatches as Array<{
    id: string;
    title: string;
    brand: string;
    categoryName: string;
    thumbnailUrl: string;
    specificLocation: string;
    dateFound: Date;
    distance: number;
  }>).map(match => ({
    ...match,
    similarityPercentage: getSimilarityPercentage(match.distance),
  }));

  console.log('matches', matches);

  return matches;
}
