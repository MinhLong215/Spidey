const express = require('express');
const router = express.Router();

router.post("/", (req, res) => {
    // Xóa JWT từ client-side
    localStorage.removeItem('token'); // hoặc sessionStorage.removeItem('token');
    res.status(200).json({ message: "Logout successful. Please remove the token from client-side storage." });
});

module.exports = router;
