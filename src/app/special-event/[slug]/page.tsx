import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import { getSpecialEventBySlug } from '@/lib/special-event-content';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface SpecialEventDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function SpecialEventDetailPage({ params }: SpecialEventDetailPageProps) {
  const event = await getSpecialEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <section className="bg-gradient-to-b from-sky-100/80 via-white to-white py-10">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <Link href="/special-event" className="text-sm font-medium text-sky-600 hover:text-sky-800 inline-flex items-center gap-2">
            ← Back to Special Events
          </Link>
          <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-sky-600 font-black">
            {event.dateRange}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-sky-900 mt-4 leading-tight">
            {event.title_en}
          </h1>
          <p className="text-lg text-slate-600 mt-2 italic">
            {event.title_zh}
          </p>
          {event.theme_en && (
            <p className="text-base text-slate-500 mt-4">
              {event.theme_en}
            </p>
          )}
          {event.highlight && (
            <p className="mt-6 text-base text-sky-800 font-semibold leading-relaxed bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-sky-100">
              {event.highlight}
            </p>
          )}
        </div>
      </section>

      <section className="container mx-auto px-6 py-12 space-y-10 flex-grow">
        <Card className="shadow-xl shadow-sky-900/5 border border-sky-100 rounded-[2.5rem]">
          <CardContent className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-sky-600 font-black">Event Detail</p>
              <p className="mt-3 text-slate-600 leading-relaxed text-lg">
                {event.detail || 'No additional background information is currently available.'}
              </p>
            </div>

            {event.schedule && event.schedule.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                {event.schedule.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-sky-100 p-5 bg-sky-50/70">
                    <p className="text-sm uppercase tracking-[0.4em] text-sky-500 font-black">{item.date}</p>
                    <p className="mt-3 text-lg font-semibold text-sky-900">{item.leader}</p>
                  </div>
                ))}
              </div>
            )}

            {event.contentHtml && (
              <article
                className="prose prose-slate prose-sky max-w-none bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
                dangerouslySetInnerHTML={{ __html: event.contentHtml }}
              />
            )}

            {event.attachments && event.attachments.length > 0 && (
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.4em] text-sky-600 font-black">Attachments</p>
                <div className="flex flex-wrap gap-3">
                  {event.attachments.map((file) => (
                    <Link
                      key={file.filename}
                      href={`/api/special-events/attachments/${file.filename}`}
                      className="inline-flex items-center rounded-full border border-sky-100 bg-white px-5 py-2 text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-700 hover:text-white transition"
                    >
                      {file.label_en} / {file.label_zh}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400 font-bold">Published</p>
              <p className="mt-1 text-slate-500">{event.published_at || 'Coming soon'}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </main>
  );
}
