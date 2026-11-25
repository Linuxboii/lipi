// Text statistics and transforms. Pure functions.

const WORD = /[\p{L}\p{N}][\p{L}\p{N}\p{M}'’-]*/gu;

export function stats(text) {
  const t = text || '';
  const words = (t.match(WORD) || []).length;
  const sentences = t.trim() ? (t.match(/[^.!?।\n]+([.!?।]+|$)/gmu) || []).filter((s) => /[\p{L}\p{N}]/u.test(s)).length : 0;
  const paragraphs = t.split(/\n\s*\n/).filter((p) => p.trim()).length;
  return {
    chars: [...t].length,
    charsNoSpaces: [...t.replace(/\s/g, '')].length,
    words,
    sentences,
    paragraphs,
    lines: t ? t.split('\n').length : 0,
    readMin: words / 238,
    speakMin: words / 140,
  };
}

const lines = (s) => s.split('\n');
const SMALL = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'via', 'vs']);
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function dedupeBy(s, key) {
  const seen = new Set();
  return lines(s).filter((l) => { const k = key(l); if (seen.has(k)) return false; seen.add(k); return true; }).join('\n');
}

export const T = {
  upper: (s) => s.toUpperCase(),
  lower: (s) => s.toLowerCase(),
  title: (s) => s.toLowerCase().replace(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu, (w, i) => (i === 0 || !SMALL.has(w) ? w[0].toUpperCase() + w.slice(1) : w))
    .replace(/^(\s*)(\p{L})/u, (m, a, b) => a + b.toUpperCase()),
  sentence: (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (m, a, b) => a + b.toUpperCase()),
  squeeze: (s) => lines(s).map((l) => l.replace(/[ \t]+/g, ' ').trim()).join('\n').replace(/^\n+|\n+$/g, ''),
  removeEmpty: (s) => lines(s).filter((l) => l.trim()).join('\n'),
  unwrap: (s) => s.split(/\n\s*\n/).map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean).join(' ')).join('\n\n'),
  dedupe: (s) => dedupeBy(s, (l) => l),
  dedupeCI: (s) => dedupeBy(s, (l) => l.trim().toLowerCase()),
  sortAZ: (s) => lines(s).sort(collator.compare).join('\n'),
  sortZA: (s) => lines(s).sort((a, b) => collator.compare(b, a)).join('\n'),
  reverse: (s) => lines(s).reverse().join('\n'),
  number: (s) => lines(s).map((l, i) => `${i + 1}. ${l}`).join('\n'),
  straightQuotes: (s) => s.replace(/[\u2018\u2019\u201A\u2032]/g, "'").replace(/[\u201C\u201D\u201E\u2033]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\u2026/g, '...').replace(/\u00A0/g, ' '),
  slug: (s) => s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, ''),
  stripHtml: (s) => s.replace(/<(br|\/p|\/div|\/li|\/h\d)\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n').trim(),
};

export const LABELS = {
  upper: 'UPPERCASE', lower: 'lowercase', title: 'Title Case', sentence: 'Sentence case',
  squeeze: 'Tidy spaces', removeEmpty: 'Remove empty lines', unwrap: 'Join broken lines',
  dedupe: 'Remove duplicate lines', dedupeCI: 'Remove duplicates, ignore case',
  sortAZ: 'Sort A to Z', sortZA: 'Sort Z to A', reverse: 'Reverse lines', number: 'Number lines',
  straightQuotes: 'Plain quotes and dashes', slug: 'URL slug', stripHtml: 'Strip HTML',
};
