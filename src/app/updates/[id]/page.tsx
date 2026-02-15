'use client';

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ChevronLeft, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { postByIdQuery } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import ReadingSettings from "@/components/ReadingSettings";

export default function UpdateDetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation('common');
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('prose-lg');
  const [theme, setTheme] = useState('light');
  
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  useEffect(() => {
    // Load preferences from localStorage if available
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

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await client.fetch(postByIdQuery, { id });
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">Loading...</div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Button asChild className="mt-4">
            <Link href="/updates">{t('updates.backToList')}</Link>
          </Button>
        </div>
        <Footer />
      </main>
    );
  }

  const themeStyles = {
    light: "bg-white text-slate-900 prose-slate",
    sepia: "bg-[#f4ecd8] text-[#5b4636] prose-stone",
    dark: "bg-slate-900 text-slate-100 prose-invert prose-slate",
  };

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950' : theme === 'sepia' ? 'bg-[#e8dfc8]' : 'bg-sky-50/30'}`}>
      <Navbar />

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
            <h1 className="text-5xl font-light md:text-7xl leading-tight">{post[`title_${langSuffix}`]}</h1>
          </div>

          <div className={`prose max-w-none transition-all duration-300 ${fontSize} ${theme === 'dark' ? 'prose-invert' : ''} ${theme === 'sepia' ? 'prose-stone' : 'prose-slate'}`}>
            <PortableText value={post[`body_${langSuffix}`]} />
          </div>
        </div>
      </article>

      <ReadingSettings 
        currentFontSize={fontSize} 
        currentTheme={theme} 
        onFontSizeChange={handleFontSizeChange}
        onThemeChange={handleThemeChange}
      />

      <Footer />
    </main>
  );
}
