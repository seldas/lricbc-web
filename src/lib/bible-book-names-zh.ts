// English -> Traditional Chinese (Chinese Union Version / 和合本) book names,
// used to localize RCL citation strings for the zh UI. Sorted longest-first
// so multi-word / numbered names (e.g. "1 Corinthians") match before any
// shorter substring could.
const BOOK_NAMES_ZH: [string, string][] = [
  ['Wisdom of Solomon', '所羅門智訓'],
  ['1 Corinthians', '哥林多前書'],
  ['2 Corinthians', '哥林多後書'],
  ['1 Thessalonians', '帖撒羅尼迦前書'],
  ['2 Thessalonians', '帖撒羅尼迦後書'],
  ['1 Samuel', '撒母耳記上'],
  ['2 Samuel', '撒母耳記下'],
  ['1 Kings', '列王紀上'],
  ['2 Kings', '列王紀下'],
  ['1 Timothy', '提摩太前書'],
  ['2 Timothy', '提摩太後書'],
  ['1 Peter', '彼得前書'],
  ['2 Peter', '彼得後書'],
  ['1 John', '約翰一書'],
  ['2 John', '約翰二書'],
  ['3 John', '約翰三書'],
  ['Song of Solomon', '雅歌'],
  ['Genesis', '創世記'],
  ['Exodus', '出埃及記'],
  ['Leviticus', '利未記'],
  ['Numbers', '民數記'],
  ['Deuteronomy', '申命記'],
  ['Joshua', '約書亞記'],
  ['Judges', '士師記'],
  ['Ruth', '路得記'],
  ['Nehemiah', '尼希米記'],
  ['Esther', '以斯帖記'],
  ['Job', '約伯記'],
  ['Psalm', '詩篇'],
  ['Proverbs', '箴言'],
  ['Ecclesiastes', '傳道書'],
  ['Isaiah', '以賽亞書'],
  ['Jeremiah', '耶利米書'],
  ['Lamentations', '耶利米哀歌'],
  ['Ezekiel', '以西結書'],
  ['Daniel', '但以理書'],
  ['Hosea', '何西阿書'],
  ['Joel', '約珥書'],
  ['Amos', '阿摩司書'],
  ['Obadiah', '俄巴底亞書'],
  ['Jonah', '約拿書'],
  ['Micah', '彌迦書'],
  ['Nahum', '那鴻書'],
  ['Habakkuk', '哈巴谷書'],
  ['Zephaniah', '西番雅書'],
  ['Haggai', '哈該書'],
  ['Zechariah', '撒迦利亞書'],
  ['Malachi', '瑪拉基書'],
  ['Sirach', '便西拉智訓'],
  ['Baruch', '巴錄書'],
  ['Matthew', '馬太福音'],
  ['Mark', '馬可福音'],
  ['Luke', '路加福音'],
  ['John', '約翰福音'],
  ['Acts', '使徒行傳'],
  ['Romans', '羅馬書'],
  ['Galatians', '加拉太書'],
  ['Ephesians', '以弗所書'],
  ['Philippians', '腓立比書'],
  ['Colossians', '歌羅西書'],
  ['Titus', '提多書'],
  ['Philemon', '腓利門書'],
  ['Hebrews', '希伯來書'],
  ['James', '雅各書'],
  ['Jude', '猶大書'],
  ['Revelation', '啟示錄'],
];

// Match a book name only at a reference boundary (start of string, or right
// after "; " / " or " which separate alternate readings) so we don't
// accidentally rewrite an English word that happens to match inside a verse
// note.
const BOOK_PATTERN = new RegExp(
  `(^|;\\s*|\\bor\\s+)(${BOOK_NAMES_ZH.map(([en]) => en.replace(/\s/g, '\\s')).join('|')})(?=\\s+\\d)`,
  'g'
);

export function translateReference(reference: string): string {
  const withBooks = reference.replace(BOOK_PATTERN, (match, prefix, book) => {
    const zh = BOOK_NAMES_ZH.find(([en]) => en === book)?.[1] ?? book;
    return `${prefix}${zh}`;
  });
  return withBooks.replace(/\bor\b/g, '或');
}
