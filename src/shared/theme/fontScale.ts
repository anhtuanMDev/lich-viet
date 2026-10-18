import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import type { TextStyle } from 'react-native';

interface ScaledText {
  readonly style: TextStyle;
  readonly textProps: {
    readonly allowFontScaling?: boolean;
    readonly maxFontSizeMultiplier?: number;
  };
}

/**
 * Áp cỡ chữ máy cho một kiểu chữ, có trần `maxScale`.
 *
 * Android: RN chặn `fontSize` theo `maxFontSizeMultiplier` nhưng KHÔNG chặn `lineHeight`
 * (TextAttributeProps.lineHeight gọi toPixelFromSP không kèm trần) → chữ không to thêm
 * mà dòng vẫn cao theo cỡ chữ máy (tới 2x), làm tràn ô lịch và các khung cố định.
 * Vì vậy ở Android tự nhân cả hai rồi tắt phóng chữ native. iOS chặn đúng nên để native.
 */
export function useScaledText(base: TextStyle, maxScale: number): ScaledText {
  const { fontScale } = useWindowDimensions();
  const scale = Math.min(fontScale, maxScale);
  return useMemo(() => {
    if (Platform.OS !== 'android') {
      return { style: base, textProps: { maxFontSizeMultiplier: maxScale } };
    }
    return {
      style: {
        ...base,
        fontSize:
          base.fontSize === undefined ? undefined : base.fontSize * scale,
        lineHeight:
          base.lineHeight === undefined ? undefined : base.lineHeight * scale,
      },
      textProps: { allowFontScaling: false },
    };
  }, [base, maxScale, scale]);
}
