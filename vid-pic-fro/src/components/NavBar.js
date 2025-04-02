import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
    const [tokenThere, setTokenThere] = useState(!!localStorage.getItem("jwt"));

    useEffect(() => {
        const handleAuthChange = () => {
            setTokenThere(!!localStorage.getItem("jwt"));
        };

        window.addEventListener("authChange", handleAuthChange);

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

    return (
        <nav className="navbar navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasDarkNavbar"
                    aria-controls="offcanvasDarkNavbar"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="offcanvas offcanvas-end text-bg-dark"
                    tabIndex="-1"
                    id="offcanvasDarkNavbar"
                    aria-labelledby="offcanvasDarkNavbarLabel"
                >
                    <div className="offcanvas-header">
                        <NavLink className="btn" to="/">
                            <h5 className="text-white offcanvas-title" id="offcanvasDarkNavbarLabel">
                                LIKESTEM
                            </h5>
                        </NavLink>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/">
                                    Home
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/upload-files">
                                    Upload Files
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/get-files">
                                    View Files
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                {tokenThere ? (
                    <NavLink
                        className="btn btn-outline-light ms-auto"
                        to="/logout"
                    >
                        Logout
                    </NavLink>
                ) : (
                    <NavLink className="btn btn-outline-light ms-auto" to="/login">
                        Login
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
