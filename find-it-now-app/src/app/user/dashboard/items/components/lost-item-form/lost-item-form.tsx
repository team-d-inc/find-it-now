'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Size, Condition, Material, ItemStatus, LostItem, Category } from '@/generated/prisma';
import { toast } from 'sonner';
import { ImageUploadForm } from './image-upload-form';
import { createLostItem } from '../../new/action';
import { updateLostItem } from '../../[id]/edit/action';
import { FormFieldBase } from '@/components/common/form-common/form-field-base';
import { SelectForm } from '@/components/common/form-common/select-form';
import { useFirebaseStorage } from '@/hooks/useFirebaseStorage';
import { lostItemSchema, LostItemInput } from '@/schemas/lostItemSchemas';
import { formatDateISO } from '@/lib/utils';
import useSWRMutation from 'swr/mutation';
import { ImageAnalyzeResponse } from '@/types/imageAnalyze';
import { LocationDateFormFillSkeleton } from './image-form-fill-skeleton/location-date-form-fill-skeleton';
import { CharacteristicsFormFillSkeleton } from './image-form-fill-skeleton/characteristics-form-fill-skeleton';
import { TitleFormFillSkeleton } from './image-form-fill-skeleton/title-form-fill-skeleton';
import { useBack } from '@/hooks/useBack';
import { PATHS } from '@/constants/paths';
import { Loader2 } from 'lucide-react';

type Props = {
  categories: Category[];
  initialData?: LostItem;
};

async function sendImageAnalyzeRequest(url: string, { arg }: { arg: FormData }) {
  return await fetch(url, {
    method: 'POST',
    body: arg,
  });
}

const cleanNullStringValues = (str: string | null = null) => {
  return (str || '').replace(/\b(null|Null|undefined)\b/g, '').trim();
};

export const LostItemForm = ({ categories, initialData }: Props) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<boolean>(false);
  const { uploadMultipleImages, imageLoading } = useFirebaseStorage();
  const { trigger: analyzeImages, isMutating: isAnalyzingImages } = useSWRMutation(
    '/api/analyze',
    sendImageAnalyzeRequest,
  );
  const isEdit = !!initialData;

  const goBack = useBack(PATHS.lostItems());

  useEffect(() => {
    if (initialData?.imageUrls) {
      setExistingImageUrls(initialData.imageUrls);
    }
  }, [initialData]);

  const form = useForm<LostItemInput>({
    resolver: zodResolver(lostItemSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: initialData?.title || '',
      locationFound: initialData?.specificLocation || '',
      category: initialData?.categoryId || '',
      date: initialData?.dateFound ? formatDateISO(new Date(initialData.dateFound)) : '',
      colors: initialData?.colors.join(', ') || '',
      brand: initialData?.brand || '',
      size: initialData?.size as Size,
      material: initialData?.material as Material,
      identifiableFeatures: initialData?.identifiableFeatures.join(', ') || '',
      contents: initialData?.contents.join(', ') || '',
      condition: (initialData?.condition as Condition) ?? Condition.GOOD,
      description: initialData?.description || '',
      status: initialData?.status as ItemStatus,
    },
  });

  const handleAnalyzeImages = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    try {
      uploadedImages.forEach((file) => {
        formData.append('files', file);
      });
      const result = await analyzeImages(formData);
      const response = (await result.json()) as ImageAnalyzeResponse;

      if (response.ok) {
        form.setValue('title', cleanNullStringValues(response.data.title));
        form.setValue('description', cleanNullStringValues(response.data.description));
        form.setValue(
          'category',
          response.data.category
            ? categories.find(
                (cat) => cat.name.toLowerCase() === response.data.category.toLowerCase(),
              )?.id || ''
            : '',
        );
        form.setValue('colors', cleanNullStringValues(response.data.colors));
        form.setValue('brand', cleanNullStringValues(response.data.brand));
        form.setValue('size', (response.data?.size as Size) ?? 'FREE');
        form.setValue('material', (response.data?.material as Material) ?? 'OTHER');
        form.setValue('condition', (response.data?.condition as Condition) ?? 'GOOD');
        form.setValue(
          'identifiableFeatures',
          cleanNullStringValues(response.data.identifiable_features),
        );
        form.setValue('contents', cleanNullStringValues(response.data.contents));
        form.setValue('locationFound', cleanNullStringValues(response.data.type));
        form.setValue('date', formatDateISO(new Date()));
        form.setValue('status', 'STORED');
        toast.success('Image analysis completed and form updated.');
      }
      if (!response.ok) {
        toast.error('Sorry, something went wrong with image analysis. Please try again.');
      }
    } catch (err) {
      console.error('🔴 Image analysis error:', err);
      toast.error('Sorry, something went wrong with image analysis. Please try again.');
    }
  };

  const onSubmit = async (data: LostItemInput) => {
    if (existingImageUrls.length === 0 && uploadedImages.length === 0) {
      setImageError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsPending(true);

    try {
      const uploadPromises = uploadedImages.map(async (file) => {
        return await uploadMultipleImages(file, 'lost-items');
      });
      const uploadedImageUrls: string[] = await Promise.all(uploadPromises);

      const allImageUrls = [...existingImageUrls, ...uploadedImageUrls];

      if (isEdit) {
        // Update lost item
        const result = await updateLostItem(initialData.id, data, allImageUrls);
        if (result.success) {
          setUploadedImages([]);
          setExistingImageUrls(allImageUrls);
          toast.success('Updated successfully');
          goBack();
        } else {
          toast.error('Sorry, something went wrong. Please try again.');
        }
      } else {
        // Create new lost item
        const result = await createLostItem(data, allImageUrls);
        if (result.success) {
          form.reset();
          setUploadedImages([]);
          setExistingImageUrls([]);
          toast.success('Created successfully');
          goBack();
        } else {
          toast.error('Sorry, something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('🔴 Form submission error:', error);
      toast.error('Sorry, something went wrong. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="p-7 pt-3">
        <Card className="w-full p-10">
          <CardContent className="flex w-full flex-col p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-10">
                {/* Status */}
                {isEdit && (
                  <div className="lg:flex lg:align-top">
                    <h3 className="text-primary mb-6 text-base font-semibold md:w-[250px]">
                      Item Status
                    </h3>
                    <div className="flex grow flex-col gap-4">
                      <SelectForm
                        control={form.control}
                        name="status"
                        label="Status"
                        enumOptions={ItemStatus}
                        placeholder="Select status"
                        disabled={isPending || isAnalyzingImages}
                      />
                    </div>
                  </div>
                )}

                {/* Lost Item Details */}
                <div className="w-full">
                  <div className="lg:flex lg:align-top">
                    <h3 className="text-primary mb-6 text-base font-semibold md:w-[250px]">{''}</h3>
                    <div className="grid grow grid-cols-1 gap-4">
                      {/* Lost Item Images */}
                      <ImageUploadForm
                        uploadedImages={uploadedImages}
                        setUploadedImages={setUploadedImages}
                        existingImageUrls={existingImageUrls}
                        setExistingImageUrls={setExistingImageUrls}
                        hasError={imageError}
                        onAnalyzeImages={handleAnalyzeImages}
                        isAnalyzingImages={isAnalyzingImages}
                        disableAllActions={isAnalyzingImages}
                      />
                      <div className="flex-1">
                        {isAnalyzingImages ? (
                          <TitleFormFillSkeleton />
                        ) : (
                          <FormFieldBase
                            control={form.control}
                            name="title"
                            label="Title"
                            placeholder="e.g., iPhone, wallet, keys"
                            disabled={isPending || isAnalyzingImages}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-12 lg:flex lg:align-top">
                    <h3 className="text-primary mb-6 text-base font-semibold md:w-[250px]">
                      Location and Date Found
                    </h3>
                    <div className="flex grow flex-col gap-4">
                      {isAnalyzingImages ? (
                        <LocationDateFormFillSkeleton />
                      ) : (
                        <>
                          <FormFieldBase
                            control={form.control}
                            name="locationFound"
                            label="Location"
                            placeholder="e.g., washroom, entrance, waiting area"
                            disabled={isPending || isAnalyzingImages}
                          />
                          <FormFieldBase
                            control={form.control}
                            name="date"
                            label="Date"
                            type="date"
                            itemClassName="flex-1"
                            disabled={isPending || isAnalyzingImages}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="pt-12 lg:flex lg:align-top">
                    <h3 className="text-primary mb-6 text-base font-semibold md:w-[250px]">
                      Item Characteristics
                    </h3>
                    <div className="grid grow grid-cols-1 gap-4">
                      {isAnalyzingImages ? (
                        <CharacteristicsFormFillSkeleton />
                      ) : (
                        <>
                          <SelectForm
                            control={form.control}
                            name="category"
                            label="Category"
                            objectArray={categories}
                            placeholder="Select category"
                            disabled={isPending || isAnalyzingImages}
                          />
                          <FormFieldBase
                            control={form.control}
                            name="colors"
                            label="Colors"
                            description="Please enter multiple colors separated by commas"
                            placeholder="e.g., red, blue, black"
                            disabled={isPending || isAnalyzingImages}
                          />
                          <FormFieldBase
                            control={form.control}
                            name="brand"
                            label="Brand"
                            placeholder="e.g., Nike, Apple, Samsung"
                            disabled={isPending || isAnalyzingImages}
                          />
                          <SelectForm
                            control={form.control}
                            name="material"
                            label="Material"
                            enumOptions={Material}
                            placeholder="Select material"
                            disabled={isPending || isAnalyzingImages}
                          />
                          <SelectForm
                            control={form.control}
                            name="size"
                            label="Size"
                            enumOptions={Size}
                            placeholder="Select size"
                            disabled={isPending || isAnalyzingImages}
                          />
                          <SelectForm
                            control={form.control}
                            name="condition"
                            label="Condition"
                            enumOptions={Condition}
                            placeholder="Select condition"
                            disabled={isPending || isAnalyzingImages}
                          />
                          <FormFieldBase
                            control={form.control}
                            name="contents"
                            label="Contents"
                            description="Please enter multiple contents separated by commas"
                            asTextarea
                            rows={3}
                            placeholder="e.g., wallet, keys, phone"
                            disabled={isPending || isAnalyzingImages}
                          />
                          <FormFieldBase
                            control={form.control}
                            name="identifiableFeatures"
                            label="Identifiable Features"
                            description="Please enter multiple features separated by commas"
                            asTextarea
                            rows={3}
                            placeholder="e.g., scratches, stickers, engravings"
                            disabled={isPending || isAnalyzingImages}
                          />
                          <FormFieldBase
                            control={form.control}
                            name="description"
                            label="Description"
                            description="Please enter a description of the item"
                            asTextarea
                            rows={3}
                            placeholder="Describe the item in detail"
                            disabled={isPending || isAnalyzingImages}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        {/* Form buttons */}
        <div className="mt-10 flex justify-end gap-4 px-7">
          <Button variant="systemGhost" onClick={goBack} className="w-32 cursor-pointer">
            Cancel
          </Button>
          <Button
            type="button"
            className="w-32 cursor-pointer"
            disabled={isPending || isAnalyzingImages}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {isPending || imageLoading ? (
              <>
                <Loader2 className="animate-spin" /> Save
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};
