'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: 'http://34.68.90.250', label: t('nav.oldWebsite'), external: true },
    { href: '/', label: t('nav.home') },
    { href: '/special-event', label: t('nav.specialEvent'), special: true },
    { href: '/about', label: t('nav.about') },
    { href: '/online-worship', label: t('nav.onlineWorship') || 'Online Worship' },
    { href: '/updates', label: t('nav.updates') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/giving', label: t('nav.giving') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/30 backdrop-blur-md border-b border-white/50">
      <div className="container mx-auto flex h-20 items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative h-12 w-12">
              <Image 
                src="/logo/cropped-LRICBC_Logo.png" 
                alt="LRICBC Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-light tracking-[0.3em] text-slate-800 transition-colors group-hover:text-primary uppercase">LRICBC</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          {navLinks.map((link) => {
            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative text-xs xl:text-sm font-bold tracking-wider uppercase transition-colors hover:text-primary text-slate-500 whitespace-nowrap group/nav"
                >
                  {link.label}
                </a>
              );
            }
            if (link.special) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 rounded-full bg-emerald-500 text-white text-xs xl:text-sm font-bold tracking-wider uppercase transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 animate-pulse-slow whitespace-nowrap group/nav"
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-xs xl:text-sm font-bold tracking-wider uppercase transition-colors hover:text-primary text-slate-500 whitespace-nowrap group/nav"
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pl-2 border-l border-slate-200">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative">
              <Menu className="h-6 w-6" />
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container mx-auto px-4 py-6 lg:hidden bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-xl animate-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => {
              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative text-xl font-medium tracking-wide transition-colors hover:text-primary whitespace-nowrap flex items-center justify-between"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              }
              if (link.special) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-xl font-bold tracking-wide text-emerald-600 animate-pulse-slow whitespace-nowrap flex items-center justify-between"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.label}</span>
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-xl font-medium tracking-wide transition-colors hover:text-primary whitespace-nowrap flex items-center justify-between"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
