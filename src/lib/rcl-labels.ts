const ORDINALS_EN: Record<number, string> = {
  1: 'First', 2: 'Second', 3: 'Third', 4: 'Fourth', 5: 'Fifth',
  6: 'Sixth', 7: 'Seventh', 8: 'Eighth',
};

const ORDINALS_ZH: Record<number, string> = {
  1: '第一', 2: '第二', 3: '第三', 4: '第四', 5: '第五',
  6: '第六', 7: '第七', 8: '第八',
};

const FIXED_LABELS: Record<string, { en: string; zh: string }> = {
  Christmas1: { en: 'First Sunday after Christmas', zh: '聖誕節後第一主日' },
  Christmas2: { en: 'Second Sunday after Christmas', zh: '聖誕節後第二主日' },
  BaptismOfLord: { en: 'Baptism of the Lord', zh: '主受洗日' },
  Transfiguration: { en: 'Transfiguration Sunday', zh: '主顯容主日' },
  PalmSunday: { en: 'Palm Sunday', zh: '棕枝主日' },
  Easter: { en: 'Easter Sunday', zh: '復活節主日' },
  Pentecost: { en: 'Day of Pentecost', zh: '五旬節' },
  TrinitySunday: { en: 'Trinity Sunday', zh: '三一主日' },
};

export function getDayLabel(dayKey: string, lang: 'en' | 'zh'): string {
  if (FIXED_LABELS[dayKey]) return FIXED_LABELS[dayKey][lang];

  const adventMatch = dayKey.match(/^Advent(\d)$/);
  if (adventMatch) {
    const n = Number(adventMatch[1]);
    return lang === 'en' ? `${ORDINALS_EN[n]} Sunday of Advent` : `將臨期${ORDINALS_ZH[n]}主日`;
  }

  const epiphanyMatch = dayKey.match(/^Epiphany(\d)$/);
  if (epiphanyMatch) {
    const n = Number(epiphanyMatch[1]);
    return lang === 'en' ? `${ORDINALS_EN[n]} Sunday after Epiphany` : `顯現期後${ORDINALS_ZH[n]}主日`;
  }

  const lentMatch = dayKey.match(/^Lent(\d)$/);
  if (lentMatch) {
    const n = Number(lentMatch[1]);
    return lang === 'en' ? `${ORDINALS_EN[n]} Sunday in Lent` : `大齋期${ORDINALS_ZH[n]}主日`;
  }

  const easterMatch = dayKey.match(/^Easter(\d)$/);
  if (easterMatch) {
    const n = Number(easterMatch[1]);
    return lang === 'en' ? `${ORDINALS_EN[n]} Sunday of Easter` : `復活期${ORDINALS_ZH[n]}主日`;
  }

  const properMatch = dayKey.match(/^Proper(\d+)$/);
  if (properMatch) {
    const n = Number(properMatch[1]);
    const suffix = n === 29 ? ' (Christ the King)' : '';
    return lang === 'en' ? `Proper ${n}${suffix}` : `聖靈降臨後第${n}主日`;
  }

  return dayKey;
}
