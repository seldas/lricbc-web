// Builds a BibleGateway passage-lookup URL from an RCL citation string.
// Citations sometimes contain "or" alternates (e.g. "Psalm 147 or 147:13-21")
// or multiple passages separated by ";" - BibleGateway's search endpoint
// handles comma/semicolon separated references and "or" fine as free text,
// so we just pass the reference straight through after light cleanup.
export function buildBibleGatewayUrl(reference: string, lang: 'en' | 'zh'): string {
  const version = lang === 'en' ? 'NIV' : 'CUV';
  const query = encodeURIComponent(reference.trim());
  return `https://www.biblegateway.com/passage/?search=${query}&version=${version}`;
}
