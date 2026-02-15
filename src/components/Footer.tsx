'use client';

import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="border-t bg-slate-50 py-12">
      <div className="container mx-auto px-4 text-center text-slate-500">
        <p>© {new Date().getFullYear()} LRICBC - 小石城以馬內利華語浸信會</p>
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <p>Little Rock Immanuel Chinese Baptist Church</p>
        </div>
      </div>
    </footer>
  );
}
