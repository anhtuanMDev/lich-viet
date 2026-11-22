#!/usr/bin/env node
/**
 * Sinh các icon vẽ từ hình học (các path bên dưới):
 *   - Android: icon thông báo (vector trắng đơn sắc), màu nhấn thông báo.
 *   - Store: ảnh nổi bật (feature graphic) 1024×500 - vẫn dùng hình tờ lịch cũ bên dưới.
 *
 * KHÔNG sinh icon app: icon launcher Android, AppIcon iOS và icon Google Play 512 do
 * scripts/generate-app-icon.js sinh. Đừng ghi lại các file đó ở đây.
 *
 * Sửa thiết kế → sửa hằng số ở đây → `node scripts/generate-icons.js` → commit kết quả.
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { encodeRgbPng } = require('./lib/png');

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

/** PNG kín nền (không alpha) - Google Play chỉ nhận JPEG hoặc PNG 24-bit. */
function renderOpaque(svg, width, options = {}) {
  const image = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: RED,
    ...options,
  }).render();
  return encodeRgbPng(image.width, image.height, image.pixels);
}

// ---------- Android vector drawable ----------

const vectorDrawable = (size, viewport, paths) =>
  `<?xml version="1.0" encoding="utf-8"?>
<!-- Sinh bởi scripts/generate-icons.js - đừng sửa tay. -->
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
  'android/app/src/main/res/values/notification_accent.xml',
  `<?xml version="1.0" encoding="utf-8"?>
<!-- Sinh bởi scripts/generate-icons.js - đừng sửa tay. -->
<resources>
    <color name="notification_accent">${RED}</color>
</resources>
`,
);
write(
  'android/app/src/main/res/drawable/ic_notification.xml',
  vectorDrawable(24, 24, [{ d: moon(12, 12, 1), fill: '#FFFFFF' }]),
);
console.log('Store:');
write(
  'docs/store/assets/feature-graphic-1024x500.png',
  renderOpaque(FEATURE_GRAPHIC, 1024, {
    font: { loadSystemFonts: true, defaultFontFamily: 'Arial' },
  }),
);
