/**
 * Kích thước công tắc Material 3 (dp): rãnh 52x32 viền 2, núm 16 khi tắt và 24 khi bật,
 * tâm núm cách mép rãnh 16dp.
 */
export const TRACK_WIDTH = 52;
export const TRACK_HEIGHT = 32;
export const TRACK_BORDER = 2;
export const THUMB_OFF = 16;
export const THUMB_ON = 24;
const THUMB_CENTER_INSET = 16;

/** Vị trí `left` của núm (tính từ trong viền rãnh) khi tắt / bật. */
export const THUMB_LEFT_OFF = THUMB_CENTER_INSET - TRACK_BORDER - THUMB_OFF / 2;
export const THUMB_LEFT_ON =
  TRACK_WIDTH - THUMB_CENTER_INSET - TRACK_BORDER - THUMB_ON / 2;

/** Thời gian chuyển trạng thái (ms) - chuẩn "short" của Material. */
export const TOGGLE_DURATION = 150;
