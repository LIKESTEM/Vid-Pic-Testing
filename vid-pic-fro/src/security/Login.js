import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [message, setMessage] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const navigate = useNavigate();

  // Function to check if JWT token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > exp; // Check if token is expired
    } catch (error) {
      return true; // Treat invalid token as expired
    }
  };

  // Check token on mount
  // Redirect to "/" if JWT token exists in local storage
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("jwt"); // Remove expired token
        navigate("/login"); // Redirect to login
      } else {
        navigate("/"); // Redirect to home
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      if (response.data === "MFA_REQUIRED") {
        setMfaRequired(true);
        setMessage("MFA required. Please check your email.");
      } else {
        // console.log("Storing token:", response.data.token);
        localStorage.setItem("jwt", response.data.token); // Store JWT token
        navigate("/");
      }
    } catch (error) {
      setMessage("Login failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const handleMfaVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/verify-mfa", {
        username,
        mfaToken,
      });

      // console.log("Storing token:", response.data.token);
      localStorage.setItem("jwt", response.data.token); // Store JWT token
      navigate("/");
    } catch (error) {
      setMessage("MFA verification failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="container mt-5 pt-3">
      <h2 className="text-center mb-4">Login</h2>
      <div className="border rounded p-4 shadow-sm bg-white">
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100 mb-2">
            Login
          </button>
          <div className="d-flex justify-content-between">
            <NavLink
              to="/forgot-password"
              className="text-decoration-none text-primary"
            >
              Forgot Password?
            </NavLink>

            <NavLink
              to="/register"
              className="text-decoration-none text-primary"
            >
              Signup
            </NavLink>
          </div>
          
        </form>

        {mfaRequired && (
          <div className="mt-4">
            <h3 className="text-center">MFA Verification</h3>
            <form onSubmit={handleMfaVerification}>
              <div className="mb-3">
                <label htmlFor="mfaToken" className="form-label">
                  MFA Token
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mfaToken"
                  placeholder="Enter MFA token"
                  value={mfaToken}
                  onChange={(e) => setMfaToken(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Verify MFA
              </button>
            </form>
          </div>
        )}
        {message && <p className="mt-3 text-center">{message}</p>}

        <GoogleLoginButton />
      </div>
    </div>
  );
}

export default Login;
