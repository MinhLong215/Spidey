import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBell, faEnvelope, faUser, faSignOutAlt, faThumbtack, faTrash, faRetweet, faHeart, faComment, faSpider } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); // Lấy user từ localStorage
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

    const handleLike = async (postId) => {
        try {
            const response = await axios.put(`http://localhost:3003/api/posts/${postId}/like`);
            // Cập nhật lại danh sách bài viết
            setPosts(posts.map(post => post._id === postId ? response.data : post));
        } catch (error) {
            console.error("Error liking post", error);
        }
    };

    const handleRetweet = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:3003/api/posts/${postId}/retweet`);
            // Cập nhật lại danh sách bài viết
            setPosts(posts.map(post => post._id === postId ? response.data : post));
        } catch (error) {
            console.error("Error retweeting post", error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:3003/api/posts/${postId}`);
            // Loại bỏ bài viết đã xóa khỏi danh sách
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const handlePin = async (postId) => {
        try {
            const response = await axios.put(`http://localhost:3003/api/posts/${postId}/pin`);
            // Cập nhật lại danh sách bài viết
            setPosts(posts.map(post => post._id === postId ? response.data : post));
        } catch (error) {
            console.error("Error pinning post", error);
        }
    };

    const handleComment = (postId) => {
        // Điều hướng đến trang chi tiết bài viết để thêm bình luận
        navigate(`/posts/${postId}`);
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
                        <img src={user && user.profilePic ? user.profilePic : 'path_to_default_avatar'} alt="User Avatar" />
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
                                            {/* Nếu không có tên user thì sử dụng fallback "Unknown User" */}
                                            <span className="user-name">{post.user && post.user.name ? post.user.name : 'Unknown User'}</span>
                                            <span className="user-handle">@{post.user && post.user.username ? post.user.username : 'unknown'}</span>
                                            <span className="post-time">16 hours ago</span>
                                        </div>
                                    </div>
                                    <div className="post-actions">
                                        <FontAwesomeIcon icon={faThumbtack} onClick={() => handlePin(post._id)} /> {/* Pin */}
                                        <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(post._id)} /> {/* Xóa bài viết */}
                                    </div>
                                </div>
                                <div className="post-content">
                                    <p>{post.content ? post.content : 'No content available'}</p>
                                    {post.images && post.images.map((image, idx) => (
                                        <img key={idx} src={image} alt="Post Image" className="post-image" />
                                    ))}

                                    {/* Hiển thị bài viết trả lời nếu có */}
                                    {post.replyTo && post.replyTo.content && (
                                        <div className="reply-to">
                                            <p><strong>Replying to:</strong> {post.replyTo.content}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="post-footer">
                                    <FontAwesomeIcon icon={faComment} onClick={() => handleComment(post._id)} /> {/* Comment */}
                                    <FontAwesomeIcon icon={faRetweet} onClick={() => handleRetweet(post._id)} /> {/* Retweet */}
                                    <FontAwesomeIcon icon={faHeart} onClick={() => handleLike(post._id)} /> {/* Like */}
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