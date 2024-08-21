const express = require('express');
const router = express.Router();
const User = require('../schemas/UserSchema');
const middleware = require('../middleware');

router.get("/", middleware.requireAuth, middleware.requireAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve users" });
    }
});

router.delete("/:id", middleware.requireAuth, middleware.requireAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user" });
    }
});

module.exports = router;
