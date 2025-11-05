# Vietnam Gross-to-Net Salary Calculator

A modern web application for calculating take-home salary in Vietnam, supporting both current (2024-2025) and future (2026+) tax/insurance regimes.

## Features

- 🧮 **Dual Calculation Modes**: Gross-to-Net and Net-to-Gross
- 📅 **Multi-Regime Support**: 2024-2025 and 2026+ regulations
- 🏢 **Regional Salary Zones**: Accurate regional minimum wage calculations
- 👥 **Flexible Dependents**: Support for 0-10 dependents
- 🎨 **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- 🌙 **Dark Mode**: Automatic theme switching
- 📱 **Responsive Design**: Works on desktop and mobile
- ♿ **Accessible**: WCAG 2.1 compliant components
- 🧪 **Well Tested**: 80%+ code coverage

## Tech Stack

- **Framework**: React 18.2 + TypeScript 5.3 (strict mode)
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4 + shadcn/ui
- **State**: Zustand 4.4
- **UI Components**: Radix UI primitives
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm 10+ (install with `npm install -g pnpm`)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pit
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start development server with HMR
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests in watch mode
- `pnpm test:ui` - Open Vitest UI
- `pnpm test:coverage` - Generate coverage report
- `pnpm lint` - Lint code with ESLint
- `pnpm lint:fix` - Fix linting errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check formatting
- `pnpm type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/        # React components
│   └── ui/           # shadcn/ui components
├── lib/              # Utility functions
├── config/           # Configuration & constants
├── types/            # TypeScript type definitions
├── store/            # Zustand state management
├── styles/           # Global styles & Tailwind
└── test/             # Test utilities & setup
tests/
├── unit/             # Unit tests
└── components/       # Component tests
public/               # Static assets
```

## Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Make Changes**: Edit code with TypeScript strict mode
3. **Run Tests**: `pnpm test` to ensure all tests pass
4. **Lint & Format**: `pnpm lint:fix && pnpm format`
5. **Type Check**: `pnpm type-check`
6. **Commit**: Follow conventional commits
7. **Push**: `git push origin feature/your-feature`

## Testing

Run the full test suite:
```bash
pnpm test:coverage
```

Coverage thresholds:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Building for Production

Build optimized production bundle:
```bash
pnpm build
```

Preview production build:
```bash
pnpm preview
```

## Deployment

The project is configured for GitHub Pages deployment. Push to `main` branch to trigger automatic deployment.

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.
