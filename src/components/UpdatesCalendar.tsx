'use client';

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { parseLocalDate } from "@/lib/utils";

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
}

const categoryBadgeStyles: Record<string, string> = {
  pastor: "bg-amber-600 text-white",
  sermon: "bg-sky-600 text-white",
  news: "bg-emerald-600 text-white",
};

const categoryDotStyles: Record<string, string> = {
  pastor: "bg-amber-500",
  sermon: "bg-sky-500",
  news: "bg-emerald-500",
};

// Weeks run Sunday-Saturday. Week 1 of a month is whatever partial
// Sun-Sat span contains the 1st, even if it's just a day or two.
function firstWeekdayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay(); // 0 = Sunday
}

function weekOfMonth(date: Date) {
  const firstWeekday = firstWeekdayOfMonth(date.getFullYear(), date.getMonth());
  return Math.floor((date.getDate() - 1 + firstWeekday) / 7) + 1;
}

function weeksInMonth(year: number, monthIndex: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = firstWeekdayOfMonth(year, monthIndex);
  return Math.floor((daysInMonth - 1 + firstWeekday) / 7) + 1;
}

function weekDateRange(year: number, monthIndex: number, week: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = firstWeekdayOfMonth(year, monthIndex);
  const start = Math.max(1, (week - 1) * 7 - firstWeekday + 1);
  const end = Math.min(daysInMonth, week * 7 - firstWeekday);
  return { start, end };
}

export default function UpdatesCalendar({ posts }: { posts: Post[] }) {
  const { t, i18n } = useTranslation('common');
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';
  const locale = i18n.language === 'en' ? 'en-US' : 'zh-CN';

  const latestDate = useMemo(() => {
    for (const post of posts) {
      const d = parseLocalDate(post.publishedAt);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  }, [posts]);

  const [viewYear, setViewYear] = useState(latestDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(latestDate.getMonth());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(latestDate.getFullYear());

  // Group this month's posts by week number -> posts[]
  const weeks = useMemo(() => {
    const map = new Map<number, Post[]>();
    for (const post of posts) {
      const date = parseLocalDate(post.publishedAt);
      if (isNaN(date.getTime())) continue;
      if (date.getFullYear() !== viewYear || date.getMonth() !== viewMonth) continue;
      const week = weekOfMonth(date);
      if (!map.has(week)) map.set(week, []);
      map.get(week)!.push(post);
    }
    return map;
  }, [posts, viewYear, viewMonth]);

  const totalWeeks = weeksInMonth(viewYear, viewMonth);
  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });
  const monthShortLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString(locale, {
    month: 'short',
  });

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(y => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(y => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const openPicker = () => {
    setPickerYear(viewYear);
    setPickerOpen(true);
  };

  const monthAbbrevs = Array.from({ length: 12 }, (_, i) =>
    new Date(2000, i, 1).toLocaleDateString(locale, { month: 'short' })
  );

  return (
    <div className="max-w-3xl mx-auto mb-16">
      {/* Month Navigator */}
      <div className="relative flex items-center justify-center gap-6 mb-8">
        <button
          onClick={goPrevMonth}
          aria-label="Previous month"
          className="h-12 w-12 flex items-center justify-center rounded-full border border-sky-100 bg-white/70 hover:bg-sky-50 transition-colors shadow-sm"
        >
          <ChevronLeft className="h-5 w-5 text-sky-700" />
        </button>

        <button
          onClick={openPicker}
          className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-sky-50/70 transition-colors"
        >
          <CalendarDays className="h-5 w-5 text-sky-500" />
          <span className="text-2xl font-semibold tracking-tight text-slate-900 min-w-[10ch] text-center">
            {monthLabel}
          </span>
        </button>

        <button
          onClick={goNextMonth}
          aria-label="Next month"
          className="h-12 w-12 flex items-center justify-center rounded-full border border-sky-100 bg-white/70 hover:bg-sky-50 transition-colors shadow-sm"
        >
          <ChevronRight className="h-5 w-5 text-sky-700" />
        </button>

        {/* Year/Month Picker Popover */}
        {pickerOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setPickerOpen(false)}
            />
            <div className="absolute top-full mt-3 z-50 w-80 rounded-3xl border border-sky-100 bg-white shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setPickerYear(y => y - 1)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-sky-50 transition-colors"
                  aria-label="Previous year"
                >
                  <ChevronLeft className="h-4 w-4 text-sky-700" />
                </button>
                <span className="text-lg font-bold text-slate-900">{pickerYear}</span>
                <button
                  onClick={() => setPickerYear(y => y + 1)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-sky-50 transition-colors"
                  aria-label="Next year"
                >
                  <ChevronRight className="h-4 w-4 text-sky-700" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {monthAbbrevs.map((label, idx) => {
                  const isSelected = pickerYear === viewYear && idx === viewMonth;
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setViewYear(pickerYear);
                        setViewMonth(idx);
                        setPickerOpen(false);
                      }}
                      className={`rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-wide transition-all ${
                        isSelected
                          ? 'bg-sky-600 text-white shadow-md'
                          : 'text-slate-600 hover:bg-sky-50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Weeks */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white/80 backdrop-blur-md shadow-lg shadow-slate-200/50 overflow-hidden divide-y divide-slate-100">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((weekNum) => {
          const weekPosts = weeks.get(weekNum) ?? [];
          const { start, end } = weekDateRange(viewYear, viewMonth, weekNum);

          return (
            <div key={weekNum} className="flex flex-col sm:flex-row gap-4 px-8 py-6">
              <div className="flex-shrink-0 sm:w-40">
                <p className="text-sm font-black uppercase tracking-widest text-sky-700">
                  {i18n.language === 'en'
                    ? `${t('updates.calendar.week') || 'Week'} ${weekNum}`
                    : `${t('updates.calendar.week') || '第'}${weekNum}週`}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {monthShortLabel} {start}–{end}
                </p>
              </div>

              <div className="flex-1">
                {weekPosts.length === 0 ? (
                  <p className="text-sm text-slate-300 italic">
                    {t('updates.calendar.noUpdates') || 'No updates'}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {weekPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/updates/${post.id}`}
                        className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all px-4 py-3 w-full sm:w-auto sm:max-w-md"
                      >
                        <span className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${categoryDotStyles[post.category] ?? 'bg-slate-400'}`} />
                        <span className={`hidden sm:inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${categoryBadgeStyles[post.category] ?? 'bg-slate-500 text-white'}`}>
                          {t(`updates.categories.${post.category}`)}
                        </span>
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-700 break-words min-w-0">
                          {post[`title_${langSuffix}` as keyof Post]}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
