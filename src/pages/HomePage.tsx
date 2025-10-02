import React from "react";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="homeLayout">
      <nav className="homeNavBar">
        <div className="homeBrand">
          <LiaShoppingCartSolid size={60} />
          <ul>
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
        <ul className="homeNavList">
          <li>
            <Link className="homeNavButton" to="/home">
              Home
            </Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/categories">
              Categories
            </Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/cart">
              Cart
            </Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/favourites">
              Favourite
            </Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/settings">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      <section className="homeContent">
        <h1>Welcome </h1>
        <h2>Get ready to start shopping!</h2>
      </section>
    </div>
  );
}
