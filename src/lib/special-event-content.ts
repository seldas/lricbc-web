import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { getStoragePath } from './storage-paths';
import { SpecialEvent } from '@/types/special-event';

function getDirectory() {
  return getStoragePath('content/special-events');
}

async function toHtml(markdown: string) {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
}

export async function getSpecialEventsData(): Promise<SpecialEvent[]> {
  const dir = getDirectory();
  if (!fs.existsSync(dir)) {
    return [];
  }

  const fileNames = fs.readdirSync(dir).filter((name) => name.endsWith('.md'));
  const events: SpecialEvent[] = await Promise.all(fileNames.map(async (fileName) => {
    const fullPath = path.join(dir, fileName);
    const id = fileName.replace(/\.md$/, '');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const contentHtml = await toHtml(content);

    return {
      id,
      slug: data.slug ?? id,
      title_en: data.title_en ?? '',
      title_zh: data.title_zh ?? '',
      subtitle_en: data.subtitle_en,
      subtitle_zh: data.subtitle_zh,
      theme_en: data.theme_en,
      theme_zh: data.theme_zh,
      dateRange: data.dateRange ?? '',
      highlight: data.highlight ?? '',
      detail: data.detail ?? '',
      published_at: data.published_at ?? '',
      is_active: data.is_active ?? false,
      renewalTitle: data.renewalTitle,
      renewalTheme: data.renewalTheme,
      renewalIntro: data.renewalIntro,
      usPrayer: data.usPrayer,
      usTiming: data.usTiming,
      cnPrayer: data.cnPrayer,
      cnTiming: data.cnTiming,
      schedule: data.schedule,
      zoomNote: data.zoomNote,
      zoomDetail: data.zoomDetail,
      renewalFooter: data.renewalFooter,
      attachments: data.attachments,
      contentHtml,
    } as SpecialEvent;
  }));

  // Sort by published_at descending
  return events.sort((a, b) => {
    const dateA = new Date(a.published_at || 0).getTime();
    const dateB = new Date(b.published_at || 0).getTime();
    return dateB - dateA;
  });
}
