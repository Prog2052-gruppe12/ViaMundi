import sum from './sum';

describe('sum', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('adds negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  test('adds zero', () => {
    expect(sum(0, 5)).toBe(5);
  });
});