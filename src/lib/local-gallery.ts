import fs from 'fs';
import path from 'path';
import { getGooglePhotosUrls } from './google-photos';

const galleryDirectory = path.join(process.cwd(), 'public/gallery');
const metadataPath = path.join(galleryDirectory, 'metadata.json');

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
  const folderPath = path.join(galleryDirectory, folderName);
  if (!fs.existsSync(folderPath)) return [];
  
  const files = fs.readdirSync(folderPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  return files
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
    .map(img => `/gallery/${folderName}/${img}`);
}

export async function getGalleryEvents(): Promise<GalleryEvent[]> {
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
    // Find local images
    const localImages = getLocalImages(item.id);

    // Combine local and Google Photos images
    let allImages = [...localImages];
    if (item.googlePhotosUrl) {
      const googleImages = await getGooglePhotosUrls(item.googlePhotosUrl);
      allImages = [...allImages, ...googleImages];
    }

    // Pick a thumbnail
    let thumbnail = "/logo/cropped-LRICBC_Logo.png";
    if (allImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * allImages.length);
      thumbnail = allImages[randomIndex];
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

  // Combine local and Google Photos images
  let allImages = [...localImages];
  if (item.googlePhotosUrl) {
    const googleImages = await getGooglePhotosUrls(item.googlePhotosUrl);
    allImages = [...allImages, ...googleImages];
  }

  // Pick a thumbnail
  let thumbnail = "/logo/cropped-LRICBC_Logo.png";
  if (allImages.length > 0) {
    const randomIndex = Math.floor(Math.random() * allImages.length);
    thumbnail = allImages[randomIndex];
  }

  return {
    ...item,
    thumbnail,
    images: allImages
  };
}

export async function getRandomGalleryImages(count: number): Promise<string[]> {
  if (!fs.existsSync(galleryDirectory)) return [];

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


