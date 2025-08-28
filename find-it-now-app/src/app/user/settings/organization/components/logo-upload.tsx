'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFirebaseStorage } from '@/hooks/useFirebaseStorage';
import { toast } from 'sonner';
import { MAX_IMAGE_SIZE } from '@/constants/system';
import { Building2, ImageOff, Loader, Image as ImageIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface LogoUploadFormProps {
  image: string;
  onFileSelect: (file: File | null) => void;
  isEdit?: boolean;
}

export const LogoUpload = ({ image, onFileSelect, isEdit = true }: LogoUploadFormProps) => {
  const [preview, setPreview] = useState<string>(image);
  const { imageLoading } = useFirebaseStorage();

  useEffect(() => {
    setPreview(image);
  }, [image]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      onFileSelect(null);
      event.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(`File size must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onFileSelect(file);
    event.target.value = '';
  };

  const handleLogoDelete = () => {
    setPreview("");
    onFileSelect(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">Photo</p>
      <div className="flex items-center gap-4">
        <div className="relative h-32 w-32 overflow-hidden rounded-full">
          {preview ? (
            <Image src={preview} alt="Organization Logo Image" fill className='object-contain' />
          ) : (
            <div className="bg-primary flex h-full w-full items-center justify-center rounded-full">
              <Building2 className="h-16 w-16 text-white" />
            </div>
          )}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <Loader className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </div>
        {isEdit && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="system">Edit</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
              <DropdownMenuItem role='button' disabled={imageLoading} onSelect={() => document.getElementById('logoUrl')?.click()}>
                  <ImageIcon />
                  <span>Change Logo</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled={preview === ""}
                  onClick={handleLogoDelete}
                >
                  <ImageOff />
                  <span>Delete Logo</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input
              id="logoUrl"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={imageLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};
