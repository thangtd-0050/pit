# Quickstart Guide

**Feature**: 001-gross-net-calculator
**Created**: 2025-11-05
**Last Updated**: 2025-11-05

## Overview

This quickstart guide will help you set up and run the Vietnam Gross-to-Net Salary Calculator on your local machine in **under 5 minutes**.

---

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed ([download](https://nodejs.org/))
   ```bash
   node --version  # Should be ≥18.0.0
   ```

2. **pnpm 8+** installed (faster than npm/yarn)
   ```bash
   npm install -g pnpm@latest
   pnpm --version  # Should be ≥8.0.0
   ```

3. **Git** installed ([download](https://git-scm.com/))
   ```bash
   git --version
   ```

4. **A code editor** (VS Code recommended with extensions: ESLint, Prettier, Tailwind CSS IntelliSense)

---

## Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
# Clone the repo
git clone https://github.com/your-username/pit.git
cd pit

# Checkout the feature branch
git checkout 001-gross-net-calculator
```

### 2. Install Dependencies

```bash
# Install all packages (pnpm is faster than npm)
pnpm install
```

This will install:
- React 18.2+
- TypeScript 5.3+
- Vite 5.0+
- Tailwind CSS 3.4+
- shadcn/ui components
- Zustand 4.4+
- Vitest 1.0+
- Testing Library
- ESLint + Prettier

**Expected output**: `✓ Dependencies installed` (~30 seconds)

### 3. Run the Development Server

```bash
pnpm dev
```

**Expected output**:
```
VITE v5.0.x  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

**Open your browser** at `http://localhost:5173/` — you should see the salary calculator!

---

## Development Scripts

All scripts are defined in `package.json`. Use `pnpm <script>` to run:

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `pnpm dev` | Start development server (with HMR) |
| **build** | `pnpm build` | Build for production (outputs to `dist/`) |
| **preview** | `pnpm preview` | Preview production build locally |
| **test** | `pnpm test` | Run all tests (Vitest) |
| **test:ui** | `pnpm test:ui` | Run tests with UI (browser-based) |
| **test:coverage** | `pnpm test:coverage` | Generate coverage report (target ≥80%) |
| **lint** | `pnpm lint` | Lint code (ESLint) |
| **lint:fix** | `pnpm lint:fix` | Lint and auto-fix issues |
| **format** | `pnpm format` | Format code (Prettier) |
| **format:check** | `pnpm format:check` | Check formatting without modifying files |
| **type-check** | `pnpm type-check` | Type check without emitting (tsc) |

### Common Development Workflows

**Quick check before committing**:
```bash
pnpm lint:fix && pnpm format && pnpm type-check && pnpm test
```

**Watch mode for TDD**:
```bash
pnpm test --watch
```

**Check bundle size**:
```bash
pnpm build
# Check dist/ size (should be <200KB gzipped)
```

---

## Project Structure

```
pit/
├── .specify/                      # Specification framework (PIT)
│   ├── memory/
│   │   └── constitution.md        # Project governance (7 principles)
│   └── scripts/
│       └── bash/
│           └── update-agent-context.sh  # Update AI agent context
│
├── specs/                         # Feature specifications
│   └── 001-gross-net-calculator/
│       ├── spec.md                # Feature requirements (WHAT)
│       ├── plan.md                # Implementation plan (HOW)
│       ├── research.md            # Technology decisions (WHY)
│       ├── data-model.md          # TypeScript interfaces
│       ├── contracts/             # API contracts
│       │   ├── calculation-api.md # Pure function interfaces
│       │   └── component-api.md   # React component props
│       ├── checklists/
│       │   └── requirements.md    # Quality validation
│       └── quickstart.md          # This file!
│
├── src/                           # Application source code
│   ├── main.tsx                   # Entry point (renders <App />)
│   ├── App.tsx                    # Root component
│   │
│   ├── components/                # React components
│   │   ├── SalaryCalculator.tsx   # Main calculator container
│   │   ├── CalculatorInputs.tsx   # Input form
│   │   ├── ResultDisplay.tsx      # Single result view
│   │   ├── ComparisonView.tsx     # 2025 vs 2026 comparison
│   │   └── ui/                    # shadcn/ui components (Button, Card, etc.)
│   │
│   ├── lib/                       # Business logic (pure functions)
│   │   ├── tax.ts                 # Core calculation functions
│   │   ├── format.ts              # Number formatting
│   │   ├── url-state.ts           # URL encoding/decoding
│   │   └── utils.ts               # General utilities (cn, etc.)
│   │
│   ├── config/                    # Configuration
│   │   └── constants.ts           # Regional minimums, regimes, base salary
│   │
│   ├── types/                     # TypeScript types
│   │   └── index.ts               # All interfaces (CalculatorInputs, etc.)
│   │
│   ├── store/                     # Zustand stores
│   │   └── preferences.ts         # UI preferences (viewMode, locale)
│   │
│   └── styles/                    # Styles
│       └── index.css              # Tailwind directives + custom CSS
│
├── tests/                         # Test suites
│   ├── unit/                      # Pure function tests
│   │   ├── tax.test.ts
│   │   ├── format.test.ts
│   │   └── url-state.test.ts
│   │
│   ├── components/                # Component tests
│   │   ├── SalaryCalculator.test.tsx
│   │   ├── CalculatorInputs.test.tsx
│   │   └── ResultDisplay.test.tsx
│   │
│   └── integration/               # Integration tests
│       └── calculation-flow.test.tsx
│
├── public/                        # Static assets
│   └── favicon.ico                # Favicon
│
├── dist/                          # Build output (generated by `pnpm build`)
│
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── postcss.config.cjs             # PostCSS configuration
├── .eslintrc.cjs                  # ESLint configuration
├── .prettierrc                    # Prettier configuration
├── vitest.config.ts               # Vitest configuration
└── README.md                      # Project README

```

---

## Key Files Explained

### **src/main.tsx** (Entry Point)
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### **src/App.tsx** (Root Component)
```tsx
import { Header } from './components/Header';
import { SalaryCalculator } from './components/SalaryCalculator';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SalaryCalculator />
      </main>
      <Footer />
    </div>
  );
}
```

### **src/lib/tax.ts** (Core Calculation Logic)
Pure functions for:
- `clamp()` — Bound a value between min/max
- `calcInsuranceBases()` — Calculate clamped insurance bases
- `calcInsurance()` — Calculate SI/HI/UI contributions
- `calcPit()` — Progressive PIT calculation
- `calcAll()` — Master calculation function
- `compareRegimes()` — 2025 vs 2026 comparison

### **src/config/constants.ts** (Legal Constants)
```typescript
export const BASE_SALARY = 2_340_000;

export const REGIONAL_MINIMUMS: Record<RegionId, number> = {
  I: 4_960_000,
  II: 4_410_000,
  III: 3_860_000,
  IV: 3_450_000
};

export const REGIME_2025: Regime = {
  year: 2025,
  personalDeduction: 11_000_000,
  dependentDeduction: 4_400_000,
  brackets: [
    { threshold: 5_000_000, rate: 0.05 },
    { threshold: 10_000_000, rate: 0.10 },
    // ... more brackets
  ]
};

export const REGIME_2026: Regime = {
  year: 2026,
  personalDeduction: 13_000_000,
  dependentDeduction: 5_200_000,
  brackets: [
    { threshold: 10_000_000, rate: 0.05 },
    { threshold: 30_000_000, rate: 0.10 },
    // ... more brackets
  ]
};
```

---

## Development Workflow

### 1. **Feature Development (TDD Approach)**

Follow Test-Driven Development:

1. **Write a failing test**:
   ```bash
   # Create test file
   touch tests/unit/tax.test.ts
   ```

   ```typescript
   // tests/unit/tax.test.ts
   import { describe, it, expect } from 'vitest';
   import { clamp } from '@/lib/tax';

   describe('clamp', () => {
     it('should clamp value within bounds', () => {
       expect(clamp(30_000_000, 4_960_000, 46_800_000)).toBe(30_000_000);
     });
   });
   ```

2. **Run test (should fail)**:
   ```bash
   pnpm test
   ```

3. **Implement the function**:
   ```typescript
   // src/lib/tax.ts
   export function clamp(value: number, min: number, max: number): number {
     return Math.max(min, Math.min(value, max));
   }
   ```

4. **Run test again (should pass)**:
   ```bash
   pnpm test
   ```

5. **Refactor if needed** (optimize, clean up, add comments)

6. **Repeat** for all functions in `src/lib/tax.ts`

### 2. **Component Development**

After functions are tested:

1. **Create component file**:
   ```bash
   touch src/components/GrossSalaryInput.tsx
   ```

2. **Implement component** (referencing `contracts/component-api.md`)

3. **Write component test**:
   ```bash
   touch tests/components/GrossSalaryInput.test.tsx
   ```

   ```typescript
   import { render, screen } from '@testing-library/react';
   import { GrossSalaryInput } from '@/components/GrossSalaryInput';

   test('renders with default label', () => {
     render(<GrossSalaryInput value={30_000_000} onChange={() => {}} />);
     expect(screen.getByLabelText(/Lương Gross/i)).toBeInTheDocument();
   });
   ```

4. **Run tests**:
   ```bash
   pnpm test
   ```

### 3. **Integration Testing**

Test complete user flows:

```typescript
// tests/integration/calculation-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SalaryCalculator } from '@/components/SalaryCalculator';

test('calculates net salary correctly', async () => {
  render(<SalaryCalculator />);

  // Enter gross salary
  const grossInput = screen.getByLabelText(/Lương Gross/i);
  await userEvent.clear(grossInput);
  await userEvent.type(grossInput, '30000000');

  // Select region
  const regionSelect = screen.getByLabelText(/Vùng Lương/i);
  await userEvent.selectOptions(regionSelect, 'I');

  // Enter dependents
  const depsInput = screen.getByLabelText(/Người Phụ Thuộc/i);
  await userEvent.clear(depsInput);
  await userEvent.type(depsInput, '2');

  // Verify net salary displayed
  await waitFor(() => {
    expect(screen.getByText(/25,215,000/i)).toBeInTheDocument();
  });
});
```

### 4. **Pre-Commit Checklist**

Before committing, always run:

```bash
# 1. Lint and format
pnpm lint:fix && pnpm format

# 2. Type check
pnpm type-check

# 3. Run all tests
pnpm test

# 4. Check test coverage
pnpm test:coverage
# → Verify ≥80% coverage

# 5. Build (check for errors)
pnpm build
# → Verify no TypeScript errors
# → Check dist/ size (<200KB gzipped)
```

If all pass, you're good to commit!

---

## Common Issues & Solutions

### Issue 1: Port 5173 already in use

**Error**:
```
Error: Port 5173 is already in use
```

**Solution**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
pnpm dev --port 3000
```

---

### Issue 2: TypeScript errors in tests

**Error**:
```
Cannot find module '@/lib/tax' or its corresponding type declarations
```

**Solution**:
Check `tsconfig.json` has path alias:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Also check `vite.config.ts`:
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

---

### Issue 3: Tailwind CSS not working

**Error**: Styles not applied

**Solution**:
Ensure `src/styles/index.css` has Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

And it's imported in `src/main.tsx`:
```typescript
import './styles/index.css';
```

---

### Issue 4: Test coverage below 80%

**Error**: Coverage gate failed

**Solution**:
Identify untested code:
```bash
pnpm test:coverage
```

Check the HTML report:
```bash
open coverage/index.html
```

Write tests for red (uncovered) lines.

---

## Performance Optimization

### Bundle Size Target: <200KB Gzipped

Check bundle size after build:
```bash
pnpm build

# Analyze bundle
pnpm vite-bundle-visualizer
```

**Optimization strategies**:
1. **Code splitting**: Lazy load comparison view
   ```typescript
   const ComparisonView = lazy(() => import('./components/ComparisonView'));
   ```

2. **Tree-shaking**: Import only what you need
   ```typescript
   // Bad
   import * as React from 'react';

   // Good
   import { useState, useEffect } from 'react';
   ```

3. **Minification**: Already handled by Vite in production

---

## Deployment

Deploy to GitHub Pages:

```bash
# 1. Build
pnpm build

# 2. Deploy (via GitHub Actions)
# Automatically triggered on push to main branch

# Or manually deploy
pnpm gh-pages -d dist
```

**GitHub Actions workflow** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Live URL**: `https://your-username.github.io/pit/`

---

## Debugging Tips

### Use React DevTools
Install [React Developer Tools](https://react.dev/learn/react-developer-tools) browser extension to inspect component state.

### Use Vite DevTools
Press `h` in terminal (while `pnpm dev` is running) to see helpful shortcuts:
- `r` → restart server
- `u` → show server URL
- `o` → open in browser
- `c` → clear console
- `q` → quit

### Debugging Tests
Run Vitest UI for visual debugging:
```bash
pnpm test:ui
```

Or use VS Code debugger:
1. Set breakpoint in test file
2. Press F5
3. Select "Vitest" configuration

---

## Next Steps

Now that you're set up, follow this learning path:

1. **Read the specifications**:
   - `specs/001-gross-net-calculator/spec.md` (WHAT to build)
   - `specs/001-gross-net-calculator/plan.md` (HOW to build)
   - `specs/001-gross-net-calculator/research.md` (WHY these technologies)

2. **Understand the data model**:
   - `specs/001-gross-net-calculator/data-model.md` (All TypeScript interfaces)

3. **Study the contracts**:
   - `specs/001-gross-net-calculator/contracts/calculation-api.md` (Pure functions)
   - `specs/001-gross-net-calculator/contracts/component-api.md` (React components)

4. **Start coding**:
   - Begin with `src/lib/tax.ts` (TDD approach)
   - Then build components in `src/components/`
   - Follow the Constitution principles (`.specify/memory/constitution.md`)

5. **Test thoroughly**:
   - Write unit tests for all functions
   - Write component tests for all UI
   - Write integration tests for user flows
   - Aim for ≥80% coverage

6. **Deploy**:
   - Push to GitHub
   - GitHub Actions will auto-deploy to GitHub Pages
   - Share the live link!

---

## Resources

### Documentation
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/react)

### Vietnam Tax Laws
- [Circular 111/2013/TT-BTC](https://thuvienphapluat.vn/van-ban/Thue-Phi-Le-Phi/Circular-111-2013-TT-BTC-on-personal-income-tax-210124.aspx) (PIT Law 2013)
- [Draft 2026 Tax Reform](https://example.com/2026-tax-reform) (Proposed changes)
- [Regional Minimum Wages](https://thuvienphapluat.vn/van-ban/Lao-dong-Tien-luong/Decree-38-2022-ND-CP-regional-minimum-wage-2023-510058.aspx)

### Community
- [GitHub Issues](https://github.com/your-username/pit/issues) — Report bugs or request features
- [Discussions](https://github.com/your-username/pit/discussions) — Ask questions

---

## Support

Need help? Here's what to do:

1. **Check this guide first** — Most common issues covered above
2. **Read error messages carefully** — They often contain solutions
3. **Search GitHub Issues** — Someone may have encountered the same problem
4. **Ask in Discussions** — Community can help
5. **Open an Issue** — If you found a bug or need a feature

---

**Happy coding!** 🚀

Remember the Constitution principles:
- ✅ Code Quality Excellence (TypeScript strict mode, pure functions)
- ✅ Testing-First Discipline (TDD, ≥80% coverage)
- ✅ Modern UI/UX Consistency (shadcn/ui, responsive, accessible)
- ✅ Performance-By-Design (<200KB bundle, <1.5s FCP)
- ✅ Security & Privacy (client-side only, no tracking)
- ✅ Maintainability (clean code, documentation)
- ✅ Documentation & Knowledge Sharing (this guide!)
