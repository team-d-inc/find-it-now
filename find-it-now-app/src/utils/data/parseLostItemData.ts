import { ProfileWithOrganization } from "@/types/type";

export function parseLostItemFormData(
  dataColors?: string | null,
  dataContents?: string | null,
  dataIdentifiableFeatures?: string | null,
  profile?: ProfileWithOrganization
) {
  const colors: string[] = (dataColors ?? "")
    .split(",")
    .map((color) => color.trim());

  const contents: string[] =
    (dataContents ?? "").split(",").map((content) => content.trim()) || [];

  const identifiableFeatures: string[] =
    (dataIdentifiableFeatures ?? "")
      .split(",")
      .map((feature) => feature.trim()) || [];

  let disposalDate: Date | undefined;

  if (profile?.organization?.defaultRetentionPeriod) {
    disposalDate = new Date();
    disposalDate.setDate(
      disposalDate.getDate() + profile.organization.defaultRetentionPeriod
    );
  }

  return {
    colors,
    contents,
    identifiableFeatures,
    disposalDate, //Date or undefined
  };
}
