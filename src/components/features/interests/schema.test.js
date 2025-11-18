import { formSchema } from './schema';

describe('Interests Form Schema', () => {
  describe('Valid data', () => {
    it('should validate with at least one interest selected', () => {
      const data = {
        interests: {
          nightLife: true,
          history: false,
          nature: false,
          food: false,
          culture: false,
        },
        other: '',
      };

      expect(formSchema.safeParse(data).success).toBe(true);
    });

    it('should validate with multiple interests', () => {
      const data = {
        interests: {
          nightLife: true,
          history: true,
          nature: true,
          food: false,
          culture: false,
        },
      };

      expect(formSchema.safeParse(data).success).toBe(true);
    });

    it('should validate with all interests selected', () => {
      const data = {
        interests: {
          nightLife: true,
          history: true,
          nature: true,
          food: true,
          culture: true,
        },
      };

      expect(formSchema.safeParse(data).success).toBe(true);
    });

    it('should accept optional "other" field', () => {
      const data = {
        interests: {
          nightLife: true,
          history: false,
          nature: false,
          food: false,
          culture: false,
        },
        other: 'Shopping and beaches',
      };

      expect(formSchema.safeParse(data).success).toBe(true);
    });

    it('should accept empty "other" field', () => {
      const data = {
        interests: {
          nightLife: true,
          history: false,
          nature: false,
          food: false,
          culture: false,
        },
        other: '',
      };

      expect(formSchema.safeParse(data).success).toBe(true);
    });

    it('should accept missing "other" field', () => {
      const data = {
        interests: {
          nightLife: true,
          history: false,
          nature: false,
          food: false,
          culture: false,
        },
      };

      expect(formSchema.safeParse(data).success).toBe(true);
    });
  });

  describe('Invalid data', () => {
    it('should reject when no interests are selected', () => {
      const data = {
        interests: {
          nightLife: false,
          history: false,
          nature: false,
          food: false,
          culture: false,
        },
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Velg minst én interesse');
      }
    });

    it('should provide Norwegian error message', () => {
      const data = {
        interests: {
          nightLife: false,
          history: false,
          nature: false,
          food: false,
          culture: false,
        },
      };

      const result = formSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Velg minst');
      }
    });
  });
});

