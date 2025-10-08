import React, { useEffect, useState } from "react";
import bcrypt from "bcryptjs";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  // Fade-out success message (same pattern as RegisterPage)
  useEffect(() => {
    if (!successMsg) return;
    setIsFading(false);
    const fadeTimer = setTimeout(() => setIsFading(true), 1600);
    const clearTimer = setTimeout(() => {
      setSuccessMsg("");
      setIsFading(false);
    }, 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(clearTimer);
    };
  }, [successMsg]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
    setSuccessMsg("");
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Lookup user by email
      const res = await fetch(
        `http://localhost:3001/users?email=${encodeURIComponent(form.email)}`
      );
      if (!res.ok) throw new Error("Lookup failed");
      const users = await res.json();
      if (!Array.isArray(users) || users.length === 0) {
        throw new Error("INVALID_CREDENTIALS");
      }
      const user = users[0];
      const ok = await bcrypt.compare(form.password, user.passwordHash || "");
      if (!ok) throw new Error("INVALID_CREDENTIALS");

      setErrors((prev) => ({ ...prev, submit: "" }));
      setSuccessMsg("Logged in successfully!");
      setForm((prev) => ({ ...prev, password: "" }));
      // Persist auth and user, then navigate
      localStorage.setItem("auth", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ id: user.id, fullName: user.fullName, surname: user.surname, cell: user.cell, email: user.email })
      );
      setTimeout(() => navigate("/home", { replace: true }), 300);
    } catch (err: any) {
      if (err.message === "INVALID_CREDENTIALS") {
        setErrors((prev) => ({ ...prev, submit: "Invalid email or password" }));
      } else {
        setErrors((prev) => ({ ...prev, submit: "Login failed. Is json-server running on port 3001?" }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginArrow">
        <Link to="/home">
          <IoArrowBackCircleSharp size={40} />
        </Link>
      </div>

      <div className="loginCard">
        {successMsg && (
          <p
            className={`successMsg ${isFading ? "fadeOut" : ""}`}
            role="status"
          >
            {successMsg}
          </p>
        )}
        {errors.submit && (
          <p className="error" role="alert">
            {errors.submit}
          </p>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="formGroup">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
            {errors.email && (
              <span id="login-email-error" className="error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="formGroup">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
            />
            {errors.password && (
              <span id="login-password-error" className="error">
                {errors.password}
              </span>
            )}
          </div>

          <button className="loginButton" type="submit" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </button>
          <Link to="/register" className="goToRegister">
            Don't have an account? Register
          </Link>
        </form>
      </div>
    </div>
  );
}
