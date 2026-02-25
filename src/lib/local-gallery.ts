import fs from 'fs';
import path from 'path';
import { getGooglePhotosUrls } from './google-photos';
import { getStoragePath } from './storage-paths';

function getGalleryDirectory() {
  return getStoragePath('public/gallery');
}

function getMetadataPath() {
  return path.join(getGalleryDirectory(), 'metadata.json');
}

export interface GalleryEvent {
  id: string; // folder name or unique id
  title_en: string;
  title_zh: string;
  date: string;
  category: string;
  thumbnail: string; // path to one random image
  images: string[];  // paths to all images in folder
  googlePhotosUrl?: string; // Link to external album
}

interface MetadataItem {
  id: string;
  title_en: string;
  title_zh: string;
  date: string;
  category: string;
  googlePhotosUrl?: string;
}

function getLocalImages(folderName: string): string[] {
  const galleryDir = getGalleryDirectory();
  const folderPath = path.join(galleryDir, folderName);
  if (!fs.existsSync(folderPath)) return [];
  
  const files = fs.readdirSync(folderPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  return files
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
    .map(img => `/api/gallery-content/${folderName}/${img}`);
}

export async function getGalleryEvents(): Promise<GalleryEvent[]> {
  const metadataPath = getMetadataPath();
  if (!fs.existsSync(metadataPath)) {
    return [];
  }

  let metadata: MetadataItem[] = [];
  try {
    const fileContent = fs.readFileSync(metadataPath, 'utf8');
    metadata = JSON.parse(fileContent);
  } catch (e) {
    console.error("Error parsing gallery metadata", e);
    return [];
  }

  const eventPromises = metadata.map(async item => {
    // Combine local and Google Photos images
    const localImages = getLocalImages(item.id);
    let googleImages: string[] = [];
    
    if (item.googlePhotosUrl) {
      googleImages = await getGooglePhotosUrls(item.googlePhotosUrl);
    }

    const allImages = [...localImages, ...googleImages];

    // Pick a thumbnail - Prioritize Google Photos for a dynamic feel
    let thumbnail = "/logo/cropped-LRICBC_Logo.png";
    if (googleImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * googleImages.length);
      thumbnail = googleImages[randomIndex];
    } else if (localImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * localImages.length);
      thumbnail = localImages[randomIndex];
    }

    return {
      ...item,
      thumbnail,
      images: allImages
    };
  });

  const events = await Promise.all(eventPromises);

  // Sort by date descending
  return events.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getGalleryEvent(id: string): Promise<GalleryEvent | null> {
  const metadataPath = getMetadataPath();
  if (!fs.existsSync(metadataPath)) return null;

  let metadata: MetadataItem[] = [];
  try {
    const fileContent = fs.readFileSync(metadataPath, 'utf8');
    metadata = JSON.parse(fileContent);
  } catch (e) {
    return null;
  }

  const item = metadata.find(m => m.id === id);
  if (!item) return null;

  const localImages = getLocalImages(item.id);
  let googleImages: string[] = [];
  if (item.googlePhotosUrl) {
    googleImages = await getGooglePhotosUrls(item.googlePhotosUrl);
  }

  const allImages = [...localImages, ...googleImages];

  // Pick a thumbnail
  let thumbnail = "/logo/cropped-LRICBC_Logo.png";
  if (googleImages.length > 0) {
    const randomIndex = Math.floor(Math.random() * googleImages.length);
    thumbnail = googleImages[randomIndex];
  } else if (localImages.length > 0) {
    const randomIndex = Math.floor(Math.random() * localImages.length);
    thumbnail = localImages[randomIndex];
  }

  return {
    ...item,
    thumbnail,
    images: allImages
  };
}

export async function getRandomGalleryImages(count: number): Promise<string[]> {
  const galleryDir = getGalleryDirectory();
  if (!fs.existsSync(galleryDir)) return [];

  const events = await getGalleryEvents();
  let allImages: string[] = [];
  
  events.forEach(event => {
    allImages = allImages.concat(event.images);
  });

  // Shuffle and pick count
  return allImages
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}


