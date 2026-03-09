#!/usr/bin/env node
/**
 * add-sections.js — NEARY site
 * Adds "Nearby Areas" col to pages that have related-section but missing it.
 * Adds full 3-col related section to pages with no related sections at all.
 */

const fs = require('fs');
const path = require('path');

const DIR = process.platform === 'win32' ? 'C:\\appliancerepairneary' : '/c/appliancerepairneary';

// ─── City / Service data ────────────────────────────────────────────────────

const CITY_LABELS = {
  'mississauga': 'Mississauga',
  'brampton': 'Brampton',
  'oakville': 'Oakville',
  'burlington': 'Burlington',
  'etobicoke': 'Etobicoke',
  'rexdale': 'Rexdale',
  'malton': 'Malton',
  'port-credit': 'Port Credit',
  'streetsville': 'Streetsville',
  'meadowvale': 'Meadowvale',
  'caledon': 'Caledon',
  'milton': 'Milton',
  'toronto': 'Toronto',
  'north-york': 'North York',
  'scarborough': 'Scarborough',
  'vaughan': 'Vaughan',
  'richmond-hill': 'Richmond Hill',
  'markham': 'Markham',
  'pickering': 'Pickering',
  'ajax': 'Ajax',
  'oshawa': 'Oshawa',
  'whitby': 'Whitby',
  'newmarket': 'Newmarket',
  'aurora': 'Aurora',
  'barrie': 'Barrie',
  'hamilton': 'Hamilton',
  // Toronto neighbourhoods
  'bloor-west-village': 'Bloor West Village',
  'chinatown': 'Chinatown',
  'corso-italia': 'Corso Italia',
  'dufferin-grove': 'Dufferin Grove',
  'east-york': 'East York',
  'etobicoke-village': 'Etobicoke Village',
  'greektown': 'Greektown',
  'high-park': 'High Park',
  'king-west': 'King West',
  'little-italy': 'Little Italy',
  'little-portugal': 'Little Portugal',
  'midtown': 'Midtown Toronto',
  'ossington': 'Ossington',
  'roncesvalles': 'Roncesvalles',
  'st-lawrence': 'St. Lawrence',
  'swansea': 'Swansea',
  'the-beaches': 'The Beaches',
  'thorncliffe-park': 'Thorncliffe Park',
  'trinity-bellwoods': 'Trinity Bellwoods',
  'wychwood': 'Wychwood',
  // Alberta cities
  'calgary': 'Calgary',
  'edmonton': 'Edmonton',
  'airdrie': 'Airdrie',
  'beaumont': 'Beaumont',
  'canmore': 'Canmore',
  'chestermere': 'Chestermere',
  'cochrane': 'Cochrane',
  'devon': 'Devon',
  'fort-saskatchewan': 'Fort Saskatchewan',
  'high-river': 'High River',
  'langdon': 'Langdon',
  'leduc': 'Leduc',
  'okotoks': 'Okotoks',
  'sherwood-park': 'Sherwood Park',
  'spruce-grove': 'Spruce Grove',
  'st-albert': 'St. Albert',
  'stony-plain': 'Stony Plain',
  'strathmore': 'Strathmore',
};

// West GTA nearby-areas map (city → nearby cities list)
const NEARBY_MAP = {
  'mississauga':  ['brampton', 'oakville', 'etobicoke', 'toronto', 'port-credit'],
  'brampton':     ['mississauga', 'caledon', 'malton', 'rexdale', 'etobicoke'],
  'oakville':     ['mississauga', 'burlington', 'port-credit', 'etobicoke', 'milton'],
  'burlington':   ['oakville', 'mississauga', 'hamilton', 'milton', 'etobicoke'],
  'etobicoke':    ['mississauga', 'brampton', 'rexdale', 'toronto', 'malton'],
  'rexdale':      ['etobicoke', 'brampton', 'malton', 'mississauga', 'toronto'],
  'malton':       ['brampton', 'rexdale', 'mississauga', 'etobicoke', 'caledon'],
  'port-credit':  ['mississauga', 'oakville', 'etobicoke', 'streetsville', 'burlington'],
  'streetsville': ['mississauga', 'brampton', 'meadowvale', 'port-credit', 'oakville'],
  'meadowvale':   ['mississauga', 'brampton', 'streetsville', 'caledon', 'oakville'],
  'caledon':      ['brampton', 'malton', 'meadowvale', 'mississauga', 'milton'],
  'milton':       ['oakville', 'burlington', 'mississauga', 'caledon', 'etobicoke'],
  // fallback for non-West GTA cities
  'toronto':          ['mississauga', 'brampton', 'etobicoke', 'north-york', 'scarborough'],
  'north-york':       ['toronto', 'mississauga', 'etobicoke', 'brampton', 'scarborough'],
  'scarborough':      ['toronto', 'mississauga', 'etobicoke', 'brampton', 'north-york'],
  'vaughan':          ['toronto', 'mississauga', 'brampton', 'richmond-hill', 'etobicoke'],
  'richmond-hill':    ['toronto', 'mississauga', 'vaughan', 'markham', 'newmarket'],
  'markham':          ['toronto', 'mississauga', 'richmond-hill', 'scarborough', 'pickering'],
  // Toronto neighbourhoods → nearby neighbourhoods & cities
  'bloor-west-village': ['high-park', 'roncesvalles', 'swansea', 'etobicoke', 'toronto'],
  'chinatown':          ['little-portugal', 'little-italy', 'kensington', 'toronto', 'midtown'],
  'corso-italia':       ['little-italy', 'dufferin-grove', 'ossington', 'toronto', 'etobicoke'],
  'dufferin-grove':     ['little-portugal', 'ossington', 'corso-italia', 'toronto', 'brampton'],
  'east-york':          ['scarborough', 'toronto', 'greektown', 'thorncliffe-park', 'north-york'],
  'etobicoke-village':  ['etobicoke', 'bloor-west-village', 'swansea', 'roncesvalles', 'mississauga'],
  'greektown':          ['east-york', 'the-beaches', 'toronto', 'scarborough', 'thorncliffe-park'],
  'high-park':          ['bloor-west-village', 'roncesvalles', 'swansea', 'etobicoke', 'toronto'],
  'king-west':          ['trinity-bellwoods', 'ossington', 'toronto', 'little-portugal', 'etobicoke'],
  'little-italy':       ['corso-italia', 'little-portugal', 'dufferin-grove', 'ossington', 'toronto'],
  'little-portugal':    ['little-italy', 'ossington', 'dufferin-grove', 'toronto', 'etobicoke'],
  'midtown':            ['toronto', 'north-york', 'east-york', 'scarborough', 'etobicoke'],
  'ossington':          ['little-portugal', 'king-west', 'dufferin-grove', 'toronto', 'corso-italia'],
  'roncesvalles':       ['bloor-west-village', 'high-park', 'swansea', 'etobicoke', 'toronto'],
  'st-lawrence':        ['toronto', 'east-york', 'greektown', 'scarborough', 'the-beaches'],
  'swansea':            ['roncesvalles', 'bloor-west-village', 'high-park', 'etobicoke-village', 'etobicoke'],
  'the-beaches':        ['east-york', 'greektown', 'scarborough', 'toronto', 'st-lawrence'],
  'thorncliffe-park':   ['east-york', 'north-york', 'toronto', 'scarborough', 'greektown'],
  'trinity-bellwoods':  ['king-west', 'ossington', 'little-portugal', 'toronto', 'dufferin-grove'],
  'wychwood':           ['toronto', 'midtown', 'corso-italia', 'dufferin-grove', 'north-york'],
  // Alberta cities
  'calgary':            ['airdrie', 'chestermere', 'cochrane', 'okotoks', 'langdon'],
  'edmonton':           ['st-albert', 'sherwood-park', 'spruce-grove', 'leduc', 'fort-saskatchewan'],
  'airdrie':            ['calgary', 'cochrane', 'chestermere', 'langdon', 'strathmore'],
  'beaumont':           ['edmonton', 'leduc', 'devon', 'sherwood-park', 'fort-saskatchewan'],
  'canmore':            ['calgary', 'cochrane', 'airdrie', 'okotoks', 'high-river'],
  'chestermere':        ['calgary', 'airdrie', 'strathmore', 'langdon', 'cochrane'],
  'cochrane':           ['calgary', 'airdrie', 'canmore', 'chestermere', 'okotoks'],
  'devon':              ['edmonton', 'leduc', 'beaumont', 'spruce-grove', 'st-albert'],
  'fort-saskatchewan':  ['edmonton', 'sherwood-park', 'st-albert', 'spruce-grove', 'leduc'],
  'high-river':         ['calgary', 'okotoks', 'canmore', 'airdrie', 'cochrane'],
  'langdon':            ['calgary', 'chestermere', 'strathmore', 'airdrie', 'okotoks'],
  'leduc':              ['edmonton', 'beaumont', 'devon', 'sherwood-park', 'fort-saskatchewan'],
  'okotoks':            ['calgary', 'high-river', 'airdrie', 'cochrane', 'canmore'],
  'sherwood-park':      ['edmonton', 'fort-saskatchewan', 'st-albert', 'leduc', 'beaumont'],
  'spruce-grove':       ['edmonton', 'st-albert', 'devon', 'leduc', 'fort-saskatchewan'],
  'st-albert':          ['edmonton', 'spruce-grove', 'fort-saskatchewan', 'sherwood-park', 'leduc'],
  'stony-plain':        ['edmonton', 'spruce-grove', 'st-albert', 'devon', 'leduc'],
  'strathmore':         ['calgary', 'chestermere', 'langdon', 'airdrie', 'okotoks'],
};

// Service display names
const SERVICE_LABELS = {
  'fridge-repair':       'Refrigerator Repair',
  'washer-repair':       'Washer Repair',
  'dryer-repair':        'Dryer Repair',
  'dishwasher-repair':   'Dishwasher Repair',
  'oven-repair':         'Oven Repair',
  'stove-repair':        'Stove Repair',
  'range-repair':        'Range Repair',
  'dishwasher-installation': 'Dishwasher Installation',
  'freezer-repair':      'Freezer Repair',
  'microwave-repair':    'Microwave Repair',
};

// All services for the "Other Services" column
const ALL_SERVICES = [
  { slug: 'fridge-repair',     label: 'Refrigerator Repair' },
  { slug: 'washer-repair',     label: 'Washer Repair' },
  { slug: 'dryer-repair',      label: 'Dryer Repair' },
  { slug: 'dishwasher-repair', label: 'Dishwasher Repair' },
  { slug: 'oven-repair',       label: 'Oven Repair' },
  { slug: 'stove-repair',      label: 'Stove Repair' },
];

// Brand repair pages
const BRANDS = [
  { slug: 'samsung-repair',    label: 'Samsung' },
  { slug: 'lg-repair',         label: 'LG' },
  { slug: 'whirlpool-repair',  label: 'Whirlpool' },
  { slug: 'ge-repair',         label: 'GE' },
  { slug: 'bosch-repair',      label: 'Bosch' },
  { slug: 'frigidaire-repair', label: 'Frigidaire' },
  { slug: 'kenmore-repair',    label: 'Kenmore' },
  { slug: 'maytag-repair',     label: 'Maytag' },
];

// ─── Parse filename ─────────────────────────────────────────────────────────

/**
 * Extract service and city from filename.
 * e.g. dishwasher-repair-mississauga.html → { service: 'dishwasher-repair', city: 'mississauga' }
 * Returns null if no city can be determined.
 */
function parseFilename(basename) {
  const slug = basename.replace(/\.html$/, '');
  const knownCities = Object.keys(CITY_LABELS);

  // Try to find a city suffix
  for (const city of knownCities.sort((a, b) => b.length - a.length)) {
    if (slug === city) return { service: null, city };
    if (slug.endsWith('-' + city)) {
      const service = slug.slice(0, slug.length - city.length - 1);
      return { service: service || null, city };
    }
  }
  return { service: null, city: null };
}

// ─── HTML builders ──────────────────────────────────────────────────────────

function buildNearbyCol(service, city) {
  const nearbyList = (NEARBY_MAP[city] || ['mississauga', 'brampton', 'oakville', 'burlington', 'etobicoke']);
  const cityLabel = CITY_LABELS[city] || toTitleCase(city);
  const serviceLabel = (service && SERVICE_LABELS[service]) ? SERVICE_LABELS[service] : 'Appliance Repair';
  const serviceSlug = service || 'fridge-repair';

  const header = service
    ? `${serviceLabel} in Nearby Areas`
    : `Nearby Areas`;

  const items = nearbyList.map(c => {
    const cLabel = CITY_LABELS[c] || toTitleCase(c);
    const href = service ? `/${serviceSlug}-${c}` : `/fridge-repair-${c}`;
    return `<li><a href="${href}">${serviceLabel} in ${cLabel}</a></li>`;
  }).join('\n');

  return `      <div class="related-col">
        <h3>${header}</h3>
        <ul class="related-links">
          ${items}
        </ul>
      </div>`;
}

function buildServicesCol(service, city) {
  const cityLabel = city ? (CITY_LABELS[city] || toTitleCase(city)) : null;
  const header = cityLabel ? `Other Services Near ${cityLabel}` : 'Other Services Near You';
  const citySuffix = city ? `-${city}` : '-near-me';

  const services = ALL_SERVICES
    .filter(s => !service || s.slug !== service)
    .slice(0, 6);

  const items = services.map(s => {
    const href = city ? `/${s.slug}-${city}` : `/${s.slug}-near-me`;
    const label = cityLabel ? `${s.label} in ${cityLabel}` : `${s.label} Near Me`;
    return `<li><a href="${href}">${label}</a></li>`;
  }).join('\n');

  return `      <div class="related-col">
        <h3>${header}</h3>
        <ul class="related-links">
          ${items}
        </ul>
      </div>`;
}

function buildNearbyColCompact(service, city) {
  const nearbyList = (NEARBY_MAP[city] || ['mississauga', 'brampton', 'oakville', 'burlington', 'etobicoke']);
  const serviceLabel = (service && SERVICE_LABELS[service]) ? SERVICE_LABELS[service] : 'Appliance Repair';
  const serviceSlug = service || 'fridge-repair';

  const items = nearbyList.map(c => {
    const cLabel = CITY_LABELS[c] || toTitleCase(c);
    const href = service ? `/${serviceSlug}-${c}` : `/fridge-repair-${c}`;
    return `<li><a href="${href}">${serviceLabel} in ${cLabel}</a></li>`;
  }).join('\n');

  return `<div class="related-col"><h3>Nearby Areas</h3><ul class="related-list">
${items}
</ul></div>`;
}

function buildBrandsCol(service) {
  const serviceLabel = (service && SERVICE_LABELS[service]) ? SERVICE_LABELS[service] : 'Appliance Repair';
  // Map brand slugs to service-specific slugs if possible
  const brandSuffix = service ? `-${service}` : '-repair';

  const items = BRANDS.map(b => {
    // Use specific brand+service slug if service is known, else generic brand slug
    let href;
    if (service && ['fridge-repair','washer-repair','dryer-repair','dishwasher-repair','oven-repair','stove-repair'].includes(service)) {
      href = `/${b.label.toLowerCase()}-${service}`;
    } else {
      href = `/${b.slug}`;
    }
    return `<li><a href="${href}">${b.label}</a></li>`;
  }).join('\n');

  return `      <div class="related-col">
        <h3>Brands We Service</h3>
        <ul class="related-links" style="list-style:none;padding-left:0">
          ${items}
        </ul>
      </div>`;
}

function buildFullRelatedSection(service, city) {
  const servicesCol = buildServicesCol(service, city);
  const nearbyCol = buildNearbyCol(service, city);
  const brandsCol = buildBrandsCol(service);

  return `\n<!-- ============================
     RELATED PAGES
============================= -->
<section class="related-section" id="related">
  <div class="container">
    <div class="related-grid">
${servicesCol}
${nearbyCol}
${brandsCol}
    </div>
  </div>
</section>\n`;
}

function toTitleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Insertion logic ────────────────────────────────────────────────────────

/**
 * For pages that already have related-section but are missing Nearby Areas:
 * Insert a nearby-col as second column inside the existing related grid.
 * Handles both: related-grid and related-links-grid containers.
 */
function insertNearbyColIntoExistingSection(content, service, city) {
  const nearbyCol = buildNearbyCol(service, city);

  // Try to find any grid container: related-grid or related-links-grid
  // then find the first related-col end within it.
  const gridPatterns = ['related-grid', 'related-links-grid', 'related-cols'];
  let afterGrid = -1;

  for (const pat of gridPatterns) {
    const idx = content.indexOf(pat);
    if (idx !== -1) {
      afterGrid = content.indexOf('>', idx) + 1;
      break;
    }
  }

  // If no grid found, try finding the first related-col directly
  if (afterGrid === -1) {
    const colIdx = content.indexOf('related-col');
    if (colIdx === -1) return null;
    afterGrid = 0; // search from beginning
  }

  const firstColEnd = findFirstRelatedColEnd(content, afterGrid);
  if (firstColEnd === -1) return null;

  // For pages with related-links-grid (2-col style), use compact format
  const isCompactStyle = content.includes('related-links-grid') || content.includes('related-list');
  let insertHtml;
  if (isCompactStyle) {
    insertHtml = buildNearbyColCompact(service, city);
  } else {
    insertHtml = nearbyCol;
  }

  return content.slice(0, firstColEnd) + '\n' + insertHtml + content.slice(firstColEnd);
}

/**
 * Find the index just after the first </div> that closes the first related-col.
 * We count nested divs starting from the first related-col opening.
 * Handles both pretty-printed and compact/minified HTML.
 */
function findFirstRelatedColEnd(content, startFrom) {
  // Find the first 'related-col' occurrence after startFrom
  const colStart = content.indexOf('related-col', startFrom);
  if (colStart === -1) return -1;

  // Find the opening <div that contains related-col (look back for <div)
  const divStart = content.lastIndexOf('<div', colStart);
  if (divStart === -1) return -1;

  let depth = 0;
  let i = divStart;

  while (i < content.length) {
    if (content[i] !== '<') { i++; continue; }

    if (content.slice(i, i + 2) === '</') {
      // closing tag — find end
      const tagEnd = content.indexOf('>', i);
      if (tagEnd === -1) break;
      const tagName = content.slice(i + 2, tagEnd).trim().split(/\s/)[0].toLowerCase();
      if (tagName === 'div') {
        depth--;
        if (depth === 0) {
          return tagEnd + 1;
        }
      }
      i = tagEnd + 1;
    } else {
      // opening tag
      const tagEnd = content.indexOf('>', i);
      if (tagEnd === -1) break;
      const tagContent = content.slice(i + 1, tagEnd);
      // Self-closing tags
      if (tagContent.endsWith('/') || /^(input|br|hr|img|link|meta|area|base|col|embed|param|source|track|wbr)(\s|$)/i.test(tagContent.trim())) {
        i = tagEnd + 1;
        continue;
      }
      const tagName = tagContent.trim().split(/[\s>]/)[0].toLowerCase();
      if (tagName === 'div') {
        depth++;
      }
      i = tagEnd + 1;
    }
  }
  return -1;
}

/**
 * Find footer insertion point: before <!-- Footer --> or <footer or <div id="footer-placeholder">
 */
function findFooterInsertionPoint(content) {
  const markers = ['<!-- Footer -->', '<footer', '<div id="footer-placeholder">'];
  let earliest = -1;
  for (const marker of markers) {
    const idx = content.indexOf(marker);
    if (idx !== -1 && (earliest === -1 || idx < earliest)) {
      earliest = idx;
    }
  }
  return earliest;
}

// ─── Skip list ──────────────────────────────────────────────────────────────

const SKIP_FILES = new Set([
  '404.html', 'about.html', 'areas.html', 'book.html', 'brands.html',
  'contact.html', 'index.html', 'privacy.html', 'terms.html', 'sitemap.html',
  'llms.txt', 'robots.txt',
]);

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.html'));

  let addedNearbyOnly = 0;    // had sections but no Nearby Areas
  let addedFullSection = 0;   // had nothing
  let alreadyComplete = 0;    // already had Nearby Areas
  let skipped = 0;
  const errors = [];

  for (const file of files) {
    if (SKIP_FILES.has(file)) {
      skipped++;
      continue;
    }

    const filepath = path.join(DIR, file);
    let content;
    try {
      content = fs.readFileSync(filepath, 'utf8');
    } catch (e) {
      errors.push(`Read error: ${file}: ${e.message}`);
      continue;
    }

    const hasNearbyAreas = content.includes('Nearby Areas');
    const hasRelatedSection = content.includes('related-section') ||
                              content.includes('Related Services') ||
                              content.includes('Brands We Service') ||
                              content.includes('related-list') ||
                              content.includes('related-grid');

    if (hasNearbyAreas) {
      alreadyComplete++;
      continue;
    }

    const { service, city } = parseFilename(file);

    if (hasRelatedSection) {
      // Case 3a: Has related sections but missing Nearby Areas
      // Need a city to generate nearby areas
      if (!city) {
        // No city in filename — use 'mississauga' as default for West GTA
        let newContent = insertNearbyColIntoExistingSection(content, service, 'mississauga');
        if (newContent && newContent !== content) {
          try {
            fs.writeFileSync(filepath, newContent, 'utf8');
            addedNearbyOnly++;
          } catch (e) {
            errors.push(`Write error: ${file}: ${e.message}`);
          }
        } else {
          // Fallback: insert full section before footer
          const insertAt = findFooterInsertionPoint(content);
          if (insertAt !== -1) {
            const fullSection = buildFullRelatedSection(service, 'mississauga');
            newContent = content.slice(0, insertAt) + fullSection + content.slice(insertAt);
            try {
              fs.writeFileSync(filepath, newContent, 'utf8');
              addedNearbyOnly++;
            } catch (e) {
              errors.push(`Write error (fallback): ${file}: ${e.message}`);
            }
          } else {
            errors.push(`Could not insert into no-city page: ${file}`);
          }
        }
        continue;
      }

      let newContent = insertNearbyColIntoExistingSection(content, service, city);
      if (newContent && newContent !== content) {
        try {
          fs.writeFileSync(filepath, newContent, 'utf8');
          addedNearbyOnly++;
        } catch (e) {
          errors.push(`Write error: ${file}: ${e.message}`);
        }
      } else {
        // Fallback: insert a full section before footer
        const insertAt = findFooterInsertionPoint(content);
        if (insertAt !== -1) {
          const effectiveCity = city || 'mississauga';
          const fullSection = buildFullRelatedSection(service, effectiveCity);
          newContent = content.slice(0, insertAt) + fullSection + content.slice(insertAt);
          try {
            fs.writeFileSync(filepath, newContent, 'utf8');
            addedNearbyOnly++;
          } catch (e) {
            errors.push(`Write error (fallback): ${file}: ${e.message}`);
          }
        } else {
          errors.push(`Could not insert Nearby Areas into: ${file}`);
        }
      }
    } else {
      // Case 3b: No related sections at all — add full section
      const insertAt = findFooterInsertionPoint(content);
      if (insertAt === -1) {
        errors.push(`No footer marker found in: ${file}`);
        continue;
      }

      const effectiveCity = city || 'mississauga';
      const fullSection = buildFullRelatedSection(service, effectiveCity);
      const newContent = content.slice(0, insertAt) + fullSection + content.slice(insertAt);

      try {
        fs.writeFileSync(filepath, newContent, 'utf8');
        addedFullSection++;
      } catch (e) {
        errors.push(`Write error: ${file}: ${e.message}`);
      }
    }
  }

  console.log('\n=== NEARY add-sections.js Results ===');
  console.log(`Total HTML files processed: ${files.length}`);
  console.log(`Already complete (had Nearby Areas): ${alreadyComplete}`);
  console.log(`Added Nearby Areas to existing sections: ${addedNearbyOnly}`);
  console.log(`Added full 3-col related section: ${addedFullSection}`);
  console.log(`Skipped (non-content pages): ${skipped}`);
  console.log(`Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('\nError details:');
    errors.forEach(e => console.log('  -', e));
  }
  console.log('\nDone.');
}

main();
