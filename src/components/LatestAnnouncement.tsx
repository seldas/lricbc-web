'use client';

import { useEffect, useState } from 'react';
import { getLatestAnnouncement } from '@/lib/actions';
import { PostData } from '@/lib/local-content';
import { useTranslation } from 'react-i18next';
import { Megaphone, X, ArrowRight, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
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

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!post) return null;

  const isImagePost = post.type === 'image' && post.imageUrl;

  return (
    <>
      {/* Backdrop for open state on mobile/all to ensure focus and reachability */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-sky-950/20 backdrop-blur-sm z-[90] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "fixed transition-all duration-500 transform",
        // Position: bottom-right on desktop, centered bottom on mobile
        "bottom-6 right-6 md:bottom-24 md:right-8",
        // Layering: higher than navbar (z-50)
        "z-[100]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
        isOpen ? "w-[calc(100%-3rem)] md:w-auto" : "w-auto"
      )}>
        {isOpen ? (
          isImagePost ? (
            <div className="relative group animate-in zoom-in-95 duration-300 mx-auto">
              <div className="bg-white/95 backdrop-blur-xl border border-sky-100 shadow-2xl rounded-[2.5rem] overflow-hidden w-full md:w-[28rem] flex flex-col max-h-[85vh]">
                {/* Header with Title and Close */}
                <div className="p-4 md:p-5 border-b border-sky-50 flex items-center justify-between bg-sky-50/50">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-2 bg-sky-100 rounded-lg shrink-0">
                      <ImageIcon className="h-4 w-4 text-sky-600" />
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-sky-500 truncate">
                      {post[`title_${langSuffix}`]}
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-3 bg-sky-100/50 hover:bg-sky-200 text-sky-600 rounded-full transition-all active:scale-90"
                    aria-label="Close announcement"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="p-3 overflow-y-auto custom-scrollbar">
                  <div className="relative rounded-2xl overflow-hidden shadow-inner bg-slate-50" style={{ minHeight: '60vh' }}>
                    <Image
                      src={post.imageUrl!}
                      alt={post[`title_${langSuffix}`]}
                      fill
                      sizes="(max-width: 768px) 90vw, 560px"
                      className="object-contain transition-transform duration-700"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="p-6 pt-2 space-y-4">
                  <Link 
                    href={`/updates/${post.id}`}
                    className="flex items-center justify-center w-full py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-bold transition-all group shadow-lg shadow-sky-200"
                  >
                    <span>{i18n.language === 'en' ? 'View Full Poster' : '查看完整海報'}</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-xl border border-sky-100 shadow-2xl rounded-[2.5rem] p-6 md:p-8 w-full md:w-96 animate-in slide-in-from-bottom-5 duration-300 relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-3 bg-sky-50 hover:bg-sky-100 text-sky-400 rounded-full transition-all active:scale-90"
                aria-label="Close announcement"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-sky-100 rounded-2xl">
                  <Megaphone className="h-6 w-6 text-sky-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500">
                    {i18n.language === 'en' ? 'Latest Update' : '最新公告'}
                  </span>
                  <span className="text-xs text-sky-400 font-bold">{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h4 className="text-2xl font-bold text-sky-900 mb-4 leading-tight">
                {post[`title_${langSuffix}`]}
              </h4>
              
              <p className="text-sky-700/70 text-base font-light line-clamp-4 mb-8 leading-relaxed italic">
                {post[`excerpt_${langSuffix}`] || post[`subtitle_${langSuffix}`]}
              </p>

              <Link 
                href={`/updates/${post.id}`}
                className="flex items-center justify-between w-full p-5 bg-sky-600 hover:bg-sky-700 text-white rounded-[1.5rem] font-bold transition-all group shadow-lg shadow-sky-200"
              >
                <span>{i18n.language === 'en' ? 'Read Full Story' : '閱讀全文'}</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="relative group flex items-center gap-4 flex-row-reverse"
          >
            <div className="flex items-center justify-center h-16 w-16 md:h-20 md:w-20 bg-sky-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-white relative">
              <Megaphone className="h-8 w-8 md:h-10 md:w-10" />
              <span className="absolute -top-1 -right-1 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500 border-4 border-white"></span>
              </span>
            </div>
            
            <div className="hidden md:block bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-sky-100 shadow-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
              <p className="text-sky-900 font-bold text-sm">
                {i18n.language === 'en' ? 'Recent Announcement' : '查看最新公告'}
              </p>
            </div>
          </button>
        )}
      </div>
    </>
  );
}
