import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login.js';
import Register from './components/Register/Register.js';
import Home from './components/Home/Home.js';

const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Trang login sẽ là mặc định nếu user chưa đăng nhập */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Chỉ cho phép truy cập Home nếu đã đăng nhập */}
                <Route 
                    path="/" 
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } 
                />
                
                {/* Điều hướng tất cả các đường dẫn không xác định về trang login */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
