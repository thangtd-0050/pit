# 💰 Vietnam Gross-to-Net Salary Calculator

[![Tests](https://img.shields.io/badge/tests-97%20passing-brightgreen)](https://github.com/tran-duc-thang/pit)
[![Coverage](https://img.shields.io/badge/coverage-76%25-yellow)](https://github.com/tran-duc-thang/pit)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Công cụ tính lương NET từ lương GROSS theo quy định thuế TNCN và bảo hiểm xã hội Việt Nam 2025-2026.

**Live Demo**: [https://tran-duc-thang.github.io/pit](https://tran-duc-thang.github.io/pit)

## ✨ Tính Năng

### 🧮 Tính Toán Chính Xác
- **Chế độ 2025**: Áp dụng quy định hiện hành (giảm trừ bản thân 11M, người phụ thuộc 4.4M)
- **Chế độ 2026**: Áp dụng quy định mới (giảm trừ bản thân 13M, người phụ thuộc 5.2M)
- **So Sánh Trực Quan**: Xem sự khác biệt giữa 2 chế độ thuế ngay lập tức

### 🏢 Tùy Chỉnh Linh Hoạt
- **4 Vùng Lương Tối Thiểu**: Tự động điều chỉnh theo vùng I, II, III, IV
- **Cơ Sở Đóng Bảo Hiểm**: Chọn theo Gross hoặc tùy chỉnh (tự động áp dụng trần/sàn)
- **Số Người Phụ Thuộc**: 0-20 người (hỗ trợ các trường hợp đặc biệt)
- **Preset Lương**: Chọn nhanh 10M, 30M, 60M, 100M, 185M

### 🎨 Trải Nghiệm Người Dùng
- **Giao Diện Tiếng Việt**: 100% nội dung bằng tiếng Việt
- **Dark Mode**: Chuyển đổi theme sáng/tối
- **Responsive**: Hoạt động tốt trên mobile, tablet, desktop
- **Chia Sẻ Kết Quả**: URL chứa tất cả thông tin để chia sẻ dễ dàng
- **PWA Ready**: Cài đặt như app native (manifest.json)

### ⌨️ Accessibility
- **Keyboard Navigation**: Điều hướng hoàn toàn bằng bàn phím
  - `Enter`: Xác nhận nhập liệu
  - `Escape`: Xóa/Reset
  - `↑/↓`: Điều chỉnh giá trị
  - `1/2/3`: Chuyển chế độ xem nhanh
- **Screen Reader**: ARIA labels đầy đủ
- **Focus Indicators**: WCAG 2.1 AA compliant

### 🧪 Chất Lượng Code
- **97 Tests Passing**: Unit tests + component tests
- **76% Coverage**: Đặc biệt 100% cho logic tính thuế
- **TypeScript Strict**: Type safety tuyệt đối
- **ESLint + Prettier**: Code quality standards

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

## 📊 Phương Pháp Tính

### Công Thức Tổng Quát

```
NET = GROSS - BHXH - BHYT - BHTN - Thuế TNCN
```

### Chi Tiết Từng Bước

1. **Tính Cơ Sở Đóng Bảo Hiểm**
   - Cơ sở đóng BHXH/BHYT: `clamp(gross, lương_tối_thiểu_vùng, 20 × 2.34M)`
   - Cơ sở đóng BHTN: `clamp(gross, lương_tối_thiểu_vùng, 20 × lương_tối_thiểu_vùng)`

2. **Tính Bảo Hiểm**
   - BHXH (8%): `cơ_sở_BHXH × 0.08`
   - BHYT (1.5%): `cơ_sở_BHYT × 0.015`
   - BHTN (1%): `cơ_sở_BHTN × 0.01`

3. **Tính Thu Nhập Chịu Thuế**
   ```
   Thu nhập chịu thuế = GROSS - Giảm trừ bản thân - Giảm trừ người phụ thuộc - Tổng bảo hiểm
   ```
   - Giảm trừ bản thân 2025: 11M/tháng | 2026: 15.5M/tháng
   - Giảm trừ mỗi người phụ thuộc 2025: 4.4M/tháng | 2026: 6.2M/tháng

4. **Tính Thuế TNCN** (Progressive Tax)
   - Áp dụng thuế lũy tiến từng phần theo 7 bậc
   - Ví dụ với thu nhập chịu thuế 50M:
     - 0-5M: 5% = 250K
     - 5M-10M: 10% = 500K
     - 10M-18M: 15% = 1.2M
     - 18M-32M: 20% = 2.8M
     - 32M-52M: 25% (chỉ tính 18M) = 4.5M
     - **Tổng thuế**: 9.25M

### Bậc Thuế TNCN

**Chế độ 2025** (7 bậc):

| Bậc | Thu nhập chịu thuế (VND/tháng) | Thuế suất |
|-----|-------------------------------|-----------|
| 1   | ≤ 5,000,000                   | 5%        |
| 2   | 5,000,001 - 10,000,000        | 10%       |
| 3   | 10,000,001 - 18,000,000       | 15%       |
| 4   | 18,000,001 - 32,000,000       | 20%       |
| 5   | 32,000,001 - 52,000,000       | 25%       |
| 6   | 52,000,001 - 80,000,000       | 30%       |
| 7   | > 80,000,000                  | 35%       |

**Chế độ 2026** (5 bậc):

| Bậc | Thu nhập chịu thuế (VND/tháng) | Thuế suất |
|-----|-------------------------------|-----------|
| 1   | ≤ 10,000,000                  | 5%        |
| 2   | 10,000,001 - 30,000,000       | 15%       |
| 3   | 30,000,001 - 60,000,000       | 25%       |
| 4   | 60,000,001 - 100,000,000      | 30%       |
| 5   | > 100,000,000                 | 35%       |

## ⚠️ Disclaimer

- Công cụ này chỉ mang tính chất **tham khảo**, không thay thế tư vấn pháp lý chuyên nghiệp
- Kết quả có thể khác với bảng lương thực tế do các yếu tố: thưởng, phụ cấp, OT, các khoản miễn thuế
- Luôn xác nhận với phòng nhân sự/kế toán công ty về con số chính xác
- Quy định thuế và bảo hiểm có thể thay đổi, vui lòng kiểm tra thông tin mới nhất

## 🛠️ Development

### Testing

Run the full test suite:
```bash
pnpm test:coverage
```

Coverage report:
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
