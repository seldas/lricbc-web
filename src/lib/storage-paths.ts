import path from 'path';
import fs from 'fs';

/**
 * Provides the base path for dynamic content.
 * In development, it defaults to the local workspace root.
 * In production (Cloud Run), it can be overridden to a mounted volume path.
 */
export function getStoragePath(subPath: string): string {
  let base = process.env.DATA_STORAGE_PATH || process.cwd();
  
  // If we are in the monorepo root and the lricbc-web directory exists, 
  // we should point to the lricbc-web folder for local development
  if (!process.env.DATA_STORAGE_PATH && fs.existsSync(path.join(base, 'lricbc-web'))) {
    base = path.join(base, 'lricbc-web');
  }

  const fullPath = path.join(base, subPath);
  
  // Ensure directory exists in development
  if (process.env.NODE_ENV !== 'production' && !fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  
  return fullPath;
}
