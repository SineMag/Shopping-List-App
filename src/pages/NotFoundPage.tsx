import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="notFoundPage">
      <h1>404 - Page Not Found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <p>
        <Link className="ctaPrimary" to="/">Back to Landing</Link>
      </p>
    </div>
  );
}
