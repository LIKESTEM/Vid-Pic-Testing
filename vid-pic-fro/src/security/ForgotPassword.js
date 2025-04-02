import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
      setMessage(response.data);
    } catch (error) {
      setMessage("Failed to send reset link.");
    }
  };

  return (
    <div className="container mt-5 pt-3">
      <h2 className="text-center mb-4">Forgot Password</h2>
      <div className="border rounded p-4 shadow-sm bg-white">
        <form onSubmit={handleForgotPassword}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-3 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
