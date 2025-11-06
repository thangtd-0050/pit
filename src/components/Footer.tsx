/**
 * Footer component with disclaimer, copyright, and links.
 * Provides legal disclaimer and attribution information.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const lastUpdated = '2025-11-05';

  return (
    <footer className="mt-16 border-t bg-muted/50 py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-6 text-center text-sm text-muted-foreground">
          {/* Disclaimer */}
          <div className="space-y-2">
            <p className="font-medium">⚠️ Lưu ý quan trọng</p>
            <p className="max-w-3xl mx-auto">
              Công cụ này chỉ mang tính chất tham khảo. Kết quả tính toán có thể khác biệt với thực
              tế do nhiều yếu tố như: chính sách công ty, khu vực đặc thù, các khoản giảm trừ bổ
              sung, v.v. Vui lòng tham khảo với bộ phận nhân sự hoặc kế toán của công ty để có thông
              tin chính xác nhất.
            </p>
          </div>

          {/* Copyright and links */}
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <p>© {currentYear} Công cụ Tính Lương NET</p>
            <span className="hidden sm:inline">•</span>
            <p>Cập nhật: {lastUpdated}</p>
            <span className="hidden sm:inline">•</span>
            <a
              href="https://github.com/thangtd-0050/pit"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Credits */}
          <div className="flex flex-col items-center gap-2 text-xs sm:flex-row sm:justify-center sm:gap-3">
            <span>
              Idea by{' '}
              <a
                href="https://www.facebook.com/thangtd90"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground underline transition-colors"
              >
                ThangTD
              </a>
            </span>
            <span className="hidden sm:inline">·</span>
            <span>Spec'd with GitHub SpecKit</span>
            <span className="hidden sm:inline">·</span>
            <span>Coded by GitHub Copilot</span>
            <span className="hidden sm:inline">·</span>
            <span>Hosted on GitHub Pages</span>
          </div>

          {/* Source information */}
          <p className="text-xs">
            Dựa trên quy định thuế TNCN và bảo hiểm xã hội Việt Nam năm 2025-2026
          </p>
        </div>
      </div>
    </footer>
  );
}
