#!/usr/bin/env node
/**
 * fix-technical-seo.js
 * Fixes canonical tags, OG tags, robots meta, and schema URLs
 * on all root *.html files for appliancerepairneary.com
 */

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.resolve(__dirname);
const BASE_URL = 'https://appliancerepairneary.com';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;

// Counters
let stats = {
  processed: 0,
  canonicalAdded: 0,
  canonicalFixed: 0,
  ogUrlAdded: 0,
  ogUrlFixed: 0,
  ogTypeAdded: 0,
  ogImageAdded: 0,
  ogTitleAdded: 0,
  ogDescAdded: 0,
  noindexRemoved: 0,
  schemaFixed: 0,
};

// Get all root-level HTML files (skip blog/ subdir)
const files = fs.readdirSync(SITE_DIR)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(SITE_DIR, f));

console.log(`Found ${files.length} HTML files to process...\n`);

for (const filePath of files) {
  const filename = path.basename(filePath);
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Determine canonical slug
  let slug;
  if (filename === 'index.html') {
    slug = '/';
  } else {
    slug = '/' + filename.replace(/\.html$/, '');
  }
  const canonicalUrl = slug === '/' ? `${BASE_URL}/` : `${BASE_URL}${slug}`;
  const pageUrl = canonicalUrl;

  // ── 1. ROBOTS META ──────────────────────────────────────────────────────────
  // Remove noindex from all pages EXCEPT 404.html
  if (filename !== '404.html') {
    const noindexRegex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["'][^>]*>/gi;
    if (noindexRegex.test(html)) {
      html = html.replace(noindexRegex, '');
      stats.noindexRemoved++;
      changed = true;
      console.log(`  [robots] Removed noindex from ${filename}`);
    }
  }

  // ── 2. CANONICAL TAG ────────────────────────────────────────────────────────
  const canonicalTagRegex = /<link\s[^>]*rel=["']canonical["'][^>]*>/gi;
  const canonicalHrefRegex = /href=["']([^"']*)["']/i;

  const existingCanonicals = html.match(canonicalTagRegex);

  if (!existingCanonicals) {
    // No canonical — add one after <meta charset
    const charsetRegex = /(<meta\s[^>]*charset[^>]*>)/i;
    if (charsetRegex.test(html)) {
      html = html.replace(charsetRegex, `$1\n  <link rel="canonical" href="${canonicalUrl}">`);
    } else {
      // Fallback: insert right after <head>
      html = html.replace(/<head>/i, `<head>\n  <link rel="canonical" href="${canonicalUrl}">`);
    }
    stats.canonicalAdded++;
    changed = true;
    console.log(`  [canonical] Added to ${filename}`);
  } else {
    // Check if the existing canonical is correct
    const match = existingCanonicals[0].match(canonicalHrefRegex);
    if (match) {
      const existingHref = match[1];
      // Fix if wrong domain or template placeholder
      const isWrongDomain = !existingHref.startsWith(BASE_URL) &&
        existingHref !== '' &&
        !existingHref.startsWith('{{');
      const isTemplate = existingHref.includes('{{');

      if (isWrongDomain || isTemplate) {
        html = html.replace(
          existingCanonicals[0],
          `<link rel="canonical" href="${canonicalUrl}">`
        );
        stats.canonicalFixed++;
        changed = true;
        console.log(`  [canonical] Fixed in ${filename} (was: ${existingHref})`);
      }
    }
  }

  // ── 3. OG TAGS ──────────────────────────────────────────────────────────────

  // Helper: get meta tag value by property
  const getOgValue = (prop) => {
    const re = new RegExp(`<meta\\s[^>]*property=["']${prop}["'][^>]*>`, 'gi');
    const tagMatch = html.match(re);
    if (!tagMatch) return null;
    const contentMatch = tagMatch[0].match(/content=["']([^"']*)["']/i);
    return contentMatch ? contentMatch[1] : '';
  };

  // Helper: fix or set an OG tag
  const fixOgTag = (prop, value) => {
    const re = new RegExp(`<meta\\s[^>]*property=["']${prop}["'][^>]*>`, 'gi');
    const existing = html.match(re);
    if (!existing) {
      return false; // tag missing — will add later
    }
    const contentMatch = existing[0].match(/content=["']([^"']*)["']/i);
    if (contentMatch) {
      const existingVal = contentMatch[1];
      if (!existingVal.startsWith(BASE_URL) && existingVal !== '' && !existingVal.startsWith('{{')) {
        html = html.replace(existing[0], `<meta property="${prop}" content="${value}">`);
        return true;
      }
    }
    return false;
  };

  // Get title and description for fallback
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].trim() : '';
  const descMatch = html.match(/<meta\s[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                    html.match(/<meta\s[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const pageDesc = descMatch ? descMatch[1].trim() : '';

  const hasOgUrl = /<meta\s[^>]*property=["']og:url["'][^>]*>/i.test(html);
  const hasOgType = /<meta\s[^>]*property=["']og:type["'][^>]*>/i.test(html);
  const hasOgImage = /<meta\s[^>]*property=["']og:image["'][^>]*>/i.test(html);
  const hasOgTitle = /<meta\s[^>]*property=["']og:title["'][^>]*>/i.test(html);
  const hasOgDesc = /<meta\s[^>]*property=["']og:description["'][^>]*>/i.test(html);

  // Fix wrong og:url domain
  if (hasOgUrl) {
    const ogUrlTagRe = /<meta\s[^>]*property=["']og:url["'][^>]*>/gi;
    const ogUrlTag = html.match(ogUrlTagRe);
    if (ogUrlTag) {
      const contentMatch = ogUrlTag[0].match(/content=["']([^"']*)["']/i);
      if (contentMatch && contentMatch[1] && !contentMatch[1].startsWith(BASE_URL)) {
        html = html.replace(ogUrlTag[0], `<meta property="og:url" content="${pageUrl}">`);
        stats.ogUrlFixed++;
        changed = true;
        console.log(`  [og:url] Fixed domain in ${filename}`);
      }
    }
  }

  // Build list of tags to inject for missing ones
  const tagsToInject = [];

  if (!hasOgUrl) {
    tagsToInject.push(`  <meta property="og:url" content="${pageUrl}">`);
    stats.ogUrlAdded++;
  }
  if (!hasOgType) {
    tagsToInject.push(`  <meta property="og:type" content="website">`);
    stats.ogTypeAdded++;
  }
  if (!hasOgImage) {
    tagsToInject.push(`  <meta property="og:image" content="${OG_IMAGE}">`);
    stats.ogImageAdded++;
  }
  if (!hasOgTitle && pageTitle) {
    tagsToInject.push(`  <meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}">`);
    stats.ogTitleAdded++;
  }
  if (!hasOgDesc && pageDesc) {
    tagsToInject.push(`  <meta property="og:description" content="${pageDesc.replace(/"/g, '&quot;')}">`);
    stats.ogDescAdded++;
  }

  if (tagsToInject.length > 0) {
    // Find a good injection point: after canonical, or after charset, or before </head>
    const injectionBlock = tagsToInject.join('\n');

    // Try to inject after the canonical tag
    const canonicalFinalRe = /<link\s[^>]*rel=["']canonical["'][^>]*>/i;
    const hasCanonical = canonicalFinalRe.test(html);

    if (hasCanonical) {
      html = html.replace(canonicalFinalRe, (match) => `${match}\n${injectionBlock}`);
    } else {
      // Inject before </head>
      html = html.replace(/<\/head>/i, `${injectionBlock}\n</head>`);
    }

    changed = true;
    if (!hasOgUrl) console.log(`  [og:url] Added to ${filename}`);
    if (!hasOgType) console.log(`  [og:type] Added to ${filename}`);
    if (!hasOgImage) console.log(`  [og:image] Added to ${filename}`);
    if (!hasOgTitle && pageTitle) console.log(`  [og:title] Added to ${filename}`);
    if (!hasOgDesc && pageDesc) console.log(`  [og:desc] Added to ${filename}`);
  }

  // ── 4. SCHEMA.ORG — fix wrong domains in JSON-LD ───────────────────────────
  const schemaRegex = /(<script\s+type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi;
  let schemaMatch;
  let newHtml = html;
  let schemaFixed = false;

  // Reset regex
  schemaRegex.lastIndex = 0;

  // Find all JSON-LD blocks and fix wrong domain URLs in them
  newHtml = html.replace(
    /(<script\s+type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (full, open, jsonContent, close) => {
      // Look for URLs with wrong domains (not appliancerepairneary.com and not schema.org)
      const wrongDomainRe = /"(https?:\/\/(?!appliancerepairneary\.com|schema\.org)[^"]+)"/g;
      let fixedJson = jsonContent;
      let didFix = false;

      // Only fix URLs that look like page/business URLs on wrong domains
      fixedJson = jsonContent.replace(wrongDomainRe, (urlMatch, url) => {
        // Only fix if it looks like a site page URL (not external resources like fonts, cdn, etc.)
        // We target URLs that appear to be the site's own URL with a different domain
        const knownWrongDomains = [
          'localhost',
          'example.com',
          'nikaappliancerepair.com',
          'fixlifyservices.com',
          'nappliancerepair.com',
        ];
        for (const wrongDomain of knownWrongDomains) {
          if (url.includes(wrongDomain)) {
            const fixed = url.replace(
              new RegExp(`https?://${wrongDomain.replace('.', '\\.')}`, 'g'),
              BASE_URL
            );
            didFix = true;
            return `"${fixed}"`;
          }
        }
        return urlMatch;
      });

      if (didFix) {
        schemaFixed = true;
        stats.schemaFixed++;
      }
      return open + fixedJson + close;
    }
  );

  if (schemaFixed) {
    html = newHtml;
    changed = true;
    console.log(`  [schema] Fixed wrong domain URLs in ${filename}`);
  } else {
    html = newHtml;
  }

  // ── WRITE FILE ───────────────────────────────────────────────────────────────
  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
  }

  stats.processed++;
}

// ── SUMMARY ──────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════');
console.log('  TECHNICAL SEO FIX — SUMMARY');
console.log('══════════════════════════════════════════');
console.log(`  Files processed       : ${stats.processed}`);
console.log(`  Canonical added       : ${stats.canonicalAdded}`);
console.log(`  Canonical fixed       : ${stats.canonicalFixed}`);
console.log(`  og:url added          : ${stats.ogUrlAdded}`);
console.log(`  og:url fixed (domain) : ${stats.ogUrlFixed}`);
console.log(`  og:type added         : ${stats.ogTypeAdded}`);
console.log(`  og:image added        : ${stats.ogImageAdded}`);
console.log(`  og:title added        : ${stats.ogTitleAdded}`);
console.log(`  og:description added  : ${stats.ogDescAdded}`);
console.log(`  noindex removed       : ${stats.noindexRemoved}`);
console.log(`  Schema URLs fixed     : ${stats.schemaFixed}`);
console.log('══════════════════════════════════════════\n');
