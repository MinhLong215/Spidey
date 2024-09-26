import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MessagesList.css'; // Nếu bạn muốn thêm CSS

const MessagesList = () => {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Để điều hướng

    useEffect(() => {
        // Fetch danh sách tin nhắn từ backend
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:3003/api/messages'); // Thay đổi URL nếu cần
                setMessages(response.data);
            } catch (error) {
                setError('Error fetching messages');
                console.error(error);
            }
        };

        fetchMessages();
    }, []);

    const handleMessageClick = (chatId) => {
        navigate(`/messages/${chatId}`); // Điều hướng đến cuộc trò chuyện cụ thể
    };

    return (
        <div className="messages-list">
            <h2>Danh sách Tin nhắn</h2>
            {error && <p className="error-message">{error}</p>}
            {messages.length > 0 ? (
                <ul>
                    {messages.map(message => (
                        <li key={message._id} onClick={() => handleMessageClick(message.chatId)}>
                            <div className="message-preview">
                                <strong>{message.sender.username}</strong>: {message.content}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No messages available.</p>
            )}
        </div>
    );
};

export default MessagesList;
