# PIT VN Gross→Net Calculator — Web App Spec (Client-side, GitHub Pages)

> **Goal**: A small, modern, single-page web app that helps users convert **Gross → Net** salary in Vietnam, showing **full insurance & PIT breakdown**, and a **side-by-side comparison** between the **old regime (≤ 2025)** and the **new regime (≥ 2026)**. All calculations run **100% in the browser** (no backend). Users can verify the math step-by-step.

---

## 1) Product Objectives

* **Accurate**: Implement the two legal regimes exactly as specified (rates, thresholds, caps/floors, deductions).
* **Transparent**: Explain each component on **separate lines** (bases → insurance items → family deductions → taxable income → tax by brackets → totals).
* **Comparable**: Show **2025 vs 2026** results side-by-side with **Δ (delta) highlights** (how deductions/tax/net change).
* **Usable**: Clean, responsive, accessible UI; easy number input; copy/share result; URL-sharable state.
* **Maintainable**: Strong typing (TypeScript), clear separation of **config vs logic**, unit tests, small and fast.

---

## 2) Scope & Features

### 2.1 Inputs

* **Gross salary (monthly, VND)**

  * Free-form numeric; accept `,`, `_`, spaces; sanitize on blur.
  * Quick presets: 10M, 30M, 60M, 100M, 185M.
* **Dependents (integer ≥ 0)** — default **2**.
* **Region** — select **I/II/III/IV** (default **I**).
* **Insurance base mode**

  * **“= Gross (default)”** — the base equals gross; still **clamped** by floor/caps.
  * **“Custom”** — a second numeric field appears; validated & clamped.
* **Regime toggle**

  * View **2025** only, **2026** only, or **Compare 2025 ↔ 2026** (default **Compare**).
* **Display options**

  * Number format: **`en-US` (1,234,567)** (default) or `vi-VN` (1.234.567).
  * Show/hide **detailed steps**.
  * Dark mode toggle.

### 2.2 Outputs (per regime)

* **Header line**: `NET = GROSS − Insurance − PIT = …` (big, bold).
* **Insurance (employee portion)** — with **bases & caps**:

  * Base for **SI/HI** (clamped by floor & 20×base-salary cap).
  * Base for **UI** (clamped by floor & 20×regional-minimum cap).
  * Items:

    * **BHXH** = 8% × base_SI_HI
    * **BHYT** = 1.5% × base_SI_HI
    * **BHTN** = 1% × base_UI
  * **Total Insurance** (sum).
* **Family deductions**:

  * **Personal** + **Dependents × per-dependent** + **Insurance**.
  * **Total deductions**.
* **Taxable income** = Gross − Total deductions (floored at 0 in logic).
* **PIT (progressive)**:

  * Each slab line: `Band label + rate + slab amount + tax for slab`.
  * **Total PIT** (sum of slab taxes).
* **NET** = Gross − Insurance − PIT (final line, emphasized).
* **Copy as text** button (produces a readable, multi-line explanation).
* **Share link** button (encodes state into URL query).

### 2.3 Compare 2025 vs 2026

* A **two-card grid** (Old vs New) + a **delta summary** card on top:

  * **Deductions**: personal, dependents, insurance, **Total** (with Δ).
  * **Taxable income**: old vs new (with Δ).
  * **Total PIT**: old vs new (with Δ).
  * **NET**: old vs new (with Δ, highlighted).
* Each card expands to show the full step-by-step breakdown for that regime.

### 2.4 Legal/Config Constants (editable in a single file)

* **Rates (employee share)**: SI **8%**, HI **1.5%**, UI **1%**.
* **Floors/Cap rules**:

  * **Regional minimum wage**: Vùng I/II/III/IV (config values).
  * **Base salary** (for SI/HI cap): cap_SI_HI = **20 × baseSalary**.
  * **UI cap**: cap_UI = **20 × regionalMinimum**.
  * **Floors**: base cannot be below regional minimum.
* **Regime 2025**:

  * **Deductions**: personal **11,000,000**; dependent **4,000,000**.
  * **7 brackets** (VND/month):

    * ≤5,000,000 → 5%
    * > 5–10M → 10%
    * > 10–18M → 15%
    * > 18–32M → 20%
    * > 32–52M → 25%
    * > 52–80M → 30%
    * > 80M → 35%
* **Regime 2026**:

  * **Deductions**: personal **15,500,000**; dependent **6,200,000**.
  * **5 brackets**:

    * ≤10M → 5%
    * > 10–30M → 15%
    * > 30–60M → 25%
    * > 60–100M → 30%
    * > 100M → 35%

> Note: Put **all** numbers above into a `constants.ts` module for easy yearly update. The UI must render current values from constants to avoid hard-coded text.

---

## 3) Calculation Rules (authoritative)

### 3.1 Insurance bases

* `base_SI_HI` = clamp(insuranceBase, **regionalMin**, **20×baseSalary**)
* `base_UI`    = clamp(insuranceBase, **regionalMin**, **20×regionalMin**)
* Default `insuranceBase = gross` unless user selects “Custom”.

### 3.2 Insurance amounts (employee portion)

* `SI = round(base_SI_HI × 0.08)`
* `HI = round(base_SI_HI × 0.015)`
* `UI = round(base_UI × 0.01)`
* `INS_TOTAL = SI + HI + UI`

### 3.3 Deductions

* `DED_PERSONAL = regime.personal`
* `DED_DEP = dependents × regime.perDependent`
* `TOTAL_DEDUCTIONS = DED_PERSONAL + DED_DEP + INS_TOTAL`

### 3.4 Taxable income

* `TAXABLE = max(0, gross − TOTAL_DEDUCTIONS)`

### 3.5 PIT (progressive)

Evaluate with **slabs**; for each bracket `{threshold, rate}`:

* Let `prev` = previous threshold (0 for first).
* If `threshold = +∞`: `slab = remaining`.
* Else `slab = max(0, min(remaining, threshold − prev))`.
* `tax_slab = round(slab × rate)`; accumulate & subtract from `remaining`.
* Label examples:

  * Finite: `Bậc i: {prev}–{threshold} @ {rate%}`
  * Infinite: `Bậc i: >{prev} @ {rate%}`

### 3.6 NET

* `NET = gross − INS_TOTAL − PIT_TOTAL`

### 3.7 Number formatting & rounding

* Use `Intl.NumberFormat(locale)`; default **`en-US`**; allow `vi-VN`.
* Always `round()` monetary intermediate results to integer VND.
* Display **thousand separators**; no decimals.

---

## 4) Tech Choices

* **Framework**: **React + TypeScript** (Vite scaffolding).
* **Styling**: **Tailwind CSS** + **shadcn/ui** (Radix-based, accessible) + **lucide-react** icons.
* **State**: Local component state + **Zustand** (lightweight) for app settings.
* **Routing**: **None** (SPA single page). Use URL query for sharable state.
* **Build**: Vite; **ESLint + Prettier**; pnpm.
* **Tests**: **Vitest + Testing Library** (unit tests for pure math; component smoke tests).
* **CI/CD**: GitHub Actions → **GitHub Pages** deploy (static).
* **PWA (optional)**: add service worker & manifest for offline usage.

---

## 5) UX & UI Requirements

### 5.1 Layout

* **Header**: title, regime toggle (2025 | 2026 | Compare), dark mode switch, GitHub link.
* **Left panel (Inputs)**:

  * Gross input (large), dependents, region select, insurance base mode + custom field.
  * Display options (locale, show details).
  * “Calculate” is **instant** (debounced on change).
* **Right panel (Results)**:

  * **Compare mode**: 3 cards = **Delta Summary** (top, full width), then **2025** and **2026** cards in a responsive grid.
  * **Single regime mode**: one card with full breakdown.
* **Cards**: use shadcn `Card`; emphasize **NET**; collapsible “Details”.
* **Delta summary**: compact table with rows:

  * Personal deduction, Dependent deduction, Insurance (same), **Total deductions**, **Taxable**, **PIT total**, **NET**.
  * Rightmost column shows **Δ** with color coding: green if user **pays less tax/gets higher net**, red if worse.
* **Footer**: disclaimer (“for reference”), last updated config date.

### 5.2 Interactions

* On paste/typing into **Gross** or **Custom insurance base**, sanitize to digits.
* If custom base is below floor or above caps, show helper text:

  * “Applied floor/cap: actual bases are …”.
* Tooltips for **floors & caps** explaining the formulas.
* “Copy details” → copies the multi-line explanation for the **active regime** or both if Compare mode.
* “Share” → updates URL (e.g., `?gross=185000000&deps=2&region=I&mode=compare&fmt=en-US`).

### 5.3 Accessibility

* Semantic HTML, labeled controls, keyboard focus states, high-contrast mode compatibility.
* Announce NET changes to screen readers (aria-live polite).

### 5.4 Responsiveness

* Mobile-first; stacked layout on small screens; sticky Calculate summary on top.

---

## 6) Data & Types (TypeScript)

```ts
// constants.ts
export type RegionId = "I" | "II" | "III" | "IV";
export interface RegionConfig { minWage: number }
export interface Regime {
  id: "2025" | "2026";
  personalDeduction: number;
  dependentDeduction: number;
  brackets: Array<{ threshold: number | "inf"; rate: number }>; // monthly VND
}

export const REGIONS: Record<RegionId, RegionConfig> = {
  I: { minWage: 4_960_000 },
  II:{ minWage: 4_410_000 },
  III:{minWage: 3_860_000 },
  IV:{ minWage: 3_450_000 },
};

export const BASE_SALARY = 2_340_000; // for SI/HI cap

export const REGIME_2025: Regime = {
  id: "2025",
  personalDeduction: 11_000_000,
  dependentDeduction: 4_000_000,
  brackets: [
    { threshold: 5_000_000, rate: 0.05 },
    { threshold: 10_000_000, rate: 0.10 },
    { threshold: 18_000_000, rate: 0.15 },
    { threshold: 32_000_000, rate: 0.20 },
    { threshold: 52_000_000, rate: 0.25 },
    { threshold: 80_000_000, rate: 0.30 },
    { threshold: "inf",      rate: 0.35 },
  ],
};

export const REGIME_2026: Regime = {
  id: "2026",
  personalDeduction: 15_500_000,
  dependentDeduction: 6_200_000,
  brackets: [
    { threshold: 10_000_000, rate: 0.05 },
    { threshold: 30_000_000, rate: 0.15 },
    { threshold: 60_000_000, rate: 0.25 },
    { threshold: 100_000_000, rate: 0.30 },
    { threshold: "inf",       rate: 0.35 },
  ],
};

// insurance rates (employee)
export const RATE_SI = 0.08, RATE_HI = 0.015, RATE_UI = 0.01;
```

```ts
// tax.ts (pure logic)
export interface Inputs {
  gross: number;
  dependents: number;
  region: RegionId;
  insuranceBase?: number; // if undefined → equals gross
  regime: Regime;
}
export interface InsuranceBases { baseSIHI: number; baseUI: number }
export interface Insurance {
  bases: InsuranceBases;
  si: number; hi: number; ui: number; total: number;
}
export interface PitItem { label: string; slab: number; rate: number; tax: number }
export interface Pit {
  taxable: number;
  items: PitItem[];
  total: number;
}
export interface Result {
  inputs: Inputs;
  insurance: Insurance;
  deductions: { personal: number; dependents: number; insurance: number; total: number };
  pit: Pit;
  net: number;
}

export function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(v, hi)); }
export function roundVnd(n: number) { return Math.round(n); }

export function calcInsuranceBases(gross: number, regionMin: number, baseSalary: number, insuranceBase?: number): InsuranceBases {
  const base = insuranceBase ?? gross;
  const capSIHI = 20 * baseSalary;
  const capUI   = 20 * regionMin;
  return {
    baseSIHI: clamp(base, regionMin, capSIHI),
    baseUI:   clamp(base, regionMin, capUI),
  };
}

export function calcInsurance(bases: InsuranceBases) : Insurance {
  const si = roundVnd(bases.baseSIHI * RATE_SI);
  const hi = roundVnd(bases.baseSIHI * RATE_HI);
  const ui = roundVnd(bases.baseUI   * RATE_UI);
  return { bases, si, hi, ui, total: si + hi + ui };
}

export function calcPit(taxable: number, regime: Regime): Pit {
  if (taxable <= 0) return { taxable, items: [], total: 0 };
  let remain = taxable, prev = 0, total = 0;
  const items: PitItem[] = [];
  regime.brackets.forEach((b, i) => {
    const thr = b.threshold === "inf" ? Number.POSITIVE_INFINITY : b.threshold;
    const finite = Number.isFinite(thr);
    const slab = Math.max(0, Math.min(remain, finite ? (thr - prev) : remain));
    if (slab > 0) {
      const tax = roundVnd(slab * b.rate);
      total += tax; remain -= slab;
      const label = finite ? `Bậc ${i+1}: ${prev}–${thr} @ ${b.rate*100}%` : `Bậc ${i+1}: >${prev} @ ${b.rate*100}%`;
      items.push({ label, slab, rate: b.rate, tax });
    }
    prev = thr;
  });
  return { taxable, items, total };
}

export function calcAll(inputs: Inputs, regionMin: number, baseSalary: number): Result {
  const bases = calcInsuranceBases(inputs.gross, regionMin, baseSalary, inputs.insuranceBase);
  const ins = calcInsurance(bases);
  const dedPersonal = inputs.regime.personalDeduction;
  const dedDeps = inputs.dependents * inputs.regime.dependentDeduction;
  const dedTotal = dedPersonal + dedDeps + ins.total;
  const taxable = Math.max(0, inputs.gross - dedTotal);
  const pit = calcPit(taxable, inputs.regime);
  const net = inputs.gross - ins.total - pit.total;
  return {
    inputs,
    insurance: ins,
    deductions: { personal: dedPersonal, dependents: dedDeps, insurance: ins.total, total: dedTotal },
    pit,
    net,
  };
}
```

---

## 7) UI Components (React + shadcn/ui)

* `GrossInputCard`: gross field (+ presets), dependents, region, insurance mode/custom, format/dark toggles.
* `SummaryDeltaCard`: shows Δ of key metrics when in compare mode.
* `RegimeResultCard`: big NET; collapsible **Details** (Insurance breakdown; Deductions; Taxable; PIT items; Totals) + “Copy details”.
* `Footer`: disclaimer, last updated constants.

---

## 8) Non-Functional

* **Performance**: All math is O(#brackets); immediate response; bundle & assets ≤ ~200 KB gzip if possible.
* **Security/Privacy**: No data leaves the browser; no analytics by default.
* **Internationalization**: Ready to add `i18next`; default content Vietnamese; English strings in a JSON file.
* **Formatting**: Use `Intl.NumberFormat(locale)`; default `en-US`; persist choice in `localStorage`.

---

## 9) Validation & Tests

* **Unit tests (Vitest)** for:

  * Insurance clamping (floors/caps for each region).
  * Tax slabs: edge cases at thresholds (5M/10M/… for 2025; 10M/30M/… for 2026).
  * Regression: specific inputs (e.g., 10M, 30M, 60M, 100M, 185M; 2 dependents; Region I; base=Gross).
  * Overflow safety: last bracket (`+∞`) should never cast to `int`.
* **UI tests**: basic render; number sanitizer; copy/share.

---

## 10) Repository & Delivery

**Structure**

```
/src
  /components
  /lib
    constants.ts
    tax.ts
    format.ts
  /pages (or App.tsx)
  /styles (tailwind.css)
index.html
vite.config.ts
```

**Scripts**

* `pnpm dev` — local dev
* `pnpm test` — unit tests (Vitest)
* `pnpm build` — production build
* `pnpm preview` — preview
* GitHub Actions workflow to deploy `/dist` to **GitHub Pages** (on push to `main`).

**License**: MIT.

---

## 11) Acceptance Criteria

1. Entering `Gross=185,000,000`, `Dependents=2`, `Region=I`, `Insurance base=Gross` instantly shows:

   * Two cards (2025 & 2026) with **identical insurance totals** but **different deductions & PIT**,
   * A delta summary with **Δ** values (correct signs + color).
2. Changing region updates floors/caps and insurance amounts deterministically.
3. “Copy details” copies the exact multi-line textual explanation (human-readable).
4. The URL reflects current state and restoring the URL reproduces the same results.
5. No network requests are required for calculation; app works offline after first load (if PWA enabled).

---

## 12) Known Assumptions & Notes

* The app focuses on **employee portion** of insurance; employer side is intentionally excluded.
* Legal constants (base salary, regional minima) may change yearly—kept in `constants.ts`.
* Calculations are **per month**; yearly mode may be added later.
* Rounding uses `Math.round` to integer VND at each step.

