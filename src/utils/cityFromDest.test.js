import { getCityName } from './cityFromDest';

describe('getCityName', () => {
  it('should extract city from "City, Country" format', () => {
    expect(getCityName('Oslo, Norway')).toBe('Norway');
  });

  it('should trim whitespace', () => {
    expect(getCityName('Oslo,   Norway  ')).toBe('Norway');
  });

  it('should handle multiple commas', () => {
    expect(getCityName('City, State, Country')).toBe('State');
  });

  it('should handle destination with only comma', () => {
    expect(getCityName('Oslo,')).toBe('');
  });
});

