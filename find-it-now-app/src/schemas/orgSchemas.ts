import { z } from "zod";

// Common fields for organization
const organizationFields = {
  logoUrl: z.string().optional(),
  name: z.string().nonempty("Please enter the institution's name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().nonempty("Please enter the institution's phone number"),
  address: z.string().nonempty("Please enter the institution's address"),
  city: z.string().nonempty("Please enter the city's name"),
  state: z.string().nonempty("Please enter the State"),
  zipCode: z.string().nonempty("Please enter the zipCode"),
  country: z.string().nonempty("Please enter the Country"),
  operatingHours: z.string().nonempty("Please enter the operating hours"),
  defaultRetentionPeriod: z.coerce
    .number()
    .min(1, "Please enter the lost item retention period (days)"),
  verificationMethod: z.string().nonempty("Please enter the verification method"),
  verificationMethodDescription: z.string().optional(),
};

// Organization only schema (no user information)
export const organizationSchema = z.object(organizationFields);

export type OrganizationFormInputs = z.infer<typeof organizationSchema>;

// Organization and user schema
export const organizationWithUserSchema = z.object({
  organization: z.object(organizationFields),
  user: z.object({
    firstname: z.string().nonempty("Please enter your first name"),
    lastname: z.string().nonempty("Please enter your last name"),
    email: z.string().email("Please enter a valid email address"),
  }),
});

export type OrganizationWithUserFormInputs = z.infer<typeof organizationWithUserSchema>;
