import { FlexWidget, TextWidget } from 'react-native-android-widget';
import type { HexColor } from 'react-native-android-widget';
import type { WidgetDay } from '@core/widget';
import { darkColors, lightColors } from '@shared/theme/tokens';
import type { ColorTokens } from '@shared/theme/tokens';

/*
 * Widget Android được vẽ từ JSX nhưng KHÔNG phải React Native view: chỉ dùng được
 * FlexWidget/TextWidget với style giới hạn, không có hook, không có theme context.
 */

export const TODAY_WIDGET_NAME = 'Today';

/** Rộng hơn mức này (dp) thì thêm cột "Sắp tới". */
const WIDE_MIN_WIDTH = 250;

type WidgetPalette = Record<
  'background' | 'text' | 'textMuted' | 'holiday' | 'lunarAccent' | 'event',
  HexColor
>;

const toPalette = (colors: ColorTokens): WidgetPalette => ({
  background: colors.surface as HexColor,
  text: colors.text as HexColor,
  textMuted: colors.textMuted as HexColor,
  holiday: colors.holiday as HexColor,
  lunarAccent: colors.lunarAccent as HexColor,
  event: colors.event as HexColor,
});

const LIGHT = toPalette(lightColors);
const DARK = toPalette(darkColors);

interface Props {
  readonly day: WidgetDay;
  readonly width: number;
  readonly palette: WidgetPalette;
}

function DayColumn({ day, palette }: Omit<Props, 'width'>) {
  const accent = day.isRedDay ? palette.holiday : palette.text;
  const highlight = day.highlights[0];
  return (
    <FlexWidget
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
    >
      <TextWidget
        text={day.weekday}
        style={{ fontSize: 14, fontWeight: '600', color: accent }}
      />
      <TextWidget
        text={String(day.day)}
        style={{ fontSize: 48, fontWeight: '700', color: accent }}
      />
      <TextWidget
        text={day.monthTitle}
        style={{ fontSize: 12, color: palette.textMuted }}
      />
      <TextWidget
        text={day.lunar}
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: palette.lunarAccent,
          marginTop: 4,
        }}
      />
      {highlight ? (
        <TextWidget
          text={highlight.text}
          maxLines={1}
          truncate="END"
          style={{
            fontSize: 12,
            color: highlight.kind === 'event' ? palette.event : palette.holiday,
            marginTop: 2,
          }}
        />
      ) : null}
    </FlexWidget>
  );
}

function UpcomingColumn({ day, palette }: Omit<Props, 'width'>) {
  return (
    <FlexWidget style={{ flex: 1, paddingLeft: 12, justifyContent: 'center' }}>
      <TextWidget
        text="SẮP TỚI"
        style={{ fontSize: 11, fontWeight: '600', color: palette.textMuted }}
      />
      {day.upcoming.length === 0 ? (
        <TextWidget
          text={day.canChi}
          maxLines={2}
          style={{ fontSize: 12, color: palette.textMuted, marginTop: 6 }}
        />
      ) : (
        day.upcoming.map(item => (
          <FlexWidget
            key={`${item.title}-${item.date}`}
            style={{ marginTop: 6 }}
          >
            <TextWidget
              text={item.title}
              maxLines={1}
              truncate="END"
              style={{ fontSize: 13, fontWeight: '600', color: palette.text }}
            />
            <TextWidget
              text={`${item.when} · ${item.date}`}
              style={{ fontSize: 11, color: palette.event }}
            />
          </FlexWidget>
        ))
      )}
    </FlexWidget>
  );
}

function TodayWidgetView({ day, width, palette }: Props) {
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: 'lichviet://today' }}
      accessibilityLabel={`${day.weekday} ${day.day}, ${day.monthTitle}, âm lịch ${day.lunar}`}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'row',
        padding: 12,
        borderRadius: 20,
        backgroundColor: palette.background,
      }}
    >
      <DayColumn day={day} palette={palette} />
      {width >= WIDE_MIN_WIDTH ? (
        <UpcomingColumn day={day} palette={palette} />
      ) : null}
    </FlexWidget>
  );
}

/** Hai phiên bản sáng/tối - launcher tự chọn theo chế độ của máy. */
export function renderTodayWidget(day: WidgetDay, width: number) {
  return {
    light: <TodayWidgetView day={day} width={width} palette={LIGHT} />,
    dark: <TodayWidgetView day={day} width={width} palette={DARK} />,
  };
}
