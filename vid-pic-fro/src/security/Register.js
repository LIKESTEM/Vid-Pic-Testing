import React, { useState } from "react";
import { registerUser } from "../services/securityService"; // Import the API functions
import { NavLink } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("Customer");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser({ username, password, email, contactNumber, role });
      setMessage("User registered successfully!");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data || "Registration failed.");
      } else {
        setMessage("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5 pt-3">
      <h2 className="text-center mb-4">Register</h2>
      <div className="border rounded p-4 shadow-sm bg-white">
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">
              Contact Number
            </label>
            <input
              type="text"
              className="form-control"
              id="contactNumber"
              placeholder="Enter contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              className="form-select"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="Financial_Officer">Financial Officer</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>

          <NavLink
              to="/login"
              className="text-decoration-none text-primary pt-4"
            >
              Click here to <strong>Login</strong> if you have an account already
            </NavLink>
        </form>

        {message && <p className="mt-3 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default Register;