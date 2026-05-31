import { TestBed } from '@angular/core/testing';
import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateService);
  });

  describe('calculateRevisionDate', () => {
    it('should calculate revision date as exactly one year after release date', () => {
      const releaseDate = '2026-05-30';
      const expectedRevisionDate = '2027-05-30';

      const result = service.calculateRevisionDate(releaseDate);

      expect(result).toBe(expectedRevisionDate);
    });

    it('should handle leap years correctly', () => {
      const releaseDate = '2024-02-29';
      const result = service.calculateRevisionDate(releaseDate);
      expect(['2025-02-28', '2025-03-01']).toContain(result);
    });

    it('should return empty string for empty input', () => {
      expect(service.calculateRevisionDate('')).toBe('');
      expect(service.calculateRevisionDate(null)).toBe('');
      expect(service.calculateRevisionDate(undefined)).toBe('');
    });

    it('should handle invalid date strings gracefully', () => {
      const result = service.calculateRevisionDate('invalid-date');
      expect(result).toBe('');
    });
  });

  describe('isDateTodayOrInFuture', () => {
    it('should return true for today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(service.isDateTodayOrInFuture(today)).toBe(true);
    });

    it('should return true for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      expect(service.isDateTodayOrInFuture(futureDateString)).toBe(true);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const pastDateString = pastDate.toISOString().split('T')[0];

      expect(service.isDateTodayOrInFuture(pastDateString)).toBe(false);
    });

    it('should return false for empty input', () => {
      expect(service.isDateTodayOrInFuture('')).toBe(false);
      expect(service.isDateTodayOrInFuture(null)).toBe(false);
      expect(service.isDateTodayOrInFuture(undefined)).toBe(false);
    });

    it('should handle invalid date strings', () => {
      expect(service.isDateTodayOrInFuture('invalid-date')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date and include year', () => {
      const dateString = '2026-05-30';
      const result = service.formatDate(dateString);

      expect(result).toContain('2026');
    });

    it('should format date with specified locale', () => {
      const dateString = '2026-05-30';
      const result = service.formatDate(dateString, 'en-US');

      expect(result).toContain('2026');
    });

    it('should return original string for invalid dates', () => {
      const invalidDate = 'invalid-date';
      const result = service.formatDate(invalidDate);

      expect(result).toBe(invalidDate);
    });
  });
});
