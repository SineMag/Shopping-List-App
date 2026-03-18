import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer">
      <p>&copy; 2025 Shopping List App | Sinenhlanhla Magubane</p>
      <span className="footerSeparator">•</span>
      <Link className="footerLink" to="/privacy">
        Privacy Policy
      </Link>
    </div>
  );
}
