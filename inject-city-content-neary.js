#!/usr/bin/env node
/**
 * inject-city-content-neary.js — Inject Gemini-generated city content into NEARY pages
 *
 * Reads city-content-data.json and replaces the first long <p> after H1
 * in each city page with city-specific content paragraphs.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA_FILE = 'C:/NikaApplianceRepair/city-content-data.json';
const MARKER = '<!-- CITY-CONTENT-v2 -->';

// Load city content data
let cityContent;
try {
  cityContent = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
} catch (e) {
  console.error('ERROR: Cannot read', DATA_FILE, e.message);
  process.exit(1);
}

console.log(`Loaded ${Object.keys(cityContent).length} cities from city-content-data.json\n`);

// Normalize city slug to match data keys
// E.g., "the-beaches" -> "beaches", "the-annex" -> "annex"
function normalizeCityKey(slug) {
  // Direct match first
  if (cityContent[slug]) return slug;
  // Try without "the-" prefix
  if (slug.startsWith('the-') && cityContent[slug.slice(4)]) return slug.slice(4);
  // Try with "the-" prefix
  if (cityContent['the-' + slug]) return 'the-' + slug;
  return null;
}

// Extract city slug from filename
function extractCity(filename) {
  const base = filename.replace('.html', '');
  const prefixes = [
    'dishwasher-installation-', 'dishwasher-repair-', 'washer-repair-',
    'dryer-repair-', 'fridge-repair-', 'oven-repair-', 'stove-repair-',
    'gas-stove-repair-', 'gas-oven-repair-', 'gas-dryer-repair-',
    'gas-appliance-repair-', 'bosch-repair-', 'samsung-repair-',
    'lg-repair-', 'whirlpool-repair-', 'frigidaire-repair-',
    'ge-repair-', 'kitchenaid-repair-', 'maytag-repair-',
    'miele-repair-', 'kenmore-repair-', 'electrolux-repair-',
    'freezer-repair-', 'microwave-repair-', 'range-repair-'
  ];
  // Sort by length descending to match longest prefix first
  prefixes.sort((a, b) => b.length - a.length);
  for (const prefix of prefixes) {
    if (base.startsWith(prefix)) {
      const city = base.slice(prefix.length);
      if (city && city !== 'near-me') return city;
    }
  }
  return null;
}

// Split content into 3 paragraphs
function splitInto3Paragraphs(text) {
  // First split on double newlines if present
  const parts = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (parts.length >= 3) return parts.slice(0, 3);
  if (parts.length === 2) {
    // Try splitting the longer part by sentences
    const longer = parts[0].length > parts[1].length ? 0 : 1;
    const sentences = parts[longer].match(/[^.!?]+[.!?]+/g) || [parts[longer]];
    if (sentences.length >= 2) {
      const mid = Math.ceil(sentences.length / 2);
      const first = sentences.slice(0, mid).join('').trim();
      const second = sentences.slice(mid).join('').trim();
      if (longer === 0) return [first, second, parts[1]];
      return [parts[0], first, second];
    }
    return [parts[0], parts[1], parts[1]]; // duplicate if can't split
  }
  // Single paragraph — split by sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  if (sentences.length >= 3) {
    const third = Math.ceil(sentences.length / 3);
    return [
      sentences.slice(0, third).join('').trim(),
      sentences.slice(third, third * 2).join('').trim(),
      sentences.slice(third * 2).join('').trim()
    ];
  }
  if (sentences.length === 2) {
    return [sentences[0].trim(), sentences[1].trim(), sentences[1].trim()];
  }
  // Can't split — return as single paragraph with marker
  return [text.trim()];
}

// Find and replace the first long <p> after H1 in the main content area
function injectContent(html, citySlug) {
  // Already processed
  if (html.includes(MARKER)) return null;

  const key = normalizeCityKey(citySlug);
  if (!key || !cityContent[key]) return null;

  const rawContent = cityContent[key];
  const paragraphs = splitInto3Paragraphs(rawContent);

  // Build replacement HTML
  const newHtml = MARKER + '\n' + paragraphs.map(p =>
    `    <p class="city-v2">${p.trim()}</p>`
  ).join('\n');

  // Strategy 1: Find first <p> longer than 200 chars inside content-intro or content-body (after h2)
  // Pattern: <h2>...</h2>\s*<p>[200+ chars]</p>
  const contentBlockRegex = /(<div class="(?:content-intro|content-body)[^"]*">\s*<h2>[^<]*<\/h2>\s*)<p>([^<]{200,})<\/p>/;
  let match = html.match(contentBlockRegex);
  if (match) {
    return html.replace(contentBlockRegex, `${match[1]}${newHtml}`);
  }

  // Strategy 2: After "About CityName" h2 — <h2>About ...</h2>\s*<p>[long]</p>
  const aboutRegex = /(<h2>About [^<]*<\/h2>\s*)<p>([^<]{200,})<\/p>/;
  match = html.match(aboutRegex);
  if (match) {
    return html.replace(aboutRegex, `${match[1]}${newHtml}`);
  }

  // Strategy 3: First <section> with <h2> and long <p>
  const sectionRegex = /(<section[^>]*>\s*<div[^>]*>\s*<(?:div[^>]*>\s*)?<h2>[^<]*<\/h2>\s*)<p>([^<]{200,})<\/p>/;
  match = html.match(sectionRegex);
  if (match) {
    return html.replace(sectionRegex, `${match[1]}${newHtml}`);
  }

  // Strategy 4: Any <h2> followed by long <p> after </head>
  const bodyStart = html.indexOf('</head>');
  if (bodyStart > -1) {
    const bodyHtml = html.substring(bodyStart);
    const h2pRegex = /(<h2>[^<]*<\/h2>\s*)<p>([^<]{200,})<\/p>/;
    match = bodyHtml.match(h2pRegex);
    if (match) {
      const fullMatch = match[0];
      const insertPos = bodyStart + bodyHtml.indexOf(fullMatch);
      const replacement = `${match[1]}${newHtml}`;
      return html.substring(0, insertPos) + replacement + html.substring(insertPos + fullMatch.length);
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════
function main() {
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let updated = 0;
  let skipped = 0;
  let noData = 0;
  let noInsert = 0;
  let alreadyDone = 0;

  for (const file of files) {
    const city = extractCity(file);
    if (!city) { skipped++; continue; }

    const filePath = path.join(ROOT, file);
    const html = fs.readFileSync(filePath, 'utf-8');

    if (html.includes(MARKER)) { alreadyDone++; continue; }

    const key = normalizeCityKey(city);
    if (!key) { noData++; continue; }

    const result = injectContent(html, city);
    if (result) {
      fs.writeFileSync(filePath, result, 'utf-8');
      updated++;
      console.log(`  + ${file} (${key})`);
    } else {
      noInsert++;
    }
  }

  console.log(`\n========================================`);
  console.log(`NEARY City Content v2 Injection`);
  console.log(`========================================`);
  console.log(`Updated:      ${updated} pages`);
  console.log(`Already done: ${alreadyDone} pages`);
  console.log(`No data:      ${noData} pages (city not in JSON)`);
  console.log(`No insert pt: ${noInsert} pages`);
  console.log(`Skipped:      ${skipped} pages (non-city)`);
  console.log(`Total files:  ${files.length}`);
}

main();
