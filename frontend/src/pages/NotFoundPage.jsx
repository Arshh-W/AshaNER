import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="center-page">
            <div className="login-card">
                <h1>Page not found</h1>

                <p>
                    The page you're looking for doesn't exist.
                </p>

                <Link
                    className="large-btn green"
                    to="/"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}