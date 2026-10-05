import { AppState, Linking, Platform } from 'react-native';
import notifee, {
  AlarmType,
  AndroidImportance,
  AndroidNotificationSetting,
  AuthorizationStatus,
  EventType,
  TriggerType,
} from 'react-native-notify-kit';
import type { Notification } from 'react-native-notify-kit';
import { powerManagerRoute } from './powerManager';
import type { PowerManagerRoute } from './powerManager';

/*
 * Lớp duy nhất biết tới thư viện thông báo. Phần còn lại của app chỉ dùng `Notifier`,
 * nên có thể test bằng bản giả và đổi thư viện mà không sửa logic nhắc lịch.
 */

export type PermissionState = 'granted' | 'denied' | 'undetermined';

export interface ScheduledNotification {
  readonly id: string;
  readonly timestamp: number;
  readonly title: string;
  readonly body: string;
  /** Deep link mở khi người dùng bấm vào thông báo. */
  readonly url: string;
}

export interface Notifier {
  permission(): Promise<PermissionState>;
  requestPermission(): Promise<PermissionState>;
  /** Thay toàn bộ lịch đã đặt bằng danh sách mới (huỷ cái thừa, ghi đè cái trùng id). */
  replaceScheduled(items: readonly ScheduledNotification[]): Promise<void>;
  showNow(item: Omit<ScheduledNotification, 'id' | 'timestamp'>): Promise<void>;
}

const CHANNEL_ID = 'reminders';
const URL_KEY = 'url';

let channelReady: Promise<string> | null = null;
const ensureChannel = (): Promise<string> => {
  channelReady ??= notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Nhắc lịch',
    description: 'Nhắc sự kiện, ngày giỗ, mùng 1 và rằm',
    importance: AndroidImportance.HIGH,
  });
  return channelReady;
};

const toPermission = (status: AuthorizationStatus): PermissionState => {
  switch (status) {
    case AuthorizationStatus.AUTHORIZED:
    case AuthorizationStatus.PROVISIONAL:
      return 'granted';
    case AuthorizationStatus.DENIED:
      return 'denied';
    default:
      return 'undetermined';
  }
};

type NotificationInput = Omit<ScheduledNotification, 'id' | 'timestamp'> & {
  readonly id?: string;
};

const buildNotification = (item: NotificationInput): Notification => ({
  ...(item.id === undefined ? {} : { id: item.id }),
  title: item.title,
  body: item.body,
  data: { [URL_KEY]: item.url },
  android: {
    channelId: CHANNEL_ID,
    // Icon trắng đơn sắc + màu nhấn (res/drawable/ic_notification.xml, sinh bởi scripts/generate-icons.js).
    smallIcon: 'ic_notification',
    color: '#B3261E',
    // Không có pressAction thì bấm vào thông báo trên Android sẽ không mở app.
    pressAction: { id: 'default' },
  },
  ios: { sound: 'default' },
});

export const notifier: Notifier = {
  async permission() {
    const settings = await notifee.getNotificationSettings();
    return toPermission(settings.authorizationStatus);
  },

  async requestPermission() {
    const settings = await notifee.requestPermission();
    return toPermission(settings.authorizationStatus);
  },

  async replaceScheduled(items) {
    await ensureChannel();
    const wanted = new Set(items.map(item => item.id));
    const existing = await notifee.getTriggerNotificationIds();
    const stale = existing.filter(id => !wanted.has(id));
    if (stale.length > 0) {
      await notifee.cancelTriggerNotifications(stale);
    }
    for (const item of items) {
      await notifee.createTriggerNotification(buildNotification(item), {
        type: TriggerType.TIMESTAMP,
        timestamp: item.timestamp,
        // Nổ đúng giờ kể cả khi máy đang Doze; thư viện tự hạ cấp nếu không có quyền báo thức chính xác.
        alarmManager: { type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE },
      });
    }
  },

  async showNow(item) {
    await ensureChannel();
    await notifee.displayNotification(buildNotification(item));
  },
};

/** Deep link gắn trong thông báo, nếu có. */
export const urlOfNotification = (
  notification: Notification | undefined,
): string | null => {
  const url = notification?.data?.[URL_KEY];
  return typeof url === 'string' ? url : null;
};

/** URL của thông báo đã mở app từ trạng thái tắt hẳn (cold start). */
export async function initialNotificationUrl(): Promise<string | null> {
  const initial = await notifee.getInitialNotification();
  return urlOfNotification(initial?.notification);
}

/** Gọi `listener` với URL mỗi khi người dùng bấm thông báo lúc app đang mở. */
export function onNotificationPress(
  listener: (url: string) => void,
): () => void {
  return notifee.onForegroundEvent(({ type, detail }) => {
    const url =
      type === EventType.PRESS ? urlOfNotification(detail.notification) : null;
    if (url) {
      listener(url);
    }
  });
}

export interface AndroidDeliveryInfo {
  /** Android 12+: người dùng đã tắt quyền "Báo thức & lời nhắc" → thông báo có thể trễ. */
  readonly exactAlarmsDisabled: boolean;
  readonly batteryOptimized: boolean;
  readonly manufacturer: string | null;
  /** Cách mở cài đặt pin của hãng (Xiaomi, Oppo, Vivo…); null nếu không có màn hình riêng. */
  readonly powerManager: PowerManagerRoute | null;
}

export async function androidDeliveryInfo(): Promise<AndroidDeliveryInfo | null> {
  if (Platform.OS !== 'android') {
    return null;
  }
  const [settings, batteryOptimized, power] = await Promise.all([
    notifee.getNotificationSettings(),
    notifee.isBatteryOptimizationEnabled(),
    notifee.getPowerManagerInfo(),
  ]);
  return {
    exactAlarmsDisabled:
      settings.android.alarm === AndroidNotificationSetting.DISABLED,
    batteryOptimized,
    manufacturer: power.manufacturer ?? null,
    // `activity` chỉ là tên màn hình đầu tiên trong danh sách cài sẵn của thư viện, không đảm
    // bảo máy có màn hình đó.
    powerManager: powerManagerRoute(
      power.manufacturer ?? null,
      Boolean(power.activity),
    ),
  };
}

/** Thời gian chờ màn hình của hãng mở ra trước khi coi là thất bại. */
const OEM_SCREEN_TIMEOUT_MS = 1500;

/** true nếu app rời màn hình (một màn hình khác đã mở lên) trong `timeoutMs`. */
function leftAppWithin(timeoutMs: number): Promise<boolean> {
  return new Promise(resolve => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        finish(true);
      }
    });
    const timer = setTimeout(() => finish(false), timeoutMs);
    function finish(left: boolean) {
      clearTimeout(timer);
      subscription.remove();
      resolve(left);
    }
  });
}

/**
 * notify-kit thử lần lượt các màn hình cài sẵn và im lặng bỏ qua khi tất cả đều lỗi (promise
 * vẫn resolve). Không thấy app rời màn hình → mở Thông tin ứng dụng để nút luôn có tác dụng.
 */
async function openPowerManager(route: PowerManagerRoute): Promise<void> {
  if (route === 'appSettings') {
    return Linking.openSettings();
  }
  const left = leftAppWithin(OEM_SCREEN_TIMEOUT_MS);
  await notifee.openPowerManagerSettings();
  if (!(await left)) {
    await Linking.openSettings();
  }
}

export const deviceSettings = {
  openApp: () => Linking.openSettings(),
  openExactAlarm: () => notifee.openAlarmPermissionSettings(),
  openBatteryOptimization: () => notifee.openBatteryOptimizationSettings(),
  openPowerManager,
};
