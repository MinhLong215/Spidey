// src/api/api.js

import userService from './userService';

export const fetchNotifications = async () => {
    const response = await fetch('/api/notifications');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export {
    userService
};
