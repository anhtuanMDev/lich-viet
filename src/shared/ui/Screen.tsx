import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { createThemedStyles } from '@shared/theme';

export interface ScreenProps {
  readonly children: ReactNode;
  /** Mặc định cuộn được; tắt khi con đã là list ảo hoá (FlatList…). */
  readonly scroll?: boolean;
  readonly edges?: readonly Edge[];
}

const DEFAULT_EDGES: readonly Edge[] = ['top', 'left', 'right'];

export function Screen({
  children,
  scroll = true,
  edges = DEFAULT_EDGES,
}: ScreenProps) {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.root} edges={edges}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.fill}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const useStyles = createThemedStyles(t => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  fill: {
    flex: 1,
  },
  content: {
    padding: t.spacing.lg,
    gap: t.spacing.md,
  },
}));
