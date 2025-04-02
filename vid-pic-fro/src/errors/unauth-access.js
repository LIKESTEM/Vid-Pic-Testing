import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const UnauthErrorPage = () => {
    const location = useLocation();
    const msg = location.state?.error || "Unknown error";

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title text-center text-danger">Not Authorized to Access Page</h2>
                    <p className="card-text text-center">
                        <strong>Error Message:</strong> {msg}
                    </p>
                    <div className="text-center">
                        <NavLink
                            to="/"
                            className="btn btn-primary"
                        >
                            Click here to go to the home page.
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnauthErrorPage;
