import { moonLitPath, moonShape } from '../moonPath';

describe('đường vẽ phần sáng của trăng', () => {
  it('trăng mới: không vẽ phần sáng; trăng tròn: cả đĩa', () => {
    expect(
      moonLitPath({ cycle: 0, illumination: 0, waxing: true }, 10),
    ).toEqual({ fill: 'none' });
    expect(
      moonLitPath({ cycle: 0.5, illumination: 1, waxing: false }, 10),
    ).toEqual({ fill: 'full' });
  });

  it('thượng huyền (nửa đầu tháng): mép sáng bên phải, đường phân cách thẳng', () => {
    expect(
      moonLitPath({ cycle: 0.25, illumination: 0.5, waxing: true }, 10),
    ).toEqual({
      fill: 'partial',
      path: 'M0 -10A10 10 0 0 1 0 10A0 10 0 0 0 0 -10Z',
    });
  });

  it('trăng khuyết cuối tháng: mép sáng bên trái', () => {
    expect(
      moonLitPath({ cycle: 0.9, illumination: 0.1, waxing: false }, 10),
    ).toEqual({
      fill: 'partial',
      path: 'M0 -10A10 10 0 0 0 0 10A8.09 10 0 0 1 0 -10Z',
    });
  });
});

describe('hình trăng vẽ bằng View', () => {
  it('14 âm (trăng gần tròn, tròn dần): nửa phải sáng, elip sáng lấn sang trái', () => {
    const shape = moonShape({ cycle: 0.46, illumination: 0.97, waxing: true });
    expect(shape.fill).toBe('partial');
    expect(shape.litSide).toBe('right');
    expect(shape.isTerminatorLit).toBe(true);
    expect(shape.terminatorScale).toBeGreaterThan(0.9);
  });

  it('trăng lưỡi liềm cuối tháng: nửa trái sáng, elip tối che bớt', () => {
    const shape = moonShape({ cycle: 0.9, illumination: 0.1, waxing: false });
    expect(shape.litSide).toBe('left');
    expect(shape.isTerminatorLit).toBe(false);
  });
});
