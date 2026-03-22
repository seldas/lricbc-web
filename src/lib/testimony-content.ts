import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { getStoragePath } from './storage-paths';
import { TestimonyData, ScriptureReference, TestimonyMaterial } from '@/types/testimony';

type FrontMatterScripture = {
  verse?: string;
  text_en?: string;
  text_zh?: string;
};

type FrontMatterMaterial = {
  label_en?: string;
  label_zh?: string;
  file?: string;
};

function getDirectory() {
  return getStoragePath('content/testimonies');
}

function splitBilingualContent(raw: string) {
  const [en, zh] = raw.split('---zh---');
  return [en.trim(), (zh ?? en).trim()];
}

async function toHtml(markdown: string) {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

async function parseFile(fileName: string): Promise<TestimonyData> {
  const dir = getDirectory();
  const fullPath = path.join(dir, fileName);
  const id = fileName.replace(/\.md$/, '');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const [contentEn, contentZh] = splitBilingualContent(matterResult.content);
  const [contentHtml_en, contentHtml_zh] = await Promise.all([
    toHtml(contentEn),
    toHtml(contentZh),
  ]);

  const rawScripture = Array.isArray(matterResult.data.scripture)
    ? (matterResult.data.scripture as FrontMatterScripture[])
    : [];
  const scripture: ScriptureReference[] = rawScripture.map((item) => ({
    verse: item.verse ?? '',
    text_en: item.text_en ?? '',
    text_zh: item.text_zh ?? '',
  }));

  const rawMaterials = Array.isArray(matterResult.data.materials)
    ? (matterResult.data.materials as FrontMatterMaterial[])
    : [];
  const materials: TestimonyMaterial[] = rawMaterials.map((item) => ({
    label_en: item.label_en ?? '',
    label_zh: item.label_zh ?? '',
    file: item.file ?? '',
  }));

  return {
    id,
    title_en: matterResult.data.title_en ?? id,
    title_zh: matterResult.data.title_zh ?? id,
    author: matterResult.data.author ?? 'LRICBC',
    published_at: matterResult.data.published_at ?? '',
    summary_en: matterResult.data.summary_en ?? '',
    summary_zh: matterResult.data.summary_zh ?? '',
    scripture,
    tags: Array.isArray(matterResult.data.tags) ? matterResult.data.tags : [],
    materials,
    contentHtml_en,
    contentHtml_zh,
  };
}

export async function getTestimoniesData(): Promise<TestimonyData[]> {
  const dir = getDirectory();
  if (!fs.existsSync(dir)) {
    return [];
  }

  const fileNames = fs.readdirSync(dir).filter((name) => name.endsWith('.md'));
  const testimonies = await Promise.all(fileNames.map((name) => parseFile(name)));

  return testimonies.sort((a, b) => {
    const dateA = new Date(a.published_at || 0).getTime();
    const dateB = new Date(b.published_at || 0).getTime();
    return dateB - dateA;
  });
}
