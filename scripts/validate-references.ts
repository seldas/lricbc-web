import { parseReference } from '../src/lib/parse-reference';
import { BIBLE_BOOK_IDS } from '../src/lib/bible-book-ids';
import rclReadings from '../src/data/rcl-readings.json';

type Entry = { ot: string; psalm: string; epistle: string; gospel: string };
const data = rclReadings as Record<string, Record<string, Entry>>;

const allRefs = new Set<string>();
for (const dayKey of Object.keys(data)) {
  for (const year of Object.keys(data[dayKey])) {
    const entry = data[dayKey][year];
    for (const field of ['ot', 'psalm', 'epistle', 'gospel'] as const) {
      allRefs.add(entry[field]);
    }
  }
}

console.log(`Total unique references: ${allRefs.size}`);

let failures = 0;
let apocrypha = 0;
let ok = 0;

for (const ref of allRefs) {
  const parsed = parseReference(ref);
  if (!parsed) {
    console.log(`FAILED TO PARSE: "${ref}"`);
    failures++;
    continue;
  }
  if (!(parsed.book in BIBLE_BOOK_IDS)) {
    console.log(`APOCRYPHA/UNKNOWN BOOK: "${ref}" -> book="${parsed.book}"`);
    apocrypha++;
    continue;
  }
  ok++;
}

console.log(`\nOK: ${ok}, apocrypha/unknown: ${apocrypha}, parse failures: ${failures}`);

// Spot-check a handful of tricky references in detail.
const samples = [
  'Genesis 1:1-2:4a',
  'Romans 1:16-17; 3:22b-28, (29-31)',
  '1 Peter 4:12-14; 5:6-11',
  'Philemon 1-21',
  'Matthew 9:35-10:8(9-23)',
  '1 Samuel 3:1-10(11-20)',
  'Luke 9:28-36, [37-43a]',
  'Isaiah 58:1-9a, [9b-12]',
  'James 2:1-10, [11-13], 14-17',
  'Luke 15:1-3, 11b-32',
  'Galatians 6:(1-6)7-16',
  'Hebrews 10:11-14 (15-18) 19-25',
  '2 Samuel 11:26-12:10, 13-15',
  'Psalm 122',
  'Nehemiah 8:1-3, 5-6, 8-10',
];
console.log('\n--- Spot checks ---');
for (const s of samples) {
  const parsed = parseReference(s);
  console.log(s);
  console.log('  ', JSON.stringify(parsed?.segments));
}
