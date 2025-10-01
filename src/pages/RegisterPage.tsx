import React from "react";
import RegistrationImage from "../assets/image 17.png";

export default function RegisterPage() {
  return (
    <div className="registerPage">
      <div className="registrationImage">
        <img src={RegistrationImage} alt="Registration" />
      </div>

      <div className="registrationForm">
        <h2>Create your account</h2>
        <form>
          <label>
            Full Name *
            <input type="text" name="fullName" required /> <br />
          </label>
          <label>
            Email *
            <input type="email" name="email" required /> <br />
          </label>
          <label>
            Password *
            <input type="password" name="password" required minLength={6} /> <br />
          </label>
          <label>
            Confirm Password *
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
            />
          </label> <br />
          <button className="registerButton"
            style={{
              backgroundColor: "#FDD048",
              color: "black",
              width: "50%",
              height: "40px",
              boxShadow:"1px 2px 3px 4px rgba(20,20,20,0.4)",
              borderRadius: "15px",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
