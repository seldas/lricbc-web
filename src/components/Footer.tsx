'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="border-t bg-slate-50 py-12">
      <div className="container mx-auto px-4 text-center text-slate-500">
        <div className="flex items-center justify-center space-x-2">
          <p>© {new Date().getFullYear()} LRICBC - 小石城以馬內利華語浸信會</p>
          <Button asChild variant="ghost" size="icon-xs" className="opacity-10 hover:opacity-100 transition-opacity">
            <Link href="/admin/post">
              <Settings className="size-3" />
            </Link>
          </Button>
        </div>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <p>Little Rock Immanuel Chinese Baptist Church</p>
        </div>
      </div>
    </footer>
  );
}
