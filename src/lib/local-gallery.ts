import fs from 'fs';
import path from 'path';

const galleryDirectory = path.join(process.cwd(), 'public/gallery');

export interface GalleryEvent {
  id: string; // folder name
  title_en: string;
  title_zh: string;
  date: string;
  category: string;
  thumbnail: string; // path to one random image
  images: string[];  // paths to all images in folder
  googlePhotosUrl?: string; // Link to external album
}

export function getGalleryEvents(): GalleryEvent[] {
  if (!fs.existsSync(galleryDirectory)) {
    return [];
  }

  const folders = fs.readdirSync(galleryDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const events = folders.map(folderName => {
    const folderPath = path.join(galleryDirectory, folderName);
    const files = fs.readdirSync(folderPath);
    
    // Find images
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const images = files.filter(file => 
      imageExtensions.includes(path.extname(file).toLowerCase())
    );

    // Metadata fallback logic
    let metadata = {
      title_en: folderName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      title_zh: folderName,
      date: "",
      category: "other",
      googlePhotosUrl: ""
    };

    const metadataPath = path.join(folderPath, 'metadata.json');
    if (fs.existsSync(metadataPath)) {
      try {
        const fileContent = fs.readFileSync(metadataPath, 'utf8');
        const customMetadata = JSON.parse(fileContent);
        metadata = { ...metadata, ...customMetadata };
      } catch (e) {
        console.error(`Error parsing metadata for ${folderName}`, e);
      }
    }

    // Pick a thumbnail (could be first image or random)
    const thumbnail = images.length > 0 
      ? `/gallery/${folderName}/${images[0]}` 
      : "/logo/cropped-LRICBC_Logo.png";

    return {
      id: folderName,
      ...metadata,
      thumbnail,
      images: images.map(img => `/gallery/${folderName}/${img}`)
    };
  });

  // Sort by date descending
  return events.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getGalleryEvent(id: string): GalleryEvent | null {
  const folderPath = path.join(galleryDirectory, id);
  if (!fs.existsSync(folderPath) || !fs.lstatSync(folderPath).isDirectory()) {
    return null;
  }

  const files = fs.readdirSync(folderPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const images = files.filter(file => 
    imageExtensions.includes(path.extname(file).toLowerCase())
  );

  let metadata = {
    title_en: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    title_zh: id,
    date: "",
    category: "other"
  };

  const metadataPath = path.join(folderPath, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    try {
      const fileContent = fs.readFileSync(metadataPath, 'utf8');
      metadata = { ...metadata, ...JSON.parse(fileContent) };
    } catch (e) {}
  }

  const thumbnail = images.length > 0 
    ? `/gallery/${id}/${images[0]}` 
    : "/logo/cropped-LRICBC_Logo.png";

  return {
    id,
    ...metadata,
    thumbnail,
    images: images.map(img => `/gallery/${id}/${img}`)
  };
}

export function getRandomGalleryImages(count: number): string[] {
  if (!fs.existsSync(galleryDirectory)) return [];

  const folders = fs.readdirSync(galleryDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let allImages: string[] = [];
  
  folders.forEach(folder => {
    const folderPath = path.join(galleryDirectory, folder);
    const files = fs.readdirSync(folderPath);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const images = files
      .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
      .map(img => `/gallery/${folder}/${img}`);
    allImages = allImages.concat(images);
  });

  // Shuffle and pick count
  return allImages
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}


