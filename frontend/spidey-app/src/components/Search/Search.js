import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpider, faHome, faSearch, faBell, faEnvelope, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); // Lấy user từ localStorage
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`https://spidey-1xra.onrender.com/api/users/search?query=${query}`);
            setResults(response.data);
            setError(null);
        } catch (error) {
            console.error('Error searching users', error);
            setError('Error searching users');
            setResults([]);
        }
    };

    // Các hàm điều hướng
    const goToHome = () => navigate('/');
    const goToSearch = () => navigate('/search');
    const goToMessages = () => navigate('/messages');
    const goToNotifications = () => navigate('/notifications');
    const goToProfile = () => navigate(`/profile/${user.username}`);
    const handleLogout = () => {
        // Xử lý logout
        navigate('/login');
    };

    return (
        <div className="search-page-wrapper">
            {/* Sidebar */}
            <div className="sidebar">
                <ul className="nav-icons">
                    <li onClick={goToHome}><FontAwesomeIcon icon={faHome} /></li>
                    <li onClick={goToSearch}><FontAwesomeIcon icon={faSearch} /></li>
                    <li onClick={goToNotifications}><FontAwesomeIcon icon={faBell} /><span className="notification-count">6</span></li>
                    <li onClick={goToMessages}><FontAwesomeIcon icon={faEnvelope} /><span className="message-count">3</span></li>
                    <li onClick={goToProfile}><FontAwesomeIcon icon={faUser} /></li>
                    <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /></li>
                </ul>
            </div>

            {/* Nội dung tìm kiếm */}
            <div className="search-wrapper">
                <h2>Search Users</h2>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by name, username or email"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                {results.length > 0 ? (
                    <ul>
                        {results.map(user => (
                            <li key={user._id}>
                                <strong>{user.firstName} {user.lastName}</strong> - @{user.username}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;