import React from "react";
import { Link } from "react-router-dom";
import { LiaShoppingCartSolid } from "react-icons/lia";

export default function Dashboard() {
  return (
    <div className="dashboardLayout" style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
      <LiaShoppingCartSolid size={70} color="#7ea974" />
      <h1 style={{ color: "#7ea974", margin: "1rem 0" }}>Dashboard</h1>
      <div style={{
        background: "#fff",
        color: "#222",
        borderRadius: "18px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        padding: "2rem",
        minWidth: "320px",
        maxWidth: "420px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
          Quick links to manage your shopping experience:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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