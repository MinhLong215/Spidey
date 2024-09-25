import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import userService from '../../api/userService';
import styles from './Users.module.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // New state for search query

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách người dùng', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await userService.searchUsers(searchQuery);
            setUsers(response);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm người dùng', error);
        }
    };

    const handleAddUser = async () => {
        try {
            const response = await axios.post('/api/users/add', newUser);
            fetchUsers();
            closeModal();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === 'Email or username already exists') {
                setErrorMessage('Email hoặc tên người dùng đã tồn tại');
            } else {
                console.error('Lỗi khi thêm người dùng', error);
            }
        }
    };

    const handleEdit = async (userId) => {
        setIsEditMode(true);
        setCurrentUserId(userId);
        const user = users.find(user => user._id === userId);
        setNewUser({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            password: '',
            role: user.role
        });
        openModal();
    };

    const handleUpdateUser = async () => {
        try {
            const response = await userService.editUser(currentUserId, newUser);
            fetchUsers();
            closeModal();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === 'Email or username already exists') {
                setErrorMessage('Email hoặc tên người dùng đã tồn tại');
            } else {
                console.error('Lỗi khi chỉnh sửa người dùng', error);
            }
        }
    };

    const handleDelete = async (userId) => {
        try {
            await userService.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            console.error('Lỗi khi xóa người dùng', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setNewUser({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            role: 'user'
        });
        setErrorMessage('');
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles['main-content']}>
                <Sidebar className={styles.sidebar} />
                <main className={styles.main} style={{marginLeft: 300, marginTop: 50}}>
                    <h1 className={styles.title}>Quản lý User</h1>
                    <div className={styles['search-container']} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm người dùng"
                            className={styles['search-input']}
                            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px' }}
                        />
                        <button 
                            onClick={handleSearch} 
                            className={styles['search-button']}
                            style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                            Tìm kiếm
                        </button>
                    </div>
                    <button onClick={openModal} className={styles['add-button']}>Thêm người dùng</button>
                    <div className={styles['table-container']}>
                        <table className={styles.table}>
                            <thead className={styles['table-header']}>
                                <tr>
                                    <th className={styles['table-cell']}>Tên</th>
                                    <th className={styles['table-cell']}>Họ</th>
                                    <th className={styles['table-cell']}>Tên người dùng</th>
                                    <th className={styles['table-cell']}>Email</th>
                                    <th className={styles['table-cell']}>Vai trò</th>
                                    <th className={styles['table-cell']}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id} className={styles['table-row']}>
                                        <td className={styles['table-cell']}>{user.firstName}</td>
                                        <td className={styles['table-cell']}>{user.lastName}</td>
                                        <td className={styles['table-cell']}>{user.username}</td>
                                        <td className={styles['table-cell']}>{user.email}</td>
                                        <td className={styles['table-cell']}>{user.role}</td>
                                        <td className={styles['table-cell']}>
                                            <button onClick={() => handleEdit(user._id)} className={styles['edit-button']}>Chỉnh sửa</button>
                                            <button onClick={() => handleDelete(user._id)} className={styles['delete-button']}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
            {isModalOpen && (
                <>
                    <div className={styles.modal}>
                        <div className={styles['modal-content']}>
                            <h2>{isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</h2>
                            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
                            <input
                                type="text"
                                name="firstName"
                                value={newUser.firstName}
                                onChange={handleInputChange}
                                placeholder="Tên"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={newUser.lastName}
                                onChange={handleInputChange}
                                placeholder="Họ"
                            />
                            <input
                                type="text"
                                name="username"
                                value={newUser.username}
                                onChange={handleInputChange}
                                placeholder="Tên người dùng"
                            />
                            <input
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                            />
                            <input
                                type="password"
                                name="password"
                                value={newUser.password}
                                onChange={handleInputChange}
                                placeholder="Mật khẩu"
                            />
                            <select
                                name="role"
                                value={newUser.role}
                                onChange={handleInputChange}
                            >
                                <option value="user">Người dùng</option>
                                <option value="admin">Quản trị viên</option>
                            </select>
                            <button onClick={isEditMode ? handleUpdateUser : handleAddUser}>
                                {isEditMode ? 'Cập nhật' : 'Thêm'}
                            </button>
                            <button onClick={closeModal}>Hủy</button>
                        </div>
                    </div>
                    <div className={styles['modal-overlay']} onClick={closeModal}></div>
                </>
            )}
        </div>
    );
};

export default Users;