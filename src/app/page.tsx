'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />

      {/* Slogan Section */}
      <section className="relative py-32 overflow-hidden bg-sky-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <h2 className="text-5xl md:text-8xl font-bold tracking-[0.2em] leading-tight animate-in fade-in slide-in-from-bottom-10 duration-1000 uppercase">
              {t('about.slogan')}
            </h2>
            <div className="h-1 w-40 bg-sky-400 mx-auto rounded-full" />
            <p className="text-xl md:text-2xl font-light text-sky-200 tracking-widest uppercase">
              Little Rock Immanuel Chinese Baptist Church
            </p>
          </div>
        </div>
      </section>
      
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
      <section className="container mx-auto px-4 py-24">
        <div className="grid gap-16 md:grid-cols-3">
          <div className="space-y-6 text-center group">
            <div className="h-2 w-12 bg-sky-200 mx-auto transition-all group-hover:w-24 group-hover:bg-sky-400" />
            <h3 className="text-3xl font-light tracking-widest uppercase text-sky-900">{t('nav.updates')}</h3>
            <p className="text-sky-700/60 font-light leading-relaxed">
              Stay informed with the latest messages from our pastor and church announcements.
            </p>
          </div>
          <div className="space-y-6 text-center group">
            <div className="h-2 w-12 bg-sky-200 mx-auto transition-all group-hover:w-24 group-hover:bg-sky-400" />
            <h3 className="text-3xl font-light tracking-widest uppercase text-sky-900">{t('nav.gallery')}</h3>
            <p className="text-sky-700/60 font-light leading-relaxed">
              Explore memories from our retreats, holiday celebrations, and fellowship gatherings.
            </p>
          </div>
          <div className="space-y-6 text-center group">
            <div className="h-2 w-12 bg-sky-200 mx-auto transition-all group-hover:w-24 group-hover:bg-sky-400" />
            <h3 className="text-3xl font-light tracking-widest uppercase text-sky-900">{t('nav.giving')}</h3>
            <p className="text-sky-700/60 font-light leading-relaxed">
              Support our mission and ministry through online giving and other contributions.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
