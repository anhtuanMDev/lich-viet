import { act, create } from 'react-test-renderer';
import type { ReactTestRenderer } from 'react-test-renderer';
import { Text } from 'react-native';
import { reportError } from '@shared/crash';
import { ThemeProvider } from '@shared/theme';
import { Button } from '@shared/ui';
import { ErrorBoundary } from '../ErrorBoundary';

jest.mock('@shared/crash', () => ({ reportError: jest.fn() }));

let shouldThrow = true;
function Flaky() {
  if (shouldThrow) {
    throw new Error('boom');
  }
  return <Text>ok</Text>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  it('hiện màn hình lỗi, gửi báo cáo, "Thử lại" dựng lại cây con', async () => {
    let tree!: ReactTestRenderer;
    await act(async () => {
      tree = create(
        <ThemeProvider mode="light">
          <ErrorBoundary>
            <Flaky />
          </ErrorBoundary>
        </ThemeProvider>,
      );
    });

    expect(reportError).toHaveBeenCalledWith(expect.any(Error), 'render');
    expect(
      tree.root.findAllByType(Text).some(t => t.props.children === 'ok'),
    ).toBe(false);

    shouldThrow = false;
    await act(async () => tree.root.findByType(Button).props.onPress());

    expect(
      tree.root.findAllByType(Text).some(t => t.props.children === 'ok'),
    ).toBe(true);
  });
});
