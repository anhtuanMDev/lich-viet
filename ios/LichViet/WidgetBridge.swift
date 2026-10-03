import Foundation
import React
import WidgetKit

/// Cầu nối JS → widget iOS: lưu dữ liệu widget (JSON do JS tính sẵn) vào App Group
/// và yêu cầu WidgetKit vẽ lại. Định dạng JSON: src/core/widget/snapshot.ts.
@objc(WidgetBridge)
final class WidgetBridge: NSObject {
  static let appGroup = "group.com.lichviet.app"
  static let snapshotKey = "widget.snapshot"

  @objc static func requiresMainQueueSetup() -> Bool { false }

  @objc func setSnapshot(
    _ json: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    guard let defaults = UserDefaults(suiteName: Self.appGroup) else {
      reject("app_group_unavailable", "Không mở được App Group \(Self.appGroup)", nil)
      return
    }
    defaults.set(json, forKey: Self.snapshotKey)
    WidgetCenter.shared.reloadAllTimelines()
    resolve(nil)
  }
}
