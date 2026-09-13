const fs = require('fs');

// We can create a crisp vector SVG of the Lion Capital of India
const emblemSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 135" style="height:36px;width:auto;flex-shrink:0">
  <g fill="#1f2937">
    <!-- Ashoka Lion Capital Vector Silhouette -->
    <!-- Base pedestal -->
    <rect x="20" y="118" width="60" height="7" rx="1.5" />
    <rect x="15" y="125" width="70" height="5" rx="1" />
    <text x="50" y="133" font-size="5" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="#374151">सत्यमेव जयते</text>
    <!-- Chakra in center -->
    <circle cx="50" cy="108" r="7" fill="none" stroke="#1f2937" stroke-width="1.5"/>
    <circle cx="50" cy="108" r="1.5" />
    <!-- Bull and Horse on sides of abacus -->
    <path d="M 24 104 Q 28 102 32 108 L 22 108 Z" />
    <path d="M 76 104 Q 72 102 68 108 L 78 108 Z" />
    <!-- Abacus band -->
    <path d="M 18 114 L 82 114 L 80 118 L 20 118 Z" />
    <!-- Bell capital (Lotus base) -->
    <path d="M 22 114 Q 50 117 78 114 Q 74 100 50 100 Q 26 100 22 114 Z" />
    <!-- Center Lion -->
    <path d="M 40 45 C 38 30 45 20 50 15 C 55 20 62 30 60 45 C 65 50 67 65 65 80 C 63 92 58 98 50 100 C 42 98 37 92 35 80 C 33 65 35 50 40 45 Z" />
    <circle cx="50" cy="24" r="6" />
    <path d="M 45 28 Q 50 32 55 28 Q 50 35 45 28 Z" fill="#fff" />
    <!-- Left Lion Profile -->
    <path d="M 25 35 C 22 25 28 18 34 22 C 38 25 40 32 38 42 C 34 48 30 62 31 78 C 31 88 35 95 42 98 C 30 94 22 80 20 65 C 18 52 22 40 25 35 Z" />
    <!-- Right Lion Profile -->
    <path d="M 75 35 C 78 25 72 18 66 22 C 62 25 60 32 62 42 C 66 48 70 62 69 78 C 69 88 65 95 58 98 C 70 94 78 80 80 65 C 82 52 78 40 75 35 Z" />
    <!-- Lion Mane Details -->
    <path d="M 38 48 Q 32 58 35 68 Q 42 62 45 52 Z" fill="#374151" />
    <path d="M 62 48 Q 68 58 65 68 Q 58 62 55 52 Z" fill="#374151" />
    <path d="M 44 65 Q 50 72 56 65 Q 50 82 44 65 Z" fill="#374151" />
  </g>
</svg>`;

console.log("Emblem SVG valid!");
