import rclReadings from '@/data/rcl-readings.json';

export type LiturgicalYearLetter = 'A' | 'B' | 'C';

export interface RclReadingSet {
  ot: string;
  psalm: string;
  epistle: string;
  gospel: string;
}

export interface RclResult {
  yearLetter: LiturgicalYearLetter;
  dayKey: string;
  sunday: Date;
  readings: RclReadingSet;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

// Sunday-Saturday weeks, matching the convention already used across the
// site (see parseLocalDate / UpdatesCalendar). Returns the Sunday that
// starts the week containing `date`.
export function getWeekSunday(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return addDays(d, -d.getDay());
}

// Meeus/Jones/Butcher Gregorian algorithm.
export function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Advent Sunday = the Sunday closest to November 30.
export function computeAdvent1(year: number): Date {
  const nov30 = new Date(year, 10, 30);
  const dow = nov30.getDay(); // 0 = Sunday
  // Distance to nearest Sunday: if dow <= 3 go backward, else forward,
  // matching "closest" (ties broken toward the earlier Sunday per RCL convention).
  const offset = dow <= 3 ? -dow : 7 - dow;
  return addDays(nov30, offset);
}

export function getLiturgicalYearLetter(adventCalendarYear: number): LiturgicalYearLetter {
  const rem = ((adventCalendarYear % 3) + 3) % 3;
  if (rem === 0) return 'A';
  if (rem === 1) return 'B';
  return 'C';
}

// Ordinary-time Propers use fixed calendar-date windows, independent of
// Easter: Proper 4 always covers the Sunday between May 29 and June 4,
// Proper 5 the following week, and so on (this is how the RCL itself and
// every published table, e.g. lectionarypage.net, key the Pentecost season).
function properNumberForSunday(sunday: Date): number {
  const year = sunday.getFullYear();
  const proper4Start = new Date(year, 4, 29); // May 29
  const diffDays = daysBetween(proper4Start, sunday);
  return 4 + Math.floor(diffDays / 7);
}

// Given any Sunday date, return the RCL day key (e.g. "Advent2", "Lent3",
// "Proper18", "TrinitySunday") and the liturgical year letter (A/B/C).
export function getLiturgicalDay(sunday: Date): { yearLetter: LiturgicalYearLetter; dayKey: string } {
  const year = sunday.getFullYear();
  const advent1This = computeAdvent1(year);

  if (sunday.getTime() >= advent1This.getTime()) {
    // Advent / Christmas season of the liturgical year that just began.
    const yearLetter = getLiturgicalYearLetter(year);
    const advent2 = addDays(advent1This, 7);
    const advent3 = addDays(advent1This, 14);
    const advent4 = addDays(advent1This, 21);
    if (sunday.getTime() === advent1This.getTime()) return { yearLetter, dayKey: 'Advent1' };
    if (sunday.getTime() === advent2.getTime()) return { yearLetter, dayKey: 'Advent2' };
    if (sunday.getTime() === advent3.getTime()) return { yearLetter, dayKey: 'Advent3' };
    if (sunday.getTime() === advent4.getTime()) return { yearLetter, dayKey: 'Advent4' };
    // Sunday(s) after Christmas Day (Dec 25), before year end.
    const christmas = new Date(year, 11, 25);
    if (sunday.getTime() > christmas.getTime()) {
      return { yearLetter, dayKey: 'Christmas1' };
    }
    // Shouldn't happen (falls between Advent4 and Christmas), fall back to Advent4.
    return { yearLetter, dayKey: 'Advent4' };
  }

  // Belongs to the liturgical year that began at last calendar year's Advent1;
  // its Easter falls within this same calendar year.
  const yearLetter = getLiturgicalYearLetter(year - 1);
  const easter = computeEaster(year);

  const jan6 = new Date(year, 0, 6);
  if (sunday.getTime() < jan6.getTime()) {
    // Sunday(s) between New Year's Day and Epiphany.
    const christmasPrev = new Date(year - 1, 11, 25);
    const daysSinceChristmas = daysBetween(christmasPrev, sunday);
    return { yearLetter, dayKey: daysSinceChristmas <= 7 ? 'Christmas1' : 'Christmas2' };
  }

  const transfiguration = addDays(easter, -49);
  const baptismOfLord = (() => {
    let d = addDays(jan6, 1);
    while (d.getDay() !== 0) d = addDays(d, 1);
    return d;
  })();

  if (sunday.getTime() < baptismOfLord.getTime()) {
    return { yearLetter, dayKey: 'Christmas2' };
  }
  if (sunday.getTime() === baptismOfLord.getTime()) {
    return { yearLetter, dayKey: 'BaptismOfLord' };
  }
  if (sunday.getTime() < transfiguration.getTime()) {
    const weeksAfterBaptism = Math.round(daysBetween(baptismOfLord, sunday) / 7);
    return { yearLetter, dayKey: `Epiphany${weeksAfterBaptism + 1}` };
  }
  if (sunday.getTime() === transfiguration.getTime()) {
    return { yearLetter, dayKey: 'Transfiguration' };
  }

  const lent1 = addDays(easter, -42);
  const palmSunday = addDays(easter, -7);
  if (sunday.getTime() >= lent1.getTime() && sunday.getTime() < palmSunday.getTime()) {
    const weekNum = Math.round(daysBetween(lent1, sunday) / 7) + 1;
    return { yearLetter, dayKey: `Lent${weekNum}` };
  }
  if (sunday.getTime() === palmSunday.getTime()) {
    return { yearLetter, dayKey: 'PalmSunday' };
  }

  const easter7 = addDays(easter, 42);
  if (sunday.getTime() >= easter.getTime() && sunday.getTime() <= easter7.getTime()) {
    const weekNum = Math.round(daysBetween(easter, sunday) / 7);
    return { yearLetter, dayKey: weekNum === 0 ? 'Easter' : `Easter${weekNum + 1}` };
  }

  const pentecost = addDays(easter, 49);
  if (sunday.getTime() === pentecost.getTime()) {
    return { yearLetter, dayKey: 'Pentecost' };
  }

  const trinity = addDays(easter, 56);
  if (sunday.getTime() === trinity.getTime()) {
    return { yearLetter, dayKey: 'TrinitySunday' };
  }

  // Ordinary time: everything between Trinity Sunday and next Advent1.
  const properNum = Math.min(29, Math.max(1, properNumberForSunday(sunday)));
  return { yearLetter, dayKey: `Proper${properNum}` };
}

const readingsTable = rclReadings as Record<string, Record<LiturgicalYearLetter, RclReadingSet>>;

export function getReadingsForDate(date: Date): RclResult | null {
  const sunday = getWeekSunday(date);
  const { yearLetter, dayKey } = getLiturgicalDay(sunday);
  const entry = readingsTable[dayKey];
  const readings = entry?.[yearLetter];
  if (!readings) return null;
  return { yearLetter, dayKey, sunday, readings };
}
