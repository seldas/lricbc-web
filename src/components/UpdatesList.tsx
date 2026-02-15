'use client';

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { useState } from "react";

interface Post {
  id: string;
  category: 'pastor' | 'sermon' | 'news';
  publishedAt: string;
  title_en: string;
  title_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
}

export default function UpdatesList({ initialPosts }: { initialPosts: Post[] }) {
  const { t, i18n } = useTranslation('common');
  const [filter, setFilter] = useState<'all' | 'pastor' | 'sermon' | 'news'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
  
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  const filteredUpdates = filter === 'all' 
    ? initialPosts 
    : initialPosts.filter(u => u.category === filter);

  // The very first post in the sorted list is the Featured one
  const featuredPost = filteredUpdates[0];
  const remainingPosts = filteredUpdates.slice(1);

  // Pagination logic for remaining posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = remainingPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(remainingPosts.length / postsPerPage);

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
      <section className="bg-gradient-to-b from-sky-100/60 to-white py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-7xl font-light tracking-tight md:text-9xl mb-8 text-sky-900">{t('updates.title')}</h1>
          <p className="text-3xl font-light text-sky-600/70 italic max-w-4xl mx-auto leading-relaxed">
            {t('updates.subtitle')}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 flex-grow">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-24">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => {
                setFilter(cat);
                setCurrentPage(1);
              }}
              className={`rounded-full px-10 py-8 text-lg tracking-widest uppercase border-2 ${
                filter === cat && cat !== 'all' 
                  ? `${categoryBadgeStyles[cat as keyof typeof categoryBadgeStyles]} border-transparent` 
                  : "border-sky-100 text-sky-900/60"
              }`}
            >
              {t(`updates.categories.${cat}`)}
            </Button>
          ))}
        </div>

        {/* Featured Post (Most Recent) */}
        {featuredPost && currentPage === 1 && (
          <div className="mb-24">
            <h2 className="text-sky-900/40 text-sm font-black uppercase tracking-[0.5em] mb-8 text-center italic">Featured Latest Message</h2>
            <Card className={`flex flex-col lg:flex-row backdrop-blur-md rounded-[4rem] shadow-2xl overflow-hidden group border-2 transition-all hover:scale-[1.01] ${
              featuredPost.category === 'pastor' ? 'border-amber-200 shadow-amber-200/20' : 
              featuredPost.category === 'sermon' ? 'border-sky-200 shadow-sky-200/20' : 'border-emerald-200 shadow-emerald-200/20'
            }`}>
              <div className={`lg:w-5/12 relative flex items-center justify-center min-h-[400px] ${
                featuredPost.category === 'pastor' ? 'bg-amber-900' : 
                featuredPost.category === 'sermon' ? 'bg-sky-900' : 'bg-emerald-900'
              }`}>
                <div className={`absolute inset-0 opacity-90 bg-gradient-to-br ${
                  featuredPost.category === 'pastor' ? 'from-amber-500 to-orange-950' : 
                  featuredPost.category === 'sermon' ? 'from-sky-500 to-indigo-950' : 'from-emerald-500 to-teal-950'
                }`} />
                <div className="relative z-10 p-16 text-center">
                  <div className="inline-block px-8 py-2 bg-white/20 backdrop-blur-xl rounded-full text-white text-xs font-black uppercase tracking-widest mb-8 border border-white/40">
                    {t(`updates.categories.${featuredPost.category}`)}
                  </div>
                  <h3 className="text-5xl md:text-7xl font-light text-white leading-[1.1] tracking-tight">
                    {featuredPost[`title_${langSuffix}` as keyof Post]}
                  </h3>
                </div>
              </div>
              <CardContent className={`lg:w-7/12 p-16 flex flex-col justify-center space-y-10 ${
                featuredPost.category === 'pastor' ? 'bg-amber-50/50' : 
                featuredPost.category === 'sermon' ? 'bg-sky-50/50' : 'bg-emerald-50/50'
              }`}>
                <div className="flex items-center space-x-4 text-sky-600 font-black text-base uppercase tracking-widest">
                  <Calendar className="h-6 w-6" />
                  <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-3xl text-sky-900/80 font-light leading-relaxed italic border-l-4 border-sky-200 pl-8">
                  {featuredPost[`excerpt_${langSuffix}` as keyof Post]}
                </p>
                <Button asChild className={`w-fit rounded-full px-12 py-10 text-2xl font-bold transition-all hover:scale-110 shadow-2xl hover:shadow-sky-300/50 ${
                  featuredPost.category === 'pastor' ? 'bg-amber-600 hover:bg-amber-700' : 
                  featuredPost.category === 'sermon' ? 'bg-sky-600 hover:bg-sky-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}>
                  <Link href={`/updates/${featuredPost.id}`}>
                    {t('updates.readMore')} →
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Remaining Posts Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mb-24">
          {currentPosts.map((update) => (
            <Card key={update.id} className={`flex flex-col rounded-[3.5rem] shadow-xl hover:shadow-2xl transition-all group border-2 ${categoryStyles[update.category as keyof typeof categoryStyles]}`}>
              <CardHeader className="p-10 pb-6">
                <div className="flex items-center justify-between mb-8">
                  <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest ${categoryBadgeStyles[update.category as keyof typeof categoryBadgeStyles]}`}>
                    {t(`updates.categories.${update.category}`)}
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest opacity-60">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(update.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2 text-3xl font-light leading-tight group-hover:text-primary transition-colors">
                  {update[`title_${langSuffix}` as keyof Post]}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-10 flex-grow">
                <CardDescription className="text-lg font-light leading-relaxed line-clamp-4 italic text-sky-900/70">
                  {update[`excerpt_${langSuffix}` as keyof Post]}
                </CardDescription>
              </CardContent>
              <CardFooter className="p-10 pt-6 mt-auto">
                <Button asChild className={`w-full rounded-full py-8 text-xl font-bold transition-all hover:scale-105 shadow-lg ${
                  update.category === 'pastor' ? 'bg-amber-600 hover:bg-amber-700' : 
                  update.category === 'sermon' ? 'bg-sky-600 hover:bg-sky-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}>
                  <Link href={`/updates/${update.id}`}>
                    {t('updates.readMore')} →
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

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
