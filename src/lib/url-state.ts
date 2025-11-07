import type { URLState, RegionId, ViewMode, InsuranceBaseMode } from '@/types';

/**
 * Encode calculator state to URL query parameters.
 * Uses abbreviated keys to keep URLs shorter:
 * - g: gross salary
 * - d: dependents
 * - r: region
 * - ibm: insurance base mode
 * - ib: insurance base (custom amount)
 * - m: view mode
 * - fmt: locale format
 * - u: union member (1 if true, omitted if false)
 * - la: lunch allowance enabled (1 if true, omitted if false)
 * - laa: lunch allowance amount
 *
 * @param state - Partial or complete URLState object
 * @returns Query string (without leading '?')
 */
export function encodeStateToURL(state: Partial<URLState>): string {
  const params = new URLSearchParams();

  if (state.gross !== undefined) {
    params.set('g', state.gross.toString());
  }

  if (state.dependents !== undefined) {
    params.set('d', state.dependents.toString());
  }

  if (state.region !== undefined) {
    params.set('r', state.region);
  }

  if (state.insuranceBaseMode !== undefined) {
    params.set('ibm', state.insuranceBaseMode);
  }

  if (state.customInsuranceBase !== undefined) {
    params.set('ib', state.customInsuranceBase.toString());
  }

  if (state.viewMode !== undefined) {
    params.set('m', state.viewMode);
  }

  if (state.locale !== undefined) {
    params.set('fmt', state.locale);
  }

  if (state.isUnionMember === true) {
    params.set('u', '1');
  }

  // Encode lunch allowance (only if enabled)
  if (state.hasLunchAllowance === true) {
    params.set('la', '1');
    if (state.lunchAllowance !== undefined) {
      params.set('laa', state.lunchAllowance.toString());
    }
  }

  return params.toString();
}

/**
 * Decode URL query parameters to calculator state.
 * Validates all values and ignores invalid ones.
 *
 * @param queryString - URL query string (with or without leading '?')
 * @returns Partial URLState with valid decoded values
 */
export function decodeStateFromURL(queryString: string): Partial<URLState> {
  const state: Partial<URLState> = {};

  // Remove leading '?' if present
  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;

  // Handle empty query
  if (!cleanQuery) {
    return state;
  }

  try {
    const params = new URLSearchParams(cleanQuery);

    // Parse gross salary
    const grossStr = params.get('g');
    if (grossStr) {
      const gross = Number(grossStr);
      if (!isNaN(gross) && gross >= 0) {
        state.gross = gross;
      }
    }

    // Parse dependents
    const depsStr = params.get('d');
    if (depsStr) {
      const deps = Number(depsStr);
      if (!isNaN(deps) && deps >= 0 && Number.isInteger(deps)) {
        state.dependents = deps;
      }
    }

    // Parse region
    const region = params.get('r');
    if (region && isValidRegion(region)) {
      state.region = region as RegionId;
    }

    // Parse insurance base mode
    const ibm = params.get('ibm');
    if (ibm && isValidInsuranceBaseMode(ibm)) {
      state.insuranceBaseMode = ibm as InsuranceBaseMode;
    }

    // Parse custom insurance base
    const ibStr = params.get('ib');
    if (ibStr) {
      const ib = Number(ibStr);
      if (!isNaN(ib) && ib >= 0) {
        state.customInsuranceBase = ib;
      }
    }

    // Parse view mode
    const mode = params.get('m');
    if (mode && isValidViewMode(mode)) {
      state.viewMode = mode as ViewMode;
    }

    // Parse locale
    const locale = params.get('fmt');
    if (locale && isValidLocale(locale)) {
      state.locale = locale as 'en-US' | 'vi-VN';
    }

    // Parse union member
    const unionMember = params.get('u');
    if (unionMember === '1') {
      state.isUnionMember = true;
    }

    // Parse lunch allowance enabled
    const lunchAllowanceEnabled = params.get('la');
    if (lunchAllowanceEnabled === '1') {
      state.hasLunchAllowance = true;
    }

    // Parse lunch allowance amount
    const lunchAllowanceStr = params.get('laa');
    if (lunchAllowanceStr) {
      const lunchAllowance = Number(lunchAllowanceStr);
      if (!isNaN(lunchAllowance) && lunchAllowance >= 0) {
        state.lunchAllowance = lunchAllowance;
      }
    }
  } catch (error) {
    // If URLSearchParams fails to parse, return whatever we have
    console.warn('Failed to parse URL query string:', error);
  }

  return state;
}

// ============================================================================
// Validation Helpers
// ============================================================================

function isValidRegion(value: string): value is RegionId {
  return ['I', 'II', 'III', 'IV'].includes(value);
}

function isValidViewMode(value: string): value is ViewMode {
  return ['2025', '2026', 'compare'].includes(value);
}

function isValidInsuranceBaseMode(value: string): value is InsuranceBaseMode {
  return ['gross', 'custom'].includes(value);
}

function isValidLocale(value: string): value is 'en-US' | 'vi-VN' {
  return ['en-US', 'vi-VN'].includes(value);
}
