import { useMemo } from "react";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { FaListUl, FaTags, FaUserCog, FaShareAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ShoppingListHeroImage from "../assets/shoppingListHeroImage.png";

export default function HomePage() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  }, []);
  const greetingName = currentUser?.fullName || currentUser?.name || "";
  const isAuthed = useMemo(() => localStorage.getItem("auth") === "true", []);
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("currentUser");
    navigate("/login", { replace: true });
  };

  return (
    <div className="homeLayout">
      <nav className="homeNavBar">
        <div className="homeBrand">
          <LiaShoppingCartSolid size={60} />
          <div className="homeBrandText">
            <p className="homeEyebrow">Your shopping hub</p>
            <h2>Everything in one place</h2>
          </div>
        </div>
        <ul className="homeNavList">
          <li>
            <Link className="homeNavButton" to="/home">
              Overview
            </Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/lists">
              Shopping Lists
            </Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/categories">
              Categories
            </Link>
          </li>

          <li>
            <Link className="homeNavButton" to="/profile">
              Profile Settings
            </Link>
          </li>
          {isAuthed && (
            <li>
              <button
                className="homeNavButton"
                onClick={handleLogout}
                aria-label="Log out"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
      <section className="homeContent">
        <div className="homeInner">
          <div className="homeHero">
            <div>
              <p className="homeEyebrow">Welcome back{greetingName ? `, ${greetingName}` : ""}</p>
              <h1>Plan faster, shop calmer.</h1>
              <h2>
                Keep lists, categories, and your profile in sync from one clean dashboard.
              </h2>
            </div>
            <div className="homeHeroMedia">
              <img src={ShoppingListHeroImage} alt="Shopping in store" className="glassHeroImage" />
              <div className="glassHeroOverlay">
                <span className="homeHeroStat">Home focus</span>
                <p>Build the list before you hit the aisle.</p>
              </div>
            </div>
          </div>
          <div className="homeGrid">
            <div className="homeCard">
              <div className="homeCardIcon">
                <FaListUl size={26} />
              </div>
              <h3>Your Lists</h3>
              <p className="muted">Create and track multiple shopping lists.</p>
              <Link className="homeNavButton" to="/lists">
                Open Lists
              </Link>
            </div>
            <div className="homeCard">
              <div className="homeCardIcon">
                <FaTags size={26} />
              </div>
              <h3>Categories</h3>
              <p className="muted">Organise items for quick filtering.</p>
              <Link className="homeNavButton" to="/categories">
                Manage Categories
              </Link>
            </div>
            <div className="homeCard">
              <div className="homeCardIcon">
                <FaUserCog size={26} />
              </div>
              <h3>Profile</h3>
              <p className="muted">Update your details and avatar.</p>
              <Link className="homeNavButton" to="/profile">
                View Profile
              </Link>
            </div>
            <div className="homeCard">
              <div className="homeCardIcon">
                <FaShareAlt size={26} />
              </div>
              <h3>Dashboard</h3>
              <p className="muted">Use the quick links screen for a simpler jump point.</p>
              <Link className="homeNavButton" to="/dashboard">
                Open Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
