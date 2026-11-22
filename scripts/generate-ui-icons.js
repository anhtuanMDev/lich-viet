#!/usr/bin/env node
/**
 * Sinh icon trong app (PNG đen trên nền trong, tô màu bằng `tintColor`) từ đường vẽ
 * Material Symbols ở src/shared/ui/iconPaths.ts:
 *   - iOS: bộ Rounded (nét bo tròn, gần SF Symbols) → src/shared/ui/icons/ios/
 *   - Android: bộ Outlined (đúng Material) → src/shared/ui/icons/android/
 * và file src/shared/ui/iconAssets.ts (require tĩnh cho Metro).
 *
 * Cần Node 22.12+ (đọc thẳng file .ts). Sửa iconPaths.ts → `node scripts/generate-ui-icons.js`.
 */
const fs = require('node:fs');
const path = require('node:path');
const resvg = require('@resvg/resvg-js');

const { DENSITIES, ICON_DP } = require('./lib/densities');
// Node 22.12+ đọc được file .ts (bỏ kiểu) bằng require.
const {
  ICON_NAMES,
  outlinedPaths,
  roundedPaths,
} = require('../src/shared/ui/iconPaths.ts');

const ROOT = path.resolve(__dirname, '..');
const UI = path.join(ROOT, 'src/shared/ui');

const sets = { ios: roundedPaths, android: outlinedPaths };
for (const [platform, paths] of Object.entries(sets)) {
  const dir = path.join(UI, 'icons', platform);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const name of ICON_NAMES) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="${paths[name]}" fill="#000"/></svg>`;
    for (const { suffix, scale } of DENSITIES) {
      const png = new resvg.Resvg(svg, {
        fitTo: { mode: 'width', value: Math.round(ICON_DP * scale) },
      })
        .render()
        .asPng();
      fs.writeFileSync(path.join(dir, `${name}${suffix}.png`), png);
    }
  }
}

const entries = platform =>
  ICON_NAMES.map(
    name => `  ${name}: require('./icons/${platform}/${name}.png'),`,
  ).join('\n');
fs.writeFileSync(
  path.join(UI, 'iconAssets.ts'),
  `// File sinh tự động bởi scripts/generate-ui-icons.js - đừng sửa tay.
import type { ImageSourcePropType } from 'react-native';
import type { IconName } from './iconPaths';

export const iosIcons: Readonly<Record<IconName, ImageSourcePropType>> = {
${entries('ios')}
};

export const androidIcons: Readonly<Record<IconName, ImageSourcePropType>> = {
${entries('android')}
};
`,
);
console.log(`Đã sinh ${ICON_NAMES.length} icon cho iOS và Android.`);
