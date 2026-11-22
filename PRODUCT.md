# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

Một mã nguồn React Native cho iOS và Android. Người dùng đã chọn: cùng một bản sắc Lịch Việt, nhưng mỗi hệ điều hành theo quy ước riêng của nó (iOS theo kiểu Apple, Android theo Material: thanh tab, nút, chuyển màn, sheet khác nhau).

## Users

Người Việt 25-45 tuổi, bận rộn, quen dùng app hiện đại. Họ dùng Lịch Việt để nhớ thay cho cả nhà: ngày giỗ ông bà, sinh nhật âm lịch của bố mẹ, mùng 1 và rằm, các dịp lễ Tết. Việc chính: biết hôm nay là ngày âm nào, thấy trước những ngày cần lo trong tháng, và được nhắc kịp để chuẩn bị.

## Product Purpose

Lịch âm dương gọn nhẹ, chính xác cho người Việt: xem ngày âm, can chi, tiết khí, ngày và giờ hoàng đạo; lưu sự kiện theo ngày âm hoặc dương, lặp hằng năm; nhắc bằng thông báo cục bộ; đổi ngày âm ↔ dương; widget màn hình chính. Thành công là người dùng không bao giờ lỡ một ngày giỗ, và liếc một cái là biết hôm nay âm lịch ngày mấy.

## Positioning

- Âm lịch tính theo giờ chuẩn Việt Nam (UTC+7), thuật toán TS. Hồ Ngọc Đức, kiểm chứng từng ngày 1900-2100. Nhiều app dùng thư viện Trung Quốc (UTC+8) nên lệch ngày ở một số năm (VD Tết 1985, Tết 2007).
- Sự kiện âm lịch lặp hằng năm xử lý đúng tháng nhuận và tháng thiếu.
- Không quảng cáo, không tài khoản, không mua trong app. Dữ liệu chỉ nằm trên máy và trong bản sao lưu của chính người dùng.

## Operating Context

- Mở nhanh để xem hôm nay (tab Hôm nay, widget).
- Lướt lịch tháng để thấy mùng 1, rằm, ngày lễ, sự kiện cá nhân; bấm một ngày để xem chi tiết (sheet).
- Thêm/sửa sự kiện: nhập ngày âm hoặc dương, chọn lặp và nhắc.
- Nhận thông báo nhắc (gộp một thông báo mỗi ngày), bấm vào mở đúng ngày.
- Đổi ngày âm ↔ dương khi cần tra cứu.
- Chỉ phát hành ở Việt Nam, giao diện tiếng Việt. Google Play: Năng suất; App Store: Tiện ích.

## Capabilities and Constraints

- Màn hình: 4 tab (Hôm nay, Lịch, Sự kiện, Đổi ngày); Chi tiết ngày (formSheet); Thêm/sửa sự kiện (modal); Cài đặt (nhắc lịch, giao diện sáng/tối/theo máy, tuần bắt đầu từ, widget, sao lưu, báo cáo lỗi, chính sách quyền riêng tư); Nhập dữ liệu.
- Hỗ trợ năm 1900-2100.
- React Native 0.87 (New Architecture), react-navigation (bottom tabs, native stack). Hiện chưa có thư viện icon (tab dùng ký tự Unicode) và chưa có font riêng (dùng font hệ thống).
- Style qua `createThemedStyles` và token trong `src/shared/theme`; ESLint cấm inline style.
- Widget vẽ riêng ở native: SwiftUI (`ios/LichVietWidget`) và JSX của `react-native-android-widget`.
- Chế độ tối là tính năng đã quảng bá trên store, phải giữ.

## Brand Commitments

- Tên: Lịch Việt.
- Giọng văn: tiếng Việt, rõ ràng, lịch sự, không màu mè.
- Icon app hiện tại (lịch đỏ, mái chùa, hoa mai) có thể làm lại nếu hướng giao diện mới cần; người dùng xác nhận không bắt buộc giữ.
- Cam kết riêng tư: không đưa nội dung người dùng nhập vào log/báo cáo lỗi.

## Evidence on Hand

- Nội dung store: `docs/store/listing.md`; icon Play `docs/store/assets/play-icon-512.png`; ảnh nổi bật `docs/store/assets/feature-graphic-1024x500.png`; nguồn icon `assets/logo/`.
- Đã lên Google Play (bản 1.0.3). Chưa có đánh giá, số lượt tải hay lời chứng thực nào được ghi nhận: không bịa ra.

## Product Principles

1. Chính xác trước hết: mọi ngày, can chi, giờ hiển thị đều phải đúng; không hiện thứ chưa chắc chắn.
2. Liếc là thấy: ngày âm của hôm nay và ngày sắp cần lo luôn ở ngay tầm mắt.
3. Không lỡ ngày giỗ: sự kiện và lời nhắc là lý do người dùng giữ app.
4. Riêng tư và yên tĩnh: không quảng cáo, không tài khoản, không làm phiền.
5. Tự nhiên trên từng hệ điều hành: người dùng iPhone và Android đều thấy app như sinh ra cho máy của họ.

## Accessibility & Inclusion

- VoiceOver/TalkBack đọc câu tiếng Việt tự nhiên (nhãn riêng trong `src/core/a11y`).
- Cỡ chữ theo máy có trần: nội dung 1.6x, khung cố định (ô lịch, thanh tab, số lớn) 1.3x. Bố cục không được vỡ khi chữ to.
- Vùng bấm tối thiểu 44pt / 48dp. Hỗ trợ sáng/tối.
