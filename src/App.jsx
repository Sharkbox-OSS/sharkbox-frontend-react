import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './config/oidc';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import { PageSkeleton } from './components/LoadingSkeleton';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const BoxesPage = lazy(() => import('./pages/BoxesPage'));
const BoxPage = lazy(() => import('./pages/BoxPage'));
const ThreadPage = lazy(() => import('./pages/ThreadPage'));
const CreateThreadPage = lazy(() => import('./pages/CreateThreadPage'));
const CreateBoxPage = lazy(() => import('./pages/CreateBoxPage'));
const EditThreadPage = lazy(() => import('./pages/EditThreadPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CallbackPage = lazy(() => import('./pages/CallbackPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Main App Component
 * Sets up routing, authentication, and data fetching
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider {...oidcConfig}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <div className="min-h-screen bg-bg-primary">
                <Navigation />
                <main>
                  <Suspense fallback={<PageSkeleton />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/boxes" element={<BoxesPage />} />
                      <Route path="/b/:slug" element={<BoxPage />} />
                      <Route path="/b/:slug/submit" element={<PrivateRoute><CreateThreadPage /></PrivateRoute>} />
                      <Route path="/box/:slug/thread/:id" element={<ThreadPage />} />
                      <Route path="/box/:slug/thread/:id/edit" element={<PrivateRoute><EditThreadPage /></PrivateRoute>} />
                      <Route path="/thread/:id" element={<ThreadPage />} />
                      <Route path="/thread/:id/edit" element={<PrivateRoute><EditThreadPage /></PrivateRoute>} />
                      <Route path="/u/:username" element={<UserProfilePage />} />
                      <Route path="/create-box" element={<PrivateRoute><CreateBoxPage /></PrivateRoute>} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/callback" element={<CallbackPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </BrowserRouter>
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
