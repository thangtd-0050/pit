import { describe, it, expect } from 'vitest';
import {
  clamp,
  roundVnd,
  calcInsuranceBases,
  calcInsurance,
  calcPit,
  calcAll,
} from '@/lib/tax';
import { REGIME_2025, REGIME_2026, REGIONAL_MINIMUMS, BASE_SALARY } from '@/config/constants';

describe('clamp', () => {
  it('should return value when within bounds', () => {
    expect(clamp(30_000_000, 4_960_000, 46_800_000)).toBe(30_000_000);
    expect(clamp(10_000_000, 5_000_000, 50_000_000)).toBe(10_000_000);
  });

  it('should return max when value exceeds max', () => {
    expect(clamp(50_000_000, 4_960_000, 46_800_000)).toBe(46_800_000);
    expect(clamp(100_000_000, 5_000_000, 50_000_000)).toBe(50_000_000);
  });

  it('should return min when value is below min', () => {
    expect(clamp(3_000_000, 4_960_000, 46_800_000)).toBe(4_960_000);
    expect(clamp(1_000_000, 5_000_000, 50_000_000)).toBe(5_000_000);
  });

  it('should handle edge cases at boundaries', () => {
    expect(clamp(4_960_000, 4_960_000, 46_800_000)).toBe(4_960_000);
    expect(clamp(46_800_000, 4_960_000, 46_800_000)).toBe(46_800_000);
  });
});

describe('roundVnd', () => {
  it('should round up when decimal >= 0.5', () => {
    expect(roundVnd(2_400_000.5)).toBe(2_400_001);
    expect(roundVnd(2_400_000.9)).toBe(2_400_001);
  });

  it('should round down when decimal < 0.5', () => {
    expect(roundVnd(2_400_000.49)).toBe(2_400_000);
    expect(roundVnd(2_400_000.1)).toBe(2_400_000);
  });

  it('should not change exact integers', () => {
    expect(roundVnd(450_000)).toBe(450_000);
    expect(roundVnd(3_150_000)).toBe(3_150_000);
  });

  it('should handle decimals correctly', () => {
    expect(roundVnd(123.456)).toBe(123);
    expect(roundVnd(999.999)).toBe(1000);
  });
});

describe('calcInsuranceBases', () => {
  it('should calculate bases for all 4 regions', () => {
    // Region I
    const basesI = calcInsuranceBases(30_000_000, REGIONAL_MINIMUMS.I.minWage, BASE_SALARY);
    expect(basesI.baseSIHI).toBe(30_000_000);
    expect(basesI.baseUI).toBe(30_000_000);

    // Region II
    const basesII = calcInsuranceBases(30_000_000, REGIONAL_MINIMUMS.II.minWage, BASE_SALARY);
    expect(basesII.baseSIHI).toBe(30_000_000);
    expect(basesII.baseUI).toBe(30_000_000);

    // Region III
    const basesIII = calcInsuranceBases(30_000_000, REGIONAL_MINIMUMS.III.minWage, BASE_SALARY);
    expect(basesIII.baseSIHI).toBe(30_000_000);
    expect(basesIII.baseUI).toBe(30_000_000);

    // Region IV
    const basesIV = calcInsuranceBases(30_000_000, REGIONAL_MINIMUMS.IV.minWage, BASE_SALARY);
    expect(basesIV.baseSIHI).toBe(30_000_000);
    expect(basesIV.baseUI).toBe(30_000_000);
  });

  it('should not cap when gross is within bounds', () => {
    const bases = calcInsuranceBases(30_000_000, REGIONAL_MINIMUMS.I.minWage, BASE_SALARY);
    expect(bases.baseSIHI).toBe(30_000_000);
    expect(bases.baseUI).toBe(30_000_000);
  });

  it('should cap SI/HI base when exceeding limit', () => {
    const bases = calcInsuranceBases(185_000_000, REGIONAL_MINIMUMS.I.minWage, BASE_SALARY);
    expect(bases.baseSIHI).toBe(46_800_000); // 20 × 2,340,000
  });

  it('should cap UI base when exceeding limit', () => {
    const bases = calcInsuranceBases(185_000_000, REGIONAL_MINIMUMS.I.minWage, BASE_SALARY);
    expect(bases.baseUI).toBe(99_200_000); // 20 × 4,960,000
  });

  it('should floor bases when custom base is below regional minimum', () => {
    const bases = calcInsuranceBases(
      30_000_000,
      REGIONAL_MINIMUMS.I.minWage,
      BASE_SALARY,
      3_000_000
    );
    expect(bases.baseSIHI).toBe(4_960_000);
    expect(bases.baseUI).toBe(4_960_000);
  });

  it('should cap bases when custom base is above limits', () => {
    const bases = calcInsuranceBases(
      30_000_000,
      REGIONAL_MINIMUMS.I.minWage,
      BASE_SALARY,
      200_000_000
    );
    expect(bases.baseSIHI).toBe(46_800_000);
    expect(bases.baseUI).toBe(99_200_000);
  });

  it('should use gross when insuranceBase is undefined', () => {
    const bases = calcInsuranceBases(30_000_000, REGIONAL_MINIMUMS.I.minWage, BASE_SALARY);
    expect(bases.baseSIHI).toBe(30_000_000);
    expect(bases.baseUI).toBe(30_000_000);
  });
});

describe('calcInsurance', () => {
  it('should calculate insurance amounts correctly', () => {
    const bases = { baseSIHI: 30_000_000, baseUI: 30_000_000 };
    const insurance = calcInsurance(bases);

    expect(insurance.si).toBe(2_400_000); // 30M × 8%
    expect(insurance.hi).toBe(450_000); // 30M × 1.5%
    expect(insurance.ui).toBe(300_000); // 30M × 1%
    expect(insurance.total).toBe(3_150_000);
  });

  it('should round each insurance component', () => {
    const bases = { baseSIHI: 10_000_001, baseUI: 10_000_001 };
    const insurance = calcInsurance(bases);

    // 10_000_001 × 8% = 800_000.08 → 800_000
    expect(insurance.si).toBe(800_000);
    // 10_000_001 × 1.5% = 150_000.015 → 150_000
    expect(insurance.hi).toBe(150_000);
    // 10_000_001 × 1% = 100_000.01 → 100_000
    expect(insurance.ui).toBe(100_000);
  });

  it('should handle capped bases', () => {
    const bases = { baseSIHI: 46_800_000, baseUI: 99_200_000 };
    const insurance = calcInsurance(bases);

    expect(insurance.si).toBe(3_744_000); // 46.8M × 8%
    expect(insurance.hi).toBe(702_000); // 46.8M × 1.5%
    expect(insurance.ui).toBe(992_000); // 99.2M × 1%
    expect(insurance.total).toBe(5_438_000);
  });

  it('should handle floored bases', () => {
    const bases = { baseSIHI: 4_960_000, baseUI: 4_960_000 };
    const insurance = calcInsurance(bases);

    expect(insurance.si).toBe(396_800); // 4.96M × 8%
    expect(insurance.hi).toBe(74_400); // 4.96M × 1.5%
    expect(insurance.ui).toBe(49_600); // 4.96M × 1%
    expect(insurance.total).toBe(520_800);
  });

  it('should verify total is sum of components', () => {
    const bases = { baseSIHI: 20_000_000, baseUI: 20_000_000 };
    const insurance = calcInsurance(bases);

    expect(insurance.total).toBe(insurance.si + insurance.hi + insurance.ui);
  });
});

describe('calcPit', () => {
  describe('2025 regime', () => {
    it('should handle edge cases at bracket thresholds', () => {
      // Exactly at 5M threshold
      const pit1 = calcPit(5_000_000, REGIME_2025);
      expect(pit1.total).toBe(250_000); // 5M × 5%

      // Exactly at 10M threshold
      const pit2 = calcPit(10_000_000, REGIME_2025);
      expect(pit2.total).toBe(750_000); // 5M×5% + 5M×10%

      // Exactly at 18M threshold
      const pit3 = calcPit(18_000_000, REGIME_2025);
      expect(pit3.total).toBe(1_950_000); // 5M×5% + 5M×10% + 8M×15%

      // Exactly at 32M threshold
      const pit4 = calcPit(32_000_000, REGIME_2025);
      expect(pit4.total).toBe(4_750_000); // 5M×5% + 5M×10% + 8M×15% + 14M×20%

      // Exactly at 52M threshold
      const pit5 = calcPit(52_000_000, REGIME_2025);
      expect(pit5.total).toBe(9_750_000); // ... + 20M×25%

      // Exactly at 80M threshold
      const pit6 = calcPit(80_000_000, REGIME_2025);
      expect(pit6.total).toBe(18_150_000); // ... + 28M×30%
    });

    it('should handle taxable = 0', () => {
      const pit = calcPit(0, REGIME_2025);
      expect(pit.total).toBe(0);
      expect(pit.items).toHaveLength(0);
    });

    it('should handle taxable < 0', () => {
      const pit = calcPit(-1000, REGIME_2025);
      expect(pit.total).toBe(0);
      expect(pit.items).toHaveLength(0);
    });

    it('should calculate highest bracket correctly', () => {
      const pit = calcPit(100_000_000, REGIME_2025);
      // First 80M: 18,150,000
      // Remaining 20M × 35%: 7,000,000
      expect(pit.total).toBe(25_150_000);
    });

    it('should calculate progressive brackets correctly', () => {
      const pit = calcPit(7_850_000, REGIME_2025);
      // Bracket 1: 5M × 5% = 250,000
      // Bracket 2: 2.85M × 10% = 285,000
      expect(pit.total).toBe(535_000);
      expect(pit.items).toHaveLength(2);
    });
  });

  describe('2026 regime', () => {
    it('should handle edge cases at bracket thresholds', () => {
      // Exactly at 10M threshold
      const pit1 = calcPit(10_000_000, REGIME_2026);
      expect(pit1.total).toBe(500_000); // 10M × 5%

      // Exactly at 30M threshold
      const pit2 = calcPit(30_000_000, REGIME_2026);
      expect(pit2.total).toBe(2_500_000); // 10M×5% + 20M×10%

      // Exactly at 60M threshold
      const pit3 = calcPit(60_000_000, REGIME_2026);
      expect(pit3.total).toBe(7_000_000); // 10M×5% + 20M×10% + 30M×15%

      // Exactly at 100M threshold
      const pit4 = calcPit(100_000_000, REGIME_2026);
      expect(pit4.total).toBe(15_000_000); // ... + 40M×20%
    });

    it('should calculate highest bracket correctly', () => {
      const pit = calcPit(150_000_000, REGIME_2026);
      // First 100M: 15,000,000
      // Remaining 50M × 35%: 17,500,000
      expect(pit.total).toBe(32_500_000);
    });
  });
});

describe('calcAll', () => {
  it('should handle regression test: 10M gross, 2 deps, Region I, 2025', () => {
    const result = calcAll({
      gross: 10_000_000,
      dependents: 2,
      region: 'I',
      regime: REGIME_2025,
    });

    // Insurance: 10M × (8% + 1.5% + 1%) = 1,050,000
    expect(result.insurance.total).toBe(1_050_000);
    // Deductions: 11M + 8.8M + 1.05M = 20,850,000
    expect(result.deductions.total).toBe(20_850_000);
    // Taxable = 10M - 20.85M < 0, so PIT = 0
    expect(result.pit.total).toBe(0);
    // NET = 10M - 1.05M - 0 = 8,950,000
    expect(result.net).toBe(8_950_000);
  });

  it('should handle regression test: 30M gross, 2 deps, Region I, 2025', () => {
    const result = calcAll({
      gross: 30_000_000,
      dependents: 2,
      region: 'I',
      regime: REGIME_2025,
    });

    // Insurance: 30M × 10.5% = 3,150,000
    expect(result.insurance.total).toBe(3_150_000);
    // Deductions: 11M + 8.8M + 3.15M = 22,950,000
    expect(result.deductions.total).toBe(22_950_000);
    // Taxable = 30M - 22.95M = 7,050,000
    expect(result.pit.taxable).toBe(7_050_000);
    // PIT: 5M×5% + 2.05M×10% = 250k + 205k = 455,000
    expect(result.pit.total).toBe(455_000);
    // NET = 30M - 3.15M - 0.455M = 26,395,000
    expect(result.net).toBe(26_395_000);
  });

  it('should handle regression test: 60M gross, 2 deps, Region I, 2025', () => {
    const result = calcAll({
      gross: 60_000_000,
      dependents: 2,
      region: 'I',
      regime: REGIME_2025,
    });

    // Insurance: 60M not capped yet, so 60M × 10.5% = 6,300,000
    // Wait, SI/HI is capped at 46.8M, UI at 99.2M (Region I)
    // SI/HI base: clamp(60M, 4.96M, 46.8M) = 46.8M
    // UI base: clamp(60M, 4.96M, 99.2M) = 60M
    // SI: 46.8M × 8% = 3,744,000
    // HI: 46.8M × 1.5% = 702,000
    // UI: 60M × 1% = 600,000
    // Total: 5,046,000
    expect(result.insurance.total).toBe(5_046_000);
    expect(result.pit.total).toBeGreaterThan(0);
    // Verify NET formula
    const expectedNet = result.inputs.gross - result.insurance.total - result.pit.total;
    expect(result.net).toBe(expectedNet);
  });

  it('should handle regression test: 100M gross, 2 deps, Region I, 2025', () => {
    const result = calcAll({
      gross: 100_000_000,
      dependents: 2,
      region: 'I',
      regime: REGIME_2025,
    });

    // Insurance: Both bases capped now
    // SI/HI base: 46.8M, UI base: 99.2M (Region I cap)
    // Total: 3,744,000 + 702,000 + 992,000 = 5,438,000
    expect(result.insurance.total).toBe(5_438_000);
    expect(result.pit.total).toBeGreaterThan(10_000_000);
    // Verify NET formula
    const expectedNet = result.inputs.gross - result.insurance.total - result.pit.total;
    expect(result.net).toBe(expectedNet);
  });

  it('should handle regression test: 185M gross, 2 deps, Region I, 2025', () => {
    const result = calcAll({
      gross: 185_000_000,
      dependents: 2,
      region: 'I',
      regime: REGIME_2025,
    });

    // Insurance: Fully capped at 5,438,000
    expect(result.insurance.total).toBe(5_438_000);
    expect(result.pit.total).toBeGreaterThan(30_000_000);
    // Verify NET formula
    const expectedNet = result.inputs.gross - result.insurance.total - result.pit.total;
    expect(result.net).toBe(expectedNet);
  });

  it('should handle 0 dependents', () => {
    const result = calcAll({
      gross: 30_000_000,
      dependents: 0,
      region: 'I',
      regime: REGIME_2025,
    });

    expect(result.deductions.dependents).toBe(0);
    expect(result.deductions.total).toBe(11_000_000 + 3_150_000); // Only personal + insurance
  });

  it('should handle custom insurance base', () => {
    const result = calcAll({
      gross: 30_000_000,
      dependents: 2,
      region: 'I',
      insuranceBase: 10_000_000,
      regime: REGIME_2025,
    });

    expect(result.insurance.bases.baseSIHI).toBe(10_000_000);
    expect(result.insurance.bases.baseUI).toBe(10_000_000);
  });

  it('should handle all 4 regions', () => {
    const regions: Array<'I' | 'II' | 'III' | 'IV'> = ['I', 'II', 'III', 'IV'];
    regions.forEach((region) => {
      const result = calcAll({
        gross: 30_000_000,
        dependents: 2,
        region,
        regime: REGIME_2025,
      });
      expect(result.net).toBeGreaterThan(0);
    });
  });

  it('should handle both regimes', () => {
    const inputs = {
      gross: 30_000_000,
      dependents: 2,
      region: 'I' as const,
    };

    const result2025 = calcAll({ ...inputs, regime: REGIME_2025 });
    const result2026 = calcAll({ ...inputs, regime: REGIME_2026 });

    expect(result2025.net).not.toBe(result2026.net);
    expect(result2026.deductions.personal).toBeGreaterThan(result2025.deductions.personal);
  });

  it('should verify NET = gross - insurance - PIT', () => {
    const result = calcAll({
      gross: 30_000_000,
      dependents: 2,
      region: 'I',
      regime: REGIME_2025,
    });

    // Verify the formula: NET = gross - insurance - PIT
    const expectedNet = result.inputs.gross - result.insurance.total - result.pit.total;
    expect(result.net).toBe(expectedNet);
  });
});
