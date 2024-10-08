const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Notification = require('../../schemas/NotificationSchema');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { error } = require('console');
const { userInfo } = require('os');

app.use(bodyParser.urlencoded({ extended: false }));

// Đăng ký người dùng
router.post('/register', async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body; // Thêm role
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        req.session.user = newUser; // Lưu thông tin người dùng vào session
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Đăng nhập người dùng
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        req.session.user = user; // Lưu thông tin người dùng vào session
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

router.get("/", async (req, res, next) => {
    var searchObj = req.query;

    if(req.query.search !== undefined){
        searchObj = {
            $or: [
                { firstName: { $regex: req.query.search, $options: "i" }},
                { lastName: { $regex: req.query.search, $options: "i" }},
                { userName: { $regex: req.query.search, $options: "i" }},
            ]
        }
    }

    User.find(searchObj)
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
});

router.put("/:userId/follow", async (req, res, next) => {

    var userId = req.params.userId;

    var user = await User.findById(userId);

    if (user == null) return res.sendStatus(404);

    var isFollowing = user.followers && user.followers.includes(req.session.user._id);
    var option = isFollowing ? "$pull" : "$addToSet";

    req.session.user = await User.findByIdAndUpdate(req.session.user._id, { [option]: { following: userId } }, {new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    User.findByIdAndUpdate(userId, { [option]: { followers: req.session.user._id } })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    if(!isFollowing){
        await Notification.insertNotification(userId, req.session.user._id, "follow", req.session.user._id);
    }
    
    res.status(200).send(req.session.user);

})

router.get("/:userId/following", async (req, res, next) => {
    User.findById(req.params.userId)
    .populate("following")
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
});

router.get("/:userId/followers", async (req, res, next) => {
    User.findById(req.params.userId)
    .populate("followers")
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
});

router.post("/profilePicture", upload.single("croppedImage"), async (req, res, next) => {
    if(!req.file){
        console.log("No file uploaded with ajax request!");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error => {
        if(error != null) {
            console.log(error);
            return res.sendStatus(400);
        }

        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { profilePic: filePath }, { new: true });
        res.sendStatus(204);
    })

});

router.post("/coverPhoto", upload.single("croppedImage"), async (req, res, next) => {
    if(!req.file){
        console.log("No file uploaded with ajax request!");
        return res.sendStatus(400);
    }

    var filePath = `/uploads/images/${req.file.filename}.png`;
    var tempPath = req.file.path;
    var targetPath = path.join(__dirname, `../../${filePath}`);

    fs.rename(tempPath, targetPath, async error => {
        if(error != null) {
            console.log(error);
            return res.sendStatus(400);
        }

        req.session.user = await User.findByIdAndUpdate(req.session.user._id, { coverPhoto: filePath }, { new: true });
        res.sendStatus(204);
    })

});

// Thêm người dùng
router.post('/add', async (req, res) => {
    const { firstName, lastName, username, email, password, role } = req.body; // Thêm role
    try {
        if (!firstName || !lastName || !username || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            role 
        });
        await newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
});

// Sửa người dùng
router.put('/edit/:userId', async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, username, email, password, role } = req.body; // Thêm role
    try {
        if (!firstName || !lastName || !username || !email || !role) {
            return res.status(400).json({ message: 'All fields except password are required' });
        }

        // Check if email or username already exists for other users
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }],
            _id: { $ne: userId }
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists' });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updatedData = {
            firstName,
            lastName,
            username,
            email,
            role, 
            ...(hashedPassword && { password: hashedPassword })
        };
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

// Xóa người dùng
router.delete('/delete/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

// Tìm kiếm người dùng
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const searchResults = await User.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(searchResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching users' });
    }
});

// Thống kê người dùng theo ngày
router.get('/stats/users', async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const users = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user stats' });
    }
});

router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).populate('following').populate('followers');
        if (!user) {
            return res.sendStatus(404);
        }
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

module.exports = router;