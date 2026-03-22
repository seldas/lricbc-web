export type ScriptureReference = {
  verse: string;
  text_en: string;
  text_zh: string;
};

export interface TestimonyMaterial {
  label_en: string;
  label_zh: string;
  file: string;
}

export interface TestimonyData {
  id: string;
  title_en: string;
  title_zh: string;
  author?: string;
  published_at?: string;
  summary_en?: string;
  summary_zh?: string;
  scripture?: ScriptureReference[];
  tags?: string[];
  materials?: TestimonyMaterial[];
  contentHtml_en: string;
  contentHtml_zh: string;
}
