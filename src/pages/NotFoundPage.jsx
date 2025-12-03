import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="container-narrow py-16 text-center">
            <h1 className="text-6xl font-bold text-accent-primary mb-4">404</h1>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Page Not Found</h2>
            <p className="text-text-secondary mb-8">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link
                to="/"
                className="inline-block px-6 py-3 bg-accent-primary text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
