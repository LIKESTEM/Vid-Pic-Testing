import axios from "axios";
import React, { useEffect, useState } from "react";

const GoogleLogin = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/user-infor', {withcredentials: true})
        .then(response => {
            setUser(response.data);
        })
        .catch(error => console.error("Axios error:", error));
    }, []);

    return (
        <div>
            <br />
            <br />
            <br />
            <br />
            {user ? (
            <div>
                <p>
                    Name: {user.name}
                </p>

                <p>
                    Email: {user.email}
                </p>
            </div>
            ) : (
                <p>
                    Loading user data...
                </p>
            )}
        </div>
    );
}

export default GoogleLogin;
