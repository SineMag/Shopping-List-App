import React, { useMemo } from "react";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";

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
          <ul style={{listStyleType:'none'}}>
            <li>
              <Link className="homeNavButton" to="/register">
                Register
              </Link>
              <br />
            </li>
            <li>
              <Link className="homeNavButton" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </div>
        <ul className="homeNavList" >
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
            <Link className="homeNavButton" to="/favourites">
              Favourite
            </Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/settings">
              Profile Settings
            </Link>
          </li>
          <br />
          <li>
            <button className="homeNavButton" onClick={handleLogout} aria-label="Log out">
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <section className="homeContent">
        <h1>Welcome{greetingName ? `, ${greetingName}` : ""}</h1>
        <h2>Get ready to start shopping!</h2>
      </section>
    </div>
  );
}
