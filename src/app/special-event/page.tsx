'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { TestimonyData } from '@/types/testimony';

const TESTIMONY_STORAGE_BASE = process.env.NEXT_PUBLIC_TESTIMONY_STORAGE_BASE || '/cloud-storage/testimonies';

const schedule = [
  { date: '3/9 (Mon)', leader: '许杭军' },
  { date: '3/10 (Tue)', leader: 'George 牧师' },
  { date: '3/11 (Wed)', leader: '张琨' },
  { date: '3/12 (Thu)', leader: '多牧师' },
  { date: '3/13 (Fri)', leader: '曾华军' },
  { date: '3/14 (Sat)', leader: '罗春花' },
  { date: '3/16 (Mon)', leader: '雁玲' },
  { date: '3/17 (Tue)', leader: '魏牧师' },
  { date: '3/18 (Wed)', leader: '喻牧师' },
  { date: '3/19 (Thu)', leader: '田萍芳' },
  { date: '3/20 (Fri)', leader: '王海红' },
  { date: '3/21 (Sat)', leader: '应岚' },
  { date: '3/23 (Mon)', leader: '许杭军' },
];

const archivedEvents = [
  {
    id: 'evergreen-2026',
    title_en: 'Evergreen Fellowship Gathering',
    title_zh: '常青團契聚會',
    dateRange: 'March 9, 2026',
    highlight: 'Hope gathered around Acts 1:14',
    detail:
      'The Evergreen Fellowship (常青團契) Gathering was a single evening celebration that reflected on Acts 1:14 and Acts 2:1, blessing the church with testimonies of renewal and a charge to keep praying in one accord. Pastor Chunhai Li and the pastoral team welcomed everyone with reminders to keep courage and the Zoom community standing ready for future gatherings.',
  },
];

export default function SpecialEventPage() {
  const { t } = useTranslation('common');
  const [testimonies, setTestimonies] = useState<TestimonyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonies')
      .then((res) => res.json())
      .then((data) => setTestimonies(data))
      .catch(() => setTestimonies([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-gradient-to-b from-sky-100/80 via-white to-white py-8 md:py-10 border-b border-sky-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/70 backdrop-blur-md rounded-full border border-sky-200 mb-4 animate-pulse">
            <div className="h-2 w-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-900">
              {t('specialEvent.title')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-sky-900 leading-tight">
            {t('specialEvent.subtitle')}
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-light text-sky-600/70 italic max-w-2xl mx-auto leading-relaxed px-4">
            {t('specialEvent.theme')}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href="#testimonies"
              className="rounded-3xl bg-sky-700 px-6 py-3 text-base font-semibold uppercase tracking-wider text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-600"
            >
              {t('specialEvent.testimonyCTA')}
            </a>
            <span className="text-sm text-slate-500 italic">{t('specialEvent.testimonySub')}</span>
          </div>
          <div className="max-w-2xl mx-auto pt-8 mt-8 border-t border-sky-100 animate-in fade-in slide-in-from-top-4 duration-1000">
            <p className="text-base sm:text-xl font-light text-slate-500 italic leading-relaxed px-4">
              {t('specialEvent.quote')}
            </p>
            <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-sky-500/60">
              — {t('specialEvent.quoteVerse')}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-8 sm:py-12 flex-grow">
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 text-center">
          <p className="text-lg sm:text-2xl font-light text-sky-900/70 leading-relaxed italic bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-sky-100/50 shadow-sm">
            {t('specialEvent.description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-10">
          <Card className="border-sky-100 bg-white shadow-xl shadow-sky-900/5 rounded-[2rem]">
            <CardContent className="p-8 space-y-6 text-slate-700">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-sky-500 font-bold">{t('specialEvent.renewalTitle')}</p>
                <h3 className="text-3xl font-light tracking-tight text-sky-900 mt-2">{t('specialEvent.renewalTheme')}</h3>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed italic">
                {t('specialEvent.renewalIntro')}
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                  <p className="text-xs uppercase tracking-[0.4em] text-sky-600 font-black">{t('specialEvent.usPrayer')}</p>
                  <p className="text-slate-700 font-medium">{t('specialEvent.usTiming')}</p>
                </div>
                <div className="space-y-2 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                  <p className="text-xs uppercase tracking-[0.4em] text-sky-600 font-black">{t('specialEvent.cnPrayer')}</p>
                  <p className="text-slate-700 font-medium">{t('specialEvent.cnTiming')}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-white p-6 text-sm">
                <p className="font-bold text-sky-900 uppercase tracking-widest text-xs mb-4">{t('specialEvent.scheduleLabel')}</p>
                <div className="mt-3 grid gap-3">
                  {schedule.map((item) => (
                    <div key={item.date} className="flex items-center justify-between border-b border-sky-50 pb-2">
                      <span className="text-slate-500">{item.date}</span>
                      <span className="text-sky-700 font-bold">{item.leader}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-slate-400 font-medium italic">{t('specialEvent.zoomNote')}</p>
                <p className="text-xs text-sky-600 font-bold mt-1 tracking-wide">{t('specialEvent.zoomDetail')}</p>
              </div>
              <p className="text-sm text-sky-500 italic font-medium text-center">{t('specialEvent.renewalFooter')}</p>
            </CardContent>
          </Card>
        </div>

        <section className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h3 className="text-2xl font-light tracking-tight text-sky-900">{t('specialEvent.archivedTitle')}</h3>
            <p className="text-sm text-slate-500 italic">{t('specialEvent.archivedLead')}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {archivedEvents.map((event) => (
              <details
                key={event.id}
                className="group rounded-[2rem] border border-sky-100 bg-white shadow-lg transition-all hover:border-sky-300 hover:shadow-xl"
              >
                <summary className="cursor-pointer list-none">
                  <div className="rounded-[1.8rem] bg-sky-50/50 p-6 text-sky-900 transition-all group-open:bg-sky-100/50">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-sky-600 font-black">{event.dateRange}</p>
                    <h3 className="text-xl font-light tracking-tight mt-3 text-sky-900">{event.title_en}</h3>
                    <p className="text-sm text-sky-700/70 font-medium">{event.title_zh}</p>
                    <p className="mt-4 text-sm text-slate-600 italic leading-relaxed">{event.highlight}</p>
                  </div>
                </summary>
                <div className="px-6 py-6 text-sm text-slate-600 leading-relaxed border-t border-sky-50">
                  <p>{event.detail}</p>
                  <div className="mt-6 flex justify-end">
                    <a
                      href="#testimonies"
                      className="inline-flex items-center text-sm font-bold text-sky-600 hover:text-sky-800 transition-colors"
                    >
                      {t('specialEvent.archivedMore')} →
                    </a>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>

      <section id="testimonies" className="bg-gradient-to-b from-white to-sky-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm uppercase tracking-[0.5em] text-sky-600 mb-4 font-bold">{t('specialEvent.testimonyTitle')}</p>
            <h2 className="text-4xl font-light tracking-tight text-sky-900">{t('specialEvent.testimonySub')}</h2>
            <p className="mt-4 text-lg text-slate-500 italic leading-relaxed">
              {t('specialEvent.testimonyIntro')}
            </p>
          </div>

          <div className="mt-12 space-y-10">
            {isLoading ? (
              <p className="text-center text-slate-400">Loading testimonies…</p>
            ) : testimonies.length === 0 ? (
              <div className="rounded-[2rem] border border-sky-100 bg-white/50 p-10 text-center shadow-sm">
                <p className="text-xl font-semibold text-sky-900">见证正在准备中</p>
                <p className="mt-2 text-slate-500">敬请期待更多故事加入云端。</p>
              </div>
            ) : (
              testimonies.map((story) => (
                <article key={story.id} className="rounded-[2.5rem] border border-sky-100 bg-white p-8 md:p-10 shadow-xl shadow-sky-900/5 transition-all hover:shadow-2xl hover:shadow-sky-900/10">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-sky-500 font-bold mb-2">{story.published_at || '2026-03-09'}</p>
                      <h3 className="text-3xl font-light text-sky-900 tracking-tight">{story.title_en}</h3>
                      <p className="text-xl font-medium text-sky-700/80 mt-1">{story.title_zh}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(story.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-[10px] uppercase tracking-widest text-sky-600 font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 grid gap-10 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black">English reflection</h4>
                      <div
                        className="prose prose-slate prose-sky max-w-none text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: story.contentHtml_en }}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black">中文感恩分享</h4>
                      <div
                        className="prose prose-slate prose-sky max-w-none text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: story.contentHtml_zh }}
                      />
                    </div>
                  </div>

                  {(story.materials ?? []).length > 0 && (
                    <div className="mt-8 rounded-2xl border border-sky-50 bg-sky-50/50 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-sky-600 font-black mb-4">Resources & Materials</p>
                      <div className="flex flex-wrap gap-3">
                        {story.materials!.map((material) => (
                          <a
                            key={material.file}
                            href={`${TESTIMONY_STORAGE_BASE}/${material.file}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center rounded-full bg-white border border-sky-100 px-5 py-2 text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-700 hover:text-white hover:border-sky-700 transition-all"
                          >
                            {material.label_en} / {material.label_zh}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {story.scripture && story.scripture.length > 0 && (
                    <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-black mb-4">Scripture</p>
                      <div className="space-y-6">
                        {story.scripture.map((verse) => (
                          <div key={verse.verse} className="border-l-2 border-sky-200 pl-4">
                            <p className="text-sm font-bold text-sky-900 mb-2">{verse.verse}</p>
                            <p className="text-slate-600 italic leading-relaxed">{verse.text_en}</p>
                            <p className="mt-2 text-sky-800 leading-relaxed font-medium">{verse.text_zh}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold italic">{story.author}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
