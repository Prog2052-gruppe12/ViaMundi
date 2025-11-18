import { formatYMDLocal } from './formatYMDLocal';

describe('formatYMDLocal', () => {
  it('should format date correctly', () => {
    const date = new Date(2025, 5, 15); // June 15, 2025
    expect(formatYMDLocal(date)).toBe('2025-06-15');
  });

  it('should pad single digit month', () => {
    const date = new Date(2025, 0, 15); // January 15, 2025
    expect(formatYMDLocal(date)).toBe('2025-01-15');
  });

  it('should pad single digit day', () => {
    const date = new Date(2025, 5, 5); // June 5, 2025
    expect(formatYMDLocal(date)).toBe('2025-06-05');
  });

  it('should handle first day of year', () => {
    const date = new Date(2025, 0, 1); // January 1, 2025
    expect(formatYMDLocal(date)).toBe('2025-01-01');
  });

  it('should handle last day of year', () => {
    const date = new Date(2025, 11, 31); // December 31, 2025
    expect(formatYMDLocal(date)).toBe('2025-12-31');
  });

  it('should return empty string for invalid date', () => {
    expect(formatYMDLocal('not a date')).toBe('');
  });

  it('should return empty string for null', () => {
    expect(formatYMDLocal(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(formatYMDLocal(undefined)).toBe('');
  });
});

