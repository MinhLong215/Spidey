import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Message.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Message = () => {
    const { chatId } = useParams(); // Lấy chatId từ URL
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        // Fetch messages when component mounts
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:3003/api/messages/${chatId}`);
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages", error);
            }
        };

        fetchMessages();
    }, [chatId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!content) return;

        try {
            const response = await axios.post('http://localhost:3003/api/messages', {
                content,
                chatId,
            });
            setMessages([...messages, response.data]); // Thêm message mới vào danh sách
            setContent(''); // Xóa nội dung input
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <div className="message-wrapper">
            <h2>Chat Messages</h2>
            <div className="messages-container">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div key={message._id} className="message">
                            <span className="message-sender">{message.sender.username}: </span>
                            <span className="message-content">{message.content}</span>
                        </div>
                    ))
                ) : (
                    <p>No messages available</p>
                )}
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
                <input 
                    type="text" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Type your message..." 
                />
                <button type="submit"><FontAwesomeIcon icon={faPaperPlane} /></button>
            </form>
        </div>
    );
};

export default Message;
