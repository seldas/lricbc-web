'use client';

import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Target, 
  Heart, 
  BookOpen, 
  History, 
  Users, 
  Sun,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const navItems = [
  { id: 'sunday-service', icon: Sun, labelEn: 'Sermon', labelZh: '主日' },
  { id: 'weekly-schedule', icon: Calendar, labelEn: 'Schedule', labelZh: '時間' },
  { id: 'vision-mission', icon: Target, labelEn: 'Vision', labelZh: '異象' },
  { id: 'core-values', icon: Heart, labelEn: 'Values', labelZh: '價值' },
  { id: 'our-faith', icon: BookOpen, labelEn: 'Faith', labelZh: '信仰' },
  { id: 'church-history', icon: History, labelEn: 'History', labelZh: '歷史' },
  { id: 'leadership', icon: Users, labelEn: 'Leadership', labelZh: '領袖' },
];

export default function AboutPageNav() {
  const { i18n } = useTranslation();
  const [activeId, setActiveId] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observers = new Map();
    const options = { threshold: 0.2, rootMargin: '-10% 0px -70% 0px' };

    const callback = (entries: any[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    navItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // Adjust for navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Floating Sidebar Nav */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                "group relative flex items-center justify-end gap-4 transition-all duration-300",
                isActive ? "scale-110" : "hover:scale-105"
              )}
            >
              <span className={cn(
                "px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border shadow-sm text-sm font-bold uppercase tracking-widest transition-all duration-300 opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0",
                isActive ? "opacity-100 translate-x-0 text-sky-600 border-sky-200" : "text-slate-500 border-slate-100"
              )}>
                {i18n.language === 'en' ? item.labelEn : item.labelZh}
              </span>
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg",
                isActive 
                  ? "bg-sky-600 text-white rotate-0 scale-110" 
                  : "bg-white text-sky-400 hover:text-sky-600 border border-sky-50 group-hover:rotate-12"
              )}>
                <item.icon className="w-6 h-6" />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Mobile Floating Bottom Nav Pill */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 xl:hidden">
        <div className="bg-white/90 backdrop-blur-xl border border-sky-100 shadow-2xl rounded-full p-2 flex items-center gap-2 max-w-[90vw] overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap",
                  isActive ? "bg-sky-600 text-white shadow-lg" : "text-sky-900/40 hover:bg-sky-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  {i18n.language === 'en' ? item.labelEn : item.labelZh}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
