import { Component } from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { reportError } from '@shared/crash';
import { createThemedStyles } from '@shared/theme';
import { AppText, Button } from '@shared/ui';

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

/**
 * Lỗi khi render bất kỳ màn hình nào → hiện màn hình báo lỗi thay vì trắng/thoát app,
 * gửi báo cáo, và cho "Thử lại" (dựng lại toàn bộ cây con). Dữ liệu nằm trong MMKV
 * nên không mất gì khi dựng lại.
 *
 * Phải là class: React chưa có hook tương đương getDerivedStateFromError/componentDidCatch.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown): void {
    reportError(error, 'render');
  }

  private readonly retry = () => this.setState({ hasError: false });

  override render() {
    return this.state.hasError ? (
      <ErrorFallback onRetry={this.retry} />
    ) : (
      this.props.children
    );
  }
}

function ErrorFallback({ onRetry }: { readonly onRetry: () => void }) {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.content}>
        <AppText variant="title">Đã xảy ra lỗi</AppText>
        <AppText color="textMuted">
          Màn hình này gặp sự cố ngoài ý muốn. Dữ liệu của bạn vẫn an toàn. Hãy
          thử lại; nếu lỗi lặp lại, vui lòng tắt hẳn rồi mở lại ứng dụng.
        </AppText>
        <Button label="Thử lại" onPress={onRetry} />
      </View>
    </SafeAreaView>
  );
}

const useStyles = createThemedStyles(t => ({
  root: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: t.spacing.xl,
    gap: t.spacing.lg,
  },
}));
