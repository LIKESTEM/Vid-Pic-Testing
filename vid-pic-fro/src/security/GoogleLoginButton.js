import React from "react";

const GoogleLoginButton = () => {

  const handleLogin = () => {
    // window.location.href = "http://localhost:8080/login/oauth2/code/google";
    window.location.href = "http://localhost:8080";
  };

  return (
    <button onClick={handleLogin} className="btn btn-primary mt-4">
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
