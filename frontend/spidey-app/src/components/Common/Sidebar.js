import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css'; // Import the CSS module

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { to: '/admin/users', label: 'Quản lý User', icon: 'fas fa-users', activeClass: styles.activeGreen, hoverClass: styles.hoverGreen },
        { to: '/admin/posts', label: 'Quản lý Bài Đăng', icon: 'fas fa-file-alt', activeClass: styles.activePurple, hoverClass: styles.hoverPurple },
        { to: '/admin/statistics', label: 'Thống Kê', icon: 'fas fa-chart-bar', activeClass: styles.activeRed, hoverClass: styles.hoverRed },
    ];

    const handleLogout = () => {
        // Perform logout logic here (e.g., clearing tokens, etc.)
        navigate('/login');
    };

    return (
        <aside className={styles.sidebar}>
            <nav>
                <ul>
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                className={`${styles.navLink} ${location.pathname === item.to ? item.activeClass : item.hoverClass}`}
                            >
                                <i className={`${item.icon} mr-2`}></i> {item.label}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={handleLogout}
                            className={`${styles.navLink} ${styles.hoverYellow}`}
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i> Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;