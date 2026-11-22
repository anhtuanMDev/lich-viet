import SwiftUI
import WidgetKit

// MARK: - Dữ liệu (khớp với src/core/widget/snapshot.ts, WIDGET_SNAPSHOT_VERSION = 3)

struct WidgetUpcoming: Decodable, Hashable {
  /// Ký hiệu đầu hàng như mục "Sắp tới" trong app.
  enum Mark: String, Decodable { case event, newMoon, fullMoon, holiday }
  let title: String
  let when: String
  let date: String
  let mark: Mark
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
    date: "2026-11-20",
    weekday: "Thứ sáu",
    day: 20,
    monthTitle: "Tháng 11, 2026",
    lunar: "12 tháng Mười",
    canChi: "Ngày Mậu Tuất · Năm Bính Ngọ",
    isRedDay: false,
    highlights: [WidgetHighlight(text: "Nhà giáo Việt Nam", kind: .holiday)],
    upcoming: [
      WidgetUpcoming(title: "Giỗ ông nội", when: "Ngày mai", date: "21/11", mark: .event),
      WidgetUpcoming(title: "Rằm", when: "Còn 3 ngày", date: "23/11", mark: .fullMoon),
      WidgetUpcoming(title: "Mùng 1", when: "Còn 19 ngày", date: "9/12", mark: .newMoon),
    ]
  )
}

struct WidgetSnapshot: Decodable {
  let version: Int
  let days: [WidgetDay]
}

enum SnapshotStore {
  static let appGroup = "group.com.lichviet.app"
  static let key = "widget.snapshot"
  static let supportedVersion = 3

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

// MARK: - Pha trăng

/// Công thức sóc rút gọn (Jean Meeus) - chép nguyên hệ số từ src/core/lunar/astronomy.ts.
private enum Astronomy {
  static let synodicMonth = 29.530588853
  static let newMoonEpoch = 2415021.076998695
  private static let deg = Double.pi / 180

  /// Thời điểm (Julian Day, giờ UT) của lần sóc thứ k tính từ newMoonEpoch.
  static func newMoonMoment(_ k: Double) -> Double {
    let t = k / 1236.85
    let t2 = t * t
    let t3 = t2 * t
    var jd = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3
    jd += 0.00033 * sin((166.56 + 132.87 * t - 0.009173 * t2) * deg)

    let m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3
    let mpr = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3
    let f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3

    var c1: Double = (0.1734 - 0.000393 * t) * sin(m * deg) + 0.0021 * sin(2 * deg * m)
    c1 = c1 - 0.4068 * sin(mpr * deg) + 0.0161 * sin(deg * 2 * mpr)
    c1 = c1 - 0.0004 * sin(deg * 3 * mpr)
    c1 = c1 + 0.0104 * sin(deg * 2 * f) - 0.0051 * sin(deg * (m + mpr))
    c1 = c1 - 0.0074 * sin(deg * (m - mpr)) + 0.0004 * sin(deg * (2 * f + m))
    c1 = c1 - 0.0004 * sin(deg * (2 * f - m)) - 0.0006 * sin(deg * (2 * f + mpr))
    c1 = c1 + 0.001 * sin(deg * (2 * f - mpr)) + 0.0005 * sin(deg * (2 * mpr + m))

    let deltaT: Double
    if t < -11 {
      let poly: Double = 0.001 + 0.000839 * t + 0.0002261 * t2
      deltaT = poly - 0.00000845 * t3 - 0.000000081 * t * t3
    } else {
      deltaT = -0.000278 + 0.000265 * t + 0.000262 * t2
    }
    return jd + c1 - deltaT
  }

  /// Số ngày Julius nguyên của một ngày dương lịch (giống toJulianDay trong julian.ts).
  static func julianDay(year: Int, month: Int, day: Int) -> Int {
    let a = (14 - month) / 12
    let y = year + 4800 - a
    let m = month + 12 * a - 3
    let base = day + (153 * m + 2) / 5 + 365 * y + y / 4
    let jd = base - y / 100 + y / 400 - 32045
    return jd < 2_299_161 ? base - 32083 : jd
  }
}

/// Pha trăng thật của một ngày - bản Swift của moonPhaseOf (src/core/lunar/moonPhase.ts),
/// tính tại 12h UT (19h giờ Việt Nam) như trong app.
struct MoonPhase {
  /// Vị trí trong chu kỳ: 0 = sóc (trăng mới), 0.5 = vọng (trăng tròn).
  let cycle: Double

  /// Phần đĩa trăng được chiếu sáng, 0...1.
  var illumination: Double { (1 - cos(2 * Double.pi * cycle)) / 2 }
  /// Trăng đang tròn dần - phần sáng ở bên phải.
  var waxing: Bool { cycle < 0.5 }

  /// `julianDay` nguyên ứng với 12h UT của ngày đó - dùng thẳng làm thời điểm.
  init(julianDay: Int) {
    let moment = Double(julianDay)
    var k = ((moment - Astronomy.newMoonEpoch) / Astronomy.synodicMonth).rounded(.down)
    var start = Astronomy.newMoonMoment(k)
    // Công thức gần đúng của k có thể lệch một chu kỳ ở sát thời điểm sóc.
    while start > moment {
      k -= 1
      start = Astronomy.newMoonMoment(k)
    }
    var end = Astronomy.newMoonMoment(k + 1)
    while end <= moment {
      k += 1
      start = end
      end = Astronomy.newMoonMoment(k + 1)
    }
    cycle = (moment - start) / (end - start)
  }
}

// MARK: - Chuỗi hiển thị (dẫn xuất từ snapshot, không đổi cấu trúc snapshot)

private let nbsp = "\u{00A0}"

extension WidgetDay {
  /// "2026-11-20" → (2026, 11, 20).
  private var solarParts: (year: Int, month: Int, day: Int)? {
    let parts = date.split(separator: "-").compactMap { Int($0) }
    guard parts.count == 3 else { return nil }
    return (parts[0], parts[1], parts[2])
  }

  /// Snapshot ghi ngày âm dạng "<ngày> tháng <tên>" ("12 tháng Mười").
  private var lunarParts: (day: Int, month: String)? {
    let parts = lunar.split(separator: " ", maxSplits: 1).map(String.init)
    guard parts.count == 2, let dayNumber = Int(parts[0]) else { return nil }
    return (dayNumber, parts[1])
  }

  var moonPhase: MoonPhase? {
    solarParts.map {
      MoonPhase(julianDay: Astronomy.julianDay(year: $0.year, month: $0.month, day: $0.day))
    }
  }

  /// Tiêu đề ngày âm như trong app: "Mùng 3 tháng Mười", "Rằm tháng Giêng", "23 tháng Tám".
  /// Khoảng trắng không ngắt dòng: nếu phải xuống dòng thì chỉ ngắt giữa ngày và tháng.
  /// Chuỗi snapshot khác dạng thì hiện nguyên văn.
  var lunarTitle: String {
    guard let parts = lunarParts else { return lunar }
    let month = parts.month.replacingOccurrences(of: " ", with: nbsp)
    switch parts.day {
    case 15: return "Rằm \(month)"
    case 1...10: return "Mùng\(nbsp)\(parts.day) \(month)"
    default: return "\(parts.day) \(month)"
    }
  }

  /// Mùng 1 và rằm - chữ ngày âm tô màu âm lịch như trong app.
  var isMoonDay: Bool { lunarParts.map { $0.day == 1 || $0.day == 15 } ?? false }

  /// "Thứ sáu, 20/11"
  var solarLine: String {
    guard let solar = solarParts else { return "\(weekday), \(day)" }
    return "\(weekday), \(solar.day)/\(solar.month)"
  }

  /// "Ngày Mậu Tuất · Năm Bính Ngọ" → hai dòng.
  var canChiLines: [String] { canChi.components(separatedBy: " · ") }

  /// Câu đọc cho VoiceOver: "12 tháng Mười âm lịch. Thứ sáu, ngày 20 tháng 11. Nhà giáo Việt Nam".
  var spokenSummary: String {
    let solar = solarParts.map { "\(weekday), ngày \($0.day) tháng \($0.month)" } ?? weekday
    let title = lunarTitle.replacingOccurrences(of: nbsp, with: " ")
    return ([ "\(title) âm lịch", solar ] + highlights.map(\.text)).joined(separator: ". ")
  }
}

extension WidgetUpcoming {
  /// Số ngày còn lại, đọc từ chuỗi snapshot ("Ngày mai", "Còn 7 ngày").
  var daysAway: Int? {
    if when == "Ngày mai" { return 1 }
    return Int(when.filter(\.isNumber))
  }

  /// Gọn như danh sách "Sắp tới" trong app: "Mai", "7 ngày".
  var shortWhen: String {
    guard let days = daysAway else { return when }
    return days == 1 ? "Mai" : "\(days) ngày"
  }
}

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

// MARK: - Màu

private extension Color {
  /// Màu iOS đồng bộ với src/shared/theme/tokens.ts (sáng / tối).
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

  static let secondaryText = dynamic(light: 0x6E6E73, dark: 0x98989F)
  /// Đỏ son - màu nhấn, Chủ nhật và ngày nghỉ lễ.
  static let tint = dynamic(light: 0xC8281E, dark: 0xFF5F52)
  static let lunarAccent = dynamic(light: 0x9A5B00, dark: 0xF2B04F)
  static let moonLit = dynamic(light: 0xE2A23B, dark: 0xF2C36B)
  static let moonShade = dynamic(light: 0xE5E5EA, dark: 0x3A3A3C)
  static let event = dynamic(light: 0x2F6FDB, dark: 0x64A0FF)
}

// MARK: - Mặt trăng

/// Phần sáng của đĩa trăng - cùng hình học với moonLitPath (src/shared/ui/moonPath.ts):
/// nửa đĩa phía mặt trời (bên phải khi trăng tròn dần) và đường phân cách sáng tối là nửa
/// elip có bán trục ngang r·|cos φ|, φ = 2π·cycle.
struct MoonLitShape: Shape {
  let phase: MoonPhase

  func path(in rect: CGRect) -> Path {
    let r = min(rect.width, rect.height) / 2
    let center = CGPoint(x: rect.midX, y: rect.midY)
    let side: CGFloat = phase.waxing ? 1 : -1
    // > 0: trăng lưỡi liềm (đường phân cách cong về phía sáng); < 0: trăng khuyết sắp tròn.
    let terminator = CGFloat(cos(2 * Double.pi * phase.cycle))
    let steps = 64
    let point = { (index: Int, xScale: CGFloat) -> CGPoint in
      let angle = -CGFloat.pi / 2 + CGFloat.pi * CGFloat(index) / CGFloat(steps)
      return CGPoint(x: center.x + xScale * r * cos(angle), y: center.y + r * sin(angle))
    }

    var path = Path()
    // Mép đĩa phía sáng, từ đỉnh xuống đáy…
    path.move(to: point(0, side))
    for index in 1...steps {
      path.addLine(to: point(index, side))
    }
    // …rồi theo đường phân cách từ đáy về đỉnh.
    for index in stride(from: steps, through: 0, by: -1) {
      path.addLine(to: point(index, side * terminator))
    }
    path.closeSubpath()
    return path
  }
}

/// Đĩa trăng đúng pha: phần sáng màu trăng, phần tối màu trung tính - dấu hiệu của app.
struct MoonView: View {
  let phase: MoonPhase?

  var body: some View {
    if #available(iOSApplicationExtension 16.0, *) {
      RenderingModeMoon(phase: phase)
    } else {
      MoonDisc(phase: phase, shade: .moonShade)
    }
  }
}

/// Chế độ tô một màu (accented, iOS 18) bỏ màu riêng của widget: phần tối làm mờ, phần sáng
/// nhận màu nhấn → vẫn đọc được pha trăng.
@available(iOSApplicationExtension 16.0, *)
private struct RenderingModeMoon: View {
  @Environment(\.widgetRenderingMode) private var renderingMode
  let phase: MoonPhase?

  var body: some View {
    MoonDisc(
      phase: phase,
      shade: renderingMode == .fullColor ? .moonShade : Color.primary.opacity(0.25)
    )
  }
}

private struct MoonDisc: View {
  let phase: MoonPhase?
  let shade: Color

  var body: some View {
    // Ngưỡng giống moonLitPath: gần sóc không vẽ phần sáng, gần vọng tô kín đĩa.
    let illumination = phase?.illumination ?? 0
    ZStack {
      Circle().fill(shade)
      if illumination > 0.985 {
        Circle().fill(Color.moonLit).accentable()
      } else if let phase = phase, illumination >= 0.02 {
        MoonLitShape(phase: phase).fill(Color.moonLit).accentable()
      }
    }
  }
}

private extension View {
  @ViewBuilder
  func accentable() -> some View {
    if #available(iOSApplicationExtension 16.0, *) {
      widgetAccentable()
    } else {
      self
    }
  }
}

// MARK: - Giao diện

/// Trăng ở góc trên; dưới cùng là ngày âm (tiêu đề), ngày dương và ngày lễ / sự kiện hôm nay.
struct DaySummary: View {
  let day: WidgetDay

  var body: some View {
    VStack(alignment: .leading, spacing: 2) {
      MoonView(phase: day.moonPhase)
        .frame(width: 34, height: 34)
      Spacer(minLength: 6)
      Text(day.lunarTitle)
        .font(.headline)
        .foregroundStyle(day.isMoonDay ? Color.lunarAccent : Color.primary)
        .lineLimit(2)
        .minimumScaleFactor(0.8)
        .layoutPriority(2)
      Text(day.solarLine)
        .font(.subheadline)
        .foregroundStyle(day.isRedDay ? Color.tint : Color.secondaryText)
        .lineLimit(1)
        .minimumScaleFactor(0.8)
        .layoutPriority(1)
      if let highlight = day.highlights.first {
        Text(highlight.text)
          .font(.footnote)
          .foregroundStyle(color(of: highlight))
          .lineLimit(1)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(day.spokenSummary)
  }

  /// Như trong app: sự kiện cá nhân màu xanh, ngày nghỉ lễ màu đỏ son, ngày kỷ niệm chữ thường.
  private func color(of highlight: WidgetHighlight) -> Color {
    switch highlight.kind {
    case .event: return .event
    case .holiday: return day.isRedDay ? .tint : .primary
    }
  }
}

/// Danh sách "Sắp tới" dạng hàng trơn: ký hiệu, tên, số ngày còn lại canh phải.
struct UpcomingList: View {
  let day: WidgetDay

  var body: some View {
    if day.upcoming.isEmpty {
      // Không có sự kiện sắp tới: hiện can chi, canh đáy cùng khối chữ bên trái.
      VStack(alignment: .leading, spacing: 2) {
        Spacer(minLength: 0)
        ForEach(day.canChiLines, id: \.self) { line in
          Text(line)
            .font(.subheadline)
            .foregroundStyle(Color.secondaryText)
            .lineLimit(1)
            .minimumScaleFactor(0.8)
        }
      }
    } else {
      VStack(alignment: .leading, spacing: 8) {
        Text("Sắp tới")
          .font(.footnote.weight(.semibold))
          .foregroundStyle(Color.secondaryText)
        ForEach(day.upcoming, id: \.self) { item in
          UpcomingRow(item: item)
        }
        Spacer(minLength: 0)
      }
    }
  }
}

struct UpcomingRow: View {
  let item: WidgetUpcoming

  var body: some View {
    // Cùng cỡ chữ hai bên nên canh giữa theo chiều dọc cũng là canh theo đường chân chữ.
    HStack(spacing: 6) {
      UpcomingMark(mark: item.mark)
      Text(item.title)
        .foregroundStyle(Color.primary)
        .lineLimit(1)
      Spacer(minLength: 8)
      Text(item.shortWhen)
        .foregroundStyle((item.daysAway ?? 2) <= 1 ? Color.tint : Color.secondaryText)
        .lineLimit(1)
        .layoutPriority(1)
    }
    .font(.subheadline.monospacedDigit())
    .accessibilityElement(children: .ignore)
    .accessibilityLabel("\(item.title), \(item.when)")
  }
}

/// Cùng bộ ký hiệu với lưới lịch trong app: chấm đặc = sự kiện, đĩa trăng = rằm,
/// vòng màu trăng = mùng 1, vòng đỏ = ngày lễ. Phân biệt bằng hình, không chỉ bằng màu.
struct UpcomingMark: View {
  let mark: WidgetUpcoming.Mark
  private let size: CGFloat = 9
  private let ring: CGFloat = 1.5

  var body: some View {
    Group {
      switch mark {
      case .event: Circle().fill(Color.event).frame(width: 7, height: 7)
      case .fullMoon: Circle().fill(Color.moonLit)
      case .newMoon: Circle().strokeBorder(Color.lunarAccent, lineWidth: ring)
      case .holiday: Circle().strokeBorder(Color.tint, lineWidth: ring)
      }
    }
    .frame(width: size, height: size)
    .accessibilityHidden(true)
  }
}

struct LichVietWidgetView: View {
  @Environment(\.widgetFamily) private var family
  let entry: DayEntry

  var body: some View {
    content
      .widgetURL(URL(string: "lichviet://today"))
      .widgetBackground()
  }

  @ViewBuilder
  private var content: some View {
    if let day = entry.day {
      if family == .systemMedium {
        GeometryReader { proxy in
          HStack(alignment: .top, spacing: 16) {
            DaySummary(day: day)
              .frame(width: (proxy.size.width - 16) * 0.44)
            UpcomingList(day: day)
              .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
          }
        }
      } else {
        DaySummary(day: day)
      }
    } else {
      Text("Mở Lịch Việt để cập nhật lịch")
        .font(.footnote)
        .foregroundStyle(Color.secondaryText)
        .multilineTextAlignment(.center)
    }
  }
}

private extension View {
  /// Nền hệ thống (trắng / đen). iOS 17 bắt buộc khai báo qua containerBackground để hệ thống
  /// tự bỏ nền ở chế độ tô màu và StandBy; iOS cũ hơn dùng nền thường.
  @ViewBuilder
  func widgetBackground() -> some View {
    if #available(iOSApplicationExtension 17.0, *) {
      containerBackground(for: .widget) { Color(UIColor.systemBackground) }
    } else {
      padding().background(Color(UIColor.systemBackground))
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
    .configurationDisplayName("Lịch Việt - Hôm nay")
    .description("Ngày dương, ngày âm và sự kiện sắp tới.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
