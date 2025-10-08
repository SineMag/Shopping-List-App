import React from "react";
import { Link } from "react-router-dom";
import { LiaShoppingCartSolid } from "react-icons/lia";

export default function Dashboard() {
  return (
    <div className="dashboardLayout pageSection centered">
      <LiaShoppingCartSolid size={70} />
      <h1 className="sectionTitle">Dashboard</h1>
      <div className="card padded" style={{ maxWidth: 480 }}>
        <p className="muted" style={{ fontSize: "1.05rem", marginBottom: "1rem" }}>
          Quick links to manage your shopping experience:
        </p>
        <div className="column" style={{ gap: "1rem" }}>
          <Link className="homeNavButton" to="/profile">Profile</Link>
          <Link className="homeNavButton" to="/categories">Categories</Link>
          <Link className="homeNavButton" to="/cart">Cart</Link>
          <Link className="homeNavButton" to="/favourites">Favourites</Link>
          <Link className="homeNavButton" to="/settings">Settings</Link>
        </div>
      </div>
    </div>
  );
}