import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook điều hướng

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://spidey-1xra.onrender.com/api/users/login', {
                username,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                const userRole = response.data.user.role;
                if (userRole === 'admin') {
                    navigate('/admin/users'); 
                } else {
                    navigate('/'); 
                }
            }
        } catch (error) {
            setErrorMessage('Invalid credentials'); 
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Need an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;