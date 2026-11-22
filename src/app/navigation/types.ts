import type { SolarDate } from '@core/lunar';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Mỗi tab là một native stack một màn hình: nhờ vậy iOS có tiêu đề lớn native
 * (co lại khi cuộn) và nút SF Symbols trên thanh tiêu đề.
 */
export type TodayStackParamList = Record<'TodayHome', undefined>;
export type CalendarStackParamList = Record<'CalendarHome', undefined>;
export type EventsStackParamList = Record<'EventsHome', undefined>;
export type ConverterStackParamList = Record<'ConverterHome', undefined>;

export type TabParamList = {
  Today: NavigatorScreenParams<TodayStackParamList>;
  Calendar: NavigatorScreenParams<CalendarStackParamList>;
  Events: NavigatorScreenParams<EventsStackParamList>;
  Converter: NavigatorScreenParams<ConverterStackParamList>;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  DayDetail: { readonly date: SolarDate };
  /** Không có eventId = thêm mới; `date` = ngày dương chọn sẵn cho sự kiện mới. */
  EventEdit:
    | { readonly eventId?: string; readonly date?: SolarDate }
    | undefined;
  Settings: undefined;
  ImportBackup: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Cho phép useNavigation() biết kiểu của toàn bộ cây điều hướng.
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
