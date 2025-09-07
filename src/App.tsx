import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext';
import { CollegeProvider } from './context/CollegeContext';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('./components/LandingPage'));
const StudentDashboard = React.lazy(() => import('./components/StudentDashboard'));
const AdminPortal = React.lazy(() => import('./components/AdminPortal'));
const EventDetails = React.lazy(() => import('./components/EventDetails'));
const EventTicket = React.lazy(() => import('./components/EventTicket'));
const StudentInsights = React.lazy(() => import('./components/StudentInsights'));
const Leaderboard = React.lazy(() => import('./components/Leaderboard'));
const ReportsDashboard = React.lazy(() => import('./components/ReportsDashboard'));
const TestPage = React.lazy(() => import('./components/TestPage'));

// Error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
            <p className="text-red-700 mb-4">Please refresh the page or try again later.</p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <LoadingFallback />;
  }

  if (!user || !user.email?.endsWith('@admin.com')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user, loading, initialized, error } = useAuthContext();
  const [showError, setShowError] = useState(false);

  // Show error message for 5 seconds
  useEffect(() => {
    if (error) {
      console.error('Auth Error:', error);
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Show loading spinner only during initial load
  if (!initialized) {
    return <LoadingFallback />;
  }

  // Error banner component
  const ErrorBanner = () => (
    <div className="fixed top-4 right-4 max-w-md bg-red-100 border-l-4 border-red-500 text-red-700 p-4 z-50 rounded shadow-lg" role="alert">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">Error</p>
          <p>{error?.toString() || 'An unknown error occurred'}</p>
        </div>
        <button 
          onClick={() => setShowError(false)}
          className="ml-4 text-red-700 hover:text-red-900"
          aria-label="Close error"
        >
          &times;
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <CollegeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Debug banner - can be removed in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-2 bg-yellow-100 text-yellow-800 text-sm flex justify-between items-center">
                <div>
                  <span className="font-medium">Debug:</span> 
                  User: {user ? 'Logged In' : 'Not Logged In'} | 
                  <a href="/test" className="ml-2 text-blue-600 hover:underline">Test Page</a>
                </div>
              </div>
            )}
            
            {/* Error banner */}
            {showError && <ErrorBanner />}
            
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/test" element={<TestPage />} />
                
                {/* Protected routes */}
                <Route path="/student" element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminPortal />
                  </AdminRoute>
                } />
                
                <Route path="/event/:id" element={
                  <ProtectedRoute>
                    <EventDetails />
                  </ProtectedRoute>
                } />
                
                <Route path="/event/:id/ticket" element={
                  <ProtectedRoute>
                    <EventTicket />
                  </ProtectedRoute>
                } />
                
                <Route path="/student/insights" element={
                  <ProtectedRoute>
                    <StudentInsights />
                  </ProtectedRoute>
                } />
                
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <ReportsDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </CollegeProvider>
    </ErrorBoundary>
  );
}

export default App;