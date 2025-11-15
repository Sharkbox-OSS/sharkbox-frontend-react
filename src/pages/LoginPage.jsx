import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

/**
 * LoginPage Component
 * Handles OIDC login redirect
 */
const LoginPage = () => {
  const { isAuthenticated, isLoading, login } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login();
    }
  }, [isLoading, isAuthenticated, login]);

  if (isLoading) {
    return (
      <div className="container-content">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container-content">
      <div className="text-center py-12">
        <h1 className="text-text-primary mb-4 text-xl">Redirecting to login...</h1>
      </div>
    </div>
  );
};

export default LoginPage;
