#!/usr/bin/env node
/**
 * Sinh icon thanh tab Android (PNG đen trên nền trong, thanh tab tự tô màu) vào
 * src/app/navigation/icons/. iOS dùng SF Symbols nên không cần ảnh.
 *
 * "Hôm nay" là nửa vầng trăng - cùng ý với SF Symbol `moonphase.first.quarter` trên iOS.
 * Ba icon còn lại lấy từ Material Symbols Outlined (Google, Apache License 2.0).
 *
 * Sửa → `node scripts/generate-tab-icons.js` → commit ảnh.
 */
const fs = require('node:fs');
const path = require('node:path');

const { Resvg } = require('@resvg/resvg-js');

const { DENSITIES, ICON_DP } = require('./lib/densities');

const OUT = path.resolve(__dirname, '../src/app/navigation/icons');

const MATERIAL = 'viewBox="0 -960 960 960"';
const ICONS = {
  // Vòng tròn viền 2dp + nửa phải tô đặc (trăng thượng huyền).
  today:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
    '<circle cx="12" cy="12" r="8" fill="none" stroke="#000" stroke-width="2"/>' +
    '<path d="M12 4a8 8 0 0 1 0 16z" fill="#000"/></svg>',
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" ${MATERIAL}><path d="M180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Zm300 230q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-188.5-11.5Q280-423 280-440t11.5-28.5Q303-480 320-480t28.5 11.5Q360-457 360-440t-11.5 28.5Q337-400 320-400t-28.5-11.5ZM640-400q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-188.5-11.5Q280-263 280-280t11.5-28.5Q303-320 320-320t28.5 11.5Q360-297 360-280t-11.5 28.5Q337-240 320-240t-28.5-11.5ZM640-240q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>`,
  events: `<svg xmlns="http://www.w3.org/2000/svg" ${MATERIAL}><path d="m323-245 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm-90 125 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-355Z"/></svg>`,
  converter: `<svg xmlns="http://www.w3.org/2000/svg" ${MATERIAL}><path d="M273-160 80-353l193-193 42 42-121 121h316v60H194l121 121-42 42Zm414-254-42-42 121-121H450v-60h316L645-758l42-42 193 193-193 193Z"/></svg>`,
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, svg] of Object.entries(ICONS)) {
  for (const { suffix, scale } of DENSITIES) {
    const png = new Resvg(svg, {
      fitTo: { mode: 'width', value: Math.round(ICON_DP * scale) },
    })
      .render()
      .asPng();
    fs.writeFileSync(path.join(OUT, `tab-${name}${suffix}.png`), png);
  }
}
console.log(`Đã ghi icon tab vào ${path.relative(process.cwd(), OUT)}`);
