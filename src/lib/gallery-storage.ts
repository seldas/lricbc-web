import fs from 'fs';
import path from 'path';
import { getStoragePath } from './storage-paths';

const GALLERY_SUBPATH = 'public/gallery';
const FALLBACK_METADATA_PATH = path.join(process.cwd(), 'public', 'gallery', 'metadata.sample.json');

export function getGalleryStorageDir() {
  return getStoragePath(GALLERY_SUBPATH);
}

export function getGalleryMetadataStoragePath() {
  return path.join(getGalleryStorageDir(), 'metadata.json');
}

export function getGalleryMetadataReadPath() {
  const storagePath = getGalleryMetadataStoragePath();
  if (fs.existsSync(storagePath)) {
    return storagePath;
  }
  if (fs.existsSync(FALLBACK_METADATA_PATH)) {
    return FALLBACK_METADATA_PATH;
  }
  return storagePath;
}

export async function ensureGalleryMetadataStorage() {
  const storagePath = getGalleryMetadataStoragePath();
  if (fs.existsSync(storagePath)) {
    return;
  }

  await fs.promises.mkdir(path.dirname(storagePath), { recursive: true });

  if (fs.existsSync(FALLBACK_METADATA_PATH)) {
    await fs.promises.copyFile(FALLBACK_METADATA_PATH, storagePath);
    return;
  }

  await fs.promises.writeFile(storagePath, '[]');
}
