'use client';

import { ReactNode, useEffect, useState } from 'react';
import '@/lib/i18n';
import { useTranslation } from 'react-i18next';

export default function LanguageProvider({ children }: { children: ReactNode }) {
  useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  // Avoid hydration mismatch by waiting for the client to mount
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
