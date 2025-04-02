import React, { useState } from "react";
import axios from "axios";

function VerifyMfa() {
  const [username, setUsername] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyMfa = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/verify-mfa", { username, mfaToken });
      setMessage(response.data);
    } catch (error) {
      setMessage("MFA verification failed.");
    }
  };

  return (
    <div className="container mt-5 pt-3">
      <h2 className="text-center mb-4">Verify MFA</h2>
      <div className="border rounded p-4 shadow-sm bg-white">
        <form onSubmit={handleVerifyMfa}>
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
          <button type="submit" className="btn btn-primary w-100">
            Verify MFA
          </button>
        </form>
        {message && <p className="mt-3 text-center">{message}</p>}
      </div>
    </div>
  );
}

export default VerifyMfa;
