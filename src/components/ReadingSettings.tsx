'use client';

import { Button } from "@/components/ui/button";
import { 
  Type, 
  Sun, 
  Moon, 
  Settings2,
  Minus,
  Plus,
  Coffee
} from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ReadingSettingsProps {
  onFontSizeChange: (size: string) => void;
  onThemeChange: (theme: string) => void;
  currentFontSize: string;
  currentTheme: string;
}

export default function ReadingSettings({
  onFontSizeChange,
  onThemeChange,
  currentFontSize,
  currentTheme,
}: ReadingSettingsProps) {
  const { t } = useTranslation('common');
  const fontSizes = [
    { label: 'A-', value: 'prose-sm', icon: Minus },
    { label: 'A', value: 'prose-base', icon: Type },
    { label: 'A+', value: 'prose-lg', icon: Plus },
    { label: 'A++', value: 'prose-xl', icon: Plus },
    { label: 'A+++', value: 'prose-2xl', icon: Plus },
  ];

  const themes = [
    { name: 'light', icon: Sun, label: t('updates.readingSettings.themes.light'), bg: 'bg-white', text: 'text-slate-900' },
    { name: 'sepia', icon: Coffee, label: t('updates.readingSettings.themes.sepia'), bg: 'bg-[#f4ecd8]', text: 'text-[#5b4636]' },
    { name: 'dark', icon: Moon, label: t('updates.readingSettings.themes.dark'), bg: 'bg-slate-900', text: 'text-slate-100' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full shadow-lg ring-4 ring-white">
            <Settings2 className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-6" align="end" side="top">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-slate-500">{t('updates.readingSettings.fontSize')}</h4>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const currentIndex = fontSizes.findIndex(s => s.value === currentFontSize);
                    if (currentIndex > 0) onFontSizeChange(fontSizes[currentIndex - 1].value);
                  }}
                  disabled={currentFontSize === fontSizes[0].value}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-grow text-center font-medium">
                  {fontSizes.find(s => s.value === currentFontSize)?.label || 'Medium'}
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const currentIndex = fontSizes.findIndex(s => s.value === currentFontSize);
                    if (currentIndex < fontSizes.length - 1) onFontSizeChange(fontSizes[currentIndex + 1].value);
                  }}
                  disabled={currentFontSize === fontSizes[fontSizes.length - 1].value}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase tracking-wider text-slate-500">{t('updates.readingSettings.theme')}</h4>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => onThemeChange(t.name)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      currentTheme === t.name 
                        ? 'border-primary bg-primary/5' 
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.bg} ${t.text} border border-slate-200`}>
                      <t.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
