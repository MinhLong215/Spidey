import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBell, faEnvelope, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { username } = useParams(); // Lấy username từ URL
    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API để lấy thông tin user
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3003/api/users/${username}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
                setError('Error fetching user data'); // Cập nhật lỗi nếu có
            } finally {
                setLoading(false); // Đánh dấu kết thúc quá trình tải
            }
        };

        fetchUserData();
    }, [username]);

    // Xử lý theo dõi và bỏ theo dõi
    const handleFollowToggle = async () => {
        try {
            const response = await axios.put(`http://localhost:3003/api/users/${username}/follow`);
            setUser(prevUser => ({
                ...prevUser,
                isFollowing: !prevUser.isFollowing // Đảo ngược trạng thái theo dõi
            }));
        } catch (error) {
            console.error('Error toggling follow', error);
            setError('Failed to toggle follow status'); // Hiển thị lỗi nếu không thể theo dõi
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Hiển thị loading trong quá trình tải
    }

    if (error) {
        return <div className="error-message">{error}</div>; // Hiển thị thông báo lỗi nếu có
    }

    // Các hàm điều hướng
    const goToNotifications = () => navigate('/notifications');
    const goToMessages = () => navigate('/messages');
    const goToProfile = () => navigate(`/profile/${user.username}`);
    const handleLogout = () => {
        // Xử lý logout
        navigate('/login');
    };

    return (
        <div className="profile-page">
            {/* Sidebar */}
            <div className="sidebar">
                <ul className="nav-icons">
                    <li onClick={() => navigate('/')}><FontAwesomeIcon icon={faHome} /></li>
                    <li onClick={() => navigate('/search')}><FontAwesomeIcon icon={faSearch} /></li>
                    <li onClick={goToNotifications}><FontAwesomeIcon icon={faBell} /><span className="notification-count">6</span></li>
                    <li onClick={goToMessages}><FontAwesomeIcon icon={faEnvelope} /><span className="message-count">3</span></li>
                    <li onClick={goToProfile}><FontAwesomeIcon icon={faUser} /></li>
                    <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /></li>
                </ul>
            </div>

            <div className="profile-header">
                <img src={user.coverPhoto || '/images/defaultCover.jpg'} alt="Cover" className="cover-photo" />
                <img src={user.profilePic || '/images/defaultProfile.png'} alt="Profile" className="profile-pic" />
                <div className="profile-info">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <span>@{user.username}</span>
                </div>
            </div>
            <div className="profile-details">
                <div className="followers-info">
                    <span>{user.following.length} Following</span>
                    <span>{user.followers.length} Followers</span>
                </div>
                {/* Nút theo dõi */}
                <div className="action-buttons">
                    <button className={`followButton ${user.isFollowing ? 'following' : ''}`} onClick={handleFollowToggle}>
                        {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
