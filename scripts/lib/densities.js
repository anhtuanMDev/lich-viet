/**
 * Hậu tố mật độ ảnh của Metro: khi build Android, `icon@2x.png` vào drawable-xhdpi…
 * Icon 24dp được xuất ở đủ 5 mức.
 */
const ICON_DP = 24;

const DENSITIES = [
  { suffix: '', scale: 1 },
  { suffix: '@1.5x', scale: 1.5 },
  { suffix: '@2x', scale: 2 },
  { suffix: '@3x', scale: 3 },
  { suffix: '@4x', scale: 4 },
];

module.exports = { DENSITIES, ICON_DP };
