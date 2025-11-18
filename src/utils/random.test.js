import { hashString, rng, pickSeeded } from './random';

describe('hashString', () => {
  it('should return a number', () => {
    const result = hashString('test');
    expect(typeof result).toBe('number');
  });

  it('should return same hash for same string', () => {
    const hash1 = hashString('hello');
    const hash2 = hashString('hello');
    expect(hash1).toBe(hash2);
  });

  it('should return different hashes for different strings', () => {
    const hash1 = hashString('hello');
    const hash2 = hashString('world');
    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty string', () => {
    const result = hashString('');
    expect(typeof result).toBe('number');
  });
});

describe('rng', () => {
  it('should return a function', () => {
    const random = rng(12345);
    expect(typeof random).toBe('function');
  });

  it('should generate numbers between 0 and 1', () => {
    const random = rng(12345);
    for (let i = 0; i < 10; i++) {
      const num = random();
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(1);
    }
  });

  it('should generate same sequence for same seed', () => {
    const random1 = rng(42);
    const random2 = rng(42);
    
    const seq1 = [random1(), random1(), random1()];
    const seq2 = [random2(), random2(), random2()];
    
    expect(seq1).toEqual(seq2);
  });

  it('should generate different sequences for different seeds', () => {
    const random1 = rng(42);
    const random2 = rng(99);
    
    expect(random1()).not.toBe(random2());
  });
});

describe('pickSeeded', () => {
  it('should pick requested number of items', () => {
    const arr = [1, 2, 3, 4, 5];
    const picked = pickSeeded(arr, 3, 'test-seed');
    expect(picked).toHaveLength(3);
  });

  it('should return same items for same seed', () => {
    const arr = [1, 2, 3, 4, 5];
    const picked1 = pickSeeded(arr, 3, 'seed123');
    const picked2 = pickSeeded(arr, 3, 'seed123');
    expect(picked1).toEqual(picked2);
  });

  it('should return different items for different seeds', () => {
    const arr = [1, 2, 3, 4, 5];
    const picked1 = pickSeeded(arr, 3, 'seed1');
    const picked2 = pickSeeded(arr, 3, 'seed2');
    expect(picked1).not.toEqual(picked2);
  });

  it('should handle picking more items than array length', () => {
    const arr = [1, 2, 3];
    const picked = pickSeeded(arr, 5, 'test');
    expect(picked).toHaveLength(5);
  });

  it('should handle empty array', () => {
    const picked = pickSeeded([], 3, 'test');
    expect(picked).toHaveLength(3);
    expect(picked.every(item => item === undefined)).toBe(true);
  });

  it('should not modify original array', () => {
    const arr = [1, 2, 3];
    const original = [...arr];
    pickSeeded(arr, 2, 'test');
    expect(arr).toEqual(original);
  });
});

