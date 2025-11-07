import { describe, expect, it } from 'vitest';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

describe('Lunch Allowance Constants', () => {
  it('should have default lunch allowance of 730,000 VND', () => {
    expect(DEFAULT_LUNCH_ALLOWANCE).toBe(730_000);
  });
});
