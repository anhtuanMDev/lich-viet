import { convert, leapMonthAvailable } from '../dateInput';
import type { ConverterInput } from '../dateInput';

const input = (overrides: Partial<ConverterInput>): ConverterInput => ({
  direction: 'solarToLunar',
  day: '',
  month: '',
  year: '',
  isLeapMonth: false,
  ...overrides,
});

describe('convert', () => {
  it('chưa đủ dữ liệu khi năm chưa gõ xong', () => {
    expect(convert(input({ day: '1', month: '1', year: '202' }))).toEqual({
      status: 'incomplete',
    });
  });

  it('đổi dương → âm', () => {
    const result = convert(input({ day: '10', month: '2', year: '2024' }));
    expect(result).toMatchObject({
      status: 'ok',
      lunar: { year: 2024, month: 1, day: 1, isLeapMonth: false },
    });
  });

  it('đổi âm → dương, có tháng nhuận', () => {
    const result = convert(
      input({
        direction: 'lunarToSolar',
        day: '2',
        month: '2',
        year: '2023',
        isLeapMonth: true,
      }),
    );
    expect(result).toMatchObject({
      status: 'ok',
      solar: { year: 2023, month: 3, day: 23 },
    });
  });

  it('bỏ qua cờ nhuận nếu tháng đó không nhuận', () => {
    const result = convert(
      input({
        direction: 'lunarToSolar',
        day: '1',
        month: '1',
        year: '2024',
        isLeapMonth: true,
      }),
    );
    expect(result).toMatchObject({
      status: 'ok',
      solar: { year: 2024, month: 2, day: 10 },
    });
  });

  it.each`
    overrides                                                             | field
    ${{ day: '31', month: '2', year: '2024' }}                            | ${'day'}
    ${{ day: '1', month: '13', year: '2024' }}                            | ${'month'}
    ${{ day: '1', month: '1', year: '1800' }}                             | ${'year'}
    ${{ direction: 'lunarToSolar', day: '31', month: '1', year: '2024' }} | ${'day'}
  `('báo lỗi trường $field', ({ overrides, field }) => {
    expect(convert(input(overrides))).toMatchObject({
      status: 'invalid',
      field,
    });
  });
});

describe('leapMonthAvailable', () => {
  it('chỉ bật khi đúng tháng nhuận của năm', () => {
    expect(leapMonthAvailable('2', '2023')).toBe(true);
    expect(leapMonthAvailable('3', '2023')).toBe(false);
    expect(leapMonthAvailable('2', '202')).toBe(false);
  });
});
