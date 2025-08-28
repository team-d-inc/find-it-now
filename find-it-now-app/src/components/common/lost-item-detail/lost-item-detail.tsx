'use client';

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Edit, PackageX } from "lucide-react";
import { ImageGallery } from "./image-gallery";
import { PATHS } from "@/constants/paths";
import { LabeledValue } from "@/components/ui/labeled-value";
import useSWR from "swr";
import { LostItemDetailSkeleton } from "./lost-item-detail-skeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function LostItemDetail() {
  const router = useRouter();
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(`/api/protected/lost-items/${id}`, fetcher);

  if (isLoading) return <LostItemDetailSkeleton />;

  if (error || !data)
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-8">
        <PackageX className="w-20 h-20" strokeWidth={1} />
        <p>Failed to load item details</p>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ImageGallery imageUrls={data.imageUrls} title={data.title} />

        <div className="space-y-8 rounded bg-gray-50 p-8 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-1 text-4xl font-bold text-gray-900">{data.title}</h1>
            </div>
            {data.profile?.organizationId === data.organization?.id && data.user && (
              <Button
                variant="system"
                className="flex min-w-32 items-center gap-2"
                onClick={() => {
                  router.push(PATHS.lostItemEdit({ itemId: data.id }));
                }}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="text-gray-700">{data.description || '-'}</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">Key features</h2>
              <div className="grid grid-cols-1 gap-8 rounded border bg-white p-4 sm:grid-cols-2">
                <LabeledValue label="category" value={data.category?.name || '-'} />
                <LabeledValue label="brand" value={data.brand || '-'} />
                {data.colors?.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-primary text-xs font-semibold tracking-wider uppercase">
                      Colors
                    </label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {data.colors.map((color: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <LabeledValue label="size" value={data.size || '-'} />
                <LabeledValue label="material" value={data.material || '-'} />
                <LabeledValue label="condition" value={data.condition || '-'} />
                <div className="space-y-2">
                  <label className="text-primary text-xs font-semibold tracking-wider uppercase">
                    Contents
                  </label>
                  {data.contents && data.contents[0] !== '' ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {data.contents.map((content: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {content}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div>-</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-primary text-xs font-semibold tracking-wider uppercase">
                    Identifiable features
                  </label>
                  <p className="mt-1 text-gray-700">
                    {data.identifiableFeatures.length < 1 || !data.identifiableFeatures
                      ? data.identifiableFeatures.length
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <LabeledValue label="found location" value={data.specificLocation} />
            <LabeledValue label="found date" value={formatDate(data.dateFound)} />
            {data.user ? (
              <>
                <LabeledValue label="status" value={data.status} />
                <LabeledValue label="disposal date" value={formatDate(data.disposalDate)} />
                <LabeledValue
                  label="registered by"
                  value={`${data.profile.firstName} ${data.profile.lastName}`}
                />
              </>
            ) : (
              <>
                <LabeledValue label="organization" value={data.organization.name} />
                <LabeledValue
                  label="address"
                  value={`${data.organization.address}, ${data.organization.city}, ${data.organization.country}`}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
