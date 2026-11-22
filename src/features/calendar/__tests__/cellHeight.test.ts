import { cellHeightFor } from '../constants';

describe('chiều cao ô ngày', () => {
  it('cỡ chữ mặc định: vừa đủ vòng tròn "hôm nay" + ngày âm + hàng ký hiệu', () => {
    // Vòng tròn 20 + ngày âm 12 + hàng ký hiệu 5 + khoảng hở 3.
    expect(cellHeightFor(1)).toBe(40);
  });

  it('chữ to: ô cao theo dòng ngày âm đã phóng', () => {
    // Dòng số ngày 16 x 1.3 vượt vòng tròn 20; ngày âm 12 x 1.3.
    expect(cellHeightFor(2)).toBe(Math.ceil(16 * 1.3 + 12 * 1.3 + 5 + 3));
  });

  it('phóng chữ vượt trần không làm ô cao thêm', () => {
    expect(cellHeightFor(3.1)).toBe(cellHeightFor(1.3));
  });

  it('cỡ chữ nhỏ hơn mặc định không làm ô thấp hơn', () => {
    expect(cellHeightFor(0.85)).toBe(cellHeightFor(1));
  });
});
