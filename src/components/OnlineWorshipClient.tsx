'use client';

import { Youtube, ExternalLink, Calendar, Users, Info, Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Link from "next/link";
import { YouTubeVideo } from "@/lib/youtube";
import { cn } from "@/lib/utils";

interface OnlineWorshipClientProps {
  channelId: string;
  liveVideoId: string | null;
  latestVideoId: string | null;
  initialVideos?: YouTubeVideo[];
}

export default function OnlineWorshipClient({ channelId, liveVideoId, latestVideoId, initialVideos = [] }: OnlineWorshipClientProps) {
  const { t } = useTranslation('common');
  const [useLive, setUseLive] = useState(!!liveVideoId);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(latestVideoId);
  
  // If we have a specific live video ID, use it. Otherwise use the generic live redirect.
  const embedUrl = useLive 
    ? (liveVideoId ? `https://www.youtube.com/embed/${liveVideoId}?autoplay=0` : `https://www.youtube.com/embed/live?channel=${channelId}&autoplay=0`)
    : `https://www.youtube.com/embed/${selectedVideoId}?autoplay=0`;

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
    setUseLive(false);
    // Scroll to player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const channelUrl = `https://www.youtube.com/channel/${channelId}`;

  return (
    <>
      {/* Compact Responsive Banner */}
      <section className="bg-gradient-to-b from-sky-100/60 to-white py-8 md:py-10 border-b border-sky-50">
        <div className="container mx-auto px-4 text-center">
          {liveVideoId && (
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/40 backdrop-blur-md rounded-full border border-sky-200 mb-4 animate-pulse">
              <div className="h-2 w-2 bg-red-500 rounded-full" />
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-900">
                {t('onlineWorshipPage.liveStatus')}
              </span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-sky-900 leading-tight">
            {t('onlineWorshipPage.title')}
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-light text-sky-600/70 italic max-w-2xl mx-auto leading-relaxed px-4">
            {t('onlineWorshipPage.quote')}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6 md:py-12 flex-grow">
        <div className="max-w-6xl mx-auto">
          
          {/* Video Selection Tabs */}
          <div className="flex justify-center mb-8 gap-4">
            {liveVideoId && (
              <Button 
                variant={useLive ? "default" : "outline"}
                onClick={() => setUseLive(true)}
                className="rounded-full px-8 py-4 font-bold uppercase tracking-widest text-xs"
              >
                {t('onlineWorshipPage.tryLive')}
              </Button>
            )}
            {latestVideoId && (
              <Button 
                variant={!useLive ? "default" : "outline"}
                onClick={() => {
                  setUseLive(false);
                  if (!selectedVideoId) setSelectedVideoId(latestVideoId);
                }}
                className="rounded-full px-8 py-4 font-bold uppercase tracking-widest text-xs"
              >
                {liveVideoId ? t('onlineWorshipPage.watchRecording') : t('onlineWorshipPage.archiveTitle')}
              </Button>
            )}
          </div>

          {/* Video Player Container */}
          <div className="bg-black rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden aspect-video relative group border-4 md:border-8 border-white">
            <iframe
              src={embedUrl}
              title="YouTube worship stream"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {!useLive && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sky-600 bg-sky-50 py-3 px-6 rounded-full w-fit mx-auto border border-sky-100 animate-in fade-in zoom-in-95">
              <Info className="h-5 w-5" />
              <span className="text-sm font-medium">
                {selectedVideoId === latestVideoId 
                  ? t('onlineWorshipPage.communityContent').split(',')[0] // Fallback or logic
                  : t('onlineWorshipPage.archiveSubtitle')}
              </span>
            </div>
          )}

          {/* Recent Videos Panel */}
          {initialVideos.length > 0 && (
            <div className="mt-20 space-y-10">
              <div className="flex items-center justify-between border-b border-sky-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sky-100 rounded-2xl">
                    <Youtube className="h-6 w-6 text-sky-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-light text-sky-950 uppercase tracking-widest">
                      {t('onlineWorshipPage.archiveTitle')}
                    </h2>
                    <p className="text-sky-600/60 font-light text-sm italic">{t('onlineWorshipPage.archiveSubtitle')}</p>
                  </div>
                </div>
                <Button variant="ghost" asChild className="hidden sm:flex rounded-full text-sky-600 font-bold">
                  <a href={channelUrl} target="_blank" rel="noopener noreferrer">
                    {t('onlineWorshipPage.youtubeTitle')} <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialVideos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => handleVideoSelect(video.id)}
                    className={cn(
                      "group flex items-center gap-4 p-4 text-left transition-all duration-300 rounded-2xl border-2",
                      selectedVideoId === video.id && !useLive
                        ? "border-sky-500 bg-sky-50 shadow-md scale-[1.01]"
                        : "border-sky-50 bg-white hover:border-sky-200 hover:shadow-lg"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 p-3 rounded-xl transition-colors",
                      selectedVideoId === video.id && !useLive 
                        ? "bg-sky-600 text-white" 
                        : "bg-sky-100/50 text-sky-600 group-hover:bg-sky-100"
                    )}>
                      <Play className="h-5 w-5 fill-current" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm md:text-base font-bold text-sky-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-400 font-medium mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(video.published).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {selectedVideoId === video.id && !useLive && (
                       <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1 bg-sky-100 rounded-full">
                         <div className="h-1.5 w-1.5 bg-sky-600 rounded-full animate-pulse" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-sky-600">{t('onlineWorshipPage.playing')}</span>
                       </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Info & Call to Actions */}
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 mt-20 md:mt-32">
            <div className="md:col-span-2 space-y-8 sm:space-y-12">
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-4xl font-light text-sky-950 uppercase tracking-widest">
                  {t('onlineWorshipPage.communityTitle')}
                </h2>
                <p className="text-lg sm:text-2xl text-slate-600 leading-relaxed font-light italic">
                  {t('onlineWorshipPage.communityContent')}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-sky-100 flex flex-col items-center text-center space-y-4 transition-transform hover:scale-105">
                  <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-sky-500" />
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest text-sky-900">
                    {t('onlineWorshipPage.serviceTimeTitle')}
                  </h3>
                  <p className="text-slate-500 font-light text-sm sm:text-lg">
                    {t('onlineWorshipPage.serviceTimeContent')}
                  </p>
                </div>
                <Link 
                  href="/about#weekly-schedule"
                  className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-sky-100 flex flex-col items-center text-center space-y-4 transition-transform hover:scale-105 group"
                >
                  <Users className="h-8 w-8 sm:h-10 sm:w-10 text-sky-500 group-hover:text-sky-600 transition-colors" />
                  <h3 className="text-base sm:text-lg font-bold uppercase tracking-widest text-sky-900 group-hover:text-primary transition-colors">
                    {t('onlineWorshipPage.connectTitle')}
                  </h3>
                  <p className="text-slate-500 font-light text-sm sm:text-lg">
                    {t('onlineWorshipPage.connectContent')}
                  </p>
                </Link>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-sky-600 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 text-white shadow-xl flex flex-col items-center text-center space-y-6 sm:space-y-8">
                <Youtube className="h-10 w-10 sm:h-16 sm:w-16" />
                <h3 className="text-xl sm:text-3xl font-light tracking-tight">
                  {t('onlineWorshipPage.youtubeTitle')}
                </h3>
                <p className="text-sky-100/80 font-light italic text-sm sm:text-lg leading-relaxed">
                  {t('onlineWorshipPage.youtubeContent')}
                </p>
                <Button asChild className="w-full bg-white text-sky-600 hover:bg-sky-50 rounded-full py-6 sm:py-8 text-base sm:text-xl font-bold shadow-2xl transition-all hover:scale-105">
                  <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center">
                    {t('onlineWorshipPage.youtubeButton')} <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
