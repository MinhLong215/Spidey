import axios from 'axios';

const API_URL = '/api/users';

const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

const addUser = async (userData) => {
    const response = await axios.post(`${API_URL}/add`, userData);
    return response.data;
};

const editUser = async (userId, userData) => {
    const response = await axios.put(`${API_URL}/edit/${userId}`, userData);
    return response.data;
};

const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/delete/${userId}`);
    return response.data;
};

const searchUsers = async (query) => {
    const response = await axios.get(`${API_URL}/search`, { params: { query } });
    return response.data;
};

const followUser = async (userId) => {
    const response = await axios.put(`${API_URL}/${userId}/follow`);
    return response.data;
};

const getUserWithFollowing = async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}/following`);
    return response.data;
};

const getUserWithFollowers = async (userId) => {
    const response = await axios.get(`${API_URL}/${userId}/followers`);
    return response.data;
};

const userService = {
    registerUser,
    loginUser,
    addUser,
    editUser,
    deleteUser,
    searchUsers,
    followUser,
    getUserWithFollowing,
    getUserWithFollowers
};

export default userService;