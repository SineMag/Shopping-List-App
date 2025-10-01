import React, { useEffect, useState } from "react";
import RegistrationImage from "../assets/image 17.png";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isFading, setIsFading] = useState(false);

  // Auto-hide success message after 2 seconds with fade-out
  useEffect(() => {
    if (!successMsg) return;
    setIsFading(false);
    const fadeTimer = setTimeout(() => setIsFading(true), 1600); // start fade ~0.4s before hide
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
    // Clear field error on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMsg("");
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm your password";
    else if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate async registration
    setTimeout(() => {
      setSubmitting(false);
      setSuccessMsg("Account created successfully!");
      // Here you could dispatch a Redux action or call an API
      // Reset form
      setForm({ fullName: "", email: "", password: "", confirmPassword: "" });
    }, 800);
  };

  return (
    <div className="registerPage">
      <div className="registrationImage">
        <img src={RegistrationImage} alt="Registration" />
      </div>

      <div className="registrationForm">
        <div className="registerCard">
          <h2>Create your account</h2>
          {successMsg && (
            <p className={`successMsg ${isFading ? "fadeOut" : ""}`} role="status">{successMsg}</p>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="formGroup">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
                aria-invalid={errors.fullName ? "true" : undefined}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
              {errors.fullName && (
                <span id="fullName-error" className="error">{errors.fullName}</span>
              )}
            </div>

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
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span id="email-error" className="error">{errors.email}</span>
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
                minLength={6}
                required
                autoComplete="new-password"
                aria-invalid={errors.password ? "true" : undefined}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <span id="password-error" className="error">{errors.password}</span>
              )}
            </div>

            <div className="formGroup">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                minLength={6}
                required
                autoComplete="new-password"
                aria-invalid={errors.confirmPassword ? "true" : undefined}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              {errors.confirmPassword && (
                <span id="confirmPassword-error" className="error">{errors.confirmPassword}</span>
              )}
            </div>

            <button className="registerButton" type="submit" disabled={submitting}>
              {submitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
