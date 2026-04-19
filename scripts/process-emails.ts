import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';
import mammoth from 'mammoth';

const PENDING_DIR = path.join(process.cwd(), 'fetch_raw', 'pending');
const PROCESSED_DIR = path.join(process.cwd(), 'fetch_raw', 'processed');
const CONTENT_DIR = process.env.DATA_STORAGE_PATH 
  ? path.join(process.env.DATA_STORAGE_PATH, 'content/updates') 
  : path.join(process.cwd(), 'content/updates');

interface MessagePart {
  mimeType?: string;
  filename?: string;
  body?: { data?: string };
  parts?: MessagePart[];
}

interface SavedMessage {
  payload: {
    headers?: { name?: string; value?: string }[];
    parts?: MessagePart[];
    body?: { data?: string };
  };
}

interface PostMetadata {
  publishedAt: string;
  category: string;
  title_en: string;
  title_zh: string;
  subtitle_en?: string;
  subtitle_zh?: string;
  excerpt_en: string;
  excerpt_zh: string;
}

function decodeBase64(data: string) {
  return Buffer.from(data, 'base64').toString('utf8');
}

function decodeBase64ToBuffer(data: string) {
  return Buffer.from(data, 'base64');
}

function getPart(parts: MessagePart[] = [], mimeType: string): MessagePart | null {
  for (const part of parts) {
    if (part.mimeType === mimeType) {
      return part;
    }
    if (part.parts) {
      const found = getPart(part.parts, mimeType);
      if (found) return found;
    }
  }
  return null;
}

function getAllParts(parts: MessagePart[] = []): MessagePart[] {
  let all: MessagePart[] = [];
  for (const part of parts) {
    all.push(part);
    if (part.parts) {
      all = all.concat(getAllParts(part.parts));
    }
  }
  return all;
}

/**
 * Converts basic HTML blocks to text while preserving paragraph breaks.
 */
function cleanText(html: string): string {
  return html
    .replace(/<p[^>]*>/gi, '\n\n')
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<tr[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '') // Strip remaining tags
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Collapse triple newlines
    .trim();
}

/**
 * Specifically formats narrative text (like Pastor's Message).
 * Ensures sentences are grouped and signatures are identified.
 */
function formatNarrativeText(text: string): string {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l);
  let formatted = "";
  
  for (const line of lines) {
    // Identify potential headers (short lines with specific symbols)
    if (line.length < 40 && (line.startsWith('•') || line.includes('：') || line.includes(':'))) {
      formatted += `\n### ${line}\n\n`;
    } 
    // Identify signature
    else if (line.includes('牧師') || line.includes('Pastor') || line.includes('Li Chunhai') || line.includes('李春海')) {
      formatted += `\n\n---\n**${line}**\n`;
    }
    else {
      formatted += `${line}\n\n`;
    }
  }
  
  return formatted.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
}

function splitBilingual(text: string): { zh: string, en: string } {
  const paragraphs = text.split(/\n\s*\n/);
  const zhPars: string[] = [];
  const enPars: string[] = [];

  const zhRegex = /[\u4e00-\u9fa5]/;
  const enRegex = /[a-zA-Z]{4,}/; 

  for (let par of paragraphs) {
    par = par.trim();
    if (!par) continue;

    const hasZh = zhRegex.test(par);
    const hasEn = enRegex.test(par);

    if (hasZh && !hasEn) {
      zhPars.push(par);
    } else if (hasEn && !hasZh) {
      enPars.push(par);
    } else {
      const zhCount = (par.match(/[\u4e00-\u9fa5]/g) || []).length;
      const enCount = (par.match(/[a-zA-Z]/g) || []).length;
      
      if (zhCount > 5) {
        zhPars.push(par);
      } else if (enCount > 5) {
        enPars.push(par);
      }
    }
  }

  if (zhPars.length > 0 && enPars.length === 0) {
    return { zh: zhPars.join('\n\n'), en: "" };
  }
  if (enPars.length > 0 && zhPars.length === 0) {
    return { zh: "", en: enPars.join('\n\n') };
  }

  return {
    zh: zhPars.join('\n\n'),
    en: enPars.join('\n\n')
  };
}

/**
 * Structural parser for Sermon Summaries.
 * Identifies points (I., A., 1.) and Scripture references.
 */
function formatSermonSummary(text: string): string {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l);
  let formatted = "";
  
  const mainPointRegex = /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.?\s+(.*)/i;
  const subPointRegex = /^([A-G]|\d+)\.?\s+(.*)/i;
  const scriptureRegex = /([12]?\s*[\u4e00-\u9fa5]{1,10}|[12]?\s*[a-z]+)\s+\d+:\s*\d+(-\d+)?/i;

  for (const line of lines) {
    const mainMatch = line.match(mainPointRegex);
    if (mainMatch) {
      formatted += `\n## ${mainMatch[1]}. ${mainMatch[2]}\n`;
      continue;
    }

    const subMatch = line.match(subPointRegex);
    if (subMatch) {
      formatted += `* **${subMatch[1]}.** ${subMatch[2]}\n`;
      continue;
    }

    if (scriptureRegex.test(line)) {
      formatted += `\n> **Scripture:** ${line}\n`;
      continue;
    }

    if (line.includes('信息:') || line.includes('Preacher:')) {
      formatted += `**Preacher:** ${line.replace(/信息:|Preacher:/g, '').trim()}\n`;
    } else if (line.length < 60 && (line.includes(' - ') || /[\u4e00-\u9fa5]/.test(line))) {
      formatted += `### ${line}\n`;
    } else {
      formatted += `${line}  \n`; 
    }
  }

  return formatted.trim();
}

async function processFile(fileName: string) {
  const filePath = path.join(PENDING_DIR, fileName);
  const content = await fs.readFile(filePath, 'utf8');
  const msg: SavedMessage = JSON.parse(content);

  const messageId = path.basename(fileName, '.json');
  const subject = msg.payload.headers?.find((h) => h.name === 'Subject')?.value || '';
  const dateHeader = msg.payload.headers?.find((h) => h.name === 'Date')?.value || '';
  console.log(`Processing: ${subject}`);

  const isSundayBulletin = subject.includes("Sunday bulletin");
  const dateMatch = subject.match(/(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?/);
  
  let dateFormatted: string;
  let displayDate: string;

  if (dateMatch) {
    const month = parseInt(dateMatch[1]);
    const day = parseInt(dateMatch[2]);
    let year = dateMatch[3] ? parseInt(dateMatch[3]) : new Date().getFullYear();
    if (year < 100) year += 2000;
    
    try {
      const d = new Date(year, month - 1, day);
      dateFormatted = d.toISOString().split('T')[0];
      displayDate = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      const d = new Date(dateHeader);
      dateFormatted = isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
      displayDate = dateFormatted;
    }
  } else {
    const backupDateMatch = subject.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i);
    try {
      displayDate = backupDateMatch ? backupDateMatch[0].replace(/,/g, '') : new Date().toISOString().split('T')[0];
      dateFormatted = new Date(displayDate).toISOString().split('T')[0];
    } catch (error) {
      const d = new Date(dateHeader);
      dateFormatted = isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
      displayDate = dateFormatted;
    }
  }

  const allParts = getAllParts(msg.payload.parts ?? []);

  if (isSundayBulletin) {
    // Process attachments for Sunday Bulletin
    for (const part of allParts) {
      if (part.filename && part.filename.endsWith('.docx') && part.body?.data) {
        const buffer = decodeBase64ToBuffer(part.body.data);
        const result = await mammoth.convertToHtml({ buffer });
        const text = cleanText(result.value);

        if (part.filename.includes('牧者之言')) {
          const split = splitBilingual(text);
          const formattedEn = formatNarrativeText(split.en);
          const formattedZh = formatNarrativeText(split.zh);
          
          const mainTitleZh = split.zh.split('\n')[0] || `牧者之言`;
          const mainTitleEn = split.en.split('\n')[0] || `Pastor's Message`;

          await savePost(
            `${dateFormatted}-pastor-message`,
            {
              publishedAt: dateFormatted,
              category: 'pastor',
              title_en: mainTitleEn,
              title_zh: mainTitleZh,
              subtitle_en: `Pastor's Message - ${displayDate}`,
              subtitle_zh: `牧者之言 - ${displayDate}`,
              excerpt_en: `Weekly message for ${displayDate}.`,
              excerpt_zh: `${displayDate} 的牧者心聲。`,
            },
            split.en ? `${formattedEn}\n\n---zh---\n\n${formattedZh}` : formattedZh,
            messageId
          );
          console.log(`  - Extracted Pastor's Message from attachment: ${part.filename}`);
        } 
        else if (part.filename.includes('bulletin') && part.filename.includes('简体')) {
          const split = splitBilingual(text);
          const formattedEn = formatSermonSummary(split.en);
          const formattedZh = formatSermonSummary(split.zh);

          await savePost(
            `${dateFormatted}-worship-program`,
            {
              publishedAt: dateFormatted,
              category: 'sermon',
              title_en: `Worship Program - ${displayDate}`,
              title_zh: `主日崇拜程序 - ${displayDate}`,
              excerpt_en: `Order of service and sermon notes for ${displayDate}.`,
              excerpt_zh: `${displayDate} 主日崇拜程序與信息摘要。`,
            },
            formattedEn ? `${formattedEn}\n\n---zh---\n\n${formattedZh}` : formattedZh,
            messageId
          );
          console.log(`  - Extracted Worship Program from attachment: ${part.filename}`);
        }
      }
    }
    return;
  }

  // Fallback to old HTML extraction if not a Sunday bulletin email or no attachments handled it
  const htmlPart = getPart(msg.payload.parts ?? [], 'text/html');
  const htmlData = htmlPart?.body?.data || msg.payload.body?.data;
  if (!htmlData) return;

  const htmlRaw = decodeBase64(htmlData);
  if (!htmlRaw.includes("主日崇拜程序 Program") && !htmlRaw.includes("主日崇拜程序")) {
    return;
  }

  // 1. Pastor's Message Extraction (using HTML to preserve breaks)
  const pastorStartRegex = /牧\s*者\s*之\s*言|Pastor[’']s\s*(?:Message|word|Word)/i;
  const pastorEndMarkers = [
    "如何奉獻", 
    "Ways to give", 
    "事奉同工", 
    "Staff", 
    "過去講道錄影", 
    "Sermon recordings"
  ];

  function findFirstMarkerInHtml(text: string, markers: string[]) {
    for (const marker of markers) {
      const index = text.indexOf(marker);
      if (index !== -1) return { index, marker };
    }
    return null;
  }

  const startMatch = htmlRaw.match(pastorStartRegex);
  let pastorContentRaw: string | null = null;

  if (startMatch && startMatch.index !== undefined) {
    const remainingHtml = htmlRaw.substring(startMatch.index + startMatch[0].length);
    const end = findFirstMarkerInHtml(remainingHtml, pastorEndMarkers);
    if (end) {
      pastorContentRaw = cleanText(remainingHtml.substring(0, end.index));
    } else {
      pastorContentRaw = cleanText(remainingHtml);
    }
  }

  if (pastorContentRaw && pastorContentRaw.length > 50) {
    const split = splitBilingual(pastorContentRaw);
    
    const formattedEn = formatNarrativeText(split.en);
    const formattedZh = formatNarrativeText(split.zh);

    // Extraction logic: Skip the "Pastor's Message" line if it's the first line
    const cleanLines = (text: string) => text.split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#') && !l.startsWith('-'))
      // Specifically skip the marker if it appears again in the cleaned text
      .filter(l => !pastorStartRegex.test(l));

    const zhLines = cleanLines(formattedZh);
    const enLines = cleanLines(formattedEn);

    const mainTitleZh = zhLines[0] || `牧者之言`;
    const mainTitleEn = enLines[0] || `Pastor's Message`;

    const titleEn = split.en ? `${mainTitleEn}` : `${mainTitleEn} (Chinese only)`;
    const titleZh = mainTitleZh;

    const subtitleEn = `Pastor's Message - ${displayDate}`;
    const subtitleZh = `牧者之言 - ${displayDate}`;

    await savePost(
      `${dateFormatted}-pastor-message`,
      {
        publishedAt: dateFormatted,
        category: 'pastor',
        title_en: titleEn,
        title_zh: titleZh,
        subtitle_en: subtitleEn,
        subtitle_zh: subtitleZh,
        excerpt_en: split.en ? `Weekly message for ${displayDate}.` : `Weekly message (Chinese only) for ${displayDate}.`,
        excerpt_zh: `${displayDate} 的牧者心聲。`,
      },
      split.en ? `${formattedEn}\n\n---zh---\n\n${formattedZh}` : formattedZh,
      messageId
    );
    console.log(`  - Extracted Pastor's Message`);
  }

  // 2. Worship Program Extraction
  const dom = new JSDOM(htmlRaw);
  const bodyText = dom.window.document.body.textContent || '';

  const programStartMarkers = ["主日崇拜程序 Program", "主日崇拜程序", "Worship Program"];
  const programEndMarkers = ["事奉同工 Staff", "事奉同工", "牧者之言", "Pastor’s Message", "Pastor's Message", "Pastor's word"];

  function findFirstMarker(text: string, markers: string[]) {
    for (const marker of markers) {
      const index = text.indexOf(marker);
      if (index !== -1) return { index, marker };
    }
    return null;
  }

  const pStart = findFirstMarker(bodyText, programStartMarkers);
  let fullProgramContent: string | null = null;

  if (pStart) {
    const remainingText = bodyText.substring(pStart.index + pStart.marker.length);
    const pEnd = findFirstMarker(remainingText, programEndMarkers);
    if (pEnd) {
      fullProgramContent = remainingText.substring(0, pEnd.index).trim();
    } else {
      fullProgramContent = remainingText.trim();
    }
  }

  if (fullProgramContent && fullProgramContent.length > 50) {
    const split = splitBilingual(fullProgramContent);
    
    const titleEn = split.en ? `Worship Program - ${displayDate}` : `Worship Program (zh) - ${displayDate}`;
    const excerptEn = split.en ? `Order of service and sermon notes for ${displayDate}.` : `Worship program (Chinese only) for ${displayDate}.`;

    const formattedEn = formatSermonSummary(split.en);
    const formattedZh = formatSermonSummary(split.zh);

    await savePost(
      `${dateFormatted}-worship-program`,
      {
        publishedAt: dateFormatted,
        category: 'sermon',
        title_en: titleEn,
        title_zh: `主日崇拜程序 - ${displayDate}`,
        excerpt_en: excerptEn,
        excerpt_zh: `${displayDate} 主日崇拜程序與信息摘要。`,
      },
      formattedEn ? `${formattedEn}\n\n---zh---\n\n${formattedZh}` : formattedZh,
      messageId
    );
    console.log(`  - Extracted Worship Program`);
  }
}

async function savePost(id: string, metadata: PostMetadata, content: string, sourceId?: string) {
  const normalizedSourceId = sourceId
    ? sourceId.replace(/[^a-zA-Z0-9-]/g, '-')
    : '';
  const fileId = normalizedSourceId ? `${id}-${normalizedSourceId}` : id;
  const frontmatter = `---
publishedAt: "${metadata.publishedAt}"
category: "${metadata.category}"
title_en: "${metadata.title_en.replace(/"/g, '\\"')}"
title_zh: "${metadata.title_zh.replace(/"/g, '\\"')}"
subtitle_en: "${(metadata.subtitle_en || "").replace(/"/g, '\\"')}"
subtitle_zh: "${(metadata.subtitle_zh || "").replace(/"/g, '\\"')}"
excerpt_en: "${metadata.excerpt_en.replace(/"/g, '\\"')}"
excerpt_zh: "${metadata.excerpt_zh.replace(/"/g, '\\"')}"
---

${content}
`;
  await fs.writeFile(path.join(CONTENT_DIR, `${fileId}.md`), frontmatter);
}

async function run() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(PROCESSED_DIR, { recursive: true });
  
  try {
    const files = await fs.readdir(PENDING_DIR);
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          await processFile(file);
          // Move file to processed folder
          const oldPath = path.join(PENDING_DIR, file);
          const newPath = path.join(PROCESSED_DIR, file);
          await fs.rename(oldPath, newPath);
          console.log(`  - Successfully processed and moved ${file}`);
        } catch (fileErr) {
          console.error(`Error processing file ${file}:`, fileErr);
        }
      }
    }
  } catch (err: unknown) {
    const typedErr = err as NodeJS.ErrnoException;
    if (typedErr?.code === 'ENOENT') {
      console.log('No pending directory found or it is empty.');
    } else {
      console.error('Error processing emails:', err);
    }
  }
}

run();
