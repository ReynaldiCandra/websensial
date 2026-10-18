/**
 * Generates replaceable SVG placeholder artwork for product previews,
 * portfolio concepts, and the Open Graph image.
 * Run: node scripts/generate-artwork.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";

const PURPLE = "#6328F5";
const BLUE = "#4F6BFF";
const LAVENDER = "#A58BFF";
const INK = "#171936";

function browserChrome(seed, label, variant = 0) {
  const hueShift = variant === 1 ? 28 : 0;
  const gradA = variant === 1 ? BLUE : PURPLE;
  const gradB = variant === 1 ? LAVENDER : BLUE;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="460" viewBox="0 0 720 460" fill="none">
  <defs>
    <linearGradient id="b" x1="0" y1="0" x2="720" y2="460" gradientUnits="userSpaceOnUse">
      <stop stop-color="${gradA}"/>
      <stop offset="1" stop-color="${gradB}"/>
    </linearGradient>
    <linearGradient id="f" x1="0" y1="0" x2="0" y2="460" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF" stop-opacity="0.96"/>
      <stop offset="1" stop-color="#F7F8FF" stop-opacity="0.96"/>
    </linearGradient>
  </defs>
  <rect width="720" height="460" rx="24" fill="url(#b)" transform="rotate(${hueShift ? 2 : 0} 360 230)"/>
  <rect x="46" y="40" width="628" height="400" rx="20" fill="url(#f)"/>
  <circle cx="72" cy="58" r="5" fill="#E4E7F5"/>
  <circle cx="90" cy="58" r="5" fill="#E4E7F5"/>
  <rect x="120" y="48" width="360" height="20" rx="10" fill="#EDF0FA"/>
  <!-- nav -->
  <rect x="70" y="92" width="76" height="20" rx="10" fill="${PURPLE}" opacity="0.9"/>
  <rect x="154" y="92" width="50" height="14" rx="7" fill="#E4E7F5"/>
  <rect x="212" y="92" width="50" height="14" rx="7" fill="#E4E7F5"/>
  <rect x="540" y="88" width="110" height="24" rx="12" fill="${PURPLE}"/>
  <!-- hero headline -->
  <rect x="70" y="140" width="300" height="22" rx="11" fill="${INK}" opacity="0.85"/>
  <rect x="70" y="172" width="240" height="22" rx="11" fill="${gradA}" opacity="0.75"/>
  <rect x="70" y="210" width="260" height="10" rx="5" fill="#DDE2F0"/>
  <rect x="70" y="228" width="200" height="10" rx="5" fill="#DDE2F0"/>
  <rect x="70" y="258" width="120" height="26" rx="13" fill="${PURPLE}"/>
  <rect x="202" y="258" width="120" height="26" rx="13" fill="#FFFFFF" stroke="#E4E7F5"/>
  <!-- floating glass panels -->
  <g opacity="0.9">
    <rect x="420" y="130" width="230" height="150" rx="16" fill="#FFFFFF" opacity="0.75" stroke="#FFFFFF"/>
    <rect x="438" y="150" width="90" height="10" rx="5" fill="#C9CBDD" opacity="0.8"/>
    <rect x="438" y="172" width="194" height="34" rx="8" fill="url(#b)" opacity="0.85"/>
    <rect x="438" y="218" width="60" height="48" rx="8" fill="#EDEFFB"/>
    <rect x="506" y="218" width="60" height="48" rx="8" fill="#E3E0FB"/>
    <rect x="574" y="218" width="58" height="48" rx="8" fill="#EDEFFB"/>
  </g>
  <g opacity="0.85">
    <rect x="360" y="300" width="290" height="110" rx="16" fill="#FFFFFF" opacity="0.62" stroke="#FFFFFF"/>
    <rect x="378" y="318" width="120" height="10" rx="5" fill="#C9CBDD"/>
    <rect x="378" y="340" width="180" height="8" rx="4" fill="#DDE2F0"/>
    <rect x="378" y="356" width="150" height="8" rx="4" fill="#DDE2F0"/>
    <rect x="378" y="374" width="80" height="20" rx="10" fill="${LAVENDER}"/>
  </g>
  <rect x="70" y="330" width="230" height="80" rx="16" fill="#EFF1FC"/>
  <rect x="86" y="348" width="120" height="10" rx="5" fill="#B9BEDD"/>
  <rect x="86" y="368" width="170" height="8" rx="4" fill="#D5DAEC"/>
  <rect x="86" y="384" width="140" height="8" rx="4" fill="#D5DAEC"/>
  <text x="70" y="428" font-family="system-ui, sans-serif" font-size="12" fill="#69708A" opacity="0.9">${label} — preview placeholder ${seed}</text>
</svg>`;
}

function portfolioCard(seed, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="460" viewBox="0 0 720 460" fill="none">
  <defs>
    <linearGradient id="p" x1="0" y1="0" x2="720" y2="460" gradientUnits="userSpaceOnUse">
      <stop stop-color="${PURPLE}"/>
      <stop offset="1" stop-color="${BLUE}"/>
    </linearGradient>
  </defs>
  <rect width="720" height="460" rx="24" fill="url(#p)"/>
  <rect x="40" y="40" width="640" height="380" rx="20" fill="#FFFFFF" opacity="0.1"/>
  <rect x="64" y="64" width="280" height="332" rx="16" fill="#FFFFFF" opacity="0.88"/>
  <rect x="84" y="92" width="140" height="16" rx="8" fill="${INK}" opacity="0.8"/>
  <rect x="84" y="120" width="220" height="10" rx="5" fill="#D5DAEC"/>
  <rect x="84" y="140" width="180" height="10" rx="5" fill="#D5DAEC"/>
  <rect x="84" y="176" width="240" height="120" rx="12" fill="url(#p)" opacity="0.7"/>
  <rect x="84" y="312" width="110" height="26" rx="13" fill="${PURPLE}"/>
  <rect x="204" y="64" width="452" height="220" rx="16" fill="#FFFFFF" opacity="0.35"/>
  <rect x="204" y="300" width="216" height="124" rx="16" fill="#FFFFFF" opacity="0.5"/>
  <rect x="436" y="300" width="220" height="124" rx="16" fill="#FFFFFF" opacity="0.2"/>
  <text x="64" y="422" font-family="system-ui, sans-serif" font-size="12" fill="#FFFFFF" opacity="0.75">${label} — concept artwork ${seed}</text>
</svg>`;
}

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <defs>
    <linearGradient id="og" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF"/>
      <stop offset="0.6" stop-color="#F7F8FF"/>
      <stop offset="1" stop-color="#EFEAFF"/>
    </linearGradient>
    <linearGradient id="ogmark" x1="80" y1="60" x2="420" y2="560" gradientUnits="userSpaceOnUse">
      <stop stop-color="${LAVENDER}"/>
      <stop offset="0.5" stop-color="${PURPLE}"/>
      <stop offset="1" stop-color="${BLUE}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#og)"/>
  <circle cx="1010" cy="120" r="290" fill="url(#ogmark)" opacity="0.12"/>
  <circle cx="1080" cy="330" r="170" fill="${PURPLE}" opacity="0.08"/>
  <rect x="90" y="120" width="80" height="80" rx="20" fill="url(#ogmark)"/>
  <text x="100" y="180" font-family="system-ui, sans-serif" font-weight="700" font-size="42" fill="#FFFFFF">W</text>
  <text x="90" y="330" font-family="system-ui, sans-serif" font-weight="800" font-size="76" fill="${INK}">WEBSENSIAL</text>
  <text x="90" y="390" font-family="system-ui, sans-serif" font-weight="600" font-size="34" fill="#69708A">Premium digital agency &amp; website templates</text>
  <rect x="90" y="440" width="260" height="56" rx="14" fill="${PURPLE}"/>
  <text x="120" y="476" font-family="system-ui, sans-serif" font-weight="700" font-size="22" fill="#FFFFFF">Browse templates</text>
  <rect x="366" y="440" width="240" height="56" rx="14" fill="#FFFFFF" stroke="#E4E7F5"/>
  <text x="398" y="476" font-family="system-ui, sans-serif" font-weight="700" font-size="22" fill="${INK}">Our services</text>
</svg>`;

const PREVIEWS = "public/previews";

const productSlugs = [
  "aurora-saas-landing",
  "noxcorp-business",
  "glassfolio-portfolio",
  "lumen-store",
  "eventide-event",
  "monogram-ui-kit",
];

await mkdir(PREVIEWS, { recursive: true });

for (const [index, slug] of productSlugs.entries()) {
  const label = slug
    .split("-")
    .map((part) => part.replace(/^\w/, (c) => c.toUpperCase()))
    .join(" ");
  await writeFile(`${PREVIEWS}/${slug}.svg`, browserChrome(index + 1, label, 0));
  await writeFile(`${PREVIEWS}/${slug}-2.svg`, browserChrome(index + 21, label, 1));
}

const portfolioSlugs = [
  ["portfolio-nova", "Nova Analytics"],
  ["portfolio-arunika", "Arunika Coffee"],
  ["portfolio-lumenslider", "Lumen Slider"],
];
for (const [slug, label] of portfolioSlugs) {
  await writeFile(`${PREVIEWS}/${slug}.svg`, portfolioCard(7, label));
}

await writeFile("public/og.svg", og);
console.log(`artwork: ${productSlugs.length * 2 + 3 + 1} files written to ${PREVIEWS} and public/og.svg`);
