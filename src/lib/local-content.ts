import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { getStoragePath } from './storage-paths';

function getPostsDirectory() {
  return getStoragePath('content/updates');
}

export interface PostData {
  id: string;
  category: 'pastor' | 'sermon' | 'news';
  type?: 'text' | 'image';
  imageUrl?: string;
  publishedAt: string;
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  content: string;
  contentHtml_en: string;
  contentHtml_zh: string;
  [key: string]: any;
}

export function getSortedPostsData() {
  const postsDir = getPostsDirectory();
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDir);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id and default values for missing fields
    return {
      id,
      content: matterResult.content,
      category: 'news',
      publishedAt: new Date().toISOString(),
      title_en: id,
      title_zh: id,
      subtitle_en: '',
      subtitle_zh: '',
      excerpt_en: '',
      excerpt_zh: '',
      contentHtml_en: '',
      contentHtml_zh: '',
      ...matterResult.data,
    } as PostData;
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string): Promise<PostData | null> {
  const fullPath = path.join(getPostsDirectory(), `${id}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  // We expect the content to be separated by a delimiter for bilingual support or just standard markdown
  // For this first iteration, let's assume the content is English followed by Chinese or split by a convention.
  // BUT, to keep it simple and flexible as per the plan, let's assume the body contains BOTH languages 
  // and we might need a way to split them or just render the whole thing.
  //
  // However, the plan mentions: "Supporting bilingual content via separate files or sections".
  // A common pattern in single-file bilingual markdown is:
  //
  // English Content...
  //
  // ---
  //
  // 中文內容...
  //
  // Let's implement a simple splitter using a "---zh---" delimiter if present, 
  // otherwise treat the whole body as shared content.

  const content = matterResult.content;
  const splitContent = content.split('---zh---');

  let contentEn = splitContent[0];
  let contentZh = splitContent.length > 1 ? splitContent[1] : splitContent[0]; // Fallback to same content if no split

  const processedContentEn = await remark()
    .use(html)
    .process(contentEn);
  const contentHtml_en = processedContentEn.toString();

  const processedContentZh = await remark()
    .use(html)
    .process(contentZh);
  const contentHtml_zh = processedContentZh.toString();

  return {
    id,
    contentHtml_en,
    contentHtml_zh,
    content: matterResult.content,
    category: 'news',
    publishedAt: new Date().toISOString(),
    title_en: id,
    title_zh: id,
    subtitle_en: '',
    subtitle_zh: '',
    excerpt_en: '',
    excerpt_zh: '',
    ...matterResult.data,
  } as PostData;
}

export function getAdjacentPosts(currentId: string, category: string) {
  const allPosts = getSortedPostsData();
  const categoryPosts = allPosts.filter(post => post.category === category);
  
  const currentIndex = categoryPosts.findIndex(post => post.id === currentId);
  
  if (currentIndex === -1) return { prev: null, next: null };

  // Since posts are sorted by date descending (newest first):
  // "Next" (newer) is at currentIndex - 1
  // "Prev" (older) is at currentIndex + 1
  return {
    next: currentIndex > 0 ? { id: categoryPosts[currentIndex - 1].id, title_en: categoryPosts[currentIndex - 1].title_en, title_zh: categoryPosts[currentIndex - 1].title_zh } : null,
    prev: currentIndex < categoryPosts.length - 1 ? { id: categoryPosts[currentIndex + 1].id, title_en: categoryPosts[currentIndex + 1].title_en, title_zh: categoryPosts[currentIndex + 1].title_zh } : null,
  };
}

export function getNewUpdatesCount(): number {
  const posts = getSortedPostsData();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return posts.filter(post => {
    const pubDate = new Date(post.publishedAt);
    return pubDate >= oneWeekAgo;
  }).length;
}

