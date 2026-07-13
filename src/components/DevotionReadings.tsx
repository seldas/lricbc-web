'use client';

import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { parseLocalDate } from "@/lib/utils";
import { getReadingsForDate, getWeekSunday } from "@/lib/rcl";
import { buildBibleGatewayUrl } from "@/lib/bible-link";
import { translateReference } from "@/lib/bible-book-names-zh";

export default function DevotionReadings({ initialDate }: { initialDate: string }) {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language === 'en' ? 'en' : 'zh';
  const locale = i18n.language === 'en' ? 'en-US' : 'zh-CN';

  const [anchorDate, setAnchorDate] = useState(() => getWeekSunday(parseLocalDate(initialDate)));

  const result = useMemo(() => getReadingsForDate(anchorDate), [anchorDate]);

  const weekLabel = anchorDate.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });

  const goPrevWeek = () => {
    setAnchorDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const goNextWeek = () => {
    setAnchorDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const readingRows = result
    ? [
        { label: t('devotion.labels.ot'), ref: result.readings.ot },
        { label: t('devotion.labels.psalm'), ref: result.readings.psalm },
        { label: t('devotion.labels.epistle'), ref: result.readings.epistle },
        { label: t('devotion.labels.gospel'), ref: result.readings.gospel },
      ].map(row => ({ ...row, displayRef: lang === 'zh' ? translateReference(row.ref) : row.ref }))
    : [];

  return (
    <>
      <section className="bg-gradient-to-b from-sky-100/60 to-white py-8 md:py-10 border-b border-sky-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/40 backdrop-blur-md rounded-full border border-sky-200 mb-4 animate-pulse">
            <div className="h-2 w-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-900">
              {t('nav.devotion')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-sky-900 leading-tight">
            {t('devotion.title')}
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-light text-sky-600/70 italic max-w-2xl mx-auto leading-relaxed px-4">
            {t('devotion.subtitle')}
          </p>

          <div className="max-w-2xl mx-auto pt-8 mt-8 border-t border-sky-100 animate-in fade-in slide-in-from-top-4 duration-1000">
            <p className="text-base sm:text-xl font-light text-slate-500 italic leading-relaxed px-4">
              {t('devotion.quote')}
            </p>
            <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-sky-500/60">
              — {t('devotion.quoteVerse')}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-2xl mx-auto">
          {/* Week Navigator */}
          <div className="flex items-center justify-center gap-6 mb-10">
            <button
              onClick={goPrevWeek}
              aria-label={t('devotion.prevWeek')}
              className="h-12 w-12 flex items-center justify-center rounded-full border border-sky-100 bg-white/70 hover:bg-sky-50 transition-colors shadow-sm"
            >
              <ChevronLeft className="h-5 w-5 text-sky-700" />
            </button>
            <div className="text-center min-w-[16rem]">
              <p className="text-xs font-black uppercase tracking-widest text-sky-500">
                {t('devotion.weekOf')}
              </p>
              <p className="text-xl font-semibold text-slate-900">{weekLabel}</p>
            </div>
            <button
              onClick={goNextWeek}
              aria-label={t('devotion.nextWeek')}
              className="h-12 w-12 flex items-center justify-center rounded-full border border-sky-100 bg-white/70 hover:bg-sky-50 transition-colors shadow-sm"
            >
              <ChevronRight className="h-5 w-5 text-sky-700" />
            </button>
          </div>

          {!result ? (
            <p className="text-center text-slate-400 italic">{t('devotion.noReadings')}</p>
          ) : (
            <div className="rounded-[2.5rem] border border-slate-100 bg-white/80 backdrop-blur-md shadow-lg shadow-slate-200/50 overflow-hidden">
              <div className="px-8 py-6 bg-sky-50/60 border-b border-slate-100 flex items-center justify-end">
                <span className="inline-flex items-center rounded-full bg-sky-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest">
                  {t('devotion.yearLabel')} {result.yearLetter}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {readingRows.map((row) => (
                  <a
                    key={row.label}
                    href={buildBibleGatewayUrl(row.ref, lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 px-8 py-5 hover:bg-sky-50/60 transition-colors"
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-sky-500">{row.label}</p>
                      <p className="text-base font-semibold text-slate-800 group-hover:text-sky-700">{row.displayRef}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-sky-500 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-slate-400">
            {t('devotion.source')}
          </p>
        </div>
      </section>
    </>
  );
}
