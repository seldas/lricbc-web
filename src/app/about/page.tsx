'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPageNav from "@/components/AboutPageNav";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, History, Target, Heart, BookOpen, Download, Youtube, Video, Users } from "lucide-react";

export default function AboutPage() {
  const { t, i18n } = useTranslation('common');
  const langSuffix = i18n.language === 'en' ? 'en' : 'zh';

  const missionPoints = t('about.mission.points', { returnObjects: true }) as string[];
  const coreValues = t('about.values.list', { returnObjects: true }) as string[];
  const historyItems = t('about.history.items', { returnObjects: true }) as {year: string, text: string}[];
  const beliefs = t('about.faith.beliefs', { returnObjects: true }) as {title: string, content: string}[];
  const scheduleItems = t('about.schedule.table.items', { returnObjects: true }) as {name: string, time: string, desc: string}[];

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Compact Integrated Hero */}
      <section id="sunday-service" className="bg-gradient-to-b from-sky-200/80 via-sky-100/40 to-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center space-y-10">
          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl font-black tracking-[0.4em] text-sky-600 uppercase animate-in fade-in duration-700">
              {t('about.title')}
            </h1>
            <h2 className="text-6xl md:text-9xl font-light tracking-tighter text-sky-950 leading-none animate-in fade-in slide-in-from-bottom-5 duration-1000">
              {t('about.schedule.sundaySermon')}
            </h2>
          </div>
          
          <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white rounded-full text-xl md:text-2xl font-bold shadow-xl animate-pulse h-auto py-4 px-10 transition-all hover:scale-105">
            <Link href="/online-worship">
              {i18n.language === 'en' ? (
                <span>Join us this Sunday on site, or <span className="text-sky-300 underline underline-offset-4 font-black">online</span>!</span>
              ) : (
                <span>歡迎本週日實體或<span className="text-sky-300 underline underline-offset-4 font-black">在線</span>與我們一同聚會！</span>
              )}
            </Link>
          </Button>

          <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 mt-12 text-left">
            <Card className="bg-white/60 backdrop-blur-xl border-none shadow-2xl rounded-[3rem] p-10 space-y-6">
              <h3 className="text-2xl font-black text-sky-600 uppercase tracking-widest border-b border-sky-100 pb-4">{t('about.schedule.sundayTimes')}</h3>
              <div className="space-y-4 text-xl md:text-2xl text-sky-900/80 font-light leading-relaxed">
                <p>• {t('about.schedule.sundayTime1')}</p>
                <p>• {t('about.schedule.sundayTime2')}</p>
              </div>
            </Card>
            <Card className="bg-sky-900 text-white border-none shadow-2xl rounded-[3rem] p-10 space-y-6">
              <h3 className="text-2xl font-black text-sky-200 uppercase tracking-widest border-b border-white/10 pb-4">{t('about.schedule.connectWithUs')}</h3>
              <div className="space-y-4 text-xl md:text-2xl font-light leading-relaxed">
                <p className="font-bold text-sky-400">{t('about.schedule.offlineAddress')}</p>
                <div className="h-px bg-white/10 my-4" />
                <p className="text-lg opacity-80 uppercase tracking-tighter">{t('about.schedule.onlineTitle')}</p>
                <div className="space-y-4">
                  <Link href="/online-worship" className="flex items-center gap-4 group/yt hover:text-sky-400 transition-colors">
                    <div className="bg-white/10 p-3 rounded-2xl group-hover/yt:bg-red-500/20 transition-colors">
                      <Youtube className="h-7 w-7 text-red-400" />
                    </div>
                    <span className="font-medium underline underline-offset-8 decoration-white/20 group-hover/yt:decoration-sky-400 transition-all">YouTube Live</span>
                  </Link>
                  <a 
                    href="https://zoom.us/j/5015017777" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group/zoom hover:text-sky-400 transition-colors"
                  >
                    <div className="bg-white/10 p-3 rounded-2xl group-hover/zoom:bg-blue-500/20 transition-colors">
                      <Video className="h-7 w-7 text-sky-400" />
                    </div>
                    <span className="font-medium underline underline-offset-8 decoration-white/20 group-hover/zoom:decoration-sky-400 transition-all">
                      {t('about.schedule.zoomInfo')}
                    </span>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Weekly Schedule Table */}
      <section id="weekly-schedule" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <h3 className="text-3xl font-black text-center text-sky-900/40 uppercase tracking-[0.3em]">{t('about.schedule.title')}</h3>
          <div className="overflow-hidden rounded-[3rem] shadow-2xl border-4 border-white bg-white/40 backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead className="bg-sky-600 text-white text-lg md:text-xl uppercase tracking-widest">
                <tr>
                  <th className="p-8">{t('about.schedule.table.name')}</th>
                  <th className="p-8">{t('about.schedule.table.time')}</th>
                  <th className="p-8 hidden md:table-cell">{t('about.schedule.table.description')}</th>
                </tr>
              </thead>
              <tbody className="text-lg md:text-xl text-sky-950">
                {scheduleItems.map((item, i) => (
                  <tr key={i} className="border-b border-sky-100 hover:bg-sky-50/50 transition-colors">
                    <td className="p-8 font-bold">{item.name}</td>
                    <td className="p-8 font-light">{item.time}</td>
                    <td className="p-8 font-light text-sky-800/60 italic hidden md:table-cell">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Vision & Mission - High Impact */}
      <section id="vision-mission" className="container mx-auto px-4 py-32 border-t border-sky-50">
        <div className="text-center mb-20">
          <p className="text-3xl md:text-5xl font-light text-sky-800/80 italic max-w-4xl mx-auto leading-tight tracking-tight">
            "{t('about.slogan')}"
          </p>
        </div>
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
      <section id="core-values" className="bg-sky-900 text-white py-32 relative overflow-hidden">
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
      <section id="our-faith" className="py-32 bg-sky-50/30">
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
      <section id="church-history" className="container mx-auto px-4 py-32">
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

      {/* Key Personnel - Placeholder */}
      <section id="leadership" className="py-32 bg-sky-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/logo/LRICBC_Logo_v4_NameBottom-scaled.png')] opacity-5 bg-center bg-no-repeat bg-contain" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24 space-y-6">
            <Users className="h-16 w-16 mx-auto text-sky-400" />
            <h2 className="text-5xl font-black tracking-[0.3em] uppercase text-sky-200">
              {i18n.language === 'en' ? 'Our Leadership' : '教會領袖'}
            </h2>
          </div>
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem] p-20 text-center space-y-8">
            <p className="text-4xl font-light italic text-sky-200/60">TBD</p>
            <p className="text-xl font-light tracking-[0.2em] uppercase text-sky-100/40">
              {i18n.language === 'en' ? 'Personnel profiles will be updated soon' : '教職人員資料即將更新'}
            </p>
          </div>
        </div>
      </section>

      <AboutPageNav />
      <Footer />
    </main>
  );
}
