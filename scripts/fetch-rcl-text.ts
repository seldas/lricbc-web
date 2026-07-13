// One-time data-build script: fetches the full text of every scripture
// reading used by the Daily Devotion / Weekly Scripture page from
// bolls.life (WEB + CUV, both public domain) and bakes it into
// src/data/rcl-readings-text.json so the site never calls an external
// API at runtime. Re-run this only if rcl-readings.json's citations change.
//
// Usage: npx tsx scripts/fetch-rcl-text.ts
import fs from 'fs';
import path from 'path';
import { parseReference, ReferenceSegment } from '../src/lib/parse-reference';
import { BIBLE_BOOK_IDS } from '../src/lib/bible-book-ids';
import rclReadings from '../src/data/rcl-readings.json';

type Entry = { ot: string; psalm: string; epistle: string; gospel: string };
const data = rclReadings as Record<string, Record<string, Entry>>;

interface BollsVerse {
  verse: number;
  text: string;
}

const chapterCache = new Map<string, Promise<BollsVerse[]>>();

// bolls.life's CUV text has a space after every single character (an
// artifact of how it was digitized) - collapse those away entirely for
// Chinese; for WEB, just collapse runs of whitespace down to one space.
function stripHtml(text: string, isCJK: boolean): string {
  const noTags = text.replace(/<[^>]+>/g, '');
  return isCJK ? noTags.replace(/\s+/g, '').trim() : noTags.replace(/\s+/g, ' ').trim();
}

async function fetchChapter(translation: string, bookId: number, chapter: number): Promise<BollsVerse[]> {
  const key = `${translation}/${bookId}/${chapter}`;
  if (!chapterCache.has(key)) {
    const promise = (async () => {
      const url = `https://bolls.life/get-text/${translation}/${bookId}/${chapter}/`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url} -> ${res.status}`);
      const verses = (await res.json()) as BollsVerse[];
      const isCJK = translation === 'CUV';
      return verses.map(v => ({ verse: v.verse, text: stripHtml(v.text, isCJK) }));
    })();
    chapterCache.set(key, promise);
  }
  return chapterCache.get(key)!;
}

export interface VerseEntry {
  verse: number;
  text: string;
}

// Resolves segments (which may have null start/end meaning "to the edge
// of the chapter") against actually-fetched chapters, dedupes overlapping
// verse numbers per chapter, and groups them into blocks (paragraphs)
// using each segment's `newBlock` flag - two adjacent readings from
// different passages render as separate paragraphs; a single continuous
// passage (even one spanning chapters) stays one paragraph.
async function assembleBlocks(translation: string, bookId: number, segments: ReferenceSegment[]): Promise<VerseEntry[][]> {
  const chapters = [...new Set(segments.map(s => s.chapter))];
  const versesByChapter = new Map<number, BollsVerse[]>();
  for (const chapter of chapters) {
    versesByChapter.set(chapter, await fetchChapter(translation, bookId, chapter));
  }

  const blocks: VerseEntry[][] = [];
  const seen = new Set<string>();
  for (const seg of segments) {
    const verses = versesByChapter.get(seg.chapter) ?? [];
    const start = seg.verseStart ?? 1;
    const end = seg.verseEnd ?? (verses.length > 0 ? verses[verses.length - 1].verse : start);

    if (seg.newBlock || blocks.length === 0) blocks.push([]);
    const currentBlock = blocks[blocks.length - 1];

    for (const v of verses) {
      if (v.verse < start || v.verse > end) continue;
      const key = `${seg.chapter}:${v.verse}`;
      if (seen.has(key)) continue;
      seen.add(key);
      currentBlock.push({ verse: v.verse, text: v.text });
    }
  }
  return blocks.filter(b => b.length > 0);
}

async function main() {
  const allRefs = new Set<string>();
  for (const dayKey of Object.keys(data)) {
    for (const year of Object.keys(data[dayKey])) {
      const entry = data[dayKey][year];
      for (const field of ['ot', 'psalm', 'epistle', 'gospel'] as const) {
        allRefs.add(entry[field]);
      }
    }
  }

  console.log(`Fetching text for ${allRefs.size} unique references...`);
  const result: Record<string, { en: VerseEntry[][]; zh: VerseEntry[][] } | null> = {};
  let done = 0;

  for (const ref of allRefs) {
    const parsed = parseReference(ref);
    const bookId = parsed ? BIBLE_BOOK_IDS[parsed.book] : undefined;
    if (!parsed || !bookId) {
      result[ref] = null;
      done++;
      continue;
    }
    try {
      const [en, zh] = await Promise.all([
        assembleBlocks('WEB', bookId, parsed.segments),
        assembleBlocks('CUV', bookId, parsed.segments),
      ]);
      result[ref] = { en, zh };
    } catch (err) {
      console.error(`FAILED: "${ref}" ->`, err);
      result[ref] = null;
    }
    done++;
    if (done % 25 === 0) console.log(`  ${done}/${allRefs.size}`);
  }

  const outPath = path.join(__dirname, '..', 'src', 'data', 'rcl-readings-text.json');
  fs.writeFileSync(outPath, JSON.stringify(result));

  const nullCount = Object.values(result).filter(v => v === null).length;
  console.log(`\nDone. ${allRefs.size - nullCount} with text, ${nullCount} unavailable (apocrypha/failed).`);
  console.log(`Written to ${outPath}`);
}

main();
