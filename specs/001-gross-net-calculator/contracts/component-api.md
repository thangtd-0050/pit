# Component API Contract

**Feature**: 001-gross-net-calculator
**Created**: 2025-11-05
**Type**: React Component Interfaces

## Overview

This document defines the props interfaces for all React components in the Vietnam salary calculator. All components are **functional components** using React hooks, follow **unidirectional data flow**, and are **purely presentational** (no business logic).

---

## Core Components

### 1. SalaryCalculator (Root Component)

**Purpose**: Root container orchestrating calculation logic and view mode switching.

**Props**: None (root component)

**State Management**:
```typescript
// Internal state (React.useState)
const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
const [result, setResult] = useState<CalculationResult | null>(null);

// Global state (Zustand)
const { viewMode, locale } = usePreferencesStore();
```

**Render Logic**:
```tsx
<div className="container mx-auto p-4">
  <CalculatorInputs
    inputs={inputs}
    onChange={setInputs}
  />

  {viewMode === "single" ? (
    <ResultDisplay result={result} />
  ) : (
    <ComparisonView comparison={comparisonResult} />
  )}
</div>
```

**Children**:
- `<CalculatorInputs />` (input form)
- `<ResultDisplay />` (single result view)
- `<ComparisonView />` (comparison view)

**Testing**:
- Render without crashing
- Switch between single/compare modes
- Pass inputs to children correctly
- Update result when inputs change

---

### 2. CalculatorInputs

**Purpose**: Input form for gross salary, dependents, region, and insurance base.

**Props**:
```typescript
interface CalculatorInputsProps {
  inputs: CalculatorInputs;
  onChange: (inputs: CalculatorInputs) => void;
}
```

**Structure**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Nhập Thông Tin Lương</CardTitle>
  </CardHeader>
  <CardContent>
    <GrossSalaryInput
      value={inputs.gross}
      onChange={handleGrossChange}
    />
    <DependentsInput
      value={inputs.dependents}
      onChange={handleDependentsChange}
    />
    <RegionSelector
      value={inputs.region}
      onChange={handleRegionChange}
    />
    <InsuranceBaseInput
      mode={insuranceBaseMode}
      customValue={inputs.insuranceBase}
      onModeChange={handleModeChange}
      onCustomValueChange={handleCustomBaseChange}
    />
  </CardContent>
</Card>
```

**Behavior**:
- Debounce gross salary input (300ms) to prevent excessive calculations
- Validate dependents ≥ 0
- Validate custom insurance base ≥ regional minimum (if provided)
- Emit complete `CalculatorInputs` object on change

**Children**:
- `<GrossSalaryInput />` (numeric input with formatting)
- `<DependentsInput />` (number spinner)
- `<RegionSelector />` (dropdown)
- `<InsuranceBaseInput />` (toggle + conditional custom input)

**Testing**:
- Change each input field and verify onChange called
- Test validation (negative dependents, invalid custom base)
- Test debouncing on gross salary input
- Test keyboard navigation (tab order)

---

### 3. GrossSalaryInput

**Purpose**: Formatted numeric input for gross monthly salary.

**Props**:
```typescript
interface GrossSalaryInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}
```

**Default Props**:
```typescript
{
  label: "Lương Gross (₫/tháng)",
  placeholder: "30,000,000",
  min: 0,
  max: 1_000_000_000
}
```

**Behavior**:
- Display formatted value with thousand separators (locale-aware)
- Accept raw numeric input, commas, spaces, underscores
- Sanitize on blur using `sanitizeNumericInput()`
- Clamp value between min/max on blur
- Show error state if value out of range

**Markup**:
```tsx
<div className="space-y-2">
  <Label htmlFor="gross-salary">{label}</Label>
  <Input
    id="gross-salary"
    type="text"
    inputMode="numeric"
    value={displayValue}
    onChange={handleInputChange}
    onBlur={handleBlur}
    placeholder={placeholder}
    aria-invalid={isInvalid}
    aria-describedby="gross-salary-error"
  />
  {isInvalid && (
    <p id="gross-salary-error" className="text-sm text-destructive">
      Lương phải nằm trong khoảng {formatVnd(min)} - {formatVnd(max)}
    </p>
  )}
</div>
```

**Testing**:
- Enter valid number and verify onChange
- Enter formatted number (commas, spaces) and verify parsing
- Enter value below min (should clamp)
- Enter value above max (should clamp)
- Test keyboard input (numbers, backspace, delete)
- Test paste behavior
- Test screen reader labels (aria-invalid, aria-describedby)

---

### 4. DependentsInput

**Purpose**: Number input (spinner) for dependent count.

**Props**:
```typescript
interface DependentsInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
}
```

**Default Props**:
```typescript
{
  label: "Số Người Phụ Thuộc",
  min: 0,
  max: 20
}
```

**Behavior**:
- Integer input only (no decimals)
- Increment/decrement buttons (step = 1)
- Clamp between min/max
- Show tooltip explaining dependent definition

**Markup**:
```tsx
<div className="space-y-2">
  <Label htmlFor="dependents">
    {label}
    <InfoTooltip content="Người phụ thuộc hợp lệ theo Luật Thuế TNCN: con dưới 18 tuổi, người lớn tuổi..." />
  </Label>
  <div className="flex gap-2">
    <Button
      variant="outline"
      size="icon"
      onClick={() => onChange(Math.max(min, value - 1))}
      disabled={value <= min}
      aria-label="Giảm số người phụ thuộc"
    >
      <Minus className="h-4 w-4" />
    </Button>
    <Input
      id="dependents"
      type="number"
      value={value}
      onChange={handleChange}
      className="text-center w-20"
      min={min}
      max={max}
    />
    <Button
      variant="outline"
      size="icon"
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={value >= max}
      aria-label="Tăng số người phụ thuộc"
    >
      <Plus className="h-4 w-4" />
    </Button>
  </div>
</div>
```

**Testing**:
- Click increment/decrement buttons
- Type value directly in input
- Test min/max clamping
- Verify buttons disabled at boundaries
- Test keyboard navigation (arrow keys, tab)

---

### 5. RegionSelector

**Purpose**: Dropdown selector for regional minimum wage.

**Props**:
```typescript
interface RegionSelectorProps {
  value: RegionId;
  onChange: (region: RegionId) => void;
  label?: string;
}
```

**Default Props**:
```typescript
{
  label: "Vùng Lương Tối Thiểu"
}
```

**Options**:
```typescript
const REGION_OPTIONS: Array<{ value: RegionId; label: string }> = [
  { value: "I", label: "Vùng I (4,960,000 ₫) - Hà Nội, TP.HCM, Bình Dương..." },
  { value: "II", label: "Vùng II (4,410,000 ₫) - Hải Phòng, Đà Nẵng, Cần Thơ..." },
  { value: "III", label: "Vùng III (3,860,000 ₫) - Tỉnh lỵ các tỉnh còn lại" },
  { value: "IV", label: "Vùng IV (3,450,000 ₫) - Các huyện, xã còn lại" }
];
```

**Markup**:
```tsx
<div className="space-y-2">
  <Label htmlFor="region">{label}</Label>
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger id="region">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {REGION_OPTIONS.map(opt => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

**Testing**:
- Select each region and verify onChange
- Verify correct regional minimum displayed
- Test keyboard navigation (arrow keys, enter)
- Test screen reader announcements

---

### 6. InsuranceBaseInput

**Purpose**: Toggle between "gross" and "custom" insurance base modes, with conditional custom input.

**Props**:
```typescript
interface InsuranceBaseInputProps {
  mode: InsuranceBaseMode;
  customValue?: number;
  onModeChange: (mode: InsuranceBaseMode) => void;
  onCustomValueChange: (value: number) => void;
}
```

**Behavior**:
- Radio group: "Theo lương Gross" vs "Tùy chỉnh"
- Show custom input only when mode = "custom"
- Validate custom value ≥ regional minimum
- Show warning if custom base is too low or too high

**Markup**:
```tsx
<div className="space-y-3">
  <Label>
    Mức Đóng Bảo Hiểm
    <InfoTooltip content="Mức lương làm cơ sở đóng bảo hiểm. Mặc định là lương Gross." />
  </Label>

  <RadioGroup value={mode} onValueChange={onModeChange}>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="gross" id="mode-gross" />
      <Label htmlFor="mode-gross">Theo lương Gross</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="custom" id="mode-custom" />
      <Label htmlFor="mode-custom">Tùy chỉnh</Label>
    </div>
  </RadioGroup>

  {mode === "custom" && (
    <GrossSalaryInput
      value={customValue ?? 0}
      onChange={onCustomValueChange}
      label="Mức đóng BH tùy chỉnh (₫/tháng)"
      placeholder="30,000,000"
    />
  )}
</div>
```

**Testing**:
- Toggle between gross and custom modes
- Enter custom value and verify validation
- Verify custom input hidden when mode = "gross"
- Test warning messages for out-of-range values

---

## Result Display Components

### 7. ResultDisplay

**Purpose**: Display calculation results for a single regime (either 2025 or 2026).

**Props**:
```typescript
interface ResultDisplayProps {
  result: CalculationResult | null;
  title?: string;
}
```

**Default Props**:
```typescript
{
  title: "Kết Quả Tính Lương"
}
```

**Structure**:
```tsx
{!result ? (
  <EmptyState message="Nhập thông tin lương để xem kết quả" />
) : (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <NetSalaryHighlight net={result.net} />
      <InsuranceBreakdown insurance={result.insurance} />
      <DeductionsBreakdown deductions={result.deductions} />
      <PITBreakdown pit={result.pit} />
    </CardContent>
  </Card>
)}
```

**Children**:
- `<NetSalaryHighlight />` (hero number)
- `<InsuranceBreakdown />` (SI, HI, UI table)
- `<DeductionsBreakdown />` (personal, dependents, insurance)
- `<PITBreakdown />` (progressive tax brackets)

**Testing**:
- Render with null result (show empty state)
- Render with valid result (show all breakdowns)
- Verify all numbers formatted correctly
- Test print layout (CSS print styles)

---

### 8. NetSalaryHighlight

**Purpose**: Large, prominent display of net salary (hero section).

**Props**:
```typescript
interface NetSalaryHighlightProps {
  net: number;
}
```

**Markup**:
```tsx
<div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
  <p className="text-sm text-muted-foreground mb-2">
    Lương NET (Thực Nhận)
  </p>
  <p className="text-4xl font-bold text-primary">
    {formatVnd(net)}
  </p>
</div>
```

**Testing**:
- Render with various net values (small, medium, large)
- Verify formatting (thousand separators, no decimals)
- Test responsive layout (mobile/desktop)

---

### 9. InsuranceBreakdown

**Purpose**: Table showing insurance contributions (SI, HI, UI, total).

**Props**:
```typescript
interface InsuranceBreakdownProps {
  insurance: Insurance;
}
```

**Markup**:
```tsx
<div className="space-y-2">
  <h3 className="text-lg font-semibold">Bảo Hiểm</h3>
  <Table>
    <TableBody>
      <TableRow>
        <TableCell>BHXH (8%)</TableCell>
        <TableCell className="text-right">{formatVnd(insurance.si)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>BHYT (1.5%)</TableCell>
        <TableCell className="text-right">{formatVnd(insurance.hi)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>BHTN (1%)</TableCell>
        <TableCell className="text-right">{formatVnd(insurance.ui)}</TableCell>
      </TableRow>
      <TableRow className="font-semibold">
        <TableCell>Tổng</TableCell>
        <TableCell className="text-right">{formatVnd(insurance.total)}</TableCell>
      </TableRow>
    </TableBody>
  </Table>

  <Collapsible>
    <CollapsibleTrigger>
      <Button variant="link" size="sm">
        Xem chi tiết mức đóng BH
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <p className="text-sm text-muted-foreground">
        Mức đóng BHXH/BHYT: {formatVnd(insurance.bases.baseSIHI)}<br />
        Mức đóng BHTN: {formatVnd(insurance.bases.baseUI)}
      </p>
    </CollapsibleContent>
  </Collapsible>
</div>
```

**Testing**:
- Render with various insurance values
- Verify total is sum of SI + HI + UI
- Test collapsible expansion (show/hide bases)
- Verify percentage rates displayed correctly

---

### 10. DeductionsBreakdown

**Purpose**: Table showing tax deductions (personal, dependents, insurance).

**Props**:
```typescript
interface DeductionsBreakdownProps {
  deductions: Deductions;
}
```

**Markup**:
```tsx
<div className="space-y-2">
  <h3 className="text-lg font-semibold">Các Khoản Giảm Trừ</h3>
  <Table>
    <TableBody>
      <TableRow>
        <TableCell>Giảm trừ bản thân</TableCell>
        <TableCell className="text-right">{formatVnd(deductions.personal)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Giảm trừ người phụ thuộc</TableCell>
        <TableCell className="text-right">{formatVnd(deductions.dependents)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Bảo hiểm bắt buộc</TableCell>
        <TableCell className="text-right">{formatVnd(deductions.insurance)}</TableCell>
      </TableRow>
      <TableRow className="font-semibold">
        <TableCell>Tổng giảm trừ</TableCell>
        <TableCell className="text-right">{formatVnd(deductions.total)}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
```

**Testing**:
- Render with 0 dependents (dependent deduction = 0)
- Render with multiple dependents
- Verify total is sum of personal + dependents + insurance

---

### 11. PITBreakdown

**Purpose**: Table showing progressive PIT calculation by bracket.

**Props**:
```typescript
interface PITBreakdownProps {
  pit: PIT;
}
```

**Markup**:
```tsx
<div className="space-y-2">
  <h3 className="text-lg font-semibold">Thuế TNCN</h3>

  {pit.taxable <= 0 ? (
    <p className="text-sm text-muted-foreground">
      Thu nhập tính thuế ≤ 0. Không phải nộp thuế TNCN.
    </p>
  ) : (
    <>
      <p className="text-sm text-muted-foreground">
        Thu nhập tính thuế: <strong>{formatVnd(pit.taxable)}</strong>
      </p>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Bậc thuế</TableHeader>
            <TableHeader className="text-right">Thu nhập trong bậc</TableHeader>
            <TableHeader className="text-right">Thuế suất</TableHeader>
            <TableHeader className="text-right">Thuế</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {pit.items.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell>{item.label}</TableCell>
              <TableCell className="text-right">{formatVnd(item.slab)}</TableCell>
              <TableCell className="text-right">{(item.rate * 100).toFixed(0)}%</TableCell>
              <TableCell className="text-right">{formatVnd(item.tax)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-semibold">
            <TableCell colSpan={3}>Tổng thuế TNCN</TableCell>
            <TableCell className="text-right">{formatVnd(pit.total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )}
</div>
```

**Testing**:
- Render with taxable ≤ 0 (show zero tax message)
- Render with 1 bracket hit
- Render with multiple brackets hit
- Render with highest bracket (threshold = "inf")
- Verify progressive calculation correct
- Test responsive table on mobile

---

## Comparison Components

### 12. ComparisonView

**Purpose**: Side-by-side comparison of 2025 vs 2026 regimes.

**Props**:
```typescript
interface ComparisonViewProps {
  comparison: ComparisonResult;
}
```

**Structure**:
```tsx
<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>So Sánh: 2025 vs 2026</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid md:grid-cols-2 gap-4">
        <ResultDisplay
          result={comparison.result2025}
          title="Luật hiện hành (2025)"
        />
        <ResultDisplay
          result={comparison.result2026}
          title="Luật mới (2026)"
        />
      </div>

      <DeltasSummary deltas={comparison.deltas} />
    </CardContent>
  </Card>
</div>
```

**Children**:
- Two `<ResultDisplay />` components (side by side)
- `<DeltasSummary />` (delta highlights)

**Testing**:
- Render with valid comparison data
- Verify both results displayed correctly
- Test responsive layout (stacked on mobile, side-by-side on desktop)

---

### 13. DeltasSummary

**Purpose**: Highlight key differences between 2025 and 2026 regimes.

**Props**:
```typescript
interface DeltasSummaryProps {
  deltas: {
    personalDeduction: number;
    dependentDeduction: number;
    totalDeductions: number;
    taxableIncome: number;
    totalPIT: number;
    netSalary: number;
  };
}
```

**Markup**:
```tsx
<div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
  <h3 className="text-lg font-semibold">Chênh Lệch (2026 so với 2025)</h3>

  <div className="grid md:grid-cols-2 gap-3 text-sm">
    <DeltaItem
      label="Giảm trừ bản thân"
      delta={deltas.personalDeduction}
    />
    <DeltaItem
      label="Giảm trừ người phụ thuộc"
      delta={deltas.dependentDeduction}
    />
    <DeltaItem
      label="Tổng giảm trừ"
      delta={deltas.totalDeductions}
    />
    <DeltaItem
      label="Thu nhập tính thuế"
      delta={deltas.taxableIncome}
      inverted
    />
    <DeltaItem
      label="Thuế TNCN"
      delta={deltas.totalPIT}
      inverted
    />
  </div>

  <div className="pt-4 border-t">
    <DeltaItem
      label="Lương NET"
      delta={deltas.netSalary}
      large
    />
  </div>
</div>
```

**Testing**:
- Render with positive deltas (2026 better)
- Render with negative deltas (2025 better)
- Render with zero deltas (no change)
- Verify "inverted" logic (negative PIT delta is good)

---

### 14. DeltaItem

**Purpose**: Display a single delta value with color coding (green = positive, red = negative).

**Props**:
```typescript
interface DeltaItemProps {
  label: string;
  delta: number;
  inverted?: boolean;  // If true, negative = good (e.g., lower tax)
  large?: boolean;     // Hero size for net salary delta
}
```

**Markup**:
```tsx
<div className={cn("flex justify-between", large && "text-xl font-bold")}>
  <span>{label}</span>
  <span className={cn(
    delta > 0 && !inverted && "text-green-600",
    delta > 0 && inverted && "text-red-600",
    delta < 0 && !inverted && "text-red-600",
    delta < 0 && inverted && "text-green-600",
    delta === 0 && "text-muted-foreground"
  )}>
    {delta > 0 && "+"}
    {formatVnd(delta)}
  </span>
</div>
```

**Testing**:
- Test positive delta without inverted (green)
- Test negative delta without inverted (red)
- Test positive delta with inverted (red)
- Test negative delta with inverted (green)
- Test zero delta (gray)
- Test large prop (bigger font size)

---

## Utility Components

### 15. InfoTooltip

**Purpose**: Information icon with hover tooltip for help text.

**Props**:
```typescript
interface InfoTooltipProps {
  content: string;
}
```

**Markup**:
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted hover:bg-muted/80 transition-colors ml-1"
        aria-label="Thông tin thêm"
      >
        <Info className="w-3 h-3" />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p className="max-w-xs text-sm">{content}</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Testing**:
- Hover over icon and verify tooltip appears
- Test keyboard focus (tab to icon, tooltip shows)
- Test touch devices (tap to show tooltip)
- Verify aria-label for screen readers

---

### 16. EmptyState

**Purpose**: Placeholder message when no results to display.

**Props**:
```typescript
interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}
```

**Default Props**:
```typescript
{
  icon: <Calculator className="w-12 h-12 text-muted-foreground" />
}
```

**Markup**:
```tsx
<div className="flex flex-col items-center justify-center p-12 text-center">
  {icon}
  <p className="mt-4 text-muted-foreground">{message}</p>
</div>
```

**Testing**:
- Render with default icon
- Render with custom icon
- Verify message displayed correctly

---

## Layout Components

### 17. Header

**Purpose**: Page header with title, view mode toggle, and locale selector.

**Props**: None (uses Zustand store)

**State**:
```typescript
const { viewMode, setViewMode, locale, setLocale } = usePreferencesStore();
```

**Markup**:
```tsx
<header className="border-b">
  <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    <h1 className="text-2xl font-bold">
      Máy Tính Lương Gross-Net
    </h1>

    <div className="flex items-center gap-4">
      <ViewModeToggle value={viewMode} onChange={setViewMode} />
      <LocaleSelector value={locale} onChange={setLocale} />
    </div>
  </div>
</header>
```

**Testing**:
- Toggle view mode and verify store updated
- Switch locale and verify store updated
- Test responsive layout (stack on mobile)

---

### 18. ViewModeToggle

**Purpose**: Button group to switch between "single" and "compare" views.

**Props**:
```typescript
interface ViewModeToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}
```

**Markup**:
```tsx
<div className="inline-flex rounded-md shadow-sm" role="group">
  <Button
    variant={value === "single" ? "default" : "outline"}
    onClick={() => onChange("single")}
    className="rounded-r-none"
  >
    Đơn
  </Button>
  <Button
    variant={value === "compare" ? "default" : "outline"}
    onClick={() => onChange("compare")}
    className="rounded-l-none"
  >
    So sánh
  </Button>
</div>
```

**Testing**:
- Click "Đơn" and verify onChange called with "single"
- Click "So sánh" and verify onChange called with "compare"
- Verify active button has correct variant
- Test keyboard navigation (arrow keys to switch)

---

### 19. LocaleSelector

**Purpose**: Dropdown to switch between Vietnamese and English number formats.

**Props**:
```typescript
interface LocaleSelectorProps {
  value: "en-US" | "vi-VN";
  onChange: (locale: "en-US" | "vi-VN") => void;
}
```

**Options**:
```typescript
const LOCALE_OPTIONS = [
  { value: "vi-VN", label: "Định dạng VN (30.000.000)" },
  { value: "en-US", label: "Định dạng US (30,000,000)" }
];
```

**Markup**:
```tsx
<Select value={value} onValueChange={onChange}>
  <SelectTrigger className="w-[200px]">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {LOCALE_OPTIONS.map(opt => (
      <SelectItem key={opt.value} value={opt.value}>
        {opt.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Testing**:
- Switch to vi-VN and verify all numbers reformatted
- Switch to en-US and verify all numbers reformatted
- Verify Zustand store updated

---

### 20. Footer

**Purpose**: Page footer with copyright, disclaimer, and links.

**Props**: None

**Markup**:
```tsx
<footer className="border-t mt-12">
  <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
    <p>
      © 2025 Máy Tính Lương Gross-Net.
      Công cụ tham khảo, không thay thế tư vấn chuyên môn.
    </p>
    <p className="mt-2">
      <a href="/about" className="hover:underline">Giới thiệu</a>
      {" • "}
      <a href="/privacy" className="hover:underline">Chính sách bảo mật</a>
      {" • "}
      <a href="https://github.com/user/repo" className="hover:underline">Mã nguồn</a>
    </p>
  </div>
</footer>
```

**Testing**:
- Verify all links navigable
- Test responsive layout

---

## Component Tree

```
<SalaryCalculator>
  ├─ <Header>
  │   ├─ <ViewModeToggle>
  │   └─ <LocaleSelector>
  │
  ├─ <CalculatorInputs>
  │   ├─ <GrossSalaryInput>
  │   ├─ <DependentsInput>
  │   │   └─ <InfoTooltip>
  │   ├─ <RegionSelector>
  │   └─ <InsuranceBaseInput>
  │       ├─ <InfoTooltip>
  │       └─ <GrossSalaryInput> (conditional)
  │
  ├─ {viewMode === "single" ? (
  │   <ResultDisplay>
  │     ├─ <NetSalaryHighlight>
  │     ├─ <InsuranceBreakdown>
  │     ├─ <DeductionsBreakdown>
  │     └─ <PITBreakdown>
  │   </ResultDisplay>
  │ ) : (
  │   <ComparisonView>
  │     ├─ <ResultDisplay> (2025)
  │     ├─ <ResultDisplay> (2026)
  │     └─ <DeltasSummary>
  │         └─ <DeltaItem>[]
  │   </ComparisonView>
  │ )}
  │
  └─ <Footer>
```

---

## Testing Strategy

### Component Tests (tests/components/)
- Render tests (no crashes)
- Props tests (verify correct data passed)
- Interaction tests (clicks, inputs, keyboard)
- Accessibility tests (ARIA labels, keyboard navigation)
- Snapshot tests (visual regression)

### Integration Tests (tests/integration/)
- Full calculation flow (input → result)
- View mode switching (single ↔ compare)
- URL state persistence (share link → restore state)

### Coverage Target
- ≥80% line coverage for all components
- 100% coverage for critical user flows (input → calculate → view result)

---

## Accessibility Requirements

All components must satisfy:
- **WCAG 2.1 Level AA** compliance
- Keyboard navigable (tab order, enter/space to activate)
- Screen reader friendly (ARIA labels, roles, live regions)
- Sufficient color contrast (4.5:1 for text, 3:1 for UI elements)
- Focus indicators visible (2px outline)
- Error messages linked to inputs (aria-describedby)

---

## Next Steps

With component contracts defined:
1. Implement components in `src/components/` (following atomic design: atoms → molecules → organisms)
2. Write component tests in `tests/components/` (Testing Library)
3. Integrate with calculation functions from `src/lib/tax.ts`
4. Build storybook stories for visual testing (optional but recommended)
