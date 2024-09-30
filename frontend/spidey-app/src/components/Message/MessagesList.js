import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faBell, faEnvelope, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './MessagesList.css';

const MessagesList = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); // Lấy user từ localStorage
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Giả sử bạn có chatId cụ thể để lấy tin nhắn
                const chatId = '66f38a05c8ecae07b6e632d8'; // thay thế bằng chatId thực tế
                const response = await axios.get(`http://localhost:3003/api/messages/${chatId}`);
                setMessages(response.data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Error fetching messages');
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchMessages();
    }, []);

    const handleMessageClick = (chatId) => {
        if (chatId) {
            navigate(`/messages/${chatId}`);
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
        <div className="messages-list-wrapper">
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

            {/* Danh sách tin nhắn */}
            <div className="messages-list">
                <h2>Messages</h2>
                {loading ? (
                    <p>Loading messages...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : messages.length > 0 ? (
                    <ul>
                        {messages.map(message => (
                            <li key={message._id} onClick={() => handleMessageClick(message.chat._id)}>
                                <div className="message-preview">
                                    {/* Hiển thị người gửi */}
                                    <strong>{message.sender.username}</strong>: 
                                    {/* Hiển thị tên chat */}
                                    <span> in {message.chat.name}</span>
                                    {/* Hiển thị nội dung tin nhắn */}
                                    <p>{message.content}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No messages available.</p>
                )}
            </div>
        </div>
    );
};

export default MessagesList;