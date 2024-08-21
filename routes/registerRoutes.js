const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const jwt = require('jsonwebtoken');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res) => {
    res.status(200).render("register");
})

router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, username, email, password, passwordConfirm } = req.body;

        if (password !== passwordConfirm) {
            return res.status(400).render('register', { errorMessage: 'Passwords do not match' });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).render('register', { errorMessage: 'Username already exists' });
        }

        // Create and save the new user
        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password
        });
        await user.save();

        // Redirect to login page or home page
        res.redirect('/login');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).render('register', { errorMessage: 'An error occurred during registration' });
    }
});

module.exports = router;