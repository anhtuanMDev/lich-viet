import SwiftUI
import WidgetKit

// MARK: - Dữ liệu (khớp với src/core/widget/snapshot.ts, WIDGET_SNAPSHOT_VERSION = 2)

struct WidgetUpcoming: Decodable, Hashable {
  let title: String
  let when: String
  let date: String
}

struct WidgetHighlight: Decodable {
  enum Kind: String, Decodable { case holiday, event }
  let text: String
  let kind: Kind
}

struct WidgetDay: Decodable {
  let date: String
  let weekday: String
  let day: Int
  let monthTitle: String
  let lunar: String
  let canChi: String
  let isRedDay: Bool
  let highlights: [WidgetHighlight]
  let upcoming: [WidgetUpcoming]

  static let placeholder = WidgetDay(
    date: "",
    weekday: "Thứ bảy",
    day: 3,
    monthTitle: "Tháng 10, 2026",
    lunar: "23 tháng Tám",
    canChi: "Ngày Canh Tuất · Năm Bính Ngọ",
    isRedDay: false,
    highlights: [],
    upcoming: [WidgetUpcoming(title: "Giỗ ông nội", when: "Còn 7 ngày", date: "10/10")]
  )
}

struct WidgetSnapshot: Decodable {
  let version: Int
  let days: [WidgetDay]
}

enum SnapshotStore {
  static let appGroup = "group.com.lichviet.app"
  static let key = "widget.snapshot"
  static let supportedVersion = 2

  static func load() -> WidgetSnapshot? {
    guard
      let json = UserDefaults(suiteName: appGroup)?.string(forKey: key),
      let data = json.data(using: .utf8),
      let snapshot = try? JSONDecoder().decode(WidgetSnapshot.self, from: data),
      snapshot.version == supportedVersion
    else { return nil }
    return snapshot
  }
}

/// Ngày âm lịch tính theo giờ Việt Nam, nên "hôm nay" của widget cũng theo giờ Việt Nam.
private let vietnamCalendar: Calendar = {
  var calendar = Calendar(identifier: .gregorian)
  calendar.timeZone = TimeZone(identifier: "Asia/Ho_Chi_Minh")!
  return calendar
}()

private let isoDay: DateFormatter = {
  let formatter = DateFormatter()
  formatter.calendar = vietnamCalendar
  formatter.timeZone = vietnamCalendar.timeZone
  formatter.locale = Locale(identifier: "en_US_POSIX")
  formatter.dateFormat = "yyyy-MM-dd"
  return formatter
}()

// MARK: - Timeline

struct DayEntry: TimelineEntry {
  let date: Date
  /// nil = hết dữ liệu (lâu không mở app) → nhắc mở app.
  let day: WidgetDay?
}

struct Provider: TimelineProvider {
  /// Đủ dài để widget tự sang ngày mới mỗi nửa đêm; app làm mới dữ liệu mỗi lần mở / chạy nền.
  private let daysAhead = 30

  func placeholder(in context: Context) -> DayEntry {
    DayEntry(date: Date(), day: .placeholder)
  }

  func getSnapshot(in context: Context, completion: @escaping (DayEntry) -> Void) {
    let day = SnapshotStore.load().flatMap { find($0, for: Date()) }
    completion(DayEntry(date: Date(), day: day ?? (context.isPreview ? .placeholder : nil)))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<DayEntry>) -> Void) {
    let snapshot = SnapshotStore.load()
    let startOfToday = vietnamCalendar.startOfDay(for: Date())
    let entries = (0..<daysAhead).compactMap { offset -> DayEntry? in
      guard let midnight = vietnamCalendar.date(byAdding: .day, value: offset, to: startOfToday)
      else { return nil }
      let entryDate = offset == 0 ? Date() : midnight
      return DayEntry(date: entryDate, day: snapshot.flatMap { find($0, for: midnight) })
    }
    let refresh = vietnamCalendar.date(byAdding: .day, value: daysAhead, to: startOfToday) ?? Date()
    completion(Timeline(entries: entries, policy: .after(refresh)))
  }

  private func find(_ snapshot: WidgetSnapshot, for date: Date) -> WidgetDay? {
    let key = isoDay.string(from: date)
    return snapshot.days.first { $0.date == key }
  }
}

// MARK: - Giao diện

private extension Color {
  /// Màu đồng bộ với src/shared/theme/tokens.ts (sáng / tối).
  static func dynamic(light: UInt32, dark: UInt32) -> Color {
    Color(UIColor { traits in
      let hex = traits.userInterfaceStyle == .dark ? dark : light
      return UIColor(
        red: CGFloat((hex >> 16) & 0xFF) / 255,
        green: CGFloat((hex >> 8) & 0xFF) / 255,
        blue: CGFloat(hex & 0xFF) / 255,
        alpha: 1
      )
    })
  }

  static let surface = dynamic(light: 0xFFFFFF, dark: 0x1F1B17)
  static let text = dynamic(light: 0x1F1B16, dark: 0xF3EDE4)
  static let textMuted = dynamic(light: 0x5E564B, dark: 0xC7BDAF)
  static let holiday = dynamic(light: 0xC62828, dark: 0xFF8A80)
  static let lunarAccent = dynamic(light: 0xB26A00, dark: 0xFFB74D)
  static let event = dynamic(light: 0x1F6FB2, dark: 0x7FB8E6)
}

struct DayColumn: View {
  let day: WidgetDay

  var body: some View {
    let accent: Color = day.isRedDay ? .holiday : .text
    VStack(spacing: 2) {
      Text(day.weekday).font(.subheadline.weight(.semibold)).foregroundColor(accent)
      Text("\(day.day)").font(.system(size: 46, weight: .bold)).foregroundColor(accent)
        .minimumScaleFactor(0.6)
      Text(day.monthTitle).font(.caption2).foregroundColor(.textMuted)
      Text(day.lunar).font(.footnote.weight(.semibold)).foregroundColor(.lunarAccent)
        .padding(.top, 2)
      if let highlight = day.highlights.first {
        Text(highlight.text).font(.caption2).lineLimit(1)
          .foregroundColor(highlight.kind == .event ? .event : .holiday)
      }
    }
    .frame(maxWidth: .infinity)
  }
}

struct UpcomingColumn: View {
  let day: WidgetDay

  var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      Text("SẮP TỚI").font(.caption2.weight(.semibold)).foregroundColor(.textMuted)
      if day.upcoming.isEmpty {
        Text(day.canChi).font(.caption).foregroundColor(.textMuted).lineLimit(2)
      } else {
        ForEach(day.upcoming, id: \.self) { item in
          VStack(alignment: .leading, spacing: 1) {
            Text(item.title).font(.caption.weight(.semibold)).foregroundColor(.text)
              .lineLimit(1)
            Text("\(item.when) · \(item.date)").font(.caption2).foregroundColor(.event)
          }
        }
      }
      Spacer(minLength: 0)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

struct LichVietWidgetView: View {
  @Environment(\.widgetFamily) private var family
  let entry: DayEntry

  var body: some View {
    Group {
      if let day = entry.day {
        if family == .systemMedium {
          HStack(spacing: 12) {
            DayColumn(day: day)
            UpcomingColumn(day: day)
          }
        } else {
          DayColumn(day: day)
        }
      } else {
        Text("Mở Lịch Việt để cập nhật lịch")
          .font(.footnote)
          .foregroundColor(.textMuted)
          .multilineTextAlignment(.center)
      }
    }
    .widgetURL(URL(string: "lichviet://today"))
    .widgetBackground(.surface)
  }
}

private extension View {
  /// iOS 17 bắt buộc khai báo nền qua containerBackground; iOS cũ hơn dùng nền thường.
  @ViewBuilder
  func widgetBackground(_ color: Color) -> some View {
    if #available(iOSApplicationExtension 17.0, *) {
      containerBackground(for: .widget) { color }
    } else {
      padding().background(color)
    }
  }
}

// MARK: - Widget

@main
struct LichVietWidget: Widget {
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: "LichVietWidget", provider: Provider()) { entry in
      LichVietWidgetView(entry: entry)
    }
    .configurationDisplayName("Lịch Việt – Hôm nay")
    .description("Ngày dương, ngày âm và sự kiện sắp tới.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
