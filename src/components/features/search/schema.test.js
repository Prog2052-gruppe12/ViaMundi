import { formSchema } from './schema';

describe('Search Form Schema', () => {
  const validDate = new Date('2025-06-01');
  const laterDate = new Date('2025-06-07');

  describe('Valid data', () => {
    it('should validate correct form data', () => {
      const data = {
        destination: 'Oslo, Norway',
        dateFrom: validDate,
        dateTo: laterDate,
        travelers: 2,
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should accept single traveler', () => {
      const data = {
        destination: 'Oslo, Norway',
        dateFrom: validDate,
        dateTo: laterDate,
        travelers: 1,
      };

      expect(formSchema.safeParse(data).success).toBe(true);
    });

    it('should accept maximum travelers (10)', () => {
      const data = {
        destination: 'Oslo, Norway',
        dateFrom: validDate,
        dateTo: laterDate,
        travelers: 10,
      };

      expect(formSchema.safeParse(data).success).toBe(true);
    });
  });

  describe('Invalid destination', () => {
    it('should reject empty destination', () => {
      const data = {
        destination: '',
        dateFrom: validDate,
        dateTo: laterDate,
        travelers: 2,
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Velg et reisemål');
      }
    });
  });

  describe('Invalid travelers', () => {
    it('should reject zero travelers', () => {
      const data = {
        destination: 'Oslo, Norway',
        dateFrom: validDate,
        dateTo: laterDate,
        travelers: 0,
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject more than 10 travelers', () => {
      const data = {
        destination: 'Oslo, Norway',
        dateFrom: validDate,
        dateTo: laterDate,
        travelers: 11,
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject decimal travelers', () => {
      const data = {
        destination: 'Oslo, Norway',
        dateFrom: validDate,
        dateTo: laterDate,
        travelers: 2.5,
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Date validation', () => {
    it('should reject when dateTo is before dateFrom', () => {
      const data = {
        destination: 'Oslo, Norway',
        dateFrom: laterDate,
        dateTo: validDate, // Earlier than dateFrom
        travelers: 2,
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Sluttdato må være etter startdato');
      }
    });

    it('should accept same date for dateFrom and dateTo', () => {
      const sameDate = new Date('2025-06-01');
      const data = {
        destination: 'Oslo, Norway',
        dateFrom: sameDate,
        dateTo: sameDate,
        travelers: 2,
      };

      expect(formSchema.safeParse(data).success).toBe(true);
    });
  });
});

