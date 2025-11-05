import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { SalaryCalculator } from '@/components/SalaryCalculator';
import { Footer } from '@/components/Footer';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Header />

            <main className="mt-8">
              <ErrorBoundary>
                <SalaryCalculator />
              </ErrorBoundary>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
