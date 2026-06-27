'use client';

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { CalendarDays, LayoutList, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import UpdatesCalendar from "@/components/UpdatesCalendar";

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

type Category = 'pastor' | 'sermon' | 'news';

const ALL_CATEGORIES: Category[] = ['pastor', 'sermon', 'news'];

export default function UpdatesList({ initialPosts }: { initialPosts: Post[] }) {
  const { t, i18n } = useTranslation('common');
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set(ALL_CATEGORIES));
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const postsPerPage = 10;

  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  const toggleCategory = (cat: Category) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setCurrentPage(1);
  };

  // Search applies everywhere; category checkboxes only narrow the list view.
  const searchFilteredUpdates = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return initialPosts;
    return initialPosts.filter(post =>
      post.title_en.toLowerCase().includes(query) ||
      post.title_zh.toLowerCase().includes(query) ||
      post.subtitle_en?.toLowerCase().includes(query) ||
      post.subtitle_zh?.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
  }, [initialPosts, searchQuery]);

  const listFilteredUpdates = useMemo(
    () => searchFilteredUpdates.filter(post => selectedCategories.has(post.category)),
    [searchFilteredUpdates, selectedCategories]
  );

  // Pagination logic (list mode only)
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listFilteredUpdates.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(listFilteredUpdates.length / postsPerPage);

  const categoryDotStyles: Record<Category, string> = {
    pastor: "bg-amber-500",
    sermon: "bg-sky-500",
    news: "bg-emerald-500",
  };

  const categoryBadgeStyles: Record<Category, string> = {
    pastor: "bg-amber-600 text-white",
    sermon: "bg-sky-600 text-white",
    news: "bg-emerald-600 text-white",
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

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border border-sky-100 bg-white/60 p-1.5 backdrop-blur-md shadow-sm">
            <button
              onClick={() => { setViewMode('list'); setCurrentPage(1); }}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                viewMode === 'list' ? 'bg-sky-600 text-white shadow-md' : 'text-sky-900/50 hover:text-sky-700'
              }`}
            >
              <LayoutList className="h-4 w-4" />
              {t('updates.viewMode.list') || 'List'}
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                viewMode === 'calendar' ? 'bg-sky-600 text-white shadow-md' : 'text-sky-900/50 hover:text-sky-700'
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              {t('updates.viewMode.calendar') || 'Calendar'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-sky-300 group-focus-within:text-sky-500 transition-colors" />
            <Input
              placeholder={t('updates.searchPlaceholder') || "Search all messages..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-16 pr-14 py-8 text-xl font-light rounded-[2.5rem] border-sky-100 bg-white/60 backdrop-blur-xl shadow-xl focus-visible:ring-sky-200 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-sky-50 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-sky-400" />
              </button>
            )}
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && <UpdatesCalendar posts={searchFilteredUpdates} />}

        {/* Category Checkboxes (list mode only) */}
        {viewMode === 'list' && (
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {ALL_CATEGORIES.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.has(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                />
                <span className={`h-2 w-2 rounded-full ${categoryDotStyles[cat]}`} />
                {t(`updates.categories.${cat}`)}
              </label>
            ))}
          </div>
        )}

        {/* Pure List View */}
        {viewMode === 'list' && (
          currentPosts.length > 0 ? (
            <div className="max-w-3xl mx-auto mb-12 rounded-[2rem] border border-slate-100 bg-white/80 shadow-lg shadow-slate-200/50 divide-y divide-slate-100 overflow-hidden">
              {currentPosts.map((update) => (
                <Link
                  key={update.id}
                  href={`/updates/${update.id}`}
                  className="flex items-center gap-4 px-6 py-5 hover:bg-sky-50/50 transition-colors group"
                >
                  <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${categoryDotStyles[update.category as keyof typeof categoryDotStyles]}`} />
                  <span className={`hidden sm:inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${categoryBadgeStyles[update.category as keyof typeof categoryBadgeStyles]}`}>
                    {t(`updates.categories.${update.category}`)}
                  </span>
                  <span className="flex-1 min-w-0 text-base sm:text-lg font-semibold text-slate-800 group-hover:text-sky-700 truncate">
                    {update[`title_${langSuffix}` as keyof Post]}
                  </span>
                  <time className="text-xs font-bold uppercase tracking-widest text-slate-400 flex-shrink-0">
                    {new Date(update.publishedAt).toLocaleDateString()}
                  </time>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 space-y-6">
              <Search className="h-20 w-20 text-sky-100 mx-auto" />
              <p className="text-3xl font-light text-sky-900/40 italic">
                No results found for &ldquo;{searchQuery}&rdquo;
              </p>
              <Button
                variant="link"
                onClick={() => { setSearchQuery(""); setSelectedCategories(new Set(ALL_CATEGORIES)); }}
                className="text-sky-600 text-xl"
              >
                Clear all filters
              </Button>
            </div>
          )
        )}

        {/* Pagination Controls */}
        {viewMode === 'list' && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4 mb-16">
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
