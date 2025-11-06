# Feature Specification: Union Dues Calculation

**Feature Branch**: `004-union-dues`
**Created**: November 6, 2025
**Status**: Draft
**Input**: User description: "Bổ sung lựa chọn tính Đoàn phí Công đoàn cho người lao động là đoàn viên công đoàn"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enable Union Dues Calculation (Priority: P1)

Người lao động là đoàn viên công đoàn muốn tính toán lương thực nhận (NET) sau khi trừ đoàn phí công đoàn, ngoài các khoản thuế TNCN và bảo hiểm bắt buộc đã có.

**Why this priority**: Đây là chức năng cốt lõi của feature - cho phép đoàn viên công đoàn biết chính xác số tiền thực nhận cuối cùng sau khi trừ tất cả các khoản bắt buộc bao gồm cả đoàn phí.

**Independent Test**: Người dùng nhập lương GROSS 30 triệu, chọn checkbox "Đoàn viên công đoàn", hệ thống tính toán và hiển thị khoản đoàn phí (0.5% của cơ sở BHXH, tối đa 10% lương cơ sở) và lương NET cuối cùng sau khi trừ đoàn phí. Có thể test độc lập với các tính năng khác của calculator.

**Acceptance Scenarios**:

1. **Given** người dùng nhập lương GROSS 30,000,000 VND, vùng I, 0 người phụ thuộc, **When** người dùng tích checkbox "Đoàn viên công đoàn", **Then** hệ thống hiển thị khoản đoàn phí được tính (0.5% × cơ sở BHXH = 0.5% × 30,000,000 = 150,000 VND) và lương NET giảm đi 150,000 VND so với khi không tích checkbox
2. **Given** người dùng nhập lương GROSS 185,000,000 VND (vượt trần BHXH), **When** tích checkbox đoàn viên, **Then** đoàn phí vẫn tính trên cơ sở BHXH đã áp trần (58.5 triệu × 0.5% = 292,500 VND) và không vượt quá 10% lương cơ sở (2,340,000 × 10% = 234,000 VND), nên đoàn phí = 234,000 VND
3. **Given** người dùng đã tích checkbox đoàn viên, **When** bỏ tích checkbox, **Then** khoản đoàn phí biến mất khỏi breakdown và lương NET tăng lên tương ứng
4. **Given** người dùng tích checkbox đoàn viên và đã tính toán xong, **When** thay đổi lương GROSS hoặc cơ sở bảo hiểm tùy chỉnh, **Then** đoàn phí được tự động tính lại theo cơ sở BHXH mới

---

### User Story 2 - Display Union Dues Breakdown (Priority: P2)

Người dùng muốn xem chi tiết công thức tính đoàn phí để hiểu rõ khoản tiền này được tính như thế nào.

**Why this priority**: Tính minh bạch và giáo dục người dùng - giúp họ hiểu rõ các khoản chi phí bắt buộc khi là đoàn viên công đoàn.

**Independent Test**: Sau khi tích checkbox đoàn viên và calculator hiển thị kết quả, người dùng có thể xem breakdown chi tiết của đoàn phí bao gồm: cơ sở tính (BHXH base), tỷ lệ 0.5%, kết quả trước khi áp trần, và kết quả cuối cùng sau khi áp mức tối đa 10% lương cơ sở.

**Acceptance Scenarios**:

1. **Given** người dùng đã tích checkbox đoàn viên và có kết quả tính toán, **When** xem phần breakdown, **Then** hiển thị rõ "Đoàn phí công đoàn: [số tiền] VND (0.5% × [cơ sở BHXH] = [kết quả], tối đa [10% lương cơ sở])"
2. **Given** trường hợp đoàn phí chạm trần (lương cao), **When** xem breakdown, **Then** có ghi chú rõ "Đã áp mức tối đa 10% lương cơ sở" để người dùng hiểu tại sao không tính đúng 0.5%

---

### User Story 3 - Compare Union Dues Across Regimes (Priority: P3)

Người dùng muốn so sánh lương NET cuối cùng (đã trừ đoàn phí) giữa chế độ 2025 và 2026 khi ở chế độ Compare.

**Why this priority**: Tính năng bổ sung giúp người dùng thấy được tác động của đoàn phí trong cả hai chế độ thuế song song, nhưng không bắt buộc cho MVP.

**Independent Test**: Người dùng chọn chế độ Compare, tích checkbox đoàn viên, nhập lương GROSS, hệ thống hiển thị đoàn phí và NET cuối cùng cho cả 2025 và 2026. Đoàn phí giống nhau ở cả hai chế độ (vì tính trên cơ sở BHXH, không liên quan đến thuế), chỉ khác nhau ở lương NET do thuế TNCN khác nhau.

**Acceptance Scenarios**:

1. **Given** người dùng ở chế độ Compare, tích checkbox đoàn viên, **When** nhập lương GROSS 50 triệu, **Then** hiển thị comparison table với cột "Đoàn phí công đoàn" có cùng giá trị cho cả 2025 và 2026, và cột "NET cuối cùng" (sau trừ đoàn phí) khác nhau do thuế TNCN khác nhau
2. **Given** chế độ Compare với đoàn phí enabled, **When** hover vào delta giữa 2025 và 2026, **Then** tooltip giải thích rõ "Delta chỉ do chênh lệch thuế TNCN, đoàn phí giống nhau"

---

### Edge Cases

- **Lương quá thấp**: Nếu lương GROSS < lương tối thiểu vùng, đoàn phí vẫn tính trên cơ sở BHXH thực tế (có thể bằng 0 nếu không đóng bảo hiểm)
- **Cơ sở BHXH = 0**: Nếu người dùng tùy chỉnh cơ sở bảo hiểm về 0, đoàn phí = 0
- **Trường hợp trần**: Khi lương GROSS rất cao (≥ 117 triệu), cơ sở BHXH đã áp trần 58.5 triệu, đoàn phí = min(58,500,000 × 0.5%, 2,340,000 × 10%) = min(292,500, 234,000) = 234,000 VND
- **URL state**: Khi share link với checkbox đoàn viên enabled, link phải lưu trạng thái này để người nhận thấy đúng kết quả
- **Responsive**: Checkbox và breakdown đoàn phí phải hiển thị tốt trên mobile

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a checkbox labeled "Đoàn viên công đoàn" (default: unchecked) allowing users to opt-in to union dues calculation
- **FR-002**: System MUST calculate union dues at 0.5% of the social insurance base when checkbox is checked
- **FR-003**: System MUST apply a maximum cap of 10% of the base salary (currently 2,340,000 VND) to union dues calculation
- **FR-004**: System MUST deduct calculated union dues from NET salary (after tax and insurance) to show final take-home pay
- **FR-005**: System MUST NOT include union dues as a tax-deductible item when calculating Personal Income Tax (PIT)
- **FR-006**: System MUST display union dues amount and calculation basis in the breakdown section when checkbox is checked
- **FR-007**: System MUST hide union dues from breakdown when checkbox is unchecked
- **FR-008**: System MUST recalculate union dues automatically when user changes gross salary, region, or custom insurance base
- **FR-009**: System MUST show identical union dues amounts in both 2025 and 2026 columns when in Compare mode (since union dues don't depend on tax regime)
- **FR-010**: System MUST persist checkbox state in URL parameters for sharing and bookmarking
- **FR-011**: System MUST restore checkbox state from URL parameters when loading shared links

### Key Entities

- **Union Dues**: A mandatory deduction for union members, calculated as 0.5% of social insurance base, capped at 10% of legal base salary (currently 234,000 VND max). This amount is subtracted from NET salary after all taxes and insurance to derive final take-home pay. Not a tax deduction.
- **Social Insurance Base**: The salary amount used to calculate social insurance contributions (BHXH, BHYT, BHTN). Can be gross salary or custom amount, subject to legal floor (regional minimum) and ceiling (currently 58,500,000 VND). This same base is used for union dues calculation.
- **Final Take-Home Pay**: NET salary after subtracting Personal Income Tax, social insurance contributions (employee portion), and union dues (if applicable). This is the actual amount deposited to employee's bank account.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can enable/disable union dues calculation with a single click on the checkbox
- **SC-002**: Union dues calculation completes instantly (<10ms) when checkbox is toggled or salary inputs change
- **SC-003**: 100% accuracy in union dues calculation following Vietnamese labor law: 0.5% of insurance base, capped at 234,000 VND (10% of 2,340,000 base salary)
- **SC-004**: Breakdown section clearly displays union dues formula and result when enabled, allowing users to verify calculation manually
- **SC-005**: URL sharing preserves union dues checkbox state with 100% fidelity (shared links show correct checkbox status and calculations)
- **SC-006**: Users can understand the difference between "NET salary before union dues" and "Final take-home pay" through clear labeling in the UI
