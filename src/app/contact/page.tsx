'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useState } from "react";

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const { t, i18n } = useTranslation('common');
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const successMessage = i18n.language === 'en'
    ? 'Message received! Pastor will follow up soon.'
    : '訊息已送出，牧師會儘快回覆。';
  const genericError = i18n.language === 'en'
    ? 'Something went wrong. Please try again in a moment.'
    : '系統出了一點問題，請稍後再試。';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: (formData.get('name') as string | null)?.trim() ?? '',
      email: (formData.get('email') as string | null)?.trim() ?? '',
      message: (formData.get('message') as string | null)?.trim() ?? '',
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body?.error || genericError);
      }

      setStatus('success');
      setStatusMessage(successMessage);
      e.currentTarget.reset();
    } catch (error: unknown) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : genericError);
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-b from-sky-100/60 to-white py-8 md:py-10 border-b border-sky-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/40 backdrop-blur-md rounded-full border border-sky-200 mb-4 animate-pulse">
            <div className="h-2 w-2 bg-amber-500 rounded-full" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-sky-900">
              {t('contact.title')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-sky-900 leading-tight">
            {t('contact.title')}
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-light text-sky-600/70 italic max-w-2xl mx-auto leading-relaxed px-4">
            {t('contact.subtitle')}
          </p>

          <div className="max-w-2xl mx-auto pt-8 mt-8 border-t border-sky-100 animate-in fade-in slide-in-from-top-4 duration-1000">
            <p className="text-base sm:text-xl font-light text-slate-500 italic leading-relaxed px-4">
              {t('contact.quote')}
            </p>
            <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-sky-500/60">
              — {t('contact.quoteVerse')}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-8 sm:py-12 flex-grow">
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16 text-center">
          <p className="text-lg sm:text-2xl font-light text-sky-900/70 leading-relaxed italic bg-white/30 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-sky-100/50 shadow-sm">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          
          {/* Contact Information & Map */}
          <div className="space-y-8 sm:space-y-10">
            <Card className="border-none bg-white/60 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] shadow-sm overflow-hidden">
              <CardHeader className="pt-8 sm:pt-10 px-8 sm:px-10">
                <CardTitle className="text-xl sm:text-2xl font-light tracking-widest uppercase text-sky-900">{t('contact.title')}</CardTitle>
                <CardDescription className="font-light text-sky-600 italic text-sm sm:text-base">
                  Little Rock Immanuel Chinese Baptist Church
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 sm:px-10 pb-8 sm:pb-10 space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4 group cursor-default">
                  <div className="bg-sky-50 p-2 sm:p-3 rounded-full group-hover:bg-sky-100 transition-colors shadow-sm">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                  </div>
                  <span className="text-sky-800/80 font-light text-sm sm:text-base">{t('contact.info.address')}</span>
                </div>
                <div className="flex items-center space-x-4 group cursor-default">
                  <div className="bg-sky-50 p-2 sm:p-3 rounded-full group-hover:bg-sky-100 transition-colors shadow-sm">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                  </div>
                  <span className="text-sky-800/80 font-light text-sm sm:text-base">{t('contact.info.phone')}</span>
                </div>
                <div className="flex items-center space-x-4 group cursor-default">
                  <div className="bg-sky-50 p-2 sm:p-3 rounded-full group-hover:bg-sky-100 transition-colors shadow-sm">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-sky-500" />
                  </div>
                  <span className="text-sky-800/80 font-light text-sm sm:text-base">{t('contact.info.email')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Google Map Embed */}
            <div className="overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border-4 sm:border-8 border-white shadow-xl h-[300px] sm:h-[400px] heavenly-glow relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.366779146193!2d-92.40466492362483!3d34.74635677290333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d2a5d911111111%3A0x1111111111111111!2s9701%20W%20Markham%20St%2C%20Little%20Rock%2C%20AR%2072205!5e0!3m2!1sen!2sus!4v1709999999999!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
                className="grayscale-[20%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none group-focus-within:pointer-events-auto"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 opacity-100 group-focus-within:opacity-0 transition-opacity">
                <p className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-sky-900 shadow-sm border border-sky-100 lg:hidden">Tap to interact with map</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-none bg-white shadow-2xl rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-4">
            <CardHeader className="pt-8 sm:pt-10 px-6 sm:px-10 text-center">
              <CardTitle className="text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase text-sky-500">{t('contact.form.submit')}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 sm:px-10 pb-8 sm:pb-10">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8" aria-live="polite">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-sky-400 pl-2">{t('contact.form.name')}</Label>
                  <Input name="name" id="name" required placeholder={t('contact.form.name')} className="rounded-xl sm:rounded-2xl border-sky-50 bg-sky-50/30 py-5 sm:py-6 px-5 sm:px-6 focus-visible:ring-sky-200" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-sky-400 pl-2">{t('contact.form.email')}</Label>
                  <Input name="email" id="email" type="email" required placeholder={t('contact.form.email')} className="rounded-xl sm:rounded-2xl border-sky-50 bg-sky-50/30 py-5 sm:py-6 px-5 sm:px-6 focus-visible:ring-sky-200" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-sky-400 pl-2">{t('contact.form.message')}</Label>
                  <Textarea
                    name="message"
                    id="message"
                    required
                    placeholder={t('contact.form.message')}
                    className="min-h-[150px] sm:min-h-[200px] rounded-2xl sm:rounded-[2rem] border-sky-50 bg-sky-50/30 p-5 sm:p-6 focus-visible:ring-sky-200"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-6 sm:py-8 text-base sm:text-lg rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold uppercase tracking-[0.2em] transition-all heavenly-glow hover:translate-y-[-2px] shadow-lg shadow-sky-100"
                >
                  {status === 'loading' ? (i18n.language === 'en' ? 'Sending...' : '傳送中...') : t('contact.form.submit')}
                  <Send className="ml-3 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                {statusMessage && (
                  <div
                    className={`text-sm font-bold text-center ${status === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}
                  >
                    {statusMessage}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

        </div>
      </section>

      <Footer />
    </main>
  );
}
