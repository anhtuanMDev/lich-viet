import { isColorOsBrand, powerManagerRoute } from '../powerManager';

describe('cài đặt pin theo hãng', () => {
  it('Oppo, Realme, OnePlus (ColorOS) mở Thông tin ứng dụng', () => {
    expect(powerManagerRoute('OPPO', true)).toBe('appSettings');
    expect(powerManagerRoute('realme', true)).toBe('appSettings');
    expect(powerManagerRoute('OnePlus', false)).toBe('appSettings');
  });

  it('hãng khác có màn hình riêng thì thử màn hình đó', () => {
    expect(powerManagerRoute('Xiaomi', true)).toBe('oem');
    expect(powerManagerRoute('vivo', true)).toBe('oem');
  });

  it('không có màn hình riêng thì không hiện nút', () => {
    expect(powerManagerRoute('Google', false)).toBeNull();
    expect(powerManagerRoute(null, false)).toBeNull();
  });

  it('so khớp hãng không phân biệt hoa thường, bỏ khoảng trắng', () => {
    expect(isColorOsBrand(' Oppo ')).toBe(true);
    expect(isColorOsBrand('samsung')).toBe(false);
    expect(isColorOsBrand(null)).toBe(false);
  });
});
