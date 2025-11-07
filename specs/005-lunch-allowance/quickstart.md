# Quickstart: Lunch Allowance Implementation

**Feature**: 005-lunch-allowance  
**Date**: November 7, 2025  
**Estimated Time**: 4-6 hours (including tests)

## Overview

This guide walks you through implementing the tax-exempt lunch allowance feature from start to finish, following TDD methodology. Each step includes:
- What to build
- How to test it
- Expected output

---

## Prerequisites

- ✅ Read `spec.md` (understand business requirements)
- ✅ Read `research.md` (understand technical decisions)
- ✅ Read `data-model.md` (understand data structures)
- ✅ Read `contracts/calculation-api.md` (understand API surface)
- ✅ Ensure all tests pass: `npm test`
- ✅ Ensure clean git status: `git status`

---

## Step 1: Add Constant (5 min)

### Implementation

**File**: `src/config/constants.ts`

```typescript
// Add to existing constants
export const DEFAULT_LUNCH_ALLOWANCE = 730_000;
```

### Test

**File**: `tests/unit/constants.test.ts`

```typescript
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

describe('Lunch Allowance Constants', () => {
  it('should have default lunch allowance of 730,000 VND', () => {
    expect(DEFAULT_LUNCH_ALLOWANCE).toBe(730_000);
  });
});
```

### Verify

```bash
npm test tests/unit/constants.test.ts
```

**Expected**: ✅ 1 passing test

---

## Step 2: Extend Types (10 min)

### Implementation

**File**: `src/types/index.ts`

```typescript
// Find CalculationResult interface and add:
export interface CalculationResult {
  // ... existing fields ...
  
  /**
   * Tax-exempt lunch allowance amount
   * - undefined: Lunch allowance is disabled
   * - number: Lunch allowance amount in VND (≥ 0)
   */
  lunchAllowance?: number;
}
```

### Test

**File**: `tests/contract/lunch-allowance.contract.test.ts`

```typescript
import type { CalculationResult } from '@/types';

describe('Lunch Allowance Type Contracts', () => {
  it('CalculationResult should accept optional lunchAllowance field', () => {
    const result1: CalculationResult = {
      // ... required fields ...
      lunchAllowance: undefined, // Disabled
    };
    
    const result2: CalculationResult = {
      // ... required fields ...
      lunchAllowance: 730_000, // Enabled
    };
    
    expect(result1.lunchAllowance).toBeUndefined();
    expect(result2.lunchAllowance).toBe(730_000);
  });
  
  it('should allow CalculationResult without lunchAllowance field', () => {
    const result: CalculationResult = {
      // ... required fields only ...
    };
    
    expect(result.lunchAllowance).toBeUndefined();
  });
});
```

### Verify

```bash
npm test tests/contract/lunch-allowance.contract.test.ts
```

**Expected**: ✅ 2 passing tests

---

## Step 3: Extend Zustand Store (20 min)

### Implementation

**File**: `src/store/calculatorStore.ts`

```typescript
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

interface CalculatorState {
  // ... existing state ...
  
  // Lunch allowance state
  hasLunchAllowance: boolean;
  lunchAllowance: number;
  
  // ... existing actions ...
  
  // Lunch allowance actions
  setHasLunchAllowance: (has: boolean) => void;
  setLunchAllowance: (amount: number) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  // ... existing initial state ...
  
  // Lunch allowance initial state
  hasLunchAllowance: false,
  lunchAllowance: DEFAULT_LUNCH_ALLOWANCE,
  
  // ... existing actions ...
  
  // Lunch allowance actions
  setHasLunchAllowance: (has) => set({ hasLunchAllowance: has }),
  setLunchAllowance: (amount) => 
    set({ lunchAllowance: Math.max(0, Math.floor(amount)) }),
}));
```

### Test

**File**: `tests/unit/calculator-store.test.ts`

```typescript
import { useCalculatorStore } from '@/store/calculatorStore';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

describe('Calculator Store - Lunch Allowance', () => {
  beforeEach(() => {
    // Reset store to initial state
    const store = useCalculatorStore.getState();
    store.setHasLunchAllowance(false);
    store.setLunchAllowance(DEFAULT_LUNCH_ALLOWANCE);
  });
  
  it('should initialize with lunch allowance disabled', () => {
    const { hasLunchAllowance } = useCalculatorStore.getState();
    expect(hasLunchAllowance).toBe(false);
  });
  
  it('should initialize with default lunch allowance amount', () => {
    const { lunchAllowance } = useCalculatorStore.getState();
    expect(lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);
  });
  
  it('should toggle lunch allowance on', () => {
    const store = useCalculatorStore.getState();
    store.setHasLunchAllowance(true);
    expect(store.hasLunchAllowance).toBe(true);
  });
  
  it('should toggle lunch allowance off', () => {
    const store = useCalculatorStore.getState();
    store.setHasLunchAllowance(true);
    store.setHasLunchAllowance(false);
    expect(store.hasLunchAllowance).toBe(false);
  });
  
  it('should update lunch allowance amount', () => {
    const store = useCalculatorStore.getState();
    store.setLunchAllowance(1_500_000);
    expect(store.lunchAllowance).toBe(1_500_000);
  });
  
  it('should clamp negative amounts to 0', () => {
    const store = useCalculatorStore.getState();
    store.setLunchAllowance(-100);
    expect(store.lunchAllowance).toBe(0);
  });
  
  it('should floor decimal amounts to integer', () => {
    const store = useCalculatorStore.getState();
    store.setLunchAllowance(730_000.99);
    expect(store.lunchAllowance).toBe(730_000);
  });
  
  it('should preserve amount when toggled off and on', () => {
    const store = useCalculatorStore.getState();
    store.setLunchAllowance(1_500_000);
    store.setHasLunchAllowance(true);
    store.setHasLunchAllowance(false);
    expect(store.lunchAllowance).toBe(1_500_000);
  });
});
```

### Verify

```bash
npm test tests/unit/calculator-store.test.ts
```

**Expected**: ✅ 8 passing tests

---

## Step 4: Extend Calculation Function (30 min)

### Implementation

**File**: `src/lib/tax.ts`

```typescript
// Update CalculateNetOptions interface
interface CalculateNetOptions {
  unionDues?: number;
  lunchAllowance?: number; // NEW
}

// Update calculateNet function
export function calculateNet(
  gross: number,
  insurance: Insurance,
  deductions: Deductions,
  tax: number,
  options?: CalculateNetOptions
): CalculationResult {
  // ... existing calculation logic ...
  
  const net = grossAfterInsurance - tax;
  const unionDues = options?.unionDues;
  const lunchAllowance = options?.lunchAllowance;
  
  // Calculate final NET
  let finalNet = net;
  if (unionDues !== undefined) {
    finalNet -= unionDues;
  }
  if (lunchAllowance !== undefined) {
    finalNet += lunchAllowance;
  }
  
  return {
    // ... existing fields ...
    net,
    unionDues,
    lunchAllowance, // NEW
    finalNet,
  };
}
```

### Test

**File**: `tests/unit/lunch-allowance.test.ts`

```typescript
import { calculateNet } from '@/lib/tax';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

describe('Lunch Allowance Calculation', () => {
  const mockInsurance = {
    totalEmployee: 1_000_000,
    // ... other insurance fields ...
  };
  
  const mockDeductions = {
    personal: 11_000_000,
    dependents: 0,
    total: 11_000_000,
  };
  
  it('should return undefined when lunch allowance is disabled', () => {
    const result = calculateNet(
      30_000_000,
      mockInsurance,
      mockDeductions,
      2_777_500
    );
    
    expect(result.lunchAllowance).toBeUndefined();
  });
  
  it('should add default lunch allowance to final NET', () => {
    const result = calculateNet(
      30_000_000,
      mockInsurance,
      mockDeductions,
      2_777_500,
      { lunchAllowance: DEFAULT_LUNCH_ALLOWANCE }
    );
    
    expect(result.lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);
    expect(result.finalNet).toBe(result.net + DEFAULT_LUNCH_ALLOWANCE);
  });
  
  it('should add custom lunch allowance to final NET', () => {
    const customAmount = 1_500_000;
    const result = calculateNet(
      30_000_000,
      mockInsurance,
      mockDeductions,
      2_777_500,
      { lunchAllowance: customAmount }
    );
    
    expect(result.lunchAllowance).toBe(customAmount);
    expect(result.finalNet).toBe(result.net + customAmount);
  });
  
  it('should handle zero lunch allowance', () => {
    const result = calculateNet(
      30_000_000,
      mockInsurance,
      mockDeductions,
      2_777_500,
      { lunchAllowance: 0 }
    );
    
    expect(result.lunchAllowance).toBe(0);
    expect(result.finalNet).toBe(result.net);
  });
  
  it('should work with union dues and lunch allowance together', () => {
    const result = calculateNet(
      30_000_000,
      mockInsurance,
      mockDeductions,
      2_777_500,
      {
        unionDues: 150_000,
        lunchAllowance: 730_000,
      }
    );
    
    expect(result.unionDues).toBe(150_000);
    expect(result.lunchAllowance).toBe(730_000);
    expect(result.finalNet).toBe(result.net - 150_000 + 730_000);
  });
  
  it('should handle very large lunch allowance amounts', () => {
    const largeAmount = 10_000_000;
    const result = calculateNet(
      30_000_000,
      mockInsurance,
      mockDeductions,
      2_777_500,
      { lunchAllowance: largeAmount }
    );
    
    expect(result.lunchAllowance).toBe(largeAmount);
    expect(result.finalNet).toBe(result.net + largeAmount);
  });
});
```

### Verify

```bash
npm test tests/unit/lunch-allowance.test.ts
```

**Expected**: ✅ 6 passing tests

---

## Step 5: Add URL State Persistence (25 min)

### Implementation

**File**: `src/lib/url-state.ts`

```typescript
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

// Add to parseStateFromURL function
export function parseStateFromURL(): Partial<CalculatorState> {
  const params = new URLSearchParams(window.location.search);
  
  return {
    // ... existing URL parsing ...
    
    // Parse lunch allowance
    hasLunchAllowance: params.get('hasLunchAllowance') === 'true',
    lunchAllowance: (() => {
      const value = parseInt(params.get('lunchAllowance') ?? '', 10);
      return isNaN(value) || value < 0 ? DEFAULT_LUNCH_ALLOWANCE : value;
    })(),
  };
}

// Add to serializeStateToURL function
export function serializeStateToURL(state: CalculatorState): string {
  const params = new URLSearchParams();
  
  // ... existing URL serialization ...
  
  // Serialize lunch allowance
  if (state.hasLunchAllowance) {
    params.set('hasLunchAllowance', 'true');
    params.set('lunchAllowance', state.lunchAllowance.toString());
  }
  
  return params.toString();
}
```

### Test

**File**: `tests/unit/url-state.test.ts`

```typescript
import { parseStateFromURL, serializeStateToURL } from '@/lib/url-state';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

describe('URL State - Lunch Allowance', () => {
  describe('parseStateFromURL', () => {
    it('should parse hasLunchAllowance=true', () => {
      const url = '?hasLunchAllowance=true&lunchAllowance=730000';
      window.history.pushState({}, '', url);
      
      const state = parseStateFromURL();
      expect(state.hasLunchAllowance).toBe(true);
      expect(state.lunchAllowance).toBe(730_000);
    });
    
    it('should default to disabled when parameter is missing', () => {
      window.history.pushState({}, '', '?');
      
      const state = parseStateFromURL();
      expect(state.hasLunchAllowance).toBe(false);
      expect(state.lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);
    });
    
    it('should default to disabled when parameter is false', () => {
      const url = '?hasLunchAllowance=false';
      window.history.pushState({}, '', url);
      
      const state = parseStateFromURL();
      expect(state.hasLunchAllowance).toBe(false);
    });
    
    it('should use default amount when lunchAllowance is missing', () => {
      const url = '?hasLunchAllowance=true';
      window.history.pushState({}, '', url);
      
      const state = parseStateFromURL();
      expect(state.lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);
    });
    
    it('should use default amount when lunchAllowance is invalid', () => {
      const url = '?hasLunchAllowance=true&lunchAllowance=abc';
      window.history.pushState({}, '', url);
      
      const state = parseStateFromURL();
      expect(state.lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);
    });
    
    it('should use default amount when lunchAllowance is negative', () => {
      const url = '?hasLunchAllowance=true&lunchAllowance=-100';
      window.history.pushState({}, '', url);
      
      const state = parseStateFromURL();
      expect(state.lunchAllowance).toBe(DEFAULT_LUNCH_ALLOWANCE);
    });
  });
  
  describe('serializeStateToURL', () => {
    it('should include parameters when enabled', () => {
      const state = {
        hasLunchAllowance: true,
        lunchAllowance: 730_000,
        // ... other required state fields ...
      };
      
      const url = serializeStateToURL(state);
      expect(url).toContain('hasLunchAllowance=true');
      expect(url).toContain('lunchAllowance=730000');
    });
    
    it('should omit parameters when disabled', () => {
      const state = {
        hasLunchAllowance: false,
        lunchAllowance: 730_000,
        // ... other required state fields ...
      };
      
      const url = serializeStateToURL(state);
      expect(url).not.toContain('hasLunchAllowance');
      expect(url).not.toContain('lunchAllowance');
    });
  });
});
```

### Verify

```bash
npm test tests/unit/url-state.test.ts
```

**Expected**: ✅ 8 passing tests

---

## Step 6: Create UI Component (45 min)

### Implementation

**File**: `src/components/LunchAllowanceInput.tsx`

```typescript
import { useCalculatorStore } from '@/store/calculatorStore';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LunchAllowanceInput() {
  const { hasLunchAllowance, lunchAllowance, setHasLunchAllowance, setLunchAllowance } = 
    useCalculatorStore();
  
  const handleToggle = (checked: boolean) => {
    setHasLunchAllowance(checked);
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const amount = parseInt(value, 10);
    
    if (!isNaN(amount) && amount >= 0) {
      setLunchAllowance(amount);
    } else if (value === '') {
      setLunchAllowance(0);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="lunch-allowance-toggle" className="text-sm font-medium">
          Trợ cấp ăn trưa (Tax-exempt)
        </Label>
        <Switch
          id="lunch-allowance-toggle"
          checked={hasLunchAllowance}
          onCheckedChange={handleToggle}
          aria-label="Bật trợ cấp ăn trưa"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={lunchAllowance}
          onChange={handleAmountChange}
          disabled={!hasLunchAllowance}
          placeholder={DEFAULT_LUNCH_ALLOWANCE.toString()}
          min={0}
          step={100000}
          className="flex-1"
          aria-label="Trợ cấp ăn trưa không chịu thuế"
        />
        <span className="text-sm text-muted-foreground">VND</span>
      </div>
      
      {hasLunchAllowance && (
        <p className="text-xs text-muted-foreground">
          Toàn bộ số tiền được miễn thuế (không có giới hạn)
        </p>
      )}
    </div>
  );
}
```

### Test

**File**: `tests/components/LunchAllowanceInput.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { useCalculatorStore } from '@/store/calculatorStore';
import LunchAllowanceInput from '@/components/LunchAllowanceInput';
import { DEFAULT_LUNCH_ALLOWANCE } from '@/config/constants';

describe('LunchAllowanceInput Component', () => {
  beforeEach(() => {
    // Reset store
    const store = useCalculatorStore.getState();
    store.setHasLunchAllowance(false);
    store.setLunchAllowance(DEFAULT_LUNCH_ALLOWANCE);
  });
  
  it('should render toggle and input field', () => {
    render(<LunchAllowanceInput />);
    
    expect(screen.getByLabelText(/Bật trợ cấp ăn trưa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Trợ cấp ăn trưa không chịu thuế/i)).toBeInTheDocument();
  });
  
  it('should disable input when toggle is off', () => {
    render(<LunchAllowanceInput />);
    
    const input = screen.getByLabelText(/Trợ cấp ăn trưa không chịu thuế/i);
    expect(input).toBeDisabled();
  });
  
  it('should enable input when toggle is on', () => {
    render(<LunchAllowanceInput />);
    
    const toggle = screen.getByLabelText(/Bật trợ cấp ăn trưa/i);
    fireEvent.click(toggle);
    
    const input = screen.getByLabelText(/Trợ cấp ăn trưa không chịu thuế/i);
    expect(input).not.toBeDisabled();
  });
  
  it('should update store when toggle is changed', () => {
    render(<LunchAllowanceInput />);
    
    const toggle = screen.getByLabelText(/Bật trợ cấp ăn trưa/i);
    fireEvent.click(toggle);
    
    const store = useCalculatorStore.getState();
    expect(store.hasLunchAllowance).toBe(true);
  });
  
  it('should update store when amount is changed', () => {
    render(<LunchAllowanceInput />);
    
    // Enable first
    const toggle = screen.getByLabelText(/Bật trợ cấp ăn trưa/i);
    fireEvent.click(toggle);
    
    // Change amount
    const input = screen.getByLabelText(/Trợ cấp ăn trưa không chịu thuế/i);
    fireEvent.change(input, { target: { value: '1500000' } });
    
    const store = useCalculatorStore.getState();
    expect(store.lunchAllowance).toBe(1_500_000);
  });
  
  it('should show default value initially', () => {
    render(<LunchAllowanceInput />);
    
    const input = screen.getByLabelText(/Trợ cấp ăn trưa không chịu thuế/i);
    expect(input).toHaveValue(DEFAULT_LUNCH_ALLOWANCE);
  });
  
  it('should preserve custom amount when toggled off and on', () => {
    render(<LunchAllowanceInput />);
    
    const toggle = screen.getByLabelText(/Bật trợ cấp ăn trưa/i);
    const input = screen.getByLabelText(/Trợ cấp ăn trưa không chịu thuế/i);
    
    // Enable and set custom amount
    fireEvent.click(toggle);
    fireEvent.change(input, { target: { value: '1500000' } });
    
    // Disable
    fireEvent.click(toggle);
    
    // Enable again
    fireEvent.click(toggle);
    
    expect(input).toHaveValue(1_500_000);
  });
  
  it('should show tax-exempt hint when enabled', () => {
    render(<LunchAllowanceInput />);
    
    const toggle = screen.getByLabelText(/Bật trợ cấp ăn trưa/i);
    fireEvent.click(toggle);
    
    expect(screen.getByText(/Toàn bộ số tiền được miễn thuế/i)).toBeInTheDocument();
  });
  
  it('should not show tax-exempt hint when disabled', () => {
    render(<LunchAllowanceInput />);
    
    expect(screen.queryByText(/Toàn bộ số tiền được miễn thuế/i)).not.toBeInTheDocument();
  });
});
```

### Verify

```bash
npm test tests/components/LunchAllowanceInput.test.tsx
```

**Expected**: ✅ 9 passing tests

---

## Step 7: Integrate into Main Calculator (15 min)

### Implementation

**File**: `src/components/Calculator.tsx`

```typescript
import LunchAllowanceInput from './LunchAllowanceInput';

export default function Calculator() {
  const { 
    // ... existing store state ...
    hasLunchAllowance, 
    lunchAllowance 
  } = useCalculatorStore();
  
  // Update calculation to include lunch allowance
  const result = calculateNet(
    gross,
    insurance,
    deductions,
    tax,
    {
      unionDues: hasUnionDues ? unionDues : undefined,
      lunchAllowance: hasLunchAllowance ? lunchAllowance : undefined,
    }
  );
  
  return (
    <div>
      {/* ... existing inputs ... */}
      
      {/* Add lunch allowance input after union dues */}
      <LunchAllowanceInput />
      
      {/* ... existing results display ... */}
    </div>
  );
}
```

**File**: `src/components/ResultsDisplay.tsx`

```typescript
// Add lunch allowance display after union dues
{result.lunchAllowance !== undefined && (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">Trợ cấp ăn trưa (tax-exempt):</span>
    <span className="font-medium text-green-600">
      +{formatNumber(result.lunchAllowance)} VND
    </span>
  </div>
)}
```

### Test

**File**: `tests/integration/lunch-allowance.integration.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from '@/components/Calculator';
import { useCalculatorStore } from '@/store/calculatorStore';

describe('Lunch Allowance Integration', () => {
  beforeEach(() => {
    const store = useCalculatorStore.getState();
    store.setHasLunchAllowance(false);
    store.setLunchAllowance(730_000);
  });
  
  it('should recalculate when lunch allowance is enabled', () => {
    render(<Calculator />);
    
    // Get initial final NET
    const initialNet = screen.getByTestId('final-net').textContent;
    
    // Enable lunch allowance
    const toggle = screen.getByLabelText(/Bật trợ cấp ăn trưa/i);
    fireEvent.click(toggle);
    
    // Final NET should increase
    const newNet = screen.getByTestId('final-net').textContent;
    expect(newNet).not.toBe(initialNet);
  });
  
  it('should use custom amount in calculation', () => {
    render(<Calculator />);
    
    // Enable and set custom amount
    const toggle = screen.getByLabelText(/Bật trợ cấp ăn trưa/i);
    fireEvent.click(toggle);
    
    const input = screen.getByLabelText(/Trợ cấp ăn trưa không chịu thuế/i);
    fireEvent.change(input, { target: { value: '1500000' } });
    
    // Should display custom amount
    expect(screen.getByText(/\+1,500,000 VND/)).toBeInTheDocument();
  });
  
  it('should persist state in URL', () => {
    render(<Calculator />);
    
    const toggle = screen.getByLabelText(/Bật trợ cấp ăn trưa/i);
    fireEvent.click(toggle);
    
    expect(window.location.search).toContain('hasLunchAllowance=true');
    expect(window.location.search).toContain('lunchAllowance=730000');
  });
  
  it('should restore state from URL', () => {
    // Set URL
    window.history.pushState({}, '', '?hasLunchAllowance=true&lunchAllowance=1500000');
    
    render(<Calculator />);
    
    const input = screen.getByLabelText(/Trợ cấp ăn trưa không chịu thuế/i);
    expect(input).toHaveValue(1_500_000);
    expect(input).not.toBeDisabled();
  });
  
  it('should work with union dues feature', () => {
    render(<Calculator />);
    
    // Enable both features
    const unionToggle = screen.getByLabelText(/Bật đóng công đoàn/i);
    const lunchToggle = screen.getByLabelText(/Bật trợ cấp ăn trưa/i);
    
    fireEvent.click(unionToggle);
    fireEvent.click(lunchToggle);
    
    // Should display both
    expect(screen.getByText(/Đóng công đoàn/)).toBeInTheDocument();
    expect(screen.getByText(/Trợ cấp ăn trưa/)).toBeInTheDocument();
  });
});
```

### Verify

```bash
npm test tests/integration/lunch-allowance.integration.test.tsx
```

**Expected**: ✅ 5 passing tests

---

## Step 8: Run All Tests (10 min)

### Verify Full Test Suite

```bash
npm test
```

**Expected**:
- ✅ All existing tests still pass
- ✅ All new lunch allowance tests pass
- ✅ Total: ~30+ new tests passing

### Check Coverage

```bash
npm run test:coverage
```

**Expected Coverage**:
- ✅ `constants.ts`: 100%
- ✅ `tax.ts`: ≥95%
- ✅ `calculator-store.ts`: ≥90%
- ✅ `url-state.ts`: ≥90%
- ✅ `LunchAllowanceInput.tsx`: ≥85%

---

## Step 9: Manual Testing (15 min)

### Start Dev Server

```bash
npm run dev
```

### Test Scenarios

**Scenario 1: Enable with Default**
1. ✅ Open http://localhost:5173
2. ✅ Toggle "Trợ cấp ăn trưa" ON
3. ✅ See default value 730,000 VND
4. ✅ See final NET increase by 730,000
5. ✅ See URL update: `?hasLunchAllowance=true&lunchAllowance=730000`

**Scenario 2: Custom Amount**
1. ✅ Change amount to 1,500,000
2. ✅ See final NET increase by 1,500,000
3. ✅ See URL update: `?lunchAllowance=1500000`

**Scenario 3: Toggle Off**
1. ✅ Toggle "Trợ cấp ăn trưa" OFF
2. ✅ See input field disabled
3. ✅ See final NET decrease (lunch allowance removed)
4. ✅ See URL remove lunch allowance parameters

**Scenario 4: Toggle Back On**
1. ✅ Toggle "Trợ cấp ăn trưa" ON again
2. ✅ See amount preserved (1,500,000 from Scenario 2)

**Scenario 5: URL Sharing**
1. ✅ Copy URL from Scenario 2
2. ✅ Open in new tab/window
3. ✅ See lunch allowance enabled with 1,500,000

**Scenario 6: With Union Dues**
1. ✅ Enable union dues
2. ✅ Enable lunch allowance
3. ✅ See both features working together
4. ✅ Final NET = (Gross - Insurance - Tax - Union Dues) + Lunch Allowance

---

## Step 10: Code Review Checklist (10 min)

### Code Quality

- ✅ All TypeScript strict mode checks pass
- ✅ No `any` types used
- ✅ No `@ts-ignore` comments
- ✅ All functions have proper type annotations
- ✅ All interfaces properly documented

### Testing

- ✅ Unit tests for all functions
- ✅ Component tests for UI
- ✅ Integration tests for feature workflow
- ✅ Contract tests for type safety
- ✅ All tests pass
- ✅ Coverage ≥85%

### Code Style

- ✅ ESLint passes: `npm run lint`
- ✅ Prettier formatting applied
- ✅ Consistent naming conventions
- ✅ No console.log statements
- ✅ No commented-out code

### Accessibility

- ✅ Toggle has ARIA label
- ✅ Input has associated label
- ✅ Keyboard navigable (Tab, Space, Arrow keys)
- ✅ Screen reader friendly

### Performance

- ✅ No unnecessary re-renders
- ✅ Zustand store optimized
- ✅ No N+1 calculation issues

---

## Step 11: Commit Changes (5 min)

### Stage Files

```bash
git add src/config/constants.ts
git add src/types/index.ts
git add src/store/calculatorStore.ts
git add src/lib/tax.ts
git add src/lib/url-state.ts
git add src/components/LunchAllowanceInput.tsx
git add src/components/Calculator.tsx
git add src/components/ResultsDisplay.tsx
git add tests/
```

### Commit

```bash
git commit -m "feat(005): implement tax-exempt lunch allowance feature

- Add DEFAULT_LUNCH_ALLOWANCE constant (730K VND)
- Extend CalculationResult type with optional lunchAllowance field
- Add lunch allowance state to Zustand store (hasLunchAllowance, lunchAllowance)
- Update calculateNet to accept lunchAllowance option
- Add URL state persistence for lunch allowance
- Create LunchAllowanceInput component (toggle + input)
- Integrate into Calculator with union dues
- Add comprehensive test suite (30+ tests)

Closes: #005
Test: All tests passing (unit, component, integration, contract)
Coverage: ≥85% on new code"
```

---

## Troubleshooting

### Tests Failing

**Problem**: "Cannot find module '@/config/constants'"
**Solution**: Check `tsconfig.json` has path alias: `"@/*": ["./src/*"]`

**Problem**: "ReferenceError: window is not defined"
**Solution**: Add `jsdom` environment to Vitest config

**Problem**: "Store not resetting between tests"
**Solution**: Add `beforeEach` hook to reset store state

### Type Errors

**Problem**: "Type 'number | undefined' is not assignable to type 'number'"
**Solution**: Use optional chaining: `result.lunchAllowance ?? 0`

**Problem**: "Property 'lunchAllowance' does not exist on type 'CalculationResult'"
**Solution**: Make sure type extension is in correct file

### UI Issues

**Problem**: "Input not disabled when toggle is off"
**Solution**: Check `disabled={!hasLunchAllowance}` prop

**Problem**: "Amount not preserved on toggle off"
**Solution**: Verify store action doesn't reset amount

---

## Next Steps

After completing this feature:

1. **Run full test suite**: `npm test`
2. **Check lint**: `npm run lint`
3. **Manual QA**: Test all scenarios in browser
4. **Review code**: Self-review using checklist
5. **Push to branch**: `git push origin 005-lunch-allowance`
6. **Create PR**: Open pull request with spec link
7. **Request review**: Tag reviewer with spec context

---

## Time Breakdown

- Step 1 (Constant): 5 min
- Step 2 (Types): 10 min
- Step 3 (Store): 20 min
- Step 4 (Calculation): 30 min
- Step 5 (URL State): 25 min
- Step 6 (Component): 45 min
- Step 7 (Integration): 15 min
- Step 8 (Testing): 10 min
- Step 9 (Manual QA): 15 min
- Step 10 (Review): 10 min
- Step 11 (Commit): 5 min

**Total**: ~3 hours (with TDD)

---

## Success Criteria

✅ All acceptance criteria from spec.md met:
- AC1: Toggle lunch allowance on/off
- AC2: Customize lunch allowance amount
- AC3: Default value 730,000 VND
- AC4: Entire amount is tax-exempt
- AC5: Added to final NET after all deductions
- AC6: Display in results summary
- AC7: URL state persistence
- AC8: Works with union dues
- AC9: Preserve amount on toggle off
- AC10: Validation (non-negative)

✅ All tests passing (30+ new tests)
✅ Coverage ≥85%
✅ No linting errors
✅ No type errors
✅ Accessibility compliant
✅ Manual QA complete

---

**Ready to implement? Start with Step 1! 🚀**
