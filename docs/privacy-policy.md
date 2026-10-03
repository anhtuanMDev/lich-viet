---
title: Chính sách quyền riêng tư – Lịch Việt
---

# Chính sách quyền riêng tư – Lịch Việt

**Hiệu lực từ:** 03/10/2026  
**Nhà phát triển:** [TÊN NHÀ PHÁT TRIỂN]  
**Liên hệ:** [EMAIL LIÊN HỆ]

Lịch Việt là ứng dụng xem lịch dương – âm, ghi nhớ ngày giỗ, sinh nhật và nhắc lịch. Ứng dụng
**không có tài khoản, không có quảng cáo, không theo dõi người dùng** và không có máy chủ riêng
lưu dữ liệu của bạn. Tài liệu này giải thích dữ liệu nào được xử lý, ở đâu và vì sao.

## 1. Dữ liệu bạn nhập – chỉ nằm trên máy của bạn

- **Sự kiện** bạn tạo (tên, ngày âm/dương, kiểu lặp lại, số ngày nhắc trước, ghi chú) và
  **cài đặt** của ứng dụng được lưu trong bộ nhớ của ứng dụng trên thiết bị.
- Nhà phát triển **không nhận được** và **không thể xem** các dữ liệu này.
- **Thông báo nhắc lịch** được hệ điều hành đặt lịch ngay trên máy; không có máy chủ gửi thông báo.
- **Widget màn hình chính** đọc dữ liệu từ chính ứng dụng trên máy (trên iPhone qua vùng chia sẻ
  App Group giữa ứng dụng và widget).

## 2. Sao lưu

- **Sao lưu tự động của hệ điều hành:** trên Android, dữ liệu ứng dụng có thể được đưa vào bản sao
  lưu của Google (Google Drive, mã hoá, gắn với tài khoản Google của bạn); trên iPhone, vào bản sao
  lưu iCloud/máy tính của bạn. Việc này do Google/Apple thực hiện theo cài đặt máy của bạn và chịu
  chính sách quyền riêng tư của họ. Bạn có thể tắt sao lưu trong cài đặt của máy.
- **Xuất dữ liệu thủ công:** khi bạn chọn "Xuất dữ liệu", nội dung sự kiện được chuyển cho ứng dụng
  bạn chọn (Zalo, email, ghi chú…). Ứng dụng không tự gửi đi đâu khác.

## 3. Báo cáo lỗi (Firebase Crashlytics)

Để phát hiện và sửa lỗi, ứng dụng dùng **Firebase Crashlytics** của Google LLC. Khi ứng dụng gặp
lỗi, các thông tin kỹ thuật sau có thể được gửi đi:

- Dấu vết lỗi (vị trí lỗi trong mã nguồn), thời điểm xảy ra lỗi, nhãn kỹ thuật cho biết lỗi xảy
  ra ở chức năng nào (ví dụ "đồng bộ nhắc lịch").
- Thông tin thiết bị: hãng và mẫu máy, phiên bản hệ điều hành, phiên bản ứng dụng, ngôn ngữ, hướng
  màn hình, dung lượng bộ nhớ/ổ đĩa còn trống, máy đã root/jailbreak hay chưa.
- Một **mã cài đặt ngẫu nhiên** do Firebase tạo (không gắn với tên, số điện thoại, email hay tài
  khoản nào của bạn), dùng để đếm số máy bị ảnh hưởng bởi cùng một lỗi.
- Địa chỉ IP của kết nối mạng khi gửi báo cáo (cần cho việc truyền dữ liệu).

**Không bao giờ** gửi: tên sự kiện, ghi chú, ngày bạn lưu hay bất kỳ nội dung nào bạn nhập.

- **Mục đích:** duy nhất là tìm và sửa lỗi để ứng dụng ổn định hơn. Không dùng cho quảng cáo, không
  bán, không chia sẻ cho bên thứ ba nào khác.
- **Nơi lưu và thời hạn:** máy chủ của Google, có thể đặt ngoài Việt Nam (ví dụ Hoa Kỳ). Crashlytics
  giữ báo cáo lỗi và mã cài đặt tối đa **90 ngày**, sau đó tự xoá.
- **Tắt báo cáo lỗi:** vào **Cài đặt → Báo cáo lỗi** và tắt "Gửi báo cáo lỗi". Sau khi tắt, ứng
  dụng không gửi báo cáo nào nữa.
- Tham khảo: [Quyền riêng tư và bảo mật trong Firebase](https://firebase.google.com/support/privacy).

## 4. Quyền ứng dụng sử dụng

| Quyền | Mục đích |
| --- | --- |
| Thông báo | Hiện lời nhắc sự kiện, mùng 1 và rằm. Bạn có thể từ chối; lịch vẫn dùng được bình thường. |
| Báo thức và lời nhắc chính xác (Android) | Nhắc **đúng giờ** bạn đã chọn kể cả khi máy ở chế độ tiết kiệm pin. |
| Chạy khi khởi động máy, chạy nền (Android) | Đặt lại lịch nhắc sau khi khởi động lại máy và cập nhật widget. |
| Internet | Chỉ để gửi báo cáo lỗi (mục 3) và mở liên kết bạn bấm. |

Ứng dụng **không** truy cập vị trí, danh bạ, ảnh, micro, camera hay lịch hệ thống của máy.

## 5. Trẻ em

Ứng dụng phù hợp với mọi lứa tuổi và không thu thập có chủ đích dữ liệu cá nhân của trẻ em. Ngoài
báo cáo lỗi kỹ thuật ở mục 3 (có thể tắt), ứng dụng không gửi dữ liệu nào ra khỏi máy.

## 6. Quyền của bạn

Theo pháp luật Việt Nam về bảo vệ dữ liệu cá nhân, bạn có quyền được biết, đồng ý hoặc rút lại sự
đồng ý, truy cập, chỉnh sửa và yêu cầu xoá dữ liệu của mình. Với Lịch Việt:

- Dữ liệu sự kiện nằm trên máy bạn: bạn xem, sửa, xoá trực tiếp trong ứng dụng; gỡ ứng dụng sẽ xoá
  toàn bộ dữ liệu trên máy (bản sao lưu của Google/iCloud do bạn quản lý trong tài khoản của mình).
- Rút lại đồng ý gửi báo cáo lỗi: tắt "Gửi báo cáo lỗi" trong Cài đặt bất cứ lúc nào.
- Mọi câu hỏi hoặc yêu cầu khác, vui lòng liên hệ: **[EMAIL LIÊN HỆ]**. Chúng tôi phản hồi trong vòng
  72 giờ làm việc. Lưu ý: vì báo cáo lỗi không gắn với danh tính, chúng tôi thường không thể xác
  định báo cáo nào là của bạn; báo cáo sẽ tự xoá sau 90 ngày.

## 7. Bảo mật

Dữ liệu trên máy được bảo vệ bởi cơ chế cách ly ứng dụng của Android/iOS. Báo cáo lỗi được truyền
qua kết nối mã hoá (HTTPS).

## 8. Thay đổi chính sách

Khi chính sách thay đổi, chúng tôi cập nhật trang này và ngày hiệu lực ở đầu trang. Nếu thay đổi
làm mở rộng dữ liệu được thu thập, ứng dụng sẽ thông báo cho bạn trước khi áp dụng.
