'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { TestimonyData } from '@/types/testimony';
import { SpecialEvent } from '@/types/special-event';
import { OutreachReport } from '@/types/outreach-report';

const TESTIMONY_STORAGE_BASE = process.env.NEXT_PUBLIC_TESTIMONY_STORAGE_BASE || '/cloud-storage/testimonies';

export default function SpecialEventPage() {
  const { t } = useTranslation('common');
  const [testimonies, setTestimonies] = useState<TestimonyData[]>([]);
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [outreachReports, setOutreachReports] = useState<OutreachReport[]>([]);
  const [isOutreachLoading, setIsOutreachLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimoniesRes, eventsRes] = await Promise.all([
          fetch('/api/testimonies'),
          fetch('/api/special-events')
        ]);
        
        const testimoniesData = await testimoniesRes.json();
        const eventsData = await eventsRes.json();
        
        setTestimonies(testimoniesData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchOutreach = async () => {
      try {
        const outreachRes = await fetch('/api/outreach');
        if (!outreachRes.ok) {
          throw new Error('Unable to load outreach reports');
        }
        const outreachData: OutreachReport[] = await outreachRes.json();
        if (isMounted) {
          setOutreachReports(outreachData);
        }
      } catch (error) {
        console.error('Error fetching outreach reports:', error);
      } finally {
        if (isMounted) {
          setIsOutreachLoading(false);
        }
      }
    };

    fetchOutreach();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeEvent = events.find(e => e.is_active) || events[0];
  const archivedEvents = events.filter(e => e.id !== activeEvent?.id && e.id !== 'stay-tuned');
  const outreachArchiveLink = process.env.NEXT_PUBLIC_OUTREACH_ARCHIVE_LINK || '/outreach';
  const featuredReport = outreachReports.find((report) => report.featured) || outreachReports[0];
  const remainingReports = outreachReports.filter((report) => report.id !== featuredReport?.id);
  const listReports = remainingReports.slice(0, 5);
  const hasMoreReports = outreachReports.length > (featuredReport ? 1 : 0) + listReports.length;
  const getReportSummary = (report: OutreachReport) => report.summary_en ?? report.summary_zh ?? report.summary ?? '';
  const buildReportLink = (report: OutreachReport) => report.external_link || `/outreach/${report.slug}`;
  const formatPublishedDate = (value: string) => {
    if (!value) {
      return '';
    }
    try {
      return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
    } catch {
      return value;
    }
  };

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
            {activeEvent?.title_en || t('specialEvent.subtitle')}
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-light text-sky-600/70 italic max-w-2xl mx-auto leading-relaxed px-4">
            {activeEvent?.theme_en || t('specialEvent.theme')}
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
        {isLoading ? (
          <div className="flex justify-center py-20">
            <p className="text-slate-400">Loading special events...</p>
          </div>
        ) : activeEvent ? (
          <>
            <div className="max-w-4xl mx-auto mb-12 sm:mb-16 text-center">
              <p className="text-lg sm:text-2xl font-light text-sky-900/70 leading-relaxed italic bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-sky-100/50 shadow-sm">
                {activeEvent.detail || activeEvent.highlight}
              </p>
            </div>

            {activeEvent.schedule && (
              <div className="max-w-4xl mx-auto mb-10">
                <Card className="border-sky-100 bg-white shadow-xl shadow-sky-900/5 rounded-[2rem]">
                  <CardContent className="p-8 space-y-6 text-slate-700">
                    <div>
                      <p className="text-sm uppercase tracking-[0.4em] text-sky-500 font-bold">{activeEvent.renewalTitle || t('specialEvent.renewalTitle')}</p>
                      <h3 className="text-3xl font-light tracking-tight text-sky-900 mt-2">{activeEvent.renewalTheme || t('specialEvent.renewalTheme')}</h3>
                    </div>
                    <p className="text-lg text-slate-600 leading-relaxed italic">
                      {activeEvent.renewalIntro || t('specialEvent.renewalIntro')}
                    </p>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                        <p className="text-xs uppercase tracking-[0.4em] text-sky-600 font-black">{activeEvent.usPrayer || t('specialEvent.usPrayer')}</p>
                        <p className="text-slate-700 font-medium">{activeEvent.usTiming || t('specialEvent.usTiming')}</p>
                      </div>
                      <div className="space-y-2 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                        <p className="text-xs uppercase tracking-[0.4em] text-sky-600 font-black">{activeEvent.cnPrayer || t('specialEvent.cnPrayer')}</p>
                        <p className="text-slate-700 font-medium">{activeEvent.cnTiming || t('specialEvent.cnTiming')}</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-sky-100 bg-white p-6 text-sm">
                      <p className="font-bold text-sky-900 uppercase tracking-widest text-xs mb-4">{t('specialEvent.scheduleLabel')}</p>
                      <div className="mt-3 grid gap-3">
                        {activeEvent.schedule.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between border-b border-sky-50 pb-2">
                            <span className="text-slate-500">{item.date}</span>
                            <span className="text-sky-700 font-bold">{item.leader}</span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-6 text-xs text-slate-400 font-medium italic">{activeEvent.zoomNote || t('specialEvent.zoomNote')}</p>
                      <p className="text-xs text-sky-600 font-bold mt-1 tracking-wide">{activeEvent.zoomDetail || t('specialEvent.zoomDetail')}</p>
                    </div>
                    <p className="text-sm text-sky-500 italic font-medium text-center">{activeEvent.renewalFooter || t('specialEvent.renewalFooter')}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeEvent.contentHtml && (
              <div className="max-w-4xl mx-auto mb-16">
                <article 
                  className="prose prose-slate prose-sky max-w-none bg-white p-8 md:p-12 rounded-[2rem] border border-sky-100 shadow-sm"
                  dangerouslySetInnerHTML={{ __html: activeEvent.contentHtml }}
                />
              </div>
            )}

            {activeEvent.attachments && activeEvent.attachments.length > 0 && (
              <div className="max-w-4xl mx-auto mb-16">
                <div className="bg-sky-50/50 rounded-[2rem] border border-sky-100 p-8">
                  <h4 className="text-xs uppercase tracking-[0.3em] text-sky-600 font-black mb-6">Downloadable Resources</h4>
                  <div className="flex flex-wrap gap-4">
                    {activeEvent.attachments.map((file, idx) => (
                      <a
                        key={idx}
                        href={`/api/special-events/attachments/${file.filename}`}
                        className="inline-flex items-center gap-2 bg-white border border-sky-200 px-6 py-3 rounded-full text-sky-700 font-bold hover:bg-sky-700 hover:text-white hover:border-sky-700 transition-all shadow-sm"
                        download
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="浸4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {file.label_zh} / {file.label_en}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <p className="text-slate-500">No active special events at this time.</p>
          </div>
        )}

        {archivedEvents.length > 0 && (
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
                  <div className="px-6 py-6 text-sm text-slate-600 leading-relaxed border-t border-sky-50 space-y-6">
                    <div className="space-y-3">
                      <p className="text-slate-600 leading-relaxed">{event.detail}</p>
                      {event.theme_en && <p className="text-sm font-semibold text-sky-700">{event.theme_en}</p>}
                    </div>
                    {event.schedule && event.schedule.length > 0 && (
                      <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-sky-500 font-bold mb-3">{t('specialEvent.scheduleLabel')}</p>
                        <div className="grid gap-3">
                          {event.schedule.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-slate-700">
                              <span className="font-semibold">{item.date}</span>
                              <span className="text-sm text-sky-700">{item.leader}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.contentHtml && (
                      <article
                        className="prose prose-slate prose-sky max-w-none bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
                        dangerouslySetInnerHTML={{ __html: event.contentHtml }}
                      />
                    )}
                    {event.attachments && event.attachments.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-sky-500 font-bold">Attachments</p>
                        <div className="flex flex-wrap gap-3">
                          {event.attachments.map((file) => (
                            <Link
                              key={file.filename}
                              href={`/api/special-events/attachments/${file.filename}`}
                              className="inline-flex items-center rounded-full border border-sky-100 bg-white px-4 py-2 text-xs font-medium text-sky-700 shadow-sm hover:border-sky-600 hover:text-sky-900 transition"
                            >
                              {file.label_en} / {file.label_zh}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}
      </section>

      <section className="bg-slate-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto mb-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.6em] text-sky-600 font-black">{t('specialEvent.outreachTitle')}</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-light text-sky-900">{t('specialEvent.outreachSubtitle')}</h2>
          </div>
          {isOutreachLoading ? (
            <div className="flex justify-center py-12">
              <p className="text-slate-400">{t('specialEvent.outreachLoading')}</p>
            </div>
          ) : outreachReports.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-100 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-700">{t('specialEvent.outreachEmpty')}</p>
              <p className="mt-2 text-sm text-slate-500">{t('specialEvent.outreachEmptySub')}</p>
            </div>
          ) : (
            <>
              {featuredReport && (
                <article className="group relative overflow-hidden rounded-[2.5rem] border border-sky-100 bg-gradient-to-br from-white to-slate-50 p-8 shadow-xl">
                  {featuredReport.cover_image && (
                    <div
                      className="pointer-events-none absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url(${featuredReport.cover_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                  <div className="relative space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.6em] text-sky-600 font-black">
                      {t('specialEvent.outreachFeatured')}
                    </p>
                    <h3 className="text-3xl font-light text-sky-900">
                      {featuredReport.title_en || featuredReport.title_zh}
                    </h3>
                    <p className="text-base text-slate-600 max-w-3xl">
                      {getReportSummary(featuredReport)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                      <span>{formatPublishedDate(featuredReport.published_at)}</span>
                      <div className="flex flex-wrap gap-2">
                        {featuredReport.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-sky-100 bg-white/70 px-3 py-1 text-[10px] font-semibold text-sky-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <a
                        href={buildReportLink(featuredReport)}
                        className="inline-flex items-center justify-center rounded-full border border-sky-600/60 bg-sky-600/10 px-6 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-600 hover:text-white"
                        target={featuredReport.external_link ? '_blank' : '_self'}
                        rel={featuredReport.external_link ? 'noreferrer' : undefined}
                      >
                        {t('specialEvent.outreachReadMore')}
                      </a>
                    </div>
                  </div>
                </article>
              )}

              {listReports.length > 0 && (
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  {listReports.map((report) => {
                    const href = buildReportLink(report);
                    const isExternal = Boolean(report.external_link);
                    return (
                      <article
                        key={report.id}
                        className="rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-lg"
                      >
                        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                          <span>{formatPublishedDate(report.published_at)}</span>
                          <div className="flex flex-wrap gap-2">
                            {report.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-sky-100 px-3 py-1 text-[10px] font-semibold text-sky-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <h4 className="text-2xl font-semibold text-sky-900">
                          {report.title_en || report.title_zh}
                        </h4>
                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                          {getReportSummary(report)}
                        </p>
                        <div className="mt-5 text-right">
                          <a
                            href={href}
                            className="text-sm font-semibold text-sky-600 transition hover:text-sky-800"
                            target={isExternal ? '_blank' : '_self'}
                            rel={isExternal ? 'noreferrer' : undefined}
                          >
                            {t('specialEvent.outreachReadMore')}
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {hasMoreReports && (
                <div className="mt-10 text-center">
                  <a
                    href={outreachArchiveLink}
                    className="text-sm font-semibold uppercase tracking-[0.4em] text-sky-600"
                  >
                    {t('specialEvent.outreachMore')}
                  </a>
                </div>
              )}
            </>
          )}
        </div>
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
