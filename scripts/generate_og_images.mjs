#!/usr/bin/env node
// Deterministic Open Graph / Twitter thumbnail generator for the deep navy site.
//
// For every top-level page (and each blog post) this script templates a
// 1200x630 on-brand social card as SVG and rasterises it to PNG. Social
// platforms (Facebook, LinkedIn, Slack, X/Twitter, iMessage) render PNG/JPG
// reliably but frequently refuse SVG, so PNG is the primary output.
//
// Rasteriser: the script shells out to the first available system tool
// (rsvg-convert, resvg, ImageMagick, or Inkscape). If none is present it
// falls back to writing crisp static .svg files at the same paths and prints
// a clear warning. Output is fully deterministic: no network, no Date.now,
// no randomness — the same source produces byte-stable SVG every run.
//
// Usage: node scripts/generate_og_images.mjs
//
// Scope note: this script only writes into assets/images/og/. It never touches
// application JavaScript, protobuf, or auth code.

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = join(ROOT, 'assets', 'images', 'og');

// ---------------------------------------------------------------------------
// Brand system (mirrors assets/css/main.css :root).
// ---------------------------------------------------------------------------
const C = {
  bg: '#02060b',
  ink: '#f4f7f5',
  muted: '#9aa6aa',
  mutedDim: '#5f6b6e',
  aqua: '#79f2d2',
  line: 'rgba(244,247,245,0.12)',
};
const MONO = "'Menlo','SF Mono','SFMono-Regular',Monaco,Consolas,monospace";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

const W = 1200;
const H = 630;
const TEXT_X = 96; // left content edge
const RIGHT_X = 1104; // right content edge
const MONO_ADVANCE = 0.62; // Menlo advance width per em (conservative for wrapping)

// ---------------------------------------------------------------------------
// Card definitions. One entry per rendered thumbnail.
//   file    : output path relative to assets/images/og
//   kicker  : small aqua eyebrow (rendered upper-case)
//   title   : focal display text (wrapped + auto-fit)
//   subtitle: single muted support line
//   path    : URL shown top-right (deep.navy<path>)
// ---------------------------------------------------------------------------
const CARDS = [
  {
    file: 'default.png',
    kicker: 'Autonomous engineering',
    title: 'Engineering work, on the record.',
    subtitle: 'Objectives · GitHub delivery · Approvals · Attributable cost',
    path: '/',
  },
  {
    file: 'home.png',
    kicker: 'Early access / founding teams',
    title: 'Engineering work, organized around an objective.',
    subtitle: 'A coordinated team carrying one objective through reviewed work.',
    path: '/',
  },
  {
    file: 'product.png',
    kicker: 'Product record / v0.1',
    title: 'A persistent team carries one objective through reviewed work.',
    subtitle: 'Six roles · Artifact chain · Attributable cost',
    path: '/product/',
  },
  {
    file: 'solutions.png',
    kicker: 'Pilot briefs / early access',
    title: 'One work record serves three decision owners.',
    subtitle: 'Founder · Product lead · Engineering lead',
    path: '/solutions/',
  },
  {
    file: 'pricing.png',
    kicker: 'Commercial terms / early access',
    title: '$599 per engineering team, per month.',
    subtitle: '50,000 credits per team · Prepaid usage · No overage',
    path: '/pricing/',
  },
  {
    file: 'economics.png',
    kicker: 'Engineering economics',
    title: 'Usage, cost, and outcome evidence share a timeline.',
    subtitle: 'Attributable cost · Credits · Time-stamped outcomes',
    path: '/economics/',
  },
  {
    file: 'security.png',
    kicker: 'Security reference',
    title: 'Boundaries, credentials, and enforcement.',
    subtitle: 'Trust boundaries · Credential custody · Request path',
    path: '/security/',
  },
  {
    file: 'trust.png',
    kicker: 'Trust status',
    title: 'Current control and assurance status.',
    subtitle: 'Implementation · Deployment · Assurance',
    path: '/trust/',
  },
  {
    file: 'architecture.png',
    kicker: 'Architecture reference / v0.1',
    title: 'System ownership is explicit at every request boundary.',
    subtitle: 'Cognito · Platform API · EKS · Per-team runtime',
    path: '/architecture/',
  },
  {
    file: 'docs.png',
    kicker: 'Customer procedure / onboarding',
    title: 'Establish a team in six verified steps.',
    subtitle: 'Auth · GitHub · Billing · Provisioning · Runtime',
    path: '/docs/',
  },
  {
    file: 'docs-api.png',
    kicker: 'Contract / generated from protobuf',
    title: 'Platform API reference.',
    subtitle: 'Messages · Enums · Services · RPCs',
    path: '/docs/api/',
  },
  {
    file: 'blog.png',
    kicker: 'Engineering field notes',
    title: 'Decisions from the implementation record.',
    subtitle: 'Product · Engineering · Security · Economics',
    path: '/blog/',
  },
  {
    file: 'compare.png',
    kicker: 'Operating-model comparison',
    title: 'deep navy and AI coding assistants.',
    subtitle: 'Scope · Delivery · Controls · Customer economics',
    path: '/compare/ai-coding-assistants/',
  },
  {
    file: 'customers.png',
    kicker: 'Founding-team register',
    title: 'Early access begins with a bounded pilot.',
    subtitle: 'Entry criteria · Procedure · Review record',
    path: '/customers/',
  },
  {
    file: 'integrations-github.png',
    kicker: 'Integration reference / GitHub',
    title: 'Repository authority remains with the GitHub organization.',
    subtitle: 'GitHub App · Installation tokens · Versioned selection',
    path: '/integrations/github/',
  },
  {
    file: 'legal-privacy.png',
    kicker: 'Legal / privacy',
    title: 'Privacy notice.',
    subtitle: 'Public site · Onboarding · Connected services',
    path: '/legal/privacy/',
  },
  {
    file: 'legal-terms.png',
    kicker: 'Legal / website terms',
    title: 'Website terms.',
    subtitle: 'Early-access information · Authorized use',
    path: '/legal/terms/',
  },
  {
    file: 'app.png',
    kicker: 'Customer workspace',
    title: 'Sign in to your engineering team.',
    subtitle: 'Connect GitHub · Activate plan · Create team',
    path: '/app/',
  },
  {
    file: 'posts/why-the-unit-of-work-is-an-objective.png',
    kicker: 'Field note',
    title: 'Why the unit of work is an objective.',
    subtitle: 'Outcome · Evidence · Stopping rule',
    path: '/blog/why-the-unit-of-work-is-an-objective/',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Greedy word wrap for a fixed-advance (monospace) font.
function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const word of words) {
    const candidate = cur ? `${cur} ${word}` : word;
    if (candidate.length <= maxChars || !cur) {
      cur = candidate;
    } else {
      lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// Fit the title: keep one consistent size where possible, shrink only when a
// title would otherwise exceed three lines.
function fitTitle(title, maxWidth) {
  const steps = [
    { size: 58, lh: 66 },
    { size: 50, lh: 58 },
    { size: 44, lh: 52 },
  ];
  for (const step of steps) {
    const maxChars = Math.floor(maxWidth / (step.size * MONO_ADVANCE));
    const lines = wrap(title, maxChars);
    if (lines.length <= 3) return { ...step, lines };
  }
  const step = steps[steps.length - 1];
  const maxChars = Math.floor(maxWidth / (step.size * MONO_ADVANCE));
  return { ...step, lines: wrap(title, maxChars).slice(0, 4) };
}

function buildSvg(card) {
  const maxWidth = RIGHT_X - TEXT_X;
  const { size, lh, lines } = fitTitle(card.title, maxWidth);

  const kickerY = 236;
  const titleTop = 304; // first-line baseline
  const titleBaselines = lines.map((_, i) => titleTop + i * lh);
  const lastBaseline = titleBaselines[titleBaselines.length - 1];
  const dividerY = lastBaseline + 48;
  const subtitleY = dividerY + 50;

  const titleTspans = lines
    .map(
      (ln, i) =>
        `<tspan x="${TEXT_X}" y="${titleBaselines[i]}">${esc(ln)}</tspan>`,
    )
    .join('');

  // Left "ledger" spine with tick marks — echoes the site's editorial rules.
  const spineX = 60;
  const spine = `
    <path d="M${spineX} 150 V 486" stroke="${C.aqua}" stroke-width="2" opacity="0.9"/>
    <path d="M${spineX} 190 h 22 M${spineX} 316 h 12 M${spineX} 452 h 30" stroke="${C.aqua}" stroke-width="2" opacity="0.9"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <rect x="0" y="0" width="${W}" height="4" fill="${C.aqua}"/>
  ${spine}
  <text x="${TEXT_X}" y="104" font-family="${MONO}" font-size="26" font-weight="700" letter-spacing="-0.4">
    <tspan fill="${C.aqua}">DN</tspan><tspan fill="${C.mutedDim}"> / </tspan><tspan fill="${C.ink}">deep navy</tspan>
  </text>
  <text x="${RIGHT_X}" y="104" text-anchor="end" font-family="${MONO}" font-size="18" letter-spacing="1" fill="${C.muted}">deep.navy${esc(card.path)}</text>
  <text x="${TEXT_X}" y="${kickerY}" font-family="${MONO}" font-size="21" font-weight="700" letter-spacing="3.5" fill="${C.aqua}">${esc(card.kicker.toUpperCase())}</text>
  <text font-family="${MONO}" font-size="${size}" font-weight="650" letter-spacing="-1" fill="${C.ink}">${titleTspans}</text>
  <line x1="${TEXT_X}" y1="${dividerY}" x2="${RIGHT_X}" y2="${dividerY}" stroke="${C.line}" stroke-width="1"/>
  <text x="${TEXT_X}" y="${subtitleY}" font-family="${SANS}" font-size="24" fill="${C.muted}">${esc(card.subtitle)}</text>
  <rect x="${TEXT_X}" y="561" width="9" height="9" fill="${C.aqua}"/>
  <text x="${TEXT_X + 22}" y="570" font-family="${MONO}" font-size="15" letter-spacing="1.5" fill="${C.muted}">Autonomous engineering, accountable outcomes</text>
  <text x="${RIGHT_X}" y="570" text-anchor="end" font-family="${MONO}" font-size="15" letter-spacing="1" fill="${C.mutedDim}">1200 × 630</text>
</svg>
`;
}

// ---------------------------------------------------------------------------
// Rasteriser discovery
// ---------------------------------------------------------------------------
function has(cmd) {
  const r = spawnSync('command', ['-v', cmd], { shell: true, encoding: 'utf8' });
  return r.status === 0 && r.stdout.trim() !== '';
}

function pickRasteriser() {
  if (has('rsvg-convert')) {
    return {
      name: 'rsvg-convert',
      run: (svg, out) =>
        spawnSync(
          'rsvg-convert',
          ['-w', String(W), '-h', String(H), '-f', 'png', '-o', out],
          { input: svg },
        ),
    };
  }
  if (has('resvg')) {
    return {
      name: 'resvg',
      run: (svg, out) =>
        spawnSync('resvg', ['-w', String(W), '-', out], { input: svg }),
    };
  }
  if (has('magick') || has('convert')) {
    const bin = has('magick') ? 'magick' : 'convert';
    return {
      name: bin,
      run: (svg, out) =>
        spawnSync(bin, ['-background', 'none', '-density', '144', 'svg:-', out], {
          input: svg,
        }),
    };
  }
  if (has('inkscape')) {
    return {
      name: 'inkscape',
      run: (svg, out) => {
        const tmp = out.replace(/\.png$/, '.tmp.svg');
        writeFileSync(tmp, svg);
        return spawnSync('inkscape', [
          tmp,
          '--export-type=png',
          `--export-filename=${out}`,
          `--export-width=${W}`,
          `--export-height=${H}`,
        ]);
      },
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  mkdirSync(join(OUT_DIR, 'posts'), { recursive: true });
  const raster = pickRasteriser();
  const results = [];

  if (!raster) {
    console.warn(
      '\n[!] No SVG rasteriser found (rsvg-convert / resvg / magick / inkscape).\n' +
        '    Falling back to static .svg cards. Note: many social platforms do NOT\n' +
        '    render SVG Open Graph images — install librsvg (`brew install librsvg`)\n' +
        '    and re-run to produce PNGs for production.\n',
    );
  } else {
    console.log(`Rasteriser: ${raster.name}`);
  }

  for (const card of CARDS) {
    const svg = buildSvg(card);
    const pngPath = join(OUT_DIR, card.file);
    mkdirSync(dirname(pngPath), { recursive: true });

    if (raster) {
      const r = raster.run(svg, pngPath);
      if (r.status !== 0 || !existsSync(pngPath)) {
        const err = (r.stderr && r.stderr.toString()) || `exit ${r.status}`;
        throw new Error(`Rasterise failed for ${card.file}: ${err}`);
      }
      results.push({ file: card.file, format: 'png' });
    } else {
      const svgPath = pngPath.replace(/\.png$/, '.svg');
      writeFileSync(svgPath, svg);
      results.push({ file: svgPath.replace(`${OUT_DIR}/`, ''), format: 'svg' });
    }
  }

  const fmt = raster ? 'PNG' : 'SVG (fallback)';
  console.log(`Generated ${results.length} ${fmt} social cards in assets/images/og/`);
  for (const r of results) console.log(`  · ${r.file}`);
}

main();
