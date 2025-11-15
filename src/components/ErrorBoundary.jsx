import { Component } from 'react';

/**
 * ErrorBoundary Component
 * Catches React errors in child components and displays a modern fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center min-h-[60vh] p-8">
          <div className="text-center max-w-md">
            <h2 className="text-accent-primary mb-4 text-2xl font-bold">Something went wrong</h2>
            <p className="text-text-primary mb-8">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="btn-primary"
            >
              Go to Home
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left bg-bg-secondary border border-border rounded-lg p-4">
                <summary className="text-text-secondary cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-accent-primary text-sm overflow-x-auto m-0">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
