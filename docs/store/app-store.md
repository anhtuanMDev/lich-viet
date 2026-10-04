# Khai báo App Store Connect

## 1. App Privacy ("nhãn dinh dưỡng")

**Do you or your third-party partners collect data from this app?** → **Yes**

Chỉ chọn nhóm **Diagnostics**, khớp với `ios/LichViet/PrivacyInfo.xcprivacy` và manifest của Firebase:

| Data type | Purposes | Linked to user? | Used for tracking? |
| --- | --- | --- | --- |
| **Crash Data** | App Functionality | **No** | **No** |
| **Other Diagnostic Data** | App Functionality, Analytics | **No** | **No** |

- Không chọn Identifiers, Contact Info, Location, User Content… - sự kiện người dùng chỉ lưu trên
  máy (và iCloud Backup của chính họ, Apple không tính là thu thập).
- Kết quả hiển thị trên App Store: "Data Not Linked to You - Diagnostics".
- **Không** cần App Tracking Transparency (không theo dõi, không quảng cáo, không IDFA).

## 2. Privacy manifest (đã có trong repo)

`ios/LichViet/PrivacyInfo.xcprivacy`:

- `NSPrivacyTracking = false`, không có tracking domain.
- Collected data: Crash Data, Other Diagnostic Data (không liên kết, không theo dõi).
- Required reason API: UserDefaults (CA92.1, 1C8F.1 - App Group cho widget, C56D.1), File timestamp
  (C617.1), System boot time (35F9.1) - `pod install` tự gộp từ các thư viện; chạy lại `pod install`
  sau khi đổi thư viện rồi kiểm tra diff.

## 3. Thông tin khác

| Mục | Trả lời |
| --- | --- |
| Age rating | Mọi mục **None** / **No** → **4+** |
| Export compliance | Đã khai báo `ITSAppUsesNonExemptEncryption = NO` trong `Info.plist` (chỉ dùng HTTPS của hệ thống) → không bị hỏi mỗi lần nộp |
| Sign-in required | No |
| Content rights | Không dùng nội dung của bên thứ ba |
| Privacy Policy URL | `https://portfolio-three-theta-41.vercel.app/lich-viet/privacy-policy/` |
| Support URL | `https://github.com/anhtuanMDev/lich-viet/issues` (hoặc trang hỗ trợ riêng) |
| Availability | Chỉ **Vietnam** |
| Price | Free |

## 4. Ghi chú cho người duyệt (App Review Information → Notes)

```
No account or login is required. All features are available immediately.
- Reminders: add an event (Sự kiện tab → "+ Thêm sự kiện"), pick a reminder option, or use
  Settings → "Gửi thông báo thử" to send a test notification.
- Home-screen widget: long-press the home screen → add "Lịch Việt" widget.
- Crash reporting (Firebase Crashlytics) can be turned off in Settings → "Báo cáo lỗi".
The app is in Vietnamese and is distributed in Vietnam only.
```

## 5. Trước khi nộp

- Chọn Team cho target `LichViet` và `LichVietWidget`, bật App Group `group.com.lichviet.app`.
- Thêm `GoogleService-Info.plist` (xem README - mục Báo cáo lỗi) để Crashlytics hoạt động và tải dSYM.
