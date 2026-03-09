'use client';

import { useTranslation } from "react-i18next";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronLeft, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReadingSettings from "@/components/ReadingSettings";
import { PostData } from "@/lib/local-content";

const DEFAULT_FONT_SIZE = 'prose-lg';
const DEFAULT_THEME = 'light';

function getStoredFontSize(): string {
  if (typeof window === 'undefined') return DEFAULT_FONT_SIZE;
  return localStorage.getItem('reading-font-size') ?? DEFAULT_FONT_SIZE;
}

function getStoredTheme(): string {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  return localStorage.getItem('reading-theme') ?? DEFAULT_THEME;
}

interface UpdateDetailContentProps {
  post: PostData;
  adjacent?: {
    prev: { id: string; title_en: string; title_zh: string } | null;
    next: { id: string; title_en: string; title_zh: string } | null;
  };
}

export default function UpdateDetailContent({ post, adjacent }: UpdateDetailContentProps) {
  const { t, i18n } = useTranslation('common');
  const [fontSize, setFontSize] = useState(getStoredFontSize);
  const [theme, setTheme] = useState(getStoredTheme);
  
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('reading-font-size', size);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('reading-theme', newTheme);
  };

  const themeStyles = {
    light: "bg-white text-slate-900 prose-slate",
    sepia: "bg-[#f4ecd8] text-[#5b4636] prose-stone",
    dark: "bg-slate-900 text-slate-100 prose-invert prose-slate",
  };

  return (
    <>
      <div className={`flex-grow transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950' : theme === 'sepia' ? 'bg-[#e8dfc8]' : 'bg-sky-50/30'}`}>
        <article className={`flex-grow transition-all duration-500 py-6 sm:py-12 ${theme === 'dark' ? 'text-slate-100' : theme === 'sepia' ? 'text-[#5b4636]' : 'text-slate-900'}`}>
          <div className={`container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl transition-all duration-500 ${themeStyles[theme as keyof typeof themeStyles]} ${theme === 'light' ? 'glass-morphism' : ''}`}>
            <Button asChild variant="link" className={`mb-8 sm:mb-12 pl-0 text-xl sm:text-2xl font-bold hover:no-underline group/back ${theme === 'dark' ? 'text-sky-400' : theme === 'sepia' ? 'text-[#8c6d4f]' : 'text-sky-600'}`}>
              <Link href="/updates" className="flex items-center">
                <ChevronLeft className="mr-2 h-6 w-6 sm:h-8 sm:w-8 transition-transform group-hover/back:-translate-x-2" />
                {t('updates.backToList')}
              </Link>
            </Button>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className={`flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-sky-400/70' : theme === 'sepia' ? 'text-[#8c6d4f]/70' : 'text-sky-500/70'}`}>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{t(`updates.categories.${post.category}`)}</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-light leading-tight mb-2 sm:mb-4">
                {post[`title_${langSuffix}`] || post.title_en}
              </h1>
              {post[`subtitle_${langSuffix}`] && (
                <p className={`text-lg sm:text-2xl md:text-3xl font-light italic opacity-60`}>
                  {post[`subtitle_${langSuffix}`]}
                </p>
              )}
            </div>

            {post.type === 'image' && post.imageUrl && (
              <div className="mb-12 rounded-[2rem] overflow-hidden shadow-xl bg-slate-100 relative" style={{ minHeight: '60vh' }}>
                <Image
                  src={post.imageUrl}
                  alt={post[`title_${langSuffix}`]}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 90vw, 640px"
                  unoptimized
                />
              </div>
            )}

            <div 
              className={`prose max-w-none transition-all duration-300 ${fontSize} ${theme === 'dark' ? 'prose-invert' : ''} ${theme === 'sepia' ? 'prose-stone' : 'prose-slate'}`}
              dangerouslySetInnerHTML={{ __html: post[`contentHtml_${langSuffix}`] || post.contentHtml_en }}
            />

            {/* Sibling Navigation Bar */}
            {(adjacent?.prev || adjacent?.next) && (
              <div className={`mt-20 pt-12 border-t flex flex-col sm:flex-row gap-8 items-stretch justify-between ${theme === 'dark' ? 'border-slate-800' : theme === 'sepia' ? 'border-[#d4c8ad]' : 'border-sky-100'}`}>
                {/* Newer Post (Next) */}
                <div className="flex-1 group">
                  {adjacent.next ? (
                    <Link href={`/updates/${adjacent.next.id}`} className="flex flex-col h-full space-y-4">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span>{t('updates.newerPost')}</span>
                      </div>
                      <div className={`hidden sm:block p-6 rounded-2xl transition-all h-full border ${
                        theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700' : 
                        theme === 'sepia' ? 'bg-[#d4c8ad]/30 hover:bg-[#d4c8ad]/50 border-[#8c6d4f]/20' : 
                        'bg-sky-50/50 hover:bg-sky-100/50 border-sky-100'
                      }`}>
                        <h5 className="text-lg font-bold line-clamp-2">
                          {adjacent.next[`title_${langSuffix}` as keyof typeof adjacent.next]}
                        </h5>
                      </div>
                    </Link>
                  ) : (
                    <div className="h-full opacity-20 select-none grayscale cursor-default">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        <span>{t('updates.latestReached')}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Older Post (Prev) */}
                <div className="flex-1 group text-right">
                  {adjacent.prev ? (
                    <Link href={`/updates/${adjacent.prev.id}`} className="flex flex-col h-full space-y-4 items-end">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                        <span>{t('updates.olderPost')}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className={`hidden sm:block p-6 rounded-2xl transition-all h-full w-full border ${
                        theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700' : 
                        theme === 'sepia' ? 'bg-[#d4c8ad]/30 hover:bg-[#d4c8ad]/50 border-[#8c6d4f]/20' : 
                        'bg-sky-50/50 hover:bg-sky-100/50 border-sky-100'
                      }`}>
                        <h5 className="text-lg font-bold line-clamp-2">
                          {adjacent.prev[`title_${langSuffix}` as keyof typeof adjacent.prev]}
                        </h5>
                      </div>
                    </Link>
                  ) : (
                    <div className="h-full opacity-20 select-none grayscale cursor-default flex flex-col items-end">
                      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4">
                        <span>{t('updates.earliestReached')}</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>

      <ReadingSettings 
        currentFontSize={fontSize} 
        currentTheme={theme} 
        onFontSizeChange={handleFontSizeChange}
        onThemeChange={handleThemeChange}
      />
    </>
  );
}
