import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Admin from './components/Admin/Admin';
import Users from './components/Admin/Users';
import Posts from './components/Admin/Posts';
import Statistics from './components/Admin/Statistics';
import ProfilePage from './components/Profile/Profile';
import Notification from './components/Notification/Notification';
import Message from './components/Message/Message'; 
import MessagesList from './components/Message/MessagesList'; 
import Search from './components/Search/Search';

// Tạo PrivateRoute để bảo vệ các route cần đăng nhập
const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem('user'); // Kiểm tra trong localStorage
    return user ? children : <Navigate to="/login" />; // Nếu chưa có thông tin user, điều hướng tới login
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/posts" element={<Posts />} />
                <Route path="/admin/statistics" element={<Statistics />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/messages" element={<MessagesList />} /> 
                <Route path="/messages/:chatId" element={<Message />} />
                <Route path="/search" element={<Search />} />

                {/* Route Home được bảo vệ, chỉ cho phép truy cập khi đã đăng nhập */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />

                {/* Điều hướng các route không tồn tại về Login */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
