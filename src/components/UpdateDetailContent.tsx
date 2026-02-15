'use client';

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReadingSettings from "@/components/ReadingSettings";

interface UpdateDetailContentProps {
  post: any;
}

export default function UpdateDetailContent({ post }: UpdateDetailContentProps) {
  const { t, i18n } = useTranslation('common');
  const [fontSize, setFontSize] = useState('prose-lg');
  const [theme, setTheme] = useState('light');
  
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  useEffect(() => {
    const savedFontSize = localStorage.getItem('reading-font-size');
    const savedTheme = localStorage.getItem('reading-theme');
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedTheme) setTheme(savedTheme);
  }, []);

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
        <article className={`flex-grow transition-all duration-500 py-12 ${theme === 'dark' ? 'text-slate-100' : theme === 'sepia' ? 'text-[#5b4636]' : 'text-slate-900'}`}>
          <div className={`container mx-auto px-6 py-12 max-w-4xl rounded-[3rem] shadow-2xl transition-all duration-500 ${themeStyles[theme as keyof typeof themeStyles]} ${theme === 'light' ? 'glass-morphism' : ''}`}>
            <Button asChild variant="ghost" className={`mb-8 pl-0 hover:bg-transparent ${theme === 'dark' ? 'text-sky-400 hover:text-sky-300' : theme === 'sepia' ? 'text-[#8c6d4f]' : 'text-sky-600'}`}>
              <Link href="/updates" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t('updates.backToList')}
              </Link>
            </Button>

            <div className="space-y-6 mb-12">
              <div className={`flex items-center space-x-6 text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-sky-400/70' : theme === 'sepia' ? 'text-[#8c6d4f]/70' : 'text-sky-500/70'}`}>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>{t(`updates.categories.${post.category}`)}</span>
                </div>
              </div>
              <h1 className="text-5xl font-light md:text-7xl leading-tight">
                {post[`title_${langSuffix}`] || post.title_en}
              </h1>
            </div>

            <div 
              className={`prose max-w-none transition-all duration-300 ${fontSize} ${theme === 'dark' ? 'prose-invert' : ''} ${theme === 'sepia' ? 'prose-stone' : 'prose-slate'}`}
              dangerouslySetInnerHTML={{ __html: post[`contentHtml_${langSuffix}`] || post.contentHtml_en }}
            />
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
