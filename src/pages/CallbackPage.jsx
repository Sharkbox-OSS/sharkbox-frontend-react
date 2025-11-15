import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * CallbackPage Component
 * Handles OIDC callback after authentication
 */
const CallbackPage = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        const returnTo = user?.state?.returnTo;
        navigate(returnTo && typeof returnTo === 'string' ? returnTo : '/', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="container-content">
      <div className="text-center py-12">
        <div className="text-text-primary text-lg">Completing login...</div>
      </div>
    </div>
  );
};

export default CallbackPage;
