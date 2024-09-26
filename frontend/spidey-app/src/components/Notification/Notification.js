// frontend/src/components/Notification/Notification.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notification.css'; // Import CSS

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    return (
        <div className="notifications-container">
            <h2>Notifications</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {notifications.map(notification => (
                        <li key={notification._id} className={notification.opened ? 'opened' : ''}>
                            <p>{notification.userFrom.username} {notification.action} your post!</p>
                            <button onClick={() => markAsOpened(notification._id)}>Mark as opened</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notification;
