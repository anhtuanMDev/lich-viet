#!/usr/bin/env node
/**
 * Sinh icon app Lịch Việt (iOS, Android, Google Play) từ hình học bên dưới.
 *
 * Thiết kế: mặt trăng đúng pha - trăng thượng huyền sắp tròn, khoảng mùng 10 âm - trên nền
 * đỏ son. Cùng dấu hiệu mặt trăng trong app (src/shared/ui/Moon.tsx, moonPath.ts): phần sáng
 * vàng trăng nhạt, phần tối là đỏ son sẫm để vẫn thấy trọn đĩa trăng khi icon nhỏ.
 * Phẳng, không chữ, không chuyển màu.
 *
 * Hệ toạ độ 108×108 của adaptive icon Android: vùng luôn hiển thị là hình tròn bán kính 33
 * quanh tâm (54,54); ô 72×72 ở giữa (18→90) là phần thấy được trên icon vuông → khung cho
 * iOS, Google Play và PNG dự phòng.
 *
 * Ghi ra:
 *   - iOS: mọi ảnh liệt kê trong AppIcon.appiconset/Contents.json - PNG RGB, KHÔNG alpha.
 *   - Android: màu nền (values/ic_launcher_background.xml), lớp trước và lớp đơn sắc cho
 *     themed icon dạng vector (drawable/ic_launcher_{foreground,monochrome}.xml),
 *     mipmap-anydpi-v26/ic_launcher{,_round}.xml, PNG dự phòng cho API < 26 (mipmap-*dpi),
 *     src/main/ic_launcher-playstore.png.
 *   - Store: docs/store/assets/play-icon-512.png (PNG 24-bit, không alpha).
 *
 * Sửa thiết kế → sửa hằng số ở đây → `node scripts/generate-app-icon.js` → commit kết quả.
 */
const fs = require('node:fs');
const path = require('node:path');

const { Resvg } = require('@resvg/resvg-js');

const { encodeRgbPng } = require('./lib/png');

const ROOT = path.resolve(__dirname, '..');
/** Icon Google Play: 512×512. */
const PLAY_ICON_SIZE = 512;

const BACKGROUND = '#C2271D'; // đỏ son
const MOON_SHADE = '#8E1911'; // phần tối của trăng: đỏ son sẫm
const MOON_LIT = '#F6D492'; // phần sáng: vàng trăng nhạt

const CENTER = 54;
const MOON_RADIUS = 20;
/** Vị trí trong chu kỳ trăng: 0 = sóc, 0.5 = vọng. 0.32 ≈ mùng 10, trăng gần tròn. */
const MOON_CYCLE = 0.32;

// ---------- Hình học ----------

/** Làm tròn toạ độ SVG tới 3 chữ số thập phân. */
const COORD_PRECISION = 1000;
const HALF_CYCLE = 0.5;
const round = value => Math.round(value * COORD_PRECISION) / COORD_PRECISION;

/**
 * Phần sáng của đĩa trăng (giống moonLitPath trong src/shared/ui/moonPath.ts, nhưng toạ độ
 * tuyệt đối): nửa đĩa phía mặt trời cộng/trừ nửa elip của đường phân cách sáng tối.
 */
function moonLitPath(cycle, { cx, cy }, radius) {
  const cos = Math.cos(2 * Math.PI * cycle);
  const isWaxing = cycle < HALF_CYCLE;
  const rx = round(Math.abs(cos) * radius);
  const edgeSweep = isWaxing ? 1 : 0;
  const terminatorSweep = isWaxing === cos > 0 ? 0 : 1;
  const top = `${cx},${cy - radius}`;
  const bottom = `${cx},${cy + radius}`;
  const edge = `A${radius},${radius} 0 0,${edgeSweep} ${bottom}`;
  const terminator = `A${rx},${radius} 0 0,${terminatorSweep} ${top}`;
  return `M${top} ${edge} ${terminator} Z`;
}

const circlePath = ({ cx, cy }, radius) =>
  `M${cx},${cy - radius} A${radius},${radius} 0 1,1 ${cx},${cy + radius} ` +
  `A${radius},${radius} 0 1,1 ${cx},${cy - radius} Z`;

const MOON_CENTER = { cx: CENTER, cy: CENTER };
const DISC = circlePath(MOON_CENTER, MOON_RADIUS);
const LIT = moonLitPath(MOON_CYCLE, MOON_CENTER, MOON_RADIUS);

/** Lớp trước của adaptive icon (nền trong suốt). */
const FOREGROUND = [
  { d: DISC, fill: MOON_SHADE },
  { d: LIT, fill: MOON_LIT },
];
/**
 * Themed icon (Android 13+): hệ thống tô một màu theo độ trong suốt của lớp này → phần sáng
 * đặc, phần tối mờ để vẫn thấy hình đĩa trăng.
 */
const MONOCHROME = [
  { d: DISC, fill: '#000000', alpha: 0.32 },
  { d: LIT, fill: '#000000' },
];

// ---------- SVG ----------

const svgPaths = paths =>
  paths
    .map(
      ({ d, fill, alpha }) =>
        `<path d="${d}" fill="${fill}"${
          alpha === undefined ? '' : ` fill-opacity="${alpha}"`
        }/>`,
    )
    .join('');

/** Icon vuông tràn viền (iOS, Play): ô 72×72 ở giữa, nền kín. */
const squareIconSvg = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 18 72 72">` +
  `<rect x="0" y="0" width="108" height="108" fill="${BACKGROUND}"/>${svgPaths(
    FOREGROUND,
  )}</svg>`;

/** Cả khung 108×108 của adaptive icon - dùng cho ảnh xem trước các kiểu mặt nạ launcher. */
const adaptiveSvg = (paths = FOREGROUND, background = BACKGROUND) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">` +
  `${
    background
      ? `<rect x="0" y="0" width="108" height="108" fill="${background}"/>`
      : ''
  }${svgPaths(paths)}</svg>`;

/**
 * PNG dự phòng cho launcher cũ (API < 26), khung 48dp như Image Asset của Android Studio:
 * hình vuông bo góc hoặc hình tròn 44dp ở giữa, góc ngoài trong suốt.
 * Vuông: ô 72×72 thu vào 44dp. Tròn: vòng tròn hiển thị (bán kính 33) thu vào 44dp.
 */
const LEGACY = {
  /** Khung adaptive icon (dp). */
  canvas: 108,
  /** Phần hiển thị: ô vuông 72, vòng tròn đường kính 66. */
  visibleSquare: 72,
  visibleRound: 66,
  /** Hình icon trong khung 48dp: 44dp, cách mép 2dp. */
  shape: 44,
  inset: 2,
};

function legacySvg(shape) {
  const visible =
    shape === 'round' ? LEGACY.visibleRound : LEGACY.visibleSquare;
  const scale = LEGACY.shape / visible;
  const offset = LEGACY.inset - ((LEGACY.canvas - visible) / 2) * scale;
  const clip =
    shape === 'round'
      ? '<circle cx="24" cy="24" r="22"/>'
      : '<rect x="2" y="2" width="44" height="44" rx="8"/>';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">` +
    `<clipPath id="shape">${clip}</clipPath>` +
    `<g clip-path="url(#shape)"><g transform="translate(${offset} ${offset}) scale(${scale})">` +
    `<rect x="0" y="0" width="108" height="108" fill="${BACKGROUND}"/>${svgPaths(
      FOREGROUND,
    )}</g></g></svg>`
  );
}

// ---------- Ảnh ----------

const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render();

/** PNG RGB (bỏ kênh alpha) - App Store và Google Play từ chối icon có alpha. */
function renderOpaque(svg, width) {
  const image = render(svg, width);
  return encodeRgbPng(image.width, image.height, image.pixels);
}

const vectorDrawable = paths =>
  `<?xml version="1.0" encoding="utf-8"?>
<!-- Sinh bởi scripts/generate-app-icon.js - đừng sửa tay. -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
${paths
  .map(
    ({ d, fill, alpha }) => `    <path
        android:fillColor="${fill}"${
      alpha === undefined ? '' : `\n        android:fillAlpha="${alpha}"`
    }
        android:pathData="${d}" />`,
  )
  .join('\n')}
</vector>
`;

const ADAPTIVE_ICON = `<?xml version="1.0" encoding="utf-8"?>
<!-- Sinh bởi scripts/generate-app-icon.js - đừng sửa tay. -->
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
    <monochrome android:drawable="@drawable/ic_launcher_monochrome" />
</adaptive-icon>
`;

const LEGACY_DENSITIES = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

// ---------- Ghi file ----------

const write = (relative, content) => {
  const file = path.join(ROOT, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`  ${relative}`);
};

const remove = relative => {
  const file = path.join(ROOT, relative);
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`  - ${relative}`);
  }
};

function writeIos() {
  const dir = 'ios/LichViet/Images.xcassets/AppIcon.appiconset';
  const { images } = JSON.parse(
    fs.readFileSync(path.join(ROOT, dir, 'Contents.json'), 'utf8'),
  );
  const svg = squareIconSvg();
  for (const { size, scale = '1x', filename } of images) {
    if (!filename) {
      continue;
    }
    const pixels = Math.round(parseFloat(size) * parseFloat(scale));
    write(`${dir}/${filename}`, renderOpaque(svg, pixels));
  }
}

function writeAndroid() {
  const res = 'android/app/src/main/res';
  write(
    `${res}/values/ic_launcher_background.xml`,
    `<?xml version="1.0" encoding="utf-8"?>
<!-- Sinh bởi scripts/generate-app-icon.js - đừng sửa tay. -->
<resources>
    <color name="ic_launcher_background">${BACKGROUND}</color>
</resources>
`,
  );
  write(
    `${res}/drawable/ic_launcher_foreground.xml`,
    vectorDrawable(FOREGROUND),
  );
  write(
    `${res}/drawable/ic_launcher_monochrome.xml`,
    vectorDrawable(MONOCHROME),
  );
  write(`${res}/mipmap-anydpi-v26/ic_launcher.xml`, ADAPTIVE_ICON);
  write(`${res}/mipmap-anydpi-v26/ic_launcher_round.xml`, ADAPTIVE_ICON);
  for (const [density, size] of Object.entries(LEGACY_DENSITIES)) {
    const dir = `${res}/mipmap-${density}`;
    // Lớp .webp cũ từ Image Asset: trùng tên tài nguyên với PNG mới → xoá.
    for (const name of [
      'ic_launcher',
      'ic_launcher_round',
      'ic_launcher_foreground',
      'ic_launcher_background',
    ]) {
      remove(`${dir}/${name}.webp`);
    }
    write(`${dir}/ic_launcher.png`, render(legacySvg('square'), size).asPng());
    write(
      `${dir}/ic_launcher_round.png`,
      render(legacySvg('round'), size).asPng(),
    );
  }
  write(
    'android/app/src/main/ic_launcher-playstore.png',
    renderOpaque(squareIconSvg(), PLAY_ICON_SIZE),
  );
}

function main() {
  console.log('iOS:');
  writeIos();
  console.log('Android:');
  writeAndroid();
  console.log('Store:');
  write(
    'docs/store/assets/play-icon-512.png',
    renderOpaque(squareIconSvg(), PLAY_ICON_SIZE),
  );
}

if (require.main === module) {
  main();
}

module.exports = {
  BACKGROUND,
  FOREGROUND,
  MONOCHROME,
  adaptiveSvg,
  legacySvg,
  squareIconSvg,
};
