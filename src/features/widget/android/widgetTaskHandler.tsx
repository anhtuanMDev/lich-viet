import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { currentSnapshot } from '../widgetData';
import { TODAY_WIDGET_NAME, renderTodayWidget } from './TodayWidget';

/** Android gọi khi widget được thêm, đổi kích thước, hoặc tới chu kỳ cập nhật (30 phút). */
export async function widgetTaskHandler({
  widgetInfo,
  widgetAction,
  renderWidget,
}: WidgetTaskHandlerProps): Promise<void> {
  if (widgetInfo.widgetName !== TODAY_WIDGET_NAME) {
    return;
  }
  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const [today] = currentSnapshot(1).days;
      if (today) {
        renderWidget(renderTodayWidget(today, widgetInfo.width));
      }
      return;
    }
    default:
      return;
  }
}
