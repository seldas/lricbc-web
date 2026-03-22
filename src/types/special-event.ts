export interface SpecialEventScheduleItem {
  date: string;
  leader: string;
}

export interface SpecialEvent {
  id: string;
  slug: string;
  title_en: string;
  title_zh: string;
  subtitle_en?: string;
  subtitle_zh?: string;
  theme_en?: string;
  theme_zh?: string;
  dateRange: string;
  highlight: string;
  detail: string;
  published_at: string;
  is_active: boolean; // Latest/active event
  
  // Dynamic fields for specific event types (like prayer meetings)
  renewalTitle?: string;
  renewalTheme?: string;
  renewalIntro?: string;
  usPrayer?: string;
  usTiming?: string;
  cnPrayer?: string;
  cnTiming?: string;
  schedule?: SpecialEventScheduleItem[];
  zoomNote?: string;
  zoomDetail?: string;
  renewalFooter?: string;
  contentHtml?: string;
  attachments?: { label_en: string; label_zh: string; filename: string }[];
}
