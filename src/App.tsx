import { Header } from '@/components/Header';
import { SalaryCalculator } from '@/components/SalaryCalculator';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />

        <main className="mt-8">
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
