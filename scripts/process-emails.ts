import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';

const PENDING_DIR = path.join(process.cwd(), 'pending');
const CONTENT_DIR = path.join(process.cwd(), 'content/updates');

function decodeBase64(data: string) {
  return Buffer.from(data, 'base64').toString('utf8');
}

function getPart(parts: any[], mimeType: string): any {
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
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  let formatted = "";
  
  for (let line of lines) {
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
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  let formatted = "";
  
  const mainPointRegex = /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.?\s+(.*)/i;
  const subPointRegex = /^([A-G]|\d+)\.?\s+(.*)/i;
  const scriptureRegex = /([12]?\s*[\u4e00-\u9fa5]{1,10}|[12]?\s*[a-z]+)\s+\d+:\s*\d+(-\d+)?/i;

  for (let line of lines) {
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
  const msg = JSON.parse(content);

  const subject = msg.payload.headers.find((h: any) => h.name === 'Subject')?.value || '';
  
  const htmlPart = getPart([msg.payload], 'text/html');
  if (!htmlPart || !htmlPart.body.data) return;

  const htmlRaw = decodeBase64(htmlPart.body.data);
  if (!htmlRaw.includes("主日崇拜程序 Program")) {
    return;
  }

  console.log(`Processing: ${subject}`);

  const dateMatch = subject.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}|\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4}/i);
  
  let dateFormatted: string;
  let displayDate: string;
  try {
    displayDate = dateMatch ? dateMatch[0].replace(/,/g, '') : new Date().toISOString().split('T')[0];
    dateFormatted = new Date(displayDate).toISOString().split('T')[0];
  } catch (e) {
    dateFormatted = new Date().toISOString().split('T')[0];
    displayDate = dateFormatted;
  }

  // 1. Pastor's Message Extraction (using HTML to preserve breaks)
  const pastorStartMarkers = ["牧者之言", "Pastor’s Message", "Pastor's Message", "Pastor's word"];
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

  const start = findFirstMarkerInHtml(htmlRaw, pastorStartMarkers);
  let pastorContentRaw: string | null = null;

  if (start) {
    const remainingHtml = htmlRaw.substring(start.index + start.marker.length);
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

    const titleEn = split.en ? `Pastor's Message - ${displayDate}` : `Pastor's Message (zh) - ${displayDate}`;
    const excerptEn = split.en ? `Weekly message from our pastor for ${displayDate}.` : `Weekly message (Chinese only) for ${displayDate}.`;

    await savePost(
      `${dateFormatted}-pastor-message`,
      {
        publishedAt: dateFormatted,
        category: 'pastor',
        title_en: titleEn,
        title_zh: `牧者之言 - ${displayDate}`,
        excerpt_en: excerptEn,
        excerpt_zh: `${displayDate} 的牧者心聲。`,
      },
      split.en ? `${formattedEn}\n\n---zh---\n\n${formattedZh}` : formattedZh
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
      formattedEn ? `${formattedEn}\n\n---zh---\n\n${formattedZh}` : formattedZh
    );
    console.log(`  - Extracted Worship Program`);
  }
}

async function savePost(id: string, metadata: any, content: string) {
  const frontmatter = `---
publishedAt: "${metadata.publishedAt}"
category: "${metadata.category}"
title_en: "${metadata.title_en}"
title_zh: "${metadata.title_zh}"
excerpt_en: "${metadata.excerpt_en}"
excerpt_zh: "${metadata.excerpt_zh}"
---

${content}
`;
  await fs.writeFile(path.join(CONTENT_DIR, `${id}.md`), frontmatter);
}

async function run() {
  await fs.mkdir(CONTENT_DIR, { recursive: true });
  const files = await fs.readdir(PENDING_DIR);
  for (const file of files) {
    if (file.endsWith('.json')) {
      await processFile(file);
    }
  }
}

run();
