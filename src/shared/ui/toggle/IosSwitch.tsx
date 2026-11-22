import { Switch } from 'react-native';

import { useTheme } from '@shared/theme';

import type { ToggleProps } from '../types/toggle';

/** UISwitch thật, rãnh màu nhấn khi bật. */
export function IosSwitch({
  value,
  onChange,
  accessibilityLabel,
}: ToggleProps) {
  const { colors } = useTheme();
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ true: colors.primary, false: colors.fill }}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
