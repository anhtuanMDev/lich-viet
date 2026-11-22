import { Platform } from 'react-native';

import { IosSwitch } from './toggle/IosSwitch';
import { MaterialSwitch } from './toggle/MaterialSwitch';

import type { ToggleProps } from './types/toggle';

export type { ToggleProps } from './types/toggle';

/** Công tắc đúng kiểu từng hệ điều hành: UISwitch trên iOS, công tắc Material 3 trên Android. */
export function Toggle(props: ToggleProps) {
  return Platform.OS === 'android' ? (
    <MaterialSwitch {...props} />
  ) : (
    <IosSwitch {...props} />
  );
}
