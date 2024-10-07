import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBell, faEnvelope, faUser, faSignOutAlt, faThumbtack, faTrash, faRetweet, faHeart, faComment, faSpider } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); // Lấy user từ localStorage
    const [newPostContent, setNewPostContent] = useState(''); // Trạng thái cho nội dung bài viết mới
    const navigate = useNavigate(); // Use navigate hook for programmatic navigation

    useEffect(() => {
        // Fetch posts from backend
        const fetchPosts = async () => {
            try {
                const response = await axios.get('https://spidey-1xra.onrender.com/api/posts');
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
            const response = await axios.put(`https://spidey-1xra.onrender.com/api/posts/${postId}/like`);
            // Cập nhật lại danh sách bài viết
            setPosts(posts.map(post => post._id === postId ? response.data : post));
        } catch (error) {
            console.error("Error liking post", error);
        }
    };

    const handleRetweet = async (postId) => {
        try {
            const response = await axios.post(`https://spidey-1xra.onrender.com/api/posts/${postId}/retweet`);
            // Thêm bài viết retweet vào danh sách
            setPosts([response.data, ...posts]);
        } catch (error) {
            console.error("Error retweeting post", error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`https://spidey-1xra.onrender.com/api/posts/${postId}`);
            // Loại bỏ bài viết đã xóa khỏi danh sách
            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.error("Error deleting post", error);
        }
    };

    const handlePin = async (postId) => {
        try {
            const response = await axios.put(`https://spidey-1xra.onrender.com/api/posts/${postId}/pin`);
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

    const goToProfile = () => {
        if (user && user.username) {
            navigate(`/profile/${user.username}`);
        } else {
            alert("User not logged in!");
        }
    };

    // Thêm hàm điều hướng đến trang notifications
    const goToNotifications = () => {
        navigate('/notifications'); // Điều hướng đến trang notifications
    };

    // Thêm hàm điều hướng đến trang messages
    const goToMessages = () => {
        navigate('/messages'); // Điều hướng đến trang messages
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return; // Không gửi bài viết rỗng

        try {
            const response = await axios.post('https://spidey-1xra.onrender.com/api/posts', {
                content: newPostContent,
                images: [] // Thêm hình ảnh nếu cần
            });
            setPosts([response.data, ...posts]); // Thêm bài viết mới vào đầu danh sách
            setNewPostContent(''); // Xóa nội dung bài viết mới
        } catch (error) {
            console.error("Error creating post", error);
        }
    };

    return (
        <div className="home-wrapper">
            {/* Sidebar */}
            <div className="sidebar">
                <ul className="nav-icons">
                    <li><FontAwesomeIcon icon={faSpider} /></li>
                    <li><FontAwesomeIcon icon={faHome} /></li>
                    <li onClick={() => navigate('/search')}><FontAwesomeIcon icon={faSearch} /></li>
                    <li onClick={goToNotifications}><FontAwesomeIcon icon={faBell} /><span className="notification-count">6</span></li>
                    <li onClick={goToMessages}><FontAwesomeIcon icon={faEnvelope} /><span className="message-count">3</span></li>
                    <li onClick={goToProfile}><FontAwesomeIcon icon={faUser} /></li>
                    <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /></li>
                </ul>
            </div>
    
            {/* Main Content */}
            <div className="main-content">
                <div className="post-input-box">
                    <div className="user-avatar">
                        <img src={user && user.profilePic ? user.profilePic : 'path_to_default_avatar'} alt="User Avatar" />
                    </div>
                    <form onSubmit={handlePostSubmit}>
                        <input 
                            type="text" 
                            placeholder="What's happening?" 
                            value={newPostContent} 
                            onChange={(e) => setNewPostContent(e.target.value)} 
                        />
                        <button className="post-button" type="submit">Post</button>
                    </form>
                </div>
    
                <div className="posts-container">
                    {error && <p className="error-message">{error}</p>}
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div key={post._id} className="post">
                                <div className="post-header">
                                    <div className="user-info">
                                        <img src={post.user ? post.user.profilePic : 'path_to_default_avatar'} alt="User Avatar" className="post-avatar" />
                                        <div>
                                            <span className="user-name">{post.user && post.user.name ? post.user.name : 'Unknown User'}</span>
                                            <span className="user-handle">@{post.user && post.user.username ? post.user.username : 'unknown'}</span>
                                            <span className="post-time">16 hours ago</span>
                                        </div>
                                    </div>
                                    <div className="post-actions">
                                        <FontAwesomeIcon icon={faThumbtack} onClick={() => handlePin(post._id)} />
                                        <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(post._id)} />
                                    </div>
                                </div>
                                <div className="post-content">
                                    <p>{post.content ? post.content : 'No content available'}</p>
                                    {post.images && post.images.map((image, idx) => (
                                        <img key={idx} src={image} alt="Post Image" className="post-image" />
                                    ))}
                                    {post.replyTo && post.replyTo.content && (
                                        <div className="reply-to">
                                            <p><strong>Replying to:</strong> {post.replyTo.content}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="post-footer">
                                    <FontAwesomeIcon icon={faComment} onClick={() => handleComment(post._id)} />
                                    <FontAwesomeIcon icon={faRetweet} onClick={() => handleRetweet(post._id)} />
                                    <FontAwesomeIcon icon={faHeart} onClick={() => handleLike(post._id)} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No posts available</p>
                    )}
                </div>
            </div>
    
            {/* Right Sidebar */}
            <div className="right-sidebar">
                <h3>Right Sidebar</h3>
                <ul>
                    <li>Trending Topics</li>
                    <li>Suggested Users</li>
                    <li>Other Info</li>
                </ul>
            </div>
        </div>
    );    
};

export default Home;
