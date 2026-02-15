'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, History, Target, Heart, BookOpen, Download } from "lucide-react";

export default function AboutPage() {
  const { t, i18n } = useTranslation('common');
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  const missionPoints = t('about.mission.points', { returnObjects: true }) as string[];
  const coreValues = t('about.values.list', { returnObjects: true }) as string[];
  const historyItems = t('about.history.items', { returnObjects: true }) as {year: string, text: string}[];
  const beliefs = t('about.faith.beliefs', { returnObjects: true }) as {title: string, content: string}[];

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Cinematic Hero */}
      <section className="bg-gradient-to-b from-sky-200/80 via-sky-100/40 to-white py-40">
        <div className="container mx-auto px-4 text-center space-y-12">
          <h1 className="text-8xl md:text-[12rem] font-light tracking-tighter text-sky-950 leading-none animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {t('about.title')}
          </h1>
          <div className="h-1.5 w-32 bg-sky-500 mx-auto rounded-full" />
          <p className="text-4xl md:text-6xl font-light text-sky-800/80 italic max-w-5xl mx-auto leading-tight tracking-tight">
            "{t('about.slogan')}"
          </p>
        </div>
      </section>

      {/* Vision & Mission - High Impact */}
      <section className="container mx-auto px-4 py-32">
        <div className="grid gap-20 lg:grid-cols-2 items-start">
          {/* Vision */}
          <div className="space-y-10 group">
            <div className="flex items-center gap-6 text-sky-600">
              <div className="p-5 bg-sky-100 rounded-3xl group-hover:scale-110 transition-transform duration-500">
                <Target className="h-12 w-12" />
              </div>
              <h2 className="text-5xl font-black tracking-widest uppercase">{t('about.vision.title')}</h2>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-sky-500/5 rounded-[3rem] blur-2xl" />
              <p className="relative text-3xl md:text-4xl text-sky-900 leading-relaxed bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] border-2 border-sky-100 shadow-2xl italic font-light">
                {t('about.vision.content')}
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="space-y-10">
            <div className="flex items-center gap-6 text-sky-600">
              <div className="p-5 bg-sky-100 rounded-3xl">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h2 className="text-5xl font-black tracking-widest uppercase">{t('about.mission.title')}</h2>
            </div>
            <div className="grid gap-6">
              {Array.isArray(missionPoints) && missionPoints.map((point, i) => (
                <div key={i} className="flex items-center gap-6 p-8 bg-white/60 border-2 border-sky-50 rounded-[2.5rem] shadow-lg hover:border-sky-200 transition-all hover:translate-x-2 group">
                  <div className="h-4 w-4 rounded-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)] group-hover:scale-150 transition-transform" />
                  <span className="text-2xl md:text-3xl font-medium text-sky-950">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values - Full Color Immersion */}
      <section className="bg-sky-900 text-white py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-800 via-sky-950 to-sky-950 opacity-50" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-20 space-y-6">
            <Heart className="h-16 w-16 mx-auto text-sky-400 animate-pulse" />
            <h2 className="text-5xl font-black tracking-[0.4em] uppercase text-sky-200">{t('about.values.title')}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.isArray(coreValues) && coreValues.map((value, i) => (
              <div key={i} className="p-12 border-2 border-white/10 rounded-[3rem] bg-white/5 backdrop-blur-xl hover:bg-white/15 transition-all hover:-translate-y-2 hover:border-sky-400 group">
                <p className="text-3xl font-light tracking-wider group-hover:text-sky-300 transition-colors">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Faith - Structured Clarity */}
      <section className="py-32 bg-sky-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-24 space-y-8">
            <BookOpen className="h-16 w-16 mx-auto text-sky-600" />
            <h2 className="text-6xl font-black tracking-tight text-sky-950 uppercase">{t('about.faith.title')}</h2>
            <p className="text-3xl text-sky-800/70 font-light italic max-w-3xl mx-auto leading-relaxed">{t('about.faith.subtitle')}</p>
            <div className="pt-10">
              <Button asChild className="rounded-full px-12 py-10 text-2xl font-bold bg-sky-600 hover:bg-sky-700 shadow-2xl hover:scale-105 transition-all gap-4">
                <a 
                  href="https://lricbc.org/wp-content/uploads/2022/07/Baptist-Faith-Message.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="h-8 w-8" />
                  {t('about.faith.downloadLink')}
                </a>
              </Button>
            </div>
          </div>
          
          <div className="grid gap-10 md:grid-cols-2">
            {Array.isArray(beliefs) && beliefs.map((belief, i) => (
              <Card key={i} className="border-none bg-white/80 backdrop-blur-xl shadow-xl rounded-[3rem] p-4 hover:shadow-2xl transition-all">
                <CardHeader className="p-10 pb-4">
                  <CardTitle className="text-3xl font-black text-sky-700 tracking-wider uppercase border-b-2 border-sky-100 pb-4">{belief.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-0">
                  <p className="text-2xl text-sky-900/80 font-light leading-[1.6]">{belief.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline - Premium Visuals */}
      <section className="container mx-auto px-4 py-32">
        <div className="text-center mb-24 space-y-6">
          <History className="h-16 w-16 mx-auto text-sky-600" />
          <h2 className="text-5xl font-black tracking-[0.3em] uppercase text-sky-950">{t('about.history.title')}</h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-sky-100">
            {Array.isArray(historyItems) && historyItems.map((item, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-20 h-20 rounded-full border-[6px] border-white bg-sky-600 text-white shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:bg-sky-500 transition-colors">
                  <span className="text-lg font-black">{item.year.slice(-2)}</span>
                </div>
                <Card className="w-[calc(100%-6rem)] md:w-[calc(50%-4rem)] p-10 bg-white shadow-2xl border-none rounded-[3rem] group-hover:scale-[1.03] transition-all duration-500">
                   <div className="text-3xl font-black text-sky-600 mb-4">{item.year}</div>
                   <div className="text-2xl text-sky-900/80 font-light leading-relaxed">{item.text}</div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
