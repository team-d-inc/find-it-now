import { z } from "zod";
import { ItemStatus, Material, Size, Condition } from "@/generated/prisma";

// Base schema for lost item
export const lostItemBaseSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().optional(),
  title: z.string().min(1, "This field is required"),
  category: z
    .string({ required_error: "This field is required" })
    .trim()
    .nonempty("This field is required"),
  date: z
    .string({ required_error: "This field is required" })
    .trim()
    .nonempty("This field is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  colors: z.string().trim().min(1, "This field is required"),
  brand: z.string().optional().nullable(),
  size: z.nativeEnum(Size, { required_error: "This field is required" }),
  material: z.nativeEnum(Material, {
    required_error: "This field is required",
  }),
  condition: z.nativeEnum(Condition, {
    required_error: "This field is required",
  }),
  identifiableFeatures: z.string().optional().nullable(),
  contents: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

// Schema for lost item report
export const lostItemReportSchema = lostItemBaseSchema.extend({ 
  firstName: z.string().min(1, "This field is required"),
  lastName: z.string().min(1, "This field is required"),
  email: z.string().email("Please enter a valid email address").min(1, "This field is required"),
  phone: z.string().min(1, "This field is required"),
  locationLost: z.string().optional().nullable(),
  location: z
    .string({ required_error: "This field is required" })
    .trim()
    .nonempty("This field is required"),
});

export type LostItemReportInput = z.infer<typeof lostItemReportSchema>;

// Schema for create & update lost item
export const lostItemSchema = lostItemBaseSchema.extend({
  id: z.string().uuid().optional(),
  status: z.nativeEnum(ItemStatus, {
    required_error: "This field is required",
  }).optional(),
  locationFound: z.string().min(1, "This field is required"),
});

export type LostItemInput = z.infer<typeof lostItemSchema>;