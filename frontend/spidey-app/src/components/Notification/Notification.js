// frontend/src/components/Notification/Notification.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBell, faEnvelope, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Notification.css'; // Import CSS

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); // Lấy user từ localStorage
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/notifications');
            setNotifications(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsOpened = async (id) => {
        try {
            await axios.put(`/api/notifications/${id}/markAsOpened`);
            setNotifications(notifications.map(notification => 
                notification._id === id ? { ...notification, opened: true } : notification
            ));
        } catch (err) {
            console.error(err);
            setError('Failed to mark notification as opened');
        }
    };

    // Các hàm điều hướng
    const goToHome = () => navigate('/');
    const goToSearch = () => navigate('/search');
    const goToMessages = () => navigate('/messages');
    const goToProfile = () => navigate(`/profile/${user.username}`);
    const handleLogout = () => {
        // Xử lý logout
        navigate('/login');
    };

    return (
        <div className="notifications-container">
            {/* Sidebar */}
            <div className="sidebar">
                <ul className="nav-icons">
                    <li onClick={goToHome}><FontAwesomeIcon icon={faHome} /></li>
                    <li onClick={goToSearch}><FontAwesomeIcon icon={faSearch} /></li>
                    <li onClick={() => navigate('/notifications')}><FontAwesomeIcon icon={faBell} /><span className="notification-count">6</span></li>
                    <li onClick={goToMessages}><FontAwesomeIcon icon={faEnvelope} /><span className="message-count">3</span></li>
                    <li onClick={goToProfile}><FontAwesomeIcon icon={faUser} /></li>
                    <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /></li>
                </ul>
            </div>

            {/* Nội dung thông báo */}
            <div className="notification-content">
                <h2>Notifications</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p> // Hiển thị thông báo lỗi
                ) : (
                    <ul className="notification-list">
                        {notifications.length > 0 ? notifications.map(notification => (
                            <li key={notification._id} className={`notification-item ${notification.opened ? 'opened' : ''}`}>
                                <p>
                                    <strong>{notification.userFrom?.username || 'Unknown User'}</strong> {notification.action} your post!
                                </p>
                                <button className="mark-opened" onClick={() => markAsOpened(notification._id)}>Mark as opened</button>
                            </li>
                        )) : (
                            <li><p>No notifications available.</p></li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notification;