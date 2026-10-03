// Chỉ export phần nhẹ, không UI: index.js (tác vụ nền) và linking import từ đây.
export { syncReminders } from './syncReminders';
export { ensureNotificationPermission } from './permission';
export { initialNotificationUrl, onNotificationPress } from './notifier';
