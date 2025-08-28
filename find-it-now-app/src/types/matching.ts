import { Condition, Material, Size } from "@/generated/prisma";

export type LostItemForMatching = {
  id: string;
  title: string;
  colors: string[];
  brand: string;
  dateFound: string;
  specificLocation: string;
  size: Size;
  material: Material;
  condition: Condition;
  description: string;
  contents: string[];
  identifiableFeatures: string[];
}
