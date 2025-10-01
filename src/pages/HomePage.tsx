import React from "react";
import { LiaShoppingCartSolid } from "react-icons/lia";

export default function HomePage() {
  return (
    <div
      style={{
        height: "75vh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <h1>Welcome to the Home Page</h1> */}

      <div className="homeNavBar">
        <LiaShoppingCartSolid size={70} />
        <ul>
          <li>Home</li>
          <li>Categories</li>
          <li>Cart</li>
          <li>Favourite</li>
          <li>Settings</li>
        </ul>{" "}
      </div>
      <div></div>
    </div>
  );
}
