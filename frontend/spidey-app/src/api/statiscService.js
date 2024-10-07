import axios from 'axios';

const API_URL = 'https://spidey-1xra.onrender.com/api';

// Hàm lấy thống kê người dùng theo ngày
export const getUserStats = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/users/stats/users`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};

// Hàm lấy thống kê bài viết theo ngày
export const getPostStats = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/posts/stats/posts`, {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching post stats:', error);
        throw error;
    }
};