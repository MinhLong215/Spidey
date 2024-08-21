const jwt = require('jsonwebtoken');
const User = require('./schemas/UserSchema');

exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, 'black spider');
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.redirect('/login');
    }
};


exports.requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};
