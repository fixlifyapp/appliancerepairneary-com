/**
 * fix-internal-links.js
 * Fixes internal linking on the NEARY appliance repair site:
 *   1. Brand links in "Brands We Service" sections on service+city pages
 *   2. Location buttons missing href (if any found)
 *   3. City links on brand hub pages (if cities are in plain text)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);

// ─── Config ──────────────────────────────────────────────────────────────────

const SKIP_FILES = new Set([
  '404.html',
  'about.html',
  'privacy.html',
  'terms.html',
  'contact.html',
  'sitemap.html',
  'thank-you.html',
  'for-businesses.html',
  'index.html',
]);

// Files to skip by prefix
const SKIP_PREFIXES = [
  'privacy',
  'terms',
  'contact',
  'sitemap',
];

// Brand name → slug
const BRAND_SLUG = {
  'Samsung':     'samsung',
  'LG':          'lg',
  'Whirlpool':   'whirlpool',
  'GE':          'ge',
  'Bosch':       'bosch',
  'Frigidaire':  'frigidaire',
  'Kenmore':     'kenmore',
  'Maytag':      'maytag',
  'KitchenAid':  'kitchenaid',
  'Miele':       'miele',
  'Electrolux':  'electrolux',
  'Amana':       'amana',
  'Speed Queen': 'speed-queen',
};

// All brand names (sorted longest-first to avoid partial matches)
const BRAND_NAMES = Object.keys(BRAND_SLUG).sort((a, b) => b.length - a.length);

// Service slug detection from filename
function getServiceSlug(filename) {
  const f = filename.toLowerCase();
  if (f.includes('dishwasher')) return 'dishwasher';
  if (f.includes('fridge') || f.includes('refrigerator')) return 'fridge';
  if (f.includes('washer')) return 'washer';
  if (f.includes('dryer')) return 'dryer';
  if (f.includes('oven')) return 'oven';
  if (f.includes('stove')) return 'stove';
  return null;
}

// Check if a file exists in the root
function fileExists(filename) {
  return fs.existsSync(path.join(ROOT, filename));
}

// Get best brand page href for a brand + service context
function getBrandHref(brandName, serviceSlug) {
  const slug = BRAND_SLUG[brandName];
  if (!slug) return null;

  // Try most specific first: {brand}-{service}-repair.html
  if (serviceSlug) {
    const specific = `${slug}-${serviceSlug}-repair.html`;
    if (fileExists(specific)) return `/${slug}-${serviceSlug}-repair`;
  }

  // Fall back to general brand page: {brand}-repair.html
  const general = `${slug}-repair.html`;
  if (fileExists(general)) return `/${slug}-repair`;

  // Neither exists
  return null;
}

// City name → slug mapping for brand pages
const CITY_SLUG = {
  'Toronto':         'toronto',
  'Mississauga':     'mississauga',
  'Brampton':        'brampton',
  'Scarborough':     'scarborough',
  'North York':      'north-york',
  'Etobicoke':       'etobicoke',
  'Vaughan':         'vaughan',
  'Richmond Hill':   'richmond-hill',
  'Markham':         'markham',
  'Oakville':        'oakville',
  'Burlington':      'burlington',
  'Pickering':       'pickering',
  'Ajax':            'ajax',
  'Whitby':          'whitby',
  'Oshawa':          'oshawa',
  'Newmarket':       'newmarket',
  'Aurora':          'aurora',
  'Barrie':          'barrie',
  'Hamilton':        'hamilton',
  'Mississauga':     'mississauga',
};

const CITY_NAMES = Object.keys(CITY_SLUG).sort((a, b) => b.length - a.length);

// ─── Brand page files (hub pages that may need city link fixes) ───────────────

const BRAND_HUB_FILES = [
  'samsung-repair.html',
  'lg-repair.html',
  'whirlpool-repair.html',
  'bosch-repair.html',
  'frigidaire-repair.html',
  'ge-repair.html',
  'kenmore-repair.html',
  'kitchenaid-repair.html',
  'maytag-repair.html',
  'miele-repair.html',
];

// ─── Stats ────────────────────────────────────────────────────────────────────

let totalFilesChanged = 0;
let totalBrandLinksAdded = 0;
let totalLocationLinksFixed = 0;
let totalCityLinksAdded = 0;

const changes = [];

// ─── Helper: fix brand list items in a HTML string ───────────────────────────

function fixBrandLinks(content, serviceSlug, filename) {
  let changed = false;
  let localCount = 0;

  for (const brandName of BRAND_NAMES) {
    // Match <li>BrandName</li> (no <a inside)
    // Use a regex that checks the <li> content does NOT start with <a
    const pattern = new RegExp(
      `(<li>)(${escapeRegex(brandName)})(</li>)`,
      'g'
    );

    content = content.replace(pattern, (match, open, name, close) => {
      const href = getBrandHref(name, serviceSlug);
      if (href) {
        localCount++;
        changed = true;
        return `${open}<a href="${href}">${name}</a>${close}`;
      }
      return match; // leave as-is if no page found
    });
  }

  if (changed) {
    totalBrandLinksAdded += localCount;
    changes.push(`  ${filename}: +${localCount} brand link(s) in "Brands We Service"`);
  }

  return { content, changed };
}

// ─── Helper: fix anchor tags missing href in location grids ──────────────────

function fixMissingHrefLinks(content, filename) {
  // Find <a ... > (no href) wrapping a city-like text or button
  // Pattern: <a class="...">CityName</a>  OR  <a>CityName</a>
  const pattern = /<a(\s+[^>]*?)?>([^<]{2,40})<\/a>/g;
  let changed = false;
  let localCount = 0;

  content = content.replace(pattern, (match, attrs, inner) => {
    // Only process if attrs has no href
    if (attrs && /href\s*=/i.test(attrs)) return match;

    // Check if inner text looks like a city name
    const cityName = inner.trim();
    const slug = CITY_SLUG[cityName];
    if (!slug) return match;

    const newAttrs = attrs ? attrs.trim() : '';
    const newTag = `<a href="/${slug}.html"${newAttrs ? ' ' + newAttrs : ''}>${cityName}</a>`;
    localCount++;
    changed = true;
    return newTag;
  });

  if (changed) {
    totalLocationLinksFixed += localCount;
    changes.push(`  ${filename}: +${localCount} location href(s) added`);
  }

  return { content, changed };
}

// ─── Helper: fix plain-text city items on brand hub pages ────────────────────

function fixBrandPageCityLinks(content, brandSlug, filename) {
  let changed = false;
  let localCount = 0;

  for (const cityName of CITY_NAMES) {
    const citySlug = CITY_SLUG[cityName];

    // Match <li>CityName</li> (no <a inside)
    const pattern = new RegExp(
      `(<li>)(${escapeRegex(cityName)})(</li>)`,
      'g'
    );

    content = content.replace(pattern, (match, open, name, close) => {
      // Prefer brand-specific city page, then general city page
      const brandCityPage = `${brandSlug}-repair-${citySlug}.html`;
      const cityPage = `${citySlug}.html`;

      let href = null;
      if (fileExists(brandCityPage)) {
        href = `/${brandSlug}-repair-${citySlug}`;
      } else if (fileExists(cityPage)) {
        href = `/${citySlug}`;
      }

      if (href) {
        localCount++;
        changed = true;
        return `${open}<a href="${href}">${name}</a>${close}`;
      }
      return match;
    });

    // Also handle <span>CityName</span>
    const spanPattern = new RegExp(
      `(<span>)(${escapeRegex(cityName)})(</span>)`,
      'g'
    );

    content = content.replace(spanPattern, (match, open, name, close) => {
      const brandCityPage = `${brandSlug}-repair-${citySlug}.html`;
      const cityPage = `${citySlug}.html`;

      let href = null;
      if (fileExists(brandCityPage)) {
        href = `/${brandSlug}-repair-${citySlug}`;
      } else if (fileExists(cityPage)) {
        href = `/${citySlug}`;
      }

      if (href) {
        localCount++;
        changed = true;
        return `<span><a href="${href}">${name}</a></span>`;
      }
      return match;
    });
  }

  if (changed) {
    totalCityLinksAdded += localCount;
    changes.push(`  ${filename}: +${localCount} city link(s) on brand hub page`);
  }

  return { content, changed };
}

// ─── Escape regex special chars ───────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── Determine if a file should be processed ─────────────────────────────────

function shouldSkip(filename) {
  if (SKIP_FILES.has(filename)) return true;
  for (const prefix of SKIP_PREFIXES) {
    if (filename.startsWith(prefix)) return true;
  }
  // Skip blog pages (they're in the blog/ subdirectory anyway, but just in case)
  if (filename.startsWith('blog')) return true;
  return false;
}

// ─── Determine if a file is a brand hub page ─────────────────────────────────

function getBrandSlugFromFilename(filename) {
  // e.g. samsung-repair.html → samsung
  for (const [brandName, slug] of Object.entries(BRAND_SLUG)) {
    if (filename === `${slug}-repair.html`) return slug;
  }
  return null;
}

// ─── Main processing ──────────────────────────────────────────────────────────

function processFile(filename) {
  const filepath = path.join(ROOT, filename);
  let content = fs.readFileSync(filepath, 'utf8');
  const original = content;

  const brandSlug = getBrandSlugFromFilename(filename);
  const serviceSlug = getServiceSlug(filename);

  let anyChange = false;

  // Step 1: Fix brand links in "Brands We Service" sections
  // Only apply to service+city pages (not brand hub pages, not skipped files)
  if (!brandSlug) {
    const r1 = fixBrandLinks(content, serviceSlug, filename);
    content = r1.content;
    if (r1.changed) anyChange = true;
  }

  // Step 2: Fix missing href on location anchor tags
  const r2 = fixMissingHrefLinks(content, filename);
  content = r2.content;
  if (r2.changed) anyChange = true;

  // Step 3: Fix plain-text city items on brand hub pages
  if (brandSlug) {
    const r3 = fixBrandPageCityLinks(content, brandSlug, filename);
    content = r3.content;
    if (r3.changed) anyChange = true;
  }

  if (anyChange) {
    fs.writeFileSync(filepath, content, 'utf8');
    totalFilesChanged++;
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

function main() {
  console.log('fix-internal-links.js — NEARY site\n');
  console.log('Root:', ROOT);
  console.log('');

  // Get all HTML files in root only (not subdirs)
  const allFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  const filesToProcess = allFiles.filter(f => !shouldSkip(f));

  console.log(`Total HTML files found: ${allFiles.length}`);
  console.log(`Files to process (after skips): ${filesToProcess.length}`);
  console.log('');

  for (const filename of filesToProcess) {
    processFile(filename);
  }

  console.log('=== Results ===');
  console.log(`Files modified:          ${totalFilesChanged}`);
  console.log(`Brand links added:       ${totalBrandLinksAdded}`);
  console.log(`Location hrefs fixed:    ${totalLocationLinksFixed}`);
  console.log(`City links on brand hubs: ${totalCityLinksAdded}`);
  console.log('');

  if (changes.length > 0) {
    console.log('Changes by file:');
    changes.forEach(c => console.log(c));
  } else {
    console.log('No changes needed — all links already correct.');
  }
}

main();
