import { BIBLE_BOOK_NAMES } from './bible-book-ids';

export interface ReferenceSegment {
  chapter: number;
  // null verseStart means "from the start of the chapter";
  // null verseEnd means "through the end of the chapter".
  verseStart: number | null;
  verseEnd: number | null;
  // false means this segment is a direct continuation of the previous one
  // (same paragraph/block when rendered) - either verse-adjacent within the
  // same chapter, or the second half of a single "C1:V1-C2:V2" cross-chapter
  // token. true means a real break (a new paragraph): a different chapter
  // reached via ";"/"," rather than a chapter-spanning hyphen, or a genuine
  // skipped-verses gap within the same chapter.
  newBlock: boolean;
}

export interface ParsedReference {
  book: string;
  segments: ReferenceSegment[];
}

const BOOK_PREFIX_PATTERN = new RegExp(
  `^(${BIBLE_BOOK_NAMES.map(b => b.replace(/\s/g, '\\s')).join('|')})\\s+`
);

// "9a", "22b", "21c" -> "9", "22", "21" (sub-verse letters aren't
// meaningful at the whole-verse granularity we fetch/display text at).
function stripVerseLetters(ref: string): string {
  return ref.replace(/(\d)[a-c]\b/g, '$1');
}

const CROSS_CHAPTER = /^(\d+):(\d+)-(\d+):(\d+)$/;
const SAME_CHAPTER_RANGE = /^(\d+):(\d+)-(\d+)$/;
const SINGLE_VERSE = /^(\d+):(\d+)$/;
const CHAPTER_ONLY = /^(\d+):$/;
const BARE_RANGE = /^(\d+)-(\d+)$/;
const BARE_NUMBER = /^(\d+)$/;

export function parseReference(reference: string): ParsedReference | null {
  const bookMatch = reference.match(BOOK_PREFIX_PATTERN);
  if (!bookMatch) return null;
  const book = bookMatch[1];
  const rest = reference.slice(bookMatch[0].length);

  // Brackets mark optional/alternate verse spans - treat both the opening
  // and closing character as a plain segment separator (see parse-reference
  // design notes: "6:(1-6)7-16" needs a separator injected between ")" and
  // "7-16" even though the source has no comma there).
  const cleaned = stripVerseLetters(rest).replace(/[()[\]]/g, ',');
  const tokens = cleaned.split(/[,;]/).map(t => t.trim()).filter(Boolean);

  const segments: ReferenceSegment[] = [];
  let currentChapter: number | null = null;
  // Tracks where the "reading cursor" last landed, so we can tell whether
  // the next segment picks up right where it left off (same block) or
  // jumps ahead / to a different chapter (new block).
  let lastChapter: number | null = null;
  let lastVerseEnd: number | null = null;

  function isNewBlock(chapter: number, verseStart: number | null): boolean {
    if (lastChapter === null) return true;
    if (chapter !== lastChapter) return true;
    if (verseStart === null || lastVerseEnd === null) return false;
    return verseStart > lastVerseEnd + 1;
  }

  for (const token of tokens) {
    let m: RegExpMatchArray | null;

    if ((m = token.match(CROSS_CHAPTER))) {
      const [, c1, v1, c2, v2] = m;
      const chapter1 = Number(c1);
      const verse1 = Number(v1);
      const chapter2 = Number(c2);
      const verse2 = Number(v2);
      segments.push({ chapter: chapter1, verseStart: verse1, verseEnd: null, newBlock: isNewBlock(chapter1, verse1) });
      // Second half of the same hyphenated span - always a continuation.
      segments.push({ chapter: chapter2, verseStart: null, verseEnd: verse2, newBlock: false });
      currentChapter = chapter2;
      lastChapter = chapter2;
      lastVerseEnd = verse2;
    } else if ((m = token.match(SAME_CHAPTER_RANGE))) {
      const [, c, v1, v2] = m;
      const chapter = Number(c);
      const verseStart = Number(v1);
      const verseEnd = Number(v2);
      segments.push({ chapter, verseStart, verseEnd, newBlock: isNewBlock(chapter, verseStart) });
      currentChapter = chapter;
      lastChapter = chapter;
      lastVerseEnd = verseEnd;
    } else if ((m = token.match(SINGLE_VERSE))) {
      const [, c, v] = m;
      const chapter = Number(c);
      const verse = Number(v);
      segments.push({ chapter, verseStart: verse, verseEnd: verse, newBlock: isNewBlock(chapter, verse) });
      currentChapter = chapter;
      lastChapter = chapter;
      lastVerseEnd = verse;
    } else if ((m = token.match(CHAPTER_ONLY))) {
      currentChapter = Number(m[1]);
    } else if ((m = token.match(BARE_RANGE))) {
      const [, v1, v2] = m;
      const chapter: number = currentChapter ?? 1;
      const verseStart = Number(v1);
      const verseEnd = Number(v2);
      segments.push({ chapter, verseStart, verseEnd, newBlock: isNewBlock(chapter, verseStart) });
      currentChapter = chapter;
      lastChapter = chapter;
      lastVerseEnd = verseEnd;
    } else if ((m = token.match(BARE_NUMBER))) {
      if (currentChapter === null) {
        // Whole-chapter reference, e.g. "Psalm 122".
        const chapter = Number(m[1]);
        segments.push({ chapter, verseStart: null, verseEnd: null, newBlock: true });
        currentChapter = chapter;
        lastChapter = chapter;
        lastVerseEnd = null;
      } else {
        const verse = Number(m[1]);
        segments.push({ chapter: currentChapter, verseStart: verse, verseEnd: verse, newBlock: isNewBlock(currentChapter, verse) });
        lastChapter = currentChapter;
        lastVerseEnd = verse;
      }
    }
    // Unrecognized tokens are silently skipped - callers should treat a
    // reference that produces zero segments as unparseable.
  }

  if (segments.length === 0) return null;
  return { book, segments };
}
