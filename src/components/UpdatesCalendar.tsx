'use client';

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";

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

function weekOfMonth(date: Date) {
  return Math.ceil(date.getDate() / 7);
}

function weeksInMonth(year: number, monthIndex: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  return Math.ceil(daysInMonth / 7);
}

function weekDateRange(year: number, monthIndex: number, week: number) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const start = (week - 1) * 7 + 1;
  const end = Math.min(week * 7, daysInMonth);
  return { start, end };
}

export default function UpdatesCalendar({ posts }: { posts: Post[] }) {
  const { t, i18n } = useTranslation('common');
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';
  const locale = i18n.language === 'en' ? 'en-US' : 'zh-CN';

  // Group posts by "YYYY-MM" -> week number -> posts[]
  const monthGroups = useMemo(() => {
    const map = new Map<string, { year: number; monthIndex: number; weeks: Map<number, Post[]> }>();

    for (const post of posts) {
      const date = new Date(post.publishedAt);
      if (isNaN(date.getTime())) continue;
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const key = `${year}-${String(monthIndex).padStart(2, '0')}`;
      const week = weekOfMonth(date);

      if (!map.has(key)) {
        map.set(key, { year, monthIndex, weeks: new Map() });
      }
      const group = map.get(key)!;
      if (!group.weeks.has(week)) group.weeks.set(week, []);
      group.weeks.get(week)!.push(post);
    }

    return Array.from(map.entries())
      .sort((a, b) => (a[0] < b[0] ? 1 : -1)) // latest month first
      .map(([key, value]) => ({ key, ...value }));
  }, [posts]);

  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(
    () => new Set(monthGroups.slice(0, 1).map(g => g.key))
  );

  const toggleMonth = (key: string) => {
    setExpandedMonths(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (monthGroups.length === 0) {
    return (
      <div className="text-center py-32 space-y-6">
        <CalendarDays className="h-20 w-20 text-sky-100 mx-auto" />
        <p className="text-3xl font-light text-sky-900/40 italic">
          {t('updates.calendar.empty') || "No updates found."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 mb-24">
      {monthGroups.map((group) => {
        const isExpanded = expandedMonths.has(group.key);
        const monthLabel = new Date(group.year, group.monthIndex, 1).toLocaleDateString(locale, {
          month: 'long',
          year: 'numeric',
        });
        const monthShortLabel = new Date(group.year, group.monthIndex, 1).toLocaleDateString(locale, {
          month: 'short',
        });
        const totalWeeks = weeksInMonth(group.year, group.monthIndex);
        const postCount = Array.from(group.weeks.values()).reduce((sum, arr) => sum + arr.length, 0);

        return (
          <div
            key={group.key}
            className="rounded-[2.5rem] border border-slate-100 bg-white/80 backdrop-blur-md shadow-lg shadow-slate-200/50 overflow-hidden"
          >
            <button
              onClick={() => toggleMonth(group.key)}
              className="w-full flex items-center justify-between gap-4 px-8 py-6 hover:bg-sky-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-sky-600" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                    {monthLabel}
                  </h2>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {postCount} {postCount === 1 ? (t('updates.calendar.update') || 'update') : (t('updates.calendar.updates') || 'updates')}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-6 w-6 text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-6 w-6 text-slate-400 flex-shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">
                {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((weekNum) => {
                  const weekPosts = group.weeks.get(weekNum) ?? [];
                  const { start, end } = weekDateRange(group.year, group.monthIndex, weekNum);

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
                                className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all px-4 py-3 max-w-full"
                              >
                                <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${categoryDotStyles[post.category] ?? 'bg-slate-400'}`} />
                                <span className={`hidden sm:inline-flex items-center rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${categoryBadgeStyles[post.category] ?? 'bg-slate-500 text-white'}`}>
                                  {t(`updates.categories.${post.category}`)}
                                </span>
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-700 truncate">
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
            )}
          </div>
        );
      })}
    </div>
  );
}
