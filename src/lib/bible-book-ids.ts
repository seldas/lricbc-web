// Standard Protestant 66-book numbering (Genesis=1 ... Malachi=39,
// Matthew=40 ... Revelation=66), matching the scheme used by bolls.life
// and most Bible APIs. Verified against bolls.life directly: book 19
// chapter 23 = Psalm 23, book 40 chapter 1 = Matthew 1, book 1 chapter 1
// = Genesis 1.
//
// Deliberately excludes deuterocanonical/apocryphal books (Sirach, Wisdom
// of Solomon, Baruch) that appear in a few RCL Track 2 readings but aren't
// part of the Protestant canon (or the WEB/CUV translations) - callers use
// their absence here to detect "no local text available" and fall back to
// the BibleGateway link only.
export const BIBLE_BOOK_IDS: Record<string, number> = {
  'Genesis': 1,
  'Exodus': 2,
  'Leviticus': 3,
  'Numbers': 4,
  'Deuteronomy': 5,
  'Joshua': 6,
  'Judges': 7,
  'Ruth': 8,
  '1 Samuel': 9,
  '2 Samuel': 10,
  '1 Kings': 11,
  '2 Kings': 12,
  '1 Chronicles': 13,
  '2 Chronicles': 14,
  'Ezra': 15,
  'Nehemiah': 16,
  'Esther': 17,
  'Job': 18,
  'Psalm': 19,
  'Proverbs': 20,
  'Ecclesiastes': 21,
  'Song of Solomon': 22,
  'Isaiah': 23,
  'Jeremiah': 24,
  'Lamentations': 25,
  'Ezekiel': 26,
  'Daniel': 27,
  'Hosea': 28,
  'Joel': 29,
  'Amos': 30,
  'Obadiah': 31,
  'Jonah': 32,
  'Micah': 33,
  'Nahum': 34,
  'Habakkuk': 35,
  'Zephaniah': 36,
  'Haggai': 37,
  'Zechariah': 38,
  'Malachi': 39,
  'Matthew': 40,
  'Mark': 41,
  'Luke': 42,
  'John': 43,
  'Acts': 44,
  'Romans': 45,
  '1 Corinthians': 46,
  '2 Corinthians': 47,
  'Galatians': 48,
  'Ephesians': 49,
  'Philippians': 50,
  'Colossians': 51,
  '1 Thessalonians': 52,
  '2 Thessalonians': 53,
  '1 Timothy': 54,
  '2 Timothy': 55,
  'Titus': 56,
  'Philemon': 57,
  'Hebrews': 58,
  'James': 59,
  '1 Peter': 60,
  '2 Peter': 61,
  '1 John': 62,
  '2 John': 63,
  '3 John': 64,
  'Jude': 65,
  'Revelation': 66,
};

// Same book names, sorted longest-first so multi-word / numbered names
// (e.g. "1 Corinthians") match before a shorter substring could.
export const BIBLE_BOOK_NAMES = Object.keys(BIBLE_BOOK_IDS).sort((a, b) => b.length - a.length);
