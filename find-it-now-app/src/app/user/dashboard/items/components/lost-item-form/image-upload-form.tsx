'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MAX_IMAGE_SIZE, MAX_IMAGES } from '@/constants/system';
import { Images, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { AIButton } from '@/components/common/ai-button';

interface ImageUploadFormProps {
  uploadedImages: File[];
  setUploadedImages: (images: File[] | ((prev: File[]) => File[])) => void;
  existingImageUrls: string[];
  setExistingImageUrls: (urls: string[] | ((prev: string[]) => string[])) => void;
  hasError?: boolean;
  onAnalyzeImages?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isAnalyzingImages?: boolean;
  disableAllActions?: boolean;
}

export const ImageUploadForm = ({
  uploadedImages,
  setUploadedImages,
  existingImageUrls,
  setExistingImageUrls,
  hasError = false,
  onAnalyzeImages,
  isAnalyzingImages = false,
  disableAllActions = false,
}: ImageUploadFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setErrorMessage('Only JPEG, JPG, and PNG files under 1MB are allowed for upload.');
      return;
    }
    setErrorMessage(null);
    if (existingImageUrls.length + uploadedImages.length + acceptedFiles.length > MAX_IMAGES) {
      return;
    }

    const validFiles = acceptedFiles.filter((file) => {
      const extension = file.name.toLowerCase().split('.').pop();
      return ['jpeg', 'jpg', 'png', 'webp', 'avif'].includes(extension || '');
    });

    const nonDuplicateFiles = validFiles.filter(
      (file) =>
        !uploadedImages.some(
          (existing) => existing.name === file.name && existing.size === file.size,
        ),
    );

    if (nonDuplicateFiles.length < validFiles.length) {
      setErrorMessage('Some files were already added.');
    }

    if (nonDuplicateFiles.length > 0) {
      setUploadedImages((prev) => [...prev, ...nonDuplicateFiles]);
    }
    // setUploadedImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (file: File) => {
    setUploadedImages((prev) => prev.filter((image) => image !== file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxSize: MAX_IMAGE_SIZE,
    disabled: existingImageUrls.length + uploadedImages.length >= MAX_IMAGES || disableAllActions,
  });

  const noImageError = hasError && existingImageUrls.length === 0 && uploadedImages.length === 0;

  return (
    <>
      {/* Image Previews */}
      <div className="space-y-3">
        <Label className={cn('text-md block font-medium', noImageError ? 'text-red-600' : '')}>
          Images
        </Label>
        {(existingImageUrls.length > 0 || uploadedImages.length > 0) && (
          <div className="mb-4 flex flex-wrap gap-3">
            {existingImageUrls.map((url, index) => (
              <div
                key={`existing-${index}`}
                className="relative h-30 w-30 overflow-hidden rounded border bg-gray-300"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={url}
                    alt={`Existing image ${index}`}
                    className="max-h-full max-w-full object-contain"
                    width={200}
                    height={200}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-stone-500/50 text-stone-300 hover:bg-stone-500/80 hover:text-stone-100"
                  onClick={() => {
                    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
                  }}
                  disabled={disableAllActions}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
            {uploadedImages.map((image, index) => (
              <div
                key={`uploaded-${index}`}
                className="relative h-30 w-30 overflow-hidden rounded border bg-gray-300"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded ${index}`}
                    className="max-h-full max-w-full object-contain"
                    width={200}
                    height={200}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-stone-500/50 text-stone-300 hover:bg-stone-500/80 hover:text-stone-100"
                  onClick={() => removeImage(image)}
                  disabled={disableAllActions}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {/* Drag-and-Drop Area */}
        <div
          {...getRootProps()}
          className={`rounded-lg border-2 border-dashed p-8 ${
            isDragActive ? 'border-gray-600' : 'border-gray-300'
          } ${existingImageUrls.length + uploadedImages.length >= MAX_IMAGES ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="flex flex-col items-center justify-center gap-6">
              <Images strokeWidth={1} className="h-12 w-12" />
              <p className="text-base text-gray-500">Drop your image here</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6">
              <Images strokeWidth={1} className="h-12 w-12" />
              <p className="text-base text-gray-500">
                {existingImageUrls.length + uploadedImages.length >= MAX_IMAGES
                  ? `Maximum ${MAX_IMAGES} images reached`
                  : 'Drop your image here, or browse for images'}
              </p>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-start justify-between text-right align-top text-base">
          <div className="text-left text-sm text-red-600">
            {errorMessage && errorMessage}
            {errorMessage && noImageError ? <br /> : ''}
            {noImageError && 'Please upload at least one image.'}
            <div className="mt-2">
              {uploadedImages.length > 0 && (
                <AIButton onClick={onAnalyzeImages} disabled={isAnalyzingImages}>
                  {isAnalyzingImages ? 'Analyzing and filling form...' : 'Auto fill form'}
                </AIButton>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span>
              {existingImageUrls.length + uploadedImages.length}/{MAX_IMAGES}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
