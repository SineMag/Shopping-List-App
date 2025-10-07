import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <p>
        <Link className="listsNavItem" to="/home">Go to Home</Link>
      </p>
    </div>
  );
}
