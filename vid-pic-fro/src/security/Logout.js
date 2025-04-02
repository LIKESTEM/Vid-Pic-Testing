import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // If the user is not logged in, redirect to login page
        if (!localStorage.getItem("jwt")) {
            console.log("User is not logged in.");
            navigate("/login"); // Redirect to login page if not logged in
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/logout', { withCredentials: true });
            setMessage(response.data); // Will show "Logout successful!"
            localStorage.removeItem("jwt"); // Clear the JWT from localStorage
            navigate("/login"); // Redirect to login after logout
        } catch (error) {
            console.error('Error logging out', error);
            setMessage('Logout failed. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title text-center">Logout</h2>
                    <p className="card-text text-center">
                        Are you sure you want to logout?
                    </p>
                    <div className="text-center">
                        <button 
                            onClick={handleLogout} 
                            className="btn btn-danger"
                        >
                            Logout
                        </button>
                    </div>
                    {message && (
                        <div className="alert alert-info mt-3 text-center" role="alert">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Logout;
