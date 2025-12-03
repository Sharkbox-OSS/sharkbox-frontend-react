import { Link, useNavigate } from 'react-router-dom';
import logoUrl from '../assets/sharkbox.svg';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Navigation Component
 * Modern, responsive navigation bar with auth controls
 */
const Navigation = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = () => {
    login(window.location.href);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg-secondary border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-accent-primary hover:opacity-90 transition-opacity no-underline" aria-label="Sharkbox home">
            <img src={logoUrl} alt="Sharkbox logo" className="w-7 h-7" />
            <h1 className="text-xl font-bold m-0">Sharkbox</h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-6 flex-1">
            <Link
              to="/"
              className="text-text-primary font-medium hover:text-accent-primary transition-colors text-sm no-underline"
            >
              Home
            </Link>
            <Link
              to="/boxes"
              className="text-text-primary font-medium hover:text-accent-primary transition-colors text-sm no-underline"
            >
              Boxes
            </Link>
            {isAuthenticated && (
              <Link
                to="/create-box"
                className="text-text-primary font-medium hover:text-accent-primary transition-colors text-sm no-underline"
              >
                Create Box
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-bg-tertiary transition-colors text-lg"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link to={`/u/${user?.profile?.preferred_username}`} className="text-text-secondary text-sm hover:text-accent-primary transition-colors no-underline">
                  {user?.profile?.name || user?.profile?.preferred_username || 'User'}
                </Link>
                <button onClick={handleLogout} className="btn-link text-sm py-1.5 px-3">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={handleLogin} className="btn-primary text-sm py-1.5 px-4">
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
