import { parseYMD } from './parseYMD';

describe('parseYMD', () => {
  it('should parse valid date string', () => {
    const date = parseYMD('2025-06-15');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(5); 
    expect(date.getDate()).toBe(15);
  });

  it('should parse date with single digit month', () => {
    const date = parseYMD('2025-01-15');
    expect(date.getMonth()).toBe(0); // January
  });

  it('should parse date with single digit day', () => {
    const date = parseYMD('2025-06-05');
    expect(date.getDate()).toBe(5);
  });

  it('should return null for empty string', () => {
    expect(parseYMD('')).toBeNull();
  });

  it('should return null for null', () => {
    expect(parseYMD(null)).toBeNull();
  });

  it('should return null for undefined', () => {
    expect(parseYMD(undefined)).toBeNull();
  });

  it('should return null for invalid date format', () => {
    expect(parseYMD('not-a-date')).toBeNull();
  });

  it('should handle invalid month (JavaScript Date wraps around)', () => {

    const date = parseYMD('2025-13-01');
    expect(date).toBeInstanceOf(Date);
  });

  it('should handle leap year', () => {
    const date = parseYMD('2024-02-29');
    expect(date).toBeInstanceOf(Date);
    expect(date.getDate()).toBe(29);
  });
});

