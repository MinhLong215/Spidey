// src/components/Home/Home.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBell, faEnvelope, faUser, faSignOutAlt, faThumbtack, faTrash, faRetweet, faHeart, faComment, faSpider } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Use navigate hook for programmatic navigation

    useEffect(() => {
        // Fetch posts from backend
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3003/api/posts');
                setPosts(response.data);
            } catch (error) {
                setError('Error fetching posts');
                console.error(error);
            }
        };

        fetchPosts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi localStorage
        navigate('/login'); // Điều hướng đến trang đăng nhập
    };

    return (
        <div className="home-wrapper">
            {/* Sidebar */}
            <div className="sidebar">
                <ul className="nav-icons">
                    <li><FontAwesomeIcon icon={faSpider} /></li>
                    <li><FontAwesomeIcon icon={faHome} /></li>
                    <li><FontAwesomeIcon icon={faSearch} /></li>
                    <li><FontAwesomeIcon icon={faBell} /><span className="notification-count">6</span></li>
                    <li><FontAwesomeIcon icon={faEnvelope} /><span className="message-count">3</span></li>
                    <li><FontAwesomeIcon icon={faUser} /></li>
                    <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /></li> {/* Nút đăng xuất */}
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Post Input Box */}
                <div className="post-input-box">
                    <div className="user-avatar">
                        {/* Assuming a default avatar if no posts */}
                        <img src={posts.length > 0 && posts[0].user ? posts[0].user.profilePic : 'path_to_default_avatar'} alt="User Avatar" />
                    </div>
                    <input type="text" placeholder="What's happening?" />
                    <button className="post-button">Post</button>
                </div>

                {/* Display Posts */}
                <div className="posts-container">
                    {error && <p className="error-message">{error}</p>}
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} className="post">
                                <div className="post-header">
                                    <div className="user-info">
                                        {/* Ensure user data exists */}
                                        <img src={post.user ? post.user.profilePic : 'path_to_default_avatar'} alt="User Avatar" className="post-avatar" />
                                        <div>
                                            <span className="user-name">{post.user ? post.user.name : 'Unknown User'}</span>
                                            <span className="user-handle">@{post.user ? post.user.username : 'unknown'}</span>
                                            <span className="post-time">16 hours ago</span>
                                        </div>
                                    </div>
                                    <div className="post-actions">
                                        <FontAwesomeIcon icon={faThumbtack} />
                                        <FontAwesomeIcon icon={faTrash} />
                                    </div>
                                </div>
                                <div className="post-content">
                                    <p>{post.content}</p>
                                    {post.image && <img src={post.image} alt="Post Image" className="post-image" />}
                                </div>
                                <div className="post-footer">
                                    <FontAwesomeIcon icon={faComment} />
                                    <FontAwesomeIcon icon={faRetweet} />
                                    <FontAwesomeIcon icon={faHeart} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No posts available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;