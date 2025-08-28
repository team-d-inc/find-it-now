import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase/firebase";

export async function uploadImages(
  filesOrUrls: (File | string)[]
): Promise<string[]> {
  const uploadPromises = filesOrUrls.map(async (item, idx) => {
    if (typeof item === "string" && item.includes("example.com")) {
      console.warn(`⏭ example.com URL 스킵 (${idx}):`, item);
      return item;
    }

    if (typeof item === "string" && item.startsWith("http")) {
      try {
        const res = await fetch(item);
        if (!res.ok) throw new Error(`Fetch 실패: ${res.statusText}`);
        const blob = await res.blob();
        const file = new File([blob], item.split("/").pop() || "image", {
          type: blob.type,
        });

        return await uploadFileToFirebase(file);
      } catch (err) {
        console.error(`❌ Fail to upload URL (${item}):`, err);
        return item;
      }
    }

    if (item instanceof File) {
      return await uploadFileToFirebase(item);
    }

    return "";
  });

  return (await Promise.all(uploadPromises)).filter(Boolean);
}

async function uploadFileToFirebase(file: File): Promise<string> {
  const timestamp = Date.now();
  const filename = `lost-items/${timestamp}_${file.name}`;
  const storageRef = ref(storage, filename);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}

export function generateThumbnail(imageUrls: string[]): string {
  return imageUrls.length > 0 ? imageUrls[0] : "";
}
