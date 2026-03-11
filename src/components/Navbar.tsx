'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { t } = useTranslation('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/special-event', label: t('nav.specialEvent') },
    { href: '/about', label: t('nav.about') },
    { href: '/online-worship', label: t('nav.onlineWorship') || 'Online Worship' },
    { href: '/updates', label: t('nav.updates') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/giving', label: t('nav.giving') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

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
          {navLinks.map((link: any) => {
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
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-xs xl:text-sm font-bold tracking-wider uppercase transition-colors hover:text-primary whitespace-nowrap group/nav ${
                  active ? 'text-primary' : 'text-slate-500'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-in fade-in slide-in-from-left-2 duration-300" />
                )}
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
            {navLinks.map((link: any) => {
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
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xl font-medium tracking-wide transition-colors hover:text-primary whitespace-nowrap flex items-center justify-between ${
                    active ? 'text-primary font-bold' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  {active && <span className="h-2 w-2 bg-primary rounded-full" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
