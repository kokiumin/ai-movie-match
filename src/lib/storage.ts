import { supabase } from "./supabase";

/**
 * Upload an avatar image to Supabase Storage.
 * Returns the public URL on success, null on error.
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error("Avatar upload failed:", error);
    return null;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload a portfolio thumbnail to Supabase Storage.
 */
export async function uploadPortfolioThumbnail(
  creatorId: string,
  itemId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${creatorId}/${itemId}/thumb.${ext}`;

  const { error } = await supabase.storage
    .from("portfolio")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error("Portfolio thumbnail upload failed:", error);
    return null;
  }

  const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload a portfolio video to Supabase Storage.
 */
export async function uploadPortfolioVideo(
  creatorId: string,
  itemId: string,
  file: File
): Promise<string | null> {
  const ext = file.name.split(".").pop() || "mp4";
  const path = `${creatorId}/${itemId}/video.${ext}`;

  const { error } = await supabase.storage
    .from("portfolio")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    console.error("Portfolio video upload failed:", error);
    return null;
  }

  const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete a file from a storage bucket.
 */
export async function deleteStorageFile(
  bucket: "avatars" | "portfolio",
  path: string
): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error("File deletion failed:", error);
    return false;
  }
  return true;
}
