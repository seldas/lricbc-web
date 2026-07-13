'use client';

import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ExternalLink } from "lucide-react";
import { parseLocalDate } from "@/lib/utils";
import { getReadingsForDate, getWeekSunday } from "@/lib/rcl";
import { buildBibleGatewayUrl } from "@/lib/bible-link";
import { translateReference } from "@/lib/bible-book-names-zh";

type VerseEntry = { verse: number; text: string };
type ReadingText = { en: VerseEntry[][]; zh: VerseEntry[][] };
type ReadingTextData = Record<string, ReadingText | null>;

// Psalms read as poetry - one verse per line. Everything else reads as
// prose - verses flow together within a paragraph, each marked with a
// small superscript number. Either way, each block is a separate passage
// (see parse-reference.ts) and gets its own paragraph spacing.
function ReadingPassage({ blocks, isPsalm }: { blocks: VerseEntry[][]; isPsalm: boolean }) {
  if (isPsalm) {
    return (
      <div className="space-y-4">
        {blocks.map((block, i) => (
          <div key={i} className="space-y-1">
            {block.map((v, vi) => (
              <p key={vi} className="flex gap-2 text-sm sm:text-base leading-relaxed text-slate-600">
                <span className="w-5 flex-shrink-0 text-right text-[10px] font-bold text-sky-500 mt-1">{v.verse}</span>
                <span>{v.text}</span>
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <p key={i} className="text-sm sm:text-base leading-relaxed text-slate-600">
          {block.map((v, vi) => (
            <span key={vi}>
              <sup className="mr-0.5 text-[10px] font-bold text-sky-500">{v.verse}</sup>
              {v.text}{' '}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export default function DevotionReadings({ initialDate }: { initialDate: string }) {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language === 'en' ? 'en' : 'zh';
  const locale = i18n.language === 'en' ? 'en-US' : 'zh-CN';

  const [anchorDate, setAnchorDate] = useState(() => getWeekSunday(parseLocalDate(initialDate)));
  const [expandedRefs, setExpandedRefs] = useState<Set<string>>(new Set());
  const [textData, setTextData] = useState<ReadingTextData | null>(null);

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

  const toggleExpand = async (ref: string) => {
    if (!textData) {
      const mod = await import('@/data/rcl-readings-text.json');
      setTextData(mod.default as ReadingTextData);
    }
    setExpandedRefs(prev => {
      const next = new Set(prev);
      if (next.has(ref)) next.delete(ref);
      else next.add(ref);
      return next;
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
          <div className="flex items-center justify-center gap-6 mb-6">
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

          {result && (
            <p className="text-center text-xs text-slate-400 mb-6">
              {t('devotion.versionNote')}
            </p>
          )}

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
                {readingRows.map((row) => {
                  const isExpanded = expandedRefs.has(row.ref);
                  const text = textData?.[row.ref];
                  const bibleGatewayUrl = buildBibleGatewayUrl(row.ref, lang);
                  const isPsalm = /^Psalm\b/.test(row.ref);
                  return (
                    <div key={row.label} className="px-8 py-5">
                      <button
                        onClick={() => toggleExpand(row.ref)}
                        className="group flex w-full items-center justify-between gap-4 text-left"
                      >
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-sky-500">{row.label}</p>
                          <p className="text-base font-semibold text-slate-800 group-hover:text-sky-700">{row.displayRef}</p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-slate-300 group-hover:text-sky-500 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          {text ? (
                            <ReadingPassage blocks={text[lang]} isPsalm={isPsalm} />
                          ) : (
                            <p className="text-sm text-slate-400 italic">{t('devotion.textUnavailable')}</p>
                          )}
                          <a
                            href={bibleGatewayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
                          >
                            {t('devotion.viewOnBibleGateway')}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
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
