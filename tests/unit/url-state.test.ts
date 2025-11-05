import { describe, it, expect } from 'vitest';
import { encodeStateToURL, decodeStateFromURL } from '@/lib/url-state';
import type { URLState } from '@/types';

describe('encodeStateToURL', () => {
  it('should encode complete state to URL query params', () => {
    const state: URLState = {
      gross: 30_000_000,
      dependents: 2,
      region: 'I',
      insuranceBaseMode: 'gross',
      viewMode: '2025',
      locale: 'vi-VN',
    };

    const url = encodeStateToURL(state);

    expect(url).toContain('g=30000000');
    expect(url).toContain('d=2');
    expect(url).toContain('r=I');
    expect(url).toContain('ibm=gross');
    expect(url).toContain('m=2025');
    expect(url).toContain('fmt=vi-VN');
  });

  it('should encode partial state with custom insurance base', () => {
    const state: Partial<URLState> = {
      gross: 50_000_000,
      insuranceBaseMode: 'custom',
      customInsuranceBase: 46_800_000,
    };

    const url = encodeStateToURL(state);

    expect(url).toContain('g=50000000');
    expect(url).toContain('ibm=custom');
    expect(url).toContain('ib=46800000');
  });

  it('should encode compare mode', () => {
    const state: Partial<URLState> = {
      viewMode: 'compare',
    };

    const url = encodeStateToURL(state);

    expect(url).toContain('m=compare');
  });

  it('should handle empty state', () => {
    const state: Partial<URLState> = {};

    const url = encodeStateToURL(state);

    expect(url).toBe('');
  });

  it('should not include undefined values', () => {
    const state: Partial<URLState> = {
      gross: 30_000_000,
      dependents: undefined,
    };

    const url = encodeStateToURL(state);

    expect(url).toContain('g=30000000');
    expect(url).not.toContain('d=');
  });
});

describe('decodeStateFromURL', () => {
  it('should decode valid complete query string', () => {
    const query = 'g=30000000&d=2&r=II&ibm=gross&m=2026&fmt=en-US';

    const state = decodeStateFromURL(query);

    expect(state).toEqual({
      gross: 30_000_000,
      dependents: 2,
      region: 'II',
      insuranceBaseMode: 'gross',
      viewMode: '2026',
      locale: 'en-US',
    });
  });

  it('should decode partial query with custom insurance base', () => {
    const query = 'g=50000000&ibm=custom&ib=46800000';

    const state = decodeStateFromURL(query);

    expect(state).toEqual({
      gross: 50_000_000,
      insuranceBaseMode: 'custom',
      customInsuranceBase: 46_800_000,
    });
  });

  it('should ignore invalid values', () => {
    const query = 'g=invalid&d=2&r=INVALID&ibm=wrong&m=bad&fmt=invalid';

    const state = decodeStateFromURL(query);

    expect(state).toEqual({
      dependents: 2,
      // All other values should be omitted due to validation failures
    });
  });

  it('should handle empty query string', () => {
    const query = '';

    const state = decodeStateFromURL(query);

    expect(state).toEqual({});
  });

  it('should handle malformed query string', () => {
    const query = 'invalid&&&===&g=30000000';

    const state = decodeStateFromURL(query);

    expect(state).toEqual({
      gross: 30_000_000,
    });
  });

  it('should validate region values', () => {
    const query = 'r=III';

    const state = decodeStateFromURL(query);

    expect(state).toEqual({
      region: 'III',
    });
  });

  it('should validate view mode values', () => {
    const query = 'm=compare';

    const state = decodeStateFromURL(query);

    expect(state).toEqual({
      viewMode: 'compare',
    });
  });

  it('should validate locale values', () => {
    const query = 'fmt=vi-VN';

    const state = decodeStateFromURL(query);

    expect(state).toEqual({
      locale: 'vi-VN',
    });
  });

  it('should handle negative numbers as invalid', () => {
    const query = 'g=-1000&d=-5';

    const state = decodeStateFromURL(query);

    expect(state).toEqual({});
  });

  it('should handle insurance base mode validation', () => {
    const validQuery = 'ibm=custom';
    const invalidQuery = 'ibm=invalid';

    expect(decodeStateFromURL(validQuery)).toEqual({
      insuranceBaseMode: 'custom',
    });

    expect(decodeStateFromURL(invalidQuery)).toEqual({});
  });
});
