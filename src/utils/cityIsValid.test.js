import { cityIsValid } from './cityIsValid';

describe('cityIsValid', () => {
  it('should return true for valid Norwegian city', () => {
    expect(cityIsValid('Oslo')).toBe(true);
  });

  it('should be case-insensitive', () => {
    expect(cityIsValid('oslo')).toBe(true);
    expect(cityIsValid('OSLO')).toBe(true);
  });

  it('should return false for non-existent city', () => {
    expect(cityIsValid('FakeCity123')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(cityIsValid('')).toBe(false);
  });

  it('should return false for null', () => {
    expect(cityIsValid(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(cityIsValid(undefined)).toBe(false);
  });
});

