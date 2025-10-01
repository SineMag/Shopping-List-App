
import React from 'react'

export default function RegisterPage() {
  return (
    <div>
      <h2>Create your account</h2>
      <form>
        <label>
          Full Name:
          <input type="text" name="fullName" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required minLength={6} />
        </label>
        <label>
          Confirm Password:
          <input type="password" name="confirmPassword" required minLength={6} />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
