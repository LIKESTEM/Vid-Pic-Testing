import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwt", token); // Store JWT token
      navigate("/"); // Redirect to dashboard
    } else {
      navigate("/login"); // Redirect to login if token is missing
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default OAuthSuccess;
