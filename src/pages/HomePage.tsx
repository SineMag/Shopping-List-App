import React from "react";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="homeLayout">
      <nav className="homeNavBar">
        <div className="homeBrand">
          <LiaShoppingCartSolid size={60} />
        </div>
        <ul className="homeNavList">
          <li>
            <Link className="homeNavButton" to="/home">Home</Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/categories">Categories</Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/cart">Cart</Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/favourites">Favourite</Link>
          </li>
          <li>
            <Link className="homeNavButton" to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
      <section className="homeContent">
        <h2>Welcome back</h2>
        <p>Add items to your shopping list, browse categories, and manage your cart.</p>
      </section>
    </div>
  );
}
