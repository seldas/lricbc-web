'use server';

import fs from 'fs/promises';
import path from 'path';
import { getStoragePath } from './storage-paths';
import { revalidatePath } from 'next/cache';
import { getGalleryEvents, GalleryEvent } from './local-gallery';

function getGalleryDir() {
  return getStoragePath('public/gallery');
}

function getMetadataPath() {
  return path.join(getGalleryDir(), 'metadata.json');
}

const ADMIN_KEY = process.env.ADMIN_POST_KEY || "lricbc2026";

export async function getGalleriesAction() {
  return await getGalleryEvents();
}

interface MetadataItem {
  id: string;
  title_en: string;
  title_zh: string;
  date: string;
  category: string;
  googlePhotosUrl?: string;
}

export async function addGalleryEvent(formData: FormData) {
  const key = formData.get('adminKey') as string;
  
  if (key !== ADMIN_KEY) {
    return { error: "Invalid Admin Key" };
  }

  const id = formData.get('id') as string;
  const title_en = formData.get('title_en') as string;
  const title_zh = formData.get('title_zh') as string;
  const date = formData.get('date') as string;
  const category = formData.get('category') as string;
  const googlePhotosUrl = formData.get('googlePhotosUrl') as string;

  if (!id || !title_en || !title_zh || !date || !category) {
    return { error: "All fields except Google Photos URL are required" };
  }

  try {
    // Ensure gallery directory exists
    const galleryDir = getGalleryDir();
    const metadataPath = getMetadataPath();
    await fs.mkdir(galleryDir, { recursive: true });

    let metadata: MetadataItem[] = [];
    
    // Read existing metadata if it exists
    try {
      const fileContent = await fs.readFile(metadataPath, 'utf8');
      metadata = JSON.parse(fileContent);
    } catch (e) {
      // If file doesn't exist or is invalid, start with empty array
      metadata = [];
    }

    // Check if ID already exists
    if (metadata.some(item => item.id === id)) {
      return { error: `Gallery with ID "${id}" already exists.` };
    }

    // Add new item
    const newItem: MetadataItem = {
      id,
      title_en,
      title_zh,
      date,
      category,
      googlePhotosUrl: googlePhotosUrl || undefined
    };

    metadata.unshift(newItem); // Add to the beginning (assuming newest first)

    // Save back to file
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    // Create the folder for local images (even if empty for now)
    const eventFolder = path.join(galleryDir, id);
    await fs.mkdir(eventFolder, { recursive: true });

    // Revalidate the gallery pages
    revalidatePath('/gallery');
    revalidatePath(`/gallery/${id}`);

    return { success: true };
  } catch (e: any) {
    console.error("Error adding gallery event:", e);
    return { error: e.message || "Failed to add gallery event" };
  }
}
