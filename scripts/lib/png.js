const zlib = require('node:zlib');

/** Chữ ký 8 byte mở đầu mọi file PNG. */
const PNG_SIGNATURE = Buffer.from('89504e470d0a1a0a', 'hex');
const RGB_BYTES = 3;
const RGBA_BYTES = 4;
const UINT32_BYTES = 4;
const IHDR_LENGTH = 13;
const BIT_DEPTH = 8;
const COLOR_TYPE_RGB = 2;
const FILTER_NONE = 0;
const MAX_COMPRESSION = 9;

/** Một chunk PNG: độ dài, loại, dữ liệu, CRC. */
function pngChunk(type, data) {
  const length = Buffer.alloc(UINT32_BYTES);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(UINT32_BYTES);
  crc.writeUInt32BE(zlib.crc32(body));
  return Buffer.concat([length, body, crc]);
}

/** Header IHDR: kích thước, 8 bit mỗi kênh, ảnh RGB. */
function ihdr(width, height) {
  const header = Buffer.alloc(IHDR_LENGTH);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, UINT32_BYTES);
  header[2 * UINT32_BYTES] = BIT_DEPTH;
  header[2 * UINT32_BYTES + 1] = COLOR_TYPE_RGB;
  return header;
}

/** Dữ liệu ảnh thô: mỗi dòng một byte bộ lọc + các điểm RGB (bỏ kênh alpha). */
function rgbRows(width, height, rgba) {
  const stride = width * RGB_BYTES + 1;
  const raw = Buffer.alloc(stride * height);
  for (let row = 0; row < height; row++) {
    raw[row * stride] = FILTER_NONE;
    for (let col = 0; col < width; col++) {
      const src = (row * width + col) * RGBA_BYTES;
      const dst = row * stride + 1 + col * RGB_BYTES;
      rgba.copy(raw, dst, src, src + RGB_BYTES);
    }
  }
  return raw;
}

/**
 * PNG RGB 8-bit (bỏ kênh alpha) từ điểm ảnh RGBA đã render. Dành cho ảnh phải kín nền:
 * icon iOS (App Store từ chối icon có alpha), icon và ảnh nổi bật Google Play (chỉ nhận
 * JPEG hoặc PNG 24-bit).
 */
function encodeRgbPng(width, height, rgba) {
  const pixels = Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength);
  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', ihdr(width, height)),
    pngChunk(
      'IDAT',
      zlib.deflateSync(rgbRows(width, height, pixels), {
        level: MAX_COMPRESSION,
      }),
    ),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

module.exports = { encodeRgbPng };
