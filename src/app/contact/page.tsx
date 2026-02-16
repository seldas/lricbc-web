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

export default function ContactPage() {
  const { t } = useTranslation('common');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    const subject = encodeURIComponent(`Message from ${name} via LRICBC Website`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    
    window.location.href = `mailto:chinesechurch@lricbc.org?subject=${subject}&body=${body}`;
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-b from-sky-100/60 to-white py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-7xl font-light tracking-tight md:text-9xl mb-8 text-sky-900">{t('contact.title')}</h1>
          <p className="text-3xl font-light text-sky-600/70 italic max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <p className="text-xl md:text-2xl font-light text-sky-900/70 leading-relaxed italic bg-white/30 backdrop-blur-md p-8 rounded-[2.5rem] border border-sky-100/50 shadow-sm">
            {t('contact.description')}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
          
          {/* Contact Information & Map */}
          <div className="space-y-10">
            <Card className="border-none bg-white/60 backdrop-blur-md rounded-[2.5rem] shadow-sm overflow-hidden">
              <CardHeader className="pt-10 px-10">
                <CardTitle className="text-2xl font-light tracking-widest uppercase text-sky-900">{t('contact.title')}</CardTitle>
                <CardDescription className="font-light text-sky-600 italic">
                  Little Rock Immanuel Chinese Baptist Church
                </CardDescription>
              </CardHeader>
              <CardContent className="px-10 pb-10 space-y-6">
                <div className="flex items-center space-x-4 group cursor-default">
                  <div className="bg-sky-50 p-3 rounded-full group-hover:bg-sky-100 transition-colors shadow-sm">
                    <MapPin className="h-5 w-5 text-sky-500" />
                  </div>
                  <span className="text-sky-800/80 font-light">{t('contact.info.address')}</span>
                </div>
                <div className="flex items-center space-x-4 group cursor-default">
                  <div className="bg-sky-50 p-3 rounded-full group-hover:bg-sky-100 transition-colors shadow-sm">
                    <Phone className="h-5 w-5 text-sky-500" />
                  </div>
                  <span className="text-sky-800/80 font-light">{t('contact.info.phone')}</span>
                </div>
                <div className="flex items-center space-x-4 group cursor-default">
                  <div className="bg-sky-50 p-3 rounded-full group-hover:bg-sky-100 transition-colors shadow-sm">
                    <Mail className="h-5 w-5 text-sky-500" />
                  </div>
                  <span className="text-sky-800/80 font-light">{t('contact.info.email')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Google Map Embed */}
            <div className="overflow-hidden rounded-[2.5rem] border-8 border-white shadow-xl h-[400px] heavenly-glow relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3278.366779146193!2d-92.40466492362483!3d34.74635677290333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d2a5d911111111%3A0x1111111111111111!2s9701%20W%20Markham%20St%2C%20Little%20Rock%2C%20AR%2072205!5e0!3m2!1sen!2sus!4v1709999999999!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
                className="grayscale-[20%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-none bg-white shadow-2xl rounded-[3rem] p-4">
            <CardHeader className="pt-10 px-10 text-center">
              <CardTitle className="text-3xl font-light tracking-[0.2em] uppercase text-sky-500">{t('contact.form.submit')}</CardTitle>
            </CardHeader>
            <CardContent className="px-10 pb-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-sky-400 pl-2">{t('contact.form.name')}</Label>
                  <Input name="name" id="name" required placeholder={t('contact.form.name')} className="rounded-2xl border-sky-50 bg-sky-50/30 py-6 px-6 focus-visible:ring-sky-200" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-sky-400 pl-2">{t('contact.form.email')}</Label>
                  <Input name="email" id="email" type="email" required placeholder={t('contact.form.email')} className="rounded-2xl border-sky-50 bg-sky-50/30 py-6 px-6 focus-visible:ring-sky-200" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-sky-400 pl-2">{t('contact.form.message')}</Label>
                  <Textarea
                    name="message"
                    id="message"
                    required
                    placeholder={t('contact.form.message')}
                    className="min-h-[200px] rounded-[2rem] border-sky-50 bg-sky-50/30 p-6 focus-visible:ring-sky-200"
                  />
                </div>
                <Button type="submit" className="w-full py-8 text-lg rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold uppercase tracking-[0.2em] transition-all heavenly-glow hover:translate-y-[-2px] shadow-lg shadow-sky-100">
                  {t('contact.form.submit')}
                  <Send className="ml-3 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </section>

      <Footer />
    </main>
  );
}
