import { Calculator } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6">
        <Calculator className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">Chưa có kết quả</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Nhập thông tin lương và số người phụ thuộc để xem kết quả tính toán
      </p>
    </div>
  );
}
