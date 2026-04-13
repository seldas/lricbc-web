'use client';

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Calendar, Search, X } from "lucide-react";
import { useState, useMemo } from "react";

interface Post {
  id: string;
  category: 'pastor' | 'sermon' | 'news';
  type?: 'text' | 'image';
  imageUrl?: string;
  publishedAt: string;
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  content: string;
  contentHtml_en?: string;
  contentHtml_zh?: string;
}

export default function UpdatesList({ initialPosts }: { initialPosts: Post[] }) {
  const { t, i18n } = useTranslation('common');
  const [filter, setFilter] = useState<'all' | 'pastor' | 'sermon' | 'news'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  // Integrated Search and Category Filter Logic
  const filteredUpdates = useMemo(() => {
    return initialPosts.filter(post => {
      const matchesCategory = filter === 'all' || post.category === filter;
      
      const query = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        post.title_en.toLowerCase().includes(query) ||
        post.title_zh.toLowerCase().includes(query) ||
        post.subtitle_en?.toLowerCase().includes(query) ||
        post.subtitle_zh?.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, filter, searchQuery]);

  // Find the latest for each key category (from the absolute latest, not filtered)
  const latestPastor = initialPosts.find(p => p.category === 'pastor');
  const latestSermon = initialPosts.find(p => p.category === 'sermon');

  // Logic for display: Hide featured highlights if searching or on page > 1
  const showHighlights = currentPage === 1 && filter === 'all' && !searchQuery;
  const featuredIds = new Set([latestPastor?.id, latestSermon?.id].filter(Boolean));
  
  const displayPosts = showHighlights 
    ? filteredUpdates.filter(p => !featuredIds.has(p.id))
    : filteredUpdates;

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = displayPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(displayPosts.length / postsPerPage);

  const categories: ('all' | 'pastor' | 'sermon' | 'news')[] = ['all', 'pastor', 'sermon', 'news'];

  const categoryStyles = {
    pastor: "bg-amber-50/90 text-amber-900 border-amber-200 shadow-amber-100",
    sermon: "bg-sky-50/90 text-sky-900 border-sky-200 shadow-sky-100",
    news: "bg-emerald-50/90 text-emerald-900 border-emerald-200 shadow-emerald-100",
    all: ""
  };

  const categoryBadgeStyles = {
    pastor: "bg-amber-600 text-white",
    sermon: "bg-sky-600 text-white",
    news: "bg-emerald-600 text-white",
    all: ""
  };

  return (
    <>
      {/* Compact Responsive Banner - Exactly matching OnlineWorship style */}
      <section className="bg-gradient-to-b from-sky-100/60 to-white py-8 md:py-10 border-b border-sky-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/40 backdrop-blur-md rounded-full border border-sky-200 mb-4 animate-pulse">
            <div className="h-2 w-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-900">
              {t('nav.updates')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-sky-900 leading-tight">
            {t('updates.title')}
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-light text-sky-600/70 italic max-w-2xl mx-auto leading-relaxed px-4">
            {t('updates.subtitle')}
          </p>

          <div className="max-w-2xl mx-auto pt-8 mt-8 border-t border-sky-100 animate-in fade-in slide-in-from-top-4 duration-1000">
            <p className="text-base sm:text-xl font-light text-slate-500 italic leading-relaxed px-4">
              {t('updates.quote')}
            </p>
            <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-sky-500/60">
              — {t('updates.quoteVerse')}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 flex-grow">
        
        {/* Search & Filter Bar */}
        <div className="max-w-5xl mx-auto mb-20 space-y-10">
          <div className="relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 text-sky-300 group-focus-within:text-sky-500 transition-colors" />
            <Input 
              placeholder={t('updates.searchPlaceholder') || "Search all messages..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-20 pr-16 py-12 text-3xl font-light rounded-[3rem] border-sky-100 bg-white/60 backdrop-blur-xl shadow-2xl focus-visible:ring-sky-200 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-2 hover:bg-sky-50 rounded-full transition-colors"
              >
                <X className="h-8 w-8 text-sky-400" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                onClick={() => {
                  setFilter(cat);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-10 py-8 text-lg tracking-widest uppercase border-2 transition-all ${
                  filter === cat && cat !== 'all' 
                    ? `${categoryBadgeStyles[cat as keyof typeof categoryBadgeStyles]} border-transparent scale-105 shadow-lg` 
                    : "border-sky-100 text-sky-900/60 hover:bg-white"
                }`}
              >
                {t(`updates.categories.${cat}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Latest Highlights Section */}
        {showHighlights && (
          <div className="mb-32">
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="h-px w-12 bg-sky-200" />
              <h2 className="text-sky-900/40 text-sm font-black uppercase tracking-[0.5em] italic">Latest Highlights</h2>
              <div className="h-px w-12 bg-sky-200" />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {latestPastor && (
                <Card className="flex flex-col bg-amber-50/40 backdrop-blur-md rounded-[4rem] shadow-2xl overflow-hidden group transition-all hover:scale-[1.02] border-none shadow-amber-200/20">
                  <div className="relative h-80 bg-gradient-to-br from-amber-500 to-orange-900 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10 text-center p-8">
                      <div className="inline-block px-8 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest mb-6 border border-white/30">
                        {t('updates.categories.pastor')}
                      </div>
                      <h3 className="text-5xl font-light text-white leading-tight tracking-tight">
                        {latestPastor[`title_${langSuffix}` as keyof Post]}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-12 flex flex-col space-y-8 bg-amber-50/50">
                    <div className="flex items-center space-x-3 text-amber-600 font-black text-base uppercase tracking-widest">
                      <Calendar className="h-6 w-6" />
                      <span>{new Date(latestPastor.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <Button asChild className="w-full rounded-full py-10 text-2xl font-bold bg-amber-600 hover:bg-amber-700 shadow-2xl transition-all hover:scale-105">
                      <Link href={`/updates/${latestPastor.id}`}>
                        {t('updates.readMore')} →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {latestSermon && (
                <Card className="flex flex-col bg-sky-50/40 backdrop-blur-md rounded-[4rem] shadow-2xl overflow-hidden group transition-all hover:scale-[1.02] border-none shadow-sky-200/20">
                  <div className="relative h-80 bg-gradient-to-br from-sky-500 to-indigo-900 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10 text-center p-8">
                      <div className="inline-block px-8 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest mb-6 border border-white/30">
                        {t('updates.categories.sermon')}
                      </div>
                      <h3 className="text-5xl font-light text-white leading-tight tracking-tight">
                        {latestSermon[`title_${langSuffix}` as keyof Post]}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-12 flex flex-col space-y-8 bg-sky-50/50">
                    <div className="flex items-center space-x-3 text-sky-600 font-black text-base uppercase tracking-widest">
                      <Calendar className="h-6 w-6" />
                      <span>{new Date(latestSermon.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <Button asChild className="w-full rounded-full py-10 text-2xl font-bold bg-sky-600 hover:bg-sky-700 shadow-2xl transition-all hover:scale-105">
                      <Link href={`/updates/${latestSermon.id}`}>
                        {t('updates.readMore')} →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Remaining Posts Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-24">
            {currentPosts.map((update) => (
              <article
                key={update.id}
                className="flex flex-col rounded-[2.5rem] border border-slate-100 bg-white/80 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-2xl"
              >
                <header className="flex items-start justify-between gap-3 p-6">
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-[11px] font-black uppercase tracking-[0.3em] ${categoryBadgeStyles[update.category as keyof typeof categoryBadgeStyles]}`}>
                    {t(`updates.categories.${update.category}`)}
                  </span>
                  <time className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">
                    {new Date(update.publishedAt).toLocaleDateString()}
                  </time>
                </header>
                <div className="px-6 pb-6 space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-semibold leading-snug tracking-tight text-slate-900">
                    {update[`title_${langSuffix}` as keyof Post]}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 line-clamp-4">
                    {update[`excerpt_${langSuffix}` as keyof Post]}
                  </p>
                </div>
                <div className="mt-auto px-6 pb-6">
                  <Link
                    href={`/updates/${update.id}`}
                    className="text-sm font-bold tracking-widest uppercase text-sky-600 hover:text-sky-700"
                  >
                    {t('updates.readMore')} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 space-y-6">
            <Search className="h-20 w-20 text-sky-100 mx-auto" />
            <p className="text-3xl font-light text-sky-900/40 italic">
              No results found for “{searchQuery}”
            </p>
            <Button 
              variant="link" 
              onClick={() => {setSearchQuery(""); setFilter('all');}}
              className="text-sky-600 text-xl"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-full border-sky-100"
            >
              Previous
            </Button>
            <span className="text-sky-800/50 font-light tracking-widest text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-full border-sky-100"
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
