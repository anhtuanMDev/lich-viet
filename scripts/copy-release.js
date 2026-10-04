#!/usr/bin/env node
/**
 * Chép file build release Android ra thư mục gốc cho dễ lấy:
 *   releases/<versionName>/lichviet-<versionName>-<versionCode>-<timestamp>.<aab|apk>
 *
 * Version đọc từ android/app/build.gradle (cái Google Play dùng), không phải package.json.
 * Gọi sau gradle: `node scripts/copy-release.js aab` hoặc `... apk`.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const SOURCES = {
  aab: 'android/app/build/outputs/bundle/release/app-release.aab',
  apk: 'android/app/build/outputs/apk/release/app-release.apk',
};

const kind = process.argv[2];
if (!SOURCES[kind]) {
  console.error('Cách dùng: node scripts/copy-release.js <aab|apk>');
  process.exit(1);
}

const src = path.join(ROOT, SOURCES[kind]);
if (!fs.existsSync(src)) {
  console.error(`Không tìm thấy ${SOURCES[kind]} - build gradle đã chạy chưa?`);
  process.exit(1);
}

const gradle = fs.readFileSync(path.join(ROOT, 'android/app/build.gradle'), 'utf8');
const versionName = gradle.match(/versionName\s+"([^"]+)"/)?.[1];
const versionCode = gradle.match(/versionCode\s+(\d+)/)?.[1];
if (!versionName || !versionCode) {
  console.error('Không đọc được versionName/versionCode trong android/app/build.gradle');
  process.exit(1);
}

// Giờ máy, dạng 20261004-153012 - sắp xếp theo tên là đúng thứ tự thời gian.
const pad = n => String(n).padStart(2, '0');
const d = new Date();
const timestamp =
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
  `-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

const destDir = path.join(ROOT, 'releases', versionName);
const dest = path.join(destDir, `lichviet-${versionName}-${versionCode}-${timestamp}.${kind}`);
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);

console.log(`→ ${path.relative(ROOT, dest)}`);
