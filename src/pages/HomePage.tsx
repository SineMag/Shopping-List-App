import React, { useMemo } from "react";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { FaListUl, FaTags, FaUserCog, FaShareAlt } from "react-icons/fa";
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
          {!isAuthed && (
            <ul className="homeNavList">
              <li>
                <Link className="homeNavButton" to="/register">Register</Link>
              </li>
              <li>
                <Link className="homeNavButton" to="/login">Login</Link>
              </li>
            </ul>
          )}
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
          {isAuthed && (
            <li>
              <button className="homeNavButton" onClick={handleLogout} aria-label="Log out">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
      <section className="homeContent">
        <div className="homeInner">
          <h1>Welcome{greetingName ? `, ${greetingName}` : ""}</h1>
          <h2>Get ready to start shopping!</h2>
          <div className="homeGrid">
            <div className="homeCard">
              <div className="homeCardIcon"><FaListUl size={26} /></div>
              <h3>Your Lists</h3>
              <p className="muted">Create and track multiple shopping lists.</p>
              <Link className="homeNavButton" to="/lists">Open Lists</Link>
            </div>
            <div className="homeCard">
              <div className="homeCardIcon"><FaTags size={26} /></div>
              <h3>Categories</h3>
              <p className="muted">Organise items for quick filtering.</p>
              <Link className="homeNavButton" to="/categories">Manage Categories</Link>
            </div>
            <div className="homeCard">
              <div className="homeCardIcon"><FaUserCog size={26} /></div>
              <h3>Profile</h3>
              <p className="muted">Update your details and avatar.</p>
              <Link className="homeNavButton" to="/profile">View Profile</Link>
            </div>
            <div className="homeCard">
              <div className="homeCardIcon"><FaShareAlt size={26} /></div>
              <h3>Share</h3>
              <p className="muted">Share lists with friends and family.</p>
              <Link className="homeNavButton" to="/lists">Share a List</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );}
