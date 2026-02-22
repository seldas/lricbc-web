'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Info, User, Mic2, HeartHandshake } from "lucide-react";

export default function SpecialEventPage() {
  const { t } = useTranslation('common');

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-b from-sky-100/60 to-white py-8 md:py-10 border-b border-sky-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/40 backdrop-blur-md rounded-full border border-sky-200 mb-4 animate-pulse">
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

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-none bg-white shadow-2xl rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden">
            <CardHeader className="bg-sky-500 text-white p-8 sm:p-12 text-center">
              <CardTitle className="text-3xl sm:text-4xl font-light tracking-[0.1em] uppercase mb-4">
                {t('specialEvent.subtitle')}
              </CardTitle>
              <CardDescription className="text-sky-100 text-lg font-light italic">
                {t('specialEvent.theme')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 sm:p-12 space-y-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-50 p-3 rounded-full text-sky-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sky-900 uppercase tracking-wider text-sm mb-1">{t('specialEvent.dateLabel')}</h4>
                    <p className="text-slate-600 font-light">{t('specialEvent.date')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-50 p-3 rounded-full text-sky-500">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sky-900 uppercase tracking-wider text-sm mb-1">{t('specialEvent.timeLabel')}</h4>
                    <p className="text-slate-600 font-light">{t('specialEvent.time')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-50 p-3 rounded-full text-sky-500">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sky-900 uppercase tracking-wider text-sm mb-1">{t('specialEvent.locationLabel')}</h4>
                    <p className="text-slate-600 font-light">{t('specialEvent.location')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-sky-50 p-3 rounded-full text-sky-500">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sky-900 uppercase tracking-wider text-sm mb-1">{t('specialEvent.contactLabel')}</h4>
                    <p className="text-slate-600 font-light">{t('specialEvent.contact')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 md:col-span-2">
                  <div className="bg-sky-50 p-3 rounded-full text-sky-500">
                    <Mic2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sky-900 uppercase tracking-wider text-sm mb-1">{t('specialEvent.speakersLabel')}</h4>
                    <p className="text-slate-600 font-light">{t('specialEvent.speakers')}</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-sky-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <HeartHandshake className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-light text-sky-900 uppercase tracking-widest">
                    {t('specialEvent.prayerTitle')}
                  </h3>
                </div>
                <p className="text-lg font-light text-slate-500 leading-relaxed italic bg-amber-50/30 p-8 rounded-[2rem] border border-amber-100/50">
                  {t('specialEvent.prayerPoints')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
