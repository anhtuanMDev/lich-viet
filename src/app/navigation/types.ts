import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SolarDate } from '@core/lunar';

export type TabParamList = {
  Today: undefined;
  Calendar: undefined;
  Events: undefined;
  Converter: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  DayDetail: { readonly date: SolarDate };
  /** Không có eventId = thêm mới; `date` = ngày dương chọn sẵn cho sự kiện mới. */
  EventEdit:
    | { readonly eventId?: string; readonly date?: SolarDate }
    | undefined;
  Settings: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

// Cho phép useNavigation() biết kiểu của toàn bộ cây điều hướng.
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
