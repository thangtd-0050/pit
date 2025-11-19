# Quickstart: Update 2026 Regulations

**Feature**: Update 2026 Regulations
**Status**: Draft
**Date**: 2025-11-19

## Overview

This feature updates the salary calculator to support the new 2026 regulations, specifically the increased Regional Minimum Wages (RMW) and the Unemployment Insurance (BHTN) ceiling calculation.

## Key Changes

1. **New RMW Values**:
   - Region I: 5,310,000 VND
   - Region II: 4,730,000 VND
   - Region III: 4,140,000 VND
   - Region IV: 3,700,000 VND

2. **BHTN Ceiling**:
   - Calculated as `20 * Regional Minimum Wage`.
   - This formula is consistent with previous years but uses the new 2026 RMW values.

3. **UI Updates**:
   - Tooltips added to explain the changes when 2026 regime is selected.
   - "New" indicators for 2026 values.

## Usage

1. Open the calculator.
2. In the "Settings" or "Regime" selector, choose "2026".
3. Enter your Gross Salary.
4. Observe the Insurance Breakdown:
   - The BHTN ceiling will reflect the new RMW (e.g., for Region I: 20 * 5.31M = 106.2M).
   - Hover over the info icons to see details about the new regulations.

## Development

### Constants

New constants are defined in `src/config/constants.ts`:
- `REGIONAL_MINIMUMS_2026`

### Logic

The calculation logic in `src/lib/tax.ts` selects the appropriate RMW set based on the `regime.id` input.
