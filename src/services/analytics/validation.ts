/**
 * Validation utilities for analytics event parameters
 * @module services/analytics/validation
 */

/**
 * Validates event name format (lowercase_snake_case)
 * @param eventName - Event name to validate
 * @returns true if valid, false otherwise
 */
export function isValidEventName(eventName: string): boolean {
  return /^[a-z][a-z0-9_]*$/.test(eventName);
}

/**
 * Validates page path format
 * @param path - Path to validate
 * @returns true if valid, false otherwise
 */
export function isValidPath(path: string): boolean {
  if (!path || !path.startsWith('/')) {
    return false;
  }
  if (path.length > 100) {
    return false;
  }
  return true;
}

/**
 * Sanitizes preset label to prevent PII leakage
 * Checks if the preset amount looks like PII (very large numbers)
 * @param presetLabel - Preset label (e.g., "preset_30M")
 * @returns true if safe, false if potentially contains PII
 */
export function isSafePresetLabel(presetLabel: string): boolean {
  const indexValue = parseInt(presetLabel.match(/(\d+)M/)?.[1] || '0');
  return indexValue <= 1000; // Reject values > 1000M as potential PII
}

/**
 * Validates regime switch params
 * @param from - Source regime
 * @param to - Target regime
 * @returns true if valid (from !== to), false otherwise
 */
export function isValidRegimeSwitch(from: string, to: string): boolean {
  return from !== to;
}
