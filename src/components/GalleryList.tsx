'use client';

import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { GalleryEvent } from "@/lib/local-gallery";
import Link from "next/link";
import { Search, Calendar, ExternalLink, X } from "lucide-react";

export default function GalleryList({ initialEvents }: { initialEvents: GalleryEvent[] }) {
  const { t, i18n } = useTranslation('common');
  const [filter, setFilter] = useState<'all' | string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>('all');
  
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  // Extract all available years from events
  const years = useMemo(() => {
    const y = new Set<string>();
    initialEvents.forEach(e => {
      if (e.date) {
        y.add(new Date(e.date).getFullYear().toString());
      }
    });
    return Array.from(y).sort((a, b) => b.localeCompare(a));
  }, [initialEvents]);

  const filteredEvents = useMemo(() => {
    return initialEvents.filter(event => {
      const matchesCategory = filter === 'all' || event.category === filter;
      const eventYear = event.date ? new Date(event.date).getFullYear().toString() : '';
      const matchesYear = selectedYear === 'all' || eventYear === selectedYear;
      
      const query = searchQuery.toLowerCase();
      const title = (event[`title_${langSuffix}` as keyof GalleryEvent] as string || "").toLowerCase();
      const matchesSearch = !searchQuery || title.includes(query);

      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [initialEvents, filter, searchQuery, selectedYear, langSuffix]);

  const categories = ['all', 'fellowship', 'holiday', 'worship', 'others'];

  const categoryBadgeStyles: Record<string, string> = {
    fellowship: "text-amber-600 bg-amber-50",
    holiday: "text-emerald-600 bg-emerald-50",
    worship: "text-sky-600 bg-sky-50",
    others: "text-slate-500 bg-slate-50",
  };

  return (
    <>
      <section className="bg-gradient-to-b from-sky-100/60 to-white py-8 md:py-10 border-b border-sky-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/40 backdrop-blur-md rounded-full border border-sky-200 mb-4 animate-pulse">
            <div className="h-2 w-2 bg-sky-500 rounded-full" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-900">
              {t('gallery.title')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-sky-900 leading-tight">
            {t('gallery.title')}
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-light text-sky-600/70 italic max-w-2xl mx-auto leading-relaxed px-4">
            {t('gallery.subtitle')}
          </p>

          <div className="max-w-2xl mx-auto pt-8 mt-8 border-t border-sky-100 animate-in fade-in slide-in-from-top-4 duration-1000">
            <p className="text-base sm:text-xl font-light text-slate-500 italic leading-relaxed px-4">
              {t('gallery.quote')}
            </p>
            <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-sky-500/60">
              — {t('gallery.quoteVerse')}
            </p>
          </div>

          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-sky-400/60 text-xs sm:text-sm font-medium">
            <Image
              src="https://www.gstatic.com/images/branding/product/1x/photos_96dp.png"
              alt="Google Photos"
              width={20}
              height={20}
              className="opacity-60"
              unoptimized
            />
            <span>{t('gallery.googlePhotosNotice')}</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-8 sm:py-12 flex-grow">
        
        {/* Advanced Search & Filter Panel */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-20 space-y-6 sm:space-y-8 bg-white/40 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border border-sky-100 shadow-xl">
          <div className="relative group">
            <Search className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 text-sky-300 group-focus-within:text-sky-500 transition-colors" />
            <Input 
              placeholder={t('gallery.searchPlaceholder') || "Find an event or memory..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 sm:pl-20 pr-12 sm:pr-16 py-8 sm:py-10 text-lg sm:text-2xl font-light rounded-full border-sky-50 bg-white shadow-inner focus-visible:ring-sky-200 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 p-2 hover:bg-sky-50 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-sky-400" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Year Selector */}
            <div className="flex items-center bg-sky-50 p-1.5 sm:p-2 rounded-full border border-sky-100">
              <Calendar className="ml-3 sm:ml-4 mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-sky-400" />
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-sky-900 font-bold uppercase tracking-widest text-[10px] sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 outline-none cursor-pointer"
              >
                <option value="all">{i18n.language === 'en' ? 'All' : '所有年份'}</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="h-6 sm:h-8 w-px bg-sky-100 mx-1 sm:mx-2 hidden sm:block" />

            {categories.map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "ghost"}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-4 sm:px-8 py-4 sm:py-6 text-[10px] sm:text-sm tracking-widest uppercase transition-all h-auto ${
                  filter === cat 
                    ? "bg-sky-600 text-white shadow-lg scale-105" 
                    : "text-sky-900/60 hover:bg-white hover:text-sky-600"
                }`}
              >
                {t(`gallery.categories.${cat}`)}
              </Button>
            ))}
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEvents.map((event) => {
              const cardContent = (
                <Card className="h-full overflow-hidden group cursor-pointer border-none shadow-sm hover:shadow-2xl hover:shadow-sky-200 transition-all rounded-[2.5rem] bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={event.thumbnail}
                      alt={event[`title_${langSuffix}` as keyof GalleryEvent] as string}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {event.googlePhotosUrl && (
                      <div className="absolute top-6 right-6 bg-emerald-500/90 backdrop-blur-md p-3 rounded-full text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        <ExternalLink className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${categoryBadgeStyles[event.category] || categoryBadgeStyles.others}`}>
                        {t(`gallery.categories.${event.category}`)}
                      </span>
                      {event.date && (
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                          {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-light text-sky-950 leading-tight group-hover:text-sky-600 transition-colors line-clamp-2">
                      {event[`title_${langSuffix}` as keyof GalleryEvent] as string}
                    </h3>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                        {event.googlePhotosUrl ? 'Full Album' : `${event.images.length} Photos`}
                      </span>
                      <span className="text-sky-400 text-xs font-black group-hover:translate-x-1 transition-transform">
                        {i18n.language === 'en' ? 'View →' : '查看 →'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );

              return event.googlePhotosUrl ? (
                <a key={event.id} href={event.googlePhotosUrl} target="_blank" rel="noopener noreferrer">
                  {cardContent}
                </a>
              ) : (
                <Link key={event.id} href={`/gallery/${event.id}`}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 space-y-6">
            <div className="bg-sky-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="h-16 w-16 text-sky-200" />
            </div>
            <p className="text-3xl font-light text-sky-900/40 italic">
              No matching memories found
            </p>
            <Button 
              variant="link" 
              onClick={() => {setSearchQuery(""); setFilter('all'); setSelectedYear('all');}}
              className="text-sky-600 text-xl"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
