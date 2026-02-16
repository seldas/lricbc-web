'use server';

import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content/updates');
const ADMIN_KEY = process.env.ADMIN_POST_KEY || "lricbc2026"; // Default fallback

import { getSortedPostsData, PostData } from './local-content';

export async function createAnnouncement(formData: FormData) {
  const key = formData.get('adminKey') as string;
  
  if (key !== ADMIN_KEY) {
    return { error: "Invalid Admin Key" };
  }

  const title_zh = formData.get('title_zh') as string;
  const title_en = formData.get('title_en') as string;
  const content_zh = formData.get('content_zh') as string;
  const content_en = formData.get('content_en') as string;
  
  const date = new Date().toISOString().split('T')[0];
  const id = `${date}-announcement-${Date.now().toString().slice(-4)}`;
  
  const frontmatter = `---
publishedAt: "${date}"
category: "news"
title_en: "${title_en.replace(/"/g, '"')}"
title_zh: "${title_zh.replace(/"/g, '"')}"
subtitle_en: "Church Announcement"
subtitle_zh: "教會公告"
excerpt_en: "${content_en.slice(0, 100).replace(/"/g, '"')}..."
excerpt_zh: "${content_zh.slice(0, 100).replace(/"/g, '"')}..."
---

${content_en}

---zh---

${content_zh}
`;

  try {
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    await fs.writeFile(path.join(CONTENT_DIR, `${id}.md`), frontmatter);
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

