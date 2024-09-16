import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; // Đảm bảo rằng bạn đã tạo file CSS này

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch posts from backend
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3003/api/posts');
                setPosts(response.data);
            } catch (error) {
                setError('Error fetching posts');
                console.error(error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="home-container">
            <h1>Homepage</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="posts-container">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post._id} className="post">
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )}
            </div>
        </div>
    );
};

export default Home;
