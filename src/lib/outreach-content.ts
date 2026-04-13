import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { getStoragePath } from './storage-paths';
import { OutreachReport } from '@/types/outreach-report';

function getDirectory() {
  return getStoragePath('content/outreach');
}

async function toHtml(markdown: string) {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

function guessSummary(data: Record<string, any>, content: string) {
  const summaryCandidate = data.summary || data.summary_en || data.summary_zh;
  if (summaryCandidate) {
    return summaryCandidate;
  }

  const firstLine = content.split('\n').find((line) => line.trim().length > 0);
  if (firstLine) {
    return firstLine.trim().slice(0, 220);
  }

  return '';
}

async function loadOutreachReport(fileName: string): Promise<OutreachReport> {
  const dir = getDirectory();
  const fullPath = path.join(dir, fileName);
  const id = fileName.replace(/\.md$/, '');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const contentHtml = await toHtml(content);
  const summary = guessSummary(data, content);

  return {
    id,
    slug: data.slug ?? id,
    title_en: data.title_en ?? data.title ?? '',
    title_zh: data.title_zh ?? data.title ?? '',
    summary,
    summary_en: data.summary_en,
    summary_zh: data.summary_zh,
    published_at: data.published_at ?? '',
    featured: Boolean(data.featured),
    cover_image: data.cover_image,
    external_link: data.external_link,
    tags: data.tags,
    attachments: data.attachments,
    contentHtml,
  } as OutreachReport;
}

export async function getOutreachReports(): Promise<OutreachReport[]> {
  const dir = getDirectory();
  if (!fs.existsSync(dir)) {
    return [];
  }

  const fileNames = fs.readdirSync(dir).filter((name) => name.endsWith('.md'));
  if (fileNames.length === 0) {
    return [];
  }

  const reports = await Promise.all(fileNames.map(loadOutreachReport));

  return reports.sort((a, b) => {
    const dateA = new Date(a.published_at || 0).getTime();
    const dateB = new Date(b.published_at || 0).getTime();
    return dateB - dateA;
  });
}
