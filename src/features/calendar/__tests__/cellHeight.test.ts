import { cellHeightFor } from '../constants';

describe('chiều cao ô ngày', () => {
  it('cỡ chữ mặc định, màn rộng: giữ tỉ lệ theo chiều rộng', () => {
    expect(cellHeightFor(430, 1)).toBe(Math.ceil((430 / 7) * 1.05));
  });

  it('cỡ chữ mặc định, màn thường: đủ chỗ cho vòng tròn "hôm nay" + ngày âm + chấm', () => {
    // Vòng tròn 34 + ngày âm 13 + hàng chấm 7 + khoảng hở 8.
    expect(cellHeightFor(392, 1)).toBe(62);
  });

  it('màn hẹp (cỡ hiển thị lớn) + chữ to: ô cao đủ chứa chữ', () => {
    const height = cellHeightFor(308, 2);
    // Số ngày (22) + ngày âm (14), phóng tối đa 1.3x, cộng hàng chấm và khoảng hở.
    expect(height).toBeGreaterThanOrEqual(Math.ceil(36 * 1.3 + 13));
    expect(height).toBeGreaterThan((308 / 7) * 1.05);
  });

  it('phóng chữ vượt trần không làm ô cao thêm', () => {
    expect(cellHeightFor(308, 3.1)).toBe(cellHeightFor(308, 1.3));
  });

  it('cỡ chữ nhỏ hơn mặc định không làm ô thấp hơn tỉ lệ', () => {
    expect(cellHeightFor(392, 0.85)).toBe(cellHeightFor(392, 1));
  });
});
