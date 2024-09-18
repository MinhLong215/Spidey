import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';

// Tạo PrivateRoute để bảo vệ các route cần đăng nhập
const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem('user'); // Kiểm tra trong localStorage
    return user ? children : <Navigate to="/login" />; // Nếu chưa có thông tin user, điều hướng tới login
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Route cho trang Login */}
                <Route path="/login" element={<Login />} />
                
                {/* Route cho trang Register */}
                <Route path="/register" element={<Register />} />

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
