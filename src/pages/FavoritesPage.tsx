import { Link } from "react-router-dom";
import { FaHeart, FaListUl, FaTags, FaUser } from "react-icons/fa6";

export default function FavoritesPage() {
  return (
    <section className="favoritesPage pageSection">
      <div className="favoritesHero">
        <div>
          <p className="homeEyebrow">Favorites</p>
          <h1 className="sectionTitle">Your quickest shortcuts.</h1>
          <p className="muted">
            This screen keeps your most-used spaces one click away while the app grows.
          </p>
        </div>
        <div className="favoritesBadge">
          <FaHeart />
          <span>Ready for saved items next</span>
        </div>
      </div>

      <div className="favoritesGrid">
        <Link className="favoritesCard" to="/lists">
          <div className="favoritesIcon">
            <FaListUl />
          </div>
          <h3>Shopping Lists</h3>
          <p>Jump straight into your list collection.</p>
        </Link>
        <Link className="favoritesCard" to="/categories">
          <div className="favoritesIcon">
            <FaTags />
          </div>
          <h3>Categories</h3>
          <p>Filter items faster by heading to your categories.</p>
        </Link>
        <Link className="favoritesCard" to="/profile">
          <div className="favoritesIcon">
            <FaUser />
          </div>
          <h3>Profile</h3>
          <p>Update your account details and avatar.</p>
        </Link>
      </div>
    </section>
  );
}
