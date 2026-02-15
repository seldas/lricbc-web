import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/updates');

export interface PostData {
  id: string;
  category: 'pastor' | 'sermon' | 'news';
  publishedAt: string;
  title_en: string;
  title_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  contentHtml_en: string;
  contentHtml_zh: string;
  [key: string]: any;
}

export function getSortedPostsData() {
  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as Omit<PostData, 'id' | 'contentHtml_en' | 'contentHtml_zh'>),
    };
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

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  
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
    ...(matterResult.data as Omit<PostData, 'id' | 'contentHtml_en' | 'contentHtml_zh'>),
  };
}
