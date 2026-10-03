import { useEffect } from 'react';
import { AppState } from 'react-native';
import { eventRepository } from '@features/events/eventRepository';
import { settingsStore } from '@features/settings/settingsStore';
import { reportError } from '@shared/crash';
import { syncAll } from './syncAll';

const DEBOUNCE_MS = 400;

/**
 * Gắn một lần ở gốc app: cập nhật lịch nhắc + widget khi mở app, quay lại app,
 * sửa sự kiện hoặc cài đặt (gộp các thay đổi dồn dập bằng debounce).
 */
export function useDataSync(): void {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        syncAll().catch(error => reportError(error, 'sync'));
      }, DEBOUNCE_MS);
    };

    schedule();
    const unsubscribers = [
      eventRepository.subscribe(schedule),
      settingsStore.subscribe(schedule),
    ];
    const appState = AppState.addEventListener('change', state => {
      if (state === 'active') {
        schedule();
      }
    });
    return () => {
      clearTimeout(timer);
      unsubscribers.forEach(unsubscribe => unsubscribe());
      appState.remove();
    };
  }, []);
}
