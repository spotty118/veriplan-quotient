import { Suspense, lazy } from 'react';
import './App.css';
import { AppSidebar } from './components/AppSidebar';
import { Card, CardContent } from './components/ui/card';
import { ErrorBoundary } from './components/ui/error-boundary';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Regular imports instead of lazy loading for main components
import { QuoteCalculator } from './components/QuoteCalculator';
import { BillAnalyzer } from './components/BillAnalyzer';
import { CommissionCalculator } from './components/CommissionCalculator';
import { PromotionsOverview } from './components/PromotionsOverview';

// Lazy load admin components only
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const LoadingFallback = () => (
  <Card>
    <CardContent className="p-6">
      <div>Loading...</div>
    </CardContent>
  </Card>
);

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <AppSidebar />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <Suspense fallback={<LoadingFallback />}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <section className="grid gap-6">
      <QuoteCalculator />
      <BillAnalyzer />
      <CommissionCalculator />
      <PromotionsOverview />
    </section>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <ErrorBoundary>
        <Router basename="/">
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
            <Route
              path="/quotes"
              element={
                <MainLayout>
                  <QuoteCalculator />
                </MainLayout>
              }
            />
            <Route
              path="/commissions"
              element={
                <MainLayout>
                  <CommissionCalculator />
                </MainLayout>
              }
            />
            <Route
              path="/promotions"
              element={
                <MainLayout>
                  <PromotionsOverview />
                </MainLayout>
              }
            />
            <Route 
              path="/admin-login" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminLogin />
                </Suspense>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </div>
  );
}

export default App;
