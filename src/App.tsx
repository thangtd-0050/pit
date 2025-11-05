import { SalaryCalculator } from '@/components/SalaryCalculator';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">
            Tính Lương NET từ Gross
          </h1>
          <p className="mt-2 text-muted-foreground">
            Công cụ tính lương thực nhận theo quy định Việt Nam
          </p>
        </header>

        <main>
          <SalaryCalculator />
        </main>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2025 Vietnam Salary Calculator. Dành cho mục đích tham khảo.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
