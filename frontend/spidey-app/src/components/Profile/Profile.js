import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Profile.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const { username } = useParams(); // Lấy username từ URL

    useEffect(() => {
        // Gọi API để lấy thông tin user
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3003/api/users/${username}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUserData();
    }, [username]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={user.coverPhoto || '/images/defaultCover.jpg'} alt="Cover" className="cover-photo" />
                <img src={user.profilePic || '/images/defaultProfile.png'} alt="Profile" className="profile-pic" />
                <div className="profile-info">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <span>@{user.username}</span>
                </div>
            </div>
            <div className="profile-details">
                <div className="followers-info">
                    <span>{user.following.length} Following</span>
                    <span>{user.followers.length} Followers</span>
                </div>
                {/* Nút theo dõi */}
                <div className="action-buttons">
                    {/* Kiểm tra xem người dùng đã theo dõi chưa */}
                    <button className={`followButton ${user.isFollowing ? 'following' : ''}`}>
                        {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
