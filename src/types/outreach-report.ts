export interface OutreachAttachment {
  label_en: string;
  label_zh?: string;
  file: string;
}

export interface OutreachReport {
  id: string;
  slug: string;
  title_en: string;
  title_zh: string;
  summary?: string;
  summary_en?: string;
  summary_zh?: string;
  published_at: string;
  featured?: boolean;
  cover_image?: string;
  external_link?: string;
  tags?: string[];
  attachments?: OutreachAttachment[];
  contentHtml?: string;
}
