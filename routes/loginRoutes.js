const express = require('express');
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const jwt = require('jsonwebtoken');

// // Thiết lập thư mục công khai
// app.use(express.static('public'));

app.set("view engine", "pug");
app.set("views", "views");

router.get("/", (req, res) => {
    res.status(200).render("login");
});

router.post('/', async (req, res) => {
    try {
        const { logUsername, logPassword } = req.body;

        // Tìm người dùng bằng username hoặc email
        const user = await User.findOne({ $or: [{ username: logUsername }, { email: logUsername }] });
        if (!user) {
            return res.status(400).json({ errorMessage: 'Invalid username or password' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(logPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ errorMessage: 'Invalid username or password' });
        }

        // Tạo JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, 'black spider', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true }); // Đặt JWT trong cookie

        // Phản hồi thành công
        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ errorMessage: 'An error occurred during login' });
    }
});

module.exports = router;