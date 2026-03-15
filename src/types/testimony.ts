export interface TestimonyData {
  id: string;
  published_at?: string;
  title_en: string;
  title_zh: string;
  tags?: string[];
  contentHtml_en: string;
  contentHtml_zh: string;
  materials?: Array<{
    file: string;
    label_en: string;
    label_zh: string;
  }>;
  scripture?: Array<{
    verse: string;
    text_en: string;
    text_zh: string;
  }>;
  author: string;
}
