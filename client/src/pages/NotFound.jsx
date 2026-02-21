import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="not-found-page">
            <div>
                <div className="not-found-code">404</div>
                <h2>Page Not Found</h2>
                <p>The page you are looking for does not exist or has been moved.</p>
                <Link to="/" className="btn btn-primary">
                    <Home size={16} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
