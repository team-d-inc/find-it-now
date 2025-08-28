"use client";

import { useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase/firebase";

export const useFirebaseStorage = () => {
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Core upload function
  const uploadFileToStorage = async (
    file: File,
    folderName: string,
    oldImagePath?: string
  ): Promise<string> => {
    const fileRef = ref(storage, `${folderName}/${file.name}`);

    try {
      if (oldImagePath) {
        await deleteImage(oldImagePath);
      }

      const snapshot = await uploadBytes(fileRef, file);

      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error(error);
      setImageError("An error occurred during upload.");
      throw error;
    }
  }

  // Upload single image to Firebase Storage and return the URL
  const uploadSingleImage = async (
    file: File,
    folderName: string,
    oldImagePath?: string
  ): Promise<string> => {
    setImageLoading(true);
    setImageError(null);

    try {
      return await uploadFileToStorage(file, folderName, oldImagePath);
    } finally {
      setImageLoading(false);
    }
  };

  // Upload multiple images to Firebase Storage and return the URL
  const uploadMultipleImages = async (
    file: File | null,
    folderName: string,
    oldImagePath?: string
  ): Promise<string> => {
    if (!file) {
      return "";
    }

    setImageLoading(true);
    setImageError(null);

    try {
      return await uploadFileToStorage(file, folderName, oldImagePath);
    } finally {
      setImageLoading(false);
    }
  };

  // Delete image from Firebase Storage
  const deleteImage = async (path: string): Promise<void> => {
    const fileRef = ref(storage, path);

    try {
      await deleteObject(fileRef);
    } catch (err) {
      console.error(`Failed to delete image at ${path}:`, err);
      throw err;
    }
  };

  return { uploadSingleImage, uploadMultipleImages, deleteImage, imageLoading, imageError };
};
