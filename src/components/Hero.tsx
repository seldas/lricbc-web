'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Hero() {
  const { t } = useTranslation('common');

  return (
    <section className="relative flex min-h-[95vh] items-center justify-center overflow-hidden">
      {/* Radiant Sky Blue Background Effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-100/60 via-white to-sky-50" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-400/20 rounded-full blur-[120px] float" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300/20 rounded-full blur-[100px] float" style={{ animationDelay: '3s' }} />

      <div className="container relative z-10 mx-auto px-4 py-24 text-center">
        <div className="inline-block px-12 py-4 mb-16 text-lg md:text-xl font-bold tracking-[0.4em] text-sky-700 uppercase bg-white/80 backdrop-blur-xl rounded-full border border-sky-200 shadow-xl hover:shadow-sky-200/50 transition-all cursor-default">
          <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            {t('about.slogan')}
          </span>
        </div>
        <h1 className="mb-10 text-7xl font-light tracking-tight md:text-[10rem] text-sky-900 leading-[1.05]">
          {t('hero.title').split(' ').map((word, i) => (
            <span key={i} className={word === 'Immanuel' || word === '以馬內利' ? 'text-sky-600 font-normal' : ''}>
              {word}{' '}
            </span>
          ))}
        </h1>
        <p className="mx-auto mb-16 max-w-4xl text-2xl text-sky-800/60 md:text-5xl font-light italic leading-tight">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col justify-center gap-10 sm:flex-row">
          <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700 text-white rounded-full px-16 py-10 text-2xl font-medium heavenly-glow transition-all hover:scale-105 shadow-2xl">
            <Link href="/contact">
              {t('hero.cta')}
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="bg-white/60 backdrop-blur-xl hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-full px-16 py-10 text-2xl font-light transition-all">
            <Link href="/about">
              {t('nav.about')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
