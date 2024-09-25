import axios from 'axios';

const API_URL = '/api/posts';

const getPosts = async (queryParams) => {
    const response = await axios.get(API_URL, { params: queryParams });
    return response.data;
};

const getPostById = async (postId) => {
    const response = await axios.get(`${API_URL}/${postId}`);
    return response.data;
};

const createPost = async (postData) => {
    const response = await axios.post(API_URL, postData);
    return response.data;
};

const likePost = async (postId) => {
    const response = await axios.put(`${API_URL}/${postId}/like`);
    return response.data;
};

const retweetPost = async (postId) => {
    const response = await axios.post(`${API_URL}/${postId}/retweet`);
    return response.data;
};

const deletePost = async (postId) => {
    const response = await axios.delete(`${API_URL}/${postId}`);
    return response.data;
};

const updatePost = async (postId, postData) => {
    const response = await axios.put(`${API_URL}/${postId}`, postData);
    return response.data;
};

const postService = {
    getPosts,
    getPostById,
    createPost,
    likePost,
    retweetPost,
    deletePost,
    updatePost
};

export default postService;