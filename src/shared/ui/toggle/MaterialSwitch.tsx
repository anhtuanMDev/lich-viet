import { useEffect, useState } from 'react';
import { Animated, Pressable } from 'react-native';

import { createThemedStyles } from '@shared/theme';

import {
  THUMB_LEFT_OFF,
  THUMB_LEFT_ON,
  THUMB_OFF,
  THUMB_ON,
  TOGGLE_DURATION,
  TRACK_BORDER,
  TRACK_HEIGHT,
  TRACK_WIDTH,
} from './materialSwitchGeometry';

import type { ToggleProps } from '../types/toggle';

/** Vùng chạm thêm quanh rãnh 32dp để đủ 48dp. */
const HIT_SLOP = 8;

/**
 * Công tắc Material 3: Switch của RN trên Android vẫn là kiểu Material cũ nên tự vẽ
 * (rãnh 52x32, núm to ra khi bật).
 */
export function MaterialSwitch({
  value,
  onChange,
  accessibilityLabel,
}: ToggleProps) {
  const styles = useStyles();
  // Giữ một Animated.Value suốt vòng đời component (useState thay cho useRef để đọc trong render).
  const [progress] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: TOGGLE_DURATION,
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const thumbSize = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_OFF, THUMB_ON],
  });
  const left = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_LEFT_OFF, THUMB_LEFT_ON],
  });

  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={HIT_SLOP}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}
    >
      <Animated.View
        style={[
          styles.thumb,
          value ? styles.thumbOn : styles.thumbOff,
          { width: thumbSize, height: thumbSize, left },
        ]}
      />
    </Pressable>
  );
}

const useStyles = createThemedStyles(theme => ({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: TRACK_BORDER,
    justifyContent: 'center',
  },
  trackOff: {
    backgroundColor: theme.colors.fill,
    borderColor: theme.colors.outline,
  },
  trackOn: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  thumb: {
    position: 'absolute',
    borderRadius: THUMB_ON / 2,
  },
  thumbOff: {
    backgroundColor: theme.colors.outline,
  },
  thumbOn: {
    backgroundColor: theme.colors.onPrimary,
  },
}));
