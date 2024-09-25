import React, { useEffect, useState } from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import { getUserStats, getPostStats } from '../../api/statiscService';
import styles from './Statistics.module.css';

const Statistics = () => {
    const [userStats, setUserStats] = useState([]);
    const [postStats, setPostStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const today = new Date();
                const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0];
                const endDate = startDate;

                const [userStatsData, postStatsData] = await Promise.all([
                    getUserStats(startDate, endDate),
                    getPostStats(startDate, endDate)
                ]);

                console.log(userStatsData, postStatsData)

                setUserStats(userStatsData);
                setPostStats(postStatsData);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <div className="flex flex-1 pt-16">
                <Sidebar />
                <main className={styles.mainContent}>
                    <h1 className={styles.header}>Thống Kê</h1>
                    <div>
                        <h2 className={styles.sectionHeader}>Thống Kê Người Dùng</h2>
                        {userStats.length > 0 ? (
                            <ul>
                                {userStats.map(stat => (
                                    <li key={stat._id} className={styles.listItem}>
                                        Ngày: {stat._id}, Số Lượng: {stat.count}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.loadingText}>Đang tải thống kê người dùng...</p>
                        )}
                    </div>
                    <div>
                        <h2 className={styles.sectionHeader}>Thống Kê Bài Viết</h2>
                        {postStats.length > 0 ? (
                            <ul>
                                {postStats.map(stat => (
                                    <li key={stat._id} className={styles.listItem}>
                                        Ngày: {stat._id}, Số Lượng: {stat.count}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.loadingText}>Đang tải thống kê bài viết...</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Statistics;