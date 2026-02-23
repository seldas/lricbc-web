'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const { t } = useTranslation('common');

  return (
    <section className="relative flex min-h-[95vh] items-center justify-center overflow-hidden">
      {/* Cinematic Static Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/home_background_2026.JPG"
          alt="Church Background"
          fill
          className="object-cover scale-105 animate-subtle-zoom"
          priority
        />
        {/* Elegant Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/40 via-sky-900/20 to-sky-950/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      </div>

      {/* Radiant Background Effects (Original style preserved but softened) */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-400/10 rounded-full blur-[120px] float" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300/10 rounded-full blur-[100px] float" style={{ animationDelay: '3s' }} />

      <div className="container relative z-10 mx-auto px-1 py-12 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="mb-8 flex justify-center relative group">
          {/* Radiant Growing Light Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-sky-400/30 rounded-full blur-[80px] animate-pulse pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/40 rounded-full blur-[40px] animate-pulse pointer-events-none" style={{ animationDuration: '3s' }} />
          
          <div className="relative h-36 w-72 sm:h-32 sm:w-64 md:h-[21rem] md:w-[88rem] transition-transform duration-700 hover:scale-105">
            <Image 
              src="/logo/LRICBC_Logo_v4_NameBottom-scaled.png" 
              alt="LRICBC Logo" 
              fill 
              className="object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]"
              priority
            />
          </div>
        </div>
        <div className="inline-block px-6 py-2 sm:px-10 sm:py-3 mb-8 text-sm sm:text-lg md:text-xl font-bold tracking-[0.2em] sm:tracking-[0.4em] text-white uppercase bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-2xl hover:shadow-sky-400/50 transition-all cursor-default">
          <span className="text-white drop-shadow-sm">
            {t('about.slogan')}
          </span>
        </div>
        <p className="mx-auto mb-10 max-w-4xl text-xl sm:text-2xl text-white md:text-4xl font-light italic leading-tight drop-shadow-lg px-4">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col justify-center gap-4 sm:gap-8 sm:flex-row px-6 sm:px-0">
          <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-8 py-6 sm:px-16 sm:py-10 text-xl sm:text-2xl font-medium heavenly-glow transition-all hover:scale-105 shadow-2xl">
            <Link href="/about">
              {t('hero.cta')}
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white border border-white/40 rounded-full px-16 py-10 text-2xl font-light transition-all">
            <Link href="/about">
              {t('nav.about')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
