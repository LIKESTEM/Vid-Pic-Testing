import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Ensures authentication cookies are sent
});

// Function to retrieve the token from localStorage
const getToken = () => {
  const token = localStorage.getItem("jwt");  // Retrieve the token
  // console.log("Retrieved Token:", token);
  return token;
};

// Extract `userId` from JWT token
const getUserIdFromToken = (token) => {
  try {
    if (!token) {
      console.error("Token is null or undefined");
      return null;
    }

    const decodedToken = jwtDecode(token);  // Decode the JWT token
    // console.log("Decoded Token:", decodedToken);

    if (!decodedToken.userId) {
      // console.error("User ID not found in token");
      return null;
    }

    // console.log("User Role ----: " + [...decodedToken.role.values()][0].name);

    return decodedToken.userId;
  } catch (error) {
    console.error("Invalid or expired token", error);
    return null;
  }
};

// Fetch all files (No authentication required)
const getFiles = () => api.get("/api/files");

// Upload files (Include Token in Headers)
const createFiles = (formData) => {
  const token = getToken();  // Retrieve token from localStorage

  if (!token) {
    throw new Error("No token found in localStorage.");
  }

  const userId = getUserIdFromToken(token);  // Extract user ID from token

  if (!userId) {
    throw new Error("User ID could not be extracted from token.");
  }

  return api.post(
    "/api/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,  // Send token in headers
        "X-User-Id": userId,  // Pass userId as a custom header
      },
    }
  );
};

export { getFiles, createFiles };
