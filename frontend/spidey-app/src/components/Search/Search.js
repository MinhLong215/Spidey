import React, { useState } from 'react';
import axios from 'axios';
import './Search.css'; // Nếu bạn muốn thêm CSS

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:3003/api/users/search?query=${query}`);
            setResults(response.data);
            setError(null);
        } catch (error) {
            console.error('Error searching users', error);
            setError('Error searching users');
            setResults([]);
        }
    };

    return (
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
    );
};

export default Search;
