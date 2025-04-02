import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Allows sending cookies
});

// Get user role from JWT
const getUserRole = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.role; // Extract role from token
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }
  return null;
};

// Get Authorization Header
const getAuthHeader = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Register user
const registerUser = (userData) => {
  return api.post("/api/auth/register", userData, { headers: getAuthHeader() });
};

// Login user
const login = async ({ username, password }) => {
  try {
    const res = await api.post("/api/auth/login", { username, password });

    console.log("Login Response:", res.data);

    if (res.data.mfaRequired) {
      return { mfaRequired: true };
    }
    return { mfaRequired: false };
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// Logout
const logout = () => {
  return api.post("/api/auth/logout", {}, { withCredentials: true }).then(() => {
    console.log("Logged out successfully.");
  });
};

// Verify MFA Token
const verifyMfa = ({ username, mfaToken }) => {
  return api.post("/api/auth/verify-mfa", { username, mfaToken }, { withCredentials: true });
};

// Forgot password
const forgotPassword = ({ email }) => {
  return api.post("/api/auth/forgot-password", { email }, { withCredentials: true });
};

// Reset password
const resetPassword = ({ token, newPassword }) => {
  return api.post("/api/auth/reset-password", { token, newPassword }, { withCredentials: true });
};

export {
  registerUser,
  login,
  logout,
  verifyMfa,
  forgotPassword,
  resetPassword,
  getUserRole,
};
