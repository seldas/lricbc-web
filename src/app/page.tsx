'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import LatestAnnouncement from "@/components/LatestAnnouncement";
import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      
      {/* Pastor's Welcome Message */}
      <section className="py-24 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-4xl text-center space-y-10">
          <Quote className="h-12 w-12 text-sky-300 mx-auto opacity-50" />
          
          <div className="space-y-6">
            <p className="text-2xl md:text-3xl font-light leading-relaxed text-sky-900 italic">
              {t('welcome.quote')}
            </p>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-sky-800/80">
              {t('welcome.invitation')}
            </p>
          </div>

          <div className="pt-6 flex flex-col items-center">
            <div className="h-px w-20 bg-sky-200 mb-6" />
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-sky-100 shadow-sm">
                <Image 
                  src="/chunhai.png" 
                  alt={t('welcome.signature')}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-2xl font-medium text-sky-600 tracking-widest uppercase">
                {t('welcome.signature')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections Preview */}
      <section className="container mx-auto px-4 py-32">
        <div className="grid gap-16 md:grid-cols-3">
          <Link href="/updates" className="space-y-8 text-center group cursor-pointer p-8 rounded-[3rem] hover:bg-white/50 transition-all">
            <div className="h-2 w-12 bg-sky-200 mx-auto transition-all group-hover:w-24 group-hover:bg-sky-400 rounded-full" />
            <h3 className="text-4xl font-light tracking-widest uppercase text-sky-900 transition-colors group-hover:text-primary">{t('nav.updates')}</h3>
            <p className="text-sky-700/60 font-light leading-relaxed text-lg">
              Stay informed with the latest messages from our pastor and church announcements.
            </p>
            <div className="text-primary font-bold uppercase tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              View Updates →
            </div>
          </Link>

          <Link href="/gallery" className="space-y-8 text-center group cursor-pointer p-8 rounded-[3rem] hover:bg-white/50 transition-all">
            <div className="h-2 w-12 bg-sky-200 mx-auto transition-all group-hover:w-24 group-hover:bg-sky-400 rounded-full" />
            <h3 className="text-4xl font-light tracking-widest uppercase text-sky-900 transition-colors group-hover:text-primary">{t('nav.gallery')}</h3>
            <p className="text-sky-700/60 font-light leading-relaxed text-lg">
              Explore memories from our retreats, holiday celebrations, and fellowship gatherings.
            </p>
            <div className="text-primary font-bold uppercase tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              View Gallery →
            </div>
          </Link>

          <Link href="/giving" className="space-y-8 text-center group cursor-pointer p-8 rounded-[3rem] hover:bg-white/50 transition-all">
            <div className="h-2 w-12 bg-sky-200 mx-auto transition-all group-hover:w-24 group-hover:bg-sky-400 rounded-full" />
            <h3 className="text-4xl font-light tracking-widest uppercase text-sky-900 transition-colors group-hover:text-primary">{t('nav.giving')}</h3>
            <p className="text-sky-700/60 font-light leading-relaxed text-lg">
              Support our mission and ministry through online giving and other contributions.
            </p>
            <div className="text-primary font-bold uppercase tracking-widest text-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              Support Now →
            </div>
          </Link>
        </div>
      </section>

      <LatestAnnouncement />
      <Footer />
    </main>
  );
}
