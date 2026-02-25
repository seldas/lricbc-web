'use server';

import fs from 'fs/promises';
import path from 'path';
import { getStoragePath } from './storage-paths';
import { revalidatePath } from 'next/cache';

function getContentDir() {
  return getStoragePath('content/updates');
}

function getUploadDir() {
  return getStoragePath('public/announcements');
}

const ADMIN_KEY = process.env.ADMIN_POST_KEY || "lricbc2026"; // Default fallback

import { getSortedPostsData, PostData } from './local-content';

export async function createAnnouncement(formData: FormData) {
  const key = formData.get('adminKey') as string;
  
  if (key !== ADMIN_KEY) {
    return { error: "Invalid Admin Key" };
  }

  const type = (formData.get('type') as 'text' | 'image') || 'text';
  const title_zh = formData.get('title_zh') as string;
  const title_en = formData.get('title_en') as string;
  
  const date = new Date().toISOString().split('T')[0];
  const timestamp = Date.now().toString();
  const id = `${date}-announcement-${timestamp.slice(-4)}`;
  
  let imageUrl = '';
  let content_zh = formData.get('content_zh') as string || '';
  let content_en = formData.get('content_en') as string || '';

  if (type === 'image') {
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      const ext = path.extname(imageFile.name);
      const fileName = `${id}${ext}`;
      const uploadDir = getUploadDir();
      const filePath = path.join(uploadDir, fileName);
      
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        await fs.writeFile(filePath, buffer);
        imageUrl = `/announcements/${fileName}`;
      } catch (e) {
        console.error(e);
        return { error: "Failed to upload image" };
      }
    } else {
      return { error: "Image file is required for image posts" };
    }
  }
  
  const frontmatter = `---
publishedAt: "${date}"
category: "news"
type: "${type}"
imageUrl: "${imageUrl}"
title_en: "${title_en.replace(/"/g, '\\"')}"
title_zh: "${title_zh.replace(/"/g, '\\"')}"
subtitle_en: "Church Announcement"
subtitle_zh: "教會公告"
excerpt_en: "${content_en.slice(0, 100).replace(/"/g, '\\"')}..."
excerpt_zh: "${content_zh.slice(0, 100).replace(/"/g, '\\"')}..."
---

${content_en}

---zh---

${content_zh}
`;

  try {
    const contentDir = getContentDir();
    await fs.mkdir(contentDir, { recursive: true });
    await fs.writeFile(path.join(contentDir, `${id}.md`), frontmatter);
    
    // Force revalidation of the homepage and updates list
    revalidatePath('/');
    revalidatePath('/updates');

    return { success: true, id };
  } catch (e) {
    console.error(e);
    return { error: "Failed to save post" };
  }
}

export async function getLatestAnnouncement(): Promise<PostData | null> {
  const posts = getSortedPostsData();
  const news = posts.filter(p => p.category === 'news');
  return news.length > 0 ? news[0] : (posts.length > 0 ? posts[0] : null);
}

