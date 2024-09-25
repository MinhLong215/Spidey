import React from 'react';
import styles from './Header.module.css'; // Import the CSS module

const Header = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {
        firstName: "John",
        lastName: "Doe",
        avatar: "https://via.placeholder.com/40"
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img src="https://via.placeholder.com/50" alt="Logo" className={styles.logo} />
                <h1 className={styles.title}>Admin Dashboard</h1>
            </div>
            <div className={styles.userInfo}>
                <img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="User Avatar" className={styles.avatar} />
                <span className={styles.userName}>{user.firstName} {user.lastName}</span>
            </div>
        </header>
    );
};

export default Header;