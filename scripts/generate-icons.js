#!/usr/bin/env node
/**
 * Sinh toàn bộ icon từ MỘT nguồn hình học (các path bên dưới):
 *   - Android: adaptive icon (vector, có lớp monochrome cho "themed icons" Android 13+),
 *     PNG cho Android 7.x, icon thông báo (vector trắng đơn sắc).
 *   - iOS: AppIcon 1024×1024 (không kênh alpha – App Store từ chối icon có alpha).
 *   - Store: icon Google Play 512×512, ảnh nổi bật (feature graphic) 1024×500.
 *
 * Sửa thiết kế → sửa hằng số ở đây → `node scripts/generate-icons.js` → commit kết quả.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { Resvg } = require('@resvg/resvg-js');

const ROOT = path.resolve(__dirname, '..');

// Màu khớp theme sáng (src/shared/theme/tokens.ts).
const RED = '#B3261E';
const DEEP_RED = '#7F1A14';
const PAPER = '#FAF7F2';
const GOLD = '#D4952B';

/*
 * Hình học theo hệ toạ độ 108×108 của adaptive icon Android: vùng luôn hiển thị là hình
 * tròn bán kính 33 quanh tâm (54,54); vùng 72×72 ở giữa (18→90) là phần thấy được trên
 * icon vuông → dùng làm khung cho iOS / Play / PNG.
 */
const SHEET =
  'M39,32 H69 A6,6 0 0 1 75,38 V72 A6,6 0 0 1 69,78 H39 A6,6 0 0 1 33,72 V38 A6,6 0 0 1 39,32 Z';
const HEADER = 'M33,44 V38 A6,6 0 0 1 39,32 H69 A6,6 0 0 1 75,38 V44 Z';
const HEADER_GAP = 'M33,43 H75 V45 H33 Z';
const ring = x =>
  `M${x},28 A2,2 0 0 1 ${x + 2},30 V35 A2,2 0 0 1 ${x},37 A2,2 0 0 1 ${
    x - 2
  },35 V30 A2,2 0 0 1 ${x},28 Z`;
const RINGS = `${ring(44)} ${ring(64)}`;

/**
 * Trăng lưỡi liềm = vòng tròn bán kính 9 trừ vòng tròn bán kính 8 lệch (4,-3) (đơn vị gốc).
 * Hai giao điểm tính sẵn: (-1.42,-8.89) và (8.14,3.85) so với tâm.
 */
function moon(cx, cy, scale) {
  const p = (dx, dy) =>
    `${+(cx + dx * scale).toFixed(2)},${+(cy + dy * scale).toFixed(2)}`;
  const r = n => +(n * scale).toFixed(2);
  return `M${p(-1.42, -8.89)} A${r(9)},${r(9)} 0 1,0 ${p(8.14, 3.85)} A${r(
    8,
  )},${r(8)} 0 0,1 ${p(-1.42, -8.89)} Z`;
}
const ICON_MOON = moon(54, 61, 11 / 9);

const FOREGROUND = [
  { d: SHEET, fill: PAPER },
  { d: HEADER, fill: DEEP_RED },
  { d: RINGS, fill: PAPER },
  { d: ICON_MOON, fill: GOLD },
];
// Monochrome: hệ thống tự tô một màu theo hình nền → trăng và vạch đầu tờ lịch là lỗ khoét.
const MONOCHROME = [
  { d: `${SHEET} ${HEADER_GAP} ${ICON_MOON}`, fill: '#000000', evenOdd: true },
  { d: RINGS, fill: '#000000' },
];

// ---------- SVG → PNG ----------

const svgPaths = paths =>
  paths
    .map(
      ({ d, fill, evenOdd }) =>
        `<path d="${d}" fill="${fill}"${
          evenOdd ? ' fill-rule="evenodd"' : ''
        }/>`,
    )
    .join('');

const BLEED = '18 18 72 72';
const iconSvg = background =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BLEED}">${background}${svgPaths(
    FOREGROUND,
  )}</svg>`;

const FULL_SQUARE = iconSvg(`<rect width="108" height="108" fill="${RED}"/>`);
const ROUNDED_SQUARE = iconSvg(
  `<rect x="22" y="22" width="64" height="64" rx="12" fill="${RED}"/>`,
);
const CIRCLE = iconSvg(`<circle cx="54" cy="54" r="32" fill="${RED}"/>`);

function render(svg, width, options = {}) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: width }, ...options })
    .render()
    .asPng();
}

/** PNG RGB 8-bit (bỏ kênh alpha) từ ảnh RGBA đã render – dành cho icon iOS. */
function renderOpaque(svg, width) {
  const image = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: RED,
  }).render();
  const { width: w, height: h, pixels } = image;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0; // filter: none
    for (let x = 0; x < w; x++) {
      const src = (y * w + x) * 4;
      const dst = y * (w * 3 + 1) + 1 + x * 3;
      raw[dst] = pixels[src];
      raw[dst + 1] = pixels[src + 1];
      raw[dst + 2] = pixels[src + 2];
    }
  }
  const chunk = (type, data) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(body));
    return Buffer.concat([length, body, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(w, 0);
  header.writeUInt32BE(h, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // color type: RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- Android vector drawable ----------

const vectorDrawable = (size, viewport, paths) =>
  `<?xml version="1.0" encoding="utf-8"?>
<!-- Sinh bởi scripts/generate-icons.js – đừng sửa tay. -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="${size}dp"
    android:height="${size}dp"
    android:viewportWidth="${viewport}"
    android:viewportHeight="${viewport}">
${paths
  .map(
    ({ d, fill, evenOdd }) => `    <path
        android:fillColor="${fill}"${
      evenOdd ? '\n        android:fillType="evenOdd"' : ''
    }
        android:pathData="${d}" />`,
  )
  .join('\n')}
</vector>
`;

const ADAPTIVE_ICON = `<?xml version="1.0" encoding="utf-8"?>
<!-- Sinh bởi scripts/generate-icons.js – đừng sửa tay. -->
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
`;

const write = (relative, content) => {
  const file = path.join(ROOT, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`  ${relative}`);
};

// ---------- Ảnh nổi bật Google Play ----------

const FEATURE_GRAPHIC = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <rect width="1024" height="500" fill="${RED}"/>
  <g transform="translate(-81.2 -89.2) scale(6.4)">${svgPaths(FOREGROUND)}</g>
  <text x="480" y="235" font-family="Helvetica Neue, Arial, sans-serif" font-size="96" font-weight="700" fill="${PAPER}">Lịch Việt</text>
  <text x="483" y="300" font-family="Helvetica Neue, Arial, sans-serif" font-size="32" fill="${PAPER}" fill-opacity="0.85">Âm lịch · Ngày giỗ · Nhắc lịch</text>
</svg>`;

// ---------- Ghi file ----------

console.log('Android:');
write(
  'android/app/src/main/res/values/ic_launcher_background.xml',
  `<?xml version="1.0" encoding="utf-8"?>
<!-- Sinh bởi scripts/generate-icons.js – đừng sửa tay. -->
<resources>
    <color name="ic_launcher_background">${RED}</color>
    <color name="notification_accent">${RED}</color>
</resources>
`,
);
write(
  'android/app/src/main/res/drawable/ic_launcher_foreground.xml',
  vectorDrawable(108, 108, FOREGROUND),
);
write(
  'android/app/src/main/res/drawable/ic_launcher_monochrome.xml',
  vectorDrawable(108, 108, MONOCHROME),
);
write(
  'android/app/src/main/res/drawable/ic_notification.xml',
  vectorDrawable(24, 24, [{ d: moon(12, 12, 1), fill: '#FFFFFF' }]),
);
write(
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  ADAPTIVE_ICON,
);
write(
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
  ADAPTIVE_ICON,
);
// Android 7.x (minSdk 24) chưa có adaptive icon → PNG.
const DENSITIES = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
for (const [density, size] of Object.entries(DENSITIES)) {
  write(
    `android/app/src/main/res/mipmap-${density}/ic_launcher.png`,
    render(ROUNDED_SQUARE, size),
  );
  write(
    `android/app/src/main/res/mipmap-${density}/ic_launcher_round.png`,
    render(CIRCLE, size),
  );
}

console.log('iOS:');
const APP_ICON_SET = 'ios/LichViet/Images.xcassets/AppIcon.appiconset';
write(`${APP_ICON_SET}/AppIcon-1024.png`, renderOpaque(FULL_SQUARE, 1024));
write(
  `${APP_ICON_SET}/Contents.json`,
  `${JSON.stringify(
    {
      images: [
        {
          filename: 'AppIcon-1024.png',
          idiom: 'universal',
          platform: 'ios',
          size: '1024x1024',
        },
      ],
      info: { author: 'xcode', version: 1 },
    },
    null,
    2,
  )}\n`,
);

console.log('Store:');
write('docs/store/assets/play-icon-512.png', render(FULL_SQUARE, 512));
write(
  'docs/store/assets/feature-graphic-1024x500.png',
  render(FEATURE_GRAPHIC, 1024, {
    font: { loadSystemFonts: true, defaultFontFamily: 'Arial' },
  }),
);
