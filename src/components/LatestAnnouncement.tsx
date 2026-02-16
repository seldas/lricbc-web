'use client';

import { useEffect, useState } from 'react';
import { getLatestAnnouncement } from '@/lib/actions';
import { PostData } from '@/lib/local-content';
import { useTranslation } from 'react-i18next';
import { Megaphone, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LatestAnnouncement() {
  const { i18n } = useTranslation();
  const [post, setPost] = useState<PostData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  useEffect(() => {
    async function fetchLatest() {
      const latest = await getLatestAnnouncement();
      if (latest) {
        setPost(latest);
        // Show after a short delay
        setTimeout(() => setIsVisible(true), 1000);
      }
    }
    fetchLatest();
  }, []);

  if (!post) return null;

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-40 transition-all duration-500 transform",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    )}>
      {isOpen ? (
        <div className="bg-white/90 backdrop-blur-xl border border-sky-100 shadow-2xl rounded-[2rem] p-6 w-80 md:w-96 animate-in slide-in-from-right-5 duration-300">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-sky-50 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-sky-400" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Megaphone className="h-5 w-5 text-sky-600" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-sky-500">
              {i18n.language === 'en' ? 'Latest Update' : '最新公告'}
            </span>
          </div>

          <h4 className="text-xl font-bold text-sky-900 mb-2 leading-tight">
            {post[`title_${langSuffix}`]}
          </h4>
          
          <p className="text-sky-700/70 text-sm font-light line-clamp-3 mb-6 leading-relaxed">
            {post[`excerpt_${langSuffix}`] || post[`subtitle_${langSuffix}`]}
          </p>

          <Link 
            href={`/updates/${post.id}`}
            className="flex items-center justify-between w-full p-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold transition-all group"
          >
            <span>{i18n.language === 'en' ? 'Read More' : '閱讀更多'}</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-4 flex-row-reverse"
        >
          <div className="flex items-center justify-center h-16 w-16 bg-sky-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white relative">
            <Megaphone className="h-8 w-8" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500 border-2 border-white"></span>
            </span>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-sky-100 shadow-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
            <p className="text-sky-900 font-bold text-sm">
              {i18n.language === 'en' ? 'Recent Announcement' : '查看最新公告'}
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
