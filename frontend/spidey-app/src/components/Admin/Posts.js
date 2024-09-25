import React, { useState, useEffect } from 'react';
import postService from '../../api/postService';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import styles from './Posts.module.css';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
        content: '',
        images: []
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await postService.getPosts();
            setPosts(response);
        } catch (error) {
            console.error('Error fetching posts', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'images') {
            setNewPost({ ...newPost, images: files });
        } else {
            setNewPost({ ...newPost, [name]: value });
        }
    };

    const handleAddPost = async () => {
        try {
            const formData = new FormData();
            formData.append('content', newPost.content);
            for (let i = 0; i < newPost.images.length; i++) {
                formData.append('images', newPost.images[i]);
            }
            const response = await postService.createPost(formData);
            fetchPosts();
            closeModal();
        } catch (error) {
            console.error('Error adding post', error);
        }
    };

    const handleEdit = async (postId) => {
        setIsEditMode(true);
        setCurrentPostId(postId);
        const post = posts.find(post => post._id === postId);
        setNewPost({
            content: post.content,
            images: post.images
        });
        openModal();
    };

    const handleUpdatePost = async () => {
        try {
            const formData = new FormData();
            formData.append('content', newPost.content);
            for (let i = 0; i < newPost.images.length; i++) {
                formData.append('images', newPost.images[i]);
            }
            const response = await postService.updatePost(currentPostId, formData);
            fetchPosts();
            closeModal();
        } catch (error) {
            console.error('Error updating post', error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await postService.deletePost(postId);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await postService.getPosts({ search: searchQuery });
            setPosts(response);
        } catch (error) {
            console.error('Error searching posts', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setNewPost({
            content: '',
            images: []
        });
        setErrorMessage('');
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles['main-content']}>
                <Sidebar className={styles.sidebar} />
                <main className={styles.main} style={{ marginLeft: 300, marginTop: 50 }}>
                    <h1 className={styles.title}>Quản lý Bài viết</h1>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                marginRight: '10px',
                                flex: '1'
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Tìm kiếm
                        </button>
                    </div>
                    <button onClick={openModal} className={styles['add-button']}>Thêm bài viết</button>
                    <div className={styles['table-container']}>
                        <table className={styles.table}>
                            <thead className={styles['table-header']}>
                                <tr>
                                    <th className={styles['table-cell']}>Nội dung</th>
                                    <th className={styles['table-cell']}>Hình ảnh</th>
                                    <th className={styles['table-cell']}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post._id} className={styles['table-row']}>
                                        <td className={styles['table-cell']}>{post.content}</td>
                                        <td className={styles['table-cell']}>
                                            {post.images.map((image, index) => (
                                                <img key={index} src={image} alt="Post" className={styles['post-image']} />
                                            ))}
                                        </td>
                                        <td className={styles['table-cell']}>
                                            <button onClick={() => handleEdit(post._id)} className={styles['edit-button']}>Chỉnh sửa</button>
                                            <button onClick={() => handleDelete(post._id)} className={styles['delete-button']}>Xóa</button>
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
                            <h2>{isEditMode ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}</h2>
                            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
                            <textarea
                                name="content"
                                value={newPost.content}
                                onChange={handleInputChange}
                                placeholder="Nội dung"
                                className={styles['textarea']}
                                rows="5"
                                cols="50"
                            />
                            <div className={styles['file-input-container']}>
                                <label className={styles['file-input-label']} htmlFor="file-input">Chọn hình ảnh</label>
                                <input
                                    type="file"
                                    id="file-input"
                                    name="images"
                                    multiple
                                    className={styles['file-input']}
                                    onChange={handleInputChange}
                                />
                                <span className={styles['file-input-text']}>
                                    {newPost.images.length > 0 ? `${newPost.images.length} hình ảnh đã chọn` : 'Không có hình ảnh nào được chọn'}
                                </span>
                            </div>
                            <button onClick={isEditMode ? handleUpdatePost : handleAddPost}>
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

export default Posts;